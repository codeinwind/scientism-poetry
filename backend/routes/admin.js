const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect, authorize, superadminOnly, canManageAdmins } = require('../middleware/auth');

// @route   GET /api/admin/users
// @desc    Get all users (for admin management)
// @access  Private (Superadmin only)
router.get('/users', protect, superadminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role (grant/revoke admin privileges)
// @access  Private (Superadmin only)
router.put(
  '/users/:id/role',
  protect,
  canManageAdmins,
  [
    check('role', 'Role is required')
      .not()
      .isEmpty()
      .isIn(['user', 'moderator', 'admin'])
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Prevent modifying superadmin role
      if (user.role === 'superadmin') {
        return res.status(403).json({
          success: false,
          message: 'Cannot modify superadmin role'
        });
      }

      // Prevent granting superadmin role
      if (req.body.role === 'superadmin') {
        return res.status(403).json({
          success: false,
          message: 'Cannot grant superadmin role'
        });
      }

      user.role = req.body.role;
      await user.save();

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  }
);

// @route   GET /api/admin/users/:id
// @desc    Get user details
// @access  Private (Superadmin only)
router.get('/users/:id', protect, superadminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/admin/stats
// @desc    Get admin dashboard statistics
// @access  Private (Superadmin & Admin)
router.get('/stats', [protect, authorize(['admin', 'superadmin'])], async (req, res) => {
  try {
    const stats = {
      users: await User.countDocuments(),
      admins: await User.countDocuments({ role: 'admin' }),
      moderators: await User.countDocuments({ role: 'moderator' }),
      regularUsers: await User.countDocuments({ role: 'user' })
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
