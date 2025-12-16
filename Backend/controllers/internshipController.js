const Internship = require('../models/internship');
const Company = require('../models/company');

// @desc    Create new internship
// @route   POST /api/internships
// @access  Private (Company)
const createInternship = async (req, res) => {
  try {
    // Safety check - ensure req.body exists
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Invalid request. Request body is missing or not properly formatted.'
      });
    }

    const companyId = req.company?.id || req.company?._id;
    if (!companyId) {
      return res.status(401).json({
        success: false,
        message: 'Company authentication failed'
      });
    }

    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Extract fields from req.body - with fallbacks
    const {
      title = '',
      location = '',
      duration = '',
      stipend = '',
      type = 'Internship',
      category = '',
      description = '',
      requirements = [],
      responsibilities = [],
      skills = [],
      isRemote = false,
      openings = 1,
      applicationDeadline = null
    } = req.body || {};

    // Process requirements - ensure it's an array
    const processedRequirements = Array.isArray(requirements)
      ? requirements.filter(r => r && r.trim()).map(r => r.trim())
      : [];

    // Validate required fields
    if (!title || !location || !duration || !stipend || !category || !description || !applicationDeadline) {
      return res.status(400).json({
        success: false,
        message: 'All required fields including application deadline must be provided'
      });
    }

    // Prepare internship data with explicit field mapping
    const internshipData = {
      title: title?.trim(),
      location: location?.trim(),
      duration: duration?.trim(),
      stipend: stipend?.trim(),
      type: type || 'Internship',
      category: category,
      description: description?.trim(),
      requirements: processedRequirements,
      responsibilities: Array.isArray(responsibilities) ? responsibilities : [],
      skills: Array.isArray(skills) ? skills : [],
      isRemote: isRemote === true || isRemote === 'true',
      openings: parseInt(openings) || 1,
      applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : null,
      company: company._id,
      companyName: company.companyName
    };

    const internship = await Internship.create(internshipData);

    res.status(201).json({
      success: true,
      message: 'Internship posted successfully',
      data: { internship }
    });

  } catch (error) {
    console.error('Create internship error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get all internships
// @route   GET /api/internships
// @access  Public
const getAllInternships = async (req, res) => {
  try {
    const {
      category,
      location,
      type,
      remote,
      featured,
      search,
      page = 1,
      limit = 20
    } = req.query;

    // Build filter - use $and to properly combine all conditions
    const filterConditions = [
      { isActive: true },
      {
        $or: [
          { applicationDeadline: null },
          { applicationDeadline: { $gte: new Date() } }
        ]
      }
    ];

    // Add category filter
    if (category && category !== 'all') {
      filterConditions.push({ category });
    }

    // Add location filter
    if (location) {
      filterConditions.push({ location: { $regex: location, $options: 'i' } });
    }

    // Add type filter
    if (type) {
      filterConditions.push({ type });
    }

    // Add remote filter
    if (remote !== undefined) {
      filterConditions.push({ isRemote: remote === 'true' });
    }

    // Add featured filter
    if (featured === 'true') {
      filterConditions.push({ featured: true });
    }

    // Add search filter if provided
    if (search) {
      filterConditions.push({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { companyName: { $regex: search, $options: 'i' } }
        ]
      });
    }

    // Build final filter
    const filter = filterConditions.length > 2 ? { $and: filterConditions } :
      Object.assign({}, ...filterConditions);

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const internships = await Internship.find(filter)
      .select('-perks -applicationProcess -applicants -applicationLink -startDate -endDate')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('company', 'companyName industry companySize website logo');

    const total = await Internship.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        internships,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Get all internships error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get single internship
// @route   GET /api/internships/:id
// @access  Public
const getInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id)
      .select('-perks -applicationProcess -applicants -applicationLink -startDate -endDate')
      .populate('company', 'companyName industry companySize website description logo socialLinks');

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { internship }
    });

  } catch (error) {
    console.error('Get internship error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get company's internships
// @route   GET /api/internships/company/my-internships
// @access  Private (Company)
const getMyInternships = async (req, res) => {
  try {
    const internships = await Internship.find({ company: req.company.id })
      .select('-perks -applicationProcess -applicants -applicationLink -startDate -endDate')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { internships }
    });

  } catch (error) {
    console.error('Get my internships error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update internship
// @route   PUT /api/internships/:id
// @access  Private (Company - Owner only)
const updateInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }

    // Check if company owns this internship
    if (internship.company.toString() !== req.company.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this internship'
      });
    }

    console.log('Update request body:', JSON.stringify(req.body, null, 2));
    console.log('Current internship stipend:', internship.stipend);

    // Process requirements if provided - ensure it's an array
    if (req.body.requirements !== undefined) {
      req.body.requirements = Array.isArray(req.body.requirements)
        ? req.body.requirements.filter(r => r && r.trim()).map(r => r.trim())
        : [];
    }

    // Process skills if provided - ensure it's an array
    if (req.body.skills !== undefined) {
      req.body.skills = Array.isArray(req.body.skills)
        ? req.body.skills.filter(s => s && s.trim()).map(s => s.trim())
        : [];
    }

    // Process responsibilities if provided - ensure it's an array
    if (req.body.responsibilities !== undefined) {
      req.body.responsibilities = Array.isArray(req.body.responsibilities)
        ? req.body.responsibilities.filter(r => r && r.trim()).map(r => r.trim())
        : [];
    }

    // Update internship
    Object.keys(req.body).forEach(key => {
      internship[key] = req.body[key];
    });

    console.log('After setting values, internship stipend:', internship.stipend);

    await internship.save();

    console.log('After save, internship stipend:', internship.stipend);

    res.status(200).json({
      success: true,
      message: 'Internship updated successfully',
      data: { internship }
    });

  } catch (error) {
    console.error('Update internship error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete internship
// @route   DELETE /api/internships/:id
// @access  Private (Company - Owner only)
const deleteInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }

    // Check if company owns this internship
    if (internship.company.toString() !== req.company.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this internship'
      });
    }

    await internship.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Internship deleted successfully'
    });

  } catch (error) {
    console.error('Delete internship error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  createInternship,
  getAllInternships,
  getInternship,
  getMyInternships,
  updateInternship,
  deleteInternship
};

