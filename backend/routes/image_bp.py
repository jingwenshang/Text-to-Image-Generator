import os
import io
import zipfile
from flask import Blueprint, jsonify, send_file, current_app

image_bp = Blueprint("image", __name__)

@image_bp.route("/<filename>")
def get_image(filename):
    """
    Serve a generated image by filename
    ---
    tags:
      - Images
    parameters:
      - in: path
        name: filename
        required: true
        schema:
          type: string
    responses:
      200:
        description: Image file
        content:
          image/png:
            schema:
              type: string
              format: binary
      404:
        description: Image not found
    """
    filepath = os.path.join(current_app.config["OUTPUT_DIR"], filename)
    if not os.path.exists(filepath):
        return jsonify({"error": "Image not found"}), 404
    return send_file(filepath, mimetype="image/png")

@image_bp.route("/download-all", methods=["GET"])
def download_all_images():
    """
    Download all generated images as ZIP
    ---
    tags:
      - Images
    responses:
      200:
        description: ZIP file containing all images
        content:
          application/zip:
            schema:
              type: string
              format: binary
      404:
        description: No images found
    """
    output_dir = current_app.config["OUTPUT_DIR"]
    if not os.path.exists(output_dir):
        return jsonify({"error": "No images found."}), 404

    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
        for filename in os.listdir(output_dir):
            file_path = os.path.join(output_dir, filename)
            if os.path.isfile(file_path):
                zip_file.write(file_path, arcname=filename)

    zip_buffer.seek(0)
    return send_file(
        zip_buffer,
        mimetype="application/zip",
        as_attachment=True,
        download_name="generated_images.zip"
    )
