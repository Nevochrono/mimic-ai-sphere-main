from fastapi import APIRouter, Depends, HTTPException, Form
from app.utils import get_current_user
from app.db import supabase

router = APIRouter(prefix="/training", tags=["training"])

@router.post("/trigger")
def trigger_training(
    character_id: str = Form(...),
    user_id: str = Depends(get_current_user)
):
    # In a real implementation, trigger a background job or external service
    # For now, just update status to 'training'
    result = supabase.table("characters").update({"status": "training"}).eq("id", character_id).eq("user_id", user_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Character not found or not updated")
    return {"ok": True, "character_id": character_id, "status": "training"}

@router.post("/complete")
def complete_training(
    character_id: str = Form(...),
    model_url: str = Form(...),
    user_id: str = Depends(get_current_user)
):
    # Mark training as complete and set model URL
    result = supabase.table("characters").update({"status": "ready", "model_url": model_url}).eq("id", character_id).eq("user_id", user_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Character not found or not updated")
    return {"ok": True, "character_id": character_id, "status": "ready", "model_url": model_url} 