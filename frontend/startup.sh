#!/bin/bash
# Startup file for Azure Web App

echo -e "\033[34mRunning startup.sh\033[0m"

# Install dependencies
npm install

npm start -- --port 8080

# if last exit code was 1 build project
if [ $? -eq 1 ]; then
    npm run build
    npm start -- --port 8080
fi