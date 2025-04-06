# Frontend (Streamlit)

This container provides the exam interface with real-time fraud detection using webcam-based gaze tracking.

## Features

- **Interactive Exam Interface**: Multiple-choice questions with progress tracking
- **Real-time Fraud Detection**: AI-powered gaze tracking to detect when users look away from the screen
- **Visual Feedback**: Dynamic UI with real-time cheating percentage
- **Certificate Display**: Shows certificates after successful exams

## Technology Stack

- **Streamlit**: For the interactive web interface
- **OpenCV**: For webcam capture and image processing
- **dlib**: For facial landmark detection
- **GazeTracking**: Custom library for eye movement analysis

## Architecture

The application consists of several components:

- `main.py`: Main Streamlit application with exam UI
- `gaze_tracker.py`: Implements webcam monitoring and gaze detection
- `GazeTracking/`: Library for eye tracking and gaze direction analysis
- `questions.py`: Contains the exam questions
- `qr_code.py`: Generates QR codes for certificate validation

## How Fraud Detection Works

1. The application captures video from the user's webcam
2. The GazeTracking library analyzes the eye movements and pupil positions
3. If the user looks away from the screen (left or right), it's flagged as potential cheating
4. The system calculates a "cheat score" as a percentage of time spent looking away
5. Exams will fail if the cheat score exceeds 20%, even if answers are correct

## Docker Configuration

The frontend runs in a Docker container with:
- Python 3.10 base image
- OpenCV dependencies for computer vision
- Access to the host's webcam device
- Streamlit server on port 8501

## Environment Variables

The frontend uses environment variables for configuration:
- Standard Streamlit configuration variables
- Backend API URL configuration

## Usage

The frontend container will be started automatically with the `run.sh restart-project` command.

Access the frontend at: http://localhost:8501

## API Integration

The frontend communicates with the backend through HTTP requests:
- `GET /get_last_exam_global`: Retrieves the most recent exam session
- `POST /update_exam`: Sends exam results including score and cheat percentage

## Local Development

If you want to run this outside of Docker, make sure you have all the necessary dependencies:

```bash
# Install cmake (required for dlib)
sudo apt-get install build-essential cmake

# Install Python dependencies
pip install -r requirements.txt
```

## Dependencies

See `requirements.txt` for the complete list of dependencies:
```
streamlit==1.42.0
supabase
dlib==19.24.4
numpy==1.26.4
setuptools==70.0.0
opencv-python==4.11.0.86
qrcode==8.1
requests>=2.31.0
python-dotenv>=1.0.0
pandas>=2.0.0
```