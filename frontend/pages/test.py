import streamlit as st
import time
from gaze_tracker import quick_capture_webcam
from questions import QUESTIONS

# Configuration de la page
st.set_page_config(page_title="Examen en cours", layout="wide")

# CSS personnalisé pour les animations
st.markdown("""
<style>
    /* Animation de victoire */
    @keyframes victory {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
    
    .victory-animation {
        text-align: center;
        color: #2ECC71;
        font-size: 3em;
        font-weight: bold;
        animation: victory 1s ease-in-out infinite;
    }
    
    /* Animation de défaite */
    @keyframes defeat {
        0% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        50% { transform: translateX(10px); }
        100% { transform: translateX(0); }
    }
    
    .defeat-animation {
        text-align: center;
        color: #E74C3C;
        font-size: 3em;
        font-weight: bold;
        animation: defeat 0.5s ease-in-out infinite;
    }
    
    /* Style des boutons de navigation */
    .nav-btn {
        background: linear-gradient(45deg, #2C3E50, #3498DB);
        color: white;
        border: none;
        border-radius: 20px;
        padding: 0.5rem 2rem;
        transition: all 0.3s;
        width: 200px;
        margin: 0.5rem;
    }
    
    .nav-btn:hover {
        background: linear-gradient(45deg, #3498DB, #2C3E50);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
    }
    
    /* Style pour les questions */
    .question-container {
        background: rgba(44, 62, 80, 0.1);
        padding: 20px;
        border-radius: 15px;
        margin-bottom: 2rem;
    }
    
    .progress-bar {
        height: 10px;
        background: linear-gradient(45deg, #3498DB, #2ECC71);
        border-radius: 5px;
        transition: width 0.3s ease;
    }
    
    .question-number {
        text-align: center;
        font-size: 1.2em;
        color: #3498DB;
        margin-bottom: 1rem;
    }
</style>
""", unsafe_allow_html=True)

# Fonction pour afficher l'indicateur de surveillance réel
def display_monitoring_status():
    """Affiche un indicateur de surveillance basé sur les données réelles"""
    st.sidebar.markdown("### Surveillance", unsafe_allow_html=True)
    
    # Indicateur de surveillance active
    st.sidebar.success("🔍 Surveillance active")
    
    # Afficher le pourcentage de triche actuel
    cheat_percentage = st.session_state.get('cheat_percentage', 0)
    
    # Mettre à jour régulièrement le taux de triche avec une mini-vérification
    if st.sidebar.button("Analyser mon comportement actuel"):
        with st.spinner("Analyse en cours..."):
            new_percentage = quick_capture_webcam(duration_seconds=2)
            st.session_state.cheat_percentage = max(cheat_percentage, new_percentage)
    
    # Afficher l'indicateur approprié
    if cheat_percentage > 30:
        st.sidebar.warning(f"⚠️ Comportement suspect détecté: {cheat_percentage:.1f}%")
    else:
        st.sidebar.info(f"✅ Comportement normal: {cheat_percentage:.1f}%")

# Fonction pour gérer le changement automatique de question
def handle_answer_change():
    current_index = st.session_state.current_question_index
    total_questions = len(QUESTIONS[st.session_state.selected_exam])
    
    # Enregistrer la réponse
    answer_key = f"q_{current_index}"
    if answer_key in st.session_state:
        st.session_state.answers[current_index] = st.session_state[answer_key]
        
        # Passer automatiquement à la question suivante si ce n'est pas la dernière
        if current_index < total_questions - 1:
            st.session_state.current_question_index += 1

def display_results(questions):
    """Affiche les résultats de l'examen avec animation"""
    score = st.session_state.score
    cheat_percentage = st.session_state.get('cheat_percentage', 0)
    
    # Affichage du statut de surveillance dans la barre latérale
    display_monitoring_status()
    
    # Déterminer si c'est une victoire ou une défaite
    is_victory = score >= 60 and cheat_percentage < 50
    
    # Affichage du résultat avec animation
    if is_victory:
        st.markdown(f"<div class='victory-animation'>FÉLICITATIONS!</div>", unsafe_allow_html=True)
        st.balloons()  # Animation de ballons
    else:
        st.markdown(f"<div class='defeat-animation'>ÉCHEC</div>", unsafe_allow_html=True)
    
    # Afficher le score
    st.markdown(f"<h2 style='text-align: center;'>Votre score: {score:.1f}%</h2>", unsafe_allow_html=True)
    
    # Afficher le taux de triche
    if cheat_percentage > 0:
        st.markdown(f"<h3 style='text-align: center;'>Taux de triche détecté: {cheat_percentage:.1f}%</h3>", unsafe_allow_html=True)
    
    # Résumé des réponses
    st.subheader("Vos réponses:")
    
    for i, q in enumerate(questions):
        correct = q['correct_answer']
        user_answer = st.session_state.answers.get(i, "Pas de réponse")
        is_correct = user_answer == correct
        
        col1, col2, col3 = st.columns([3, 1, 1])
        with col1:
            st.write(f"Q{i+1}: {q['question']}")
        with col2:
            st.write(f"Votre réponse: {user_answer}")
        with col3:
            if is_correct:
                st.success("Correct ✓")
            else:
                st.error(f"Incorrect ✗ (Réponse: {correct})")
    
    # Bouton pour retourner à l'accueil
    if st.button("Retour à l'accueil"):
        # Réinitialiser les variables de session liées à l'examen
        st.session_state.current_question_index = 0
        st.session_state.answers = {}
        st.session_state.exam_finished = False
        # Redirection vers la page d'accueil
        st.switch_page("pages/home.py")

def calculate_score(questions, answers):
    """Calcule le score basé sur les réponses fournies"""
    score = 0
    total = len(questions)
    
    for i, q in enumerate(questions):
        if i in answers and answers[i] == q['correct_answer']:
            score += 1
    
    return (score / total) * 100 if total > 0 else 0

def main():
    # Affichage du statut de surveillance dans la barre latérale
    display_monitoring_status()
    # Récupération de l'examen sélectionné
    if 'selected_exam' in st.session_state:
        exam = st.session_state.selected_exam
    else:
        # Utilisation de la nouvelle API de query_params
        query_params = st.query_params
        if 'exam' in query_params:
            exam = query_params['exam']
        else:
            st.error("Aucun examen sélectionné. Veuillez retourner à la page de sélection d'examen.")
            if st.button("Retour à la sélection d'examen"):
                st.switch_page("pages/exam.py")
            st.stop()
    
    # Récupération des questions de l'examen sélectionné
    questions = QUESTIONS[exam]
    total_questions = len(questions)
    
    # Initialisation des variables de session si ce n'est pas déjà fait
    if 'current_question_index' not in st.session_state:
        st.session_state.current_question_index = 0
        # Lancement de la capture webcam dès la première question (version non-bloquante)
        with st.spinner("Initialisation du système de surveillance..."):
            cheat_percentage = quick_capture_webcam(duration_seconds=3)
            st.session_state.cheat_percentage = cheat_percentage
    
    if 'answers' not in st.session_state:
        st.session_state.answers = {}
    
    if 'exam_finished' not in st.session_state:
        st.session_state.exam_finished = False
    
    # Affichage du titre et de la progression
    st.title(f"Examen: {exam}")
    
    # Si l'examen est terminé, afficher le résultat
    if st.session_state.exam_finished:
        display_results(questions)
    else:
        # Affichage de la barre de progression
        progress = (st.session_state.current_question_index + 1) / total_questions
        st.progress(progress)
        st.markdown(f"<div class='question-number'>Question {st.session_state.current_question_index + 1} / {total_questions}</div>", unsafe_allow_html=True)
        
        # Affichage de la question actuelle
        current_index = st.session_state.current_question_index
        q = questions[current_index]
        
        # Conteneur de la question
        st.markdown("<div class='question-container'>", unsafe_allow_html=True)
        st.subheader(f"{q['question']}")
        
        # Récupérer la réponse précédente s'il y en a une
        previous_answer = st.session_state.answers.get(current_index, None)
        index_option = None
        if previous_answer in q['answers']:
            index_option = q['answers'].index(previous_answer)
        
        # Affichage des options de réponse avec la fonction de callback
        selected = st.radio(
            "Choisissez votre réponse",
            q['answers'],
            key=f"q_{current_index}",
            index=index_option,
            on_change=handle_answer_change
        )
        
        st.markdown("</div>", unsafe_allow_html=True)
        
        # Message d'info sur la navigation automatique
        if current_index < total_questions - 1:
            st.info("Sélectionnez une réponse pour passer automatiquement à la question suivante")
        else:
            st.info("Dernière question. Sélectionnez une réponse, puis cliquez sur 'Terminer l'examen'")
        
        # Bouton visible uniquement sur la dernière question
        if current_index == total_questions - 1:
            if st.button("✅ Terminer l'examen", use_container_width=True):
                # Récupération du pourcentage de triche déjà calculé
                cheat_percentage = st.session_state.get('cheat_percentage', 0)
                # On fait une dernière vérification plus longue pour s'assurer de la précision
                with st.spinner("Vérification finale du comportement pendant l'examen..."):
                    final_percentage = quick_capture_webcam(duration_seconds=5)
                    cheat_percentage = max(cheat_percentage, final_percentage)
                
                # Calcul du score
                score = calculate_score(questions, st.session_state.answers)
                st.session_state.score = score
                st.session_state.exam_name = exam
                st.session_state.exam_finished = True
                
                st.success("Examen terminé ! Vos résultats sont en cours de calcul...")
                time.sleep(1)  # Petite pause pour l'effet
                st.experimental_rerun()

if __name__ == "__main__":
    main()
