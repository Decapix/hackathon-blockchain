import streamlit as st
from questions import QUESTIONS

# Configuration de la page
st.set_page_config(page_title="Sélection d'examen", layout="wide")

def main():
    st.title("Sélection d'examen")
    
    # Sélection de l'examen
    exam = st.selectbox("Sélectionnez un examen", list(QUESTIONS.keys()))
    
    # Affichage d'informations sur l'examen sélectionné
    st.write(f"Cet examen contient {len(QUESTIONS[exam])} questions.")
    
    # Bouton de validation
    if st.button("Commencer l'examen"):
        # Stockage de l'examen sélectionné dans la session state
        st.session_state.selected_exam = exam
        # Redirection vers la page de test
        st.query_params.update({"exam": exam})
        st.switch_page("pages/test.py")

if __name__ == "__main__":
    main()