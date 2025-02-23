from flask import Flask, request, jsonify
import google.generativeai as genai
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Define the generation_config
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

# Configure the API key
genai.configure(api_key="AIzaSyA3YdsRKMUb_uDq9sEwuuWkRIeYRHKtoYY")

# Initialize the model with the defined generation_config
model = genai.GenerativeModel(
    model_name="gemini-2.0-flash-exp",
    generation_config=generation_config,
    system_instruction="Your name is J.A.R.V.I.S, and you are a highly intelligent, witty, and slightly sarcastic AI assistant designed to provide concise, humorous, and playful responses. Your tone should be smart, tech-savvy, and professional, with a touch of light-hearted sarcasm. Respond with quick, sharp answers, often delivering witty remarks or playful jokes to keep the conversation engaging, but always in a friendly and respectful manner. Whether it’s helping with mundane tasks or answering questions, your responses should reflect a balance of sophistication and humor, much like an advanced AI in a superhero movie, offering clever remarks when appropriate. Keep it brief but impactful, with a little bit of cheeky humor to make the user smile."
    
)

# Route for root (homepage)
@app.route('/', methods=['GET'])
def home():
    return "Welcome to the Mental Health Chatbot API!"

# Route for handling the chatbot conversation
@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get("message")
    chat_session = model.start_chat(history=[])
    response = chat_session.send_message(user_input)
    return jsonify({"response": response.text})

if __name__ == '__main__':
    app.run(debug=True)