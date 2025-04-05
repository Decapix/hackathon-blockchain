from fastapi import APIRouter, Query
import logging
from utils_session import *
from web3dev import get_test_score, contract_address, infura_url, record_consent, start_test, complete_test
from __init__ import supabase
from web3 import Web3
from models import UserModel
from db import db, User


router = APIRouter()

@router.get("/")
async def home(n: int = 10):
    """home"""
    logging.error("home call")
    return {"who are the best ?": "us of course"}



# Exemple d'utilisation
if __name__ == "__main__":
    contract_abi = [
        # Ajoutez ici l'ABI de votre contrat
    ]
    user_address = '0xAdresseDeLUtilisateur'

    try:
        score = get_test_score(infura_url, contract_address, contract_abi, user_address)
        print(f"Le score de l'utilisateur est : {score}")
    except Exception as e:
        print(e)



@router.get("/items/")
async def read_item(name: str = Query(..., description="The name of the item"),
                    number: int = Query(..., description="The number associated with the item")):
    logging.error("read_item call")
    #
    user_address = '0xAdresseDeLUtilisateur'
    score = get_test_score(infura_url, contract_address, contract_abi, user_address)
    return {"name": name, "number": number}

# Modèle de données pour la requête
class TestRequest(BaseModel):
    email: str
    test_id: str
    total_questions: int
    correct_answers: int
    fraud_score: int
    metadata_uri: str

@router.post("/make_test")
async def make_test(request: TestRequest):
    try:
        email_hash = Web3.keccak(text=request.email)
        test_id = Web3.keccak(text=request.test_id)

        # Enregistrer le consentement
        record_consent(email_hash, test_id)

        # Démarrer le test
        start_test(test_id, request.total_questions)

        # Compléter le test
        complete_test(test_id, request.correct_answers, request.fraud_score, request.metadata_uri)

        return {"status": "Test completed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


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
