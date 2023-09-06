#!/usr/bin/env bash

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <root_directory>"
    exit 1
fi

ROOT_DIR="$1"
DATA_DIR="${ROOT_DIR}/data"

# Remove existing folders
rm -fR "${DATA_DIR}/images"
rm -fR "${ROOT_DIR}/workers-images/public"

# Make workers-api public/data folder
mkdir "${ROOT_DIR}/workers-images/public"

# Extract data
unzip -o "${DATA_DIR}/images.zip" -d "${DATA_DIR}/images"
unzip -o "${DATA_DIR}/social-cards.zip" -d "${DATA_DIR}/images/social-cards"

## Copy images into workers-api/public
cp -R "${DATA_DIR}/images/." "${ROOT_DIR}/workers-images/public"
