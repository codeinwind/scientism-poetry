#!/bin/bash

# Exit on error
set -e

echo "Setting up VPS for Scientism Poetry deployment..."

# Update system
echo "Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install required packages
echo "Installing required packages..."
sudo apt-get install -y nginx nodejs npm mongodb certbot python3-certbot-nginx

# Install PM2 globally
echo "Installing PM2..."
sudo npm install -g pm2

# Create application directories
echo "Creating application directories..."
sudo mkdir -p /var/www/scientism-poetry/frontend
sudo mkdir -p /var/www/scientism-poetry/backend

# Set correct permissions
echo "Setting permissions..."
sudo chown -R $USER:$USER /var/www/scientism-poetry
sudo chmod -R 755 /var/www/scientism-poetry

# Copy Nginx configuration
echo "Configuring Nginx..."
sudo cp nginx.conf /etc/nginx/sites-available/scientism-poetry
sudo ln -sf /etc/nginx/sites-available/scientism-poetry /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
echo "Testing Nginx configuration..."
sudo nginx -t

# Restart Nginx
echo "Restarting Nginx..."
sudo systemctl restart nginx

# Setup SSL with Certbot
echo "Would you like to set up SSL now? (y/n)"
read -r setup_ssl
if [ "$setup_ssl" = "y" ]; then
    echo "Setting up SSL with Certbot..."
    sudo certbot --nginx -d scientismpoetry.com -d www.scientismpoetry.com
fi

# Create PM2 ecosystem file
echo "Creating PM2 ecosystem file..."
cat > ecosystem.config.js << EOL
module.exports = {
  apps: [{
    name: 'scientism-poetry-backend',
    script: '/var/www/scientism-poetry/backend/server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    }
  }]
};
EOL

# Setup PM2 startup script
echo "Setting up PM2 startup script..."
pm2 startup
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp /home/$USER

echo "VPS setup complete!"
echo "Next steps:"
echo "1. Update your domain DNS to point to this server"
echo "2. Configure environment variables in /var/www/scientism-poetry/backend/.env"
echo "3. Deploy your application using GitHub Actions"
