const mongoose = require('mongoose');

const legalServiceSchema = new mongoose.Schema({
  // Service Basic Information
  name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true,
    maxlength: [200, 'Service name cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  icon: {
    type: String,
    default: '⚖️',
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    enum: ['Business', 'Intellectual Property', 'IP Rights', 'Tax', 'Certification', 'Compliance'],
    default: 'Business'
  },

  // Service Details
  heading: {
    type: String,
    trim: true,
    maxlength: [200, 'Heading cannot exceed 200 characters'],
    default: ''
  },
  paragraph: {
    type: String,
    trim: true,
    maxlength: [2000, 'Paragraph cannot exceed 2000 characters'],
    default: ''
  },
  price: {
    type: String,
    required: [true, 'Price is required'],
    trim: true,
    default: '₹0'
  },
  duration: {
    type: String,
    required: [true, 'Duration is required'],
    trim: true,
    default: ''
  },

  // Service Benefits
  benefits: [{
    type: String,
    trim: true
  }],

  // Service Process Steps
  process: [{
    type: String,
    trim: true
  }],

  // Required Documents
  requiredDocuments: [{
    type: String,
    trim: true
  }],

  // Document Upload Fields (what users see when uploading)
  documentUploads: [{
    type: String,
    trim: true
  }],

  // Status
  isActive: {
    type: Boolean,
    default: true
  },

  // Statistics
  totalSubmissions: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
legalServiceSchema.index({ isActive: 1 });
legalServiceSchema.index({ category: 1 });
legalServiceSchema.index({ createdAt: -1 });

module.exports = mongoose.model('LegalService', legalServiceSchema);

