from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, auth
import os
from sentiment_analysis import analyze_sentiment
from neuralstyle_transfer import mood_overlay

app = Flask(__name__)
CORS(app)  # Allow frontend to call backend

# Initialize Firebase Admin SDK
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)

# Ensure the 'imgs' directory exists
os.makedirs("imgs", exist_ok=True)

# Map emotion labels to image filenames
EMOTION_TO_IMAGE = {
    'joy': 'joy.jpg',
    'sadness': 'sadness.jpg',
    'anger': 'anger.jpg',
    'fear': 'fear.jpg',
    'surprise': 'surprise.jpg',
    'love': 'love.jpg'
}

@app.route("/analyze", methods=["POST"])
def sentiment_endpoint():  # Renamed to avoid conflict with imported function
    data = request.get_json()
    if not data or "text" not in data:
        return jsonify({"error": "No text provided"}), 400

    text = data["text"]

    try:
        # Analyze text using sentiment_analysis.py
        analysis_result = analyze_sentiment(text)

        # Get the emotion label and ensure it's lowercase
        emotion_label = analysis_result["emotion"]["label"].lower()
        
        # Get corresponding image filename, use a default if not found
        image_filename = EMOTION_TO_IMAGE.get(emotion_label, 'default.png')

        response = {
            "sentiment": analysis_result["sentiment"],
            "emotion": {
                "label": emotion_label,
                "score": analysis_result["emotion"]["score"],
                "image": f"/imgs/{image_filename}",  # Add leading slash for proper URL
            },
            "all_emotions": analysis_result["all_emotions"]
        }

        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/stylize", methods=["POST"])
def stylize_image():
    data = request.get_json()
    if not data or "content" not in data or "style" not in data:
        return jsonify({"error": "Both content and style image paths are required"}), 400

    content_path = os.path.abspath(data["content"])
    style_path = os.path.abspath(data["style"])
    
    if not os.path.exists(content_path) or not os.path.exists(style_path):
        return jsonify({"error": "One or both image files not found"}), 400

    output_filename = f"stylized_{os.path.basename(content_path)}"
    output_path = os.path.join("results", output_filename)

    try:
        # Apply neural style transfer
        mood_overlay(content_path, style_path, output_path)

        return jsonify({"output_image": f"/results/{output_filename}"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/results/<filename>")
def serve_result(filename):
    return send_from_directory("results", filename)

@app.route("/imgs/<filename>")
def serve_image(filename):
    return send_from_directory("imgs", filename)

if __name__ == "__main__":
    app.run(debug=True)