const Mentor = require('../models/mentor');
const MentorBooking = require('../models/mentorBooking');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Generate JWT Token
const generateToken = (mentorId) => {
  return jwt.sign({ mentorId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @desc    Register a new mentor
// @route   POST /api/mentors/register
// @access  Public
const registerMentor = async (req, res) => {
  try {
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
      email,
      password,
      specialization,
      experience,
      company,
      bio
    } = req.body;

    // Check if mentor already exists
    const existingMentor = await Mentor.findOne({ email });

    if (existingMentor) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create new mentor
    const mentorData = {
      firstName,
      lastName,
      email,
      password,
      specialization,
      experience,
      company: company || '',
      bio: bio || '',
      isEmailVerified: false
    };

    const mentor = await Mentor.create(mentorData);

    // Generate token for immediate login
    const token = generateToken(mentor._id);

    res.status(201).json({
      success: true,
      message: 'Mentor registered successfully.',
      data: {
        mentor: {
          id: mentor._id,
          firstName: mentor.firstName,
          lastName: mentor.lastName,
          email: mentor.email,
          specialization: mentor.specialization,
          experience: mentor.experience,
          isEmailVerified: mentor.isEmailVerified
        },
        token
      }
    });

  } catch (error) {
    console.error('Mentor registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Login mentor
// @route   POST /api/mentors/login
// @access  Public
const loginMentor = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    const mentor = await Mentor.findOne({ email }).select('+password');

    if (!mentor) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    if (!mentor.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    if (mentor.isBlocked) {
      return res.status(401).json({
        success: false,
        message: 'Account is blocked. Please contact support.'
      });
    }

    // Check password
    const isPasswordValid = await mentor.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    mentor.lastLogin = new Date();
    mentor.lastActiveAt = new Date();
    mentor.loginCount += 1;
    await mentor.save();

    // Generate token
    const token = generateToken(mentor._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        mentor: {
          id: mentor._id,
          firstName: mentor.firstName,
          lastName: mentor.lastName,
          email: mentor.email,
          title: mentor.title,
          company: mentor.company,
          specialization: mentor.specialization,
          experience: mentor.experience,
          bio: mentor.bio,
          profileImage: mentor.profileImage,
          rating: mentor.rating,
          totalSessions: mentor.totalSessions,
          responseTime: mentor.responseTime,
          isEmailVerified: mentor.isEmailVerified
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

// @desc    Get current mentor profile
// @route   GET /api/mentors/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.mentor.id);

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        mentor
      }
    });

  } catch (error) {
    console.error('Get mentor profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update mentor profile
// @route   PUT /api/mentors/profile
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

    const mentor = await Mentor.findById(req.mentor.id);

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found'
      });
    }

    // Update allowed fields
    const allowedFields = [
      'firstName', 'lastName', 'title', 'company', 'specialization',
      'experience', 'bio', 'skills', 'languages', 'education',
      'certifications', 'pricing', 'categories', 'profileImage',
      'responseTime', 'profileVisibility'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        mentor[field] = req.body[field];
      }
    });

    await mentor.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        mentor
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

// @desc    Get all mentors (public)
// @route   GET /api/mentors
// @access  Public
const getAllMentors = async (req, res) => {
  try {
    const {
      category,
      search,
      experience,
      rating,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10
    } = req.query;

    const query = { isActive: true, isBlocked: false, profileVisibility: true };

    // Filter by category
    if (category) {
      query.categories = category;
    }

    // Search by name or specialization
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by experience
    if (experience) {
      query.experience = { $regex: experience, $options: 'i' };
    }

    // Filter by rating
    if (rating) {
      query.rating = { $gte: parseFloat(rating) };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const mentors = await Mentor.find(query)
      .select('-password')
      .sort({ rating: -1, totalSessions: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Mentor.countDocuments(query);

    res.status(200).json({
      success: true,
      count: mentors.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: mentors
    });

  } catch (error) {
    console.error('Get all mentors error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get mentor by ID (public)
// @route   GET /api/mentors/:id
// @access  Public
const getMentorById = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id)
      .select('-password');

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found'
      });
    }

    // Check if profile is visible (for public access)
    // If this is not the mentor's own request, check visibility
    if (!req.mentor || req.mentor.id !== mentor._id.toString()) {
      // This is a public request or different user
      if (!mentor.profileVisibility || !mentor.isActive || mentor.isBlocked) {
        return res.status(404).json({
          success: false,
          message: 'Mentor profile not found or not available'
        });
      }
    } else {
      // Mentor's own request - check basic status
      if (!mentor.isActive || mentor.isBlocked) {
        return res.status(404).json({
          success: false,
          message: 'Mentor not found'
        });
      }
    }

    res.status(200).json({
      success: true,
      data: {
        mentor
      }
    });

  } catch (error) {
    console.error('Get mentor by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Create booking
// @route   POST /api/mentors/:id/book
// @access  Private (User)
const createBooking = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const mentor = await Mentor.findById(req.params.id);

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found'
      });
    }

    if (!mentor.isActive || mentor.isBlocked) {
      return res.status(400).json({
        success: false,
        message: 'Mentor is not available'
      });
    }

    const { sessionType, date, time, message } = req.body;

    // Determine duration and price based on session type using new pricing structure
    let details = null;
    const pricing = mentor.pricing || {};

    if (sessionType === '20min') {
      details = {
        duration: pricing.quickConsultation?.duration || '20-25 minutes',
        price: pricing.quickConsultation?.price || 150,
        label: pricing.quickConsultation?.label || 'Quick consultation'
      };
    } else if (sessionType === '50min') {
      details = {
        duration: pricing.inDepthSession?.duration || '50-60 minutes',
        price: pricing.inDepthSession?.price || 300,
        label: pricing.inDepthSession?.label || 'In-depth session'
      };
    } else if (sessionType === '90min') {
      details = {
        duration: pricing.comprehensiveConsultation?.duration || '90-120 minutes',
        price: pricing.comprehensiveConsultation?.price || 450,
        label: pricing.comprehensiveConsultation?.label || 'Comprehensive consultation'
      };
    }

    if (!details) {
      return res.status(400).json({
        success: false,
        message: 'Invalid session type. Must be "20min", "50min", or "90min"'
      });
    }

    // Create booking
    const booking = await MentorBooking.create({
      mentor: mentor._id,
      user: req.user.id,
      sessionType,
      duration: details.duration,
      date: new Date(date),
      time,
      amount: details.price,
      message: message || '',
      status: 'pending',
      paymentStatus: 'pending'
    });

    await booking.populate('user', 'firstName lastName email phone');
    await booking.populate('mentor', 'firstName lastName title company profileImage');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        booking
      }
    });

  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update payment status
// @route   PUT /api/mentors/bookings/:id/payment
// @access  Private (User)
const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentMethod, transactionId } = req.body;

    const booking = await MentorBooking.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.paymentStatus === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Payment already completed'
      });
    }

    booking.paymentMethod = paymentMethod;
    booking.paymentStatus = 'completed';
    booking.transactionId = transactionId || null;
    booking.paidAt = new Date();
    await booking.save();

    await booking.populate('mentor', 'firstName lastName');

    res.status(200).json({
      success: true,
      message: 'Payment successful',
      data: {
        booking
      }
    });

  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get mentor dashboard bookings
// @route   GET /api/mentors/dashboard/bookings
// @access  Private (Mentor)
const getMentorBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = { mentor: req.mentor.id };

    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bookings = await MentorBooking.find(query)
      .populate('user', 'firstName lastName email phone profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await MentorBooking.countDocuments(query);

    const stats = {
      total: await MentorBooking.countDocuments({ mentor: req.mentor.id }),
      pending: await MentorBooking.countDocuments({ mentor: req.mentor.id, status: 'pending' }),
      accepted: await MentorBooking.countDocuments({ mentor: req.mentor.id, status: 'accepted' }),
      completed: await MentorBooking.countDocuments({ mentor: req.mentor.id, status: 'completed' })
    };

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      stats,
      data: bookings
    });

  } catch (error) {
    console.error('Get mentor bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Accept or reject booking
// @route   PUT /api/mentors/bookings/:id/status
// @access  Private (Mentor)
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be "accepted" or "rejected"'
      });
    }

    const booking = await MentorBooking.findOne({
      _id: req.params.id,
      mentor: req.mentor.id
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Booking is already ${booking.status}`
      });
    }

    booking.status = status;
    if (status === 'accepted') {
      booking.acceptedAt = new Date();
    } else {
      booking.rejectedAt = new Date();
    }
    await booking.save();

    await booking.populate('user', 'firstName lastName email');

    res.status(200).json({
      success: true,
      message: `Booking ${status} successfully`,
      data: {
        booking
      }
    });

  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get user bookings
// @route   GET /api/mentors/my-bookings
// @access  Private (User)
const getUserBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = { user: req.user.id };

    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bookings = await MentorBooking.find(query)
      .populate('mentor', 'firstName lastName title company profileImage rating totalSessions')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await MentorBooking.countDocuments(query);

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: bookings
    });

  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  registerMentor,
  loginMentor,
  getMe,
  updateProfile,
  getAllMentors,
  getMentorById,
  createBooking,
  updatePaymentStatus,
  getMentorBookings,
  updateBookingStatus,
  getUserBookings
};

