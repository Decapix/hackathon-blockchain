import streamlit as st
import cv2
import time
import requests
from GazeTracking.gaze_tracking import GazeTracking
from questions import QUESTIONS

# --- Timer de démarrage ---
if 'timer_started' not in st.session_state:
    st.session_state.timer_started = False
    st.session_state.timer_completed = False

if not st.session_state.timer_started:
    st.session_state.timer_started = True
    
    st.markdown("<h1 style='text-align: center;'>Test will start in...</h1>", unsafe_allow_html=True)
    
    # Créer un conteneur centré pour le timer
    col1, col2, col3 = st.columns([1, 3, 1])
    with col2:
        timer_placeholder = st.empty()
    
    # Affiche un cercle qui fait un tour complet en 3 secondes
    svg_code = f'''
    <div style="display: flex; justify-content: center; margin-top: 50px;">
        <div style="position: relative; width: 200px; height: 200px;">
            <svg width="200" height="200" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="90" fill="none" stroke="#f0f0f0" stroke-width="10"/>
                <circle cx="100" cy="100" r="90" fill="none" stroke="#a80464" stroke-width="10"
                    stroke-dasharray="565.48" 
                    stroke-dashoffset="0"
                    transform="rotate(-90, 100, 100)"
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
                       font-size: 70px; color: #a80464; font-weight: bold;">
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
                svg_code.replace(f'font-size: 70px; color: #a80464; font-weight: bold;">\n                3', 
                                f'font-size: 70px; color: #a80464; font-weight: bold;">\n                {seconds_left}'),
                unsafe_allow_html=True
            )
        time.sleep(1)
    
    st.session_state.timer_completed = True
    st.rerun()

API_URL = "http://backend:8000/get_last_exam_global"

try:
    response = requests.get(API_URL)
    response.raise_for_status()
    data = response.json()

    # if data:
    #     st.subheader("Détails de l'examen")
    #     for key, value in data.items():
    #         st.write(f"**{key}**: {value}")
    # else:
    #     st.info("Aucun examen trouvé.")

except requests.exceptions.RequestException as e:
    st.error(f"Erreur lors de la requête : {e}")


# --- Style personnalisé ---
st.markdown(
    """
    <style>
    /* Fond clair global */
    body {
        background-color: #ffffff;
        color: #333333;
        font-family: 'Arial', sans-serif;
    }

    /* Dégradé du titre */
    .title-gradient {
        background: linear-gradient(45deg, #a80464, #a80464);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-size: 2.5em;
        font-weight: bold;
        text-align: center;
        margin-bottom: 1.5rem;
    }

    /* Style du bouton Valider */
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

    /* Radios */
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

    /* Barre de progression en rose */
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

    /* Question header */
    .question-header {
        background-color: #f8f9fa;
        border-left: 4px solid #a80464;
        padding: 10px 15px;
        margin: 15px 0;
        border-radius: 5px;
        font-size: 1.2em;
        color: #333;
    }
    </style>
    """,
    unsafe_allow_html=True
)

# --- Titre avec effet dégradé ---
st.markdown('<div class="title-gradient">Blockchain Pro</div>', unsafe_allow_html=True)

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
    st.session_state.selected_exam = "Blockchain Pro"

exam = st.session_state.selected_exam
total_questions = len(QUESTIONS[data["exam_id"]])

# --- Barre de progression stylisée ---
progress_percent = int((st.session_state.question_index / len(QUESTIONS[st.session_state.selected_exam])) * 100)
st.markdown(f"""
<div class="progress-container">
    <div class="progress-bar" style="width:{progress_percent}%"></div>
</div>
<div style="text-align: right; font-size: 0.9em; color: #666; margin-bottom: 20px;">
    Question {st.session_state.question_index + 1} out of {total_questions}
</div>
""", unsafe_allow_html=True)


# --- Affichage des questions ---
if st.session_state.question_index < total_questions:
    q = QUESTIONS[exam][st.session_state.question_index]
    
    # Titre de la question avec style
    st.markdown(f"""
    <div class="question-header">
        <strong>Question {st.session_state.question_index + 1}:</strong> {q.get("question")}
    </div>
    """, unsafe_allow_html=True)
    
    choice = st.radio("", q["options"], key=f"question_{st.session_state.question_index}")

    # Bouton aligné à droite
    col1, col2, col3 = st.columns([5, 1, 2])
    with col3:
        if st.button("Submit", key=f"submit_{st.session_state.question_index}"):
            st.session_state.user_answers.append(choice)
            st.session_state.question_index += 1
            st.rerun()
else:
    # envoyer un call api au end point /update_exam
    API_URL = "http://backend:8000/update_exam"
    
    correct_answers = [q["correct_answer"] for q in QUESTIONS[exam]]
    
    # Convertir les réponses de l'utilisateur en lettres
    converted_user_answers = []
    for idx, user_answer in enumerate(st.session_state.user_answers):
        q = QUESTIONS[exam][idx]
        # Trouver l'index de la réponse de l'utilisateur dans les options
        option_index = q["options"].index(user_answer)
        # Convertir en lettre (0->A, 1->B, 2->C, 3->D)
        letter_answer = chr(65 + option_index)  # 65 est le code ASCII de 'A'
        converted_user_answers.append(letter_answer)

    matches = []
    for idx, (user_answer, correct_answer) in enumerate(zip(converted_user_answers, correct_answers)):
        is_match = user_answer == correct_answer
        matches.append(is_match)
    
    score = sum(matches)
    cheat_percentage = (len(st.session_state.cheated_questions) / total_questions)
    passed = score >= 0.6 and cheat_percentage < 0.2

    # Make API call to backend to update the exam
    response = requests.post(API_URL, json={
        "email": data["email"],
        "exam_id": data["exam_id"],
        "score": score / total_questions,
        "cheat_score": cheat_percentage,
        "passed": passed,
        "details": {
            "total_questions": total_questions,
            "user_answers": st.session_state.user_answers,
            "cheated_questions": list(st.session_state.cheated_questions)
        }
    })
    response.raise_for_status()
    
    # Animation de victoire professionnelle si le score est supérieur à 50%
    if passed:
        success_css = """
        <style>
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        .success-container {
            background-color: #f8f9fa;
            border-radius: 15px;
            padding: 30px;
            margin-top: 20px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            animation: fadeIn 1s ease-out;
            border-top: 4px solid #28a745;
            border-bottom: 4px solid #28a745;
        }
        
        .success-title {
            color: #a80464;
            text-align: center;
            font-size: 2.5em;
            font-weight: bold;
            margin-bottom: 15px;
            animation: slideUp 1s ease-out;
        }
        
        .success-subtitle {
            color: #555;
            text-align: center;
            font-size: 1.5em;
            margin-bottom: 25px;
            animation: slideUp 1.2s ease-out;
        }
        
        .score-display {
            color: #a80464;
            text-align: center;
            font-size: 3em;
            font-weight: bold;
            margin: 20px 0;
            animation: slideUp 1.4s ease-out;
        }
        </style>
        """
        
        # Obtention de la date actuelle
        import datetime
        current_date = datetime.datetime.now().strftime("%d %B, %Y")
        
        success_html = f"""
        {success_css}
        <div class="success-container">
            <h1 class="success-title">Congratulations !</h1>
            <h2 class="success-subtitle">You have passed the exam.</h2>
            <h3 class="score-display">Your score : {score / total_questions * 100:.2f}%</h3>
            <p style="text-align: center; color: #666;">Our fraud detection detected a 
            {cheat_percentage*100:.1f}% chance of cheating, you are therefore eligible.</p>
        </div>
        """
        
        st.markdown(success_html, unsafe_allow_html=True)
    else:
        failure_css = """
        <style>
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        .failure-container {
            background-color: #f8f9fa;
            border-radius: 15px;
            padding: 30px;
            margin-top: 20px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            animation: fadeIn 1s ease-out;
            border-top: 4px solid #dc3545;
            border-bottom: 4px solid #dc3545;
        }
        
        .failure-title {
            color: #a80464;
            text-align: center;
            font-size: 2.2em;
            font-weight: bold;
            margin-bottom: 15px;
            animation: slideUp 1s ease-out;
        }
        
        .failure-subtitle {
            color: #555;
            text-align: center;
            font-size: 1.4em;
            margin-bottom: 25px;
            animation: slideUp 1.2s ease-out;
        }
        
        .score-display-failure {
            color: #a80464;
            text-align: center;
            font-size: 3em;
            font-weight: bold;
            margin: 20px 0;
            animation: slideUp 1.4s ease-out;
        }
        </style>
        """
        # Calcul du score en pourcentage
        score_percent = (score / total_questions) * 100

        # Message de suspicion de fraude
        if score_percent > 40:
            failure_subtitle = f"""
            We detected a too high chance of cheating."""
            fraud_message = f"""
            Our fraud detection detected a {cheat_percentage*100:.1f}% chance of cheating, 
            you are therefore not eligible."""
        else:
            failure_subtitle = f"""You have not reached the minimum score required."""
            fraud_message = f"""
            Our fraud detection detected a {cheat_percentage*100:.1f}% chance of cheating."""

        # HTML à afficher en cas d'échec
        failure_html = f"""
        {failure_css}
        <div class="failure-container">
            <h1 class="failure-title">Exam not validated</h1>
            <h2 class="failure-subtitle">{failure_subtitle}</h2>
            <h3 class="score-display-failure">Your score : {score_percent:.2f}%</h3>
            <p style="text-align: center; color: #666;">{fraud_message}</p>
        </div>
        """

        st.markdown(failure_html, unsafe_allow_html=True)

# --- Webcam dans la sidebar ---
st.sidebar.header("Live Webcam")
start_webcam = st.sidebar.checkbox('Launch webcam', key='webcam_checkbox')

if 'cap' not in st.session_state:
    st.session_state.cap = cv2.VideoCapture(0)

cap = st.session_state.cap
gaze = GazeTracking()

if start_webcam:
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
            text = "CHEATING!!!"
            text_color = (168, 4, 100)  # Pink color (a80464 in BGR format)
            if st.session_state.question_index not in st.session_state.cheated_questions:
                st.session_state.cheated_questions.add(st.session_state.question_index)
        else:
            text = "Looking center"
            text_color = (50, 205, 50)  # Green

        # Texte plus professionnel et stylisé
        cv2.rectangle(new_frame, (30, 25), (290, 70), (255, 255, 255), -1)
        cv2.putText(new_frame, text, (40, 60), cv2.FONT_HERSHEY_SIMPLEX, 1, text_color, 2)
        
        frame = cv2.cvtColor(new_frame, cv2.COLOR_BGR2RGB)
        frame_placeholder.image(frame)
        time.sleep(0.03)
else:
    if cap.isOpened():
        cap.release()