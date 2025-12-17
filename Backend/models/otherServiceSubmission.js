const mongoose = require('mongoose');

const otherServiceSubmissionSchema = new mongoose.Schema(
  {
    categoryId: {
      type: String,
      required: true,
      trim: true,
    },
    categoryName: {
      type: String,
      required: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 200,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },
    city: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    details: {
      type: String,
      trim: true,
      maxlength: 5000,
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'in-progress', 'completed', 'closed'],
      default: 'new',
    },
    adminNotes: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    viewed: {
      type: Boolean,
      default: false,
    },
    viewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

otherServiceSubmissionSchema.index({ createdAt: -1 });
otherServiceSubmissionSchema.index({ status: 1 });
otherServiceSubmissionSchema.index({ categoryId: 1 });
otherServiceSubmissionSchema.index({ email: 1 });

module.exports = mongoose.model('OtherServiceSubmission', otherServiceSubmissionSchema);

