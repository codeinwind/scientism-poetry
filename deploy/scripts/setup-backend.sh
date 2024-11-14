#!/bin/bash
set -e  # Exit on any error

echo "Setting up backend..."

# Create backend env file
echo "Creating backend env file..."
cat > backend/.env << EOL || { echo "Creating backend .env failed"; exit 1; }
NODE_ENV=production
PORT=$1
MONGODB_URI=$2
JWT_SECRET=$3
LOG_DIR=/var/log/scientism-poetry
EOL

# Install dependencies
echo "Installing backend dependencies..."
cd backend
npm ci --production || { echo "Backend npm ci failed"; exit 1; }
cd ..

# Setup log directory
echo "Setting up log directory..."
sudo mkdir -p /var/log/scientism-poetry
sudo chown -R $USER:$USER /var/log/scientism-poetry
sudo chmod 755 /var/log/scientism-poetry

# Copy backend files
echo "Copying backend files..."
sudo rm -rf /var/www/scientism-poetry/backend/*
sudo cp -r backend/* /var/www/scientism-poetry/backend/

# Restart PM2
echo "Restarting backend service..."
pm2 stop scientism-poetry-backend || true
pm2 delete scientism-poetry-backend || true
cd /var/www/scientism-poetry/backend
pm2 start server.js --name scientism-poetry-backend || { echo "PM2 start failed"; exit 1; }

echo "Backend setup completed successfully"
