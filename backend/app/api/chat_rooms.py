from fastapi import APIRouter, Depends, HTTPException, Form
from app.utils import get_current_user
from app.db import supabase
from app.models.chat_room import ChatRoomCreate, ChatRoomOut
from typing import List

router = APIRouter(prefix="/chat-rooms", tags=["chat-rooms"])

@router.post("/", response_model=ChatRoomOut)
def create_chat_room(
    name: str = Form(...),
    user_id: str = Depends(get_current_user)
):
    result = supabase.table("chat_rooms").insert({
        "name": name,
        "user_id": user_id
    }).execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Chat room creation failed")
    room = result.data[0]
    return ChatRoomOut(**room)

@router.get("/", response_model=List[ChatRoomOut])
def list_chat_rooms(user_id: str = Depends(get_current_user)):
    result = supabase.table("chat_rooms").select("*").eq("user_id", user_id).execute()
    return [ChatRoomOut(**r) for r in result.data]

@router.get("/{chat_room_id}", response_model=ChatRoomOut)
def get_chat_room(chat_room_id: str, user_id: str = Depends(get_current_user)):
    result = supabase.table("chat_rooms").select("*").eq("id", chat_room_id).eq("user_id", user_id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Chat room not found")
    return ChatRoomOut(**result.data)

@router.put("/{chat_room_id}", response_model=ChatRoomOut)
def update_chat_room(
    chat_room_id: str,
    name: str = Form(...),
    user_id: str = Depends(get_current_user)
):
    result = supabase.table("chat_rooms").update({"name": name}).eq("id", chat_room_id).eq("user_id", user_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Chat room not found or not updated")
    return ChatRoomOut(**result.data[0])

@router.delete("/{chat_room_id}")
def delete_chat_room(chat_room_id: str, user_id: str = Depends(get_current_user)):
    result = supabase.table("chat_rooms").delete().eq("id", chat_room_id).eq("user_id", user_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Chat room not found or not deleted")
    return {"ok": True, "id": chat_room_id} 