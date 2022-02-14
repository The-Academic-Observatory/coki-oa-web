#!/usr/bin/env bash

# Extract data
unzip -o latest.zip

# Make public/data folder
mkdir -p ./public/data

# Copy public data into public folder
cp ./latest/data/autocomplete.json ./public/data/autocomplete.json
cp ./latest/data/country.json ./public/data/country.json
cp ./latest/data/institution.json ./public/data/institution.json
cp -R ./latest/logos ./public/logos
