const mongoose = require('mongoose');

const mentorBookingSchema = new mongoose.Schema({
  // Mentor reference
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mentor',
    required: [true, 'Mentor reference is required']
  },

  // User reference (student)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },

  // Session Details
  sessionType: {
    type: String,
    enum: ['20min', '50min', '90min'],
    required: [true, 'Session type is required']
  },
  duration: {
    type: String,
    required: true
  },

  // Date and Time
  date: {
    type: Date,
    required: [true, 'Session date is required']
  },
  time: {
    type: String,
    required: [true, 'Session time is required']
  },

  // Payment Information
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: 0
  },
  paymentMethod: {
    type: String,
    enum: ['upi', 'card', 'netbanking', 'wallet'],
    default: null
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  transactionId: {
    type: String,
    default: null
  },
  paidAt: {
    type: Date,
    default: null
  },

  // Booking Status
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  rejectedAt: {
    type: Date,
    default: null
  },
  acceptedAt: {
    type: Date,
    default: null
  },
  completedAt: {
    type: Date,
    default: null
  },
  cancelledAt: {
    type: Date,
    default: null
  },

  // Session Link (for video calls)
  sessionLink: {
    type: String,
    default: null
  },

  // Student Message
  message: {
    type: String,
    trim: true,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },

  // Review & Rating (after session completion)
  review: {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [500, 'Review cannot exceed 500 characters']
    },
    createdAt: {
      type: Date,
      default: null
    }
  },

  // Cancellation
  cancellationReason: {
    type: String,
    trim: true,
    default: null
  },
  cancelledBy: {
    type: String,
    enum: ['user', 'mentor', 'system'],
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
mentorBookingSchema.index({ mentor: 1, status: 1 });
mentorBookingSchema.index({ user: 1, status: 1 });
mentorBookingSchema.index({ date: 1, time: 1 });
mentorBookingSchema.index({ createdAt: -1 });

module.exports = mongoose.model('MentorBooking', mentorBookingSchema);

