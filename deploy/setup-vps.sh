#!/bin/bash

# Exit on error
set -e

echo "Setting up VPS for Scientism Poetry deployment..."

# Add MongoDB GPG key and repository
echo "Adding MongoDB repository..."
curl -fsSL https://pgp.mongodb.com/server-6.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-6.0.gpg \
   --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update system
echo "Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install required packages
echo "Installing required packages..."
sudo apt-get install -y nginx nodejs npm mongodb-org certbot python3-certbot-nginx

# Start MongoDB
echo "Starting MongoDB..."
sudo systemctl start mongod
sudo systemctl enable mongod

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

# Setup SSL certificates
echo "Would you like to set up SSL certificates now? (y/n)"
read -r setup_ssl
if [ "$setup_ssl" = "y" ]; then
    echo "Setting up SSL certificates..."
    
    # Create SSL certificate directory if it doesn't exist
    sudo mkdir -p /etc/nginx/ssl/scientism-poetry
    
    # Prompt for certificate file paths
    echo "Please enter the path to your SSL certificate file (.crt):"
    read -r cert_path
    echo "Please enter the path to your SSL private key file (.pem):"
    read -r pem_path
    
    # Copy certificates to Nginx directory
    if [ -f "$cert_path" ] && [ -f "$pem_path" ]; then
        sudo cp "$cert_path" /etc/nginx/ssl/scientism-poetry/certificate.crt
        sudo cp "$pem_path" /etc/nginx/ssl/scientism-poetry/private.pem
        
        # Set proper permissions
        sudo chmod 644 /etc/nginx/ssl/scientism-poetry/certificate.crt
        sudo chmod 600 /etc/nginx/ssl/scientism-poetry/private.pem
        
        echo "SSL certificates have been installed successfully!"
        
        # Restart Nginx to apply SSL changes
        sudo systemctl restart nginx
    else
        echo "Error: Certificate files not found. Please check the paths and try again."
        exit 1
    fi
fi

# Create PM2 ecosystem file
echo "Creating PM2 ecosystem file..."
# First create the file in a temporary location
cat > /tmp/ecosystem.config.js << EOL
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

# Move the file to the correct location with proper permissions
sudo mv /tmp/ecosystem.config.js /var/www/scientism-poetry/ecosystem.config.js
sudo chown $USER:$USER /var/www/scientism-poetry/ecosystem.config.js
sudo chmod 644 /var/www/scientism-poetry/ecosystem.config.js

# Setup PM2 startup script
echo "Setting up PM2 startup script..."
pm2 startup
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp /home/$USER

echo "VPS setup complete!"
echo ""
echo "IMPORTANT: Next Steps"
echo "===================="
echo "1. Update your domain DNS to point to this server"
echo ""
echo "2. Deploy your application files:"
echo "   - The frontend files should be deployed to: /var/www/scientism-poetry/frontend"
echo "   - The backend files should be deployed to: /var/www/scientism-poetry/backend"
echo "   - Use your GitHub Actions workflow (.github/workflows/deploy.yml) to deploy the files"
echo ""
echo "3. Configure environment variables:"
echo "   - Create and configure /var/www/scientism-poetry/backend/.env"
echo "   - Ensure all required environment variables are set"
echo ""
echo "4. Start the application:"
echo "   - After deploying the files, start the backend using: pm2 start /var/www/scientism-poetry/ecosystem.config.js"
echo "   - Monitor the application using: pm2 status"
echo ""
echo "Note: The directories are currently empty. The application files will be populated"
echo "      when you run your deployment workflow from GitHub Actions."
