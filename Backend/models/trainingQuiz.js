const mongoose = require('mongoose');

const trainingQuizSchema = new mongoose.Schema({
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TrainingTopic',
    required: [true, 'Topic reference is required']
  },

  // Question
  question: {
    type: String,
    required: [true, 'Question is required'],
    trim: true,
    maxlength: [500, 'Question cannot exceed 500 characters']
  },

  // Options (minimum 2, maximum 6)
  options: {
    type: [String],
    required: [true, 'Options are required'],
    validate: {
      validator: function(options) {
        return options.length >= 2 && options.length <= 6;
      },
      message: 'Quiz must have between 2 and 6 options'
    }
  },

  // Correct Answer (index of the correct option)
  correctAnswer: {
    type: Number,
    required: [true, 'Correct answer is required'],
    min: 0,
    validate: {
      validator: function(value) {
        return value < this.options.length;
      },
      message: 'Correct answer index must be within options range'
    }
  },

  // Additional Information
  explanation: {
    type: String,
    trim: true,
    maxlength: [500, 'Explanation cannot exceed 500 characters']
  },

  points: {
    type: Number,
    default: 1,
    min: 1
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
trainingQuizSchema.index({ topic: 1 });
trainingQuizSchema.index({ topic: 1, createdAt: -1 });

module.exports = mongoose.model('TrainingQuiz', trainingQuizSchema);

