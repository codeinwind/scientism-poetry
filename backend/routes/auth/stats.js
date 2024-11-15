const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth');
const User = require('../../models/User');
const Poem = require('../../models/Poem');
const logger = require('../../config/logger');

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

module.exports = router;
