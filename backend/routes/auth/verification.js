const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const logger = require('../../config/logger');
const nodemailer = require('nodemailer');

// @route   POST /api/auth/resend-verification
// @desc    Resend verification email
// @access  Public
router.post('/resend', [
  check('email', 'Please include a valid email').isEmail(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      logger.warn('Resend verification attempt with non-existent email', { email });
      return res.status(404).json({ message: 'Email not registered' });
    }

    // Send validation email
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const validationUrl = `${req.protocol}://${req.get('host')}/api/auth/verify-email/${token}`;

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Email Verification',
      text: `Please verify your email by clicking on the following link: ${validationUrl}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Verification email sent' });
  } catch (error) {
    logger.error('Resend verification error:', { error: error.message });
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/auth/verify-email/:token
// @desc    Verify user email
// @access  Public
router.get('/verify/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    user.isEmailVerified = true;
    await user.save();

    // Redirect to login page
    res.redirect('/login');
  } catch (error) {
    logger.error('Email verification error:', { error: error.message });
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
