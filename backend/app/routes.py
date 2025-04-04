from fastapi import APIRouter
import logging
from utils_session import *
from __init__ import supabase

router = APIRouter()

@router.get("/")
async def home(n: int = 10):
    """home"""
    logging.error("home call")
    return {"who are the best ?": "us of course"}


@router.post("/register", response_model=User)
async def register(user: UserCreate):
    logging.warning("Début de la fonction register")
    # Vérifier si l'utilisateur existe déjà
    existing_user = supabase.table("users").select("*").eq("email", user.email).execute()
    if existing_user.data:
        raise HTTPException(status_code=400, detail="Email déjà utilisé")

    logging.error("Creating user in Supabase")
    # Créer l'utilisateur dans Supabase
    new_user = supabase.auth.sign_up({
        "email": user.email,
        "password": user.password,
    })

    # Enregistrer l'utilisateur dans la table `users` (si nécessaire)
    supabase.table("users").insert({
        "id": new_user.user.id,
        "email": user.email,
    }).execute()

    return {"id": new_user.user.id, "email": user.email}


@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # Authentifier avec Supabase
    try:
        user = supabase.auth.sign_in_with_password({
            "email": form_data.username,
            "password": form_data.password,
        })
    except Exception as e:
        raise HTTPException(status_code=400, detail="Email ou mot de passe incorrect")

    # Créer un JWT
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/users/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/logout")
async def logout(token: str = Depends(oauth2_scheme)):
    # Invalider le JWT (nécessite une gestion côté client)
    # Supabase n'a pas de vrai "logout" côté serveur, donc on se contente de supprimer le token côté client.
    return {"message": "Déconnexion réussie"}
