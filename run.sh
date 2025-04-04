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


# function to start network
boot_network() {
    if [ ! "$(docker network ls | grep shared_network)" ]; then
        echo "Creating the shared_network network..."
        docker network create shared_network
    else
        echo "shared_network network already exists."
    fi
}

get_data_supabase() {
    local target_dir="supabase/docker/volumes/db/data"

    if [ -d "$target_dir" ]; then
        echo "Le dossier '$target_dir' existe déjà."
        echo "👉 Si tu veux le remplacer, supprime-le d'abord avec :"
        echo "   rm -rf \"$target_dir\""
        return 1
    fi

    echo "✅ Création du dossier '$target_dir'..."
    mkdir -p "$target_dir"

    echo "📦 Copie des fichiers de 'supabase_data/' vers '$target_dir'..."
    cp -a supabase_data/. "$target_dir/"

    echo "✅ Copie terminée !"
}


# Function to set up the .env file if it doesn't exist
setup_env_file() {
    if [ ! -f ".env" ]; then
        echo "Copying the fake env vars..."
        cp ../../.env-supabase .env
    else
        echo ".env file already exists."
    fi

    if [ ! -f ".docker-compose.yml" ]; then
        echo "Copying the docker compose file..."
        cp ../../docker-compose-supabase.yaml docker-compose.yml
    else
        echo "docker compose file already exists."
    fi
}

# Function to pull the latest Docker images and start the services
start_docker_supabase_services() {
    clone_supabase_repo
    cd supabase/docker
    setup_env_file
    echo "Checking if Supabase services are already running..."

    if docker compose ps | grep "Up"; then
        echo "Supabase services are already running. No action taken."
    else
        echo "Pulling the latest Supabase Docker images..."
        docker compose pull

        docker compose build --no-cache

        echo "Starting Supabase services in detached mode..."
        docker compose up -d
    fi
    cd ../..
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
    boot_network
    get_data_supabase
    start_docker_supabase_services
    start_project_services

}

# Function to start the services in development mode
start_services_dev() {
    boot_network
    get_data_supabase
    start_docker_supabase_services
    echo "Starting the docker-compose-project.yaml in attached mode..."
    docker compose -f docker-compose-project.yaml up
}

# Function to restart the docker-compose-project
restart_project() {
    boot_network
    get_data_supabase
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
    get_table_supasbase)
        get_data_supabase
        ;;
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
