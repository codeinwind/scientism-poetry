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

## Project Structure

```
scientism-poetry/
├── frontend/                # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   ├── i18n/          # Internationalization
│   │   │   ├── locales/   # Translation files
│   │   │   └── i18n.js    # i18n configuration
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── utils/         # Utility functions
│   └── public/            # Static files
│
└── backend/               # Node.js backend application
    ├── config/           # Configuration files
    ├── middleware/       # Express middleware
    ├── models/          # Mongoose models
    └── routes/          # API routes
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/scientism-poetry.git
cd scientism-poetry
```

2. Run the setup script:
```bash
./setup.sh
```

This will:
- Install all dependencies
- Create necessary environment files
- Set up the development environment

3. Start the development servers:
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Internationalization

The application supports multiple languages:
- English (default)
- Chinese (简体中文)

To add a new language:
1. Create a new translation file in `frontend/src/i18n/locales/[lang]/translation.json`
2. Add the language to the supported languages list in `frontend/src/contexts/LanguageContext.js`

Users can switch languages using the language selector in the navigation bar.

## API Documentation

### Authentication Endpoints

- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user
- PUT `/api/auth/profile` - Update user profile

### Poems Endpoints

- GET `/api/poems` - Get all poems
- GET `/api/poems/:id` - Get single poem
- POST `/api/poems` - Create new poem
- PUT `/api/poems/:id` - Update poem
- DELETE `/api/poems/:id` - Delete poem
- POST `/api/poems/:id/like` - Like/unlike poem
- POST `/api/poems/:id/comments` - Add comment to poem

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Thanks to all contributors who have helped shape this project
- Special thanks to the scientific and poetry communities for inspiration
