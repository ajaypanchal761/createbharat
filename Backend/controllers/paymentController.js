const UserTrainingProgress = require('../models/userTrainingProgress');
const MentorBooking = require('../models/mentorBooking');
const LegalSubmission = require('../models/legalSubmission');
const User = require('../models/user');
const TrainingCourse = require('../models/trainingCourse');
const Mentor = require('../models/mentor');
const LegalService = require('../models/legalService');

// @desc    Get all payments (Admin)
// @route   GET /api/admin/payments
// @access  Private/Admin
const getAllPayments = async (req, res) => {
  try {
    const { type, status, startDate, endDate } = req.query;

    const allPayments = [];

    // 1. Get Training Certificate Payments (only completed by default)
    const trainingProgressQuery = {
      certificatePaymentStatus: 'completed'
    };
    
    if (status) {
      trainingProgressQuery.certificatePaymentStatus = status;
    }
    if (startDate || endDate) {
      trainingProgressQuery.certificatePaidAt = {};
      if (startDate) trainingProgressQuery.certificatePaidAt.$gte = new Date(startDate);
      if (endDate) trainingProgressQuery.certificatePaidAt.$lte = new Date(endDate);
    }

    const trainingPayments = await UserTrainingProgress.find(trainingProgressQuery)
      .populate('user', 'firstName lastName email phone')
      .populate('course', 'title provider instructor')
      .sort({ certificatePaidAt: -1, createdAt: -1 })
      .lean();

    trainingPayments.forEach(progress => {
      if (progress.certificatePaymentStatus && progress.certificateAmount) {
        allPayments.push({
          _id: progress._id,
          paymentId: progress.certificatePaymentId || null,
          type: 'certificate',
          typeLabel: 'Training Certificate',
          user: progress.user,
          amount: progress.certificateAmount,
          status: progress.certificatePaymentStatus,
          paidAt: progress.certificatePaidAt,
          createdAt: progress.createdAt,
          details: {
            courseTitle: progress.course?.title || 'Unknown Course',
            courseProvider: progress.course?.provider || 'N/A',
            courseId: progress.course?._id || null,
            progress: progress.overallProgress || 0
          }
        });
      }
    });

    // 2. Get Mentor Booking Payments (only completed bookings with completed payments by default)
    if (type !== 'certificate' && type !== 'legal') {
      const mentorBookingQuery = {
        paymentStatus: 'completed',
        status: 'completed' // Only show completed bookings
      };
      
      if (status) {
        mentorBookingQuery.paymentStatus = status;
      }
      if (startDate || endDate) {
        mentorBookingQuery.paidAt = {};
        if (startDate) mentorBookingQuery.paidAt.$gte = new Date(startDate);
        if (endDate) mentorBookingQuery.paidAt.$lte = new Date(endDate);
      }

      const mentorBookings = await MentorBooking.find(mentorBookingQuery)
        .populate('user', 'firstName lastName email phone')
        .populate('mentor', 'firstName lastName title company specialization')
        .sort({ paidAt: -1, createdAt: -1 })
        .lean();

      mentorBookings.forEach(booking => {
        if (booking.paymentStatus && booking.amount) {
          allPayments.push({
            _id: booking._id,
            paymentId: booking.transactionId || null,
            type: 'mentor',
            typeLabel: 'Mentor Session',
            user: booking.user,
            amount: booking.amount,
            status: booking.paymentStatus,
            paidAt: booking.paidAt,
            createdAt: booking.createdAt,
            details: {
              mentorName: booking.mentor ? `${booking.mentor.firstName} ${booking.mentor.lastName}` : 'Unknown Mentor',
              mentorSpecialization: booking.mentor?.specialization || 'N/A',
              sessionType: booking.sessionType || 'N/A',
              duration: booking.duration || 'N/A',
              bookingStatus: booking.status || 'completed'
            }
          });
        }
      });
    }

    // 3. Get Legal Service Payments (only completed submissions with completed payments by default)
    if (type !== 'certificate' && type !== 'mentor') {
      const legalSubmissionQuery = {
        paymentStatus: 'completed',
        status: 'completed' // Only show completed submissions
      };
      
      if (status) {
        legalSubmissionQuery.paymentStatus = status;
      }
      if (startDate || endDate) {
        legalSubmissionQuery.paidAt = {};
        if (startDate) legalSubmissionQuery.paidAt.$gte = new Date(startDate);
        if (endDate) legalSubmissionQuery.paidAt.$lte = new Date(endDate);
      }

      const legalSubmissions = await LegalSubmission.find(legalSubmissionQuery)
        .populate('user', 'firstName lastName email phone')
        .populate('service', 'name icon category')
        .sort({ paidAt: -1, createdAt: -1 })
        .lean();

      legalSubmissions.forEach(submission => {
        if (submission.paymentStatus && submission.paymentAmount) {
          allPayments.push({
            _id: submission._id,
            paymentId: submission.razorpayPaymentId || submission.transactionId || null,
            type: 'legal',
            typeLabel: 'Legal Service',
            user: submission.user,
            amount: submission.paymentAmount,
            status: submission.paymentStatus,
            paidAt: submission.paidAt,
            createdAt: submission.createdAt,
            details: {
              serviceName: submission.serviceName || submission.service?.name || 'Legal Service',
              serviceIcon: submission.service?.icon || '⚖️',
              serviceCategory: submission.service?.category || submission.category || 'Legal',
              submissionStatus: submission.status || 'completed'
            }
          });
        }
      });
    }

    // Sort all payments by date (most recent first)
    allPayments.sort((a, b) => {
      const dateA = a.paidAt || a.createdAt;
      const dateB = b.paidAt || b.createdAt;
      return new Date(dateB) - new Date(dateA);
    });

    // Calculate totals
    const totals = {
      total: allPayments.reduce((sum, p) => sum + (p.amount || 0), 0),
      completed: allPayments.filter(p => p.status === 'completed').reduce((sum, p) => sum + (p.amount || 0), 0),
      pending: allPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + (p.amount || 0), 0),
      certificates: allPayments.filter(p => p.type === 'certificate').reduce((sum, p) => sum + (p.amount || 0), 0),
      mentors: allPayments.filter(p => p.type === 'mentor').reduce((sum, p) => sum + (p.amount || 0), 0),
      legal: allPayments.filter(p => p.type === 'legal').reduce((sum, p) => sum + (p.amount || 0), 0)
    };

    res.status(200).json({
      success: true,
      count: allPayments.length,
      totals,
      data: allPayments
    });
  } catch (error) {
    console.error('Get all payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getAllPayments
};

