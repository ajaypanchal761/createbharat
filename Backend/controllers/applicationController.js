const Application = require('../models/application');
const Internship = require('../models/internship');
const Company = require('../models/company');
const User = require('../models/user');

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

    // Create application
    const applicationData = {
      internship: internshipId,
      user: req.user.id,
      company: internship.company,
      ...req.body
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
      .populate('internship', 'title location duration type category')
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
      .populate('internship', 'title companyName location duration type category')
      .populate('company', 'companyName industry')
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

    application.status = status;
    application.statusUpdatedAt = new Date();

    if (notes) {
      application.companyNotes = notes;
    }

    await application.save();

    res.status(200).json({
      success: true,
      message: 'Application status updated successfully',
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

    // Check if company owns this application
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

module.exports = {
  applyToInternship,
  getApplication,
  getCompanyApplications,
  getUserApplications,
  updateApplicationStatus,
  viewApplication
};

