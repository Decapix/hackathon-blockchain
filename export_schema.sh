#!/bin/bash
# export_schema.sh

# Configuration
CONTAINER_NAME="supabase-db"
OUTPUT_FILE="schema.json"

# Export via docker exec
docker exec $CONTAINER_NAME bash -c '
  PGPASSWORD="$POSTGRES_PASSWORD" psql -U postgres -d postgres -t -A <<EOF
  SELECT json_build_object(
    '"'"'tables'"'"', (
      SELECT json_object_agg(
        table_name,
        json_build_object(
          '"'"'columns'"'"', (
            SELECT json_object_agg(
              column_name,
              json_build_object(
                '"'"'type'"'"', udt_name,
                '"'"'nullable'"'"', (is_nullable = '"'"'YES'"'"'),
                '"'"'default'"'"', column_default
              )
            )
            FROM information_schema.columns c
            WHERE c.table_name = t.table_name
            AND c.table_schema = '"'"'public'"'"'
          )
        )
      )
      FROM information_schema.tables t
      WHERE table_schema = '"'"'public'"'"'
    )
  )
EOF
' | jq . > $OUTPUT_FILE

echo "✅ Schéma exporté dans $OUTPUT_FILE"
