const mongoose = require('mongoose');
const logger = require('./logger');

const connectDB = async () => {
  try {
    // Check if MONGODB_URI is defined
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    logger.info('Attempting to connect to MongoDB...', {
      uri: process.env.MONGODB_URI.replace(/mongodb:\/\/([^:]+):([^@]+)@/, 'mongodb://****:****@')
    });

    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);

    logger.info(`MongoDB Connected: ${conn.connection.host}`);

    // Add event listeners for connection issues
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', {
        error: err.message,
        stack: err.stack,
        state: mongoose.connection.readyState
      });
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected successfully');
    });

    // Handle process termination
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        logger.info('MongoDB connection closed through app termination');
        process.exit(0);
      } catch (err) {
        logger.error('Error closing MongoDB connection:', {
          error: err.message,
          stack: err.stack
        });
        process.exit(1);
      }
    });

    return conn;
  } catch (error) {
    logger.error('MongoDB connection failed:', {
      error: error.message,
      stack: error.stack,
      mongoUri: process.env.MONGODB_URI ? 'defined' : 'undefined'
    });
    
    // Re-throw the error to be handled by the server
    throw error;
  }
};

// Export a function that ensures connection
const ensureConnection = async () => {
  // If already connected, return existing connection
  if (mongoose.connection.readyState === 1) {
    logger.info('Using existing MongoDB connection');
    return mongoose.connection;
  }

  // If connecting, wait for connection
  if (mongoose.connection.readyState === 2) {
    logger.info('Waiting for existing MongoDB connection attempt...');
    return new Promise((resolve, reject) => {
      mongoose.connection.once('connected', () => {
        logger.info('MongoDB connection established');
        resolve(mongoose.connection);
      });
      mongoose.connection.once('error', (err) => {
        logger.error('MongoDB connection attempt failed:', {
          error: err.message,
          stack: err.stack
        });
        reject(err);
      });
    });
  }

  // Otherwise, create new connection
  logger.info('Creating new MongoDB connection...');
  return connectDB();
};

module.exports = ensureConnection;
