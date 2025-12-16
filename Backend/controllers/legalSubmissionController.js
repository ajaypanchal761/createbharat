const LegalSubmission = require('../models/legalSubmission');
const LegalService = require('../models/legalService');
const { validationResult } = require('express-validator');
const { uploadToGridFS, getFromGridFS, getFileMetadata } = require('../utils/gridfs');
const { getRazorpayClient } = require('../services/razorpay');
const crypto = require('crypto');
const { createNotification } = require('./notificationController');
const Admin = require('../models/admin');

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
          // Upload to GridFS
          const filename = `legal-submission-${Date.now()}-${Math.random().toString(36).substring(7)}-${file.originalname}`;
          const uploadResult = await uploadToGridFS(
            file.path,
            filename,
            'legal-documents',
            file.mimetype || 'application/pdf'
          );

          // Extract field name from filename or use original name
          const fieldName = file.fieldname || file.originalname;

          documents.push({
            fieldName: fieldName,
            fileName: file.originalname,
            fileId: uploadResult.fileId,
            fileType: file.mimetype || 'application/pdf',
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

    // Create notification for all admins
    try {
      const admins = await Admin.find({ isActive: true }).select('_id');
      const user = submission.user;
      const userName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email : 'A user';
      const notificationPromises = admins.map(admin => 
        createNotification(
          admin._id,
          'legal_submission',
          'New Legal Service Submission',
          `${userName} has submitted a new legal service request: ${service.name}`,
          `/admin/legal/submissions`,
          {
            submissionId: submission._id.toString(),
            serviceName: service.name,
            userName: userName
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
    console.log('[Razorpay][Legal][CreateOrder] Request received', {
      submissionId: req.params.id,
      userId: req.user?.id || req.user?._id,
      timestamp: new Date().toISOString()
    });
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
    
    console.log('[Razorpay][Legal][CreateOrder] Preparing Razorpay options', {
      paymentAmount: submission.paymentAmount,
      amountInPaise,
      receipt: shortenedReceipt
    });

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

    console.log('[Razorpay][Legal][CreateOrder] Responding with order', {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency || 'INR'
    });

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
    console.error('[Razorpay][Legal][CreateOrder] Error', {
      message: error.message,
      stack: error.stack,
      submissionId: req.params.id,
      userId: req.user?.id || req.user?._id
    });
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
    console.log('[Razorpay][Legal][UpdatePayment] Request received', {
      submissionId: req.params.id,
      userId: req.user?.id || req.user?._id,
      paymentMethod: req.body?.paymentMethod,
      hasOrderId: !!req.body?.razorpay_order_id,
      hasPaymentId: !!req.body?.razorpay_payment_id,
      timestamp: new Date().toISOString()
    });
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

    console.log('[Razorpay][Legal][UpdatePayment] Payment captured', {
      submissionId: submission._id.toString(),
      paymentStatus: submission.paymentStatus,
      transactionId: submission.transactionId,
      paidAt: submission.paidAt
    });

    res.status(200).json({
      success: true,
      message: 'Payment updated successfully',
      data: { submission }
    });

  } catch (error) {
    console.error('[Razorpay][Legal][UpdatePayment] Error', {
      message: error.message,
      stack: error.stack,
      submissionId: req.params.id,
      userId: req.user?.id || req.user?._id
    });
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

// @desc    Download legal document from GridFS
// @route   GET /api/legal/documents/:fileId/download
// @access  Private (User or CA)
const downloadDocument = async (req, res) => {
  try {
    const { fileId } = req.params;

    if (!fileId) {
      return res.status(400).json({
        success: false,
        message: 'File ID is required'
      });
    }

    // Get file from GridFS
    const fileBuffer = await getFromGridFS(fileId, 'legal-documents');
    const fileMetadata = await getFileMetadata(fileId, 'legal-documents');

    // Set headers for file download
    res.setHeader('Content-Type', fileMetadata.contentType || 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileMetadata.filename || 'document.pdf'}"`);
    res.setHeader('Content-Length', fileMetadata.length || fileBuffer.length);

    // Send file buffer
    res.send(fileBuffer);

  } catch (error) {
    console.error('Download document error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download document',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Create Razorpay payment link for submission (WebView support)
// @route   POST /api/legal/submissions/:id/create-payment-link
// @access  Private/User
const createRazorpayPaymentLink = async (req, res) => {
  try {
    console.log('[Razorpay][Legal][CreatePaymentLink] Request received', {
      submissionId: req.params.id,
      userId: req.user?.id || req.user?._id,
      timestamp: new Date().toISOString()
    });

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
    const submissionUserId = submission.user._id ? submission.user._id.toString() : submission.user.toString();
    const requestUserId = req.user.id || req.user._id?.toString() || req.user.toString();
    
    if (submissionUserId !== requestUserId) {
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

    if (!submission.paymentAmount || submission.paymentAmount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid payment amount' 
      });
    }

    // Validate Razorpay configuration
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('[Razorpay][Legal][CreatePaymentLink] Razorpay keys not configured');
      return res.status(500).json({ 
        success: false, 
        message: 'Payment gateway not configured. Please contact support.' 
      });
    }

    let razorpay;
    try {
      razorpay = getRazorpayClient();
    } catch (razorpayError) {
      console.error('[Razorpay][Legal][CreatePaymentLink] Razorpay client initialization error', razorpayError);
      return res.status(500).json({ 
        success: false, 
        message: 'Payment gateway initialization failed. Please contact support.',
        error: process.env.NODE_ENV === 'development' ? razorpayError.message : undefined
      });
    }

    // Get base URLs
    const backendUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    
    // Create callback URL
    const callbackUrl = `${backendUrl}/api/legal/submissions/${submission._id}/payment-callback`;
    
    // Get user details for prefill
    const user = submission.user;
    const userName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '';
    
    // Detect if request is from WebView
    const userAgent = req.headers['user-agent'] || '';
    const isWebViewRequest = /wv|WebView|flutter|Android.*wv|iPhone.*wv/i.test(userAgent);
    
    const paymentLinkOptions = {
      amount: Math.round(submission.paymentAmount * 100), // Convert to paise
      currency: 'INR',
      description: `Legal Service - ${submission.serviceName || 'Legal Service'}`,
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
        submissionId: submission._id.toString(),
        userId: req.user.id,
        serviceName: submission.serviceName || 'Legal Service',
        type: 'legal_submission',
        isWebView: isWebViewRequest ? 'true' : 'false'
      }
    };
    
    console.log('[Razorpay][Legal][CreatePaymentLink] Creating payment link', {
      amount: paymentLinkOptions.amount,
      currency: paymentLinkOptions.currency,
      callbackUrl
    });

    let paymentLink;
    try {
      paymentLink = await razorpay.paymentLink.create(paymentLinkOptions);
      
      if (!paymentLink || !paymentLink.id || !paymentLink.short_url) {
        throw new Error('Invalid payment link response from Razorpay');
      }
      
      console.log('[Razorpay][Legal][CreatePaymentLink] Payment link created successfully', {
        paymentLinkId: paymentLink.id,
        shortUrl: paymentLink.short_url,
        status: paymentLink.status
      });
    } catch (razorpayApiError) {
      console.error('[Razorpay][Legal][CreatePaymentLink] Razorpay API error', {
        error: razorpayApiError.message,
        submissionId: req.params.id
      });
      return res.status(500).json({
        success: false,
        message: 'Failed to create payment link',
        error: process.env.NODE_ENV === 'development' ? razorpayApiError.message : undefined
      });
    }

    // Update submission with payment link ID
    submission.paymentGatewayOrderId = paymentLink.id;
    await submission.save();

    res.status(200).json({
      success: true,
      message: 'Payment link created successfully',
      data: {
        paymentUrl: paymentLink.short_url,
        paymentLinkId: paymentLink.id
      }
    });

  } catch (error) {
    console.error('[Razorpay][Legal][CreatePaymentLink] Error', {
      message: error.message,
      stack: error.stack,
      submissionId: req.params.id,
      userId: req.user?.id || req.user?._id
    });
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Handle Razorpay payment callback (payment link)
// @route   GET /api/legal/submissions/:id/payment-callback
// @access  Public (called by Razorpay)
const handlePaymentCallback = async (req, res) => {
  try {
    const { id } = req.params;
    const { razorpay_payment_id, razorpay_payment_link_id, razorpay_payment_link_status, razorpay_signature } = req.query;

    console.log('[Razorpay][Legal][PaymentCallback] Callback received', {
      submissionId: id,
      paymentLinkId: razorpay_payment_link_id,
      paymentId: razorpay_payment_id,
      status: razorpay_payment_link_status,
      referenceId: req.query.razorpay_payment_link_reference_id || ''
    });

    const submission = await LegalSubmission.findById(id)
      .populate('user', 'firstName lastName email phone')
      .populate('service', 'name');

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    // Get Razorpay client
    let razorpay;
    try {
      razorpay = getRazorpayClient();
    } catch (razorpayError) {
      console.error('[Razorpay][Legal][PaymentCallback] Razorpay client error', razorpayError);
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/legal?payment=error&message=Payment gateway error`);
    }

    // Fetch payment link details from Razorpay
    let paymentLink;
    try {
      const paymentLinkId = razorpay_payment_link_id || submission.paymentGatewayOrderId;
      if (!paymentLinkId) {
        throw new Error('Payment link ID not found');
      }
      paymentLink = await razorpay.paymentLink.fetch(paymentLinkId);
    } catch (linkError) {
      console.error('[Razorpay][Legal][PaymentCallback] Error fetching payment link', {
        error: linkError.message,
        paymentLinkId: razorpay_payment_link_id || submission.paymentGatewayOrderId
      });
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/legal?payment=error&message=Failed to verify payment`);
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
        console.error('[Razorpay][Legal][PaymentCallback] Error fetching payment', paymentError);
      }

      // Update submission
      submission.paymentMethod = 'razorpay';
      submission.paymentStatus = 'completed';
      submission.transactionId = payment?.id || razorpay_payment_id || paymentLink.id;
      submission.razorpayOrderId = submission.razorpayOrderId || paymentLink.id;
      submission.razorpayPaymentId = razorpay_payment_id;
      submission.paymentGateway = 'razorpay';
      submission.paidAt = new Date();
      await submission.save();

      console.log('[Razorpay][Legal][PaymentCallback] Payment successful', {
        submissionId: submission._id.toString(),
        paymentId: submission.transactionId,
        status: paymentLink.status
      });

      // Detect if request is from WebView
      const userAgent = req.headers['user-agent'] || '';
      const isWebView = /wv|WebView|flutter|Android.*wv|iPhone.*wv/i.test(userAgent);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const submissionUrl = `${frontendUrl}/legal?payment=success&submissionId=${id}`;

      if (isWebView) {
        // For WebView: Use HTTP 302 redirect (most reliable)
        return res.redirect(302, submissionUrl);
      } else {
        // For browser: Standard redirect
        return res.redirect(302, submissionUrl);
      }
    } else {
      // Payment failed or cancelled
      console.log('[Razorpay][Legal][PaymentCallback] Payment not completed', {
        submissionId: submission._id.toString(),
        status: paymentLink.status
      });
      
      // Keep payment status as pending (not failed) so user can retry
      submission.paymentStatus = 'pending';
      await submission.save();
      
      const userAgent = req.headers['user-agent'] || '';
      const isWebView = /wv|WebView|flutter|Android.*wv|iPhone.*wv/i.test(userAgent);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const failureMessage = paymentLink.status === 'cancelled' 
        ? 'Payment was cancelled' 
        : paymentLink.status === 'expired'
        ? 'Payment link expired'
        : 'Payment not completed. Please try again.';
      const submissionUrl = `${frontendUrl}/legal?payment=failed&message=${encodeURIComponent(failureMessage)}&submissionId=${id}`;
      
      if (isWebView) {
        // For WebView: Use HTTP 302 redirect
        return res.redirect(302, submissionUrl);
      } else {
        return res.redirect(302, submissionUrl);
      }
    }
  } catch (error) {
    console.error('[Razorpay][Legal][PaymentCallback] Error', {
      message: error.message,
      stack: error.stack,
      submissionId: req.params.id
    });
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    return res.redirect(`${frontendUrl}/legal?payment=error&message=Server error`);
  }
};

module.exports = {
  createSubmission,
  createRazorpayOrder,
  createRazorpayPaymentLink,
  handlePaymentCallback,
  updatePayment,
  getUserSubmissions,
  getSubmissionById,
  getCASubmissions,
  getCASubmissionById,
  updateSubmissionStatus,
  getAdminPaymentHistory,
  downloadDocument
};

