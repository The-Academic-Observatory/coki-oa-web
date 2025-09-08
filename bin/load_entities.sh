#!/usr/bin/env bash

# This loads all of the entities into the D1 database.
# This script shouldn't be necessary, but wrangler is extremely unstable and complains when processing
# too much data at once.
# So instead, we split the sql file into batches of 250 statements and load them one at a time.
# If wrangler ever gets fixed, we can remote this script.
# - Keegan Smith 09/25

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <root_directory>"
    exit 1
fi

ROOT_DIR="$1"
DATA_DIR="${ROOT_DIR}/data"
WORKER_DIR="${ROOT_DIR}/workers-api"
SQL_FILE="${DATA_DIR}/data/db.sql"

# Number of statements per batch
BATCH_SIZE=250

# Read SQL file into an array (one line per statement)
mapfile -t STATEMENTS < "$SQL_FILE"

TOTAL=${#STATEMENTS[@]}
echo "Loaded $TOTAL statements from $SQL_FILE"

# Process in batches
for ((i=0; i<TOTAL; i+=BATCH_SIZE)); do
    CHUNK=("${STATEMENTS[@]:i:BATCH_SIZE}")
    SQL_CHUNK=$(printf "%s\n" "${CHUNK[@]}")

    echo "Executing statements $((i+1)) to $((i+${#CHUNK[@]}))..."
    npx wrangler d1 execute DB --command="$SQL_CHUNK" --local --config "${WORKER_DIR}/wrangler.local.toml"
    EXIT_CODE=$?

    if [ $EXIT_CODE -ne 0 ]; then
        echo "⚠ Batch failed. Debugging statement by statement..."
        for stmt in "${CHUNK[@]}"; do
            npx wrangler d1 execute DB --command="$stmt" --local --config "${WORKER_DIR}/wrangler.local.toml"
            EXIT_CODE=$?
            if [ $EXIT_CODE -ne 0 ]; then
                echo "Statement failed to load:"
                echo "$stmt"
                exit $EXIT_CODE
            fi
        done
    fi
done
echo "All statements executed successfully."


