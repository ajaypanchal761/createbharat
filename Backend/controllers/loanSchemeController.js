const LoanScheme = require('../models/loanScheme');

// @desc    Get all loan schemes (Public/User route)
// @route   GET /api/loans/schemes
// @access  Public
const getAllLoanSchemes = async (req, res) => {
  try {
    const { category, search, featured, popular, page = 1, limit = 10 } = req.query;

    // Build query
    const query = { isActive: true };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (popular === 'true') {
      query.popular = true;
    }

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (page - 1) * limit;

    // Get loan schemes
    const loanSchemes = await LoanScheme.find(query)
      .select('-__v')
      .sort({ featured: -1, popular: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await LoanScheme.countDocuments(query);

    res.status(200).json({
      success: true,
      count: loanSchemes.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: loanSchemes
    });

  } catch (error) {
    console.error('Get all loan schemes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get single loan scheme by ID
// @route   GET /api/loans/schemes/:id
// @access  Public
const getLoanSchemeById = async (req, res) => {
  try {
    const loanScheme = await LoanScheme.findById(req.params.id);

    if (!loanScheme) {
      return res.status(404).json({
        success: false,
        message: 'Loan scheme not found'
      });
    }

    // Increment views
    loanScheme.views += 1;
    await loanScheme.save();

    res.status(200).json({
      success: true,
      data: loanScheme
    });

  } catch (error) {
    console.error('Get loan scheme by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Create new loan scheme (Admin only)
// @route   POST /api/admin/loans/schemes
// @access  Private/Admin
const createLoanScheme = async (req, res) => {
  try {
    const loanSchemeData = { ...req.body };

    // Coerce numeric fields if sent as strings
    if (loanSchemeData.minAmount != null) {
      loanSchemeData.minAmount = Number(loanSchemeData.minAmount);
    }
    if (loanSchemeData.maxAmount != null) {
      loanSchemeData.maxAmount = Number(loanSchemeData.maxAmount);
    }

    // Normalize category to lowercase keys used in schema
    if (loanSchemeData.category) {
      const map = {
        MSME: 'msme',
        Startup: 'startup',
        StartupS: 'startup',
        'Women & SC/ST': 'women',
        Women: 'women',
        Agriculture: 'agriculture',
      };
      loanSchemeData.category = map[loanSchemeData.category] || String(loanSchemeData.category).toLowerCase();
    }

    // Create loan scheme
    const loanScheme = await LoanScheme.create(loanSchemeData);

    res.status(201).json({
      success: true,
      message: 'Loan scheme created successfully',
      data: loanScheme
    });

  } catch (error) {
    console.error('Create loan scheme error:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors || {}).map((e) => ({ field: e.path, message: e.message }));
      return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }
    res.status(500).json({ success: false, message: 'Server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
};

// @desc    Update loan scheme (Admin only)
// @route   PUT /api/admin/loans/schemes/:id
// @access  Private/Admin
const updateLoanScheme = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const loanScheme = await LoanScheme.findByIdAndUpdate(
      id,
      { ...updateData, lastUpdated: Date.now() },
      { new: true, runValidators: true }
    );

    if (!loanScheme) {
      return res.status(404).json({
        success: false,
        message: 'Loan scheme not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Loan scheme updated successfully',
      data: loanScheme
    });

  } catch (error) {
    console.error('Update loan scheme error:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors || {}).map((e) => ({ field: e.path, message: e.message }));
      return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }
    res.status(500).json({ success: false, message: 'Server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
};

// @desc    Delete loan scheme (Admin only)
// @route   DELETE /api/admin/loans/schemes/:id
// @access  Private/Admin
const deleteLoanScheme = async (req, res) => {
  try {
    const loanScheme = await LoanScheme.findByIdAndDelete(req.params.id);

    if (!loanScheme) {
      return res.status(404).json({
        success: false,
        message: 'Loan scheme not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Loan scheme deleted successfully'
    });

  } catch (error) {
    console.error('Delete loan scheme error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Toggle loan scheme status (Admin only)
// @route   PATCH /api/admin/loans/schemes/:id/status
// @access  Private/Admin
const toggleLoanSchemeStatus = async (req, res) => {
  try {
    const loanScheme = await LoanScheme.findById(req.params.id);

    if (!loanScheme) {
      return res.status(404).json({
        success: false,
        message: 'Loan scheme not found'
      });
    }

    loanScheme.isActive = !loanScheme.isActive;
    loanScheme.lastUpdated = Date.now();
    await loanScheme.save();

    res.status(200).json({
      success: true,
      message: `Loan scheme ${loanScheme.isActive ? 'activated' : 'deactivated'} successfully`,
      data: loanScheme
    });

  } catch (error) {
    console.error('Toggle loan scheme status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get loan scheme statistics (Admin only)
// @route   GET /api/admin/loans/schemes/stats
// @access  Private/Admin
const getLoanSchemeStats = async (req, res) => {
  try {
    const total = await LoanScheme.countDocuments();
    const active = await LoanScheme.countDocuments({ isActive: true });
    const featured = await LoanScheme.countDocuments({ featured: true });
    const popular = await LoanScheme.countDocuments({ popular: true });

    const totalViews = await LoanScheme.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ]);

    const totalApplications = await LoanScheme.aggregate([
      { $group: { _id: null, totalApplications: { $sum: '$applicationsCount' } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        active,
        inactive: total - active,
        featured,
        popular,
        totalViews: totalViews[0]?.totalViews || 0,
        totalApplications: totalApplications[0]?.totalApplications || 0
      }
    });

  } catch (error) {
    console.error('Get loan scheme stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getAllLoanSchemes,
  getLoanSchemeById,
  createLoanScheme,
  updateLoanScheme,
  deleteLoanScheme,
  toggleLoanSchemeStatus,
  getLoanSchemeStats
};

