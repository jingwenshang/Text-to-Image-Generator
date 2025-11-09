# Text-to-Image Generator

A full-stack AI-powered application that generates images from text prompts using a Stable Diffusion backend served via Google Colab. The app features a React frontend, a Flask backend, optional Docker support, prompt history management, and stats/tracking. You can generate images, view history, download them individually or in bulk, and toggle between light/dark modes.

---

## 🚀 Features

* ✨ **Text-to-Image Generation** using Hugging Face `runwayml/stable-diffusion-v1-5`
* 🧠 Prompt Templates for fast inspiration
* 🕘 Prompt History & 📊 Generation Statistics
* 📥 Download single image or 📦 Download all as zip
* 🌙 Light/Dark Mode toggle
* 🐍 Flask backend with modular blueprints (`generate`, `image`, `frontend`)
* 💻 React frontend (created via `create-react-app`)
* 🐳 Docker & `docker-compose.yml` support
* 📎 .env integration + 📖 Swagger/OpenAPI docs (via flasgger)

---

## 📸 Screenshots
<img width="2559" height="1230" alt="image" src="https://github.com/user-attachments/assets/7ad6c06b-72a2-4f06-ab80-60eb10a41238" />
<img width="2560" height="934" alt="image" src="https://github.com/user-attachments/assets/45c46f8f-cf58-49a4-a96e-63c9474c83fa" />

<img width="2560" height="1229" alt="image" src="https://github.com/user-attachments/assets/1566b55d-28ed-44c0-9dff-883b5b557329" />
<img width="2560" height="923" alt="image" src="https://github.com/user-attachments/assets/bc94303c-773e-44df-8698-77f303e98625" />


## 🗂️ Project Structure

```
text2image/
├── app.py                  # Flask entry point
├── Dockerfile              # For backend Dockerization
├── docker-compose.yml      # For combined frontend/backend deployment
├── .env                    # Contains NGROK/Colab config
├── requirements.txt
├── history.json            # Stores prompt history
├── static/                 # Generated images saved here
├── routes/                 # Flask blueprints
│   ├── frontend_bp.py
│   ├── generate_bp.py
│   └── image_bp.py
├── backend/frontend/       # (Optional nested logic)
└── text2image-frontend/    # React frontend
    ├── public/
    ├── src/
    │   └── TextToImageApp.jsx  # Main app component
    ├── README.md
    ├── package.json
    └── ...
```

---

## ⚙️ Setup Instructions

### 1. 🔌 Install Dependencies

```bash
cd text2image-frontend
npm install
cd ..
pip install -r requirements.txt
```

### 2. 🧪 Build Frontend (Optional)

```bash
cd text2image-frontend
npm run build
```

### 3. 🐳 Run with Docker Compose

```bash
docker-compose up --build
```

OR

### 3. 🧪 Run Locally

```bash
python app.py
```

### 4. 🧠 Connect to Colab Backend

Use our provided Colab backend for image generation.

* Run all cells
* You’ll get a public URL like:

  ```
  ```

🔗 [https://xxxxxx.ngrok-free.dev](https://xxxxxx.ngrok-free.dev)

````
- Paste this into your `.env`:

```env
COLAB_URL=https://xxxxxx.ngrok-free.dev
OUTPUT_DIR=static/generated_images
````

---

## 📈 Usage Screenshot

| Dark Mode                     | Light Mode                      |
| ----------------------------- | ------------------------------- |
|<img width="2560" height="1229" alt="image" src="https://github.com/user-attachments/assets/1566b55d-28ed-44c0-9dff-883b5b557329" />|<img width="2559" height="1230" alt="image" src="https://github.com/user-attachments/assets/3ef183fb-3c08-42a2-9ebc-226df9e803c1" />|

---

## 🧪 Example Prompts

* `A futuristic cityscape at night`
* `A cat wearing sunglasses and drinking coffee`
* `An astronaut riding a horse on Mars`
* `A robot painting a canvas`

---

## 📌 Notes

* `COLAB_URL` should be updated every time Colab is restarted.
* Colab backend uses GPU (free tier T4 or paid A100).
* `history.json` stores last 10 prompts and timestamps.

---

## 🧼 TODOs / Future Ideas

* [ ] Add user authentication
* [ ] Limit rate of generation
* [ ] Theme customization
* [ ] Deploy backend to Render

---

## 📄 License

MIT

---

## 🤝 Contributing

PRs and suggestions welcome!

---

## 💬 Acknowledgments

* [Hugging Face Diffusers](https://github.com/huggingface/diffusers)
* [Flask + React Template](https://github.com)
* [ngrok](https://ngrok.com/) for tunnel

---

> Created by [@jingwenshang](https://github.com/jingwenshang)
