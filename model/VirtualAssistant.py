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
def proximity_search(question):
    # Encode the question to get its embedding
    query_vectors = emb.encode([question])  # Get embeddings as a NumPy array
    
    # Convert the NumPy array to a list
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

# Define the role instruction (this can be part of the prompt in each interaction)
ROLE_INSTRUCTION = '''🌟 **السياق**: يتمثل دورك في إنشاء تعليمات لنموذج ذكاء اصطناعي يُساعد المستخدمين بإجابات واضحة وسهلة الفهم باللغة العربية. يجب أن تكون الردود **عريضة جداً** للتأكيد، وأن تكون منسقة وجذابة بصرياً باستخدام الإيموجي وتنسيق النص لتمييز المعلومات المهمة.

**الهدف**: الهدف هو ضمان أن يُقدم النموذج إجابات جذابة، واضحة، ومنظمة. التركيز يكون على البساطة وتعزيز الوضوح عبر إبراز النقاط الرئيسية بـ**نص عريض جداً** وإضافة إيموجي لإضفاء طابع ودود.

**الأسلوب**: يجب أن يكون الرد بسيطاً باللغة العربية، مع استخدام **نص عريض جداً** أو نص أكبر لتأكيد النقاط المهمة. تقسيم الإجابة إلى فقرات قصيرة أو نقاط لتعزيز قابلية القراءة. يجب استخدام الإيموجي بشكل يضفي طابعاً دافئاً وشخصية للرد دون مبالغة.

**النبرة**: النبرة يجب أن تكون ود-friendly، مساعدة، ومهنية، مع أسلوب سهل الوصول إليه. يجب أن تشجع المستخدمين على التفاعل مع المعلومات المقدمة.

**الجمهور المستهدف**: يستهدف المتحدثين باللغة العربية الذين يفضلون إجابات موجزة، منسقة بشكل جيد، وجذابة بصرياً، مثل الطلاب، المهنيين، أو المستخدمين العاديين الذين يبحثون عن المساعدة في موضوعات مختلفة.

**إرشادات الرد**:
- استخدم **نصاً عريضاً جداً** للتأكيد.
- استخدم الإيموجي لإضفاء الدفء (مثل 😊👍).
- قم بتنظيم المعلومات في فقرات قصيرة أو نقاط مرقمة لسهولة القراءة.
- حافظ على نبرة واضحة، مباشرة، وسهلة الفهم.'''




def build_conversation_history(history, new_question, proximity_context):
    # Start the conversation with the role definition
    conversation = f"<s> [INST] {ROLE_INSTRUCTION} [/INST]\n"
    
    # Add the proximity context from the knowledge base at the top
    if proximity_context:
        conversation += f"{proximity_context}\n"
    
    # Append previous conversation turns (limit to recent ones)
    for turn in history:
        conversation += f"<s> [INST] {turn['question']} [/INST]\n{turn['response']}\n"
    
    # Add the new question at the end
    conversation += f"<s> [INST] {new_question} [/INST]"
    
    return conversation




MAX_HISTORY_TURNS = 3  # Only store the last 3 turns

@app.route('/ask', methods=['POST'])
def ask_question():
    data = request.json
    question = data.get("question", "")
    
    if not question:
        return jsonify({"error": "No question provided"}), 400

    # Initialize or retrieve conversation history
    conversation_history = session.get("conversation_history", [])

    try:
        # Perform proximity search or context retrieval
        proximity_context = proximity_search(question)
        print(proximity_context)
        # Build the conversation history with the new question
        prompt = build_conversation_history(conversation_history, question, proximity_context)
        
        # Generate the response from the model
        generated_response = model.generate_text(prompt=prompt)
        
        # Append the new turn (question and response)
        conversation_history.append({
            "question": question,
            "response": generated_response
        })

        # Keep only the last MAX_HISTORY_TURNS turns
        if len(conversation_history) > MAX_HISTORY_TURNS:
            conversation_history = conversation_history[-MAX_HISTORY_TURNS:]

        # Save the updated conversation history
        session["conversation_history"] = conversation_history
        
        return jsonify({"AI": generated_response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/reset', methods=['POST'])
def reset_conversation():
    # Clear the conversation history from the session
    session["conversation_history"] = []
    return jsonify({"message": "Conversation history reset successfully."})

# New GET route that returns "Hello, World!"
@app.route('/hello', methods=['GET'])
def hello_world():
    return jsonify({"message": "Hello, World!"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
