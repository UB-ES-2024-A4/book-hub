#!/bin/bash
# Startup file for Azure Web App

echo -e "\033[34mRunning startup.sh\033[0m"

# Copy all environment variables into .env file
# echo \
# "NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
# NEXT_PUBLIC_AZURE_SAS_STORAGE=${NEXT_PUBLIC_AZURE_SAS_STORAGE}
# NEXT_PUBLIC_STORAGE_PROFILE_PICTURES=${NEXT_PUBLIC_STORAGE_PROFILE_PICTURES}
# NEXT_PUBLIC_STORAGE_BOOKS=${NEXT_PUBLIC_STORAGE_BOOKS}
# NEXT_PUBLIC_AZURE_SAS_STORAGE_BOOKS=${NEXT_PUBLIC_AZURE_SAS_STORAGE_BOOKS}" > .env

# Install dependencies
npm install

npm start -- --port 8080

# if last exit code was 1 build project
if [ $? -eq 1 ]; then
    npm run build
    npm start -- --port 8080
fi