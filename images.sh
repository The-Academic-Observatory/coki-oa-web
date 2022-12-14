#!/usr/bin/env bash

# Remove existing folders
rm -fR ./data
rm -fR ./workers-images/public

# Make workers-api public/data folder
mkdir ./workers-images/public

# Extract data
unzip -o images.zip -d images

## Copy images into workers-api/public
cp -R ./images ./workers-api/public
