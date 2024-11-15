const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const logger = require('../../config/logger');
const { generateTokens } = require('./utils');

// Import route modules
const registerRoutes = require('./register');
const loginRoutes = require('./login');
const verificationRoutes = require('./verification');
const statsRoutes = require('./stats');

// Use route modules
router.use('/register', registerRoutes);
router.use('/login', loginRoutes);
router.use('/verification', verificationRoutes);
router.use('/stats', statsRoutes);

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

module.exports = router;
