#!/bin/bash

# Function to clone the Supabase repository if it doesn't exist
clone_supabase_repo() {
    if [ ! -d "supabase" ]; then
        echo "Cloning the Supabase repository..."
        git clone --depth 1 https://github.com/supabase/supabase
    else
        echo "Supabase repository already cloned."
    fi
}

# Function to set up the .env file if it doesn't exist
setup_env_file() {
    if [ ! -f ".env" ]; then
        echo "Copying the fake env vars..."
        cp ../../.env-supabase .env
    else
        echo ".env file already exists."
    fi
}

# Function to pull the latest Docker images and start the services
start_docker_supabase_services() {
    clone_supabase_repo
    cd supabase/docker
    setup_env_file
    echo "Checking if services are already running..."

    # Vérifier si des conteneurs sont en cours d'exécution
    if docker compose ps | grep "Up"; then
        echo "Services are already running. No action taken."
    else
        echo "Pulling the latest Docker images..."
        docker compose pull

        echo "Starting the services in detached mode..."
        docker compose up -d
    fi
    cd ../..
}


# Function to start the services in production mode
start_services_prod() {
    start_docker_supabase_services

    echo "Starting the docker-compose-project.yaml..."
    docker compose -f docker-compose-project.yaml up -d
}

# Function to start the services in development mode
start_services_dev() {
    start_docker_supabase_services

    echo "Starting the docker-compose-project.yaml in attached mode..."
    docker compose -f docker-compose-project.yaml up
}

# Function to restart the docker-compose-project
restart_project() {
    start_docker_supabase_services
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
