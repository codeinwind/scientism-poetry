const mongoose = require('mongoose');
const { detectLanguage } = require('../utils/langDetector');

const poemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Please add poem content'],
    maxlength: [5000, 'Poem cannot be more than 5000 characters']
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'under_review'],
    default: 'draft'  // Changed default to draft
  },
  tags: [{
    type: String,
    trim: true
  }],
  comments: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: [500, 'Comment cannot be more than 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  likes: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  language: { 
    type: String,
    enum: ['en', 'zh'],
    required: true,
    default: 'zh',
    index: true 
  }
});

// Update the updatedAt timestamp before saving
poemSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Add indexes for better query performance
poemSchema.index({ author: 1, status: 1 });
poemSchema.index({ createdAt: -1 });

poemSchema.index({
  status: 1,
  language: 1,
  createdAt: -1
});

poemSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Poem', poemSchema);
