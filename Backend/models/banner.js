const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  // Banner Information
  title: {
    type: String,
    required: [true, 'Banner title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  
  subtitle: {
    type: String,
    trim: true,
    maxlength: [200, 'Subtitle cannot exceed 200 characters']
  },
  
  image: {
    type: String,
    required: [true, 'Banner image is required'],
    trim: true
  },
  
  imageUrl: {
    type: String,
    required: [true, 'Banner image URL is required'],
    trim: true
  },
  
  // Link Information (optional)
  link: {
    type: String,
    trim: true
  },
  
  linkText: {
    type: String,
    trim: true,
    maxlength: [50, 'Link text cannot exceed 50 characters']
  },
  
  // Display Settings
  position: {
    type: Number,
    default: 0,
    min: 0
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Styling
  color: {
    type: String,
    default: 'from-orange-600 to-cyan-600',
    trim: true
  },
  
  // Metadata
  clickCount: {
    type: Number,
    default: 0
  },
  
  viewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for sorting
bannerSchema.index({ position: 1, isActive: 1 });

module.exports = mongoose.model('Banner', bannerSchema);

