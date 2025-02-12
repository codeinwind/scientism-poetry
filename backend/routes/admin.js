const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const Poem = require('../models/Poem');
const AuthorApplication = require('../models/AuthorApplication');
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

// Get Top author requests for review (pagination)
router.get('/author-applications', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    logger.info('Fetching author applications for review', { userId: req.user.id, role: req.user.role });

    const applications = await AuthorApplication.find({ status: 'under_review' })
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await AuthorApplication.countDocuments({ status: 'under_review' });

    res.json({
      success: true,
      data: applications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Error fetching author applications:', { error: error.message, userId: req.user.id });
    res.status(500).json({ message: 'Server Error' });
  }
});

// Review popular author applications (approved/rejected)
router.post('/author-applications/review', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const { applicationId, action } = req.body;

    if (!['approved', 'rejected'].includes(action)) {
      return res.status(400).json({ success: false, message: 'Invalid action' });
    }

    logger.info('Reviewing author application', { applicationId, action, userId: req.user.id });

    const application = await AuthorApplication.findById(applicationId);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    application.status = action;
    await application.save();

    logger.info('Author application reviewed successfully', { applicationId, newStatus: action, userId: req.user.id });

    res.json({ success: true, message: `Application ${action} successfully.` });
  } catch (error) {
    logger.error('Error reviewing author application:', { error: error.message, applicationId: req.body.applicationId, userId: req.user.id });
    res.status(500).json({ message: 'Review action failed' });
  }
});

// User credentials manage routing
// @route   GET /api/admin/users/search
// @desc    Search user by email (Superadmin only)
router.get('/users/search',
  protect,
  superadminOnly,
  [
    check('email', 'Valid email is required').isEmail()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email } = req.query;
      const user = await User.findOne({ email }).select('-password');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ message: 'Search operation failed' });
    }
  }
);

// @route   POST /api/admin/users/reset-password
// @desc    Reset user password (Superadmin only)
router.post('/users/reset-password',
  protect,
  superadminOnly,
  [
    check('userId', 'User ID is required').not().isEmpty(),
    check('newPassword', 'Password must be at least 6 characters').isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { userId, newPassword } = req.body;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // pre('save') in User model
      user.password = newPassword;
      await user.save();

      res.json({
        success: true,
        message: 'Password has been reset'
      });
    } catch (error) {
      res.status(500).json({ message: 'Password reset failed' });
    }
  }
);

// @route   POST /api/admin/users/verify-email
// @desc    Manually verify user email (Superadmin only)
router.post('/users/verify-email',
  protect,
  superadminOnly,
  [
    check('userId', 'User ID is required').not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { userId } = req.body;
      const user = await User.findByIdAndUpdate(
        userId,
        { $set: { isEmailVerified: true } }, 
        { new: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        message: 'Email has been verified',
        data: user
      });
    } catch (error) {
      res.status(500).json({ message: 'Email verification failed' });
    }
  }
);

// @route GET /api/admin//poems/published/check
// @desc   Get published poems (supported search: by title or author name)
router.get(
  '/poems/published/check',
  protect,
  authorize('superadmin'),
  async (req, res) => {
    try {
      const { page = 1, limit = 10, q } = req.query;
      const skip = (page - 1) * limit;
      let query = { status: 'published' };

      if (q) {
        query.title = { $regex: q, $options: 'i' };
      }

      const poems = await Poem.find(query)
        .populate('author', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Poem.countDocuments(query);

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
      console.error('Error fetching published poems:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  }
);

// @route DELETE /api/admin/poems/:id
// @desc  Delete assigned poems
router.delete(
  '/poems/:id',
  protect,
  authorize('superadmin'),
  async (req, res) => {
    try {
      const poem = await Poem.findById(req.params.id);
      if (!poem) {
        return res.status(404).json({ success: false, message: 'Poem not found' });
      }
      await poem.deleteOne();  

      res.json({
        success: true,
        data: poem
      });
    } catch (error) {
      console.error('Error deleting poem:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  }
);

// Obtain all super administrators
router.get('/superadmin/users', protect, superadminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find({ role: 'superadmin' })
        .select('-password')
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments({ role: 'superadmin' })
    ]);

    res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Description Failed to query the super administrator: ' + error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Modify the permissions of the super administrator
router.put('/superadmin/modify/users/:id',
  protect,
  superadminOnly,
  [
    check('role')
      .isIn(['superadmin', 'admin', 'moderator', 'user'])
      .withMessage('Invalid role type')
  ],
  async (req, res) => {

    const errors = validationResult(req);
 
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    try {
      const targetUser = await User.findById(req.params.id);
      if (!targetUser) {
        return res.status(404).json({
          success: false,
          message: 'User does not exist'
        });
      }
      // Anti-self-modification
      if (targetUser._id.toString() === req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'You cannot modify your own permissions'
        });
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { role: req.body.role },
        { 
          new: true,
          runValidators: true  
        }
      ).select('-password');

      logger.info(`Role modified successfully`, {
        operator: req.user.id,
        targetUser: targetUser._id,
        newRole: req.body.role
      });

      res.json({ 
        success: true, 
        data: updatedUser 
      });

    } catch (error) {
      logger.error(`Role modification failed: ${error.message}`, {
        userId: req.params.id,
        error: error.stack
      });
      
      res.status(500).json({ 
        success: false,
        message: 'Server internal error'
      });
    }
  }
);

// Search for users by email
router.get('/superadmin/users/search',
  protect,
  superadminOnly,
  [
    check('email')
      .isEmail().withMessage('invalid_email')
      .normalizeEmail()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map(e => ({ msg: e.msg }))
      });
    }

    try {
      const user = await User.findOne({ 
        email: req.query.email 
      }).select('-password');

      if (!user) {
        return res.status(404).json({
          success: false,
          code: 'user_not_found'
        });
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      logger.error(`User search failed: ${error.message}`);
      res.status(500).json({
        success: false,
        code: 'server_error'
      });
    }
  }
);

module.exports = router;
