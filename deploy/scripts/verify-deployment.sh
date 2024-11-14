#!/bin/bash
set -e  # Exit on any error

echo "Verifying deployment..."

# Check PM2 status
echo "Checking PM2 status:"
pm2 list

# Check API health
echo "Checking API health:"
curl -s $1/api/health || { echo "API health check failed"; exit 1; }

# Check directories and files
echo "Checking logs directory:"
ls -la /var/log/scientism-poetry || { echo "Log directory check failed"; exit 1; }

echo "Checking frontend env files:"
ls -la /var/www/scientism-poetry/frontend/.env* || { echo "Frontend env files check failed"; exit 1; }

# Check Nginx status
echo "Checking Nginx status:"
sudo systemctl status nginx || { echo "Nginx status check failed"; exit 1; }

echo "Deployment verification complete"
