from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, auth
import os
from sentiment_analysis import analyze_sentiment
from werkzeug.utils import secure_filename
from neuralstyle_transfer import mood_overlay
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Allow frontend to call backend

# Initialize Firebase Admin SDK
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Ensure the 'imgs' directory exists
os.makedirs(os.path.join(BASE_DIR, "imgs"), exist_ok=True)

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

# Create upload and output directories
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
OUTPUT_FOLDER = os.path.join(BASE_DIR, "results")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# Allowed file extensions
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/stylize", methods=["POST"])
def stylize_image():
    print("Line 80: request: ", request.files)

    if "content" not in request.files or "style" not in request.files:
        return jsonify({"error": "Both content and style images are required"}), 400

    content_file = request.files["content"]
    style_file = request.files["style"]

    if not (allowed_file(content_file.filename) and allowed_file(style_file.filename)):
        print({"error": "Invalid file format. Allowed formats: PNG, JPG, JPEG"})
        return jsonify({"error": "Invalid file format. Allowed formats: PNG, JPG, JPEG"}), 400

    # Get original filenames securely
    content_filename = secure_filename(content_file.filename)
    style_filename = secure_filename(style_file.filename)

    # Define save paths for content & style images
    content_path = os.path.join(UPLOAD_FOLDER, content_filename)
    style_path = os.path.join(UPLOAD_FOLDER, style_filename)

    # Save files
    content_file.save(content_path)
    style_file.save(style_path)

    # Generate a single date-based filename for the output image
    current_date = datetime.now().strftime("%Y%m%d")  # e.g., "20240305"
    output_filename = f"{current_date}.jpg"
    output_path = os.path.join(OUTPUT_FOLDER, output_filename)

    # Check if the output file already exists
    if os.path.exists(output_path):
        print({"error": "An image for today's date already exists."})
        return jsonify({"error": "An image for today's date already exists."}), 400

    try:
        print("Applying neural style transfer...")
        mood_overlay(content_path, style_path, output_path)  # Apply neural style transfer
        print("Finish")
        print({"output_image": f"/results/{output_filename}"})
        print("Output path:", output_path)
        
        return jsonify({"output_image": f"/results/{output_filename}"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/imgs/<filename>")
def serve_image(filename):
    return send_from_directory("imgs", filename)

@app.route("/results/<filename>")
def serve_result_image(filename):
    print("Serving file from results:", filename)
    return send_from_directory(OUTPUT_FOLDER, filename)

IMAGE_DIR = os.path.join(BASE_DIR, "results")

@app.route("/image-files")
def list_image_files():
    """Returns a list of available image filenames without extensions."""
    try:
        images = [f.split('.')[0] for f in os.listdir(IMAGE_DIR) if f.endswith(('.jpg', '.png'))]
        print(f"Images found: {images}")  # Debug print
        return jsonify(images)
    except Exception as e:
        print(f"Error listing images: {e}")  # Debug print
        return jsonify({"error": str(e)}), 500

@app.route("/fetch-image/<filename>")
def fetch_image(filename):
    """Serves an image if it exists."""
    try:
        file_path = os.path.join(IMAGE_DIR, filename)
        if os.path.exists(file_path):
            print(f"Serving image: {file_path}")  # Debug print
            return send_from_directory(IMAGE_DIR, filename)
        else:
            print(f"Image not found: {file_path}")  # Debug print
            return jsonify({"error": "Image not found"}), 404
    except Exception as e:
        print(f"Error serving image {filename}: {e}")  # Debug print
        return jsonify({"error": str(e)}), 500

    
    
if __name__ == "__main__":
    app.run(debug=True)