import streamlit as st
import cv2
import time
import requests
from GazeTracking.gaze_tracking import GazeTracking
from questions import QUESTIONS

# CSS personnalisé pour une interface claire et conviviale
st.markdown("""
<style>
    /* Fond clair global */
    .stApp {
        background-color: #ffffff;
        color: #333333;
        font-family: 'Arial', sans-serif;
    }
    
    /* Dégradé du titre principal */
    .title-gradient {
        background: linear-gradient(45deg, #a80464, #a80464);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-size: 2.5em;
        font-weight: bold;
        text-align: center;
        margin-bottom: 1.5rem;
    }
    
    /* Conteneur global */
    .exam-container {
        background-color: white;
        border-radius: 15px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
        padding: 25px;
        margin: 10px 0;
    }
    
    /* Style pour les questions */
    .question-header {
        background-color: #f8f9fa;
        border-left: 4px solid #a80464;
        padding: 10px 15px;
        margin: 15px 0;
        border-radius: 5px;
        font-size: 1.2em;
        color: #333;
    }
    
    /* Style pour les options de réponse */
    .stRadio > div {
        background-color: white;
        border-radius: 10px;
        padding: 10px;
    }
    
    .stRadio label {
        color: #333;
        font-size: 1.1em;
        padding: 8px;
        transition: all 0.2s ease;
    }
    
    .stRadio label:hover {
        background-color: #f8f9fa;
        border-radius: 8px;
    }
    
    /* Bouton de validation */
    .stButton > button {
        background: linear-gradient(45deg, #a80464, #a80464);
        color: white;
        font-weight: bold;
        font-size: 1.1em;
        padding: 0.75em 2em;
        border: none;
        border-radius: 30px;
        transition: all 0.3s ease;
    }
    
    .stButton > button:hover {
        background: linear-gradient(45deg, #a80464, #a80464);
        box-shadow: 0 5px 15px rgba(168, 4, 100, 0.4);
        transform: translateY(-2px);
    }
    
    /* Barre de progression stylisée */
    .progress-container {
        background-color: #f0f0f0;
        width: 100%;
        height: 10px;
        border-radius: 10px;
        margin: 1.5em 0;
        overflow: hidden;
    }
    
    .progress-bar {
        background: linear-gradient(90deg, #a80464, #a80464);
        height: 100%;
        border-radius: 10px;
        transition: width 0.5s ease-in-out;
        box-shadow: 0 2px 5px rgba(168, 4, 100, 0.3);
    }
    
    /* Écran de démarrage */
    .start-screen {
        text-align: center;
        padding: 30px 0;
    }
    
    .start-title {
        color: #a80464;
        font-size: 2.2em;
        font-weight: bold;
        margin-bottom: 20px;
    }
    
    /* Animations pour timer */
    @keyframes countdown {
        from { stroke-dashoffset: 0; }
        to { stroke-dashoffset: 565.48; }
    }
    
    /* Style du timer */
    .timer-circle {
        stroke: #a80464;
    }
    
    .timer-text {
        color: #a80464;
    }
    
    /* Résultats et animations */
    .success-container, .failure-container {
        background-color: #f8f9fa;
        border-radius: 15px;
        padding: 30px;
        margin-top: 20px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        animation: fadeIn 1s ease-out;
    }
    
    .success-title {
        color: #a80464;
        text-align: center;
        font-size: 2.5em;
        font-weight: bold;
        margin-bottom: 15px;
    }
    
    .success-subtitle, .failure-subtitle {
        color: #555;
        text-align: center;
        font-size: 1.5em;
        margin-bottom: 25px;
    }
    
    .score-display {
        color: #a80464;
        text-align: center;
        font-size: 3em;
        font-weight: bold;
        margin: 20px 0;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
</style>
""", unsafe_allow_html=True)

# --- Timer de démarrage ---
if 'timer_started' not in st.session_state:
    st.session_state.timer_started = False
    st.session_state.timer_completed = False

if not st.session_state.timer_started:
    st.session_state.timer_started = True
    
    # Écran de démarrage stylisé
    st.markdown('<div class="start-screen">', unsafe_allow_html=True)
    st.markdown('<div class="start-title">L\'examen va commencer...</div>', unsafe_allow_html=True)
    
    # Créer un conteneur centré pour le timer
    col1, col2, col3 = st.columns([1, 3, 1])
    with col2:
        timer_placeholder = st.empty()
    
    # Affiche un cercle qui fait un tour complet en 3 secondes avec couleur rose
    svg_code = f'''
    <div style="display: flex; justify-content: center; margin-top: 50px;">
        <div style="position: relative; width: 200px; height: 200px;">
            <svg width="200" height="200" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="90" fill="none" stroke="#f0f0f0" stroke-width="10"/>
                <circle cx="100" cy="100" r="90" fill="none" stroke="#a80464" stroke-width="10"
                    stroke-dasharray="565.48" 
                    stroke-dashoffset="0"
                    transform="rotate(-90, 100, 100)"
                    class="timer-circle"
                    style="animation: countdown 3s linear forwards;">
                    <animate 
                        attributeName="stroke-dashoffset" 
                        from="0" 
                        to="565.48" 
                        dur="3s" 
                        begin="0s" 
                        fill="freeze" />
                </circle>
            </svg>
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                       font-size: 70px; color: #a80464; font-weight: bold;" class="timer-text">
                3
            </div>
        </div>
    </div>
    <style>
        @keyframes countdown {{
            from {{ stroke-dashoffset: 0; }}
            to {{ stroke-dashoffset: 565.48; }}
        }}
    </style>
    '''
    
    timer_placeholder.markdown(svg_code, unsafe_allow_html=True)
    
    # Compte à rebours de 3 à 1 avec un seul cercle qui tourne
    for seconds_left in range(3, 0, -1):
        if seconds_left < 3:  # Update only the number for seconds 2 and 1
            timer_placeholder.markdown(
                svg_code.replace(f'font-size: 70px; color: #ff5c8d; font-weight: bold;" class="timer-text">\n                3', 
                                f'font-size: 70px; color: #ff5c8d; font-weight: bold;" class="timer-text">\n                {seconds_left}'),
                unsafe_allow_html=True
            )
        time.sleep(1)
    
    st.markdown('</div>', unsafe_allow_html=True)
    
    st.session_state.timer_completed = True
    st.rerun()

# Récupération des données d'examen depuis l'API
API_URL = "http://backend:8000/get_last_exam_global"

try:
    response = requests.get(API_URL)
    response.raise_for_status()
    data = response.json()
except requests.exceptions.RequestException as e:
    st.error(f"Erreur lors de la requête : {e}")

# --- Titre principal avec effet dégradé ---
st.markdown('<div class="title-gradient">Examen de Certification Bahamut</div>', unsafe_allow_html=True)

# --- Initialisation session ---
if 'question_index' not in st.session_state:
    st.session_state.question_index = 0
if 'user_answers' not in st.session_state:
    st.session_state.user_answers = []
if 'cheat_count' not in st.session_state:
    st.session_state.cheat_count = 0
if 'cheated_questions' not in st.session_state:
    st.session_state.cheated_questions = set()
if 'selected_exam' not in st.session_state:
    st.session_state.selected_exam = "exam2"

exam = st.session_state.selected_exam
total_questions = len(QUESTIONS[exam])

# --- Conteneur principal pour l'examen ---
# st.markdown('<div class="exam-container">', unsafe_allow_html=True)

# --- Barre de progression stylisée ---
progress_percent = int((st.session_state.question_index / len(QUESTIONS[st.session_state.selected_exam])) * 100)
if st.session_state.question_index + 1 <= total_questions:
    st.markdown(f"""
    <div class="progress-container">
        <div class="progress-bar" style="width:{progress_percent}%"></div>
    </div>
    <div style="text-align: right; font-size: 0.9em; color: #666; margin-bottom: 20px;">
        Question {st.session_state.question_index + 1} sur {total_questions}
    </div>
    """, unsafe_allow_html=True)

# --- Affichage des questions ---
if st.session_state.question_index < total_questions:
    q = QUESTIONS[exam][st.session_state.question_index]
    
    # Titre de la question avec style
    st.markdown(f"""
    <div class="question-header">
        <strong>Question {st.session_state.question_index + 1}:</strong> {q.get("text", "Répondez à la question suivante :")}
    </div>
    """, unsafe_allow_html=True)
    
    # Options de réponses avec style
    choice = st.radio("", q["options"], key=f"question_{st.session_state.question_index}")
    
    # Bouton de validation stylisé
    cols = st.columns([3, 1])
    with cols[1]:
        if st.button("Valider", key=f"submit_{st.session_state.question_index}"):
            st.session_state.user_answers.append(choice)
            st.session_state.question_index += 1
            st.rerun()

else:
    # Envoi des résultats à l'API
    API_URL = "http://backend:8000/update_exam"
    
    correct_answers = [q["correct_answer"] for q in QUESTIONS[exam]]
    score = sum(1 for user_answer, correct_answer in zip(st.session_state.user_answers, correct_answers) if user_answer == correct_answer) / total_questions
    cheat_percentage = (len(st.session_state.cheated_questions) / total_questions)
    passed = score >= 0.6 and cheat_percentage < 0.2
    score_percent = score * 100

    # Appel API
    try:
        response = requests.post(API_URL, json={
            "email": data["email"],
            "exam_id": data["exam_id"],
            "score": score,
            "cheat_score": cheat_percentage,
            "passed": passed,
            "details": {
                "total_questions": total_questions,
                "user_answers": st.session_state.user_answers,
                "cheated_questions": list(st.session_state.cheated_questions)
            }
        })
        response.raise_for_status()
    except Exception as e:
        st.error(f"Erreur lors de l'envoi des résultats: {e}")
    
    # Affichage des résultats avec style moderne et clair
    import datetime
    current_date = datetime.datetime.now().strftime("%d %B, %Y")
    
    # Animation de victoire professionnelle si le score est supérieur à 50%
    if passed:
        
        # Obtention de la date actuelle
        import datetime
        current_date = datetime.datetime.now().strftime("%d %B, %Y")
        
        success_html = f"""
        <div class="success-container">
            <h1 class="success-title">Congratulations !</h1>
            <h2 class="success-subtitle">You have passed the exam.</h2>
            <h3 class="score-display-failure">Your score : {score_percent:.2f}%</h3>
            <h3 class="score-display-cheating">Our fraud detection detected a 
            {cheat_percentage*100}% chance of cheating, you are therefore eligible.</h3>
        </div>
        """
        
        st.markdown(success_html, unsafe_allow_html=True)
    else:
        # Calcul du score en pourcentage

        # Message de suspicion de fraude
        if score_percent > 40:
            failure_subtitle = f"""
            We detected a too high chance of cheating."""
            fraud_message = f"""
            Our fraud detection detected a {cheat_percentage*100}% chance of cheating, 
            you are therefore not eligible."""
        else:
            failure_subtitle = f"""You have not reached the minimum score required."""
            fraud_message = f"""
            Our fraud detection detected a {cheat_percentage*100}% chance of cheating."""

        # HTML à afficher en cas d'échec
        failure_html = f"""
        <div class="failure-container">
            <h1 class="failure-title">Exam not validated</h1>
            <h2 class="failure-subtitle">{failure_subtitle}</h2>
            <h3 class="score-display-failure">Your score : {score_percent:.2f}%</h3>
            <h3 class="score-display-cheating">{fraud_message}</h3>
        </div>
        """

        st.markdown(failure_html, unsafe_allow_html=True)

start_webcam = st.sidebar.checkbox('Activer la caméra', key='webcam_checkbox')

if 'cap' not in st.session_state:
    st.session_state.cap = cv2.VideoCapture(0)

cap = st.session_state.cap
gaze = GazeTracking()

if start_webcam:
    st.sidebar.markdown('<div class="webcam-container">', unsafe_allow_html=True)
    if not cap.isOpened():
        cap.open(0)
    frame_placeholder = st.sidebar.empty()
    while st.session_state.webcam_checkbox:
        ret, frame = cap.read()
        if not ret:
            st.sidebar.error("Erreur lors de la capture de la vidéo.")
            break

        gaze.refresh(frame)
        new_frame = gaze.annotated_frame()

        # Détection du regard avec style plus moderne
        if gaze.is_right() or gaze.is_left():
            text = "⚠️ ATTENTION !"
            text_color = (168, 4, 100)  # Dark pink
            if st.session_state.question_index not in st.session_state.cheated_questions:
                st.session_state.cheated_questions.add(st.session_state.question_index)
        else:
            text = "👍 Regard centré"
            text_color = (50, 205, 50)  # Green

        # Texte plus professionnel et stylisé
        cv2.rectangle(new_frame, (30, 25), (290, 70), (255, 255, 255), -1)
        cv2.putText(new_frame, text, (40, 60), cv2.FONT_HERSHEY_SIMPLEX, 1, text_color, 2)
        
        frame = cv2.cvtColor(new_frame, cv2.COLOR_BGR2RGB)
        frame_placeholder.image(frame)
        time.sleep(0.03)
    st.sidebar.markdown('</div>', unsafe_allow_html=True)
else:
    if cap.isOpened():
        cap.release()
    
