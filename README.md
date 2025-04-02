### We use two Docker Compose configurations:
- A pre-made Supabase project
- Our project (backend and frontend)


## to run :

1. make the run.sh executable :
`chmod +x run.sh`
2. run :
`./run.sh up-prod`

## run.sh Command Documentation:
  - `up-prod`: Starts all services in production mode (detached).  
  - `up-dev`: Starts only docker-compose-project.yaml in attached mode for development.  
  - `restart-project`: Restarts only docker-compose-project.yaml (in development mode).  
  - `down-all`: Stops all services, including Supabase.  
  - `down-project`: Stops only docker-compose-project.yaml.  
