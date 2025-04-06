#!/bin/bash



clone_gaze_tracking() {
    # Vérifie si le dossier frontend/GazeTracking existe
    if [ ! -d "frontend/GazeTracking" ]; then
        echo "Le dossier frontend/GazeTracking n'existe pas. Clonage en cours..."
        git clone https://github.com/antoinelame/GazeTracking frontend/GazeTracking
        echo "Clonage terminé."
    else
        echo "Le dossier frontend/GazeTracking existe déjà."
    fi
}


# Function to build and start project services
start_project_services() {
    echo "Building project services..."
    docker compose -f docker-compose-project.yaml build --no-cache

    echo "Starting project services in detached mode..."
    docker compose -f docker-compose-project.yaml up -d
}

# Function to start the services in production mode
start_services_prod() {
    clone_gaze_tracking
    start_project_services
}

# Function to start the services in development mode
start_services_dev() {
    clone_gaze_tracking
    echo "Starting the docker-compose-project.yaml in attached mode..."
    docker compose -f docker-compose-project.yaml up
}

# Function to restart the docker-compose-project
restart_project() {
    clone_gaze_tracking
    echo "Restarting the docker-compose-project.yaml..."
    docker compose -f docker-compose-project.yaml down
    docker compose -f docker-compose-project.yaml build
    docker compose -f docker-compose-project.yaml up
}

# Function to stop all services
stop_all_services() {
    echo "Stopping the docker-compose-project.yaml..."
    docker compose -f docker-compose-project.yaml down
    cd supabase/docker
    echo "Stopping the Supabase services..."
    docker compose down
    cd ../..
}

# Function to stop only the docker-compose-project
stop_project() {
    echo "Stopping the docker-compose-project.yaml..."
    docker compose -f docker-compose-project.yaml down
}

# Check the command
case $1 in
    up-prod)
        start_services_prod
        ;;
    up-dev)
        start_services_dev
        ;;
    restart-project)
        restart_project
        ;;
    down-all)
        stop_all_services
        ;;
    down-project)
        stop_project
        ;;
    *)
        echo "Usage: $0 {up-prod|up-dev|restart-project|down-all|down-project}"
        ;;
esac




# export schema
# ./import_schema.sh
# ./export_schema.sh
#
# Export complet
# docker exec supabase-db pg_dump -U postgres --schema-only > full_schema.sql
# Import complet
# docker exec -i supabase-db psql -U postgres < full_schema.sql
