const mongoose = require('mongoose');

const loanApplicationSchema = new mongoose.Schema({
  // User Reference (if logged in)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  // Personal Information
  applicantFullName: {
    type: String,
    required: [true, 'Applicant full name is required'],
    trim: true
  },
  mobileNumber: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number']
  },
  emailAddress: {
    type: String,
    required: [true, 'Email address is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true
  },

  // Business Information
  currentlyRunningBusiness: {
    type: String,
    enum: ['yes', 'no'],
    required: [true, 'Please specify if you are currently running a business']
  },
  msmeUdyamNumber: {
    type: String,
    trim: true,
    default: ''
  },
  businessDocuments: {
    url: {
      type: String,
      default: null
    },
    fileId: {
      type: String,
      default: null
    },
    fileName: {
      type: String,
      default: null
    },
    uploadedAt: {
      type: Date,
      default: null
    }
  },
  businessType: {
    type: String,
    required: [true, 'Business type is required'],
    trim: true
  },
  businessTypeOther: {
    type: String,
    trim: true,
    default: ''
  },
  businessName: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true
  },
  businessRegistrationType: {
    type: String,
    trim: true,
    default: ''
  },

  // Loan Information
  loanAmount: {
    type: Number,
    required: [true, 'Loan amount is required'],
    min: [0, 'Loan amount cannot be negative']
  },
  loanPurpose: {
    type: String,
    required: [true, 'Loan purpose is required'],
    trim: true
  },
  loanPurposeOther: {
    type: String,
    trim: true,
    default: ''
  },
  loanType: {
    type: String,
    required: [true, 'Loan type is required'],
    trim: true
  },
  loanTypeOther: {
    type: String,
    trim: true,
    default: ''
  },

  // Application Status
  status: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected', 'disbursed'],
    default: 'pending'
  },

  // Admin Notes
  adminNotes: {
    type: String,
    trim: true,
    default: ''
  },

  // Dates
  appliedAt: {
    type: Date,
    default: Date.now
  },
  statusUpdatedAt: {
    type: Date,
    default: null
  },

  // Viewed by Admin
  viewed: {
    type: Boolean,
    default: false
  },
  viewedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
loanApplicationSchema.index({ user: 1 });
loanApplicationSchema.index({ status: 1 });
loanApplicationSchema.index({ appliedAt: -1 });
loanApplicationSchema.index({ emailAddress: 1 });
loanApplicationSchema.index({ mobileNumber: 1 });

module.exports = mongoose.model('LoanApplication', loanApplicationSchema);

