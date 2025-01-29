const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const logger = require('../../config/logger');
const { generateTokens } = require('./utils');

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email }).select('+password');

      if (!user) {
        logger.warn('Login attempt with non-existent email', { email });
        return res.status(401).json({ message: 'Email not registered' });
      }

      if (!user.isEmailVerified) {
        logger.warn('Login attempt with unverified email', { email });
        return res.status(401).json({ message: 'Email not verified' });
      }

      const isMatch = await user.matchPassword(password);

      if (!isMatch) {
        logger.warn('Login attempt with incorrect password', { userId: user._id });
        return res.status(401).json({ message: 'Incorrect password' });
      }

      const { accessToken, refreshToken } = generateTokens(user._id);

      // Set refresh token in HTTP-only cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      logger.info('User logged in successfully', { userId: user._id });

      res.json({
        success: true,
        token: accessToken,
        user: {
          _id: user._id,
          name: user.name,
          penName: user.penName,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          bio: user.bio,
        },
      });
    } catch (error) {
      logger.error('Login error:', { error: error.message });
      res.status(500).json({ message: 'Server Error' });
    }
  }
);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Public
router.post('/logout', (req, res) => {
  res.clearCookie('refreshToken');
  res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;
