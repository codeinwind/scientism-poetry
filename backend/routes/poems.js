const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Poem = require('../models/Poem');
const User = require('../models/User');
const { protect, authorize, checkOwnership } = require('../middleware/auth');

// Status transition validation
const VALID_STATUS_TRANSITIONS = {
  draft: ['under_review'],
  under_review: ['published', 'draft'],
  published: ['under_review']
};

// Validate status transition
const validateStatusTransition = (currentStatus, newStatus) => {
  const validTransitions = VALID_STATUS_TRANSITIONS[currentStatus];
  return validTransitions && validTransitions.includes(newStatus);
};

// @route  Get /api/authors/:authorId/bio
// @desc   update user's bio
router.put('/authors/:authorId/bio', async (req, res) => {
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
    console.error('Error updating bio:', error);
    res.status(500).json({ error: error.message });
  }
});


// @route  Get /api/poems/:authorId/author
// @desc   Get all poems by the designated author
router.get('/:authorId/author', async (req, res) => {
  try {
    const { authorId } = req.params;

    const author = await User.findById(authorId).select('name penName email createdAt');
    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }

    const poems = await Poem.find({ author: authorId, status: 'published' })
      .select('title content createdAt') 
      .sort({ createdAt: -1 });

    res.status(200).json({
      author, 
      poems,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   Get /api/poems/authors
// @desc    Get all users
router.get('/authors', async (req, res) => {
  try {
    // Query all users and filter common users (role: 'user')
    const authors = await User.find({ role: 'user' }) 
      .select('name penName createdAt') 
      .sort({ createdAt: -1 }); 

    res.status(200).json(authors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   Get /api/poems/authors/top
// @desc    Get a list of the most published authors
router.get('/authors/top', async (req, res) => {
  try {
    const authors = await Poem.aggregate([
      {
        $match: { status: 'published' }, 
      },
      {
        $group: {
          _id: '$author', 
          poemCount: { $sum: 1 }, 
        },
      },
      {
        $sort: { poemCount: -1 }, 
      },
      {
        $limit: 10, 
      },
      {
        $lookup: {
          from: 'users', 
          localField: '_id', 
          foreignField: '_id', 
          as: 'authorDetails', 
        },
      },
      {
        $unwind: '$authorDetails', 
      },
      {
        $project: {
          _id: 1,
          poemCount: 1,
          'authorDetails.name': 1,
          'authorDetails.penName': 1,
        },
      },
    ]);

    res.status(200).json(authors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/poems/:id/comments
// @desc    Add a comment to a poem
// @access  Private
router.post(
  '/:id/comments',
  protect,
  [
    check('content', 'Comment content is required')
      .not()
      .isEmpty()
      .isLength({ max: 500 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const poem = await Poem.findById(req.params.id);

      if (!poem) {
        return res.status(404).json({
          success: false,
          message: 'Poem not found'
        });
      }

      const newComment = {
        user: req.user.id,
        content: req.body.content
      };

      poem.comments.unshift(newComment);
      await poem.save();

      // Populate the user information for the new comment
      const populatedPoem = await Poem.findById(req.params.id)
        .populate('comments.user', 'name')
        .populate('author', 'name');

      res.json({
        success: true,
        data: populatedPoem
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  }
);

// @route   POST /api/poems/:id/like
// @desc    Like/Unlike a poem
// @access  Private
router.post('/:id/like', protect, async (req, res) => {
  try {
    const poem = await Poem.findById(req.params.id);

    if (!poem) {
      return res.status(404).json({
        success: false,
        message: 'Poem not found'
      });
    }

    // Check if the poem has already been liked by this user
    const likeIndex = poem.likes.indexOf(req.user.id);

    if (likeIndex > -1) {
      // User has already liked the poem, so unlike it
      poem.likes.splice(likeIndex, 1);
    } else {
      // Add the user's like
      poem.likes.push(req.user.id);
    }

    await poem.save();

    res.json({
      success: true,
      data: poem
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/poems/user/:id
// @desc    Get all poems by user (including all statuses)
// @access  Private
router.get('/user/:id', protect, async (req, res) => {
  try {
    // Check if user is requesting their own poems or is an admin
    if (req.params.id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these poems'
      });
    }

    const poems = await Poem.find({ author: req.params.id })
      .populate('author', 'name')
      .sort('-createdAt');

    res.json({
      success: true,
      poems: poems || [],
      count: poems ? poems.length : 0
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/poems/:id
// @desc    Get a single poem by ID
// @access  Public (for published poems)
router.get('/:id', async (req, res) => {
  try {
    const poem = await Poem.findById(req.params.id)
      .populate('author', 'name')
      .populate('comments.user', 'name');

    if (!poem) {
      return res.status(404).json({
        success: false,
        message: 'Poem not found'
      });
    }

    // If poem is not published, check if user is authorized to view it
    if (poem.status !== 'published') {
      // Check if user is authenticated
      if (!req.user) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view this poem'
        });
      }

      // Check if user is the author or an admin
      if (req.user.id !== poem.author.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view this poem'
        });
      }
    }

    res.json({
      success: true,
      data: poem
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/poems
// @desc    Create a new poem
// @access  Private
router.post(
  '/',
  protect,
  [
    check('title', 'Title is required').not().isEmpty(),
    check('content', 'Content is required').not().isEmpty(),
    check('status', 'Status must be either draft or under_review')
      .isIn(['draft', 'under_review'])
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, content, tags, status } = req.body;

      const poem = await Poem.create({
        title,
        content,
        tags,
        status, // Use status from request body
        author: req.user.id,
      });

      console.log('Created poem:', poem); // Debug log

      res.status(201).json({
        success: true,
        data: poem,
      });
    } catch (error) {
      console.error('Error creating poem:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  }
);

// @route   GET /api/poems
// @desc    Get all published poems
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // First check if there are any published poems
    const total = await Poem.countDocuments({ status: 'published' });

    // If no poems exist, return early with empty data
    if (total === 0) {
      return res.json({
        success: true,
        data: [],
        pagination: {
          page: 1,
          limit,
          total: 0,
          pages: 0,
        },
      });
    }

    const poems = await Poem.find({ status: 'published' })
      .populate('author', 'name')
      .sort('-createdAt')
      .skip(startIndex)
      .limit(limit);

    res.json({
      success: true,
      data: poems,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/poems/:id/status
// @desc    Update poem status
// @access  Private (Admin only)
router.put(
  '/:id/status',
  protect,
  authorize('admin'),
  [
    check('status', 'Status is required')
      .not()
      .isEmpty()
      .isIn(['draft', 'under_review', 'published'])
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const poem = await Poem.findById(req.params.id);

      if (!poem) {
        return res.status(404).json({
          success: false,
          message: 'Poem not found'
        });
      }

      const newStatus = req.body.status;

      // Validate status transition
      if (!validateStatusTransition(poem.status, newStatus)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status transition from ${poem.status} to ${newStatus}`
        });
      }

      poem.status = newStatus;
      await poem.save();

      res.json({
        success: true,
        data: poem,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  }
);

// @route   PUT /api/poems/:id
// @desc    Update poem
// @access  Private
router.put(
  '/:id',
  protect,
  checkOwnership(Poem),
  [
    check('title', 'Title is required').optional().not().isEmpty(),
    check('content', 'Content is required').optional().not().isEmpty(),
    check('status', 'Status must be either draft or under_review')
      .optional()
      .isIn(['draft', 'under_review'])
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, content, tags, status } = req.body;
      console.log('Updating poem with data:', { title, content, tags, status }); // Debug log

      const poem = await Poem.findById(req.params.id);

      if (!poem) {
        return res.status(404).json({
          success: false,
          message: 'Poem not found'
        });
      }

      if (title) poem.title = title;
      if (content) poem.content = content;
      if (tags) poem.tags = tags;
      if (status) poem.status = status;

      await poem.save();
      console.log('Updated poem:', poem); // Debug log

      res.json({
        success: true,
        data: poem,
      });
    } catch (error) {
      console.error('Error updating poem:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  }
);

// @route   DELETE /api/poems/:id
// @desc    Delete poem
// @access  Private
router.delete('/:id', protect, checkOwnership(Poem), async (req, res) => {
  try {
    const poem = await Poem.findById(req.params.id);

    if (!poem) {
      return res.status(404).json({
        success: false,
        message: 'Poem not found'
      });
    }

    await poem.deleteOne();

    res.json({
      success: true,
      message: 'Poem deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
