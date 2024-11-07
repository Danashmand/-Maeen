# How to test `VirtualAssistant.py`

- Install the required libraries in your  virtual environment
remeber to keep it in the .gitignore file

`pip install -r requirements.txt`

- after activation of the virtual environment
run the python code in the terminal
`python .\model\VirtualAssistant.py`
- sending ask request to the virtual assistant
    - you should have "question" key in the json data
    - you can send the data in the following format
`{"question": "علمني عن الالف المقصورة"}`
- you can send multiple questions and the Vassistant will keep track of the context
- If you want to reset send a `/reset [POST]` request and the conversation will be reset 
- you can change prompt by modifying the `ROLE_INSTRUCTION` variable
- you can change the number of turns stored by `MAX_HISTORY_TURNS` variable 

# variables discription when using the API: 
- `levels` : dict of the format: `{"writing": 1-100, "reading": 1-100, "grammer": 1-100}`
- `topic` one of three: "writing", "reading", "grammer" i.e.( "الإملاء", "القراءة", "القواعد")
- `question` the user question that is going to the prompt
- `answer` wheather the previous answer was correct or not
- `userActivity` number from 1-inf corresponding to how long the user is active 
- `newTopic` the topic for the next question to generate
- `topic` the topic for the previous question (the answered one)
### variables to get back from the API: 
- `response` the response of the virtual assistant you will find it in data.AI
- `level` after each question you will get the updated level of user


# How to send requests to VirtualAssistant.py

### virtaul assistant (المساعد الافتراضي)
- use `/ask` POST using the following format
`{"question": "علمني عن الالف المقصورة", levels: {"writing": 33.0, "reading": 11.4, "grammer": 80.0}}` 

**must pass `question` and `levels`**
### enhace my writing (المصحح الاملائي)
- use `/spelling-correction` POST using the following format
`{"question": "اسمي هو حمزت", levels: {"writing": 33.0, "reading": 11.4, "grammer": 80.0}}`

     **must pass `question` and `levels`**

#### use reset for reseting a chat for both of these

- use `/reset` POST to reset the conversation
 
### exams generation (اختبارات علام)

- use `/start-Exam` to start the exam 
`{"levels": {"writing": 1, "reading", 10, "grammer": 19}, "topic": "grammer"}`

**must pass `levels` and `topic`**
- you can send a POST request with `/nextQuestion` to get the next question in the exam(you should give level, topic, and flag for answer)

**must pass these variables**
`{"levels" : {"writing":90.795,"reading":54,"grammer":50},"topic": "reading",
  "newTopic":"reading","time": 4,
  "userActivity": 5, 
  "answer" : true} `

### for generating storries (ارو لي قصة)
- use `/story` to retreive the story 
**must pass the levels parameter**