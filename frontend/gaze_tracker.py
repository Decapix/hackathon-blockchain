import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'GazeTracking'))
import cv2
from gaze_tracking import GazeTracking
import time
from main import CHEAT_LIST

def start_exam_monitoring(duration_seconds=30):
    CHEAT_LIST.clear()
    gaze = GazeTracking()
    webcam = cv2.VideoCapture(0)
    start_time = time.time()

    while (time.time() - start_time) < duration_seconds:
        ret, frame = webcam.read()
        if not ret:
            break

        gaze.refresh(frame)
        new_frame = gaze.annotated_frame()

        cheat = False

        if gaze.is_right() or gaze.is_left():
            cheat = True

        CHEAT_LIST.append(cheat)

        # Display remaining time
        remaining_time = int(duration_seconds - (time.time() - start_time))
        cv2.putText(new_frame, f'Time: {remaining_time}s', (10, 30), 
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

        # text = ""

        # if gaze.is_right():
        #     text = "Looking right"
        # elif gaze.is_left():
        #     text = "Looking left"
        # elif gaze.is_center():
        #     text = "Looking center"

        # cv2.putText(new_frame, text, (60, 60), cv2.FONT_HERSHEY_DUPLEX, 2, (255, 0, 0), 2)
        # cv2.imshow('Exam Monitoring', new_frame)

        if cv2.waitKey(1) & 0xFF == 27:  # ESC to exit
            break

    webcam.release()
    cv2.destroyAllWindows()
    
    # Calculate cheating percentage
    cheat_percentage = (sum(CHEAT_LIST) / len(CHEAT_LIST)) * 100 if CHEAT_LIST else 0
    return cheat_percentage

if __name__ == '__main__':
    start_exam_monitoring()