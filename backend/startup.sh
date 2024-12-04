#!/bin/bash
# Startup script for the backend production AZURE
pip install --upgrade pip 

pip install -r requirements.txt 

uvicorn app.main:app --host 0.0.0.0 --port 8000