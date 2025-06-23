from pydantic import BaseModel
from typing import Optional

class ChatRoomCreate(BaseModel):
    name: str
    user_id: str

class ChatRoomOut(BaseModel):
    id: str
    name: str
    user_id: str
    created_at: Optional[str]

# For Supabase table mapping (if needed)
class ChatRoomDB(BaseModel):
    id: str
    name: str
    user_id: str
    created_at: Optional[str] 