const mongoose = require('mongoose');

const trainingTopicSchema = new mongoose.Schema({
  module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TrainingModule',
    required: [true, 'Module reference is required']
  },

  // Basic Information
  title: {
    type: String,
    required: [true, 'Topic title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },

  content: {
    type: String,
    required: [true, 'Topic content is required'],
    maxlength: [10000, 'Content cannot exceed 10000 characters']
  },

  // Media
  videoUrl: {
    type: String,
    trim: true
  },

  // Topic Details
  number: {
    type: Number,
    required: [true, 'Topic number is required'],
    min: 1
  },

  duration: {
    type: String,
    trim: true
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
trainingTopicSchema.index({ module: 1, number: 1 });
trainingTopicSchema.index({ module: 1 });

// Virtual for quizzes count
trainingTopicSchema.virtual('quizzesCount', {
  ref: 'TrainingQuiz',
  localField: '_id',
  foreignField: 'topic',
  count: true
});

// Ensure unique topic number per module
trainingTopicSchema.index({ module: 1, number: 1 }, { unique: true });

module.exports = mongoose.model('TrainingTopic', trainingTopicSchema);

