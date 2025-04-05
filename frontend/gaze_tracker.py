import streamlit as st
import cv2
import time
import os
import sys
# Ajouter le dossier parent au sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from gaze_tracking import GazeTracking
from main import CHEAT_LIST

st.title("Webcam Live Feed avec détection des yeux")

# Initialiser les objets dans la session s'ils n'existent pas déjà
if 'cap' not in st.session_state:
    st.session_state.cap = cv2.VideoCapture(0)
if 'gaze' not in st.session_state:
    st.session_state.gaze = GazeTracking()

cap = st.session_state.cap
gaze = st.session_state.gaze

# Vérifier que la webcam est accessible
if not cap.isOpened():
    st.error("Erreur: Impossible d'ouvrir la webcam.")
    st.stop()

# Un seul widget de démarrage, avec une clé unique
start_detection = st.checkbox("Démarrer la détection", key="start_detection")

# Conteneurs pour afficher la vidéo et le statut
frame_placeholder = st.empty()
status_placeholder = st.empty()

if start_detection:
    # Réinitialiser la liste de détection
    CHEAT_LIST.clear()
    # Boucle de streaming
    while st.session_state.start_detection:
        ret, frame = cap.read()
        if not ret:
            st.error("Erreur lors de la capture de la vidéo.")
            break

        # Actualiser la détection du regard
        gaze.refresh(frame)
        annotated_frame = gaze.annotated_frame()

        # Exemple d'annotation : dessiner un cercle au centre de l'image
        height, width, _ = annotated_frame.shape
        center_x, center_y = width // 2, height // 2
        cv2.circle(annotated_frame, (center_x, center_y), 10, (0, 255, 0), 2)

        # Détection de la "triche" (regard à droite ou à gauche)
        cheat = gaze.is_right() or gaze.is_left()
        CHEAT_LIST.append(cheat)
        cheat_percentage = (sum(CHEAT_LIST) / len(CHEAT_LIST)) * 100 if CHEAT_LIST else 0

        # Mettre à jour l'affichage du statut et de la vidéo
        status_placeholder.text(f"Cheating percentage: {cheat_percentage:.2f}%")
        frame_rgb = cv2.cvtColor(annotated_frame, cv2.COLOR_BGR2RGB)
        frame_placeholder.image(frame_rgb)

        # Petite pause pour limiter le taux de rafraîchissement
        time.sleep(0.03)

        # Forcer le re-run du script pour prendre en compte l'état de la checkbox
        # (la boucle va se relancer si st.session_state.start_detection reste True)
        # Sinon, la boucle s'arrêtera dès que l'utilisateur décoche la case.
        st.experimental_rerun()
else:
    st.write("Détection arrêtée.")

# Libération de la webcam si l'utilisateur arrête la détection
if not st.session_state.start_detection and cap.isOpened():
    cap.release()
