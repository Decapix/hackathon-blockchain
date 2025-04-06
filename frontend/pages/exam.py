import streamlit as st
from questions import QUESTIONS

# Configuration de la page
st.set_page_config(page_title="Sélection d'examen", layout="centered")

# CSS personnalisé pour une interface claire et accueillante avec des touches roses
st.markdown("""
<style>
    /* Fond global clair */
    .stApp {
        background-color: #ffffff;
        color: #333333;
    }
    
    /* Titre stylisé avec dégradé rose */
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
    
    /* Cadre pour la sélection d'examen */
    .exam-container {
        background-color: #f8f9fa;
        border-radius: 15px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        padding: 30px;
        margin: 20px auto;
        max-width: 700px;
        border-top: 5px solid #a80464;
    }
    
    /* Style pour les textes explicatifs */
    .exam-intro {
        color: #555;
        font-size: 1.1em;
        line-height: 1.6;
        margin-bottom: 25px;
        text-align: center;
    }
    
    /* Style pour le sélecteur d'examen */
    .stSelectbox > div > div {
        background-color: #ffffff;
        border: 2px solid #a80464;
        border-radius: 10px;
        padding: 5px;
    }
    
    .stSelectbox > div > div:hover {
        border-color: #a80464;
    }
    
    /* Info de l'examen */
    .exam-info {
        background-color: #f6f6f6;
        border-left: 4px solid #a80464;
        padding: 15px;
        margin: 20px 0;
        border-radius: 5px;
        font-size: 1.1em;
    }
    
    /* Bouton de démarrage */
    .stButton > button {
        background: linear-gradient(45deg, #a80464, #a80464);
        color: white;
        border: none;
        padding: 10px 25px;
        border-radius: 30px;
        font-weight: bold;
        font-size: 1.1em;
        transition: all 0.3s ease;
        width: 100%;
        margin-top: 15px;
    }
    
    .stButton > button:hover {
        background: linear-gradient(45deg, #a80464, #a80464);
        box-shadow: 0 5px 15px rgba(168, 4, 100, 0.4);
        transform: translateY(-2px);
    }
    
    /* Badge pour le nombre de questions */
    .question-badge {
        display: inline-block;
        background-color: #a80464;
        color: white;
        border-radius: 20px;
        padding: 5px 15px;
        font-weight: bold;
        margin-left: 10px;
    }
    
    /* Icônes */
    .exam-icon {
        font-size: 3em;
        text-align: center;
        margin-bottom: 15px;
        color: #a80464;
    }
</style>
""", unsafe_allow_html=True)

def main():
    # Titre de la page
    st.title("Sélection d'examen")
    
    # Contenu principal dans un conteneur stylisé
    st.markdown('<div class="exam-container">', unsafe_allow_html=True)
    
    # Icône et introduction
    st.markdown('<div class="exam-icon">📝</div>', unsafe_allow_html=True)
    st.markdown("""
    <p class="exam-intro">
        Bienvenue sur la plateforme de certification Bahamut Blockchain. 
        Choisissez l'examen que vous souhaitez passer pour valider vos compétences 
        et obtenir une certification sécurisée sur la blockchain.
    </p>
    """, unsafe_allow_html=True)
    
    # Sélection de l'examen avec style
    st.markdown("<h3 style='text-align: center; color: #333;'>Choisissez votre examen</h3>", unsafe_allow_html=True)
    exams = list(QUESTIONS.keys())
    exam_names = {
        "exam1": "Fondamentaux de la Blockchain",
        "exam2": "Smart Contracts & Applications Décentralisées",
        "exam3": "Sécurité & Cryptographie Avancée"
    }
    
    # Create display names for the exams
    display_names = [exam_names.get(key, key) for key in exams]
    
    # Use display names for selection
    selected_display_name = st.selectbox("", display_names)
    
    # Map back to actual key
    for key, name in exam_names.items():
        if name == selected_display_name:
            exam = key
            break
    else:
        # If not found in map, use the display name as key
        exam = selected_display_name
    
    # Affichage d'informations sur l'examen sélectionné avec style
    st.markdown(f"""
    <div class="exam-info">
        <strong>Détails de l'examen :</strong><br>
        Cet examen contient <span class="question-badge">{len(QUESTIONS[exam])}</span> questions.<br>
        Durée recommandée : {len(QUESTIONS[exam]) * 2} minutes<br>
        Succès à partir de 60% de réponses correctes
    </div>
    """, unsafe_allow_html=True)
    
    # Bouton de validation
    if st.button("Commencer l'examen"):
        # Stockage de l'examen sélectionné dans la session state
        st.session_state.selected_exam = exam
        # Redirection vers la page de test
        st.query_params.update({"exam": exam})
        st.switch_page("pages/test.py")
    
    st.markdown('</div>', unsafe_allow_html=True)

if __name__ == "__main__":
    main()