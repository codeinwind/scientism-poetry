const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Poem = require('../models/Poem');
const { protect, authorize, checkOwnership } = require('../middleware/auth');

// @route   POST /api/poems
// @desc    Create a new poem
// @access  Private
router.post(
  '/',
  protect,
  [
    check('title', 'Title is required').not().isEmpty(),
    check('content', 'Content is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, content, tags } = req.body;

      const poem = await Poem.create({
        title,
        content,
        tags,
        author: req.user.id,
      });

      res.status(201).json({
        success: true,
        data: poem,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  }
);

// @route   GET /api/poems/user/:id
// @desc    Get all poems by user
// @access  Private
router.get('/user/:id', protect, async (req, res) => {
  try {
    const poems = await Poem.find({ author: req.params.id })
      .populate('author', 'name')
      .sort('-createdAt');

    // Return empty array if no poems found
    res.json({
      success: true,
      data: poems || [],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/poems
// @desc    Get all published poems
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const poems = await Poem.find({ status: 'published' })
      .populate('author', 'name')
      .sort('-createdAt')
      .skip(startIndex)
      .limit(limit);

    const total = await Poem.countDocuments({ status: 'published' });

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

// @route   GET /api/poems/:id
// @desc    Get single poem
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const poem = await Poem.findById(req.params.id)
      .populate('author', 'name')
      .populate('comments.user', 'name');

    if (!poem) {
      return res.status(404).json({ message: 'Poem not found' });
    }

    res.json({
      success: true,
      data: poem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

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
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, content, tags, status } = req.body;

      const poem = await Poem.findById(req.params.id);

      if (title) poem.title = title;
      if (content) poem.content = content;
      if (tags) poem.tags = tags;
      if (status && req.user.role === 'admin') poem.status = status;

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

// @route   DELETE /api/poems/:id
// @desc    Delete poem
// @access  Private
router.delete('/:id', protect, checkOwnership(Poem), async (req, res) => {
  try {
    await Poem.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/poems/:id/comments
// @desc    Add comment to poem
// @access  Private
router.post(
  '/:id/comments',
  protect,
  [check('content', 'Comment content is required').not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const poem = await Poem.findById(req.params.id);

      if (!poem) {
        return res.status(404).json({ message: 'Poem not found' });
      }

      const comment = {
        user: req.user.id,
        content: req.body.content,
      };

      poem.comments.unshift(comment);
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

// @route   POST /api/poems/:id/like
// @desc    Like/Unlike a poem
// @access  Private
router.post('/:id/like', protect, async (req, res) => {
  try {
    const poem = await Poem.findById(req.params.id);

    if (!poem) {
      return res.status(404).json({ message: 'Poem not found' });
    }

    // Check if poem has already been liked by user
    const likeIndex = poem.likes.indexOf(req.user.id);

    if (likeIndex === -1) {
      poem.likes.push(req.user.id);
    } else {
      poem.likes.splice(likeIndex, 1);
    }

    await poem.save();

    res.json({
      success: true,
      data: poem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
