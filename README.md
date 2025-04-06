![LaCertif Logo](logo.png)
# Secure Exam Platform with Blockchain Certification

## Project Overview

This project is a complete solution for secure, fraud-resistant online examinations with blockchain-backed certification. The platform combines:

- **Web3Auth** for secure blockchain authentication
- **Fraud detection** using AI-powered gaze tracking
- **Blockchain certification** for tamper-proof credentials
- **Streamlit-based exam interface** with webcam monitoring
- **FastAPI backend** with TinyDB for data storage

The system allows educational institutions to offer secure online exams while preventing cheating and providing verified, immutable certificates on the blockchain.

## Architecture

The project is divided into three main components, each running in its own Docker container:

### 1. Frontend (Streamlit - Port 8501)
- User-facing exam interface built with Streamlit
- Real-time gaze tracking for cheat detection using OpenCV and dlib
- QR code generation for certificate validation

### 2. Backend (FastAPI - Port 8502)
- RESTful API for exam management and results processing
- TinyDB for lightweight, document-oriented data storage
- Blockchain integration for certification issuance 

### 3. Web3Auth (React - Port 8503)
- Authentication using Web3Auth for blockchain wallet connectivity
- Ethereum smart contract interaction for certification
- SIWE (Sign-In With Ethereum) implementation
- User profile and certification management

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Git
- Webcam (for the fraud detection feature)

### Quick Start

1. Clone the repository:
```bash
git clone https://github.com/Decapix/hackathon-blockchain.git
cd hackathon-blockchain
```

2. Start the services:
```bash
./run.sh restart-project
```

3. Access the services:
- Web3Auth UI: http://localhost:8503 (Login and account management)
- Exam Platform: http://localhost:8501 (Take exams with fraud detection)
- Backend API: http://localhost:8502 (API for exam data)

4. Stop the project with Ctrl+C and restart with the same command.

## Component Details

### Frontend (Streamlit)

The frontend is a Streamlit application that provides:
- An interactive exam interface with multiple-choice questions
- Real-time webcam monitoring and gaze tracking to detect cheating
- Visual feedback on exam progress and results
- Certificate generation and display

The gaze tracking system detects when a user looks away from the screen, which could indicate cheating behaviors.

### Backend (FastAPI)

The backend provides APIs for:
- Exam initialization and session management
- Storing and retrieving exam results
- Processing fraud detection scores
- Interacting with the blockchain smart contracts

Data is stored in TinyDB, a lightweight document database that stores data in a JSON file.

### Web3Auth (React)

The Web3Auth component handles:
- User authentication with blockchain wallets
- Smart contract interactions for certification
- Certificate validation and verification
- User profile management and certificate history

The platform uses Ethereum and implements SIWE (Sign-In With Ethereum) for secure authentication.

## Smart Contract

The TestEvaluator smart contract manages:
- Exam session initialization and tracking
- Certification issuance on successful exam completion
- Fraud score recording
- Certificate verification and validation

## Docker Configuration

The project uses Docker Compose to orchestrate three main services:

1. **Backend Container**: Python 3.13 Alpine with FastAPI, uvicorn, and TinyDB
2. **Frontend Container**: Python 3.10 with OpenCV, dlib, and Streamlit
3. **Web3Auth Container**: Node.js with React, Vite, and Web3Auth libraries

## API Endpoints

Key backend endpoints:
- `/init_exam`: Initialize a new exam session
- `/update_exam`: Update exam results and fraud scores
- `/get_last_exam/{email}`: Get a user's most recent exam
- `/get_result`: Get all results for a user

## Security Features

- **Real-time cheating detection**: AI-powered gaze tracking identifies suspicious behavior
- **Blockchain authentication**: Secure identity verification with Web3Auth
- **Immutable certificates**: Exam results stored on blockchain for verification
- **SIWE (Sign-In With Ethereum)**: Cryptographically secure authentication

## Running the Project

The application is designed to be run with a single command:

```bash
./run.sh restart-project
```

This will build and start all three Docker containers. To stop the application, simply press Ctrl+C, and run the same command to restart it.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
