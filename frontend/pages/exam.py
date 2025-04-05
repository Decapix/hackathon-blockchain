import streamlit as st
import cv2

st.title("Webcam Live Feed sans PIL")

# Fonction pour capturer et afficher les images de la webcam
def capture_webcam():
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        st.error("Erreur : Impossible d'ouvrir la webcam.")
        return

    stframe = st.image([])

    while True:
        ret, frame = cap.read()
        if not ret:
            st.error("Erreur : Impossible de lire le flux de la webcam.")
            break

        # Convertir l'image de BGR (OpenCV) à RGB (Streamlit)
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # Afficher l'image dans Streamlit
        stframe.image(frame_rgb)

    cap.release()

# Lancer la capture de la webcam
capture_webcam()