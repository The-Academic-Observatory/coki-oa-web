#!/usr/bin/env bash

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <root_directory>"
    exit 1
fi

ROOT_DIR="$1"
DATA_DIR="${ROOT_DIR}/data"

# Remove existing folders
rm -fR "${DATA_DIR}/data"
rm -fR "${ROOT_DIR}/workers-api/public"

# Make workers-api public/data folder
mkdir "${ROOT_DIR}/workers-api/public"

# Extract data
unzip -o "${DATA_DIR}/data.zip" -d "${DATA_DIR}/data"

# Make a fake topInstitutions file
echo "[]" > "${DATA_DIR}/data/topInstitutions.json"

## Copy data files into workers-api/public
cp -R "${DATA_DIR}/data/country" "${ROOT_DIR}/workers-api/public/country"
cp -R "${DATA_DIR}/data/institution" "${ROOT_DIR}/workers-api/public/institution"