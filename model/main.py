from flask import Flask, request, jsonify
import os
from ibm_watsonx_ai.foundation_models import Model
import getpass

app = Flask(__name__)

# Function to retrieve credentials
def get_credentials():
    return {
        "url": "https://eu-de.ml.cloud.ibm.com",
        "apikey":"3Ls5_sdF4uZz00i6ZdHGZB1YBxRDfVgcUgkq11tZvjlB" # Replace with a secure input or environment variable
    }

# Define model parameters and environment variables
model_id = "sdaia/allam-1-13b-instruct"
parameters = {
    "decoding_method": "greedy",
    "max_new_tokens": 900,
    "repetition_penalty": 1
}

project_id = "da2e1438-1e80-4b85-9c22-7565678d1498"  # Ensure PROJECT_ID is set in your environment
space_id = os.getenv("SPACE_ID")      # Ensure SPACE_ID is set in your environment

# Initialize the model once
model = Model(
    model_id=model_id,
    params=parameters,
    credentials=get_credentials(),
    project_id=project_id,
    space_id=space_id
)

@app.route('/ask', methods=['POST'])
def ask_question():
    # Get the input question from the request body (JSON format)
    data = request.json
    question = data.get("question", "")
    
    if not question:
        return jsonify({"error": "No question provided"}), 400

    # Format the question for the model input
    prompt_input = ""
    formatted_question = f"<s> [INST] {question} [/INST]"
    prompt = f"{prompt_input}{formatted_question}"

    try:
        # Generate the response from the model
        generated_response = model.generate_text(prompt=prompt, guardrails=False)
        return jsonify({"AI": generated_response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
