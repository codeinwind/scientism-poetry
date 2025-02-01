// models/AuthorApplication.js
const mongoose = require('mongoose');
const validator = require('validator');

const applicationStatus = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

const applicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  content: {
    statement: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 200
    },
    portfolioItems: [{
      title: { type: String, required: true },
      url: {
        type: String,
        validate: {
          validator: v => validator.isURL(v, { protocols: ['http','https'], require_protocol: true }),
          message: 'Invalid URL format'
        }
      },
      description: { type: String, maxlength: 200 }
    }],
    attachments: [{
      name: String,
      s3Key: { type: String, required: true },
      mimeType: String,
      size: Number
    }]
  },
  status: {
    type: String,
    enum: Object.values(applicationStatus),
    default: applicationStatus.DRAFT
  },
  reviewHistory: [{
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: { type: String, enum: ['approve', 'reject', 'request_changes', 'comment'] },
    feedback: String,
    internalNotes: String,
    timestamp: { type: Date, default: Date.now }
  }],
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30*24*60*60*1000) 
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

applicationSchema.index({ status: 1, createdAt: -1 });
applicationSchema.index({ user: 1, status: 1 }, { unique: true, partialFilterExpression: { status: applicationStatus.SUBMITTED } });

applicationSchema.pre('save', function(next) {
  const allowedTransitions = {
    [applicationStatus.DRAFT]: [applicationStatus.SUBMITTED],
    [applicationStatus.SUBMITTED]: [applicationStatus.UNDER_REVIEW, applicationStatus.REJECTED],
    [applicationStatus.UNDER_REVIEW]: [applicationStatus.APPROVED, applicationStatus.REJECTED, applicationStatus.SUBMITTED],
    [applicationStatus.APPROVED]: [],
    [applicationStatus.REJECTED]: [applicationStatus.SUBMITTED]
  };

  if (this.isModified('status') && !allowedTransitions[this.originalStatus].includes(this.status)) {
    return next(new Error(`Invalid status transition from ${this.originalStatus} to ${this.status}`));
  }
  next();
});

module.exports = mongoose.model('AuthorApplication', applicationSchema);