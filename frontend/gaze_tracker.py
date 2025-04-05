import streamlit as st
import cv2
from gaze_tracking import GazeTracking
from main import CHEAT_LIST
import time

st.title("Webcam Live Feed")

end = False
global_cheat_percentage = 0

# Fonction modifiée pour mesurer la triche sur un court intervalle
def quick_capture_webcam(duration_seconds=3):
    """Capture la webcam pendant une durée limitée et retourne le pourcentage de triche"""
    global CHEAT_LIST
    
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        st.error("Erreur : Impossible d'ouvrir la webcam.")
        return 0
    
    # Conteneurs pour l'affichage
    stframe = st.empty()
    text_area = st.empty()
    gaze = GazeTracking()
    
    # S'assurer que la liste est vide
    CHEAT_LIST.clear()
    
    # Enregistrer l'heure de début
    start_time = time.time()
    end_time = start_time + duration_seconds
    
    # Boucle limitée dans le temps
    while time.time() < end_time:
        ret, frame = cap.read()
        if not ret:
            st.error("Erreur : Impossible de lire le flux de la webcam.")
            break
        
        # Analyser le regard
        gaze.refresh(frame)
        new_frame = gaze.annotated_frame()
        
        # Détecter la triche
        cheat = False
        if gaze.is_right() or gaze.is_left():
            cheat = True
        
        # Ajouter à la liste globale
        CHEAT_LIST.append(cheat)
        
        # Calculer le pourcentage de triche
        cheat_percentage = (sum(CHEAT_LIST) / len(CHEAT_LIST)) * 100 if CHEAT_LIST else 0
        
        # Mettre à jour l'affichage
        text_area.write(f"Surveillance en cours: {cheat_percentage:.2f}% de triche détectée")
        
        # Convertir et afficher l'image
        frame_rgb = cv2.cvtColor(new_frame, cv2.COLOR_BGR2RGB)
        stframe.image(frame_rgb)
    
    # Libérer les ressources
    cap.release()
    
    # Effacer les éléments d'interface temporaires
    stframe.empty()
    text_area.empty()
    
    # Retourner le pourcentage final
    final_percentage = (sum(CHEAT_LIST) / len(CHEAT_LIST)) * 100 if CHEAT_LIST else 0
    return final_percentage

# Fonction originale pour la rétro-compatibilité
def capture_webcam():

    while not end:
        ret, frame = cap.read()
        if not ret:
            st.error("Erreur : Impossible de lire le flux de la webcam.")
            break

        gaze.refresh(frame)
        new_frame = gaze.annotated_frame()

        cheat = False
        if gaze.is_right() or gaze.is_left():
            cheat = True

        CHEAT_LIST.append(cheat)
        
        # Calculer le pourcentage de triche
        cheat_percentage = (sum(CHEAT_LIST) / len(CHEAT_LIST)) * 100 if CHEAT_LIST else 0
        
        # Mettre à jour le texte en temps réel
        status_area.write("ON" if CHEAT_LIST else "OFF")
        text_area.write(f"Cheating percentage: {cheat_percentage:.2f}%")

        # Convertir l'image de BGR (OpenCV) à RGB (Streamlit)
        frame_rgb = cv2.cvtColor(new_frame, cv2.COLOR_BGR2RGB)

        # Afficher l'image dans Streamlit
        stframe.image(frame_rgb)
    
    cap.release()
    cv2.destroyAllWindows()
    return cheat_percentage