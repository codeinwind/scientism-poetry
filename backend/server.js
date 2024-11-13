const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const logger = require('./config/logger');
const requestLogger = require('./middleware/logger');

// Load env vars
dotenv.config();

// Connect to database
connectDB().then(() => {
  logger.info('Database connected successfully');
}).catch(err => {
  logger.error('Database connection failed:', err);
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger); // Add request logging

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/poems', require('./routes/poems'));

// Health check route
app.get('/api/health', (req, res) => {
  logger.info('Health check endpoint called');
  res.json({ status: 'ok' });
});

// Error handling middleware  
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', {
    error: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
    user: req.user ? req.user.id : 'unauthenticated',
    headers: req.headers
  });

  res.status(500).json({
    success: false,
    error: 'Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Handle 404 routes
app.use((req, res) => {
  logger.warn('404 Not Found:', {
    url: req.originalUrl,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
    user: req.user ? req.user.id : 'unauthenticated'
  });

  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: 'The requested resource was not found'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  logger.error('Unhandled Promise Rejection:', {
    error: err.message,
    stack: err.stack
  });
  // Close server & exit process
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', {
    error: err.message,
    stack: err.stack
  });
  // Close server & exit process
  process.exit(1);
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Performing graceful shutdown...');
  process.exit(0);
});

// Handle SIGINT
process.on('SIGINT', () => {
  logger.info('SIGINT received. Performing graceful shutdown...');
  process.exit(0);
});
