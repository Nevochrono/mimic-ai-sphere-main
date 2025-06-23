from pydantic import BaseModel
from typing import Optional

class CharacterCreate(BaseModel):
    name: str
    description: Optional[str]
    user_id: str

class CharacterOut(BaseModel):
    id: str
    name: str
    description: Optional[str]
    user_id: str
    created_at: Optional[str]
    status: Optional[str]
    model_url: Optional[str]

# For Supabase table mapping (if needed)
class CharacterDB(BaseModel):
    id: str
    name: str
    description: Optional[str]
    user_id: str
    created_at: Optional[str]
    status: Optional[str]
    model_url: Optional[str] 