
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from supabase import create_client, Client
from typing import Optional
import os
from jose import JWTError, jwt
from datetime import datetime, timedelta
from __init__ import SUPABASE_URL, SUPABASE_KEY, ALGORITHM, SECRET_KEY, ACCESS_TOKEN_EXPIRE_MINUTES, oauth2_scheme

# Modèles Pydantic
class UserCreate(BaseModel):
    email: str
    password: str

class User(BaseModel):
    id: str
    email: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Fonction pour créer un JWT
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Fonction pour vérifier le JWT
async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Impossible de valider les identifiants",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception

    # Récupérer l'utilisateur depuis Supabase
    user = supabase.table("users").select("*").eq("email", email).execute()
    if not user.data:
        raise credentials_exception
    return user.data[0]

# Fonction pour vérifier le mot de passe (simplifié)
def verify_password(plain_password: str, hashed_password: str):
    # Ici, on suppose que Supabase gère le hash
    return True  # À remplacer par une vraie vérification en prod
