require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const logger = require('../config/logger');

const createSuperAdmin = async () => {
  try {
    // Log the MongoDB URI to confirm it's being loaded
    logger.info('MongoDB URI:', process.env.MONGODB_URI);

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logger.info('MongoDB Connected');

    // Remove existing superadmin if any
    const existingSuperAdmin = await User.findOne({ role: 'superadmin' });
    if (existingSuperAdmin) {
      logger.info('Removing existing superadmin:', {
        id: existingSuperAdmin._id,
        email: existingSuperAdmin.email
      });
      await User.deleteOne({ _id: existingSuperAdmin._id });
    }

    // Create new superadmin
    const superAdmin = await User.create({
      name: 'Super Admin',
      email: 'sxuuwo@gmail.com', // Change this to your desired email
      password: 'superadmin123', // Change this to your desired password
      role: 'superadmin',
      isEmailVerified: true // Set email as verified
    });

    logger.info('Superadmin created successfully:', {
      id: superAdmin._id,
      email: superAdmin.email
    });

    process.exit(0);
  } catch (error) {
    logger.error('Error creating superadmin:', {
      error: error.message,
      stack: error.stack
    });
    process.exit(1);
  }
};

// Run the script
createSuperAdmin();
