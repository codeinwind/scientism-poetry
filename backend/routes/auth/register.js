const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const logger = require('../../config/logger');
const nodemailer = require('nodemailer');
const { generateTokens } = require('./utils');

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('penName', 'Pen name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, penName, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        logger.warn('Registration attempt with existing email', { email });
        return res.status(400).json({ message: 'User already exists' });
      }

      user = await User.create({
        name,
        penName,
        email,
        password,
      });

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
          penName: user.penName,
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

module.exports = router;
