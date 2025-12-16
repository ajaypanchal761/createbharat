const mongoose = require('mongoose');

const pitchSchema = new mongoose.Schema({
  // User who submitted the pitch
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },

  // Step 1: Basic Info
  startupName: {
    type: String,
    required: [true, 'Startup name is required'],
    trim: true,
    maxlength: [200, 'Startup name cannot exceed 200 characters']
  },

  oneLinePitch: {
    type: String,
    required: [true, 'One-line pitch is required'],
    trim: true,
    maxlength: [200, 'One-line pitch cannot exceed 200 characters']
  },

  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    maxlength: [100, 'Category cannot exceed 100 characters']
  },

  startupStage: {
    type: String,
    required: [true, 'Startup stage is required'],
    enum: ['Idea', 'Prototype', 'MVP', 'Revenue'],
    trim: true
  },

  founderName: {
    type: String,
    required: [true, 'Founder name is required'],
    trim: true,
    maxlength: [100, 'Founder name cannot exceed 100 characters']
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

  problemStatement: {
    type: String,
    required: [true, 'Problem statement is required'],
    trim: true,
    maxlength: [1000, 'Problem statement cannot exceed 1000 characters']
  },

  solutionDescription: {
    type: String,
    required: [true, 'Solution description is required'],
    trim: true,
    maxlength: [1000, 'Solution description cannot exceed 1000 characters']
  },

  // Step 2: Documents (stored in GridFS)
  documents: {
    pitchDeck: {
      fileId: {
        type: String,
        required: [true, 'Pitch deck is required']
      },
      fileName: String,
      fileSize: Number,
      fileType: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    },
    executiveSummary: {
      fileId: String,
      fileName: String,
      fileSize: Number,
      fileType: String,
      uploadedAt: Date
    },
    financials: {
      fileId: String,
      fileName: String,
      fileSize: Number,
      fileType: String,
      uploadedAt: Date
    }
  },

  // Pitch ID (auto-generated)
  pitchId: {
    type: String,
    unique: true,
    sparse: true
  },

  // Status
  status: {
    type: String,
    enum: ['Under Review', 'Approved', 'More Details Required', 'Rejected'],
    default: 'Under Review'
  },

  // Rejection reason (if rejected)
  rejectionReason: {
    type: String,
    maxlength: [1000, 'Rejection reason cannot exceed 1000 characters']
  },

  // Admin notes
  adminNotes: {
    type: String,
    maxlength: [2000, 'Admin notes cannot exceed 2000 characters']
  },

  // Timestamps
  submittedAt: {
    type: Date,
    default: Date.now
  },

  reviewedAt: {
    type: Date
  },

  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Generate Pitch ID before saving
pitchSchema.pre('save', async function(next) {
  if (!this.pitchId) {
    // Generate unique pitch ID: PITCH-YYYYMMDD-XXXX
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    this.pitchId = `PITCH-${dateStr}-${randomNum}`;
  }
  next();
});

// Indexes for better query performance
pitchSchema.index({ user: 1 });
pitchSchema.index({ status: 1 });
pitchSchema.index({ pitchId: 1 });
pitchSchema.index({ createdAt: -1 });
pitchSchema.index({ submittedAt: -1 });

// Virtual for days since submission
pitchSchema.virtual('daysSinceSubmission').get(function() {
  const now = new Date();
  const submitted = this.submittedAt || this.createdAt;
  const diffTime = Math.abs(now - submitted);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

module.exports = mongoose.model('Pitch', pitchSchema);

