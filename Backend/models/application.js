const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  // References
  internship: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Internship',
    required: [true, 'Internship reference is required']
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },

  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Company reference is required']
  },

  // Applicant Information
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },

  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },

  address: {
    type: String,
    trim: true
  },

  position: {
    type: String,
    trim: true
  },

  experience: {
    type: String,
    trim: true
  },

  // Resume/CV
  resume: {
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

  // Cover Letter
  coverLetter: {
    type: String,
    maxlength: [2000, 'Cover letter cannot exceed 2000 characters']
  },

  // Application Status
  status: {
    type: String,
    enum: ['pending', 'shortlisted', 'rejected', 'hired', 'withdrawn'],
    default: 'pending'
  },

  // Additional Fields
  expectedSalary: {
    type: String,
    trim: true
  },

  availability: {
    type: String,
    enum: ['Immediate', '1 week', '2 weeks', '1 month', 'Other'],
    default: 'Immediate'
  },

  // Communication
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },

  companyNotes: {
    type: String,
    maxlength: [1000, 'Company notes cannot exceed 1000 characters']
  },

  // Interview Details
  interviewDate: {
    type: Date,
    default: null
  },

  interviewLocation: {
    type: String,
    trim: true
  },

  interviewNotes: {
    type: String,
    maxlength: [1000, 'Interview notes cannot exceed 1000 characters']
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
applicationSchema.index({ internship: 1 });
applicationSchema.index({ user: 1 });
applicationSchema.index({ company: 1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ createdAt: -1 });
applicationSchema.index({ email: 1 });

// Prevent duplicate applications
applicationSchema.index({ internship: 1, user: 1 }, { unique: true });

// Virtual for days since application
applicationSchema.virtual('daysSinceApplication').get(function () {
  const now = new Date();
  const applied = this.createdAt;
  const diffTime = Math.abs(now - applied);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

module.exports = mongoose.model('Application', applicationSchema);

