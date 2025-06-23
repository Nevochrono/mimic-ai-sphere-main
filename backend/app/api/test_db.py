from fastapi import APIRouter
from app.db import supabase

router = APIRouter()

@router.get("/test-db")
def test_db():
    try:
        users = supabase.table("users").select("id, email, created_at").limit(5).execute()
        return {"ok": True, "users": users.data}
    except Exception as e:
        return {"ok": False, "error": str(e)} 