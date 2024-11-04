from flask import Flask, request, jsonify, session
import os
from ibm_watsonx_ai.foundation_models import Model
from ibm_watsonx_ai.client import APIClient
from sentence_transformers import SentenceTransformer
import gzip
import json
import chromadb
import random
import string

app = Flask(__name__)
app.secret_key = '22'  # Replace with a more secure key

# Function to retrieve credentials
def get_credentials():
    return {
        "url": "https://eu-de.ml.cloud.ibm.com",
        "apikey": "3Ls5_sdF4uZz00i6ZdHGZB1YBxRDfVgcUgkq11tZvjlB"
    }

# Get project_id and space_id from environment variables
project_id = "da2e1438-1e80-4b85-9c22-7565678d1498"
space_id = os.getenv("SPACE_ID")

# Initialize Watson API client
wml_credentials = get_credentials()
client = APIClient(wml_credentials=wml_credentials)
client.set.default_project(project_id)

# Initialize the sentence transformer model
emb = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

# Your vector index id and hydration of ChromaDB...
vector_index_id = "3c606a27-142c-4b67-8bbd-73501ee27d02"
vector_index_details = client.data_assets.get_details(vector_index_id)
vector_index_properties = vector_index_details["entity"]["vector_index"]

# Initialize the LLM model (Allam)
model_id = "sdaia/allam-1-13b-instruct"

parameters = {
    "decoding_method": "greedy",
    "max_new_tokens": 900,
    "repetition_penalty": 1
}

model = Model(
    model_id=model_id,
    params=parameters,
    credentials=get_credentials(),
    project_id=project_id,
    space_id=space_id 
)

# Hydrate ChromaDB with your knowledge base vectors
def hydrate_chromadb():
    data = client.data_assets.get_content(vector_index_id)
    content = gzip.decompress(data)
    stringified_vectors = str(content, "utf-8")
    vectors = json.loads(stringified_vectors)

    chroma_client = chromadb.Client()

    collection_name = "my_collection"
    try:
        collection = chroma_client.delete_collection(name=collection_name)
    except:
        print("Collection didn't exist - nothing to do.")
    collection = chroma_client.create_collection(name=collection_name)

    vector_embeddings = []
    vector_documents = []
    vector_metadatas = []
    vector_ids = []

    for vector in vectors:
        vector_embeddings.append(vector["embedding"])
        vector_documents.append(vector["content"])
        metadata = vector["metadata"]
        lines = metadata["loc"]["lines"]
        clean_metadata = {}
        clean_metadata["asset_id"] = metadata["asset_id"]
        clean_metadata["asset_name"] = metadata["asset_name"]
        clean_metadata["url"] = metadata["url"]
        clean_metadata["from"] = lines["from"]
        clean_metadata["to"] = lines["to"]
        vector_metadatas.append(clean_metadata)
        asset_id = vector["metadata"]["asset_id"]
        random_string = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
        id = "{}:{}-{}-{}".format(asset_id, lines["from"], lines["to"], random_string)
        vector_ids.append(id)

    collection.add(
        embeddings=vector_embeddings,
        documents=vector_documents,
        metadatas=vector_metadatas,
        ids=vector_ids
    )
    return collection

chroma_collection = hydrate_chromadb()

# Function to perform proximity search using the question
def proximity_search(question, chroma_collection):
    # Encode the question to get its embedding
    query_vectors = emb.encode([question])  # Get embeddings as a NumPy array
    query_vectors = query_vectors.tolist()

    # Perform the query in ChromaDB using the generated embedding
    query_result = chroma_collection.query(
        query_embeddings=query_vectors,
        n_results=vector_index_properties["settings"]["top_k"],
        include=["documents", "metadatas", "distances"]
    )

    # Reverse and return the documents from the query results
    documents = list(reversed(query_result["documents"][0]))

    return "\n".join(documents)





# function for building the prompt based on the history of the conversation
def build_conversation_history(ROLE_INSTRUCTION, history, new_question, proximity_context):
    conversation = f"<s> [INST] {ROLE_INSTRUCTION} [/INST]\n"    
    if proximity_context:
        conversation += f"{proximity_context}\n"   
    for turn in history:
        conversation += f"<s> [INST] {turn['question']} [/INST]\n{turn['response']}\n"
    conversation += f"<s> [INST] {new_question} [/INST]"   
    return conversation



def chat(query, MAX_HISTORY_TURNS, ROLE_INSTRUCTION):
    conversation_history = session.get("conversation_history", [])
    proximity_context = proximity_search(query, chroma_collection)
    prompt = build_conversation_history(ROLE_INSTRUCTION, conversation_history, query,proximity_context)
    generated_response = model.generate_text(prompt=prompt)
    conversation_history.append({
            "question": query,
            "response": generated_response
        })
    if len(conversation_history) > MAX_HISTORY_TURNS:
            conversation_history = conversation_history[- MAX_HISTORY_TURNS:]
    session["conversation_history"] = conversation_history    
    return generated_response
 
def getQuestion(level,topic): 
    if not level: 
        level = "beginner"
    proximity_context = proximity_search(topic, chroma_collection)
    role_instruction = '''You are an AI model that generate a quesiton for kids about foundation of arabic language to examine thier level of understanding
    - the questions should be in arabic and easy to understand
    - all the questions should be MCQ questions with four choices each 
    - the correct answer should be the first one
    - you are given a context about the topic to help you generate the questions
    - you are also given the shild's level to generate questions based on his level
    - you must write the question in arabic inside JSON object with the following format:
    - the question should be releavent to the topic
    Example of beginner level question:
    {"question" : "ما هي الفاكهة بين الخيارات التالية؟","answers" : ["التفاح","الكرسي","الكتاب","الهاتف"]}
    note that the first answer is the correct one
    Example of expert level question:
    {"question" : "كيف تكتب كلمة الهمزة في كلمة أزهار؟","answers" : ["على الألف","على السطر","على الياء","على الواو"]}
    
    
    '''
    
    prompt = f'''
    [INST] {role_instruction} [/INST]
    '''
    prompt += f"Context: {proximity_context}\n"
    prompt += f"Level: {level}\n"
    prompt += f"Topic: {topic}\n"
    generated_response = model.generate_text(prompt=prompt)
    return generated_response
 
 
 
########################################################################################
@app.route('/ask', methods=['POST'])
def chatQuestion():
    data = request.json
    question = data.get("question", "")
    
    if not question:
        return jsonify({"error": "No question provided"}), 400
    try:
        # prompt for the virtual assistant
        virtualAssistantPrompt = '''🌟 **السياق**: يتمثل دورك في إنشاء تعليمات لنموذج ذكاء اصطناعي يُساعد المستخدمين بإجابات واضحة وسهلة الفهم باللغة العربية. يجب أن تكون الردود **عريضة جداً** للتأكيد، وأن تكون منسقة وجذابة بصرياً باستخدام الإيموجي وتنسيق النص لتمييز المعلومات المهمة.
        **الهدف**: الهدف هو ضمان أن يُقدم النموذج إجابات جذابة، واضحة، ومنظمة. التركيز يكون على البساطة وتعزيز الوضوح عبر إبراز النقاط الرئيسية بـ**نص عريض جداً** وإضافة إيموجي لإضفاء طابع ودود.
        **الأسلوب**: يجب أن يكون الرد بسيطاً باللغة العربية، مع استخدام **نص عريض جداً** أو نص أكبر لتأكيد النقاط المهمة. تقسيم الإجابة إلى فقرات قصيرة أو نقاط لتعزيز قابلية القراءة. يجب استخدام الإيموجي بشكل يضفي طابعاً دافئاً وشخصية للرد دون مبالغة.
        **النبرة**: النبرة يجب أن تكون ود-friendly، مساعدة، ومهنية، مع أسلوب سهل الوصول إليه. يجب أن تشجع المستخدمين على التفاعل مع المعلومات المقدمة.
        **الجمهور المستهدف**: يستهدف المتحدثين باللغة العربية الذين يفضلون إجابات موجزة، منسقة بشكل جيد، وجذابة بصرياً، مثل الطلاب، المهنيين، أو المستخدمين العاديين الذين يبحثون عن المساعدة في موضوعات مختلفة.
        **إرشادات الرد**:
        - استخدم **نصاً عريضاً جداً** للتأكيد.
        - استخدم الإيموجي لإضفاء الدفء (مثل 😊👍).
        - قم بتنظيم المعلومات في فقرات قصيرة أو نقاط مرقمة لسهولة القراءة.
        - حافظ على نبرة واضحة، مباشرة، وسهلة الفهم.
        '''
        Max_History_Turns = 4
        generated_response = chat(question, Max_History_Turns, virtualAssistantPrompt)
        
        return jsonify({"AI": generated_response})
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500
    


@app.route('/spelling-correction', methods=['Post'])
def spell_check():
    print("spell check")
    data = request.json
    question = data.get("question", "")
    if not question:
        return jsonify({"error": "No question provided"}), 400
    try:
        # prompt for spellchecker
        spellingPrmoptRule = '''
        you are a spell checker, you should be given a text in arabic and return the correct spelling of it, 
        if the text is spelled correctly you should praise the user and if not you should correct the spelling and give an explaination of the mistake done by the user
        '''
        MAX_HISTORY_TURNS = 3
        response = chat(question, MAX_HISTORY_TURNS, spellingPrmoptRule)
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500
    return jsonify({"AI": response})



@app.route('/start-exam', methods=['POST'])
def startExam():
    data = request.json
    level = data.get("level", "")
    topic = data.get("topic", "")
    topic = "الهمزة"
    response  = getQuestion(level,topic)
    return jsonify({"AI": response})


@app.route('/Exam', methods=['POST'])
def generateExam():
    
    return jsonify({"AI": "generated_response"})

########################################################################################


@app.route('/reset', methods=['POST'])
def reset_conversation():
    session["conversation_history"] = []
    return jsonify({"message": "Conversation history reset successfully."})


if __name__ == '__main__':
    app.run(debug=True, port=5000)
