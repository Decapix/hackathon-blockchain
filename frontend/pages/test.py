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
    
    st.markdown("<h1 style='text-align: center;'>L'examen va commencer...</h1>", unsafe_allow_html=True)
    
    # Créer un conteneur centré pour le timer
    col1, col2, col3 = st.columns([1, 3, 1])
    with col2:
        timer_placeholder = st.empty()
    
    # Affiche un cercle qui fait un tour complet en 3 secondes
    svg_code = f'''
    <div style="display: flex; justify-content: center; margin-top: 50px;">
        <div style="position: relative; width: 200px; height: 200px;">
            <svg width="200" height="200" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="90" fill="none" stroke="#333333" stroke-width="10"/>
                <circle cx="100" cy="100" r="90" fill="none" stroke="#39FF14" stroke-width="10"
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
                       font-size: 70px; color: #39FF14; font-weight: bold;">
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
                svg_code.replace(f'font-size: 70px; color: #39FF14; font-weight: bold;">\n                3', 
                                f'font-size: 70px; color: #39FF14; font-weight: bold;">\n                {seconds_left}'),
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
    /* Dégradé du titre */
    .title-gradient {
        background: linear-gradient(45deg, #ff6ec4, #f83600);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-size: 3em;
        font-weight: bold;
        text-align: center;
        margin-bottom: 2rem;
    }

    /* Style du bouton Valider */
    .stButton > button {
        background-color: #00cc66;
        color: white;
        font-weight: bold;
        font-size: 1.1em;
        padding: 0.75em 2em;
        border: none;
        border-radius: 10px;
        transition: 0.2s ease-in-out;
        display: inline-block;  /* Remplace float: right */
    }

    .stButton > button:hover {
        background-color: #00994d;
        color: white;
    }

    /* Thème général */
    body {
        background-color: #0d0d0d;
        color: #39FF14;
        font-family: 'Courier New', Courier, monospace;
    }

    /* Radios */
    .stRadio label {
        color: #39FF14;
        font-weight: bold;
        font-size: 1.5em;  /* Augmenter la taille de la police */
    }

    /* Barre de progression en rose */
    .progress-container {
        background-color: #ffffff;
        width: 100%;
        height: 10px;
        border-radius: 5px;
        margin-top: 1em;
    }

    .progress-bar {
        background-color: #ffb200;
        height: 100%;
        border-radius: 5px;
        transition: width 0.5s ease-in-out;
    }
    </style>
    """,
    unsafe_allow_html=True
)

# --- Titre avec effet dégradé ---
st.markdown('<div class="title-gradient">Questions QCM et Webcam</div>', unsafe_allow_html=True)

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

# --- Barre de progression flashy ---
progress_percent = int((st.session_state.question_index / len(QUESTIONS[st.session_state.selected_exam])) * 100)
st.markdown(f"""
<div class="progress-container">
    <div class="progress-bar" style="width:{progress_percent}%"></div>
</div>
""", unsafe_allow_html=True)


# --- Affichage des questions ---
if st.session_state.question_index < total_questions:
    q = QUESTIONS[exam][st.session_state.question_index]
    st.header(f"Question {st.session_state.question_index + 1}")
    choice = st.radio("", q["options"], key=f"question_{st.session_state.question_index}")

    # Bouton aligné à droite
    col1, col2, col3 = st.columns([5, 1, 2])
    with col3:
        if st.button("Valider", key=f"submit_{st.session_state.question_index}"):
            st.session_state.user_answers.append(choice)
            st.session_state.question_index += 1
            st.rerun()
else:
    # envoyer un call api au end point /update_exam
    API_URL = "http://backend:8000/update_exam"
    
    correct_answers = [q["correct_answer"] for q in QUESTIONS[exam]]
    score = sum(1 for user_answer, correct_answer in zip(st.session_state.user_answers, correct_answers) if user_answer == correct_answer)
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

    st.success(f"✅ Vous avez terminé toutes les questions ! Votre score est de {score / total_questions * 100:.2f}.")
    if cheat_percentage > 0:
        st.warning(f"⚠️ Vous avez été détecté en train de tricher {cheat_percentage * 100:.2f}% du temps.")


# --- Webcam dans la sidebar ---
st.sidebar.header("Webcam en direct")
start_webcam = st.sidebar.checkbox('Démarrer la webcam', key='webcam_checkbox')

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

        text = "Looking center"
        if gaze.is_right() or gaze.is_left():
            text = "CHEATING!!!"
            if st.session_state.question_index not in st.session_state.cheated_questions:
                st.session_state.cheated_questions.add(st.session_state.question_index)

        cv2.putText(new_frame, text, (60, 60), cv2.FONT_HERSHEY_DUPLEX, 2, (255, 0, 0), 2)
        frame = cv2.cvtColor(new_frame, cv2.COLOR_BGR2RGB)
        frame_placeholder.image(frame)
        time.sleep(0.03)
else:
    if cap.isOpened():
        cap.release()
