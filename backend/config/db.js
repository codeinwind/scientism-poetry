const mongoose = require('mongoose');
const logger = require('./logger');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }

    logger.info('Attempting to connect to MongoDB...', {
      uri: mongoURI.replace(/mongodb:\/\/([^:]+):([^@]+)@/, 'mongodb://****:****@') // Hide credentials in logs
    });

    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      heartbeatFrequencyMS: 10000, // Check connection every 10s
    });

    mongoose.connection.on('connected', () => {
      logger.info('MongoDB connected successfully');
    });

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', {
        error: err.message,
        stack: err.stack
      });
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });

    // If the Node process ends, close the MongoDB connection
    process.on('SIGINT', () => {
      mongoose.connection.close(() => {
        logger.info('MongoDB connection closed through app termination');
        process.exit(0);
      });
    });

    return conn;
  } catch (error) {
    logger.error('MongoDB connection failed:', {
      error: error.message,
      stack: error.stack
    });
    throw error; // Re-throw to be handled by server.js
  }
};

module.exports = connectDB;
