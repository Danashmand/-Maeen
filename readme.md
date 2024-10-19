#### How to test `VirtualAssistant.py`

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



