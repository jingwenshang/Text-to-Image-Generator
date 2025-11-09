import os
from flask import Blueprint, send_from_directory, current_app

frontend_bp = Blueprint("frontend", __name__)

@frontend_bp.route("/")
def serve_frontend():
    return send_from_directory(current_app.static_folder, "index.html")

@frontend_bp.route("/<path:path>")
def serve_static(path):
    file_path = os.path.join(current_app.static_folder, path)
    if os.path.exists(file_path):
        return send_from_directory(current_app.static_folder, path)
    else:
        return send_from_directory(current_app.static_folder, "index.html")
