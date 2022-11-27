#!/usr/bin/env bash

# Remove existing folders
rm -fR ./latest
rm -fR ./public/data
rm -fR ./public/logos
rm -fR ./public/twitter
rm -fR ./workers-api/public/country
rm -fR ./workers-api/public/institution

# Make public/data folder
mkdir -p ./public/data

# Extract data
unzip -o latest.zip -d latest

# Copy public data into public folder
cp ./latest/data/country.json ./public/data/country.json
cp ./latest/data/institution.json ./public/data/institution.json
cp -R ./latest/logos ./public/logos
cp -R ./latest/twitter ./public/twitter

# Copy country and institution data files into workers-api/public
cp -R ./latest/data/country ./workers-api/public/country
cp -R ./latest/data/institution ./workers-api/public/institution
