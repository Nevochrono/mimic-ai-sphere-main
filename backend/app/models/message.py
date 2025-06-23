from pydantic import BaseModel
from typing import Optional

class MessageCreate(BaseModel):
    chat_room_id: str
    sender_id: str
    content: str
    role: str  # 'user' or 'character'

class MessageOut(BaseModel):
    id: str
    chat_room_id: str
    sender_id: str
    content: str
    role: str
    created_at: Optional[str]

# For Supabase table mapping (if needed)
class MessageDB(BaseModel):
    id: str
    chat_room_id: str
    sender_id: str
    content: str
    role: str
    created_at: Optional[str] 