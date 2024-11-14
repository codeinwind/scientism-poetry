const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const logger = require('../config/logger');

// Generate JWT Tokens
const generateTokens = (id) => {
  const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '15m', // Shorter expiry for access token
  });
  
  const refreshToken = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',  // Longer expiry for refresh token
  });

  return { accessToken, refreshToken };
};

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        logger.warn('Registration attempt with existing email', { email });
        return res.status(400).json({ message: 'User already exists' });
      }

      user = await User.create({
        name,
        email,
        password,
      });

      const { accessToken, refreshToken } = generateTokens(user._id);

      // Set refresh token in HTTP-only cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      logger.info('User registered successfully', { userId: user._id });

      res.status(201).json({
        success: true,
        token: accessToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      logger.error('Registration error:', { error: error.message });
      res.status(500).json({ message: 'Server Error' });
    }
  }
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
  '/login',
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
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isMatch = await user.matchPassword(password);

      if (!isMatch) {
        logger.warn('Login attempt with incorrect password', { userId: user._id });
        return res.status(401).json({ message: 'Invalid credentials' });
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
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      logger.error('Login error:', { error: error.message });
      res.status(500).json({ message: 'Server Error' });
    }
  }
);

// @route   POST /api/auth/refresh-token
// @desc    Refresh access token
// @access  Public (with refresh token cookie)
router.post('/refresh-token', async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);

    // Set new refresh token in HTTP-only cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      success: true,
      token: accessToken,
    });
  } catch (error) {
    logger.error('Token refresh error:', { error: error.message });
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Public
router.post('/logout', (req, res) => {
  res.clearCookie('refreshToken');
  res.json({ success: true, message: 'Logged out successfully' });
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
      },
    });
  } catch (error) {
    logger.error('Get user profile error:', { error: error.message });
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put(
  '/profile',
  protect,
  [
    check('name', 'Name is required').optional().not().isEmpty(),
    check('email', 'Please include a valid email').optional().isEmail(),
    check('bio', 'Bio cannot exceed 500 characters').optional().isLength({ max: 500 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const { name, email, bio } = req.body;

      if (name) user.name = name;
      if (email) user.email = email;
      if (bio) user.bio = bio;

      await user.save();

      logger.info('User profile updated', { userId: user._id });

      res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          bio: user.bio,
        },
      });
    } catch (error) {
      logger.error('Update profile error:', { error: error.message });
      res.status(500).json({ message: 'Server Error' });
    }
  }
);

module.exports = router;
