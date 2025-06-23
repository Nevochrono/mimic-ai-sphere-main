from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: str
    email: EmailStr
    created_at: Optional[str]

# For Supabase table mapping (if needed)
class UserDB(BaseModel):
    id: str
    email: EmailStr
    hashed_password: str
    created_at: Optional[str] 