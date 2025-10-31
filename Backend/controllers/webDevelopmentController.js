const WebDevelopmentLead = require('../models/webDevelopmentLead');
const { sendEmail } = require('../services/emailService');

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

    // Send email to appzeto@gmail.com
    const emailSubject = `New Web Development Project Request: ${projectName}`;
    
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f97316; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 5px 5px; }
          .info-box { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #f97316; }
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
            <h1>🚀 New Web Development Project Request</h1>
          </div>
          <div class="content">
            <div class="section">
              <div class="section-title">Project Details</div>
              <div class="info-box">
                <div style="margin-bottom: 10px;">
                  <span class="info-label">Project Name:</span>
                  <span class="info-value">${projectName || 'N/A'}</span>
                </div>
                <div style="margin-bottom: 10px;">
                  <span class="info-label">Platform:</span>
                  <span class="info-value">${platform ? platform.charAt(0).toUpperCase() + platform.slice(1).replace('-', ' ') : 'N/A'}</span>
                </div>
                <div style="margin-bottom: 10px;">
                  <span class="info-label">Budget:</span>
                  <span class="info-value">${budget ? budget.replace('-', ' - ').replace('k', 'K').replace('l', 'L') : 'Not specified'}</span>
                </div>
                <div style="margin-bottom: 10px;">
                  <span class="info-label">Timeline:</span>
                  <span class="info-value">${timeline ? timeline.replace('-', ' - ') : 'Not specified'}</span>
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Project Description</div>
              <div class="info-box">
                <p style="margin: 0; white-space: pre-wrap;">${description || 'No description provided'}</p>
              </div>
            </div>

            ${features ? `
            <div class="section">
              <div class="section-title">Key Features</div>
              <div class="info-box">
                <p style="margin: 0; white-space: pre-wrap;">${features}</p>
              </div>
            </div>
            ` : ''}

            <div class="section">
              <div class="section-title">Contact Information</div>
              <div class="info-box">
                <div style="margin-bottom: 10px;">
                  <span class="info-label">Client Name:</span>
                  <span class="info-value">${clientName || 'N/A'}</span>
                </div>
                <div style="margin-bottom: 10px;">
                  <span class="info-label">Email:</span>
                  <span class="info-value">${email || 'N/A'}</span>
                </div>
                <div style="margin-bottom: 10px;">
                  <span class="info-label">Phone:</span>
                  <span class="info-value">${phone || 'N/A'}</span>
                </div>
                ${company ? `
                <div style="margin-bottom: 10px;">
                  <span class="info-label">Company:</span>
                  <span class="info-value">${company}</span>
                </div>
                ` : ''}
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
              <p>This is an automated email from CreateBharat Web Development Lead System</p>
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
      message: 'Project request submitted successfully. We will contact you soon!',
      data: lead,
      emailSent: emailResult.success
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

