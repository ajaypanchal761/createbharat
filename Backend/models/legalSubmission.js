const mongoose = require('mongoose');

const legalSubmissionSchema = new mongoose.Schema({
  // Service Reference
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LegalService',
    required: [true, 'Service is required']
  },

  // User Reference
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },

  // Service Details (snapshot at time of submission)
  serviceName: {
    type: String,
    required: true,
    trim: true
  },
  servicePrice: {
    type: String,
    required: true,
    trim: true
  },

  // Submission Information
  category: {
    type: String,
    trim: true,
    default: ''
  },

  // Uploaded Documents
  documents: [{
    fieldName: {
      type: String,
      required: true,
      trim: true
    },
    fileName: {
      type: String,
      required: true,
      trim: true
    },
    fileUrl: {
      type: String,
      required: true,
      trim: true
    },
    fileType: {
      type: String,
      trim: true
    },
    fileSize: {
      type: Number
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Payment Information
  paymentMethod: {
    type: String,
    enum: ['razorpay', 'upi', 'card', 'netbanking', 'wallet'],
    default: null
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentAmount: {
    type: Number,
    default: 0
  },
  transactionId: {
    type: String,
    trim: true,
    default: null
  },
  razorpayOrderId: {
    type: String,
    trim: true,
    default: null
  },
  razorpayPaymentId: {
    type: String,
    trim: true,
    default: null
  },
  razorpaySignature: {
    type: String,
    trim: true,
    default: null
  },
  paidAt: {
    type: Date,
    default: null
  },

  // Status
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'rejected', 'cancelled'],
    default: 'pending'
  },

  // CA Notes/Reason
  caNotes: {
    type: String,
    trim: true,
    default: ''
  },
  rejectionReason: {
    type: String,
    trim: true,
    default: ''
  },

  // Timestamps
  submittedAt: {
    type: Date,
    default: Date.now
  },
  processedAt: {
    type: Date,
    default: null
  },
  completedAt: {
    type: Date,
    default: null
  },
  rejectedAt: {
    type: Date,
    default: null
  },
  refundedAt: {
    type: Date,
    default: null
  },
  refundId: {
    type: String,
    trim: true,
    default: null
  },
  refundAmount: {
    type: Number,
    default: 0
  },

  // Settlement tracking for CA
  settlementStatus: {
    type: String,
    enum: ['pending', 'settled'],
    default: 'pending'
  },
  settlementPaidTo: {
    type: String,
    enum: ['CA', 'Mentor', 'N/A'],
    default: 'CA'
  },
  settlementPaidAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
legalSubmissionSchema.index({ service: 1, user: 1 });
legalSubmissionSchema.index({ user: 1, status: 1 });
legalSubmissionSchema.index({ status: 1 });
legalSubmissionSchema.index({ paymentStatus: 1 });
legalSubmissionSchema.index({ createdAt: -1 });

// Virtual for formatted user name
legalSubmissionSchema.virtual('userName').get(function() {
  if (this.user && typeof this.user === 'object') {
    return `${this.user.firstName || ''} ${this.user.lastName || ''}`.trim() || this.user.email || 'User';
  }
  return 'User';
});

// Virtual for user email
legalSubmissionSchema.virtual('userEmail').get(function() {
  if (this.user && typeof this.user === 'object') {
    return this.user.email || '';
  }
  return '';
});

// Virtual for user phone
legalSubmissionSchema.virtual('userPhone').get(function() {
  if (this.user && typeof this.user === 'object') {
    return this.user.phone || '';
  }
  return '';
});

module.exports = mongoose.model('LegalSubmission', legalSubmissionSchema);

