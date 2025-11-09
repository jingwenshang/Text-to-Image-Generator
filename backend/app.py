import os
from flask import Flask
from flask_cors import CORS
from flasgger import Swagger
from routes import frontend_bp, generate_bp, image_bp
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Create Flask app
app = Flask(__name__, static_folder="frontend/build", static_url_path="")
CORS(app)

# Load config from env with default fallback
app.config["COLAB_URL"] = os.getenv("COLAB_URL", "http://localhost:5001")
app.config["OUTPUT_DIR"] = os.getenv("OUTPUT_DIR", "static/generated_images")

# Ensure output directory exists
os.makedirs(app.config["OUTPUT_DIR"], exist_ok=True)

# Register blueprints
app.register_blueprint(frontend_bp)
app.register_blueprint(generate_bp, url_prefix="/generate")
app.register_blueprint(image_bp, url_prefix="/image")


Swagger(app)

# Run the app
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
