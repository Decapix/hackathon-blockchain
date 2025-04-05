from fastapi import APIRouter, Query
import logging
from utils_session import *
from __init__ import supabase
from models import UserModel
from db import db, User


router = APIRouter()

@router.get("/")
async def home(n: int = 10):
    """home"""
    logging.error("home call")
    return {"who are the best ?": "us of course"}







@router.post("/create_user/")
async def create_user(user: UserModel):
    # Vérifiez si l'utilisateur existe déjà dans la base de données
    if db.search(User.username == user.username):
        raise HTTPException(status_code=400, detail="User already exists")

    # Insérez l'utilisateur dans la base de données
    db.insert(user.dict())

    return {"message": "User created successfully", "user": user}

# curl -X POST "http://localhost:8502/create_user/" \
#      -H "Content-Type: application/json" \
#      -d '{
#            "username": "johndoe",
#            "emailgoogle": "johndoe@gmail.com",
#            "address_wallet": "0x123456789abcdef"
#          }'

@router.get("/get_users/")
async def get_users():
    # Récupérez tous les utilisateurs de la base de données
    users = db.all()
    return users

# curl -X GET "http://localhost:8502/get_users/"                                                                                      7 ↵


@router.get("/get_user/{username}")
async def get_user(username: str):
    # Récupérez les données de l'utilisateur spécifié
    user_data = db.search(User.username == username)
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
    return user_data
