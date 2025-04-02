
### 📘 INFO.md — Accessible Ports & Services

This project uses Docker Compose to orchestrate multiple services, including frontend, backend, blockchain (Solana) integration, messaging, caching, and a self-hosted Supabase stack.

---

### 🚀 Internal Services

#### 🔹 **Frontend (Streamlit)**

- **URL**: [http://localhost:8501](http://localhost:8501)
- **Description**: The user-facing interface of the application.

#### 🔹 **Backend (FastAPI or similar)**

- **URL**: [http://localhost:8502](http://localhost:8502)
- **Description**: The main API that handles business logic and connects to other services.

#### 🔹 **Web3Solana (Node.js + Solana Web3)**

- **URL**: [http://localhost:8503](http://localhost:8503)
- **Description**: Node.js microservice for interacting with the Solana blockchain.
- **Sample Endpoint**: `/slot` — returns the current slot on Solana Devnet.

---

### 💬 Messaging & Caching Services

#### 🔹 **RabbitMQ**

- **AMQP Port**: `5672` (for service-to-service messaging)
- **Management UI**: [http://localhost:15672](http://localhost:15672)
  - **Username**: `user`
  - **Password**: `password`
- **Description**: Message broker used for asynchronous tasks and inter-service communication.

#### 🔹 **Redis**

- **Port**: `6379`
- **Description**: In-memory data store used for caching, pub/sub, queues, and fast lookups.

---

### 🧪 Supabase (Self-Hosted) API Gateway

Supabase exposes several APIs via a unified gateway, typically accessed from the backend:

| Service     | URL                                        |
|-------------|---------------------------------------------|
| REST        | `http://<your-ip>:8000/rest/v1/`           |
| Auth        | `http://<your-domain>:8000/auth/v1/`       |
| Storage     | `http://<your-domain>:8000/storage/v1/`    |
| Realtime    | `http://<your-domain>:8000/realtime/v1/`   |

> 📝 Replace `<your-ip>` or `<your-domain>` with the actual host if accessing from a browser or external machine.

---

### 🌐 Internal Docker Network (`app-network`)

All services are connected to the internal Docker network and can communicate using their service names.

| Service Name | Docker Hostname | Internal Port |
|--------------|------------------|----------------|
| Backend      | `backend`        | 8000           |
| Frontend     | `frontend`       | 8501           |
| Web3Solana   | `web3solana`     | 3000           |
| RabbitMQ     | `rabbitmq`       | 5672 / 15672   |
| Redis        | `redis`          | 6379           |
