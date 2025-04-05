# backend/Dockerfile
FROM python:3.13-alpine3.21

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt
# RUN python -m solcx.install v0.8.0  # Install a specific version of sol
# RUN python -c "import solcx; solcx.install_solc('v0.8.0')"c
# Installer solc
RUN wget https://github.com/ethereum/solidity/releases/download/v0.8.0/solc-static-linux \
    && chmod +x solc-static-linux \
    && mv solc-static-linux /usr/local/bin/solc
# Copie du reste de l'application
COPY ./app /app

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
