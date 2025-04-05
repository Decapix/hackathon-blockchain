import streamlit as st

# Configuration de la page et style
st.set_page_config(page_title="Connexion", page_icon="🔑", layout="centered")

global CHEAT_LIST
CHEAT_LIST = []

# Custom CSS
st.markdown("""
<style>
    .stButton > button {
        background: linear-gradient(45deg, #2C3E50, #3498DB);
        color: white;
        border: none;
        border-radius: 20px;
        padding: 0.5rem 2rem;
        transition: all 0.3s;
    }
    .stButton > button:hover {
        background: linear-gradient(45deg, #3498DB, #2C3E50);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
    }
    .block-chain-title {
        background: linear-gradient(45deg, #3498DB, #2ECC71);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-size: 3em;
        font-weight: bold;
        text-align: center;
        margin-bottom: 2rem;
    }
</style>
""", unsafe_allow_html=True)

# Interface de connexion avec style blockchain
st.markdown('<h1 class="block-chain-title">DecapiX Login</h1>', unsafe_allow_html=True)

# Ajouter une image ou un logo blockchain (optionnel)
st.markdown("""
<div style='text-align: center; margin-bottom: 2rem;'>
    🔗 Secure Blockchain Authentication 🔒
</div>
""", unsafe_allow_html=True)

if st.button("Sign In"):
    st.session_state.logged_in = True
    st.switch_page("pages/home.py")