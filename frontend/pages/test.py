import streamlit as st
import cv2
import time
import requests
from GazeTracking.gaze_tracking import GazeTracking
from questions import QUESTIONS

API_URL = "http://backend:8000/get_last_exam_global"

st.write("Dernier examen enregistré")

try:
    response = requests.get(API_URL)
    response.raise_for_status()
    data = response.json()

    if data:
        st.subheader("Détails de l'examen")
        for key, value in data.items():
            st.write(f"**{key}**: {value}")
    else:
        st.info("Aucun examen trouvé.")

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
    correct_answers = [q["correct_answer"] for q in QUESTIONS[exam]]
    score = sum(1 for user_answer, correct_answer in zip(st.session_state.user_answers, correct_answers) if user_answer == correct_answer)
    st.success(f"✅ Vous avez terminé toutes les questions ! Votre score est de {score}/{total_questions}.")
    cheat_percentage = (len(st.session_state.cheated_questions) / total_questions) * 100
    st.warning(f"⚠️ Vous avez été détecté en train de tricher {cheat_percentage:.2f}% du temps.")


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
