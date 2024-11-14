#!/bin/bash
set -e  # Exit on any error

echo "Setting up frontend..."

# Create env files
echo "Creating frontend env files..."
echo "REACT_APP_API_URL=$1" > frontend/.env.production
echo "REACT_APP_API_URL=$1" > frontend/.env

# Build frontend
echo "Building frontend..."
cd frontend
npm ci || { echo "Frontend npm ci failed"; exit 1; }
npm run build || { echo "Frontend build failed"; exit 1; }
cd ..

# Copy frontend files
echo "Copying frontend files..."
sudo rm -rf /var/www/scientism-poetry/frontend/*
sudo cp -r frontend/build/* /var/www/scientism-poetry/frontend/
sudo cp frontend/.env /var/www/scientism-poetry/frontend/
sudo cp frontend/.env.production /var/www/scientism-poetry/frontend/

echo "Frontend setup completed successfully"
