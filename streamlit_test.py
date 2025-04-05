import streamlit as st
import requests
import json
import uuid
import time
import pandas as pd
import random

# Configuration de la page
st.set_page_config(page_title="Test des routes d'examen", page_icon="🧪", layout="wide")

# URL du backend
BACKEND_URL = "http://localhost:8502"

# Fonction pour tester l'accès au backend
def check_backend():
    try:
        response = requests.get(f"{BACKEND_URL}/")
        if response.status_code == 200:
            st.success("✅ Backend accessible!")
            return True
        else:
            st.error(f"❌ Erreur de connexion au backend: {response.status_code}")
            return False
    except Exception as e:
        st.error(f"❌ Exception lors de la connexion au backend: {str(e)}")
        return False

# Fonction pour simuler le démarrage d'un examen
def start_exam(email, exam_id, exam_name):
    try:
        payload = {
            "email": email,
            "exam_id": exam_id,
            "exam_name": exam_name
        }
        
        with st.spinner("Démarrage de la session d'examen..."):
            response = requests.post(f"{BACKEND_URL}/exam/start", json=payload)
        
        if response.status_code == 200:
            st.success("✅ Session d'examen créée avec succès!")
            return response.json()
        else:
            st.error(f"❌ Erreur {response.status_code}: {response.text}")
            return None
    except Exception as e:
        st.error(f"❌ Exception: {str(e)}")
        return None

# Fonction pour simuler l'envoi des résultats
def submit_results(email, exam_id, score, cheat_score, passed, details=None):
    try:
        payload = {
            "email": email,
            "exam_id": exam_id,
            "score": score,
            "cheat_score": cheat_score,
            "passed": passed,
            "details": details or {}
        }
        
        with st.spinner("Envoi des résultats d'examen..."):
            response = requests.post(f"{BACKEND_URL}/exam/results", json=payload)
        
        if response.status_code == 200:
            st.success("✅ Résultats envoyés avec succès!")
            return response.json()
        else:
            st.error(f"❌ Erreur {response.status_code}: {response.text}")
            return None
    except Exception as e:
        st.error(f"❌ Exception: {str(e)}")
        return None

# Fonction pour récupérer les résultats
def get_results(email, exam_id=None):
    try:
        url = f"{BACKEND_URL}/exam/results/{email}"
        if exam_id is not None:
            url += f"?exam_id={exam_id}"
            
        with st.spinner("Récupération des résultats..."):
            response = requests.get(url)
        
        if response.status_code == 200:
            st.success("✅ Résultats récupérés avec succès!")
            return response.json()
        else:
            st.error(f"❌ Erreur {response.status_code}: {response.text}")
            return None
    except Exception as e:
        st.error(f"❌ Exception: {str(e)}")
        return None

# Interface utilisateur
st.title("🧪 Testeur de Routes d'Examen")

# Vérifier la connexion au backend
backend_ok = check_backend()

if not backend_ok:
    st.warning("Le backend n'est pas accessible. Les tests ne fonctionneront pas.")
    st.stop()

# Séparation en onglets
tab1, tab2, tab3 = st.tabs(["Démarrer un examen", "Envoyer des résultats", "Consulter les résultats"])

# Onglet 1: Démarrer un examen
with tab1:
    st.header("📝 Démarrer une session d'examen")
    
    with st.form("start_exam_form"):
        email = st.text_input("Email", value="test@example.com")
        exam_id = st.number_input("ID de l'examen", value=1, min_value=1)
        exam_name = st.text_input("Nom de l'examen", value="Certification Blockchain Security")
        
        submit_button = st.form_submit_button("Démarrer l'examen")
    
    if submit_button:
        session = start_exam(email, exam_id, exam_name)
        if session:
            st.json(session)
            # Stocker dans la session Streamlit pour les autres onglets
            st.session_state.last_session = session

# Onglet 2: Envoyer des résultats
with tab2:
    st.header("📊 Envoyer des résultats d'examen")
    
    # Récupérer les infos de la dernière session si disponible
    if "last_session" in st.session_state:
        last_session = st.session_state.last_session
        default_email = last_session.get("email", "test@example.com")
        default_exam_id = last_session.get("exam_id", 1)
    else:
        default_email = "test@example.com"
        default_exam_id = 1
    
    with st.form("submit_results_form"):
        email = st.text_input("Email", value=default_email)
        exam_id = st.number_input("ID de l'examen", value=default_exam_id, min_value=1)
        score = st.slider("Score", min_value=0, max_value=100, value=85)
        cheat_score = st.slider("Score de triche", min_value=0.0, max_value=1.0, value=0.15, step=0.01)
        passed = st.checkbox("Réussi?", value=True)
        
        # Détails supplémentaires
        st.subheader("Détails supplémentaires")
        correct_answers = st.text_input("Réponses correctes", value="17/20")
        time_spent = st.text_input("Temps passé", value="10 minutes")
        monitoring_events = st.number_input("Événements de surveillance", value=2, min_value=0)
        
        submit_button = st.form_submit_button("Envoyer les résultats")
    
    if submit_button:
        details = {
            "correct_answers": correct_answers,
            "time_spent": time_spent,
            "monitoring_events": monitoring_events
        }
        
        results = submit_results(email, exam_id, score, cheat_score, passed, details)
        if results:
            st.json(results)
            # Stocker dans la session Streamlit
            st.session_state.last_results = {
                "email": email,
                "exam_id": exam_id
            }

# Onglet 3: Consulter les résultats
with tab3:
    st.header("🔍 Consulter les résultats d'examen")
    
    # Récupérer les infos du dernier envoi si disponible
    if "last_results" in st.session_state:
        last_results = st.session_state.last_results
        default_email = last_results.get("email", "test@example.com")
        default_exam_id = last_results.get("exam_id", 1)
    else:
        default_email = "test@example.com"
        default_exam_id = 1
    
    with st.form("get_results_form"):
        email = st.text_input("Email", value=default_email)
        include_exam_id = st.checkbox("Filtrer par ID d'examen", value=True)
        exam_id = st.number_input("ID de l'examen", value=default_exam_id, min_value=1, disabled=not include_exam_id)
        
        submit_button = st.form_submit_button("Récupérer les résultats")
    
    if submit_button:
        if include_exam_id:
            results = get_results(email, exam_id)
        else:
            results = get_results(email)
        
        if results:
            st.json(results)
            
            # Créer un certificat pour les examens réussis
            if isinstance(results, list):
                # Si c'est une liste, prendre le premier résultat
                result = results[0] if results else None
            else:
                # Sinon c'est déjà un résultat unique
                result = results
                
            if result and result.get("passed"):
                st.subheader("🎓 Certificat de réussite")
                
                cert_id = result.get("certification_id", str(uuid.uuid4()))
                timestamp = result.get("timestamp", time.strftime("%Y-%m-%dT%H:%M:%S"))
                
                st.markdown(f"""
                <div style="border: 2px solid green; padding: 20px; border-radius: 10px; text-align: center;">
                    <h2>Certificat de Réussite</h2>
                    <p>Ce certificat est décerné à</p>
                    <h3>{email}</h3>
                    <p>pour avoir complété avec succès la</p>
                    <h4>Certification Blockchain Security</h4>
                    <p>Score: {result.get('score', '?')}/100</p>
                    <p>ID de Certification: {cert_id}</p>
                    <p>Date: {timestamp}</p>
                </div>
                """, unsafe_allow_html=True)