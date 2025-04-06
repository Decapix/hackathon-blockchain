# Backend (FastAPI)

This container provides the API for exam management and blockchain integration.

## Features

- **Exam Management**: Create, retrieve, and update exam sessions
- **Result Processing**: Store and retrieve exam results with fraud scores
- **Lightweight Database**: Uses TinyDB for document storage
- **Blockchain Integration**: Connects with the Web3Auth component

## Technology Stack

- **FastAPI**: Modern, fast API framework with automatic docs
- **TinyDB**: Lightweight document-oriented database in pure Python
- **Uvicorn**: ASGI server for FastAPI
- **Web3**: Python library for Ethereum blockchain integration

## Architecture

The backend consists of several components:

- `main.py`: Initializes the FastAPI application with CORS settings
- `routes.py`: Defines API endpoints for exam management
- `db.py`: Database interface with TinyDB
- `models.py`: Pydantic data models for request/response validation
- `logic.py`: Business logic for exam processing
- `solidity/`: Contains smart contract definitions

## API Endpoints

The backend exposes several RESTful endpoints:

- `POST /init_exam`: Initialize a new exam session with user email and exam ID
- `POST /update_exam`: Update exam results including score and fraud metrics
- `GET /get_last_exam/{email}`: Get a user's most recent exam data
- `GET /get_result`: Get all results for a specific user
- `GET /get_last_exam_global`: Get the most recent exam in the system

## Database

The backend uses TinyDB, a lightweight document database that stores data in a JSON file:

- No database server required
- Data stored in `db.json` 
- Simple Query interface for retrieving records

## Docker Configuration

The backend runs in a Docker container with:
- Python 3.13 Alpine as the base image
- Uvicorn ASGI server on port 8000 (mapped to 8502)
- Volume mounted app directory for development

## Environment Variables

The backend uses environment variables for configuration:
- Standard FastAPI configuration
- Web3 configuration for blockchain interaction

## Usage

The backend container will be started automatically with the `run.sh restart-project` command.

Access the backend API at: http://localhost:8502

API documentation is available at:
- http://localhost:8502/docs (Swagger UI)
- http://localhost:8502/redoc (ReDoc UI)

## Dependencies

See `requirements.txt` for the complete list of dependencies:
```
fastapi
uvicorn
requests
supabase
python-jose
python-dotenv
python-multipart
web3
tinydb
pydantic[email]
```