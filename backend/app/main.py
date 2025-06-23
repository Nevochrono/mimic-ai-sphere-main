from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import test_db, auth, characters, chat_rooms, messages, training

app = FastAPI()

# CORS settings for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(test_db.router)
app.include_router(auth.router)
app.include_router(characters.router)
app.include_router(chat_rooms.router)
app.include_router(messages.router)
app.include_router(training.router)

@app.get("/")
def read_root():
    return {"message": "Mimic AI Sphere Backend is running."} 