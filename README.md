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

| Frontend | Backend | Deployment |
|----------|---------|------------|
| React (Vite) | Flask (Blueprints) | Docker |
| Tailwind-style custom UI | Requests + PIL | Vercel (frontend) |
| LocalStorage + Fetch | dotenv + json logging | ngrok + Colab (backend) |

---

## 🚀 Project Structure

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
