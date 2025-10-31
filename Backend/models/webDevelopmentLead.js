const mongoose = require('mongoose');

const webDevelopmentLeadSchema = new mongoose.Schema({
  // Project Information
  projectName: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    maxlength: [200, 'Project name cannot exceed 200 characters']
  },

  description: {
    type: String,
    required: [true, 'Project description is required'],
    trim: true,
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },

  platform: {
    type: String,
    required: [true, 'Platform is required'],
    enum: ['ios', 'android', 'both', 'web', 'cross-platform'],
    trim: true
  },

  features: {
    type: String,
    trim: true,
    maxlength: [2000, 'Features cannot exceed 2000 characters']
  },

  budget: {
    type: String,
    enum: ['under-10k', '10k-50k', '50k-1l', '1l-5l', 'above-5l'],
    trim: true
  },

  timeline: {
    type: String,
    enum: ['1-month', '2-3-months', '3-6-months', '6-12-months', 'flexible'],
    trim: true
  },

  // Contact Information
  clientName: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true,
    maxlength: [100, 'Client name cannot exceed 100 characters']
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },

  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    maxlength: [20, 'Phone number cannot exceed 20 characters']
  },

  company: {
    type: String,
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },

  // Status
  status: {
    type: String,
    enum: ['new', 'contacted', 'quoted', 'in-progress', 'completed', 'closed'],
    default: 'new'
  },

  // Admin Notes
  adminNotes: {
    type: String,
    maxlength: [2000, 'Admin notes cannot exceed 2000 characters']
  },

  // Email sent status
  emailSent: {
    type: Boolean,
    default: false
  },

  emailSentAt: {
    type: Date,
    default: null
  },

  // Viewed by admin
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
webDevelopmentLeadSchema.index({ email: 1 });
webDevelopmentLeadSchema.index({ status: 1 });
webDevelopmentLeadSchema.index({ createdAt: -1 });
webDevelopmentLeadSchema.index({ viewed: 1 });

// Virtual for days since submission
webDevelopmentLeadSchema.virtual('daysSinceSubmission').get(function () {
  const now = new Date();
  const submitted = this.createdAt;
  const diffTime = Math.abs(now - submitted);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

module.exports = mongoose.model('WebDevelopmentLead', webDevelopmentLeadSchema);

