const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const Poem = require('../models/Poem');
const { protect, authorize, superadminOnly } = require('../middleware/auth');
const logger = require('../config/logger');

// @route   GET /api/admin/stats
// @desc    Get admin dashboard statistics
// @access  Private (Admin & Superadmin)
router.get('/stats', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    logger.info('Fetching admin stats', {
      userId: req.user.id,
      role: req.user.role
    });

    const stats = {
      users: await User.countDocuments(),
      admins: await User.countDocuments({ role: 'admin' }),
      moderators: await User.countDocuments({ role: 'moderator' }),
      regularUsers: await User.countDocuments({ role: 'user' })
    };

    logger.info('Admin stats fetched successfully', {
      stats,
      userId: req.user.id
    });

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('Error fetching admin stats:', {
      error: error.message,
      userId: req.user.id
    });
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/admin/poems
// @desc    Get poems for moderation
// @access  Private (Admin, Superadmin, Moderator)
router.get('/poems', protect, authorize('admin', 'superadmin', 'moderator'), async (req, res) => {
  try {
    const { status = 'under_review', page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    logger.info('Fetching poems for moderation', {
      userId: req.user.id,
      role: req.user.role,
      status,
      page,
      limit
    });

    const query = status ? { status } : {};
    const poems = await Poem.find(query)
      .populate('author', 'name email')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Poem.countDocuments(query);

    logger.info('Poems fetched successfully', {
      count: poems.length,
      total,
      userId: req.user.id
    });

    res.json({
      success: true,
      data: poems,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Error fetching poems:', {
      error: error.message,
      userId: req.user.id
    });
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/admin/poems/:id/status
// @desc    Update poem status
// @access  Private (Admin, Superadmin, Moderator)
router.put(
  '/poems/:id/status',
  [
    protect,
    authorize('admin', 'superadmin', 'moderator'),
    check('status').isIn(['draft', 'under_review', 'published'])
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      logger.info('Updating poem status', {
        poemId: req.params.id,
        newStatus: req.body.status,
        userId: req.user.id,
        role: req.user.role
      });

      const poem = await Poem.findById(req.params.id);

      if (!poem) {
        logger.warn('Poem not found', {
          poemId: req.params.id,
          userId: req.user.id
        });
        return res.status(404).json({
          success: false,
          message: 'Poem not found'
        });
      }

      poem.status = req.body.status;
      poem.reviewedBy = req.user.id;
      poem.reviewedAt = Date.now();
      await poem.save();

      logger.info('Poem status updated successfully', {
        poemId: req.params.id,
        newStatus: req.body.status,
        userId: req.user.id
      });

      res.json({
        success: true,
        data: poem
      });
    } catch (error) {
      logger.error('Error updating poem status:', {
        error: error.message,
        poemId: req.params.id,
        userId: req.user.id
      });
      res.status(500).json({ message: 'Server Error' });
    }
  }
);

// @route   POST /api/admin/poems/:id/comments
// @desc    Add review comment to poem
// @access  Private (Admin, Superadmin, Moderator)
router.post(
  '/poems/:id/comments',
  [
    protect,
    authorize('admin', 'superadmin', 'moderator'),
    check('content', 'Comment content is required').not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      logger.info('Adding review comment', {
        poemId: req.params.id,
        userId: req.user.id,
        role: req.user.role
      });

      const poem = await Poem.findById(req.params.id);

      if (!poem) {
        logger.warn('Poem not found', {
          poemId: req.params.id,
          userId: req.user.id
        });
        return res.status(404).json({
          success: false,
          message: 'Poem not found'
        });
      }

      const comment = {
        content: req.body.content,
        author: req.user.id,
        createdAt: Date.now()
      };

      poem.reviewComments = poem.reviewComments || [];
      poem.reviewComments.push(comment);
      await poem.save();

      logger.info('Review comment added successfully', {
        poemId: req.params.id,
        userId: req.user.id
      });

      res.json({
        success: true,
        data: poem
      });
    } catch (error) {
      logger.error('Error adding review comment:', {
        error: error.message,
        poemId: req.params.id,
        userId: req.user.id
      });
      res.status(500).json({ message: 'Server Error' });
    }
  }
);

// @route   GET /api/admin/users
// @desc    Get all users (for admin management)
// @access  Private (Superadmin only)
router.get('/users', protect, superadminOnly, async (req, res) => {
  try {
    logger.info('Fetching all users', {
      userId: req.user.id,
      role: req.user.role
    });

    const users = await User.find().select('-password');
    
    logger.info('Users fetched successfully', {
      count: users.length,
      userId: req.user.id
    });

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    logger.error('Error fetching users:', {
      error: error.message,
      userId: req.user.id
    });
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role (grant/revoke admin privileges)
// @access  Private (Superadmin only)
router.put(
  '/users/:id/role',
  protect,
  superadminOnly,
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
      logger.info('Attempting to update user role', {
        targetUserId: req.params.id,
        newRole: req.body.role,
        requestUser: {
          id: req.user.id,
          role: req.user.role
        }
      });

      const user = await User.findById(req.params.id);

      if (!user) {
        logger.warn('User not found for role update', {
          targetUserId: req.params.id,
          userId: req.user.id
        });
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Prevent modifying superadmin role
      if (user.role === 'superadmin') {
        logger.warn('Attempt to modify superadmin role prevented', {
          targetUserId: req.params.id,
          userId: req.user.id
        });
        return res.status(403).json({
          success: false,
          message: 'Cannot modify superadmin role'
        });
      }

      // Prevent granting superadmin role
      if (req.body.role === 'superadmin') {
        logger.warn('Attempt to grant superadmin role prevented', {
          targetUserId: req.params.id,
          userId: req.user.id
        });
        return res.status(403).json({
          success: false,
          message: 'Cannot grant superadmin role'
        });
      }

      user.role = req.body.role;
      await user.save();

      logger.info('User role updated successfully', {
        targetUserId: req.params.id,
        newRole: req.body.role,
        userId: req.user.id
      });

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      logger.error('Error updating user role:', {
        error: error.message,
        targetUserId: req.params.id,
        userId: req.user.id
      });
      res.status(500).json({ message: 'Server Error' });
    }
  }
);

module.exports = router;
