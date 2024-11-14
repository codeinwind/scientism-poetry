const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const createSuperAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/scientism-poetry', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB Connected...');

    // Check if superadmin already exists
    const existingSuperAdmin = await User.findOne({ role: 'superadmin' });
    if (existingSuperAdmin) {
      console.log('Superadmin already exists');
      process.exit(0);
    }

    // Create superadmin user
    const superadmin = await User.create({
      name: 'Super Admin',
      email: 'superadmin@example.com', // Change this to your desired email
      password: 'superadmin123', // Change this to your desired password
      role: 'superadmin'
    });

    console.log('Superadmin created successfully:', {
      name: superadmin.name,
      email: superadmin.email,
      role: superadmin.role
    });

    process.exit(0);
  } catch (error) {
    console.error('Error creating superadmin:', error);
    process.exit(1);
  }
};

createSuperAdmin();
