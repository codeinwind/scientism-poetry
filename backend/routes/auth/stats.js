const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth');
const User = require('../../models/User');
const AuthorApplication = require('../../models/AuthorApplication');
const Poem = require('../../models/Poem');
const logger = require('../../config/logger');
const bcrypt = require('bcryptjs');

// @route   GET /api/auth/stats/activity
// @desc    Get user activity statistics
// @access  Private
router.get('/activity', protect, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get published poems count
    const publishedPoemsCount = await Poem.countDocuments({
      author: userId,
      status: 'published'
    });

    // For now, return basic stats
    // TODO: Implement likes and comments counts when those features are added
    res.json({
      success: true,
      publishedPoems: publishedPoemsCount,
      totalLikes: 0, // Placeholder until likes feature is implemented
      commentsMade: 0 // Placeholder until comments feature is implemented
    });
  } catch (error) {
    logger.error('Get user activity stats error:', { error: error.message });
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route  Put /api/auth/stats/:authorId/bio/modify
// @desc   update user's bio
router.put('/:authorId/bio/modify', protect, async (req, res) => {
  try {
    const { authorId } = req.params;
    const { bio } = req.body;
    const author = await User.findByIdAndUpdate(
      authorId,
      { bio },
      { new: true, runValidators: true }
    );

    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }

    res.status(200).json({
      message: 'Bio updated successfully',
      author,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route  Put /api/auth/stats/:authorId/bio/modify
// @desc   update user's bio
router.put('/:authorId/penname/modify', protect, async (req, res) => {
  try {
    const { authorId } = req.params;
    const { penName } = req.body;
    const author = await User.findByIdAndUpdate(
      authorId,
      { penName },
      { new: true, runValidators: true }
    );

    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }

    res.status(200).json({
      message: 'penName updated successfully',
      author,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/change-password', protect, async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;

    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // pre('save') in User model
    user.password = newPassword;

    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password update error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Submit an hot-user application (created/updated)
router.post('/hot-user/application', protect, async (req, res) => {
  try {
    const { statement } = req.body;
    const userId = req.user.id;

    if (!statement || statement.length < 10 || statement.length > 200) {
      return res.status(400).json({
        success: false,
        message: 'Application statement must be between 10 and 200 characters.'
      });
    }

    let existingApplication = await AuthorApplication.findOne({ user: userId });
    let wasNew = !existingApplication; 
    
    const application = await AuthorApplication.findOneAndUpdate(
      { user: userId },
      {
        'content.statement': statement,
        status: 'under_review'
      },
      {
        new: true,          
        upsert: true,       
        setDefaultsOnInsert: true
      }
    );
    
    res.json({
      success: true,
      data: application,
      message: wasNew
    });

  } catch (error) {
    console.error('Application submission failed:', error);
    res.status(500).json({
      success: false,
      message: 'Application request failed. Please try again later.'
    });
  }
});


// Get hot-user application status 
router.get('/:authorId/author-applications/status', async (req, res) => {
  const { authorId } = req.params;
  try {

    const application = await AuthorApplication.findOne(
      { user: authorId },
      'status content.statement updatedAt'
    ).lean();

    const responseData = {
      success: true,
      data: application
    };

    res.json(responseData);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
