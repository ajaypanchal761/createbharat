const OtherServiceSubmission = require('../models/otherServiceSubmission');
const { createNotification } = require('./notificationController');
const Admin = require('../models/admin');

// @desc    Create a new Other Service submission
// @route   POST /api/other-services/submit
// @access  Public
const createOtherServiceSubmission = async (req, res) => {
  try {
    const { categoryId, categoryName, fullName, email, phone, city, details } = req.body;

    if (!categoryId || !categoryName || !fullName || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'categoryId, categoryName, fullName, email, and phone are required',
      });
    }

    const submission = await OtherServiceSubmission.create({
      categoryId,
      categoryName,
      fullName,
      email,
      phone,
      city,
      details,
    });

    // Notify admins (best-effort)
    try {
      const admins = await Admin.find({ isActive: true }).select('_id');
      const message = `${fullName || email} submitted a new Other Service request (${categoryName}).`;
      const link = '/admin/other-services';
      const notificationPromises = admins.map((admin) =>
        createNotification(admin._id, 'other', 'New Other Service Request', message, link, {
          submissionId: submission._id.toString(),
          categoryId,
          categoryName,
        })
      );
      await Promise.allSettled(notificationPromises);
    } catch (notifyErr) {
      console.error('Notification error (Other Service):', notifyErr);
    }

    res.status(201).json({
      success: true,
      message: 'Request submitted successfully.',
      data: submission,
    });
  } catch (error) {
    console.error('Create Other Service submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get all Other Service submissions (Admin)
// @route   GET /api/admin/other-services
// @access  Private/Admin
const getAllOtherServiceSubmissions = async (req, res) => {
  try {
    const { status, categoryId, search, startDate, endDate } = req.query;
    const query = {};

    if (status) query.status = status;
    if (categoryId) query.categoryId = categoryId;

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { fullName: regex },
        { email: regex },
        { phone: regex },
        { city: regex },
        { details: regex },
        { categoryName: regex },
      ];
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const submissions = await OtherServiceSubmission.find(query)
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions,
    });
  } catch (error) {
    console.error('Get Other Service submissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get single Other Service submission (Admin)
// @route   GET /api/admin/other-services/:id
// @access  Private/Admin
const getOtherServiceSubmissionById = async (req, res) => {
  try {
    const submission = await OtherServiceSubmission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found',
      });
    }

    if (!submission.viewed) {
      submission.viewed = true;
      submission.viewedAt = new Date();
      await submission.save();
    }

    res.status(200).json({
      success: true,
      data: submission,
    });
  } catch (error) {
    console.error('Get Other Service submission by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Update Other Service submission status/notes (Admin)
// @route   PUT /api/admin/other-services/:id/status
// @access  Private/Admin
const updateOtherServiceSubmissionStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const submission = await OtherServiceSubmission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found',
      });
    }

    if (status) submission.status = status;
    if (adminNotes !== undefined) submission.adminNotes = adminNotes;

    await submission.save();

    res.status(200).json({
      success: true,
      message: 'Submission updated successfully',
      data: submission,
    });
  } catch (error) {
    console.error('Update Other Service submission status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Delete Other Service submission (Admin)
// @route   DELETE /api/admin/other-services/:id
// @access  Private/Admin
const deleteOtherServiceSubmission = async (req, res) => {
  try {
    const submission = await OtherServiceSubmission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found',
      });
    }

    await submission.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Submission deleted successfully',
    });
  } catch (error) {
    console.error('Delete Other Service submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = {
  createOtherServiceSubmission,
  getAllOtherServiceSubmissions,
  getOtherServiceSubmissionById,
  updateOtherServiceSubmissionStatus,
  deleteOtherServiceSubmission,
};

