from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from app.utils import get_current_user
from app.db import supabase
from app.models.character import CharacterCreate, CharacterOut
from typing import List
import os
import shutil

router = APIRouter(prefix="/characters", tags=["characters"])

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/", response_model=CharacterOut)
def create_character(
    name: str = Form(...),
    description: str = Form(None),
    dataset: UploadFile = File(...),
    user_id: str = Depends(get_current_user)
):
    # Save uploaded file
    ext = os.path.splitext(dataset.filename)[1]
    if ext not in [".txt", ".json", ".csv"]:
        raise HTTPException(status_code=400, detail="Invalid file type")
    file_path = os.path.join(UPLOAD_DIR, f"{user_id}_{name}{ext}")
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(dataset.file, buffer)
    # Insert character metadata
    result = supabase.table("characters").insert({
        "name": name,
        "description": description,
        "user_id": user_id,
        "status": "pending",
        "model_url": None
    }).execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Character creation failed")
    char = result.data[0]
    return CharacterOut(**char)

@router.get("/", response_model=List[CharacterOut])
def list_characters(user_id: str = Depends(get_current_user)):
    result = supabase.table("characters").select("*").eq("user_id", user_id).execute()
    return [CharacterOut(**c) for c in result.data]

@router.get("/{character_id}", response_model=CharacterOut)
def get_character(character_id: str, user_id: str = Depends(get_current_user)):
    result = supabase.table("characters").select("*").eq("id", character_id).eq("user_id", user_id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Character not found")
    return CharacterOut(**result.data)

@router.put("/{character_id}", response_model=CharacterOut)
def update_character(
    character_id: str,
    name: str = Form(None),
    description: str = Form(None),
    user_id: str = Depends(get_current_user)
):
    update_data = {}
    if name is not None:
        update_data["name"] = name
    if description is not None:
        update_data["description"] = description
    if not update_data:
        raise HTTPException(status_code=400, detail="No update fields provided")
    result = supabase.table("characters").update(update_data).eq("id", character_id).eq("user_id", user_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Character not found or not updated")
    return CharacterOut(**result.data[0])

@router.delete("/{character_id}")
def delete_character(character_id: str, user_id: str = Depends(get_current_user)):
    result = supabase.table("characters").delete().eq("id", character_id).eq("user_id", user_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Character not found or not deleted")
    return {"ok": True, "id": character_id} 