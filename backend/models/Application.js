const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['applied', 'oa', 'interview', 'offer', 'rejected'],
      default: 'applied',
    },
    stipend: {
      type: String, // free text: "12 LPA", "₹40,000/mo" — ranges don't fit a number cleanly
      trim: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    applicationDate: {
      type: Date,
      default: Date.now,
    },
    interviewDate: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
    },
    followUpReminderSentAt: {
      type: Date,
      default: null,
    },
    interviewReminderSentAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Applications by user, sorted by most recently applied — the dashboard's default query shape
applicationSchema.index({ user: 1, applicationDate: -1 });

module.exports = mongoose.model('Application', applicationSchema);