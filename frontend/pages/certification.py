import streamlit as st

# Configuration de la page
st.set_page_config(page_title="Certifications", page_icon="🏆", layout="centered")

# Vérification de la connexion
if not st.session_state.get('logged_in', False):
    st.query_params(page="main")

# Interface des certifications
st.title("Certifications")
st.write("Available certifications...")