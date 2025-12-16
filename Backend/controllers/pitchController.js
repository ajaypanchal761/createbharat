const Pitch = require('../models/pitch');
const { uploadToGridFS, getFromGridFS, getFileMetadata } = require('../utils/gridfs');
const { createNotification } = require('./notificationController');
const Admin = require('../models/admin');
const path = require('path');
const fs = require('fs');

// @desc    Submit a new pitch
// @route   POST /api/pitch/submit
// @access  Private
const submitPitch = async (req, res) => {
  try {
    const {
      startupName,
      oneLinePitch,
      category,
      startupStage,
      founderName,
      city,
      state,
      problemStatement,
      solutionDescription
    } = req.body;

    // Validate required fields
    if (!startupName || !oneLinePitch || !category || !startupStage || !founderName || !city || !state || !problemStatement || !solutionDescription) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    // Check if pitch deck file is uploaded
    if (!req.files || !req.files.pitchDeck) {
      return res.status(400).json({
        success: false,
        message: 'Pitch deck (PDF) is required'
      });
    }

    const pitchDeckFile = req.files.pitchDeck[0];
    
    // Validate pitch deck file type
    const allowedPitchDeckTypes = ['application/pdf'];
    if (!allowedPitchDeckTypes.includes(pitchDeckFile.mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'Pitch deck must be a PDF file'
      });
    }

    // Validate file size (max 10MB)
    if (pitchDeckFile.size > 10 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: 'Pitch deck file size must be less than 10MB'
      });
    }

    // Upload pitch deck to GridFS
    const pitchDeckFilename = `pitch-deck-${req.user._id}-${Date.now()}-${pitchDeckFile.originalname}`;
    const pitchDeckUpload = await uploadToGridFS(
      pitchDeckFile.path,
      pitchDeckFilename,
      'pitch-documents',
      pitchDeckFile.mimetype || 'application/pdf'
    );

    const documents = {
      pitchDeck: {
        fileId: pitchDeckUpload.fileId,
        fileName: pitchDeckFile.originalname,
        fileSize: pitchDeckFile.size,
        fileType: pitchDeckFile.mimetype || 'application/pdf',
        uploadedAt: new Date()
      }
    };

    // Handle optional executive summary
    if (req.files.executiveSummary && req.files.executiveSummary[0]) {
      const execSummaryFile = req.files.executiveSummary[0];
      const allowedExecTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
      
      if (allowedExecTypes.includes(execSummaryFile.mimetype) && execSummaryFile.size <= 10 * 1024 * 1024) {
        const execSummaryFilename = `executive-summary-${req.user._id}-${Date.now()}-${execSummaryFile.originalname}`;
        const execSummaryUpload = await uploadToGridFS(
          execSummaryFile.path,
          execSummaryFilename,
          'pitch-documents',
          execSummaryFile.mimetype || 'application/pdf'
        );
        
        documents.executiveSummary = {
          fileId: execSummaryUpload.fileId,
          fileName: execSummaryFile.originalname,
          fileSize: execSummaryFile.size,
          fileType: execSummaryFile.mimetype || 'application/pdf',
          uploadedAt: new Date()
        };
      }
    }

    // Handle optional financials
    if (req.files.financials && req.files.financials[0]) {
      const financialsFile = req.files.financials[0];
      const allowedFinancialsTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
      
      if (allowedFinancialsTypes.includes(financialsFile.mimetype) && financialsFile.size <= 10 * 1024 * 1024) {
        const financialsFilename = `financials-${req.user._id}-${Date.now()}-${financialsFile.originalname}`;
        const financialsUpload = await uploadToGridFS(
          financialsFile.path,
          financialsFilename,
          'pitch-documents',
          financialsFile.mimetype || 'application/pdf'
        );
        
        documents.financials = {
          fileId: financialsUpload.fileId,
          fileName: financialsFile.originalname,
          fileSize: financialsFile.size,
          fileType: financialsFile.mimetype || 'application/pdf',
          uploadedAt: new Date()
        };
      }
    }

    // Create pitch
    const pitch = await Pitch.create({
      user: req.user._id,
      startupName,
      oneLinePitch,
      category,
      startupStage,
      founderName,
      city,
      state,
      problemStatement,
      solutionDescription,
      documents,
      status: 'Under Review',
      submittedAt: new Date()
    });

    // Create notification for all admins
    try {
      const admins = await Admin.find({ isActive: true }).select('_id');
      const notificationPromises = admins.map(admin => 
        createNotification(
          admin._id,
          'other',
          'New Pitch Submitted',
          `${startupName} has submitted a new pitch: ${oneLinePitch}`,
          `/admin/pitches`,
          {
            pitchId: pitch._id.toString(),
            startupName: startupName,
            founderName: founderName
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
      message: 'Pitch submitted successfully! We will review it and get back to you soon.',
      data: pitch
    });
  } catch (error) {
    console.error('Submit pitch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get user's pitches
// @route   GET /api/pitch/my-pitches
// @access  Private
const getMyPitches = async (req, res) => {
  try {
    const pitches = await Pitch.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: pitches.length,
      data: pitches
    });
  } catch (error) {
    console.error('Get my pitches error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get single pitch by ID (user)
// @route   GET /api/pitch/:id
// @access  Private
const getPitchById = async (req, res) => {
  try {
    const pitch = await Pitch.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!pitch) {
      return res.status(404).json({
        success: false,
        message: 'Pitch not found'
      });
    }

    res.status(200).json({
      success: true,
      data: pitch
    });
  } catch (error) {
    console.error('Get pitch by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ========== ADMIN ROUTES ==========

// @desc    Get all pitches (Admin)
// @route   GET /api/admin/pitches
// @access  Private/Admin
const getAllPitches = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;

    // Build query
    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (startDate || endDate) {
      query.submittedAt = {};
      if (startDate) query.submittedAt.$gte = new Date(startDate);
      if (endDate) query.submittedAt.$lte = new Date(endDate);
    }

    const pitches = await Pitch.find(query)
      .populate('user', 'firstName lastName email phone')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    // Calculate statistics
    const stats = {
      total: pitches.length,
      underReview: pitches.filter(p => p.status === 'Under Review').length,
      approved: pitches.filter(p => p.status === 'Approved').length,
      moreDetailsRequired: pitches.filter(p => p.status === 'More Details Required').length,
      rejected: pitches.filter(p => p.status === 'Rejected').length
    };

    res.status(200).json({
      success: true,
      count: pitches.length,
      stats,
      data: pitches
    });
  } catch (error) {
    console.error('Get all pitches error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get single pitch by ID (Admin)
// @route   GET /api/admin/pitches/:id
// @access  Private/Admin
const getPitchByIdAdmin = async (req, res) => {
  try {
    const pitch = await Pitch.findById(req.params.id)
      .populate('user', 'firstName lastName email phone')
      .populate('reviewedBy', 'name email');

    if (!pitch) {
      return res.status(404).json({
        success: false,
        message: 'Pitch not found'
      });
    }

    res.status(200).json({
      success: true,
      data: pitch
    });
  } catch (error) {
    console.error('Get pitch by ID (admin) error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update pitch status (Admin)
// @route   PUT /api/admin/pitches/:id/status
// @access  Private/Admin
const updatePitchStatus = async (req, res) => {
  try {
    const { status, rejectionReason, adminNotes } = req.body;

    const pitch = await Pitch.findById(req.params.id);

    if (!pitch) {
      return res.status(404).json({
        success: false,
        message: 'Pitch not found'
      });
    }

    if (status) {
      // Validate status
      const validStatuses = ['Under Review', 'Approved', 'More Details Required', 'Rejected'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status'
        });
      }

      pitch.status = status;
      pitch.reviewedAt = new Date();
      pitch.reviewedBy = req.admin._id;

      // If rejected, require rejection reason
      if (status === 'Rejected' && !rejectionReason) {
        return res.status(400).json({
          success: false,
          message: 'Rejection reason is required when rejecting a pitch'
        });
      }

      if (status === 'Rejected' && rejectionReason) {
        pitch.rejectionReason = rejectionReason;
      } else if (status !== 'Rejected') {
        // Clear rejection reason if status is not rejected
        pitch.rejectionReason = undefined;
      }
    }

    if (adminNotes !== undefined) {
      pitch.adminNotes = adminNotes;
    }

    await pitch.save();

    res.status(200).json({
      success: true,
      message: 'Pitch status updated successfully',
      data: pitch
    });
  } catch (error) {
    console.error('Update pitch status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Download pitch document (User)
// @route   GET /api/pitch/:id/download/:documentType
// @access  Private
const downloadPitchDocumentUser = async (req, res) => {
  try {
    const { id, documentType } = req.params;

    console.log('Download request:', { id, documentType, userId: req.user._id });

    const pitch = await Pitch.findOne({
      _id: id,
      user: req.user._id
    });

    if (!pitch) {
      console.log('Pitch not found or user mismatch');
      return res.status(404).json({
        success: false,
        message: 'Pitch not found'
      });
    }

    const validDocumentTypes = ['pitchDeck', 'executiveSummary', 'financials'];
    if (!validDocumentTypes.includes(documentType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid document type'
      });
    }

    const document = pitch.documents?.[documentType];

    if (!document) {
      console.log('Document not found:', documentType, 'Available documents:', Object.keys(pitch.documents || {}));
      return res.status(404).json({
        success: false,
        message: `${documentType} not found for this pitch`
      });
    }

    if (!document.fileId) {
      console.log('Document fileId missing:', documentType);
      return res.status(404).json({
        success: false,
        message: `${documentType} fileId not found for this pitch`
      });
    }

    console.log('Fetching file from GridFS:', document.fileId);

    // Fetch file from GridFS
    try {
      const fileBuffer = await getFromGridFS(document.fileId, 'pitch-documents');
      const fileMetadata = await getFileMetadata(document.fileId, 'pitch-documents');

      if (!fileBuffer || fileBuffer.length === 0) {
        throw new Error('Empty file received from GridFS');
      }

      const fileName = document.fileName || fileMetadata.filename || `${documentType}.pdf`;
      const contentType = document.fileType || fileMetadata.contentType || 'application/pdf';

      console.log('Sending file:', { fileName, size: fileBuffer.length, contentType });

      // Set headers for download
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);
      res.setHeader('Content-Length', fileBuffer.length);
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition, Content-Length, Content-Type');

      // Send the file
      res.send(fileBuffer);
      
      console.log('File sent successfully from GridFS');
    } catch (fetchError) {
      console.error('Error fetching file from GridFS:');
      console.error('Error message:', fetchError.message);
      console.error('Error stack:', fetchError.stack);
      return res.status(500).json({
        success: false,
        message: 'Failed to download file from database',
        error: process.env.NODE_ENV === 'development' ? fetchError.message : undefined
      });
    }
  } catch (error) {
    console.error('Download pitch document error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Download pitch document (Admin)
// @route   GET /api/admin/pitches/:id/download/:documentType
// @access  Private/Admin
const downloadPitchDocument = async (req, res) => {
  try {
    const { id, documentType } = req.params;

    const pitch = await Pitch.findById(id);

    if (!pitch) {
      return res.status(404).json({
        success: false,
        message: 'Pitch not found'
      });
    }

    const validDocumentTypes = ['pitchDeck', 'executiveSummary', 'financials'];
    if (!validDocumentTypes.includes(documentType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid document type'
      });
    }

    const document = pitch.documents[documentType];

    if (!document || !document.fileId) {
      return res.status(404).json({
        success: false,
        message: `${documentType} not found for this pitch`
      });
    }

    // Fetch file from GridFS
    try {
      const fileBuffer = await getFromGridFS(document.fileId, 'pitch-documents');
      const fileMetadata = await getFileMetadata(document.fileId, 'pitch-documents');

      if (!fileBuffer || fileBuffer.length === 0) {
        throw new Error('Empty file received from GridFS');
      }

      const fileName = document.fileName || fileMetadata.filename || `${documentType}.pdf`;
      const contentType = document.fileType || fileMetadata.contentType || 'application/pdf';

      // Set headers for download
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);
      res.setHeader('Content-Length', fileBuffer.length);
      res.setHeader('Cache-Control', 'no-cache');

      // Send the file
      res.send(fileBuffer);
    } catch (fetchError) {
      console.error('Error fetching file from GridFS:', fetchError);
      return res.status(500).json({
        success: false,
        message: 'Failed to download file',
        error: process.env.NODE_ENV === 'development' ? fetchError.message : undefined
      });
    }
  } catch (error) {
    console.error('Download pitch document error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  submitPitch,
  getMyPitches,
  getPitchById,
  downloadPitchDocumentUser,
  getAllPitches,
  getPitchByIdAdmin,
  updatePitchStatus,
  downloadPitchDocument
};

