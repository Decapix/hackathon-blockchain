import streamlit as st

# Configuration de la page
st.set_page_config(page_title="Certifications", page_icon="🏆", layout="centered")

# CSS personnalisé pour une interface plus claire et conviviale avec des touches roses
st.markdown("""
<style>
    /* Fond clair et accueillant */
    .stApp {
        background-color: #ffffff;
        color: #333333;
    }
    
    /* En-tête avec dégradé rose */
    h1 {
        background: linear-gradient(90deg, #a80464, #a80464);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        padding: 20px 0;
        font-size: 3em;
        font-weight: bold;
        text-align: center;
        margin-bottom: 1.5rem;
    }
    
    /* Style des cartes de certification */
    .certification-card {
        background-color: #f8f9fa;
        border-radius: 15px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        padding: 20px;
        margin-bottom: 20px;
        border-left: 5px solid #a80464;
        transition: transform 0.3s ease;
    }
    
    .certification-card:hover {
        transform: translateY(-5px);
    }
    
    .certification-title {
        color: #333;
        font-size: 1.5em;
        font-weight: bold;
        margin-bottom: 10px;
    }
    
    .certification-description {
        color: #555;
        margin-bottom: 15px;
    }
    
    /* Bouton personnalisé */
    .pink-button {
        background-color: #a80464;
        color: white;
        padding: 8px 20px;
        border-radius: 30px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-weight: 600;
        margin-top: 10px;
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .pink-button:hover {
        background-color: #c20579;
        box-shadow: 0 4px 8px rgba(168, 4, 100, 0.3);
    }
</style>
""", unsafe_allow_html=True)

# Vérification de la connexion
if not st.session_state.get('logged_in', False):
    st.query_params(page="main")

# En-tête de la page
st.title("Vos Certifications")

# Conteneur principal
st.markdown("""
<div style="max-width: 800px; margin: 0 auto; padding: 20px;">
    <p style="font-size: 1.2em; text-align: center; margin-bottom: 30px;">
        Voici les certifications disponibles sur la blockchain Bahamut
    </p>
    
    <div class="certification-card">
        <div class="certification-title">Développeur Blockchain Niveau 1</div>
        <div class="certification-description">
            Cette certification valide vos compétences fondamentales en développement blockchain,
            incluant la programmation de smart contracts et l'interaction avec des DApps.
        </div>
        <a href="#" class="pink-button">Voir les détails</a>
    </div>
    
    <div class="certification-card">
        <div class="certification-title">Sécurité Cryptographique</div>
        <div class="certification-description">
            Cette certification atteste de votre expertise en matière de sécurité blockchain,
            cryptographie avancée et audit de smart contracts.
        </div>
        <a href="#" class="pink-button">Voir les détails</a>
    </div>
    
    <div class="certification-card">
        <div class="certification-title">Tokenomics & Économie Web3</div>
        <div class="certification-description">
            Cette certification démontre votre compréhension des mécanismes économiques
            de la blockchain, la conception de tokenomics et les modèles économiques Web3.
        </div>
        <a href="#" class="pink-button">Voir les détails</a>
    </div>
</div>
""", unsafe_allow_html=True)