const BankLead = require('../models/bankLead');
const { sendEmail } = require('../services/emailService');

// @desc    Create a new bank account opening lead
// @route   POST /api/bank-account/submit
// @access  Public
const createLead = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      dateOfBirth,
      address,
      city,
      state,
      pincode
    } = req.body;

    // Create the lead
    const lead = await BankLead.create({
      fullName,
      email,
      phone,
      dateOfBirth,
      address,
      city,
      state,
      pincode
    });

    // Send email to appzeto@gmail.com
    const emailSubject = `New Bank Account Opening Request: ${fullName}`;
    
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 5px 5px; }
          .info-box { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #2563eb; }
          .info-label { font-weight: bold; color: #374151; display: inline-block; min-width: 120px; }
          .info-value { color: #1f2937; margin-left: 10px; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
          .section { margin-bottom: 20px; }
          .section-title { font-size: 18px; font-weight: bold; color: #1f2937; margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏦 New Bank Account Opening Request</h1>
          </div>
          <div class="content">
            <div class="section">
              <div class="section-title">Personal Information</div>
              <div class="info-box">
                <div style="margin-bottom: 10px;">
                  <span class="info-label">Full Name:</span>
                  <span class="info-value">${fullName || 'N/A'}</span>
                </div>
                <div style="margin-bottom: 10px;">
                  <span class="info-label">Email:</span>
                  <span class="info-value">${email || 'N/A'}</span>
                </div>
                <div style="margin-bottom: 10px;">
                  <span class="info-label">Phone:</span>
                  <span class="info-value">${phone || 'N/A'}</span>
                </div>
                <div style="margin-bottom: 10px;">
                  <span class="info-label">Date of Birth:</span>
                  <span class="info-value">${dateOfBirth ? new Date(dateOfBirth).toLocaleDateString('en-IN') : 'N/A'}</span>
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Address Information</div>
              <div class="info-box">
                <div style="margin-bottom: 10px;">
                  <span class="info-label">Address:</span>
                  <span class="info-value">${address || 'N/A'}</span>
                </div>
                <div style="margin-bottom: 10px;">
                  <span class="info-label">City:</span>
                  <span class="info-value">${city || 'N/A'}</span>
                </div>
                <div style="margin-bottom: 10px;">
                  <span class="info-label">State:</span>
                  <span class="info-value">${state || 'N/A'}</span>
                </div>
                <div style="margin-bottom: 10px;">
                  <span class="info-label">Pincode:</span>
                  <span class="info-value">${pincode || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div class="section">
              <div class="info-box" style="background-color: #fef3c7; border-left-color: #f59e0b;">
                <strong>Submitted At:</strong> ${new Date(lead.createdAt).toLocaleString('en-IN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
            
            <div class="footer">
              <p>This is an automated email from CreateBharat Bank Account Opening System</p>
              <p>Lead ID: ${lead._id}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email
    const emailResult = await sendEmail('appzeto@gmail.com', emailSubject, emailHtml);
    
    // Update lead with email sent status
    if (emailResult.success) {
      lead.emailSent = true;
      lead.emailSentAt = new Date();
      await lead.save();
    }

    res.status(201).json({
      success: true,
      message: 'Bank account opening request submitted successfully. We will contact you soon!',
      data: lead,
      emailSent: emailResult.success
    });
  } catch (error) {
    console.error('Create bank lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get all bank leads (Admin - Master Admin only)
// @route   GET /api/admin/bank-account/leads
// @access  Private/Admin (Master Admin only)
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

    const leads = await BankLead.find(query)
      .sort({ createdAt: -1 })
      .lean();

    // Calculate statistics
    const stats = {
      total: leads.length,
      new: leads.filter(l => l.status === 'new').length,
      contacted: leads.filter(l => l.status === 'contacted').length,
      documentsRequested: leads.filter(l => l.status === 'documents-requested').length,
      verificationPending: leads.filter(l => l.status === 'verification-pending').length,
      approved: leads.filter(l => l.status === 'approved').length,
      rejected: leads.filter(l => l.status === 'rejected').length,
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
    console.error('Get all bank leads error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get single bank lead by ID (Admin - Master Admin only)
// @route   GET /api/admin/bank-account/leads/:id
// @access  Private/Admin (Master Admin only)
const getLeadById = async (req, res) => {
  try {
    const lead = await BankLead.findById(req.params.id);

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
    console.error('Get bank lead by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update bank lead status (Admin - Master Admin only)
// @route   PUT /api/admin/bank-account/leads/:id/status
// @access  Private/Admin (Master Admin only)
const updateLeadStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    const lead = await BankLead.findById(req.params.id);

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
    console.error('Update bank lead status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete bank lead (Admin - Master Admin only)
// @route   DELETE /api/admin/bank-account/leads/:id
// @access  Private/Admin (Master Admin only)
const deleteLead = async (req, res) => {
  try {
    const lead = await BankLead.findById(req.params.id);

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
    console.error('Delete bank lead error:', error);
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

