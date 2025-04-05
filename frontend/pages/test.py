import streamlit as st
import cv2
import time
from GazeTracking.gaze_tracking import GazeTracking
from questions import QUESTIONS

st.title("Questions QCM et Webcam")

# Initialiser l'index de la question
if 'question_index' not in st.session_state:
    st.session_state.question_index = 0

# Affichage de la question actuelle
if st.session_state.question_index < len(QUESTIONS):
    q = QUESTIONS[st.session_state.question_index]
    st.header(f"Question {st.session_state.question_index + 1}")
    choice = st.radio(q["question"], q["options"], key=f"question_{st.session_state.question_index}")

    # Bouton "Valider"
    if st.button("Valider", key=f"submit_{st.session_state.question_index}"):
        st.write("Vous avez choisi :", choice)
        st.session_state.question_index += 1
        st.rerun()
else:
    st.success("✅ Vous avez terminé toutes les questions !")

# --- Sidebar webcam ---
st.sidebar.header("Webcam en direct")
start_webcam = st.sidebar.checkbox('Démarrer la webcam', key='webcam_checkbox')

# Créer ou récupérer la capture webcam dans la session
if 'cap' not in st.session_state:
    st.session_state.cap = cv2.VideoCapture(0)

cap = st.session_state.cap
gaze = GazeTracking()

# Webcam loop
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

        text = "CHEATING!!!"
        if gaze.is_right():
            text = "CHEATING!!!"
        elif gaze.is_left():
            text = "CHEATING!!!"
        elif gaze.is_center():
            text = "Looking center"

        cv2.putText(new_frame, text, (60, 60), cv2.FONT_HERSHEY_DUPLEX, 2, (255, 0, 0), 2)
        frame = cv2.cvtColor(new_frame, cv2.COLOR_BGR2RGB)
        frame_placeholder.image(frame)
        time.sleep(0.03)
else:
    if cap.isOpened():
        cap.release()