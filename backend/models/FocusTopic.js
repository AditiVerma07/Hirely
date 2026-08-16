const mongoose = require('mongoose');

const focusTopicSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    source: {
      type: String,
      enum: ['ai-suggested', 'manual'],
      default: 'manual',
    },
    confidence: {
      type: String,
      enum: ['weak', 'medium', 'strong'],
      default: 'weak',
    },
    applications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application',
      },
    ],
    resourceLinks: [
      {
        title: { type: String, required: true },
        url: { type: String, required: true },
        source: { type: String, enum: ['auto', 'manual'], required: true },
      },
    ],
  },
  { timestamps: true }
);

// Prevents the same topic string being duplicated per user (e.g. two "System design" rows)
focusTopicSchema.index({ user: 1, title: 1 }, { unique: true });

module.exports = mongoose.model('FocusTopic', focusTopicSchema);