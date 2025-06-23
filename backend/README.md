# Mimic AI Sphere Backend

This is the FastAPI backend for the Mimic AI Sphere project. It handles authentication, character management, chat, model training, and integration with Supabase and Hugging Face.

## Setup

1. Create a Python virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
2. Install requirements:
   ```bash
   pip install -r requirements.txt
   ```
3. Copy `.env.example` to `.env` and fill in your Supabase and other secrets.
4. Run the server:
   ```bash
   uvicorn app.main:app --reload
   ``` 