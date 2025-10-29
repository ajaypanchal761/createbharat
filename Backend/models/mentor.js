const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const mentorSchema = new mongoose.Schema({
  // Basic Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false
  },

  // Professional Information
  title: {
    type: String,
    trim: true,
    default: ''
  },
  company: {
    type: String,
    trim: true,
    default: ''
  },
  specialization: {
    type: String,
    required: [true, 'Specialization is required'],
    trim: true
  },
  experience: {
    type: String,
    required: [true, 'Experience is required'],
    trim: true
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [1000, 'Bio cannot exceed 1000 characters'],
    default: ''
  },

  // Profile Image
  profileImage: {
    type: String,
    default: null
  },

  // Skills and Expertise
  skills: [{
    type: String,
    trim: true
  }],

  // Languages
  languages: [{
    type: String,
    trim: true
  }],

  // Education
  education: [{
    degree: String,
    university: String,
    year: String
  }],

  // Certifications
  certifications: [{
    type: String,
    trim: true
  }],

  // Pricing (Time-based sessions in INR)
  pricing: {
    quick: {
      duration: { type: String, default: '20-25 minutes' },
      price: { type: Number, default: 150 },
      label: { type: String, default: 'Quick consultation' }
    },
    inDepth: {
      duration: { type: String, default: '50-60 minutes' },
      price: { type: Number, default: 300 },
      label: { type: String, default: 'In-depth session' }
    },
    comprehensive: {
      duration: { type: String, default: '90-120 minutes' },
      price: { type: Number, default: 450 },
      label: { type: String, default: 'Comprehensive consultation' }
    }
  },

  // Stats
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalSessions: {
    type: Number,
    default: 0
  },
  responseTime: {
    type: String,
    default: '24 hours'
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MentorBooking'
  }],

  // Categories
  categories: [{
    type: String,
    enum: ['business', 'technology', 'career', 'finance', 'marketing', 'personal'],
    trim: true
  }],

  // Verification Status
  isEmailVerified: {
    type: Boolean,
    default: false
  },

  // Status
  role: {
    type: String,
    enum: ['mentor'],
    default: 'mentor'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },

  // Profile Visibility
  profileVisibility: {
    type: Boolean,
    default: true
  },

  // Activity Tracking
  lastLogin: {
    type: Date,
    default: null
  },
  loginCount: {
    type: Number,
    default: 0
  },
  lastActiveAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
mentorSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Hash password before saving
mentorSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
mentorSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password and sensitive data from JSON output
mentorSchema.methods.toJSON = function () {
  const mentorObject = this.toObject();
  delete mentorObject.password;
  return mentorObject;
};

// Index for better query performance
mentorSchema.index({ email: 1 });
mentorSchema.index({ isActive: 1 });
mentorSchema.index({ categories: 1 });
mentorSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Mentor', mentorSchema);

