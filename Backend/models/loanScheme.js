const mongoose = require('mongoose');

const loanSchemeSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Loan scheme name is required'],
    trim: true,
    maxlength: [200, 'Name cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    enum: ['startup', 'msme', 'women', 'women-sc-st', 'sc-st', 'agriculture', 'all', 'other'],
    default: 'other'
  },

  // Financial Details
  minAmount: {
    type: Number,
    required: [true, 'Minimum amount is required'],
    min: [0, 'Minimum amount cannot be negative']
  },
  maxAmount: {
    type: Number,
    required: [true, 'Maximum amount is required'],
    min: [0, 'Maximum amount cannot be negative']
  },
  interestRate: {
    type: String,
    trim: true,
    maxlength: [100, 'Interest rate description cannot exceed 100 characters']
  },
  tenure: {
    type: String,
    trim: true,
    maxlength: [100, 'Tenure description cannot exceed 100 characters']
  },
  processingTime: {
    type: String,
    trim: true,
    maxlength: [100, 'Processing time cannot exceed 100 characters']
  },

  color: {
    type: String,
    trim: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  popular: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },

  // Additional Content
  videoUrl: {
    type: String,
    trim: true
  },
  officialLink: {
    type: String,
    trim: true
  },

  // Types of this loan scheme (array)
  types: [{
    name: {
      type: String,
      trim: true
    },
    maxAmount: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    }
  }],

  // Benefits array
  benefits: [{
    type: String,
    trim: true
  }],

  // Eligibility criteria array
  eligibility: [{
    type: String,
    trim: true
  }],

  // Required documents array
  documents: [{
    type: String,
    trim: true
  }],

  // Application steps array
  applicationSteps: [{
    type: String,
    trim: true
  }],

  // Subsidy information (optional)
  subsidy: [{
    category: {
      type: String,
      trim: true
    },
    rate: {
      type: String,
      trim: true
    },
    maxCost: {
      type: String,
      trim: true
    }
  }],

  // Image URL (for the scheme)
  imageUrl: {
    type: String,
    trim: true
  },

  // Metadata
  views: {
    type: Number,
    default: 0
  },
  applicationsCount: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for search functionality
loanSchemeSchema.index({ name: 'text', description: 'text', category: 'text' });
loanSchemeSchema.index({ category: 1 });
loanSchemeSchema.index({ featured: 1 });
loanSchemeSchema.index({ popular: 1 });
loanSchemeSchema.index({ isActive: 1 });
loanSchemeSchema.index({ createdAt: -1 });

module.exports = mongoose.model('LoanScheme', loanSchemeSchema);

