from fastapi import APIRouter, Depends, HTTPException, Form
from app.utils import get_current_user
from app.db import supabase
from app.models.message import MessageCreate, MessageOut
from typing import List

router = APIRouter(prefix="/messages", tags=["messages"])

@router.post("/", response_model=MessageOut)
def send_message(
    chat_room_id: str = Form(...),
    content: str = Form(...),
    role: str = Form(...),  # 'user' or 'character'
    user_id: str = Depends(get_current_user)
):
    result = supabase.table("messages").insert({
        "chat_room_id": chat_room_id,
        "sender_id": user_id,
        "content": content,
        "role": role
    }).execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Message send failed")
    msg = result.data[0]
    return MessageOut(**msg)

@router.get("/chat-room/{chat_room_id}", response_model=List[MessageOut])
def get_messages(chat_room_id: str, user_id: str = Depends(get_current_user)):
    # Optionally, check if user is a member of the chat room
    result = supabase.table("messages").select("*").eq("chat_room_id", chat_room_id).order("created_at", desc=False).execute()
    return [MessageOut(**m) for m in result.data] 