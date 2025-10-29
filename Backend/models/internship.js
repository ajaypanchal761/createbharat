const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },

  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Company reference is required']
  },

  companyName: {
    type: String,
    required: true
  },

  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },

  // Job Details
  duration: {
    type: String,
    required: [true, 'Duration is required']
  },

  stipend: {
    type: String,
    required: [true, 'Stipend information is required'],
    trim: true
  },

  stipendPerMonth: {
    type: String,
    default: '/month'
  },

  type: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
    default: 'Internship'
  },

  category: {
    type: String,
    enum: [
      'Technology',
      'Design',
      'Marketing',
      'Finance',
      'Legal',
      'Operations',
      'Content',
      'Sales',
      'HR',
      'Other'
    ],
    required: [true, 'Category is required']
  },

  // Description and Details
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },

  responsibilities: [{
    type: String,
    maxlength: [500, 'Each responsibility cannot exceed 500 characters']
  }],

  requirements: [{
    type: String,
    trim: true,
    maxlength: [500, 'Each requirement cannot exceed 500 characters']
  }],

  skills: [{
    type: String,
    maxlength: [50, 'Each skill cannot exceed 50 characters']
  }],

  perks: [{
    type: String,
    maxlength: [200, 'Each perk cannot exceed 200 characters']
  }],

  aboutCompany: {
    type: String,
    maxlength: [1000, 'About company cannot exceed 1000 characters']
  },

  applicationProcess: [{
    type: String,
    maxlength: [300, 'Each process step cannot exceed 300 characters']
  }],

  // Additional Information
  openings: {
    type: Number,
    default: 1,
    min: 1
  },

  applicants: {
    type: Number,
    default: 0
  },

  // Status Fields
  isActive: {
    type: Boolean,
    default: true
  },

  isRemote: {
    type: Boolean,
    default: false
  },

  featured: {
    type: Boolean,
    default: false
  },

  urgent: {
    type: Boolean,
    default: false
  },

  postedDate: {
    type: Date,
    default: Date.now
  },

  // Application Link
  applicationLink: {
    type: String,
    default: ''
  },

  // Styling (for frontend)
  color: {
    type: String,
    default: 'from-blue-500 to-cyan-500'
  },

  icon: {
    type: String,
    default: '💼'
  },

  // Dates
  applicationDeadline: {
    type: Date,
    default: null
  },

  startDate: {
    type: Date,
    default: null
  },

  endDate: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
internshipSchema.index({ company: 1 });
internshipSchema.index({ category: 1 });
internshipSchema.index({ isActive: 1 });
internshipSchema.index({ createdAt: -1 });
internshipSchema.index({ location: 1 });
internshipSchema.index({ type: 1 });
internshipSchema.index({ featured: 1 });

// Virtual for formatted posted date
internshipSchema.virtual('postedDateFormatted').get(function () {
  const now = new Date();
  const posted = this.createdAt;
  const diffTime = Math.abs(now - posted);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
});

// Virtual for applicants count
internshipSchema.virtual('applicantsCount', {
  ref: 'Application',
  localField: '_id',
  foreignField: 'internship',
  count: true
});

module.exports = mongoose.model('Internship', internshipSchema);

