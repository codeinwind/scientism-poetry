# Scientism Poetry

A web application for exploring the intersection of science and poetry. This platform allows users to share, discover, and engage with poetry that explores scientific concepts and discoveries.

## Features

- User authentication and authorization
- Create, read, update, and delete poems
- Like and comment on poems
- User profiles and dashboards
- Featured book showcase
- Responsive design for all devices

## Tech Stack

### Frontend
- React.js
- Material-UI (MUI)
- React Query for data fetching
- React Router for navigation
- Formik & Yup for form handling
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

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Create a `.env` file in the backend directory:
```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/scientism-poetry
JWT_SECRET=your_jwt_secret_key_here
```

5. Create a `.env` file in the frontend directory:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`

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
