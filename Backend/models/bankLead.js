const mongoose = require('mongoose');

const bankLeadSchema = new mongoose.Schema({
  // Personal Information
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [100, 'Full name cannot exceed 100 characters']
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

  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },

  // Address Information
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
    maxlength: [500, 'Address cannot exceed 500 characters']
  },

  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
    maxlength: [100, 'City cannot exceed 100 characters']
  },

  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true,
    maxlength: [100, 'State cannot exceed 100 characters']
  },

  pincode: {
    type: String,
    required: [true, 'Pincode is required'],
    trim: true,
    match: [/^[0-9]{6}$/, 'Pincode must be 6 digits']
  },

  // Status
  status: {
    type: String,
    enum: ['new', 'contacted', 'documents-requested', 'verification-pending', 'approved', 'rejected', 'closed'],
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
bankLeadSchema.index({ email: 1 });
bankLeadSchema.index({ phone: 1 });
bankLeadSchema.index({ status: 1 });
bankLeadSchema.index({ createdAt: -1 });
bankLeadSchema.index({ viewed: 1 });

// Virtual for days since submission
bankLeadSchema.virtual('daysSinceSubmission').get(function () {
  const now = new Date();
  const submitted = this.createdAt;
  const diffTime = Math.abs(now - submitted);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

module.exports = mongoose.model('BankLead', bankLeadSchema);

