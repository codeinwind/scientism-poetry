const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const logger = require('./config/logger');
const requestLogger = require('./middleware/logger');
const cookieParser = require('cookie-parser');

// Load env vars
dotenv.config();

// Verify required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  logger.error('Missing required environment variables:', {
    missing: missingEnvVars
  });
  process.exit(1);
}

const app = express();

// Get allowed origins based on environment
const getAllowedOrigins = () => {
  const origins = [];
  
  // Always allow local development
  origins.push('http://localhost:3000');
  
  // Add production frontend URL if configured
  if (process.env.FRONTEND_URL) {
    origins.push(process.env.FRONTEND_URL);
  }
  
  return origins;
};

// CORS configuration
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = getAllowedOrigins();
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Set-Cookie'],
}));

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

// Health check route - place it before other routes
app.get('/api/health', async (req, res) => {
  try {
    // Check database connection
    const dbStatus = mongoose.connection.readyState;
    const dbStatusText = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    }[dbStatus];
    
    logger.info('Health check called', {
      dbStatus: dbStatusText,
      nodeVersion: process.version,
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime(),
      mongoUri: process.env.MONGODB_URI ? 'defined' : 'undefined'
    });

    // If database is not connected, return error
    if (dbStatus !== 1) {
      logger.error('Health check failed - Database not connected', {
        dbStatus: dbStatusText,
        mongoUri: process.env.MONGODB_URI ? 'defined' : 'undefined'
      });
      return res.status(503).json({
        status: 'error',
        message: 'Database not connected',
        dbStatus: dbStatusText,
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      dbStatus: dbStatusText,
      service: 'scientism-poetry-api',
      version: process.env.npm_package_version || '1.0.0'
    });
  } catch (error) {
    logger.error('Health check failed', {
      error: error.message,
      stack: error.stack,
      mongoUri: process.env.MONGODB_URI ? 'defined' : 'undefined'
    });
    res.status(500).json({
      status: 'error',
      message: 'Health check failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/poems', require('./routes/poems'));

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
    headers: req.headers,
    dbStatus: mongoose.connection.readyState
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

// Initialize server
const startServer = async () => {
  try {
    logger.info('Starting server initialization...', {
      env: process.env.NODE_ENV,
      mongoUri: process.env.MONGODB_URI ? 'defined' : 'undefined'
    });

    // Connect to database
    await connectDB();
    logger.info('Database connected successfully', {
      host: mongoose.connection.host,
      name: mongoose.connection.name
    });

    // Log CORS configuration
    logger.info('CORS configuration:', {
      allowedOrigins: getAllowedOrigins()
    });

    // Start server
    const server = app.listen(PORT, () => {
      logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`, {
        dbStatus: mongoose.connection.readyState
      });
    });

    // Handle server errors
    server.on('error', (error) => {
      logger.error('Server error:', {
        error: error.message,
        stack: error.stack,
        dbStatus: mongoose.connection.readyState
      });
      process.exit(1);
    });

  } catch (error) {
    logger.error('Server initialization failed:', {
      error: error.message,
      stack: error.stack,
      mongoUri: process.env.MONGODB_URI ? 'defined' : 'undefined',
      dbStatus: mongoose.connection ? mongoose.connection.readyState : 'undefined'
    });
    process.exit(1);
  }
};

// Start the server
startServer().catch((error) => {
  logger.error('Failed to start server:', {
    error: error.message,
    stack: error.stack,
    mongoUri: process.env.MONGODB_URI ? 'defined' : 'undefined',
    dbStatus: mongoose.connection ? mongoose.connection.readyState : 'undefined'
  });
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  logger.error('Unhandled Promise Rejection:', {
    error: err.message,
    stack: err.stack,
    dbStatus: mongoose.connection ? mongoose.connection.readyState : 'undefined'
  });
  // Close server & exit process
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', {
    error: err.message,
    stack: err.stack,
    dbStatus: mongoose.connection ? mongoose.connection.readyState : 'undefined'
  });
  // Close server & exit process
  process.exit(1);
});

// Graceful shutdown
const gracefulShutdown = () => {
  logger.info('Received shutdown signal. Starting graceful shutdown...', {
    dbStatus: mongoose.connection ? mongoose.connection.readyState : 'undefined'
  });
  
  // Close database connection
  if (mongoose.connection && mongoose.connection.readyState === 1) {
    mongoose.connection.close(false, () => {
      logger.info('MongoDB connection closed.');
      process.exit(0);
    });
  } else {
    logger.warn('No active MongoDB connection to close', {
      dbStatus: mongoose.connection ? mongoose.connection.readyState : 'undefined'
    });
    process.exit(0);
  }
};

// Handle SIGTERM
process.on('SIGTERM', gracefulShutdown);

// Handle SIGINT
process.on('SIGINT', gracefulShutdown);
