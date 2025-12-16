const LoanApplication = require('../models/loanApplication');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');
const { createNotification } = require('./notificationController');
const Admin = require('../models/admin');

// @desc    Submit loan application (User)
// @route   POST /api/loans/applications
// @access  Public (can be Private if user is logged in)
const submitLoanApplication = async (req, res) => {
  try {
    // Parse FormData fields - multer stores them in req.body
    // Some fields might be strings that need parsing
    let bodyData = req.body;
    
    // If fields are strings (from FormData), parse them
    if (typeof bodyData.currentlyRunningBusiness === 'string') {
      bodyData = { ...bodyData };
    }

    const {
      applicantFullName,
      mobileNumber,
      emailAddress,
      city,
      state,
      currentlyRunningBusiness,
      msmeUdyamNumber,
      businessType,
      businessTypeOther,
      businessName,
      businessRegistrationType,
      loanAmount,
      loanPurpose,
      loanPurposeOther,
      loanType,
      loanTypeOther
    } = bodyData;

    // Validate required fields
    if (!applicantFullName || !mobileNumber || !emailAddress || !city || !state) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields (name, mobile, email, city, state)'
      });
    }

    if (!currentlyRunningBusiness || !businessType || !businessName) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required business information'
      });
    }

    if (!loanAmount || !loanPurpose || !loanType) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required loan information'
      });
    }

    // Handle file upload if present
    let businessDocuments = null;
    if (req.files && req.files.businessDocuments && req.files.businessDocuments[0]) {
      try {
        const file = req.files.businessDocuments[0];
        // Convert buffer to base64 for Cloudinary
        const base64 = file.buffer.toString('base64');
        const dataUri = `data:${file.mimetype};base64,${base64}`;
        
        const uploadResult = await uploadToCloudinary(dataUri, {
          folder: 'loan-applications',
          resource_type: 'auto'
        });

        businessDocuments = {
          url: uploadResult.secure_url,
          fileId: uploadResult.public_id,
          fileName: file.originalname,
          uploadedAt: new Date()
        };
      } catch (uploadError) {
        console.error('File upload error:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload business documents. Please try again.'
        });
      }
    }

    // Get user ID if authenticated
    const userId = req.user?.id || req.user?._id || null;

    // Create loan application
    const loanApplication = await LoanApplication.create({
      user: userId,
      applicantFullName: applicantFullName.trim(),
      mobileNumber: mobileNumber.trim(),
      emailAddress: emailAddress.trim().toLowerCase(),
      city: city.trim(),
      state: state.trim(),
      currentlyRunningBusiness,
      msmeUdyamNumber: msmeUdyamNumber?.trim() || '',
      businessDocuments: businessDocuments || null,
      businessType: businessType.trim(),
      businessTypeOther: businessTypeOther?.trim() || '',
      businessName: businessName.trim(),
      businessRegistrationType: businessRegistrationType?.trim() || '',
      loanAmount: parseFloat(loanAmount),
      loanPurpose: loanPurpose.trim(),
      loanPurposeOther: loanPurposeOther?.trim() || '',
      loanType: loanType.trim(),
      loanTypeOther: loanTypeOther?.trim() || '',
      status: 'pending',
      appliedAt: new Date()
    });

    // If user is logged in, update user's applications
    if (userId) {
      const User = require('../models/user');
      await User.findByIdAndUpdate(userId, {
        $push: {
          'applications.loans': {
            loanId: loanApplication._id,
            status: 'applied',
            appliedAt: new Date()
          }
        }
      });
    }

    // Create notification for all admins
    try {
      const admins = await Admin.find({ isActive: true }).select('_id');
      const notificationPromises = admins.map(admin => 
        createNotification(
          admin._id,
          'loan_application',
          'New Loan Application',
          `${applicantFullName} has submitted a new loan application for ₹${loanAmount.toLocaleString('en-IN')}`,
          `/admin/loans?view=applicants`,
          {
            applicationId: loanApplication._id.toString(),
            applicantName: applicantFullName,
            loanAmount: loanAmount
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
      message: 'Loan application submitted successfully',
      data: { loanApplication }
    });

  } catch (error) {
    console.error('Submit loan application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get all loan applications (Admin)
// @route   GET /api/admin/loans/applications
// @access  Private/Admin
const getAllLoanApplications = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 50 } = req.query;

    // Build query
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { applicantFullName: { $regex: search, $options: 'i' } },
        { emailAddress: { $regex: search, $options: 'i' } },
        { mobileNumber: { $regex: search, $options: 'i' } },
        { businessName: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    // Get loan applications
    const loanApplications = await LoanApplication.find(query)
      .populate('user', 'firstName lastName email mobileNumber')
      .select('-__v')
      .sort({ appliedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await LoanApplication.countDocuments(query);

    res.status(200).json({
      success: true,
      count: loanApplications.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: loanApplications
    });

  } catch (error) {
    console.error('Get all loan applications error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching loan applications',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get single loan application (Admin)
// @route   GET /api/admin/loans/applications/:id
// @access  Private/Admin
const getLoanApplicationById = async (req, res) => {
  try {
    const loanApplication = await LoanApplication.findById(req.params.id)
      .populate('user', 'firstName lastName email phone');

    if (!loanApplication) {
      return res.status(404).json({
        success: false,
        message: 'Loan application not found'
      });
    }

    // Mark as viewed
    if (!loanApplication.viewed) {
      loanApplication.viewed = true;
      loanApplication.viewedAt = new Date();
      await loanApplication.save();
    }

    res.status(200).json({
      success: true,
      data: { loanApplication }
    });

  } catch (error) {
    console.error('Get loan application by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update loan application status (Admin)
// @route   PUT /api/admin/loans/applications/:id/status
// @access  Private/Admin
const updateLoanApplicationStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const validStatuses = ['pending', 'under_review', 'approved', 'rejected', 'disbursed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const loanApplication = await LoanApplication.findById(req.params.id);

    if (!loanApplication) {
      return res.status(404).json({
        success: false,
        message: 'Loan application not found'
      });
    }

    loanApplication.status = status;
    loanApplication.statusUpdatedAt = new Date();
    if (adminNotes) {
      loanApplication.adminNotes = adminNotes.trim();
    }

    await loanApplication.save();

    // Update user's application status if user exists
    if (loanApplication.user) {
      const User = require('../models/user');
      await User.updateOne(
        { 
          _id: loanApplication.user,
          'applications.loans.loanId': loanApplication._id
        },
        {
          $set: {
            'applications.loans.$.status': status === 'approved' ? 'approved' : 
                                          status === 'rejected' ? 'rejected' : 
                                          status === 'disbursed' ? 'disbursed' : 'under_review'
          }
        }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Loan application status updated successfully',
      data: { loanApplication }
    });

  } catch (error) {
    console.error('Update loan application status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete loan application (Admin)
// @route   DELETE /api/admin/loans/applications/:id
// @access  Private/Admin
const deleteLoanApplication = async (req, res) => {
  try {
    const loanApplication = await LoanApplication.findById(req.params.id);

    if (!loanApplication) {
      return res.status(404).json({
        success: false,
        message: 'Loan application not found'
      });
    }

    // Delete business documents from Cloudinary if exists
    if (loanApplication.businessDocuments && loanApplication.businessDocuments.fileId) {
      try {
        await deleteFromCloudinary(loanApplication.businessDocuments.fileId);
      } catch (deleteError) {
        console.error('Error deleting file from Cloudinary:', deleteError);
      }
    }

    await loanApplication.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Loan application deleted successfully'
    });

  } catch (error) {
    console.error('Delete loan application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get loan application statistics (Admin)
// @route   GET /api/admin/loans/applications/stats
// @access  Private/Admin
const getLoanApplicationStats = async (req, res) => {
  try {
    const total = await LoanApplication.countDocuments();
    const pending = await LoanApplication.countDocuments({ status: 'pending' });
    const underReview = await LoanApplication.countDocuments({ status: 'under_review' });
    const approved = await LoanApplication.countDocuments({ status: 'approved' });
    const rejected = await LoanApplication.countDocuments({ status: 'rejected' });
    const disbursed = await LoanApplication.countDocuments({ status: 'disbursed' });

    res.status(200).json({
      success: true,
      data: {
        total,
        pending,
        underReview,
        approved,
        rejected,
        disbursed
      }
    });

  } catch (error) {
    console.error('Get loan application stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  submitLoanApplication,
  getAllLoanApplications,
  getLoanApplicationById,
  updateLoanApplicationStatus,
  deleteLoanApplication,
  getLoanApplicationStats
};

