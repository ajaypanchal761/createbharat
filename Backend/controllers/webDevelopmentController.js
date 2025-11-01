const WebDevelopmentLead = require('../models/webDevelopmentLead');

// @desc    Create a new web development lead
// @route   POST /api/web-development/submit
// @access  Public
const createLead = async (req, res) => {
  try {
    const {
      projectName,
      description,
      platform,
      features,
      budget,
      timeline,
      clientName,
      email,
      phone,
      company
    } = req.body;

    // Create the lead
    const lead = await WebDevelopmentLead.create({
      projectName,
      description,
      platform,
      features,
      budget,
      timeline,
      clientName,
      email,
      phone,
      company
    });

    res.status(201).json({
      success: true,
      message: 'Project request submitted successfully. We will contact you soon!',
      data: lead
    });
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get all web development leads (Admin)
// @route   GET /api/admin/web-development/leads
// @access  Private/Admin
const getAllLeads = async (req, res) => {
  try {
    const { status, startDate, endDate, viewed } = req.query;

    // Build query
    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (viewed !== undefined) {
      query.viewed = viewed === 'true';
    }
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const leads = await WebDevelopmentLead.find(query)
      .sort({ createdAt: -1 })
      .lean();

    // Calculate statistics
    const stats = {
      total: leads.length,
      new: leads.filter(l => l.status === 'new').length,
      contacted: leads.filter(l => l.status === 'contacted').length,
      quoted: leads.filter(l => l.status === 'quoted').length,
      inProgress: leads.filter(l => l.status === 'in-progress').length,
      completed: leads.filter(l => l.status === 'completed').length,
      viewed: leads.filter(l => l.viewed === true).length,
      unviewed: leads.filter(l => l.viewed === false).length
    };

    res.status(200).json({
      success: true,
      count: leads.length,
      stats,
      data: leads
    });
  } catch (error) {
    console.error('Get all leads error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get single web development lead by ID (Admin)
// @route   GET /api/admin/web-development/leads/:id
// @access  Private/Admin
const getLeadById = async (req, res) => {
  try {
    const lead = await WebDevelopmentLead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    // Mark as viewed if not already viewed
    if (!lead.viewed) {
      lead.viewed = true;
      lead.viewedAt = new Date();
      await lead.save();
    }

    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    console.error('Get lead by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update web development lead status (Admin)
// @route   PUT /api/admin/web-development/leads/:id/status
// @access  Private/Admin
const updateLeadStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    const lead = await WebDevelopmentLead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    if (status) {
      lead.status = status;
    }

    if (adminNotes !== undefined) {
      lead.adminNotes = adminNotes;
    }

    await lead.save();

    res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
      data: lead
    });
  } catch (error) {
    console.error('Update lead status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete web development lead (Admin)
// @route   DELETE /api/admin/web-development/leads/:id
// @access  Private/Admin
const deleteLead = async (req, res) => {
  try {
    const lead = await WebDevelopmentLead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    await lead.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  createLead,
  getAllLeads,
  getLeadById,
  updateLeadStatus,
  deleteLead
};

