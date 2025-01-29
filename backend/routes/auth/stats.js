const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth');
const User = require('../../models/User');
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

module.exports = router;
