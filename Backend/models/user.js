const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
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
  username: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    lowercase: true,
    maxlength: [30, 'Username cannot exceed 30 characters']
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
    required: false,
    minlength: [6, 'Password must be at least 6 characters long']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number']
  },
  
  // Personal Details
  dateOfBirth: {
    type: Date,
    required: false
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['male', 'female', 'other']
  },
  
  // Address Information
  address: {
    street: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    pincode: {
      type: String,
      match: [/^\d{6}$/, 'Please enter a valid 6-digit pincode']
    },
    country: {
      type: String,
      default: 'India'
    }
  },
  
  // Profile & Media
  profileImage: {
    type: String,
    default: null
  },
  coverImage: {
    type: String,
    default: null
  },
  
  // Verification Status
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String,
    default: null
  },
  phoneVerificationOTP: {
    type: String,
    default: null
  },
  otpExpiresAt: {
    type: Date,
    default: null
  },
  
  // User Role & Status
  role: {
    type: String,
    enum: ['user', 'admin', 'mentor', 'company', 'developer'],
    default: 'user'
  },
  userType: {
    type: String,
    enum: ['individual', 'business', 'startup', 'ngo'],
    default: 'individual'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isBlocked: {
    type: Boolean,
    default: false
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
  },
  
  // Business Information (for business users)
  businessInfo: {
    companyName: String,
    businessType: {
      type: String,
      enum: ['sole_proprietorship', 'partnership', 'llp', 'private_limited', 'public_limited', 'ngo', 'trust']
    },
    registrationNumber: String,
    gstNumber: String,
    panNumber: String,
    businessAddress: {
      street: String,
      city: String,
      state: String,
      pincode: String
    },
    businessDescription: String,
    website: String,
    establishedYear: Number,
    employeeCount: {
      type: String,
      enum: ['1-10', '11-50', '51-200', '201-500', '500+']
    }
  },
  
  // Professional Information
  professionalInfo: {
    occupation: String,
    industry: String,
    experience: {
      type: String,
      enum: ['fresher', '1-2_years', '3-5_years', '6-10_years', '10+_years']
    },
    skills: [String],
    education: [{
      degree: String,
      institution: String,
      year: Number,
      grade: String
    }],
    certifications: [{
      name: String,
      issuer: String,
      date: Date,
      expiryDate: Date
    }]
  },
  
  // Financial Information (for loan applications)
  financialInfo: {
    annualIncome: Number,
    monthlyIncome: Number,
    employmentType: {
      type: String,
      enum: ['salaried', 'self_employed', 'business', 'student', 'unemployed', 'retired']
    },
    employerName: String,
    workExperience: Number,
    creditScore: Number,
    existingLoans: [{
      lender: String,
      amount: Number,
      emi: Number,
      tenure: Number
    }]
  },
  
  // Preferences & Settings
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false }
    },
    privacy: {
      profileVisibility: { type: String, enum: ['public', 'private'], default: 'public' },
      showEmail: { type: Boolean, default: false },
      showPhone: { type: Boolean, default: false },
      showAddress: { type: Boolean, default: false }
    },
    language: {
      type: String,
      default: 'en',
      enum: ['en', 'hi', 'bn', 'te', 'ta', 'gu', 'mr', 'kn', 'ml', 'pa']
    },
    timezone: {
      type: String,
      default: 'Asia/Kolkata'
    }
  },
  
  // Social Media Links
  socialLinks: {
    linkedin: String,
    twitter: String,
    facebook: String,
    instagram: String,
    website: String
  },
  
  // Emergency Contact
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String,
    email: String
  },
  
  // Documents & Verification
  documents: {
    aadharCard: {
      number: String,
      frontImage: String,
      backImage: String,
      verified: { type: Boolean, default: false }
    },
    panCard: {
      number: String,
      image: String,
      verified: { type: Boolean, default: false }
    },
    drivingLicense: {
      number: String,
      image: String,
      verified: { type: Boolean, default: false }
    },
    passport: {
      number: String,
      image: String,
      verified: { type: Boolean, default: false }
    }
  },
  
  // Platform Specific Data
  platformData: {
    referralCode: {
      type: String,
      unique: true,
      sparse: true
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    referralCount: {
      type: Number,
      default: 0
    },
    points: {
      type: Number,
      default: 0
    },
    badges: [String],
    achievements: [String]
  },
  
  // Application Tracking
  applications: {
    internships: [{
      internshipId: { type: mongoose.Schema.Types.ObjectId, ref: 'Internship' },
      status: { type: String, enum: ['applied', 'shortlisted', 'rejected', 'selected'], default: 'applied' },
      appliedAt: { type: Date, default: Date.now }
    }],
    loans: [{
      loanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Loan' },
      status: { type: String, enum: ['applied', 'under_review', 'approved', 'rejected', 'disbursed'], default: 'applied' },
      appliedAt: { type: Date, default: Date.now }
    }],
    legalServices: [{
      serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'LegalService' },
      status: { type: String, enum: ['applied', 'in_progress', 'completed', 'cancelled'], default: 'applied' },
      appliedAt: { type: Date, default: Date.now }
    }]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for display name
userSchema.virtual('displayName').get(function() {
  return this.username || this.fullName;
});

// Virtual for age
userSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Hash password before saving
userSchema.pre('save', async function(next) {
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
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate OTP for phone verification
userSchema.methods.generateOTP = function() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.phoneVerificationOTP = otp;
  this.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return otp;
};

// Verify OTP
userSchema.methods.verifyOTP = function(otp) {
  if (!this.phoneVerificationOTP || !this.otpExpiresAt) {
    return false;
  }
  
  if (this.otpExpiresAt < new Date()) {
    return false;
  }
  
  return this.phoneVerificationOTP === otp;
};

// Remove password and sensitive data from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.phoneVerificationOTP;
  delete userObject.emailVerificationToken;
  return userObject;
};

// Generate referral code
userSchema.methods.generateReferralCode = function() {
  const code = this.firstName.substring(0, 3).toUpperCase() + 
               this.lastName.substring(0, 3).toUpperCase() + 
               Math.floor(100 + Math.random() * 900);
  this.platformData.referralCode = code;
  return code;
};

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ 'platformData.referralCode': 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ lastActiveAt: -1 });

module.exports = mongoose.model('User', userSchema);