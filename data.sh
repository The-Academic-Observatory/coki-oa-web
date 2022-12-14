#!/usr/bin/env bash

# Remove existing folders
rm -fR ./data
rm -fR ./workers-api/public

# Make workers-api public/data folder
mkdir ./workers-api/public

# Extract data
unzip -o data.zip -d data

## Copy data files into workers-api/public
cp -R ./data/country ./workers-api/public/country
cp -R ./data/institution ./workers-api/public/institution
