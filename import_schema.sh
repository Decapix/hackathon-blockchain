#!/bin/bash
# import_schema.sh

# Configuration
CONTAINER_NAME="supabase-db"
INPUT_FILE="schema.json"

# Génère le SQL depuis le JSON et l'exécute dans le conteneur
jq -r '.tables | to_entries[] |
"CREATE TABLE IF NOT EXISTS \(.key) (\n" +
(.value.columns | to_entries | map(
  "  \(.key) \(.value.type)" +
  (if .value.nullable == false then " NOT NULL" else "" end) +
  (if .value.default and .value.default != "null" then " DEFAULT \(.value.default)" else "" end)
) | join(",\n")) +
"\n);"' "$INPUT_FILE" | docker exec -i $CONTAINER_NAME bash -c '
  PGPASSWORD="$POSTGRES_PASSWORD" psql -U postgres -d postgres
'

echo "✅ Schéma importé depuis $INPUT_FILE"
