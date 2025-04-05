from fastapi import APIRouter, Query, HTTPException, Body, Request
import logging
from utils_session import *
from __init__ import supabase
from models import UserModel, ExamSession
from db import db, User, exam_sessions_table, exam_results_table, Session, Result
import time
import uuid
import json


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


@router.get("/test/")
async def test_route():
    """Simple test route to verify routing is working"""
    return {"status": "success", "message": "Test route is working"}


@router.post("/exam/start")
async def start_exam(request: Request):
    """Start a new exam session"""
    # Récupérer les données JSON du corps de la requête
    req_data = await request.json()

    # Extraire les données du JSON
    email = req_data.get("email")
    exam_id = req_data.get("exam_id")
    exam_name = req_data.get("exam_name", "Unknown Exam")

    if not email or not exam_id:
        return {"status": "error", "message": "Email and exam_id are required"}

    # Créer un ID de session unique
    session_id = str(uuid.uuid4())
    timestamp = int(time.time())

    # Créer un enregistrement dans la table "exam_sessions"
    session_data = {
        "email": email,
        "exam_id": exam_id,
        "exam_name": exam_name,
        "timestamp": timestamp,
        "session_id": session_id
    }

    # Stocker les données dans la table exam_sessions
    exam_sessions_table.insert(session_data)

    return {
        "status": "success",
        "message": "Exam session started",
        "session_id": session_id,
        "email": email,
        "exam_id": exam_id,
        "timestamp": timestamp
    }


@router.post("/exam/results")
async def submit_results(request: Request):
    """Submit exam results"""
    # Récupérer les données JSON du corps de la requête
    req_data = await request.json()

    # Extraire les données du JSON
    email = req_data.get("email")
    exam_id = req_data.get("exam_id")
    score = req_data.get("score")
    cheat_score = req_data.get("cheat_score")
    passed = req_data.get("passed")
    details = req_data.get("details", {})

    if not all([email, exam_id, score is not None, cheat_score is not None, passed is not None]):
        return {"status": "error", "message": "Missing required fields"}

    # Créer un enregistrement pour les résultats
    result_data = {
        "email": email,
        "exam_id": exam_id,
        "score": score,
        "cheat_score": cheat_score,
        "passed": passed,
        "details": details,
        "timestamp": int(time.time())
    }

    # Stocker les données dans la table exam_results
    exam_results_table.insert(result_data)

    return {
        "status": "success",
        "message": "Exam results submitted successfully",
        "certified": passed and cheat_score < 0.3
    }


@router.get("/exam/results/{email}")
async def get_results(email: str):
    """Get exam results for a specific user"""
    # Recherche des résultats pour cet email
    results = exam_results_table.search(Result.email == email)

    if not results:
        return {"status": "not_found", "message": "No results found for this email"}

    # Format the results
    formatted_results = []
    for result in results:
        formatted_result = {
            "exam_id": result["exam_id"],
            "score": result["score"],
            "passed": result["passed"],
            "certified": result["passed"] and result["cheat_score"] < 0.3,
            "timestamp": result["timestamp"]
        }
        formatted_results.append(formatted_result)

    return {
        "status": "success",
        "email": email,
        "results": formatted_results
    }




@router.get("/get_last_exam", response_model=Optional[ExamSession])
def get_last_exam():
    sessions = [s for s in db.all() if "timestamp" in s]
    if not sessions:
        return None
    last_session = max(sessions, key=lambda x: x["timestamp"])
    return ExamSession(**last_session)
