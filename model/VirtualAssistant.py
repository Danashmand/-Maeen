# -*- coding: utf-8 -*-
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
import json
import random


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
    # "min_new_tokens": 10,
    "max_new_tokens": 900,
    "repetition_penalty": 1,
    # "temperature": .001,
    "top_p": .50,
    # "top_k": 90,
    # "random_seed": random.randint(1, 12451),
    "stoping_sequence": ["END"]
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
        "vector_index_id": "e097139e-82da-49d3-98ee-0dc217e05721", 
        "top_k": 10
    },
    "chat": {
        "collection_name": "chat_collection",
        "vector_index_id": "e097139e-82da-49d3-98ee-0dc217e05721", #chat set
        "top_k": 3
    },
    "story": {
        "collection_name": "story_collection",
        "vector_index_id": "7c110277-f075-41e5-93ba-dcee4d43cc67", #stories set
        "top_k": 3
    }
}

base_prompts = {
    "spelling_check":'''you are a dedicated Arabic spellchecker. you should always correct the spelling mistakes in the text and give a brief explanation about it end your answers with "END" keyword

        Input: ذهبت إلى المدرسه.
        Output: ذهبت إلى المدرسة.
        END

        Input: أريد أن اذهب إلى المكتبة.
        Output: أريد أن أذهب إلى المكتبة.
        END

        Input: الكتاب على الطاولة
        Output: هذه الجملة صحيحة إملائيا
        END

        Input: ''', 
    
    
    "question_generation": """ You are an AI that generates an MCQ question with three choices your question should be about the foundation of Arabic language and the correct answer should be the first choice
    you should generate text, or sentences to apply these foundations in the question and should end your choices with "END"
    
    في هذه الجملة **يلعب الطفل في الحديقة** الفعل هو:
    - يلعب (alwayes first choice is correct)
    - الطفل
    - الحديقة
    END
    
    في هذه الجملة **فزع الطفل عند رؤية الوحش** معنى فزع هو: 
    - خاف
    - ضحك
    - نام
    END
    """,
    
    
    
    "chat": '''You are a friendly AI that answers questions in Arabic with Islamic values to the conversation.
    Make sure to make your answers short, concise, and simple also give examples
    Only respond to questions that are related to the topic and ignore the rest
    '''
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

# Function to perform proximity search (use immediatlly without getting the collectoin from hydrate_chromadb)
def proximity_search(question, task):
    if task == "spelling_check":
        return ""
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
def build_chat_prompt(task, question, levels, context, conversation_history):
    base_prompt = base_prompts.get(task)
    if not base_prompt:
        raise ValueError(f"Task '{task}' not recognized.")
    if task == "chat":
        lvl = stringify(levels["grammar"])
    elif task == "spelling_check":
        lvl = stringify(levels["writing"])
        prompt_input = context + f"""{base_prompt}\n\n"""
        return prompt_input + question + "\nOutput:"
        
    
    prompt_input = context + f"""<<SYS>>{base_prompt}<</SYS>>\n\n""" 
    for turn in conversation_history:
        prompt_input += f'''{turn["question"]} [/INST] {turn["response"]}  </s><s>[INST]'''
    formattedQuestion = f"<s> [INST] {question} [/INST]"
    prompt = f"{prompt_input} {formattedQuestion}"
    return prompt

# Chat function
def chat(question, levels, task, MAX_HISTORY_TURNS=4):
    
    # print("chat function")
    if task != "spelling_check":        
        conversation_history = session.get("conversation_history", [])
    #############################################################################
    proximity_context = proximity_search(question, task)
    prompt = build_chat_prompt(task, question, levels, proximity_context,conversation_history)
    print(prompt)
    print("="*30)
    generated_response = model.generate_text(prompt=prompt)
    conversation_history.append({"question": question, "response": generated_response})

    if len(conversation_history) > MAX_HISTORY_TURNS * 2:
        conversation_history = conversation_history[-MAX_HISTORY_TURNS * 2:]

    session["conversation_history"] = conversation_history
    return generated_response


# function to learn the level of the user through the exam answers
def updateLevel(answer, time, level, activity):
    # Sensitivity decay parameters for learning 
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
        score = (time - 20) / 10 if time > 10 else 0.5  # from -.5,...., inf
        level -= score * sensitivity

    level = min(max(level, 1), 100)
    return level

# Function to generate a question based on exam topic and user level
def getQuestion(levels,topic): 
    questionData = [{"question":"\"أي من هذه الكلمات تبدأ بحرف (ب)؟\"","level":"beginner","options":[{"id":"1","text":"كتاب","correct":False},{"id":"2","text":"قمر","correct":False},{"id":"3","text":"بطة","correct":True},{"id":"4","text":"سماء","correct":False}]},{"question":"\"أي من هذه الكلمات تُكتب بالتاء المربوطة؟\"","level":"beginner","options":[{"id":"1","text":"شمس","correct":False},{"id":"2","text":"كتاب","correct":False},{"id":"3","text":"مدرسة","correct":True},{"id":"4","text":"عمل","correct":False}]},{"question":"\"أي من هذه الكلمات تحتوي على همزة قطع؟\"","level":"beginner","options":[{"id":"1","text":"بعض","correct":False},{"id":"2","text":"أم","correct":True},{"id":"3","text":"الى","correct":False},{"id":"4","text":"حين","correct":False}]},{"question":"\"أي من هذه الكلمات تبدأ بهمزة وصل؟\"","level":"beginner","options":[{"id":"1","text":"سماء","correct":False},{"id":"2","text":"شجرة","correct":False},{"id":"3","text":"أسد","correct":False},{"id":"4","text":"انتظر","correct":True}]},{"question":"\"أي من هذه الكلمات تنتهي بألف مقصورة؟\"","level":"beginner","options":[{"id":"1","text":"هدى","correct":True},{"id":"2","text":"مدينة","correct":False},{"id":"3","text":"كتاب","correct":False},{"id":"4","text":"صحراء","correct":False}]},{"question":"\"ما هي الكلمة الصحيحة التي تكتب بألف مقصورة؟\"","level":"beginner to intermediate","options":[{"id":"1","text":"رحى","correct":True},{"id":"2","text":"هداء","correct":False},{"id":"3","text":"جمال","correct":False},{"id":"4","text":"صحراء","correct":False}]},{"question":"\"ما الفرق بين التاء المربوطة والمفتوحة في النطق؟\"","level":"beginner to intermediate","options":[{"id":"1","text":"التاء المفتوحة تُنطق ياءً","correct":False},{"id":"2","text":"التاء المربوطة تُنطق هاءً عند الوقف","correct":True},{"id":"3","text":"التاء المفتوحة تُنطق هاءً","correct":False},{"id":"4","text":"التاء المربوطة تُنطق دائمًا تاءً","correct":False}]},{"question":"\"اختر الكلمة التي تبدأ بلام التعريف المدمجة.\"","level":"beginner to intermediate","options":[{"id":"1","text":"بيت","correct":False},{"id":"2","text":"للبيت","correct":True},{"id":"3","text":"سماء","correct":False},{"id":"4","text":"إلى","correct":False}]},{"question":"\"أين تُكتب الهمزة في كلمة (تفاءل)؟\"","level":"beginner to intermediate","options":[{"id":"1","text":"على السطر","correct":True},{"id":"2","text":"على الواو","correct":False},{"id":"3","text":"على الألف","correct":False},{"id":"4","text":"على الياء","correct":False}]},{"question":"\"أي من هذه الكلمات جمع مؤنث سالم؟\"","level":"beginner to intermediate","options":[{"id":"1","text":"معلمات","correct":True},{"id":"2","text":"رجال","correct":False},{"id":"3","text":"مدرسة","correct":False},{"id":"4","text":"كتب","correct":False}]},{"question":"\"اختر الكلمة التي تكون معرفّة بالضمير.\"","level":"intermediate","options":[{"id":"1","text":"كتب","correct":False},{"id":"2","text":"معلم","correct":False},{"id":"3","text":"كتاب","correct":False},{"id":"4","text":"كتابي","correct":True}]},{"question":"\"أي كلمة تتبع قاعدة (الألف المقصورة) في نهاية الاسم الثلاثي؟\"","level":"intermediate","options":[{"id":"1","text":"فتى","correct":True},{"id":"2","text":"قمر","correct":False},{"id":"3","text":"سماء","correct":False},{"id":"4","text":"كتاب","correct":False}]},{"question":"\"ما هو جمع المذكر السالم لكلمة (معلم)؟\"","level":"intermediate","options":[{"id":"1","text":"معلم","correct":False},{"id":"2","text":"معلمين","correct":False},{"id":"3","text":"معلمون","correct":True},{"id":"4","text":"معلمات","correct":False}]},{"question":"\"حدد الكلمة التي تنتهي بألف مقصورة.\"","level":"intermediate","options":[{"id":"1","text":"هدى","correct":True},{"id":"2","text":"سماء","correct":False},{"id":"3","text":"بناء","correct":False},{"id":"4","text":"دعا","correct":False}]},{"question":"\"اختر الكلمة التي تتبع القاعدة (المفعول المطلق).\"","level":"intermediate","options":[{"id":"1","text":"قرأت كتاباً","correct":False},{"id":"2","text":"سافرت كثيراً","correct":False},{"id":"3","text":"ضربت ضرباً","correct":True},{"id":"4","text":"حفظت دروساً","correct":False}]},{"question":"\"اختر الكلمة التي تتبع قاعدة (اسم الفاعل).\"","level":"intermediate to advanced","options":[{"id":"1","text":"كاتب","correct":True},{"id":"2","text":"كتب","correct":False},{"id":"3","text":"كتاب","correct":False},{"id":"4","text":"كتابة","correct":False}]},{"question":"\"ما هو الفعل المضارع المرفوع؟\"","level":"intermediate to advanced","options":[{"id":"1","text":"يكتبُ","correct":True},{"id":"2","text":"كتابةً","correct":False},{"id":"3","text":"كتبَ","correct":False},{"id":"4","text":"كاتب","correct":False}]},{"question":"\"أي كلمة تحتوي على همزة متطرفة؟\"","level":"intermediate to advanced","options":[{"id":"1","text":"قلم","correct":False},{"id":"2","text":"سماء","correct":True},{"id":"3","text":"علم","correct":False},{"id":"4","text":"مأساة","correct":False}]},{"question":"\"ما هي الكلمة التي تُكتب بهمزة القطع في أولها؟\"","level":"intermediate to advanced","options":[{"id":"1","text":"حين","correct":False},{"id":"2","text":"صباح","correct":False},{"id":"3","text":"بعض","correct":False},{"id":"4","text":"أم","correct":True}]},{"question":"\"حدد الكلمة التي تمثل (جمع تكسير).\"","level":"intermediate to advanced","options":[{"id":"1","text":"كتابات","correct":False},{"id":"2","text":"كُتب","correct":False},{"id":"3","text":"كرسي","correct":False},{"id":"4","text":"بيوت","correct":True}]},{"question":"\" اختر الكلمة التي تمثل (المفعول به) في الجملة، كتب المعلم كتاباً.\"","level":"advanced","options":[{"id":"1","text":"درسَ","correct":False},{"id":"2","text":"كتاباً","correct":True},{"id":"3","text":"كتابَ","correct":False},{"id":"4","text":"طالبَ","correct":False}]},{"question":"\"حدد الكلمة التي تُعتبر (اسم مكان).\"","level":"advanced","options":[{"id":"1","text":"كتابة","correct":False},{"id":"2","text":"كاتب","correct":False},{"id":"3","text":"مدرسة","correct":True},{"id":"4","text":"كتاب","correct":False}]},{"question":"\"ما هي الكلمة التي تمثل (اسم زمان)؟\"","level":"advanced","options":[{"id":"1","text":"مدرسة","correct":False},{"id":"2","text":"يوم","correct":True},{"id":"3","text":"كتابة","correct":False},{"id":"4","text":"موعد","correct":False}]},{"question":"\"حدد الكلمة التي تحتوي على همزة متطرفة.\"","level":"advanced","options":[{"id":"1","text":"كتاب","correct":False},{"id":"2","text":"فاكهة","correct":False},{"id":"3","text":"فكرة","correct":False},{"id":"4","text":"بدء","correct":True}]},{"question":"\"أي من الكلمات التالية جمع مؤنث سالم؟\"","level":"advanced","options":[{"id":"1","text":"كتب","correct":False},{"id":"2","text":"معلمين","correct":False},{"id":"3","text":"معلم","correct":False},{"id":"4","text":"معلمات","correct":True}]}]
    print(levels)
    level = stringify(levels[topic])
    filtered_questions = [q  for q in questionData if q["level"] == level]
    if not filtered_questions:
        return "No questions available for the specified topic and level."

    random_question = random.choice(filtered_questions)
    return random_question
 
# Function to stringify user level to fed it into the model
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
        return "intermediate to advanced"
    else:
        return "advanced"

def getStory(level):
    lvl = stringify(level)   
     
    # story_themes_english = [
    # "Library", "Colors", "Raindrop", "Bee", "Wind", "Shadow", "Moon", "Toys", 
    # "Sea", "Chair", "Friendship", "Cloud", "Time", "Potion", "Animals", 
    # "Paintbrush", "Giggles", "Playground", "Trees", "Rainbow"]
    # random_theme = random.choice(story_themes_english)
    # print("Iam printing here our random theme: ",random_theme)
  
    prompt = f'''
    
[INST]
You are an Arabic storyteller who writes short, engaging stories with at least 100 words and no longer than
175 words for children in ARABIC. 

- The child’s Arabic reading level: {lvl}. Adapt the story’s language and length accordingly.
- Keep the story short, simple, and fun to read.

IMPORTANT:
- Tell ONLY ONE story, and do not continue with any additional stories.
- you MUST BE ON {level+ 70} words long.
- Use clear and simple words appropriate for the child’s reading level.
- End the story with the word "END" and nothing further.

Example Dialogue:
الطفل: اعطني قصة
حاكي القصص: في ليلة جميلة وهادئة، كان القمر يلعب مع النجوم في السماء. رأى طفلًا ينظر إليه من النافذة، فابتسم القمر للطفل. شعر الطفل بالسعادة وضحك، وضحك القمر أيضًا. ومنذ ذلك الحين، كلما شعر الطفل بالحزن، كان ينظر إلى القمر، فيبتسم له ويشعر بالفرح مرة أخرى.
END

Execution Instructions:
- Think step by step.
- Focus on creating one complete story and then stop.
- If you do it correctly, you’ll earn 20 dollars.

[/INST]
'''



    #############################################################################
    # grounding = proximity_search(lvl, "story")
   # prompt = "GROUNDING:\n" + grounding + prompt 
    model.params= {"decoding_method" : "sample",
                   "temperature" : 0.5,
                   "top_p" : 1.0,
                   "top_k" : 90,
                   "max_new_tokens" : 900,
                   "stoping_sequence": ["END"]
                   }
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
        response = chat(question, levels, task="spelling_check", MAX_HISTORY_TURNS=0)
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
    
    
    
    # example question just for testing the fetch (will be deleted)
    # response =  """ما هو الفعل في الجملة  "يلعب الطفل فالحديقة"
    # - يلعب
    # - الطفل
    # - الحديقة
    # END
    # """
    # levels = data.get("levels", "")
    
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
    
    
    # example question just for testing the fetch (will be deleted)
    # response =  """ما هو الفعل في الجملة  "يلعب الطفل فالحديقة"
    # - يلعب
    # - الطفل
    # - الحديقة
    # END
    # """
    # levels = data.get("levels", "")
        
    
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
