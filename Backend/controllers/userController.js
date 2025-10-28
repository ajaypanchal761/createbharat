const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { sendOTP, sendWelcomeSMS } = require('../utils/notifications');

// Helper: bypass OTP sending for specific test numbers
const isBypassOtpNumber = (phone) => {
  const bypassList = new Set(['9685974247']);
  return bypassList.has(phone);
};

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      firstName,
      lastName,
      username,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      userType,
      businessInfo,
      professionalInfo,
      referredBy
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }, { username }]
    });

    if (existingUser) {
      let message = 'User already exists';
      if (existingUser.email === email) message = 'Email already registered';
      else if (existingUser.phone === phone) message = 'Phone number already registered';
      else if (existingUser.username === username) message = 'Username already taken';

      return res.status(400).json({
        success: false,
        message
      });
    }

    // Generate username if not provided
    const generatedUsername = username || `${firstName.toLowerCase()}${lastName.toLowerCase()}${Math.floor(100 + Math.random() * 900)}`;

    // Create new user
    const userData = {
      firstName,
      lastName,
      username: generatedUsername,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      userType: userType || 'individual'
    };

    // Add business info if provided
    if (businessInfo && userType === 'business') {
      userData.businessInfo = businessInfo;
    }

    // Add professional info if provided
    if (professionalInfo) {
      userData.professionalInfo = professionalInfo;
    }

    // Handle referral
    if (referredBy) {
      const referrer = await User.findOne({ 'platformData.referralCode': referredBy });
      if (referrer) {
        userData.platformData = {
          referredBy: referrer._id,
          referralCode: null // Will be generated after save
        };
      }
    }

    const user = await User.create(userData);

    // Generate referral code
    user.generateReferralCode();
    await user.save();

    // Update referrer's referral count
    if (referredBy && user.platformData.referredBy) {
      await User.findByIdAndUpdate(user.platformData.referredBy, {
        $inc: { 'platformData.referralCount': 1 }
      });
    }

    // Generate OTP for phone verification
    let otp;
    if (isBypassOtpNumber(phone)) {
      otp = '123456';
      user.phoneVerificationOTP = otp;
      user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    } else {
      otp = user.generateOTP();
    }
    await user.save();

    // Send OTP via SMS
    try {
      if (isBypassOtpNumber(phone)) {
        console.log(`📵 Bypass SMS for ${phone}. Using fixed OTP 123456.`);
      } else {
        await sendOTP(phone, otp);
        console.log(`📱 OTP sent successfully to ${phone}`);
      }
    } catch (smsError) {
      console.error('SMS sending failed:', smsError.message);
      // In development mode, allow registration even if SMS fails
      if (process.env.NODE_ENV === 'development') {
        console.log(`⚠️ SMS failed but allowing registration in development mode. OTP: ${otp}`);
      } else {
        // In production, return error if SMS fails
        return res.status(500).json({
          success: false,
          message: 'Failed to send OTP. Please try again.',
          error: 'SMS service unavailable'
        });
      }
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please verify your phone number.',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          email: user.email,
          phone: user.phone,
          role: user.role,
          userType: user.userType,
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified,
          referralCode: user.platformData.referralCode
        },
        token,
        otpSent: true,
        message: `OTP sent to ${phone}`
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password, phone, loginMethod } = req.body;

    let user;

    // Support both email and phone login
    if (loginMethod === 'phone' && phone) {
      user = await User.findOne({ phone }).select('+password');
    } else {
      user = await User.findOne({ email }).select('+password');
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Check if user is blocked
    if (user.isBlocked) {
      return res.status(401).json({
        success: false,
        message: 'Account is blocked. Please contact support.'
      });
    }

    // Check password (only if user has a password)
    if (user.password) {
      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }
    } else {
      // For passwordless users, skip password validation
      // They will need to verify via OTP
    }

    // Update last login and activity
    user.lastLogin = new Date();
    user.lastActiveAt = new Date();
    user.loginCount += 1;
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          email: user.email,
          phone: user.phone,
          role: user.role,
          userType: user.userType,
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified,
          lastLogin: user.lastLogin,
          profileImage: user.profileImage,
          referralCode: user.platformData.referralCode
        },
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { phone, otp } = req.body;

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify OTP
    const isOTPValid = user.verifyOTP(otp);

    if (!isOTPValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // Mark phone as verified
    user.isPhoneVerified = true;
    user.phoneVerificationOTP = null;
    user.otpExpiresAt = null;
    await user.save();

    // Send welcome SMS
    try {
      await sendWelcomeSMS(user.phone, user.firstName);
      console.log(`📱 Welcome SMS sent to ${user.phone}`);
    } catch (smsError) {
      console.error('Welcome SMS failed:', smsError.message);
      // Don't fail verification if welcome SMS fails
    }

    res.status(200).json({
      success: true,
      message: 'Phone number verified successfully',
      data: {
        user: {
          id: user._id,
          phone: user.phone,
          isPhoneVerified: user.isPhoneVerified
        }
      }
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during OTP verification',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
const resendOTP = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { phone } = req.body;

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate new OTP
    let otp;
    if (isBypassOtpNumber(phone)) {
      otp = '123456';
      user.phoneVerificationOTP = otp;
      user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    } else {
      otp = user.generateOTP();
    }
    await user.save();

    // Send OTP via SMS
    try {
      if (isBypassOtpNumber(phone)) {
        console.log(`📵 Bypass SMS for ${phone}. Using fixed OTP 123456.`);
      } else {
        await sendOTP(phone, otp);
        console.log(`📱 OTP resent successfully to ${phone}`);
      }
    } catch (smsError) {
      console.error('SMS sending failed:', smsError.message);
      // In development mode, allow resend even if SMS fails
      if (process.env.NODE_ENV === 'development') {
        console.log(`⚠️ SMS failed but allowing resend in development mode. OTP: ${otp}`);
      } else {
        // In production, return error if SMS fails
        return res.status(500).json({
          success: false,
          message: 'Failed to send OTP. Please try again.',
          error: 'SMS service unavailable'
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      data: {
        phone: user.phone,
        message: `OTP sent to ${phone}`
      }
    });

  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during OTP resend',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Send OTP for passwordless login
// @route   POST /api/auth/login-otp
// @access  Public
const sendLoginOTP = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { phone } = req.body;

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this phone number'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Check if user is blocked
    if (user.isBlocked) {
      return res.status(401).json({
        success: false,
        message: 'Account is blocked. Please contact support.'
      });
    }

    // Generate new OTP
    let otp;
    if (isBypassOtpNumber(phone)) {
      otp = '123456';
      user.phoneVerificationOTP = otp;
      user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    } else {
      otp = user.generateOTP();
    }
    await user.save();

    // Send OTP via SMS
    try {
      if (isBypassOtpNumber(phone)) {
        console.log(`📵 Bypass SMS for ${phone}. Using fixed OTP 123456.`);
      } else {
        await sendOTP(phone, otp);
        console.log(`📱 Login OTP sent successfully to ${phone}`);
      }
    } catch (smsError) {
      console.error('SMS sending failed:', smsError.message);
      // In development mode, allow login even if SMS fails
      if (process.env.NODE_ENV === 'development') {
        console.log(`⚠️ SMS failed but allowing login in development mode. OTP: ${otp}`);
      } else {
        // In production, return error if SMS fails
        return res.status(500).json({
          success: false,
          message: 'Failed to send OTP. Please try again.',
          error: 'SMS service unavailable'
        });
      }
    }

    // Generate temporary token for OTP verification
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'OTP sent for login',
      data: {
        phone: user.phone,
        token: token,
        otpSent: true,
        message: `OTP sent to ${phone}`
      }
    });

  } catch (error) {
    console.error('Send login OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login OTP send',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          dateOfBirth: user.dateOfBirth,
          gender: user.gender,
          address: user.address,
          profileImage: user.profileImage,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified,
          preferences: user.preferences,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin
        }
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { firstName, lastName, phone, dateOfBirth, gender, address, preferences } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (gender) user.gender = gender;
    if (address) user.address = { ...user.address, ...address };
    if (preferences) user.preferences = { ...user.preferences, ...preferences };

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          dateOfBirth: user.dateOfBirth,
          gender: user.gender,
          address: user.address,
          preferences: user.preferences
        }
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);

    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: users
    });

  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get user by ID (Admin only)
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update user (Admin only)
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const { firstName, lastName, email, phone, role, isActive } = req.body;

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (role) user.role = role;
    if (typeof isActive === 'boolean') user.isActive = isActive;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Deactivate user (Admin only)
// @route   PATCH /api/users/:id/deactivate
// @access  Private/Admin
const deactivateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User deactivated successfully',
      data: user
    });

  } catch (error) {
    console.error('Deactivate user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  sendLoginOTP,
  verifyOTP,
  resendOTP,
  getMe,
  updateProfile,
  changePassword,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  deactivateUser
};
