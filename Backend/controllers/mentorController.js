const Mentor = require('../models/mentor');
const MentorBooking = require('../models/mentorBooking');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const { uploadToCloudinary } = require('../utils/cloudinary');
const { sendBookingAcceptedEmail, sendBookingRejectedEmail } = require('../services/emailService');
const {
  mentorSpecializations,
  resolveSpecialization,
  getSpecializationIdFromName,
  getAllSpecializationIds
} = require('../utils/mentorSpecializations');

// Generate JWT Token
const generateToken = (mentorId) => {
  return jwt.sign({ mentorId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

const inferSpecializationEntry = (value) => {
  if (!value) return null;
  const direct = resolveSpecialization(value);
  if (direct) return direct;
  const idFromName = getSpecializationIdFromName(value);
  if (!idFromName) return null;
  return resolveSpecialization(idFromName);
};

const sanitizeMentor = (mentorDoc) => {
  if (!mentorDoc) return null;

  const mentorObj = mentorDoc.toObject ? mentorDoc.toObject() : { ...mentorDoc };
  delete mentorObj.password;

  const specializationEntry = inferSpecializationEntry(
    mentorObj.specializationKey || mentorObj.specialization
  );

  if (specializationEntry) {
    mentorObj.specialization = specializationEntry.name;
    mentorObj.specializationKey = specializationEntry.id;

    const existingCategories = Array.isArray(mentorObj.categories) ? mentorObj.categories : [];
    const specializationIds = new Set(getAllSpecializationIds());
    const categorySet = new Set();

    existingCategories.forEach(cat => {
      if (!specializationIds.has(cat)) {
        categorySet.add(cat);
        return;
      }

      if (
        cat === specializationEntry.id ||
        (Array.isArray(specializationEntry.tags) && specializationEntry.tags.includes(cat))
      ) {
        categorySet.add(cat);
      }
    });

    if (Array.isArray(specializationEntry.tags)) {
      specializationEntry.tags.forEach(tag => categorySet.add(tag));
    }
    categorySet.add(specializationEntry.id);
    mentorObj.categories = Array.from(categorySet);
  } else {
    mentorObj.specializationKey = mentorObj.specializationKey || null;
    mentorObj.categories = Array.isArray(mentorObj.categories) ? mentorObj.categories : [];
  }

  mentorObj.rating = typeof mentorObj.rating === 'number' && mentorObj.rating > 0
    ? Number(mentorObj.rating.toFixed(2))
    : 3;

  const reviewCountFromField = typeof mentorObj.reviewCount === 'number'
    ? mentorObj.reviewCount
    : Array.isArray(mentorObj.reviews)
      ? mentorObj.reviews.length
      : 0;

  mentorObj.reviewCount = reviewCountFromField;
  mentorObj.totalSessions = typeof mentorObj.totalSessions === 'number' ? mentorObj.totalSessions : 0;

  return mentorObj;
};

const sanitizeMentorList = (mentors) => {
  if (!Array.isArray(mentors)) return [];
  return mentors.map((mentor) => sanitizeMentor(mentor));
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
      bio,
      categories: categoriesPayload
    } = req.body;

    const specializationEntry = resolveSpecialization(specialization);
    if (!specializationEntry) {
      return res.status(400).json({
        success: false,
        message: 'Invalid specialization selected'
      });
    }

    // Check if mentor already exists
    const existingMentor = await Mentor.findOne({ email });

    if (existingMentor) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create new mentor
    const initialCategories = Array.isArray(categoriesPayload) ? categoriesPayload : [];
    const categorySet = new Set(initialCategories);
    if (Array.isArray(specializationEntry.tags)) {
      specializationEntry.tags.forEach(tag => categorySet.add(tag));
    }

    const mentorData = {
      firstName,
      lastName,
      email,
      password,
      specialization: specializationEntry.name,
      experience,
      company: company || '',
      bio: bio || '',
      categories: Array.from(categorySet),
      isEmailVerified: false
    };

    const mentor = await Mentor.create(mentorData);
    const sanitizedMentor = sanitizeMentor(mentor);

    // Generate token for immediate login
    const token = generateToken(mentor._id);

    res.status(201).json({
      success: true,
      message: 'Mentor registered successfully.',
      data: {
        mentor: {
          id: sanitizedMentor._id,
          firstName: sanitizedMentor.firstName,
          lastName: sanitizedMentor.lastName,
          email: sanitizedMentor.email,
          specialization: sanitizedMentor.specialization,
          specializationKey: sanitizedMentor.specializationKey,
          categories: sanitizedMentor.categories,
          experience: sanitizedMentor.experience,
          rating: sanitizedMentor.rating,
          reviewCount: sanitizedMentor.reviewCount,
          isEmailVerified: sanitizedMentor.isEmailVerified
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
    const sanitizedMentor = sanitizeMentor(mentor);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        mentor: {
          id: sanitizedMentor._id,
          firstName: sanitizedMentor.firstName,
          lastName: sanitizedMentor.lastName,
          email: sanitizedMentor.email,
          title: sanitizedMentor.title,
          company: sanitizedMentor.company,
          specialization: sanitizedMentor.specialization,
          specializationKey: sanitizedMentor.specializationKey,
          categories: sanitizedMentor.categories,
          experience: sanitizedMentor.experience,
          bio: sanitizedMentor.bio,
          profileImage: sanitizedMentor.profileImage,
          rating: sanitizedMentor.rating,
          reviewCount: sanitizedMentor.reviewCount,
          totalSessions: sanitizedMentor.totalSessions,
          responseTime: sanitizedMentor.responseTime,
          isEmailVerified: sanitizedMentor.isEmailVerified
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

    // Get completed sessions count
    const completedSessions = await MentorBooking.countDocuments({ 
      mentor: req.mentor.id, 
      status: 'completed' 
    });

    // Convert mentor to object and add completed sessions count
    const mentorObject = sanitizeMentor(mentor);
    mentorObject.completedSessions = completedSessions;

    res.status(200).json({
      success: true,
      data: {
        mentor: mentorObject
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

    let categoriesToApply = null;

    let currentSpecializationEntry = inferSpecializationEntry(
      mentor.specializationKey || mentor.specialization
    );

    if (req.body.specialization !== undefined) {
      const specializationEntry = resolveSpecialization(req.body.specialization);
      if (!specializationEntry) {
        return res.status(400).json({
          success: false,
          message: 'Invalid specialization selected'
        });
      }

      const existingCategories = Array.isArray(mentor.categories) ? mentor.categories : [];
      const incomingCategories = Array.isArray(req.body.categories) ? req.body.categories : existingCategories;
      const categorySet = new Set(incomingCategories);

      if (currentSpecializationEntry && Array.isArray(currentSpecializationEntry.tags)) {
        currentSpecializationEntry.tags.forEach(tag => categorySet.delete(tag));
      }

      mentor.specialization = specializationEntry.name;

      if (Array.isArray(specializationEntry.tags)) {
        specializationEntry.tags.forEach(tag => categorySet.add(tag));
      }

      categoriesToApply = Array.from(categorySet);
      currentSpecializationEntry = specializationEntry;
    } else if (req.body.categories !== undefined) {
      categoriesToApply = Array.isArray(req.body.categories)
        ? Array.from(new Set(req.body.categories))
        : [];
    }

    // Update allowed fields
    const allowedFields = [
      'firstName', 'lastName', 'title', 'company',
      'experience', 'bio', 'skills', 'languages', 'education',
      'certifications', 'pricing', 'profileVisibility',
      'profileImage', 'responseTime'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        mentor[field] = req.body[field];
      }
    });

    if (categoriesToApply !== null) {
      mentor.categories = categoriesToApply;
    }

    await mentor.save();
    const sanitizedMentor = sanitizeMentor(mentor);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        mentor: sanitizedMentor
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

// @desc    Change mentor password
// @route   PUT /api/mentors/change-password
// @access  Private (Mentor)
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

    const mentor = await Mentor.findById(req.mentor.id).select('+password');

    if (!mentor || !mentor.password) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found'
      });
    }

    const isMatch = await mentor.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    mentor.password = newPassword;
    await mentor.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
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

    const conditions = [
      { isActive: true },
      { isBlocked: false },
      { profileVisibility: true }
    ];

    if (category) {
      const specializationEntry = resolveSpecialization(category);
      if (specializationEntry) {
        conditions.push({ specialization: specializationEntry.name });
      } else {
        conditions.push({ categories: category });
      }
    }

    if (search) {
      conditions.push({
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { specialization: { $regex: search, $options: 'i' } },
          { bio: { $regex: search, $options: 'i' } }
        ]
      });
    }

    if (experience) {
      conditions.push({ experience: { $regex: experience, $options: 'i' } });
    }

    if (rating) {
      const ratingValue = parseFloat(rating);
      if (!Number.isNaN(ratingValue)) {
        conditions.push({ rating: { $gte: ratingValue } });
      }
    }

    const query = { $and: conditions };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const mentors = await Mentor.find(query)
      .select('-password')
      .sort({ rating: -1, totalSessions: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    let sanitizedMentors = sanitizeMentorList(mentors);

    if (category) {
      sanitizedMentors = sanitizedMentors.filter((mentor) => {
        if (!mentor) return false;
        if (mentor.specializationKey === category) return true;
        if (Array.isArray(mentor.categories) && mentor.categories.includes(category)) return true;
        return false;
      });
    }

    const total = await Mentor.countDocuments(query);

    res.status(200).json({
      success: true,
      count: sanitizedMentors.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: sanitizedMentors
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
    const mentorDoc = await Mentor.findById(req.params.id)
      .select('-password')
      .lean();

    if (!mentorDoc) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found'
      });
    }

    if (!mentorDoc.isActive || mentorDoc.isBlocked || !mentorDoc.profileVisibility) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found'
      });
    }

    const sanitizedMentor = sanitizeMentor(mentorDoc);

    res.status(200).json({
      success: true,
      data: {
        mentor: sanitizedMentor
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
    await booking.populate('mentor', 'firstName lastName title company profileImage responseTime');
    
    // Create notification for all admins
    try {
      const { createNotification } = require('./notificationController');
      const Admin = require('../models/admin');
      const admins = await Admin.find({ isActive: true }).select('_id');
      const user = booking.user;
      const mentor = booking.mentor;
      const userName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email : 'A user';
      const mentorName = mentor ? `${mentor.firstName || ''} ${mentor.lastName || ''}`.trim() || 'A mentor' : 'A mentor';
      const notificationPromises = admins.map(admin => 
        createNotification(
          admin._id,
          'mentor_booking',
          'New Mentor Booking',
          `${userName} has booked a ${sessionType} session with ${mentorName}`,
          `/admin/mentors/bookings`,
          {
            bookingId: booking._id.toString(),
            userName: userName,
            mentorName: mentorName,
            sessionType: sessionType
          }
        )
      );
      await Promise.allSettled(notificationPromises);
    } catch (notifError) {
      console.error('Error creating notifications:', notifError);
      // Don't fail the request if notification fails
    }
    
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
    console.log('[Razorpay][Mentor][UpdatePayment] Request received', {
      bookingId: req.params.id,
      userId: req.user?.id || req.user?._id,
      paymentMethod: req.body?.paymentMethod,
      hasTransactionId: !!req.body?.transactionId,
      hasOrderId: !!req.body?.razorpayOrderId,
      hasSignature: !!req.body?.razorpaySignature,
      body: req.body,
      timestamp: new Date().toISOString()
    });
    
    // Note: Validation is already done by route middleware
    // But log if validation errors exist (shouldn't reach here if validation fails)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('[Razorpay][Mentor][UpdatePayment] Validation errors (should not reach here)', {
        errors: errors.array(),
        body: req.body
      });
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    const allowedPaymentMethods = ['upi', 'card', 'netbanking', 'wallet', 'razorpay'];
    let paymentMethod = req.body?.paymentMethod;
    if (typeof paymentMethod !== 'string' || !paymentMethod.trim()) {
      paymentMethod = 'razorpay';
    } else {
      paymentMethod = paymentMethod.trim().toLowerCase();
    }

    if (!allowedPaymentMethods.includes(paymentMethod)) {
      console.warn('[Razorpay][Mentor][UpdatePayment] Unsupported payment method received. Falling back to razorpay.', {
        bookingId: req.params.id,
        received: req.body?.paymentMethod
      });
      paymentMethod = 'razorpay';
    }

    const transactionId = req.body?.transactionId;
    const razorpayOrderId = req.body?.razorpayOrderId || req.body?.razorpay_order_id;
    const razorpaySignature = req.body?.razorpaySignature || req.body?.razorpay_signature;

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

    if (razorpaySignature) {
      if (!transactionId) {
        return res.status(400).json({
          success: false,
          message: 'Missing payment reference for signature verification.'
        });
      }

      const orderIdsForVerification = [];
      if (razorpayOrderId) {
        orderIdsForVerification.push(razorpayOrderId);
      }
      if (booking.paymentGatewayOrderId && !orderIdsForVerification.includes(booking.paymentGatewayOrderId)) {
        orderIdsForVerification.push(booking.paymentGatewayOrderId);
      }

      if (!orderIdsForVerification.length) {
        return res.status(400).json({
          success: false,
          message: 'Missing order reference for signature verification.'
        });
      }

      const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;
      if (!razorpaySecret) {
        throw new Error('Razorpay key secret not configured');
      }

      let matchedOrderId = null;
      for (const orderId of orderIdsForVerification) {
        const expectedSignature = crypto
          .createHmac('sha256', razorpaySecret)
          .update(`${orderId}|${transactionId}`)
          .digest('hex');

        if (expectedSignature === razorpaySignature) {
          matchedOrderId = orderId;
          break;
        }
      }

      if (!matchedOrderId) {
        // Signature verification failed, but try to verify payment with Razorpay API
        console.warn('[Razorpay][Mentor][UpdatePayment] Signature verification failed, attempting API verification', {
          bookingId: req.params.id,
          transactionId,
          orderIds: orderIdsForVerification
        });
        
        try {
          const { getRazorpayClient } = require('../services/razorpay');
          const razorpay = getRazorpayClient();
          
          // Try to fetch payment from Razorpay to verify it exists
          const payment = await razorpay.payments.fetch(transactionId);
          
          if (payment && (payment.status === 'captured' || payment.status === 'authorized')) {
            // Payment is valid according to Razorpay, proceed with payment
            console.log('[Razorpay][Mentor][UpdatePayment] Payment verified via API despite signature mismatch', {
              bookingId: req.params.id,
              paymentId: payment.id,
              paymentStatus: payment.status,
              orderId: payment.order_id
            });
            matchedOrderId = payment.order_id || orderIdsForVerification[0];
            // Store signature even though it didn't match (for audit)
            booking.paymentGatewaySignature = razorpaySignature;
          } else {
            // Payment not found or not captured
            return res.status(400).json({
              success: false,
              message: 'Payment verification failed. Payment not found or not completed.'
            });
          }
        } catch (apiError) {
          console.error('[Razorpay][Mentor][UpdatePayment] API verification also failed', {
            error: apiError.message,
            bookingId: req.params.id,
            transactionId
          });
          // If API verification also fails, reject the payment
          return res.status(400).json({
            success: false,
            message: 'Payment verification failed. Please contact support with transaction ID: ' + transactionId
          });
        }
      }

      booking.paymentGatewaySignature = razorpaySignature;
      booking.paymentGatewayOrderId = matchedOrderId;
    }

    if (!razorpaySignature && razorpayOrderId && !booking.paymentGatewayOrderId) {
      booking.paymentGatewayOrderId = razorpayOrderId;
    }

    // If transactionId is missing but we have orderId, try to fetch payment from Razorpay
    if (!transactionId && razorpayOrderId) {
      console.log('[Razorpay][Mentor][UpdatePayment] No transaction ID, checking Razorpay order for payments', {
        orderId: razorpayOrderId
      });
      try {
        const { getRazorpayClient } = require('../services/razorpay');
        const razorpay = getRazorpayClient();
        
        // Fetch order to get payments
        const order = await razorpay.orders.fetch(razorpayOrderId);
        if (order && order.payments && order.payments.length > 0) {
          // Get the first successful payment
          const paymentId = order.payments[0];
          const payment = await razorpay.payments.fetch(paymentId);
          
          if (payment && (payment.status === 'captured' || payment.status === 'authorized')) {
            console.log('[Razorpay][Mentor][UpdatePayment] Found payment from Razorpay order', {
              paymentId: payment.id,
              status: payment.status
            });
            transactionId = payment.id;
          }
        }
      } catch (razorpayError) {
        console.error('[Razorpay][Mentor][UpdatePayment] Error fetching payment from Razorpay', {
          error: razorpayError.message,
          orderId: razorpayOrderId
        });
        // Continue without transactionId - we'll mark as completed anyway
      }
    }

    // Ensure payment gateway is set
    if (!booking.paymentGateway || booking.paymentGateway !== 'razorpay') {
      booking.paymentGateway = 'razorpay';
    }

    booking.paymentMethod = paymentMethod;
    booking.paymentStatus = 'completed';
    booking.transactionId = transactionId || null;
    booking.paidAt = new Date();
    await booking.save();

    await booking.populate('mentor', 'firstName lastName');

    console.log('[Razorpay][Mentor][UpdatePayment] Payment captured', {
      bookingId: booking._id.toString(),
      paymentStatus: booking.paymentStatus,
      transactionId: booking.transactionId,
      paidAt: booking.paidAt
    });

    res.status(200).json({
      success: true,
      message: 'Payment successful',
      data: {
        booking
      }
    });

  } catch (error) {
    console.error('[Razorpay][Mentor][UpdatePayment] Error', {
      message: error.message,
      stack: error.stack,
      bookingId: req.params.id,
      userId: req.user?.id || req.user?._id
    });
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
      .populate('mentor', 'firstName lastName title company profileImage responseTime')
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
        responseTime: mentor?.responseTime || '24 hours',
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

// @desc    Accept, reject, or complete booking
// @route   PUT /api/mentors/bookings/:id/status
// @access  Private (Mentor)
const updateBookingStatus = async (req, res) => {
  try {
    const { status, date, time, sessionLink, reason, message } = req.body;

    if (!['accepted', 'rejected', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be "accepted", "rejected", or "completed"'
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

    // Validate status transitions
    if (status === 'accepted' || status === 'rejected') {
      // Can only accept or reject from pending
      if (booking.status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: `Cannot ${status} booking. Booking is already ${booking.status}`
        });
      }
    } else if (status === 'completed') {
      // Can only complete from accepted
      if (booking.status !== 'accepted') {
        return res.status(400).json({
          success: false,
          message: `Cannot complete booking. Booking must be accepted first. Current status: ${booking.status}`
        });
      }
    }

    booking.status = status;
    if (status === 'accepted') {
      booking.acceptedAt = new Date();
      if (date) booking.date = date;
      if (time) booking.time = time;
      if (sessionLink) booking.sessionLink = sessionLink;
    } else if (status === 'rejected') {
      booking.rejectedAt = new Date();
      const rejectReason = reason || message;
      if (rejectReason) booking.cancellationReason = rejectReason;
    } else if (status === 'completed') {
      booking.completedAt = new Date();
    }
    await booking.save();

    // Populate both user and mentor data for email
    await booking.populate('user', 'firstName lastName email phone');
    await booking.populate('mentor', 'firstName lastName title company specialization');

    // Send email notification to user
    try {
      if (status === 'accepted') {
        await sendBookingAcceptedEmail(booking, booking.mentor, booking.user);
      } else if (status === 'rejected') {
        await sendBookingRejectedEmail(booking, booking.mentor, booking.user);
      }
    } catch (emailError) {
      console.error('Error sending email notification:', emailError);
      // Don't fail the request if email fails, just log it
    }

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

    const mentor = await Mentor.findById(booking.mentor);
    if (mentor) {
      const stats = await MentorBooking.aggregate([
        { $match: { mentor: mentor._id } },
        {
          $group: {
            _id: '$mentor',
            completedCount: {
              $sum: {
                $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
              }
            },
            reviewCount: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $eq: ['$status', 'completed'] },
                      { $ne: ['$review.rating', null] }
                    ]
                  },
                  1,
                  0
                ]
              }
            },
            totalRating: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $eq: ['$status', 'completed'] },
                      { $ne: ['$review.rating', null] }
                    ]
                  },
                  '$review.rating',
                  0
                ]
              }
            }
          }
        }
      ]);

      const statsData = stats[0];
      const reviewCount = statsData ? statsData.reviewCount : 0;
      const completedCount = statsData ? statsData.completedCount : 0;
      const totalRating = statsData ? statsData.totalRating : 0;

      const averageRating = reviewCount > 0 ? totalRating / reviewCount : 3;
      mentor.rating = reviewCount > 0 ? Number(averageRating.toFixed(2)) : 3;
      mentor.totalSessions = completedCount;
      mentor.reviewCount = reviewCount;

      if (!Array.isArray(mentor.reviews)) {
        mentor.reviews = [];
      }
      const hasBooking = mentor.reviews.some(id => id.toString() === booking._id.toString());
      if (!hasBooking) {
        mentor.reviews.push(booking._id);
      }

      await mentor.save();
    }

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

// @desc    Create Razorpay Payment Link for webview compatibility
// @route   POST /api/mentors/bookings/:id/create-payment-link
// @access  Private (User)
const createRazorpayPaymentLink = async (req, res) => {
  try {
    console.log('[Razorpay][Mentor][CreatePaymentLink] Request received', {
      bookingId: req.params.id,
      userId: req.user?.id || req.user?._id,
      timestamp: new Date().toISOString()
    });
    
    const booking = await MentorBooking.findOne({ _id: req.params.id, user: req.user.id });
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    if (booking.paymentStatus === 'completed') {
      return res.status(400).json({ success: false, message: 'Payment already completed' });
    }
    
    if (!booking.amount || booking.amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid booking amount' });
    }

    // Validate Razorpay configuration
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('[Razorpay][Mentor][CreatePaymentLink] Razorpay keys not configured');
      return res.status(500).json({ 
        success: false, 
        message: 'Payment gateway not configured. Please contact support.' 
      });
    }

    let razorpay;
    try {
      const { getRazorpayClient } = require('../services/razorpay');
      razorpay = getRazorpayClient();
    } catch (razorpayError) {
      console.error('[Razorpay][Mentor][CreatePaymentLink] Razorpay client initialization error', razorpayError);
      return res.status(500).json({ 
        success: false, 
        message: 'Payment gateway initialization failed. Please contact support.',
        error: process.env.NODE_ENV === 'development' ? razorpayError.message : undefined
      });
    }

    // Get base URLs
    const backendUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    
    // Create callback URL - point to backend handler which will verify and redirect
    const callbackUrl = `${backendUrl}/api/mentors/bookings/${booking._id}/payment-callback`;
    
    // Get user details for prefill
    const user = await User.findById(req.user.id).select('firstName lastName email phone');
    const userName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '';
    
    // Detect if request is from WebView
    const userAgent = req.headers['user-agent'] || '';
    const isWebViewRequest = /wv|WebView|flutter|Android.*wv|iPhone.*wv/i.test(userAgent);
    
    const paymentLinkOptions = {
      amount: Math.round(booking.amount * 100), // Convert to paise
      currency: 'INR',
      description: `Mentor Booking - ${booking.sessionType} session`,
      customer: {
        name: userName || 'User',
        email: user?.email || '',
        contact: user?.phone || ''
      },
      notify: {
        sms: false,
        email: false
      },
      reminder_enable: false,
      callback_url: callbackUrl,
      callback_method: 'get',
      // Add payment method options for better WebView support
      options: {
        checkout: {
          method: {
            netbanking: 1,
            card: 1,
            upi: 1,
            wallet: 1
          }
        }
      },
      notes: {
        bookingId: booking._id.toString(),
        userId: req.user.id,
        sessionType: booking.sessionType,
        type: 'mentor_booking',
        isWebView: isWebViewRequest ? 'true' : 'false' // Flag for WebView
      }
    };
    
    console.log('[Razorpay][Mentor][CreatePaymentLink] Creating payment link', {
      amount: paymentLinkOptions.amount,
      currency: paymentLinkOptions.currency,
      callbackUrl
    });

    let paymentLink;
    try {
      paymentLink = await razorpay.paymentLink.create(paymentLinkOptions);
      
      // Validate payment link response
      if (!paymentLink || !paymentLink.id || !paymentLink.short_url) {
        throw new Error('Invalid payment link response from Razorpay');
      }
      
      console.log('[Razorpay][Mentor][CreatePaymentLink] Payment link created successfully', {
        paymentLinkId: paymentLink.id,
        shortUrl: paymentLink.short_url,
        status: paymentLink.status
      });
    } catch (razorpayApiError) {
      console.error('[Razorpay][Mentor][CreatePaymentLink] Razorpay API error:', {
        message: razorpayApiError?.message,
        statusCode: razorpayApiError?.statusCode,
        error: razorpayApiError?.error,
        name: razorpayApiError?.name
      });
      
      let errorMessage = 'Failed to create payment link. Please try again later.';
      
      try {
        if (razorpayApiError?.error?.description) {
          errorMessage = razorpayApiError.error.description;
        } else if (razorpayApiError?.error?.code) {
          errorMessage = `Payment error (${razorpayApiError.error.code}): ${razorpayApiError.error.description || 'Please check your payment gateway configuration'}`;
        } else if (razorpayApiError?.message) {
          if (razorpayApiError.message.includes('status') || razorpayApiError.message.includes('undefined')) {
            errorMessage = 'Payment gateway configuration error. Please contact support.';
          } else {
            errorMessage = razorpayApiError.message;
          }
        }
      } catch (extractError) {
        console.warn('[Razorpay][Mentor][CreatePaymentLink] Error extracting error details:', extractError);
        errorMessage = 'Payment gateway error. Please try again or contact support.';
      }
      
      return res.status(500).json({
        success: false,
        message: errorMessage,
        error: process.env.NODE_ENV === 'development' ? razorpayApiError?.message : undefined,
        errorCode: razorpayApiError?.error?.code || razorpayApiError?.statusCode
      });
    }

    // Update booking with payment link info
    if (!booking.paymentGateway || booking.paymentGateway !== 'razorpay') {
      booking.paymentGateway = 'razorpay';
    }
    booking.paymentGatewayOrderId = paymentLink.id; // Store payment link ID
    booking.paymentStatus = 'pending';
    booking.paymentGatewaySignature = null;
    await booking.save();

    return res.status(200).json({
      success: true,
      data: {
        paymentLinkId: paymentLink.id,
        paymentUrl: paymentLink.short_url,
        amount: paymentLink.amount,
        currency: paymentLink.currency,
      },
    });
  } catch (error) {
    console.error('[Razorpay][Mentor][CreatePaymentLink] Error', {
      message: error.message,
      stack: error.stack,
      bookingId: req.params.id,
      userId: req.user?.id || req.user?._id
    });
    const message = error && error.message && error.message.includes('Razorpay keys')
      ? 'Payment gateway not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.'
      : 'Server error';
    return res.status(500).json({ 
      success: false, 
      message, 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

// @desc    Create Razorpay order for a booking (for web browser - modal)
// @route   POST /api/mentors/bookings/:id/create-order
// @access  Private (User)
const createRazorpayOrder = async (req, res) => {
  try {
    console.log('[Razorpay][Mentor][CreateOrder] Request received', {
      bookingId: req.params.id,
      userId: req.user?.id || req.user?._id,
      timestamp: new Date().toISOString()
    });
    const booking = await MentorBooking.findOne({ _id: req.params.id, user: req.user.id });
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    if (!booking.amount || booking.amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid booking amount' });
    }

    // Validate Razorpay configuration
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('[Razorpay][Mentor][CreateOrder] Razorpay keys not configured');
      return res.status(500).json({ 
        success: false, 
        message: 'Payment gateway not configured. Please contact support.' 
      });
    }

    let razorpay;
    try {
      const { getRazorpayClient } = require('../services/razorpay');
      razorpay = getRazorpayClient();
    } catch (razorpayError) {
      console.error('[Razorpay][Mentor][CreateOrder] Razorpay client initialization error', razorpayError);
      return res.status(500).json({ 
        success: false, 
        message: 'Payment gateway initialization failed. Please contact support.',
        error: process.env.NODE_ENV === 'development' ? razorpayError.message : undefined
      });
    }

    const options = {
      amount: Math.round(booking.amount * 100),
      currency: 'INR',
      receipt: `booking_${booking._id}`,
      notes: {
        bookingId: booking._id.toString(),
        userId: req.user.id,
      },
    };
    
    console.log('[Razorpay][Mentor][CreateOrder] Creating Razorpay order', {
      amount: options.amount,
      currency: options.currency,
      receipt: options.receipt,
      hasRazorpayClient: !!razorpay
    });

    let order;
    try {
      console.log('[Razorpay][Mentor][CreateOrder] Calling Razorpay API...');
      order = await razorpay.orders.create(options);
      
      // Validate order response
      if (!order || !order.id) {
        throw new Error('Invalid order response from Razorpay - order ID missing');
      }
      
      console.log('[Razorpay][Mentor][CreateOrder] Order created successfully', {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        status: order.status || 'created'
      });
    } catch (razorpayApiError) {
      // Handle Razorpay SDK errors safely
      console.error('[Razorpay][Mentor][CreateOrder] Razorpay API error:', {
        message: razorpayApiError?.message,
        statusCode: razorpayApiError?.statusCode,
        error: razorpayApiError?.error,
        name: razorpayApiError?.name,
        bookingId: req.params.id,
        userId: req.user?.id || req.user?._id
      });
      
      let errorMessage = 'Failed to create payment order. Please try again later.';
      
      // Extract error message safely
      try {
        if (razorpayApiError?.error?.description) {
          errorMessage = razorpayApiError.error.description;
        } else if (razorpayApiError?.error?.code) {
          errorMessage = `Payment error (${razorpayApiError.error.code}): ${razorpayApiError.error.description || 'Please check your payment gateway configuration'}`;
        } else if (razorpayApiError?.message) {
          // Handle SDK internal errors
          if (razorpayApiError.message.includes('status') || razorpayApiError.message.includes('undefined')) {
            errorMessage = 'Payment gateway configuration error. Please contact support.';
          } else {
            errorMessage = razorpayApiError.message;
          }
        }
      } catch (extractError) {
        console.warn('[Razorpay][Mentor][CreateOrder] Error extracting error details:', extractError);
        errorMessage = 'Payment gateway error. Please try again or contact support.';
      }
      
      return res.status(500).json({
        success: false,
        message: errorMessage,
        error: process.env.NODE_ENV === 'development' ? razorpayApiError?.message : undefined,
        errorCode: razorpayApiError?.error?.code || razorpayApiError?.statusCode
      });
    }

    if (!booking.paymentGateway || booking.paymentGateway !== 'razorpay') {
      booking.paymentGateway = 'razorpay';
    }
    booking.paymentGatewayOrderId = order.id;
    booking.paymentStatus = 'pending';
    booking.paymentGatewaySignature = null;
    await booking.save();

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
    console.error('[Razorpay][Mentor][CreateOrder] Error', {
      message: error.message,
      stack: error.stack,
      bookingId: req.params.id,
      userId: req.user?.id || req.user?._id
    });
    const message = error && error.message && error.message.includes('Razorpay keys')
      ? 'Payment gateway not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.'
      : 'Server error';
    return res.status(500).json({ success: false, message, error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
};

// @desc    Verify payment with Razorpay and update status
// @route   POST /api/mentors/bookings/:id/verify-payment
// @access  Private (User)
const verifyAndUpdatePayment = async (req, res) => {
  try {
    console.log('[Razorpay][Mentor][VerifyPayment] Request received', {
      bookingId: req.params.id,
      userId: req.user?.id || req.user?._id,
      timestamp: new Date().toISOString()
    });

    const booking = await MentorBooking.findOne({ _id: req.params.id, user: req.user.id });
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.paymentStatus === 'completed') {
      return res.status(200).json({
        success: true,
        message: 'Payment already completed',
        data: { booking }
      });
    }

    // Check if we have a Razorpay order ID
    if (!booking.paymentGatewayOrderId) {
      return res.status(400).json({
        success: false,
        message: 'No payment order found. Please initiate payment first.'
      });
    }

    const { getRazorpayClient } = require('../services/razorpay');
    const razorpay = getRazorpayClient();

    try {
      // Fetch order from Razorpay
      console.log('[Razorpay][Mentor][VerifyPayment] Fetching order from Razorpay', {
        orderId: booking.paymentGatewayOrderId
      });
      
      const order = await razorpay.orders.fetch(booking.paymentGatewayOrderId);
      
      console.log('[Razorpay][Mentor][VerifyPayment] Order fetched successfully', {
        orderId: order.id,
        orderStatus: order.status,
        hasPaymentsArray: !!order.payments,
        paymentsCount: order.payments?.length || 0,
        orderAmount: order.amount,
        orderAmountPaid: order.amount_paid || 0
      });

      let payment = null;
      let paymentId = null;

      // Check if order has payments array
      if (order && order.payments && order.payments.length > 0) {
        paymentId = order.payments[0];
        payment = await razorpay.payments.fetch(paymentId);
        console.log('[Razorpay][Mentor][VerifyPayment] Payment found via order.payments', {
          paymentId: payment.id,
          status: payment.status
        });
      } else {
        // Try to fetch payments using payments API
        try {
          const payments = await razorpay.payments.all({
            'order_id': booking.paymentGatewayOrderId
          });
          
          if (payments && payments.items && payments.items.length > 0) {
            payment = payments.items.find(p => 
              p.status === 'captured' || p.status === 'authorized'
            ) || payments.items[0];
            paymentId = payment.id;
          }
        } catch (paymentsApiError) {
          console.error('[Razorpay][Mentor][VerifyPayment] Error fetching payments via API', {
            error: paymentsApiError.message
          });
        }
      }

      // If payment found, verify and update
      if (payment && paymentId) {
        // Check if payment is actually captured/authorized
        const isCaptured = payment.status === 'captured' || 
                          payment.status === 'authorized' || 
                          payment.captured === true ||
                          (payment.amount_captured && payment.amount_captured > 0);
        
        console.log('[Razorpay][Mentor][VerifyPayment] Payment status check', {
          paymentId: payment.id,
          status: payment.status,
          captured: payment.captured,
          isCaptured: isCaptured
        });
        
        if (isCaptured) {
          // Payment is successful, update booking
          booking.paymentMethod = 'razorpay';
          booking.paymentStatus = 'completed';
          booking.transactionId = payment.id;
          booking.paymentGateway = 'razorpay';
          booking.paidAt = new Date();
          await booking.save();

          console.log('[Razorpay][Mentor][VerifyPayment] Payment verified and updated', {
            bookingId: booking._id.toString(),
            paymentId: payment.id,
            status: payment.status
          });

          return res.status(200).json({
            success: true,
            message: 'Payment verified and updated successfully',
            data: { booking }
          });
        } else {
          // Payment exists but not captured
          const statusMessage = payment.status === 'created' 
            ? 'Payment was initiated but not completed. Please complete the payment in Razorpay checkout.'
            : payment.status === 'failed'
            ? 'Payment failed. Please try again with a different payment method.'
            : `Payment status: ${payment.status}. Payment not yet completed.`;
          
          return res.status(200).json({
            success: false,
            message: statusMessage,
            data: { 
              paymentStatus: payment.status || 'unknown',
              paymentId: payment.id,
              bookingStatus: booking.paymentStatus,
              orderStatus: order.status
            }
          });
        }
      } else {
        // No payment found - check order status
        const orderStatus = order.status || 'unknown';
        const orderAmountPaid = order.amount_paid || 0;
        const orderAmount = order.amount || 0;
        
        if (orderStatus === 'paid' || orderAmountPaid >= orderAmount) {
          return res.status(200).json({
            success: false,
            message: 'Order shows as paid but payment details not yet available. Please try again in a few seconds.',
            data: { 
              orderStatus,
              bookingStatus: booking.paymentStatus
            }
          });
        }

        return res.status(200).json({
          success: false,
          message: 'No payment found for this order. Payment may not have been completed.',
          data: { 
            orderStatus,
            bookingStatus: booking.paymentStatus
          }
        });
      }
    } catch (razorpayError) {
      console.error('[Razorpay][Mentor][VerifyPayment] Razorpay API error', {
        error: razorpayError.message,
        orderId: booking.paymentGatewayOrderId
      });
      return res.status(500).json({
        success: false,
        message: 'Failed to verify payment with Razorpay',
        error: process.env.NODE_ENV === 'development' ? razorpayError.message : undefined
      });
    }
  } catch (error) {
    console.error('[Razorpay][Mentor][VerifyPayment] Error', {
      message: error.message,
      stack: error.stack,
      bookingId: req.params.id,
      userId: req.user?.id || req.user?._id
    });
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Handle Razorpay payment callback (for payment links)
// @route   GET /api/mentors/bookings/:id/payment-callback
// @access  Public (called by Razorpay)
const handlePaymentCallback = async (req, res) => {
  try {
    const { id } = req.params;
    const { razorpay_payment_link_id, razorpay_payment_id, razorpay_payment_link_status, razorpay_payment_link_reference_id } = req.query;
    
    console.log('[Razorpay][Mentor][PaymentCallback] Callback received', {
      bookingId: id,
      paymentLinkId: razorpay_payment_link_id,
      paymentId: razorpay_payment_id,
      status: razorpay_payment_link_status,
      referenceId: razorpay_payment_link_reference_id
    });

    const booking = await MentorBooking.findById(id);
    if (!booking) {
      console.error('[Razorpay][Mentor][PaymentCallback] Booking not found', { bookingId: id });
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/mentors/booking/${id}?payment=error&message=Booking not found`);
    }

    // Validate Razorpay configuration
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('[Razorpay][Mentor][PaymentCallback] Razorpay keys not configured');
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/mentors/booking/${id}?payment=error&message=Payment gateway not configured`);
    }

    let razorpay;
    try {
      const { getRazorpayClient } = require('../services/razorpay');
      razorpay = getRazorpayClient();
    } catch (razorpayError) {
      console.error('[Razorpay][Mentor][PaymentCallback] Razorpay client initialization error', razorpayError);
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/mentors/booking/${id}?payment=error&message=Payment gateway error`);
    }

    // Fetch payment link details from Razorpay
    let paymentLink;
    try {
      const paymentLinkId = razorpay_payment_link_id || booking.paymentGatewayOrderId;
      if (!paymentLinkId) {
        throw new Error('Payment link ID not found');
      }
      paymentLink = await razorpay.paymentLink.fetch(paymentLinkId);
    } catch (linkError) {
      console.error('[Razorpay][Mentor][PaymentCallback] Error fetching payment link', {
        error: linkError.message,
        paymentLinkId: razorpay_payment_link_id || booking.paymentGatewayOrderId
      });
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/mentors/booking/${id}?payment=error&message=Failed to verify payment`);
    }

    // Check payment link status
    if (paymentLink.status === 'paid' || paymentLink.status === 'partially_paid') {
      // Fetch payment details
      let payment;
      try {
        if (razorpay_payment_id) {
          payment = await razorpay.payments.fetch(razorpay_payment_id);
        } else if (paymentLink.payments && paymentLink.payments.length > 0) {
          payment = await razorpay.payments.fetch(paymentLink.payments[0]);
        }
      } catch (paymentError) {
        console.error('[Razorpay][Mentor][PaymentCallback] Error fetching payment', paymentError);
      }

      // Update booking
      booking.paymentMethod = 'razorpay';
      booking.paymentStatus = 'completed';
      booking.transactionId = payment?.id || razorpay_payment_id || paymentLink.id;
      booking.paymentGateway = 'razorpay';
      booking.paidAt = new Date();
      await booking.save();

      console.log('[Razorpay][Mentor][PaymentCallback] Payment successful', {
        bookingId: booking._id.toString(),
        paymentId: booking.transactionId,
        status: paymentLink.status
      });

      // Detect if request is from WebView
      const userAgent = req.headers['user-agent'] || '';
      const isWebView = /wv|WebView|flutter|Android.*wv|iPhone.*wv/i.test(userAgent);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const bookingUrl = `${frontendUrl}/mentors/booking/${id}?payment=success`;

      if (isWebView) {
        // For WebView: Try HTTP 302 redirect first (most reliable)
        // If that doesn't work, fallback to HTML redirect
        // Use HTTP redirect as primary method
        return res.redirect(302, bookingUrl);
        
        // Fallback HTML (if redirect doesn't work, uncomment below and comment above)
        /*
        return res.send(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="refresh" content="0;url=${bookingUrl}">
            <title>Payment Successful</title>
            <style>
              body {
                font-family: system-ui, -apple-system, sans-serif;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-align: center;
                padding: 20px;
              }
              .container {
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border-radius: 20px;
                padding: 40px;
                max-width: 400px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
              }
              .success-icon {
                font-size: 64px;
                margin-bottom: 20px;
              }
              h1 {
                margin: 0 0 10px 0;
                font-size: 24px;
              }
              p {
                margin: 10px 0;
                opacity: 0.9;
              }
            </style>
            <script>
              (function() {
                var bookingUrl = '${bookingUrl}';
                var bookingId = '${id}';
                var paymentId = '${booking.transactionId}';
                
                // IMMEDIATE REDIRECT - Execute first, before anything else
                // Try multiple redirect methods simultaneously
                
                // Method 1: window.top.location (for WebView iframes)
                try {
                  if (window.top && window.top !== window) {
                    window.top.location.href = bookingUrl;
                  }
                } catch (e) {
                  // Cross-origin error, continue with other methods
                }
                
                // Method 2: window.location.href (standard redirect)
                try {
                  window.location.href = bookingUrl;
                } catch (e) {
                  // Fallback
                }
                
                // Method 3: window.location.replace (no history)
                try {
                  window.location.replace(bookingUrl);
                } catch (e) {
                  // Fallback
                }
                
                // Method 4: Flutter bridge (CRITICAL - Tell Flutter to navigate)
                if (window.FlutterPaymentBridge && typeof window.FlutterPaymentBridge.paymentCallback === 'function') {
                  try {
                    window.FlutterPaymentBridge.paymentCallback({
                      bookingId: bookingId,
                      status: 'success',
                      paymentId: paymentId,
                      redirectUrl: bookingUrl // Tell Flutter the URL to navigate to
                    });
                    // Don't try other redirects if Flutter bridge is available
                    return;
                  } catch (e) {
                    console.error('Flutter bridge error:', e);
                  }
                }
                
                // Also try JavaScript channel
                if (window.PaymentHandler && typeof window.PaymentHandler.postMessage === 'function') {
                  try {
                    window.PaymentHandler.postMessage(JSON.stringify({
                      type: 'paymentCallback',
                      bookingId: bookingId,
                      status: 'success',
                      paymentId: paymentId,
                      redirectUrl: bookingUrl
                    }));
                  } catch (e) {
                    console.error('PaymentHandler error:', e);
                  }
                }
                
                // Method 5: postMessage to parent (non-blocking)
                if (window.parent !== window) {
                  try {
                    window.parent.postMessage({
                      type: 'paymentCallback',
                      bookingId: bookingId,
                      status: 'success',
                      paymentId: paymentId
                    }, '*');
                  } catch (e) {
                    console.error('PostMessage error:', e);
                  }
                }
                
                // Method 6: Deep link (non-blocking)
                try {
                  var deepLink = 'createbharat://payment-callback?bookingId=' + bookingId + '&status=success&paymentId=' + paymentId;
                  // Try deep link but don't block redirect
                  setTimeout(function() {
                    try {
                      window.location.href = deepLink;
                    } catch (e) {
                      // If deep link fails, ensure web redirect
                      window.location.href = bookingUrl;
                    }
                  }, 100);
                } catch (e) {
                  // Ignore deep link errors
                }
                
                // Force redirect after page load (final fallback)
                window.addEventListener('load', function() {
                  setTimeout(function() {
                    window.location.href = bookingUrl;
                  }, 100);
                });
                
                // Also try on DOMContentLoaded
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', function() {
                    window.location.href = bookingUrl;
                  });
                } else {
                  // Already loaded, redirect immediately
                  window.location.href = bookingUrl;
                }
              })();
            </script>
          </head>
          <body onload="window.location.href='${bookingUrl}'">
            <div class="container">
              <div class="success-icon">✓</div>
              <h1>Payment Successful!</h1>
              <p>Your booking has been confirmed.</p>
              <p>Redirecting to booking confirmation...</p>
              <p style="font-size: 12px; opacity: 0.7; margin-top: 20px;">If you are not redirected automatically, <a href="${bookingUrl}" style="color: white; text-decoration: underline; font-weight: bold;">click here to view your booking</a></p>
              <noscript>
                <meta http-equiv="refresh" content="0;url=${bookingUrl}">
                <p><a href="${bookingUrl}" style="color: white; text-decoration: underline; font-weight: bold;">Click here to continue</a></p>
              </noscript>
            </div>
            <script>
              // Additional immediate redirect attempts
              (function() {
                var url = '${bookingUrl}';
                
                // Immediate redirect
                window.location.href = url;
                
                // Multiple fallback attempts
                setTimeout(function() { window.location.replace(url); }, 10);
                setTimeout(function() { window.location.href = url; }, 50);
                setTimeout(function() { window.location.href = url; }, 100);
                setTimeout(function() { window.location.href = url; }, 200);
                setTimeout(function() { window.location.href = url; }, 500);
                
                // On page visibility change
                document.addEventListener('visibilitychange', function() {
                  if (document.visibilityState === 'visible') {
                    window.location.href = url;
                  }
                });
              })();
            </script>
          </body>
          </html>
        `);
        */
      } else {
        // For browser: Standard redirect
        return res.redirect(302, bookingUrl);
      }
    } else {
      // Payment failed or cancelled
      console.log('[Razorpay][Mentor][PaymentCallback] Payment not completed', {
        bookingId: booking._id.toString(),
        status: paymentLink.status
      });
      
      // Update booking status to reflect payment failure
      // Keep payment status as pending (not failed) so user can retry
      // Only update if payment was actually attempted
      if (paymentLink.status === 'cancelled' || paymentLink.status === 'expired') {
        // Payment was cancelled or expired - keep as pending for retry
        booking.paymentStatus = 'pending';
      } else {
        // Payment failed - keep as pending but log the failure
        booking.paymentStatus = 'pending';
      }
      await booking.save();
      
      const userAgent = req.headers['user-agent'] || '';
      const isWebView = /wv|WebView|flutter|Android.*wv|iPhone.*wv/i.test(userAgent);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const failureMessage = paymentLink.status === 'cancelled' 
        ? 'Payment was cancelled' 
        : paymentLink.status === 'expired'
        ? 'Payment link expired'
        : 'Payment not completed. Please try again.';
      const bookingUrl = `${frontendUrl}/mentors/booking/${id}?payment=failed&message=${encodeURIComponent(failureMessage)}`;
      
      if (isWebView) {
        // For WebView: Use HTTP 302 redirect (most reliable)
        return res.redirect(302, bookingUrl);
        
        // Fallback HTML (if redirect doesn't work)
        /*
        return res.send(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Payment Failed</title>
            <style>
              body {
                font-family: system-ui, -apple-system, sans-serif;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                color: white;
                text-align: center;
                padding: 20px;
              }
              .container {
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border-radius: 20px;
                padding: 40px;
                max-width: 400px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
              }
            </style>
            <script>
              // Method 1: Try Flutter bridge
              if (window.FlutterPaymentBridge && typeof window.FlutterPaymentBridge.paymentCallback === 'function') {
                window.FlutterPaymentBridge.paymentCallback({
                  bookingId: '${id}',
                  status: 'failed',
                  message: '${failureMessage.replace(/'/g, "\\'")}'
                });
              }
              
              // Method 2: Try postMessage to parent
              if (window.parent !== window) {
                window.parent.postMessage({
                  type: 'paymentCallback',
                  bookingId: '${id}',
                  status: 'failed',
                  message: '${failureMessage.replace(/'/g, "\\'")}'
                }, '*');
              }
              
              // Method 3: Try deep link
              try {
                window.location.href = 'createbharat://payment-callback?bookingId=${id}&status=failed&message=${encodeURIComponent(failureMessage)}';
                setTimeout(() => {
                  // Fallback to web URL if deep link doesn't work
                  window.location.href = '${bookingUrl}';
                }, 1000);
              } catch (e) {
                // Fallback to web URL
                window.location.href = '${bookingUrl}';
              }
              
              // Method 4: Standard redirect (fallback)
              setTimeout(() => {
                window.location.href = '${bookingUrl}';
              }, 2000);
            </script>
          </head>
          <body>
            <div class="container">
              <div style="font-size: 64px; margin-bottom: 20px;">✗</div>
              <h1>Booking Failed</h1>
              <p>${failureMessage}</p>
              <p>Please try again to complete your booking.</p>
              <p>Redirecting...</p>
            </div>
          </body>
          </html>
        `);
        */
      } else {
        return res.redirect(302, bookingUrl);
      }
    }
  } catch (error) {
    console.error('[Razorpay][Mentor][PaymentCallback] Error', {
      message: error.message,
      stack: error.stack,
      bookingId: req.params.id
    });
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    return res.redirect(`${frontendUrl}/mentors/booking/${req.params.id}?payment=error&message=Server error`);
  }
};

// @desc    Get list of mentor specializations
// @route   GET /api/mentors/specializations
// @access  Public
const getSpecializations = (req, res) => {
  res.status(200).json({
    success: true,
    count: mentorSpecializations.length,
    data: mentorSpecializations
  });
};

module.exports = {
  registerMentor,
  loginMentor,
  getMe,
  updateProfile,
  changePassword,
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
  createRazorpayOrder,
  getSpecializations,
  verifyAndUpdatePayment,
  createRazorpayPaymentLink,
  handlePaymentCallback
};

