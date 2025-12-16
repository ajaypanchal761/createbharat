const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'loan_application',
      'user_registration',
      'legal_submission',
      'training_enrollment',
      'payment_received',
      'mentor_booking',
      'system_alert',
      'other'
    ]
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  link: {
    type: String,
    default: null // Optional link to related page
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date,
    default: null
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {} // Store additional data like user ID, application ID, etc.
  }
}, {
  timestamps: true
});

// Index for efficient queries
notificationSchema.index({ admin: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);

