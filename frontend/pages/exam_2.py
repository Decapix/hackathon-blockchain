import streamlit as st
from main import CHEAT_LIST
from gaze_tracker import start_exam_monitoring
import cv2

# Configuration de la page
st.set_page_config(page_title="Exam", page_icon="📝", layout="centered")

# Vérification de la connexion
if not st.session_state.get('logged_in', False):
    st.query_params(page="main")

# Interface de l'examen
st.title("Pass an exam")
st.write("Choose an exam...")

# Afficher en continu la dernière valeur de CHEAT_LIST
if CHEAT_LIST:
    st.write(f"Cheating percentage: {CHEAT_LIST[-1]:.2f}%")
else:
    st.write("Cheating percentage: 0.00%")

webcam = cv2.VideoCapture(0)

while True:
    frame = st.empty()
    ret, frame = webcam.read()
    if not ret:
        break

    # gaze.refresh(frame)
    # new_frame = gaze.annotated_frame()
    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    frame.image(frame, channels="RGB")

    if cv2.waitKey(1) & 0xFF == 27:  # ESC to exit
        break

webcam.release()
cv2.destroyAllWindows()