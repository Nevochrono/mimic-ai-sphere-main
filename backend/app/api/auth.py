from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from app.db import supabase
from app.models.user import UserCreate, UserOut
import os

router = APIRouter(prefix="/auth", tags=["auth"])

SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 1 week

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

@router.post("/register", response_model=UserOut)
def register(user: UserCreate):
    # Check if user exists
    existing = supabase.table("users").select("id").eq("email", user.email).execute()
    if existing.data:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = get_password_hash(user.password)
    result = supabase.table("users").insert({
        "email": user.email,
        "hashed_password": hashed_password
    }).execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Registration failed")
    user_row = result.data[0]
    return UserOut(id=user_row["id"], email=user_row["email"], created_at=user_row["created_at"])

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

@router.post("/login", response_model=Token)
def login(req: LoginRequest):
    user = supabase.table("users").select("id, email, hashed_password").eq("email", req.email).single().execute()
    if not user.data:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not verify_password(req.password, user.data["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": user.data["id"]})
    return Token(access_token=token)

def decode_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return str(user_id)
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token") 