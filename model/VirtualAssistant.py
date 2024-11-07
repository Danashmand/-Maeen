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
app.secret_key = '1422'

# Function to retrieve credentials
def get_credentials():
    return {
        "url": "https://eu-de.ml.cloud.ibm.com",
        "apikey": "3Ls5_sdF4uZz00i6ZdHGZB1YBxRDfVgcUgkq11tZvjlB"
    }

# Get project_id and space_id from environment variables
project_id = "da2e1438-1e80-4b85-9c22-7565678d1498"
space_id = os.getenv("SPACE_ID")
# topics: writing, reading, grammar
# Initialize Watson API client
wml_credentials = get_credentials()
client = APIClient(wml_credentials=wml_credentials)
client.set.default_project(project_id)

# Initialize the sentence transformer model
emb = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

# Initialize the LLM model (Allam)
model_id = "sdaia/allam-1-13b-instruct"

parameters = {
    "decoding_method": "greedy",
    "min_new_tokens": 10,
    "max_new_tokens": 100,
    "repetition_penalty": 1,
    "temperature": 2,
    "top_p": 1.0,
    "top_k": 90,
    "random_seed": random.randint(1, 12451)
}

model = Model(
    model_id=model_id,
    params=parameters,
    credentials=get_credentials(),
    project_id=project_id,
    space_id=space_id
)



# Define task-specific configuration for collections and data sources
task_config = {
    "spelling_check": {
        "collection_name": "spelling_check_collection",
        "vector_index_id": "3c606a27-142c-4b67-8bbd-73501ee27d02",
        "top_k": 5
    },
    "question_generation": {
        "collection_name": "question_generation_collection",
        "vector_index_id": "3c606a27-142c-4b67-8bbd-73501ee27d02",
        "top_k": 10
    },
    "chat": {
        "collection_name": "chat_collection",
        "vector_index_id": "3c606a27-142c-4b67-8bbd-73501ee27d02",
        "top_k": 3
    }
}

base_prompts = {
    "spelling_check": 
        '''You are a dedicated spell checker, assisting a young Arabic learner with spelling corrections only. Follow these rules strictly to ensure consistency:

Instructions
Primary Task: Your sole responsibility is to review the text provided by the child for spelling errors and correct them if present. Avoid any responses unrelated to spelling.

Praise for Error-Free Sentences: If the child’s sentence contains no spelling mistakes, praise their effort.

Error Correction with Explanation:

If you find a spelling error, correct it and clearly explain the reason behind the mistake.
Provide guidance on how to avoid similar errors in the future. Use a formal tone that is child-friendly.
No Additional Responses: Do not respond to any non-spell-checking questions. If the user asks an unrelated question, reply with:
"أهلا، ماهي الجملة التي تريد مني تصحيحها😉🔎"
Then, wait for the child to provide a new sentence for spelling review.

Clarification: If any part of these instructions is unclear, ask a specific question. If everything is understood, type only "فهمت" on the screen without any additional text.

Focus on Spell-Checking Only: Do not engage in discussions or respond to any other topic under any circumstances.

Reminder: After providing your spell-checking feedback, end your response there without further commentary.

Example Interaction:

Child’s Input: "أريد أن أذهب إلى المدرسه."
Your Response: "أحسنت! لا توجد أخطاء إملائية في جملتك." (if correct)
OR
"الكلمة الصحيحة هي 'المدرسة'. يجب أن تحتوي على تاء مربوطة في النهاية. تذكر دائماً استخدام التاء المربوطة في الكلمات التي تعني مكاناً، مثل مدرسة."
Note: Keep your responses precise and focused only on spelling, ensuring the child receives clear, accurate feedback.''',
    
    "question_generation": "You are an AI model that generates a multiple-choice question for children learning Arabic.",
    
    "chat": '''You are a friendly AI that answers questions in Arabic with emoji to add warmth to the conversation.
    make sure to make your answers short and simple give examples'''
}

# Function to hydrate ChromaDB
def hydrate_chromadb(task):
    config = task_config.get(task)
    if not config:
        raise ValueError(f"Task '{task}' is not configured.")
    
    
    chroma_client = chromadb.Client()
    
    collection_name = config["collection_name"]
    vector_index_id = config["vector_index_id"]

    # Try to retrieve the collection, or create it if it doesn't exist
    try:
        collection = chroma_client.get_collection(name=collection_name)
        return collection
    except Exception:
        print(f"Collection '{collection_name}' not found. Hydrating ChromaDB...")

    # Fetch and decompress task-specific vector data
    data = client.data_assets.get_content(vector_index_id)
    content = gzip.decompress(data)
    vectors = json.loads(content.decode("utf-8"))

    # Create and hydrate the collection
    collection = chroma_client.create_collection(name=collection_name)
    vector_embeddings, vector_documents, vector_metadatas, vector_ids = [], [], [], []

    for vector in vectors:
        vector_embeddings.append(vector["embedding"])
        vector_documents.append(vector["content"])
        metadata = vector["metadata"]
        clean_metadata = {
            "asset_id": metadata["asset_id"],
            "asset_name": metadata["asset_name"],
            "url": metadata["url"],
            "from": metadata["loc"]["lines"]["from"],
            "to": metadata["loc"]["lines"]["to"]
        }
        vector_metadatas.append(clean_metadata)
        random_string = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
        vector_ids.append(f"{metadata['asset_id']}:{random_string}")

    collection.add(
        embeddings=vector_embeddings,
        documents=vector_documents,
        metadatas=vector_metadatas,
        ids=vector_ids
    )

    print(f"Hydration complete for '{task}' collection.")
    return collection

# Function to perform proximity search
def proximity_search(question, task):
    config = task_config.get(task)
    if not config:
        raise ValueError(f"Task '{task}' is not configured.")

    collection = hydrate_chromadb(task)
    query_embedding = emb.encode([question]).tolist()
    top_k = config["top_k"]

    # Perform the proximity search
    results = collection.query(
        query_embeddings=query_embedding,
        n_results=top_k,
        include=["documents", "metadatas", "distances"]
    )

    documents = results["documents"][0]
    return "\n".join(documents)

# Function to build chat prompt
def build_chat_prompt(task, question, levels, context):
    base_prompt = base_prompts.get(task)
    if not base_prompt:
        raise ValueError(f"Task '{task}' not recognized.")
    if task == "chat":
        lvl = stringify(levels["grammar"])
    elif task == "spelling_check":
        lvl = stringify(levels["writing"])

    prompt = f"{base_prompt}\nUser Level: {lvl}\nContext: {context}\nUser: {question}"
    return prompt

# Chat function
def chat(question, levels, task, MAX_HISTORY_TURNS=4):
    
    print("chat function")
    conversation_history = session.get("conversation_history", [])
    proximity_context = proximity_search(question, task)
    prompt = build_chat_prompt(task, question, levels, proximity_context)
    print(prompt)
    
    generated_response = model.generate_text(prompt=prompt)
    conversation_history.append({"question": question, "response": generated_response})

    if len(conversation_history) > MAX_HISTORY_TURNS * 2:
        conversation_history = conversation_history[-MAX_HISTORY_TURNS * 2:]

    session["conversation_history"] = conversation_history
    return generated_response

def updateLevel(answer, time, level, activity):
    # Sensitivity decay parameters
    initial_sensitivity = 20  
    minimum_sensitivity = 0.5 
    decay_factor = 0.75 

    sensitivity = max(minimum_sensitivity, initial_sensitivity * (decay_factor ** activity))
    # 20 at first
    # 15 at second, 11 at third,...
    
    
    if answer:
        # Faster correct answers give higher score
        score = (20 - time) / 10 if time < 20 else 0.5 #from 2 - 0.5
        level += score * sensitivity
    else:
        # Slower wrong answers give greater penalty
        score = (time - 20) / 10 if time > 10 else 0.5
        level -= score * sensitivity

    level = min(max(level, 1), 100)
    return level

def getQuestion(levels,topic): 
    lvl = stringify(levels[topic])
        
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
    proximity_context = proximity_search(topic, "question_generation")
    prompt += f"Context: {proximity_context}\n"
    prompt += f"Level: {lvl}\n"
    prompt += f"Topic: {topic}\n"
    generated_response = model.generate_text(prompt=prompt)
    return generated_response

# Function to stringify user level
def stringify(level):
    if level < 0:
        raise ValueError("Level cannot be negative")
    elif level < 20:
        return "beginner"
    elif level < 40:
        return "beginner to intermediate"
    elif level < 60:
        return "intermediate"
    elif level < 80:
        return "intermediate to expert"
    else:
        return "expert"

def getStory(level):
    lvl = stringify(level)
    prompt = '''you are an arabic story teller that writes short stories for children in ARABIC language. the child is {lvl} at reading in arabic language.
    write exicting stories that are easy to understand and fun to read. use simple words and make sure the stories are not long.
    الطفل: اعطني قصة 
    حاكي القصص: في ليلة جميلة وهادئة، كان القمر يلعب مع النجوم في السماء. رأى طفلًا ينظر إليه من النافذة، فابتسم القمر للطفل. شعر الطفل بالسعادة وضحك، وضحك القمر أيضًا. ومنذ ذلك الحين، كلما شعر الطفل بالحزن، كان ينظر إلى القمر، فيبتسم له ويشعر بالفرح مرة أخرى.
    الطفل: اعطني قصة: 
    حاكي القصص: كان هناك أرنب صغير يعيش في الغابة. يوماً ما، شعر بالجوع الشديد ولكنه لم يجد الجزر في مكانه المعتاد. فكر الأرنب قليلاً، ثم استخدم أنفه ليشم الهواء ويبحث عن الجزر. وجد الأرنب حقلاً كبيراً مليئاً بالجزر بعد أن تبع رائحته. أكل الأرنب الجزر وشعر بالسعادة والامتنان لذكائه.
    الطفل: اعطني قصة
    حاكي القصص: كانت هناك فراشة صغيرة تحب الطيران في الحديقة. في يوم مشمس، رأت فراشة زهرة جميلة وقررت أن تستريح عليها. شكرت الفراشة الزهرة على رحيقها اللذيذ وألوانها الزاهية. قالت الزهرة للفراشة: "تعالي دائماً لتزوريني." ومنذ ذلك اليوم، كانت الفراشة تزور الزهرة كل يوم وتنشر الفرح في الحديقة.
    الطفل: اعطني قصة
    حاكي القصص: '''
    model.params["random_seed"] = random.randint(1, 12451)
    respons = model.generate_text(prompt=prompt)
    return respons
    
#############################################################################
#############################################################################
#######################  <flask routes below> ###############################
#############################################################################
#############################################################################

@app.route('/ask', methods=['POST'])
def chatQuestion():
    data = request.json
    question = data.get("question", "")
    levels = data.get("levels", "")
    if not question:
        return jsonify({"error": "No question provided"}), 400
    try:
        generated_response = chat(question, levels, task="chat")
        return jsonify({"AI": generated_response})
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

#needs: levels, question
@app.route('/spelling-correction', methods=['POST'])
def spell_check():
    data = request.json
    levels = data.get("levels", "")
    question = data.get("question", "")
    if not question:
        return jsonify({"error": "No question provided"}), 400
    try:
        response = chat(question, levels, task="spelling_check", MAX_HISTORY_TURNS=3)
        return jsonify({"AI": response})
    except Exception as e:
        print("Error at spell check:", e)
        return jsonify({"error": str(e)}), 500

# needs: levels, topic for first question
@app.route('/start-exam', methods=['POST'])
def startExam():
    print("start exam")
    data = request.json
    levels = data.get("levels", "")
    print(levels)
    topic = data.get("topic", "")
    response = getQuestion(levels, topic)
    return jsonify({"AI": response})


# needs: levels, topic, answer, time, userActivity, newTopic
@app.route('/nextQuestion', methods=['POST'])
def sendNextQuestion():
    data = request.json
    answer = data.get("answer", "")
    time = data.get("time", "")
    topic = data.get("topic", "")
    newTopic = data.get("newTopic", "")
    levels = data.get("levels", "")
    print(levels)
    singlevel = levels[topic]
    userActivity = data.get("userActivity", "")
    singlevel = updateLevel(answer, time, singlevel, userActivity)
    levels[topic] = singlevel
    
    if newTopic:
        response = getQuestion(levels, newTopic)
    else:
        response = "Exam finished"
    return jsonify({"AI": response,"levels":levels})

# For clearing the conversation history
@app.route('/reset', methods=['POST'])
def reset_conversation():
    session["conversation_history"] = []
    return jsonify({"message": "Conversation history reset successfully."})

@app.route('/story', methods=['POST'])
def sendStory():
    data = request.json
    levels = data.get("levels", "")
    response = getStory(levels["reading"])
    return jsonify({"AI": response})

if __name__ == '__main__':
    app.run(debug=True, port=5000)

