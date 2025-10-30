const Mentor = require('../models/mentor');
const MentorBooking = require('../models/mentorBooking');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { uploadToCloudinary } = require('../utils/cloudinary');

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
      'certifications', 'pricing', 'categories', 'profileVisibility',
      'profileImage', 'responseTime'
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

// @desc    Upload mentor profile image
// @route   PUT /api/mentors/profile/image
// @access  Private (Mentor)
const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }
    const mentorId = req.mentor.id;
    const result = await uploadToCloudinary(req.file.path, 'mentors/profile', `mentor_${mentorId}`);
    req.mentor.profileImage = result.url;
    await req.mentor.save();
    return res.status(200).json({ success: true, message: 'Profile image updated', data: { url: result.url, mentor: req.mentor } });
  } catch (err) {
    console.error('Upload profile image error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
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

    const query = {
      isActive: true,
      isBlocked: false,
      profileVisibility: true  // Only show mentors with visible profiles
    };

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

    if (!mentor.isActive || mentor.isBlocked || !mentor.profileVisibility) {
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
      return res.status(404).json({ success: false, message: 'Mentor not found' });
    }
    if (!mentor.isActive || mentor.isBlocked) {
      return res.status(400).json({ success: false, message: 'Mentor is not available' });
    }
    const { sessionType } = req.body;
    const pricing = mentor.pricing || {};
    const sessionDetails = {
      '20min': {
        duration: pricing.quick?.duration || '20-25 minutes',
        price: pricing.quick?.price ?? 150,
      },
      '50min': {
        duration: pricing.inDepth?.duration || '50-60 minutes',
        price: pricing.inDepth?.price ?? 300,
      },
      '90min': {
        duration: pricing.comprehensive?.duration || '90-120 minutes',
        price: pricing.comprehensive?.price ?? 450,
      }
    };
    const details = sessionDetails[sessionType];
    if (!details) {
      return res.status(400).json({ success: false, message: 'Invalid session type' });
    }
    // date, time = null by default (mentor will set later)
    const booking = await MentorBooking.create({
      mentor: mentor._id,
      user: req.user.id,
      sessionType,
      duration: details.duration,
      date: null,
      time: null,
      amount: details.price,
      status: 'pending',
      paymentStatus: 'pending'
    });
    await booking.populate('user', 'firstName lastName email phone');
    await booking.populate('mentor', 'firstName lastName title company profileImage');
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: { booking }
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
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

// @desc    Get a booking by ID (for the logged-in user)
// @route   GET /api/mentors/bookings/:id
// @access  Private (User)
const getBookingById = async (req, res) => {
  try {
    const booking = await MentorBooking.findOne({ _id: req.params.id, user: req.user.id })
      .populate('mentor', 'firstName lastName title company profileImage')
      .populate('user', 'firstName lastName email phone');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Normalize mentor fields for frontend expectations
    const mentor = booking.mentor;
    const normalized = {
      _id: booking._id,
      mentor: {
        _id: mentor?._id,
        name: mentor ? `${mentor.firstName || ''} ${mentor.lastName || ''}`.trim() : 'Mentor',
        title: mentor?.title || '',
        company: mentor?.company || '',
        image: mentor?.profileImage || '',
      },
      user: booking.user,
      sessionType: booking.sessionType,
      duration: booking.duration,
      date: booking.date,
      time: booking.time,
      amount: booking.amount,
      paymentMethod: booking.paymentMethod,
      paymentStatus: booking.paymentStatus,
      transactionId: booking.transactionId,
      status: booking.status,
      sessionLink: booking.sessionLink,
      message: booking.message,
      review: booking.review,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    };

    return res.status(200).json({ success: true, data: { booking: normalized } });
  } catch (error) {
    console.error('Get booking by id error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
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
    const { status, date, time, sessionLink, reason, message } = req.body;

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
      if (date) booking.date = date;
      if (time) booking.time = time;
      if (sessionLink) booking.sessionLink = sessionLink;
    } else {
      booking.rejectedAt = new Date();
      const rejectReason = reason || message;
      if (rejectReason) booking.cancellationReason = rejectReason;
    }
    await booking.save();

    await booking.populate('user', 'firstName lastName email');

    res.status(200).json({
      success: true,
      message: `Booking ${status} successfully`,
      data: { booking }
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

// @desc    Add or update session link for accepted booking
// @route   PUT /api/mentors/bookings/:id/session-link
// @access  Private (Mentor)
const setSessionLink = async (req, res) => {
  try {
    const { sessionLink } = req.body;
    if (!sessionLink) {
      return res.status(400).json({
        success: false,
        message: 'Session link is required'
      });
    }
    const booking = await MentorBooking.findOne({
      _id: req.params.id,
      mentor: req.mentor.id,
      status: 'accepted',
    });
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Accepted booking not found'
      });
    }
    booking.sessionLink = sessionLink;
    await booking.save();
    res.status(200).json({
      success: true,
      message: 'Session link updated',
      data: { booking }
    });
  } catch (error) {
    console.error('Set session link error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Add or edit endpoint for mentor to update date, time, sessionLink for a booking later (PUT /api/mentors/bookings/:id/details)
const mentorUpdateBookingDetails = async (req, res) => {
  try {
    const { date, time, sessionLink } = req.body;
    const booking = await MentorBooking.findOne({ _id: req.params.id, mentor: req.mentor.id });
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    if (date) booking.date = date;
    if (time) booking.time = time;
    if (sessionLink) booking.sessionLink = sessionLink;
    await booking.save();
    res.status(200).json({ success: true, data: { booking } });
  } catch (error) {
    console.error('Mentor update booking details error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
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

// @desc    Add review to a completed booking
// @route   PUT /api/mentors/bookings/:id/review
// @access  Private (User)
const addBookingReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
      });
    }
    const booking = await MentorBooking.findOne({
      _id: req.params.id,
      user: req.user.id,
      status: 'completed',
    });
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Completed booking not found',
      });
    }
    if (booking.review && booking.review.rating) {
      return res.status(400).json({
        success: false,
        message: 'Review already submitted',
      });
    }
    booking.review.rating = rating;
    booking.review.comment = comment || '';
    booking.review.createdAt = new Date();
    await booking.save();
    res.status(200).json({
      success: true,
      message: 'Review submitted',
      data: { review: booking.review }
    });
  } catch (error) {
    console.error('Add booking review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Create Razorpay order for a booking
// @route   POST /api/mentors/bookings/:id/create-order
// @access  Private (User)
const createRazorpayOrder = async (req, res) => {
  try {
    const booking = await MentorBooking.findOne({ _id: req.params.id, user: req.user.id });
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    if (!booking.amount || booking.amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid booking amount' });
    }

    const { getRazorpayClient } = require('../services/razorpay');
    const razorpay = getRazorpayClient();
    const options = {
      amount: Math.round(booking.amount * 100),
      currency: 'INR',
      receipt: `booking_${booking._id}`,
      notes: {
        bookingId: booking._id.toString(),
        userId: req.user.id,
      },
    };
    const order = await razorpay.orders.create(options);
    return res.status(200).json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (error) {
    console.error('Create Razorpay order error:', error);
    const message = error && error.message && error.message.includes('Razorpay keys')
      ? 'Payment gateway not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.'
      : 'Server error';
    return res.status(500).json({ success: false, message, error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
};

module.exports = {
  registerMentor,
  loginMentor,
  getMe,
  updateProfile,
  uploadProfileImage,
  getAllMentors,
  getMentorById,
  createBooking,
  updatePaymentStatus,
  getMentorBookings,
  updateBookingStatus,
  getUserBookings,
  addBookingReview,
  setSessionLink,
  mentorUpdateBookingDetails,
  getBookingById,
  createRazorpayOrder
};

