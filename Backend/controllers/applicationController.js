const Application = require('../models/application');
const Internship = require('../models/internship');
const Company = require('../models/company');
const User = require('../models/user');
const { uploadToGridFS, getFromGridFS } = require('../utils/gridfs');
const { sendApplicationStatusEmail } = require('../services/emailService');
const axios = require('axios');

// @desc    Apply to internship
// @route   POST /api/applications
// @access  Private (User)
const applyToInternship = async (req, res) => {
  try {
    const { internshipId } = req.body;

    // Check if internship exists
    const internship = await Internship.findById(internshipId);
    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }

    if (!internship.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This internship is no longer accepting applications'
      });
    }

    // Check if user has already applied
    const existingApplication = await Application.findOne({
      internship: internshipId,
      user: req.user.id
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied to this internship'
      });
    }

    // Handle resume upload if file exists
    let resumeData = null;
    if (req.file) {
      try {
        console.log('=== RESUM UPLOAD START ===');
        console.log('File details:', {
          originalName: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype,
          path: req.file.path
        });
        console.log('Uploading to GridFS...');

        const uploadResult = await uploadToGridFS(
          req.file.path,
          `${req.user.id}-${Date.now()}-${req.file.originalname}`
        );

        console.log('Resume upload successful:', {
          fileId: uploadResult.fileId,
          filename: uploadResult.filename
        });
        console.log('=== RESUM UPLOAD SUCCESS ===');

        resumeData = {
          fileId: uploadResult.fileId,
          fileName: req.file.originalname,
          uploadedAt: new Date()
        };
      } catch (uploadError) {
        console.error('=== RESUM UPLOAD ERROR ===');
        console.error('Resume upload error:', uploadError);
        console.error('Error message:', uploadError.message);
        console.error('Error stack:', uploadError.stack);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload resume. Please try again.',
          error: process.env.NODE_ENV === 'development' ? uploadError.message : undefined
        });
      }
    } else if (req.body.resume) {
      // Handle resume data if sent as JSON (fallback for old format)
      try {
        const resumeObj = typeof req.body.resume === 'string' ? JSON.parse(req.body.resume) : req.body.resume;
        if (resumeObj.fileName) {
          resumeData = {
            fileName: resumeObj.fileName,
            uploadedAt: resumeObj.uploadedAt ? new Date(resumeObj.uploadedAt) : new Date()
          };
        }
      } catch (e) {
        // Ignore parsing errors
      }
    }

    // Create application
    const applicationData = {
      internship: internshipId,
      user: req.user.id,
      company: internship.company,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      position: req.body.position,
      ...(resumeData && { resume: resumeData }),
      ...(req.body.experience && { experience: req.body.experience }),
      ...(req.body.notes && { notes: req.body.notes })
    };

    const application = await Application.create(applicationData);

    // Increment applicants count
    internship.applicants += 1;
    await internship.save();

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: { application }
    });

  } catch (error) {
    console.error('Apply to internship error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get application by ID
// @route   GET /api/applications/:id
// @access  Private (User or Company)
const getApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('internship', 'title companyName location')
      .populate('user', 'firstName lastName email phone')
      .populate('company', 'companyName');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check authorization
    const isOwner = application.user._id.toString() === req.user.id;
    const isCompany = application.company._id.toString() === req.company?.id;

    if (!isOwner && !isCompany) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    res.status(200).json({
      success: true,
      data: { application }
    });

  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get company's applications
// @route   GET /api/applications/company/my-applications
// @access  Private (Company)
const getCompanyApplications = async (req, res) => {
  try {
    const { status, internshipId } = req.query;

    const filter = { company: req.company.id };

    if (status) {
      filter.status = status;
    }

    if (internshipId) {
      filter.internship = internshipId;
    }

    const applications = await Application.find(filter)
      .populate('internship', 'title location duration type category companyName')
      .populate('user', 'firstName lastName email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { applications }
    });

  } catch (error) {
    console.error('Get company applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get user's applications
// @route   GET /api/applications/user/my-applications
// @access  Private (User)
const getUserApplications = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = { user: req.user.id };

    if (status) {
      filter.status = status;
    }

    const applications = await Application.find(filter)
      .populate({
        path: 'internship',
        select: 'title companyName location duration type category stipend stipendPerMonth description isActive applicationDeadline',
        populate: {
          path: 'company',
          select: 'companyName'
        }
      })
      .populate('company', 'companyName industry')
      .populate('user', 'firstName lastName email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { applications }
    });

  } catch (error) {
    console.error('Get user applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Company)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if company owns this application
    if (application.company.toString() !== req.company.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Validate status
    const validStatuses = ['pending', 'shortlisted', 'rejected', 'hired', 'withdrawn'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    application.status = status;
    application.statusUpdatedAt = new Date();
    if (notes) {
      application.notes = notes;
    }

    await application.save();

    // Populate application data for email
    await application.populate([
      { path: 'internship', select: 'title companyName' },
      { path: 'user', select: 'firstName lastName email' },
      { path: 'company', select: 'companyName' }
    ]);

    // Send email notification to user
    try {
      const internshipTitle = application.internship?.title || 'Internship Position';
      const companyName = application.company?.companyName || 'Company';
      
      await sendApplicationStatusEmail(
        application,
        status,
        companyName,
        internshipTitle
      );
      console.log(`Email notification sent for application ${application._id} status: ${status}`);
    } catch (emailError) {
      console.error('Error sending email notification:', emailError);
      // Don't fail the request if email fails
    }

    res.status(200).json({
      success: true,
      message: 'Application status updated',
      data: { application }
    });

  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    View application (mark as viewed)
// @route   PUT /api/applications/:id/view
// @access  Private (Company)
const viewApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    if (application.company.toString() !== req.company.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    application.viewed = true;
    application.viewedAt = new Date();
    await application.save();

    res.status(200).json({
      success: true,
      message: 'Application marked as viewed',
      data: { application }
    });

  } catch (error) {
    console.error('View application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Download resume for company
// @route   GET /api/applications/:id/resume
// @access  Private (Company only)
const downloadResume = async (req, res) => {
  try {
    console.log('=== DOWNLOAD RESUME REQUEST ===');
    console.log('Application ID:', req.params.id);
    console.log('Company ID:', req.company?.id);

    const application = await Application.findById(req.params.id)
      .populate('company', 'companyName');

    if (!application) {
      console.log('Application not found');
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    console.log('Application found:', {
      id: application._id,
      companyId: application.company?._id?.toString(),
      hasResume: !!(application.resume && (application.resume.fileId || application.resume.url))
    });

    // Check if the requesting company owns this application
    if (!req.company || application.company._id.toString() !== req.company.id) {
      console.log('Authorization failed');
      return res.status(403).json({
        success: false,
        message: 'Not authorized to download this resume'
      });
    }

    // Check if resume exists
    if (!application.resume || !application.resume.fileId) {
      console.log('Resume not found in application');
      return res.status(404).json({
        success: false,
        message: 'Resume not found for this application'
      });
    }

    const fileId = application.resume.fileId;
    const fileName = application.resume.fileName || `resume-${application._id}.pdf`;

    console.log('File ID:', fileId);
    console.log('File name:', fileName);

    // Download from GridFS
    try {
      console.log('Downloading from GridFS...');
      const fileResponse = await getFromGridFS(fileId);

      // Validate fileResponse
      if (!fileResponse || !Buffer.isBuffer(fileResponse) || fileResponse.length === 0) {
        throw new Error('Resume file data is empty or invalid after fetch');
      }

      console.log('Setting response headers...');
      console.log('File size:', fileResponse.length, 'bytes');

      // Determine content type based on file extension
      let contentType = 'application/pdf';
      if (fileName.toLowerCase().endsWith('.doc')) {
        contentType = 'application/msword';
      } else if (fileName.toLowerCase().endsWith('.docx')) {
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      }

      // Set headers for download
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);
      res.setHeader('Content-Length', fileResponse.length);
      res.setHeader('Cache-Control', 'no-cache');

      console.log('Sending file response...');

      // Send the file
      res.send(fileResponse);

      console.log('✅ Resume downloaded successfully:', fileName);
      console.log('=== DOWNLOAD RESUME SUCCESS ===');

    } catch (fetchError) {
      console.error('=== ERROR FETCHING RESUME ===');
      console.error('Error name:', fetchError.name);
      console.error('Error message:', fetchError.message);

      if (fetchError.stack) {
        console.error('Error stack:', fetchError.stack);
      }

      return res.status(500).json({
        success: false,
        message: 'Failed to fetch resume from storage',
        error: process.env.NODE_ENV === 'development' ? fetchError.message : undefined
      });
    }

  } catch (error) {
    console.error('=== DOWNLOAD RESUME OUTER ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);

    if (error.stack) {
      console.error('Error stack:', error.stack);
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  applyToInternship,
  getApplication,
  getCompanyApplications,
  getUserApplications,
  updateApplicationStatus,
  viewApplication,
  downloadResume
};
