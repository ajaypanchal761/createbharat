const mongoose = require('mongoose');

const userTrainingProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },

  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TrainingCourse',
    required: [true, 'Course reference is required']
  },

  // Enrollment Status
  enrollmentStatus: {
    type: String,
    enum: ['enrolled', 'in_progress', 'completed', 'dropped'],
    default: 'enrolled'
  },

  // Progress Tracking
  completedModules: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TrainingModule'
  }],

  completedTopics: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TrainingTopic'
  }],

  // Quiz Attempts & Scores
  quizAttempts: [{
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TrainingTopic'
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TrainingQuiz'
    },
    selectedAnswer: Number,
    isCorrect: Boolean,
    points: Number,
    attemptedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Module Scores
  moduleScores: [{
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TrainingModule'
    },
    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    completedAt: Date
  }],

  // Overall Progress
  overallProgress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },

  // Certificate Information
  certificateGenerated: {
    type: Boolean,
    default: false
  },

  certificateUrl: {
    type: String,
    default: ''
  },

  certificateGeneratedAt: {
    type: Date
  },

  // Certificate Payment Information
  certificatePaymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },

  certificatePaymentId: {
    type: String,
    default: ''
  },

  certificatePaidAt: {
    type: Date
  },

  certificateAmount: {
    type: Number,
    default: 199 // Default certificate fee in INR
  },

  // Final Score
  finalScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },

  // Dates
  enrolledAt: {
    type: Date,
    default: Date.now
  },

  startedAt: {
    type: Date
  },

  completedAt: {
    type: Date
  },

  lastAccessedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
userTrainingProgressSchema.index({ user: 1, course: 1 }, { unique: true });
userTrainingProgressSchema.index({ user: 1 });
userTrainingProgressSchema.index({ course: 1 });
userTrainingProgressSchema.index({ enrollmentStatus: 1 });

// Virtual for course details
userTrainingProgressSchema.virtual('courseDetails', {
  ref: 'TrainingCourse',
  localField: 'course',
  foreignField: '_id',
  justOne: true
});

module.exports = mongoose.model('UserTrainingProgress', userTrainingProgressSchema);

