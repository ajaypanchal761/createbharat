const LegalSubmission = require('../models/legalSubmission');
const LegalService = require('../models/legalService');
const { validationResult } = require('express-validator');
const { uploadResumeToCloudinary } = require('../utils/cloudinary');
const { getRazorpayClient } = require('../services/razorpay');
const crypto = require('crypto');

// @desc    Create legal service submission with documents
// @route   POST /api/legal/submissions
// @access  Private/User
const createSubmission = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { serviceId, category } = req.body;

    // Get service
    const service = await LegalService.findById(serviceId);
    if (!service || !service.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Service not found or inactive'
      });
    }

    // Extract price number from string (e.g., "₹15,000" -> 15000)
    const priceString = service.price.replace(/[₹,]/g, '');
    const priceAmount = parseInt(priceString) || 0;

    // Process uploaded documents
    const documents = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          // Upload to Cloudinary
          const uploadResult = await uploadResumeToCloudinary(
            file.path,
            'legal-documents',
            `legal-submission-${Date.now()}-${Math.random().toString(36).substring(7)}`
          );

          // Extract field name from filename or use original name
          const fieldName = file.fieldname || file.originalname;

          documents.push({
            fieldName: fieldName,
            fileName: file.originalname,
            fileUrl: uploadResult.url,
            fileType: file.mimetype,
            fileSize: file.size,
            uploadedAt: new Date()
          });
        } catch (uploadError) {
          console.error('Error uploading document:', uploadError);
          // Continue with other files even if one fails
        }
      }
    }

    // Create submission
    const submission = await LegalSubmission.create({
      service: serviceId,
      user: req.user.id,
      serviceName: service.name,
      servicePrice: service.price,
      category: category || '',
      documents: documents,
      paymentAmount: priceAmount,
      status: 'pending',
      paymentStatus: 'pending'
    });

    // Update service total submissions count
    await LegalService.findByIdAndUpdate(serviceId, {
      $inc: { totalSubmissions: 1 }
    });

    // Populate user and service for response
    await submission.populate('user', 'firstName lastName email phone');
    await submission.populate('service', 'name icon category');

    res.status(201).json({
      success: true,
      message: 'Submission created successfully',
      data: { submission }
    });

  } catch (error) {
    console.error('Create submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Create Razorpay order for submission payment
// @route   POST /api/legal/submissions/:id/create-order
// @access  Private/User
const createRazorpayOrder = async (req, res) => {
  try {
    const submission = await LegalSubmission.findById(req.params.id)
      .populate('user', 'firstName lastName email phone')
      .populate('service', 'name');

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    // Check if user is populated
    if (!submission.user || !submission.user._id) {
      console.error('Submission user not populated:', submission.user);
      return res.status(500).json({
        success: false,
        message: 'Submission user data is missing'
      });
    }

    // Check if submission belongs to user - handle both populated and reference formats
    const submissionUserId = submission.user._id ? submission.user._id.toString() : submission.user.toString();
    const requestUserId = req.user.id || req.user._id?.toString() || req.user.toString();
    
    if (submissionUserId !== requestUserId) {
      console.error('User mismatch:', {
        submissionUserId,
        requestUserId,
        submissionUser: submission.user,
        reqUser: req.user
      });
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this submission'
      });
    }

    // Check if payment is already completed
    if (submission.paymentStatus === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Payment already completed'
      });
    }

    // Validate payment amount
    if (!submission.paymentAmount || submission.paymentAmount <= 0) {
      console.error('Invalid payment amount:', submission.paymentAmount);
      return res.status(400).json({
        success: false,
        message: 'Invalid payment amount. Please contact support.'
      });
    }

    // Get Razorpay client
    let razorpay;
    try {
      razorpay = getRazorpayClient();
    } catch (razorpayError) {
      console.error('Razorpay client initialization error:', razorpayError);
      return res.status(500).json({
        success: false,
        message: 'Payment gateway configuration error',
        error: process.env.NODE_ENV === 'development' ? razorpayError.message : undefined
      });
    }

    // Create order
    const amountInPaise = Math.round(submission.paymentAmount * 100); // Convert to paise and round
    
    if (!amountInPaise || amountInPaise <= 0) {
      console.error('Invalid amount calculation:', {
        paymentAmount: submission.paymentAmount,
        amountInPaise
      });
      return res.status(400).json({
        success: false,
        message: 'Invalid payment amount calculation'
      });
    }

    // Generate receipt - Razorpay requires max 40 characters
    // Format: LS-{last_chars_of_id} where LS = Legal Submission
    // MongoDB IDs are 24 chars, so "LS-" (3) + 24 = 27 chars total (well under 40 limit)
    const submissionIdStr = submission._id.toString();
    const maxReceiptLength = 40;
    const prefix = 'LS-'; // 3 characters
    const maxIdLength = maxReceiptLength - prefix.length; // 37 characters available for ID
    const shortenedReceipt = `${prefix}${submissionIdStr.slice(-maxIdLength)}`;
    
    // Ensure receipt doesn't exceed 40 characters
    if (shortenedReceipt.length > maxReceiptLength) {
      throw new Error(`Receipt length exceeds Razorpay limit: ${shortenedReceipt.length} > ${maxReceiptLength}`);
    }
    
    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: shortenedReceipt, // Max 40 characters required by Razorpay
      notes: {
        submissionId: submission._id.toString(),
        serviceName: submission.serviceName || 'Legal Service',
        userId: requestUserId
      }
    };

    console.log('Creating Razorpay order with options:', {
      ...options,
      notes: options.notes, // Log notes separately
      receiptLength: shortenedReceipt.length
    });

    let order;
    try {
      order = await razorpay.orders.create(options);
      console.log('Razorpay order created successfully:', order.id);
    } catch (razorpayApiError) {
      console.error('Razorpay API error:', razorpayApiError);
      return res.status(500).json({
        success: false,
        message: 'Failed to create payment order',
        error: process.env.NODE_ENV === 'development' ? razorpayApiError.message : undefined
      });
    }

    // Update submission with razorpay order ID
    submission.razorpayOrderId = order.id;
    await submission.save();

    res.status(200).json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency || 'INR',
        keyId: process.env.RAZORPAY_KEY_ID
      }
    });

  } catch (error) {
    console.error('Create Razorpay order error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Verify and update payment
// @route   PUT /api/legal/submissions/:id/payment
// @access  Private/User
const updatePayment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { paymentMethod, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const submission = await LegalSubmission.findById(req.params.id)
      .populate('user', 'firstName lastName email phone')
      .populate('service', 'name');

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    // Check if submission belongs to user
    if (submission.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this submission'
      });
    }

    // Verify Razorpay signature
    if (razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      const razorpay = getRazorpayClient();
      const text = `${razorpay_order_id}|${razorpay_payment_id}`;
      const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(text)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        return res.status(400).json({
          success: false,
          message: 'Invalid payment signature'
        });
      }
    }

    // Update submission payment info
    submission.paymentMethod = paymentMethod || 'razorpay';
    submission.paymentStatus = 'completed';
    submission.transactionId = razorpay_payment_id || `txn_${Date.now()}`;
    submission.razorpayOrderId = razorpay_order_id || submission.razorpayOrderId;
    submission.razorpayPaymentId = razorpay_payment_id;
    submission.razorpaySignature = razorpay_signature;
    submission.paidAt = new Date();
    submission.status = 'pending'; // Keep status as pending until CA reviews

    await submission.save();

    res.status(200).json({
      success: true,
      message: 'Payment updated successfully',
      data: { submission }
    });

  } catch (error) {
    console.error('Update payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get user's submissions
// @route   GET /api/legal/submissions
// @access  Private/User
const getUserSubmissions = async (req, res) => {
  try {
    // Only show submissions with completed payment (includes refunded ones too)
    const submissions = await LegalSubmission.find({ 
      user: req.user.id,
      paymentStatus: { $in: ['completed', 'refunded'] }
    })
      .populate('service', 'name icon category')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions
    });

  } catch (error) {
    console.error('Get user submissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get submission by ID
// @route   GET /api/legal/submissions/:id
// @access  Private/User
const getSubmissionById = async (req, res) => {
  try {
    const submission = await LegalSubmission.findById(req.params.id)
      .populate('user', 'firstName lastName email phone')
      .populate('service', 'name icon category description price duration');

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    // Check if submission belongs to user
    if (submission.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this submission'
      });
    }

    res.status(200).json({
      success: true,
      data: { submission }
    });

  } catch (error) {
    console.error('Get submission by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get all submissions (for CA)
// @route   GET /api/ca/submissions
// @access  Private/CA
const getCASubmissions = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = {};

    // Only show submissions with completed payment
    query.paymentStatus = 'completed';

    // Filter by status if provided
    if (status && ['pending', 'in-progress', 'completed', 'rejected', 'cancelled'].includes(status)) {
      query.status = status;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const submissions = await LegalSubmission.find(query)
      .populate('user', 'firstName lastName email phone profileImage')
      .populate('service', 'name icon category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await LegalSubmission.countDocuments(query);

    // Transform submissions for frontend
    const transformedSubmissions = submissions.map(submission => ({
      id: submission._id,
      userName: submission.user ? `${submission.user.firstName || ''} ${submission.user.lastName || ''}`.trim() || submission.user.email : 'User',
      userEmail: submission.user ? submission.user.email : '',
      userPhone: submission.user ? submission.user.phone : '',
      serviceName: submission.serviceName,
      serviceIcon: submission.service ? submission.service.icon : '⚖️',
      submittedDate: submission.createdAt.toISOString().split('T')[0],
      status: submission.status,
      documents: submission.documents || [],
      paymentStatus: submission.paymentStatus,
      paymentAmount: submission.paymentAmount,
      category: submission.category,
      caNotes: submission.caNotes || '',
      rejectionReason: submission.rejectionReason || ''
    }));

    res.status(200).json({
      success: true,
      count: submissions.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: transformedSubmissions
    });

  } catch (error) {
    console.error('Get CA submissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get submission by ID (for CA)
// @route   GET /api/ca/submissions/:id
// @access  Private/CA
const getCASubmissionById = async (req, res) => {
  try {
    const submission = await LegalSubmission.findById(req.params.id)
      .populate('user', 'firstName lastName email phone profileImage')
      .populate('service', 'name icon category description price duration');

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { submission }
    });

  } catch (error) {
    console.error('Get CA submission by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update submission status (CA)
// @route   PUT /api/ca/submissions/:id/status
// @access  Private/CA
const updateSubmissionStatus = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { status, caNotes, rejectionReason } = req.body;

    const submission = await LegalSubmission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    // Validate status
    const validStatuses = ['pending', 'in-progress', 'completed', 'rejected', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    // Update status
    const oldStatus = submission.status;
    submission.status = status;

    // Set timestamps based on status
    if (status === 'in-progress' && oldStatus === 'pending') {
      submission.processedAt = new Date();
    } else if (status === 'completed' && oldStatus !== 'completed') {
      submission.completedAt = new Date();
    } else if (status === 'rejected') {
      submission.rejectedAt = new Date();
      submission.rejectionReason = rejectionReason || '';
      
      // If payment was completed, initiate refund
      if (submission.paymentStatus === 'completed' && submission.paymentAmount > 0) {
        try {
          const razorpay = getRazorpayClient();
          
          // Create refund via Razorpay
          const refundOptions = {
            payment_id: submission.razorpayPaymentId,
            amount: submission.paymentAmount, // Amount in smallest currency unit (paise for INR)
            speed: 'normal', // 'normal' or 'optimum'
            notes: {
              reason: 'Service rejection - Customer refund',
              submission_id: submission._id.toString(),
              rejection_reason: rejectionReason || 'Service rejected by CA'
            }
          };
          
          console.log('Creating refund for payment:', refundOptions);
          
          const refund = await razorpay.payments.refund(submission.razorpayPaymentId, {
            amount: submission.paymentAmount,
            speed: 'normal',
            notes: refundOptions.notes
          });
          
          console.log('Refund created successfully:', refund.id);
          
          // Update submission with refund details
          submission.paymentStatus = 'refunded';
          submission.refundedAt = new Date();
          submission.refundId = refund.id;
          submission.refundAmount = submission.paymentAmount;
          
        } catch (refundError) {
          console.error('Refund creation error:', refundError);
          // Even if refund fails, update status to rejected
          // Log error for manual processing
          console.error('Failed to process refund automatically. Manual intervention required:', {
            submissionId: submission._id,
            paymentId: submission.razorpayPaymentId,
            amount: submission.paymentAmount,
            error: refundError.message
          });
          // Note: Status will still be rejected, but paymentStatus remains 'completed'
          // Admin/CA can process refund manually later
        }
      }
    }

    // Update CA notes
    if (caNotes !== undefined) {
      submission.caNotes = caNotes;
    }

    await submission.save();

    // Populate for response
    await submission.populate('user', 'firstName lastName email phone');
    await submission.populate('service', 'name icon category');

    res.status(200).json({
      success: true,
      message: 'Submission status updated successfully',
      data: { submission }
    });

  } catch (error) {
    console.error('Update submission status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get payment history for admin (only completed submissions)
// @route   GET /api/admin/legal-payments
// @access  Private/Admin
const getAdminPaymentHistory = async (req, res) => {
  try {
    // Only get submissions with completed status and completed payment
    const submissions = await LegalSubmission.find({
      status: 'completed',
      paymentStatus: 'completed'
    })
      .populate('user', 'firstName lastName email phone profileImage')
      .populate('service', 'name icon category')
      .sort({ createdAt: -1 });

    // Transform submissions for payment history display
    const paymentHistory = submissions.map(submission => {
      const user = submission.user || {};
      const service = submission.service || {};
      
      return {
        id: submission._id,
        userName: user.firstName && user.lastName
          ? `${user.firstName} ${user.lastName}`.trim()
          : user.email || 'User',
        userEmail: user.email || '',
        userPhone: user.phone || '',
        serviceName: submission.serviceName || service.name || 'Legal Service',
        serviceIcon: service.icon || '⚖️',
        serviceCategory: service.category || submission.category || '',
        paymentAmount: submission.paymentAmount || 0,
        paymentMethod: submission.paymentMethod || 'razorpay',
        transactionId: submission.transactionId || submission.razorpayPaymentId || '',
        razorpayOrderId: submission.razorpayOrderId || '',
        razorpayPaymentId: submission.razorpayPaymentId || '',
        paidAt: submission.paidAt || submission.createdAt,
        completedAt: submission.completedAt || submission.updatedAt,
        submittedAt: submission.createdAt
      };
    });

    // Calculate total revenue
    const totalRevenue = paymentHistory.reduce((sum, payment) => sum + (payment.paymentAmount || 0), 0);

    res.status(200).json({
      success: true,
      count: paymentHistory.length,
      totalRevenue,
      data: paymentHistory
    });

  } catch (error) {
    console.error('Get admin payment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  createSubmission,
  createRazorpayOrder,
  updatePayment,
  getUserSubmissions,
  getSubmissionById,
  getCASubmissions,
  getCASubmissionById,
  updateSubmissionStatus,
  getAdminPaymentHistory
};

