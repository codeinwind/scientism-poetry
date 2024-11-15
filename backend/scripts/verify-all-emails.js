require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const logger = require('../config/logger');

const verifyAllEmails = async () => {
  try {
    // Connect to MongoDB
    logger.info('Connecting to MongoDB...', {
      mongoUri: process.env.MONGODB_URI ? 'defined' : 'undefined'
    });

    await mongoose.connect(process.env.MONGODB_URI);

    logger.info('Connected to MongoDB successfully');

    // Find all users and update their email verification status
    const result = await User.updateMany(
      { isEmailVerified: false },
      { $set: { isEmailVerified: true } }
    );

    logger.info('Email verification status updated', {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount
    });

    // Get and display all users
    const users = await User.find({}, 'name email isEmailVerified');
    logger.info('Current users:', {
      users: users.map(user => ({
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified
      }))
    });

  } catch (error) {
    logger.error('Error updating email verification status:', {
      error: error.message,
      stack: error.stack
    });
    process.exit(1);
  }

  // Close MongoDB connection
  await mongoose.connection.close();
  logger.info('MongoDB connection closed');
  process.exit(0);
};

// Run the script
verifyAllEmails();
