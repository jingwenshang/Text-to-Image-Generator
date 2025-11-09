import os
import uuid
import base64
import json
import requests
from flask import Blueprint, request, jsonify, current_app
from datetime import datetime
from collections import Counter

generate_bp = Blueprint("generate", __name__)
HISTORY_PATH = "history.json"

def append_to_history(entry):
    if os.path.exists(HISTORY_PATH):
        with open(HISTORY_PATH, "r", encoding="utf-8") as f:
            history = json.load(f)
    else:
        history = []
    history.insert(0, entry)
    history = history[:10]
    with open(HISTORY_PATH, "w", encoding="utf-8") as f:
        json.dump(history, f, ensure_ascii=False, indent=2)

@generate_bp.route("", methods=["POST"])
def generate_image():
    """
    Generate an image from text prompt
    ---
    tags:
      - Generation
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              prompt:
                type: string
                example: "A robot painting on a canvas"
    responses:
      200:
        description: Image successfully generated
        content:
          application/json:
            schema:
              type: object
              properties:
                prompt:
                  type: string
                filename:
                  type: string
                image_url:
                  type: string
      400:
        description: No prompt provided
      500:
        description: Generation or decoding failed
    """
    data = request.get_json()
    prompt = data.get("prompt", "").strip()
    if not prompt:
        return jsonify({"error": "No prompt provided."}), 400

    colab_url = current_app.config["COLAB_URL"]
    output_dir = current_app.config["OUTPUT_DIR"]

    try:
        response = requests.post(f"{colab_url}/generate", json={"prompt": prompt})
        response.raise_for_status()
        result = response.json()

        img_base64 = result.get("image_base64")
        if not img_base64:
            return jsonify({"error": "No image returned from Colab"}), 500

        img_data = base64.b64decode(img_base64)
        filename = f"{uuid.uuid4().hex}.png"
        filepath = os.path.join(output_dir, filename)
        with open(filepath, "wb") as f:
            f.write(img_data)

        image_url = f"/image/{filename}"
        append_to_history({
            "prompt": prompt,
            "timestamp": datetime.now().isoformat(timespec="seconds"),
            "image_url": image_url
        })

        return jsonify({
            "prompt": prompt,
            "filename": filename,
            "image_url": image_url
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@generate_bp.route("/history", methods=["GET"])
def get_history():
    """
    Get recent prompt history (up to 10)
    ---
    tags:
      - History
    responses:
      200:
        description: List of generated prompt entries
        content:
          application/json:
            schema:
              type: array
              items:
                type: object
                properties:
                  prompt:
                    type: string
                  timestamp:
                    type: string
                  image_url:
                    type: string
    """
    if os.path.exists(HISTORY_PATH):
        with open(HISTORY_PATH, "r", encoding="utf-8") as f:
            history = json.load(f)
        return jsonify(history)
    else:
        return jsonify([])

@generate_bp.route("/clear", methods=["POST"])
def clear_history():
    """
    Clear all prompt history
    ---
    tags:
      - History
    responses:
      200:
        description: History cleared successfully
      500:
        description: Failed to clear history
    """
    try:
        if os.path.exists(HISTORY_PATH):
            os.remove(HISTORY_PATH)
        return jsonify({"message": "History cleared."})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@generate_bp.route("/stats", methods=["GET"])
def get_stats():
    """
    Get prompt usage statistics
    ---
    tags:
      - Analytics
    responses:
      200:
        description: Summary of generation stats
        content:
          application/json:
            schema:
              type: object
              properties:
                total:
                  type: integer
                  example: 10
                top_prompts:
                  type: array
                  items:
                    type: object
                    properties:
                      prompt:
                        type: string
                      count:
                        type: integer
                recent:
                  type: array
                  items:
                    type: object
                    properties:
                      prompt:
                        type: string
                      timestamp:
                        type: string
      500:
        description: Failed to load stats
    """
    if not os.path.exists(HISTORY_PATH):
        return jsonify({"total": 0, "top_prompts": [], "recent": []})

    try:
        with open(HISTORY_PATH, "r", encoding="utf-8") as f:
            history = json.load(f)

        total = len(history)
        prompt_counts = Counter(item["prompt"] for item in history)
        top_prompts = [
            {"prompt": prompt, "count": count}
            for prompt, count in prompt_counts.most_common(5)
        ]
        recent = [
            {"prompt": item["prompt"], "timestamp": item["timestamp"]}
            for item in history[:5]
        ]

        return jsonify({
            "total": total,
            "top_prompts": top_prompts,
            "recent": recent
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
