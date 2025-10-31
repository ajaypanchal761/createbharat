const mongoose = require('mongoose');

const trainingModuleSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TrainingCourse',
    required: [true, 'Course reference is required']
  },

  // Basic Information
  title: {
    type: String,
    required: [true, 'Module title is required'],
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
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },

  objective: {
    type: String,
    trim: true,
    maxlength: [500, 'Objective cannot exceed 500 characters']
  },

  outcome: {
    type: String,
    trim: true,
    maxlength: [500, 'Outcome cannot exceed 500 characters']
  },

  // Module Details
  duration: {
    type: String,
    trim: true
  },

  number: {
    type: Number,
    required: [true, 'Module number is required'],
    min: 1
  },

  evaluationMethod: {
    type: String,
    trim: true,
    maxlength: [200, 'Evaluation method cannot exceed 200 characters']
  },

  // Styling
  icon: {
    type: String,
    default: '💼'
  },

  color: {
    type: String,
    default: 'from-blue-500 to-cyan-500'
  },

  // Status
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
trainingModuleSchema.index({ course: 1, number: 1 });
trainingModuleSchema.index({ course: 1 });

// Virtual for topics count
trainingModuleSchema.virtual('topicsCount', {
  ref: 'TrainingTopic',
  localField: '_id',
  foreignField: 'module',
  count: true
});

// Ensure unique module number per course
trainingModuleSchema.index({ course: 1, number: 1 }, { unique: true });

module.exports = mongoose.model('TrainingModule', trainingModuleSchema);

