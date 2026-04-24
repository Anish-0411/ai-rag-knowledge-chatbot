# 🚀 CortexRAG – Knowledge Base QA System (RAG)

A **Retrieval-Augmented Generation (RAG)** based Knowledge Base Question Answering system that allows users to query documents (PDF, DOCX, TXT) using natural language and get accurate, context-aware answers.

---

## 📌 Features

- 📄 Multi-document support (PDF, DOCX, TXT)
- ⚡ Hybrid Retrieval (FAISS + BM25)
- 🎯 Cross-encoder Reranking
- 🧠 LLM-based Query Expansion
- 💬 React Chat Interface
- 🔌 FastAPI Backend

---

## 🏗️ Project Structure

```
Project/
│
├── backend/
│   ├── app.py
│   ├── RAG_Pipeline.py
│   ├── requirements.txt
│   ├── data/
│   └── start.sh
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│
├── RAG_Project.ipynb
├── KBQA.png
├── README.md
```

---

## ⚙️ Prerequisites

- Python 3.10+
- Node.js 16+
- npm
- Git

---

## 🔑 Environment Variables

Create a `.env` file inside `backend/`:

```
GROQ_API_KEY=your_api_key_here
```

---

## 🛠️ Backend Setup

### 1. Navigate to backend

```bash
cd backend
```

### 2. Create virtual environment

```bash
python -m venv venv
source venv/bin/activate        # Mac/Linux
venv\Scripts\activate           # Windows
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Add documents

Place your files inside:

```
backend/data/
```

### 5. Run backend

```bash
uvicorn app:app --reload
```

Backend runs on:

```
http://127.0.0.1:8000
```

Swagger Docs:

```
http://127.0.0.1:8000/docs
```

---

## 🌐 Frontend Setup (React)

### 1. Navigate to frontend

```bash
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run frontend

```bash
npm run dev
```

Frontend will be available at:

```
http://localhost:5173
```

---

## 🔄 Application Workflow

1. User enters a query in the React UI  
2. Request is sent to FastAPI backend (`/ask`)  
3. Backend performs:
   - Query Expansion (LLM)  
   - Hybrid Retrieval (FAISS + BM25)  
   - Reranking (Cross Encoder)  
4. Relevant context is passed to LLM  
5. Final answer is generated  
6. Response is displayed in the chat UI  

---

## 🐞 Troubleshooting

### ❌ CORS Error

Make sure backend includes:

```python
from fastapi.middleware.cors import CORSMiddleware
```

---

### ❌ 405 / 400 Error

- Ensure request method is **POST**
- Check endpoint is `/ask` (no trailing `/`)
- Verify backend is running

---

### ❌ Backend not reachable

- Check FastAPI server status  
- Verify correct API URL  
- Restart both frontend and backend  

---

## 🚀 Future Improvements

- Streaming responses (ChatGPT-style typing)
- File upload from frontend
- Persistent chat history
- Deployment (Vercel + Render)

---

## 📷 Architecture

See: `KBQA.png`

---

## 👨‍💻 Author

**Sai Anish**

---

## ⭐ Contribution

Feel free to fork and improve this project.

---

## 📄 License

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

Copyright (c) 2026 Sai Anish

This project is licensed under the MIT License.

You are free to use, modify, and distribute this project with proper attribution.