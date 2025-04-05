import streamlit as st
import time
import threading
import cv2
from gaze_tracking import GazeTracking
from questions import QUESTIONS
from main import CHEAT_LIST

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

# Script de mise à jour automatique pour la sidebar
def add_auto_refresh_script():
    """Ajoute un script JS pour rafraîchir la page automatiquement"""
    refresh_rate = 1  # Rafraîchissement toutes les 1 secondes
    # Créer un script qui rafraîchit uniquement la sidebar
    st.sidebar.markdown(
        f"""
        <script>
            // Script pour rafraîchir régulièrement la webcam (contourne la limitation Streamlit)
            setInterval(function() {{
                // Générer un nouvel UUID pour forcer le rafraîchissement de l'image
                
                window.frameElement.src = window.frameElement.src.split('?')[0] + '?webcam_refresh=' + Math.random();
                
            }}, {refresh_rate * 1000});
            
        </script>
        """,
        unsafe_allow_html=True
    )

# Fonction pour capturer la webcam et détecter la triche en temps réel
def setup_webcam_monitor():
    # Créer un emplacement pour l'image de la webcam dans la sidebar
    st.sidebar.markdown("### Surveillance en temps réel", unsafe_allow_html=True)
    
    # Pour le rafraîchissement automatique
    add_auto_refresh_script()
    
    # Paramètre de l'URL pour forcer le rafraîchissement de l'image
    params = st.query_params
    webcam_refresh = params.get('webcam_refresh', [None])[0]
    
    # Emplacements pour l'affichage
    webcam_placeholder = st.sidebar.empty()
    stats_placeholder = st.sidebar.empty()
    
    # Initialiser ou mettre à jour la webcam à chaque passage
    try:
        # Démarrer la webcam
        cap = cv2.VideoCapture(0)
        
        if not cap.isOpened():
            st.sidebar.error("Impossible d'ouvrir la webcam. Vérifiez vos autorisations.")
            return
        
        # Initialiser le tracker de regard
        gaze = GazeTracking()
        
        # Ne pas effacer le CHEAT_LIST pour maintenir l'historique
        if 'cheat_count' not in st.session_state:
            st.session_state.cheat_count = 0
            st.session_state.total_frames = 0
        
        # Capturer une image
        ret, frame = cap.read()
        if not ret:
            st.sidebar.error("Erreur de lecture du flux vidéo")
            return
        
        # Analyser le regard
        gaze.refresh(frame)
        new_frame = gaze.annotated_frame()
        
        # Détecter la triche
        cheat = False
        if gaze.is_right() or gaze.is_left():
            cheat = True
            st.session_state.cheat_count += 1
        
        # Compter total des frames
        st.session_state.total_frames += 1
        
        # Calculer le pourcentage de triche directement (sans utiliser CHEAT_LIST global)
        if st.session_state.total_frames > 0:
            st.session_state.cheat_percentage = (st.session_state.cheat_count / st.session_state.total_frames) * 100
        
        # Afficher les statistiques
        cheat_percentage = st.session_state.cheat_percentage
        if cheat_percentage > 30:
            stats_placeholder.warning(f"⚠️ Triche détectée: {cheat_percentage:.1f}%")
        else:
            stats_placeholder.info(f"✅ Comportement normal: {cheat_percentage:.1f}%")
        
        # Afficher le compteur de frames pour débogage
        st.sidebar.caption(f"Frames traitées: {st.session_state.total_frames}")
        
        # Convertir et afficher l'image
        frame_rgb = cv2.cvtColor(new_frame, cv2.COLOR_BGR2RGB)
        webcam_placeholder.image(frame_rgb, channels="RGB", use_column_width=True)
        
        # Libérer la webcam
        cap.release()
        
    except Exception as e:
        st.sidebar.error(f"Erreur de surveillance: {e}")

# Fonction pour gérer le changement automatique de question
def handle_answer_change():
    """Gère le changement de réponse et la navigation entre les questions"""
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
    
    # Configurer la surveillance webcam en temps réel dans la barre latérale
    setup_webcam_monitor()
    
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
    # Configurer la surveillance webcam en temps réel dans la barre latérale
    setup_webcam_monitor()
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
        # Initialisation des compteurs de surveillance
        st.session_state.cheat_count = 0
        st.session_state.total_frames = 0
        st.session_state.cheat_percentage = 0
    
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
                # Utiliser le pourcentage de triche déjà collecté pendant l'examen
                cheat_percentage = st.session_state.cheat_percentage
                st.success("Analyse du comportement terminée.")
                
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
