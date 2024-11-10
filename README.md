# Scientism Poetry

A web application for exploring the intersection of science and poetry. This platform allows users to share, discover, and engage with poetry that explores scientific concepts and discoveries.

## Features

- User authentication and authorization
- Create, read, update, and delete poems
- Like and comment on poems
- User profiles and dashboards
- Featured book showcase
- Responsive design for all devices
- Internationalization support (English and Chinese)
- Automated deployment to GoDaddy VPS

## Tech Stack

### Frontend
- React.js
- Material-UI (MUI)
- React Query for data fetching
- React Router for navigation
- Formik & Yup for form handling
- i18next for internationalization
- Axios for API requests

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Express Validator for input validation

### DevOps
- GitHub Actions for CI/CD
- Nginx for reverse proxy
- PM2 for process management
- Certbot for SSL

## Project Structure

```
scientism-poetry/
├── frontend/                # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   ├── i18n/          # Internationalization
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── utils/         # Utility functions
│   └── public/            # Static files
│
├── backend/               # Node.js backend application
│   ├── config/           # Configuration files
│   ├── middleware/       # Express middleware
│   ├── models/          # Mongoose models
│   └── routes/          # API routes
│
└── deploy/              # Deployment configuration
    ├── nginx.conf       # Nginx configuration
    └── setup-vps.sh     # VPS setup script
```

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/scientism-poetry.git
cd scientism-poetry
```

2. Run the setup script:
```bash
./setup.sh
```

3. Start the development servers:
```bash
npm run dev
```

## Deployment

### Prerequisites

1. A GoDaddy VPS server
2. Domain name pointing to your VPS
3. GitHub repository secrets configured:
   - `VPS_HOST`: Your VPS IP address
   - `VPS_USERNAME`: SSH username
   - `VPS_SSH_KEY`: SSH private key
   - `VPS_PORT`: SSH port (usually 22)
   - `REACT_APP_API_URL`: Backend API URL

### Initial VPS Setup

1. SSH into your VPS
2. Clone the repository
3. Run the VPS setup script:
```bash
cd scientism-poetry/deploy
chmod +x setup-vps.sh
./setup-vps.sh
```

### GitHub Actions Deployment

The project uses GitHub Actions for automated deployment. When you push to the master branch, it will:

1. Build the frontend
2. Prepare the backend
3. Deploy both to the VPS
4. Restart services

To deploy manually:

1. Push your changes to master:
```bash
git push origin master
```

2. Monitor the deployment:
   - Go to GitHub repository
   - Click "Actions" tab
   - Watch the deployment progress

### Environment Variables

#### Backend (.env)
```
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb://localhost:27017/scientism-poetry
JWT_SECRET=your_jwt_secret
```

#### Frontend (.env)
```
REACT_APP_API_URL=https://your-domain.com/api
```

## Monitoring and Maintenance

### View Backend Logs
```bash
pm2 logs scientism-poetry-backend
```

### Restart Backend
```bash
pm2 restart scientism-poetry-backend
```

### View Nginx Logs
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### SSL Certificate Renewal
```bash
sudo certbot renew
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Troubleshooting

### Deployment Issues
1. Check GitHub Actions logs for errors
2. Verify VPS connectivity
3. Check PM2 logs: `pm2 logs`
4. Check Nginx logs: `sudo nginx -t`

### Common Solutions
- Restart Nginx: `sudo systemctl restart nginx`
- Restart PM2: `pm2 restart all`
- Check disk space: `df -h`
- Check MongoDB status: `sudo systemctl status mongodb`

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Thanks to all contributors who have helped shape this project
- Special thanks to the scientific and poetry communities for inspiration
