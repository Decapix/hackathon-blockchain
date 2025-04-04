from supabase import create_client, Client
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from dotenv import load_dotenv
import os

load_dotenv()
# Configuration Supabase
SUPABASE_URL = "http://supabase-kong:8000"
SUPABASE_KEY = os.getenv("SERVICE_ROLE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Configuration JWT (pour l'authentification)
SECRET_KEY = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


# Schéma OAuth2 pour le login
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
