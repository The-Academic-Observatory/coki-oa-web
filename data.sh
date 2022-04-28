#!/usr/bin/env bash

# Extract data
unzip -o latest.zip -d latest

# Make public/data folder
mkdir -p ./public/data

# Copy public data into public folder
cp ./latest/data/country.json ./public/data/country.json
cp ./latest/data/institution.json ./public/data/institution.json
cp -R ./latest/logos ./public/logos
