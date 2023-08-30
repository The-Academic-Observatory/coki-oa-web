#!/usr/bin/env bash

# Remove existing folders
rm -fR ./images
rm -fR ./workers-images/public

# Make workers-api public/data folder
mkdir ./workers-images/public

# Extract data
unzip -o images.zip -d images
unzip -o social-cards.zip -d images/social-cards

## Copy images into workers-api/public
cp -R ./images/. ./workers-images/public
