# Text-to-Image-Generator
A lightweight full-stack web application that converts text prompts into AI-generated images using a visual language model backend (Stable Diffusion).   This project features a React frontend, Flask backend, dark/light mode UI, Docker support, and prompt history tracking.


## 🌟 Features

- 🧠 Enter a prompt and generate images via Stable Diffusion (Colab backend)
- 🎨 Clean, modern UI with light/dark mode toggle
- 📜 Prompt history with one-click regeneration
- ⬇️ One-click image download
- 🧊 React frontend + Flask backend (Blueprint modularized)
- 🐳 Dockerized backend for portable deployment
- 🗂️ Environment-based configuration via `.env`
- 📝 Persistent prompt logs stored in `history.json`

---

## 📸 Screenshots

| Dark Mode | Light Mode |
|-----------|------------|
| 🌙 | ☀|

---

## ⚙️ Technologies Used

| Frontend                    | Backend            | Deployment |
|----------------------------|--------------------|------------|
| React (Create React App)   | Flask (Blueprints) | Docker     |
| CSS Modules (CRA Default)  | Requests, PIL      | `.env` for config |
| JavaScript (JSX)           | Ngrok + Colab API  | JSON-based caching |

---

## 🏗️ Project Structure

```bash
.
├── backend/
│   ├── app.py                # Main Flask app
│   ├── routes/               # Blueprint routes
│   │   ├── frontend_bp.py
│   │   ├── generate_bp.py
│   │   ├── image_bp.py
│   │   └── __init__.py
│   ├── static/generated_images/
│   ├── history.json
│   ├── Dockerfile
│   ├── .env
│   └── requirements.txt
├── frontend/
│   ├── src/TextToImageApp.jsx
│   └── ...
```
---


## 🚀 How to Run

### 🧪 Local Dev (Without Docker)

1. **Run Colab notebook** and copy the ngrok URL (e.g., `https://xxxxx.ngrok.io`)
2. In `backend/.env`:
   ```env
   COLAB_URL=https://xxxxx.ngrok.io
   OUTPUT_DIR=static/generated_images
3. In /backend:
pip install -r requirements.txt
python app.py
4. In /frontend:
npm install
npm run build
5. Open browser: http://127.0.0.1:5000

---
🐳 Docker Run (Production-Style)

1. Make sure Colab is running and .env exists in /backend

2. In /backend:

docker build -t text2image-backend .
docker run -p 5000:5000 text2image-backend

3. Open http://127.0.0.1:5000
---
🧠 Notes

·The backend sends prompts to the Colab-based model, receives base64 image, and serves it via Flask.

·Prompt history is stored in history.json on the server.

·Docker container loads env vars at build time, so .env must be present when running docker build.

---
📦 Future Improvements

 ·Replace Colab with a persistent inference API (e.g. Replicate, Hugging Face Inference API)

 ·Add user login for personalized history

 ·Add more advanced prompt options (style, seed, steps)

 ·Responsive mobile UI
 
---
💡 Credits

Created by jingwen as part of an academic project.
Model: runwayml/stable-diffusion-v1-5

Colab backend powered by 🤗 Diffusers + Ngrok + Flask.

If you like this, feel free to ⭐️ the repo or connect with me on LinkedIn
