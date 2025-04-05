#!/bin/bash

# Colors
GREEN="\033[0;32m"
RED="\033[0;31m"
CYAN="\033[0;36m"
NC="\033[0m" # No Color

# Services list
declare -A services=(
  ["backend"]="hackathon-blockchain-backend-1"
  ["frontend"]="hackathon-blockchain-frontend-1"
  ["web3"]="hackathon-blockchain-web3-1"
)

echo -e "${CYAN}====== STATUS CHECK - Hackathon Blockchain Stack ======${NC}\n"

for service in "${!services[@]}"; do
  if docker ps --format '{{.Names}}' | grep -q "${services[$service]}"; then
    echo -e "[$GREEN✅$NC] $service"
  else
    echo -e "[$RED❌$NC] $service"
  fi
done

echo -e "\n${CYAN}====== ACCESS LINKS ======${NC}"
echo -e "🔗 Backend (FastAPI)  : ${GREEN}http://localhost:8502${NC}"
echo -e "🔗 Frontend (Streamlit): ${GREEN}http://localhost:8501${NC}"
echo -e "🔗 Web3 (React)       : ${GREEN}http://localhost:8503${NC}"

echo -e "\n${CYAN}====== Quick Commands ======${NC}"
echo -e "🚀 Start stack        : ./run.sh up-prod"
echo -e "🔄 Restart project    : ./run.sh restart-project"
echo -e "🛑 Stop all           : ./run.sh down-all"
echo -e "📄 Show logs          : docker compose -f docker-compose-project.yaml logs -f"