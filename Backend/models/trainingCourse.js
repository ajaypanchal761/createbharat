const mongoose = require('mongoose');

const trainingCourseSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },

  subtitle: {
    type: String,
    trim: true,
    maxlength: [300, 'Subtitle cannot exceed 300 characters']
  },

  description: {
    type: String,
    required: [true, 'Course description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },

  // Provider & Instructor Information
  provider: {
    type: String,
    required: [true, 'Provider is required'],
    trim: true,
    maxlength: [100, 'Provider name cannot exceed 100 characters']
  },

  instructor: {
    type: String,
    required: [true, 'Instructor name is required'],
    trim: true,
    maxlength: [100, 'Instructor name cannot exceed 100 characters']
  },

  instructorEmail: {
    type: String,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },

  instructorWebsite: {
    type: String,
    trim: true
  },

  // Course Details
  minimumDuration: {
    type: String,
    required: [true, 'Duration is required'],
    trim: true
  },

  totalModules: {
    type: Number,
    required: [true, 'Total modules is required'],
    min: [1, 'At least 1 module is required']
  },

  language: {
    type: String,
    required: [true, 'Language is required'],
    trim: true,
    // Store as single language to avoid MongoDB text index conflict
    // For multiple languages, store first language or use languages array field
  },

  eligibility: {
    type: String,
    trim: true,
    maxlength: [500, 'Eligibility cannot exceed 500 characters']
  },

  // Statistics
  rating: {
    type: String,
    default: '0.0'
  },

  studentsEnrolled: {
    type: Number,
    default: 0,
    min: 0
  },

  // Certificate Configuration
  certificate: {
    type: Boolean,
    default: false
  },

  certificateAmount: {
    type: Number,
    default: 199,
    min: 0
  },

  minPassScore: {
    type: Number,
    default: 70,
    min: 0,
    max: 100
  },

  autoGenerateCert: {
    type: Boolean,
    default: true
  },

  // Status
  isActive: {
    type: Boolean,
    default: true
  },

  isPublished: {
    type: Boolean,
    default: false
  },

  // Course Image/Thumbnail
  imageUrl: {
    type: String,
    default: ''
  },

  // Styling
  color: {
    type: String,
    default: 'from-indigo-500 to-purple-600'
  },

  icon: {
    type: String,
    default: '📚'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
trainingCourseSchema.index({ isActive: 1, isPublished: 1 });
trainingCourseSchema.index({ createdAt: -1 });
trainingCourseSchema.index({ provider: 1 });
// Text index - explicitly exclude language field to avoid MongoDB language override conflict
trainingCourseSchema.index({ 
  title: 'text', 
  description: 'text' 
}, {
  default_language: 'none' // Disable language-specific text search
});

// Virtual for modules count
trainingCourseSchema.virtual('modulesCount', {
  ref: 'TrainingModule',
  localField: '_id',
  foreignField: 'course',
  count: true
});

// Virtual for enrolled students count
trainingCourseSchema.virtual('enrolledStudentsCount', {
  ref: 'UserTrainingProgress',
  localField: '_id',
  foreignField: 'course',
  count: true
});

module.exports = mongoose.model('TrainingCourse', trainingCourseSchema);

