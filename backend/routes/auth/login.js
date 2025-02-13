const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const logger = require('../../config/logger');
const crypto = require('crypto');
const { generateTokens } = require('./utils');
const nodemailer = require('nodemailer');

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

// @route   POST /api/auth/forgot-password
// @desc    Initiate a password reset request
// @access  Public
router.post('/forgot-password',
  [
    check('email', 'Please enter a valid email address').isEmail()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findOne({ email: req.body.email });

      if (!user) {
        return res.status(200).json({
          success: true,
          message: 'If the email is registered, a reset link will be sent to your email'
        });
      }
 
      const resetToken = crypto.randomBytes(20).toString('hex');

      // Set a 15-minute validity period
      user.passwordResetToken = resetToken;
      user.passwordResetExpire = Date.now() + 15 * 60 * 1000;
      await user.save();

      const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          // user: process.env.EMAIL_USER,
          // pass: process.env.EMAIL_PASS,
          user: "ScientismPoetry@gmail.com",
          pass: "icyq ckak fppf lhiv",
        },
      });

      const mailOptions = {
        from: `ScientismPoetry Security Notification <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'Password Reset Request',
        html: `
          <h2>Password Reset Request</h2>
          <p>You are receiving this email because we received a password reset request for your account.</p>
          <p>Please click the link below within 15 minutes to reset your password:</p>
          <a href="${resetUrl}">${resetUrl}</a>
          <p>If you did not request a password reset, please ignore this email.</p>
        `
      };      

      await transporter.sendMail(mailOptions);

      res.status(200).json({
        success: true,
        message: 'If the email is registered, a reset link will be sent to your email'
      });

    } catch (error) {
      logger.error('Password reset request failed:', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Server error, please try again later'
      });
    }
  }
);

// @route   PUT /api/auth/reset-password/:token
// @desc    Perform password reset
// @access  Public
router.put('/reset-password/:token',
  [
    check('newPassword')
      .isLength({ min: 8 }).withMessage('The password must contain at least 8 characters')
      .matches(/\d/).withMessage('Must include numbers')
      .matches(/[A-Z]/).withMessage('Must contain capital letters')

  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const user = await User.findOne({
        passwordResetToken: req.params.token,
        passwordResetExpire: { $gt: Date.now() }
      }).select('email');

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'The reset token is invalid or expired'
        });
      }

      // Update password and clear reset field
      user.password = req.body.newPassword;
      user.passwordResetToken = undefined;
      user.passwordResetExpire = undefined;
      await user.save();

      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          // user: process.env.EMAIL_USER,
          // pass: process.env.EMAIL_PASS,
          user: "ScientismPoetry@gmail.com",
          pass: "frvs sknl yjor uppb",
        },
      });

      // Send password change notification email
      const mailOptions = {
        from: `ScientismPoetry Security Notification <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'Password Change Confirmation',
        text: `Your account password was successfully changed on ${new Date().toLocaleString()}. If this was not done by you, please contact the administrator immediately.`
      };
      await transporter.sendMail(mailOptions);

      res.status(200).json({
        success: true,
        message: 'Password reset successfully'
      });

    } catch (error) {
      logger.error('Password reset failed:', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Server error, please try again later'
      });
    }
  }
);

router.get('/validate-reset-token/:token', async (req, res) => {
  try {
    const user = await User.findOne({
      passwordResetToken: req.params.token,
      passwordResetExpire: { $gt: Date.now() }
    }).select('email');

    if (!user) {
      return res.status(400).json({
        valid: false,
        message: 'Invalid or expired reset token'
      });
    }

    res.status(200).json({
      valid: true,
      email: user.email
    });

  } catch (error) {
    logger.error('Token validation failed:', {
      token: req.params.token,
      error: error.message
    });
    res.status(500).json({
      valid: false,
      message: 'Server validation token failed'
    });
  }
});
module.exports = router;
