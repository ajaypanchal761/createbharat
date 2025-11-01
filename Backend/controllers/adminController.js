const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');
const MentorBooking = require('../models/mentorBooking');
const Mentor = require('../models/mentor');
const User = require('../models/user');
const Company = require('../models/company');
const CA = require('../models/ca');
const LoanScheme = require('../models/loanScheme');
const TrainingCourse = require('../models/trainingCourse');
const UserTrainingProgress = require('../models/userTrainingProgress');
const LegalService = require('../models/legalService');
const LegalSubmission = require('../models/legalSubmission');
const Application = require('../models/application');

// Generate JWT Token
const generateToken = (adminId) => {
  return jwt.sign({ adminId, type: 'admin' }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @desc    Login admin
// @route   POST /api/admin/login
// @access  Public
const loginAdmin = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required'
      });
    }

    // Find admin by email or username
    let admin;
    if (email) {
      admin = await Admin.findOne({ email }).select('+password');
    } else if (username) {
      admin = await Admin.findOne({ username }).select('+password');
    } else {
      return res.status(400).json({
        success: false,
        message: 'Email or username is required'
      });
    }

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if admin account is locked
    if (admin.isLocked()) {
      return res.status(401).json({
        success: false,
        message: 'Account temporarily locked due to multiple failed login attempts. Please try again later.'
      });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact super admin.'
      });
    }

    // Check if admin is blocked
    if (admin.isBlocked) {
      return res.status(401).json({
        success: false,
        message: 'Account is blocked. Please contact super admin.'
      });
    }

    // Check password
    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
      // Increment login attempts
      await admin.incLoginAttempts();

      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Reset login attempts on successful login
    if (admin.loginAttempts > 0) {
      await admin.resetLoginAttempts();
    }

    // Update last login and activity
    admin.lastLogin = new Date();
    admin.lastActiveAt = new Date();
    admin.loginCount += 1;
    await admin.save();

    // Generate token
    const token = generateToken(admin._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        admin: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
          fullName: admin.fullName,
          role: admin.role,
          permissions: admin.permissions,
          lastLogin: admin.lastLogin,
          phone: admin.phone
        },
        token
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get current admin profile
// @route   GET /api/admin/me
// @access  Private/Admin
const getMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        admin: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
          fullName: admin.fullName,
          role: admin.role,
          permissions: admin.permissions,
          lastLogin: admin.lastLogin,
          phone: admin.phone,
          createdAt: admin.createdAt
        }
      }
    });

  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get all admins (Super Admin only)
// @route   GET /api/admin
// @access  Private/Super Admin
const getAllAdmins = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const admins = await Admin.find({})
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Admin.countDocuments();

    res.status(200).json({
      success: true,
      count: admins.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: admins
    });

  } catch (error) {
    console.error('Get all admins error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Create admin (Super Admin only)
// @route   POST /api/admin/create
// @access  Private/Super Admin
const createAdmin = async (req, res) => {
  try {
    const { username, email, password, fullName, phone, role, permissions } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      $or: [{ email }, { username }]
    });

    if (existingAdmin) {
      let message = 'Admin already exists';
      if (existingAdmin.email === email) message = 'Email already registered';
      else if (existingAdmin.username === username) message = 'Username already taken';

      return res.status(400).json({
        success: false,
        message
      });
    }

    // Create new admin
    const adminData = {
      username,
      email,
      password,
      fullName,
      phone,
      role: role || 'admin'
    };

    if (permissions) {
      adminData.permissions = permissions;
    }

    const admin = await Admin.create(adminData);

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      data: {
        admin: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
          fullName: admin.fullName,
          role: admin.role,
          permissions: admin.permissions
        }
      }
    });

  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update admin profile
// @route   PUT /api/admin/profile
// @access  Private/Admin
const updateProfile = async (req, res) => {
  try {
    const { fullName, phone } = req.body;

    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    if (fullName) admin.fullName = fullName;
    if (phone) admin.phone = phone;

    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        admin: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
          fullName: admin.fullName,
          phone: admin.phone,
          role: admin.role,
          permissions: admin.permissions
        }
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Change password
// @route   PUT /api/admin/change-password
// @access  Private/Admin
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const admin = await Admin.findById(req.admin.id).select('+password');

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    // Check current password
    const isCurrentPasswordValid = await admin.comparePassword(currentPassword);

    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update admin (Super Admin only)
// @route   PUT /api/admin/:id
// @access  Private/Super Admin
const updateAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    const { fullName, phone, role, permissions, isActive } = req.body;

    if (fullName) admin.fullName = fullName;
    if (phone) admin.phone = phone;
    if (role) admin.role = role;
    if (permissions) admin.permissions = { ...admin.permissions, ...permissions };
    if (typeof isActive === 'boolean') admin.isActive = isActive;

    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Admin updated successfully',
      data: admin
    });

  } catch (error) {
    console.error('Update admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete admin (Super Admin only)
// @route   DELETE /api/admin/:id
// @access  Private/Super Admin
const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    // Prevent deleting yourself
    if (admin._id.toString() === req.admin.id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    await Admin.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Admin deleted successfully'
    });

  } catch (error) {
    console.error('Delete admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    List all mentor bookings (paginated, admin)
// @route   GET /api/admin/mentor-bookings
// @access  Private (Admin)
const adminListMentorBookings = async (req, res) => {
  try {
    const { page = 1, limit = 100, status } = req.query;
    const query = {};
    if (status) query.status = status;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const bookings = await MentorBooking.find(query)
      .populate('mentor', 'firstName lastName email title company')
      .populate('user', 'firstName lastName email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    const total = await MentorBooking.countDocuments(query);

    // Format bookings for frontend
    const formattedBookings = bookings.map(booking => ({
      mentor: booking.mentor ? `${booking.mentor.firstName} ${booking.mentor.lastName}` : 'Unknown Mentor',
      student: booking.user ? `${booking.user.firstName} ${booking.user.lastName}` : booking.user?.email || 'Unknown',
      date: new Date(booking.createdAt).toISOString().split('T')[0],
      status: booking.status,
      amount: `₹${booking.amount || 0}`
    }));

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      bookings: formattedBookings
    });
  } catch (err) {
    console.error('Admin get mentor bookings error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Admin update mentor booking status (cancel/resolve/refund)
// @route   PUT /api/admin/mentor-bookings/:id/status
// @access  Private (Admin)
const adminUpdateMentorBookingStatus = async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ success: false, message: 'Admins only' });
    }
    const { status, cancellationReason } = req.body;
    const allowed = ['cancelled', 'completed', 'refunded'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    const booking = await MentorBooking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    booking.status = status;
    if (status === 'cancelled') {
      booking.cancellationReason = cancellationReason || 'Admin cancelled';
      booking.cancelledAt = new Date();
      booking.cancelledBy = 'system';
    }
    if (status === 'refunded') {
      booking.paymentStatus = 'refunded';
    }
    if (status === 'completed') {
      booking.completedAt = new Date();
    }
    await booking.save();
    res.status(200).json({ success: true, message: 'Booking status updated', data: { booking } });
  } catch (err) {
    console.error('Admin update mentor booking status error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all users (Admin management)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsersForAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;

    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: users
    });

  } catch (error) {
    console.error('Admin get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get user by ID (Admin management)
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserByIdForAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Admin get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update user (Admin management)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUserForAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user fields
    const allowedUpdates = ['firstName', 'lastName', 'email', 'phone', 'gender', 'isActive', 'isBlocked', 'role'];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user
    });

  } catch (error) {
    console.error('Admin update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete user (Admin management)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUserForAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Admin delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Deactivate user (Admin management)
// @route   PATCH /api/admin/users/:id/deactivate
// @access  Private/Admin
const deactivateUserForAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: user
    });

  } catch (error) {
    console.error('Admin deactivate user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get dashboard statistics (Admin)
// @route   GET /api/admin/dashboard/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    // Get counts in parallel
    const [
      totalUsers,
      totalCompanies,
      totalCAs,
      activeLoans,
      legalServices,
      legalSubmissions,
      trainingModules,
      activeMentors,
      totalBookings,
      pendingBookings,
      activeBookings,
      completedBookings,
      totalApplications,
      certificatePayments,
      mentorPayments,
      legalPayments
    ] = await Promise.all([
      User.countDocuments({ isActive: true }),
      Company.countDocuments({ isActive: true }),
      CA.countDocuments({ isActive: true }),
      LoanScheme.countDocuments({ isActive: true }),
      LegalService.countDocuments({ isActive: true }),
      LegalSubmission.countDocuments(),
      TrainingCourse.countDocuments({ isActive: true, isPublished: true }),
      Mentor.countDocuments({ isActive: true }),
      MentorBooking.countDocuments(),
      MentorBooking.countDocuments({ status: 'pending' }),
      MentorBooking.countDocuments({ status: 'accepted' }),
      MentorBooking.countDocuments({ status: 'completed' }),
      Application.countDocuments(),
      UserTrainingProgress.aggregate([
        { $match: { certificatePaymentStatus: 'completed', certificateAmount: { $exists: true } } },
        { $group: { _id: null, total: { $sum: '$certificateAmount' } } }
      ]),
      MentorBooking.aggregate([
        { $match: { paymentStatus: 'completed', amount: { $exists: true } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      LegalSubmission.aggregate([
        { $match: { paymentStatus: 'completed', paymentAmount: { $exists: true } } },
        { $group: { _id: null, total: { $sum: '$paymentAmount' } } }
      ])
    ]);

    // Calculate total revenue (including legal services)
    const certificateRevenue = certificatePayments[0]?.total || 0;
    const mentorRevenue = mentorPayments[0]?.total || 0;
    const legalRevenue = legalPayments[0]?.total || 0;
    const totalRevenue = certificateRevenue + mentorRevenue + legalRevenue;

    // Get recent mentor bookings
    const recentBookings = await MentorBooking.find({})
      .populate('mentor', 'firstName lastName')
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const formattedBookings = recentBookings.map(booking => ({
      mentor: booking.mentor ? `${booking.mentor.firstName} ${booking.mentor.lastName}` : 'Unknown Mentor',
      student: booking.user ? `${booking.user.firstName} ${booking.user.lastName}` : booking.user?.email || 'Unknown',
      date: new Date(booking.createdAt).toISOString().split('T')[0],
      status: booking.status,
      amount: `₹${booking.amount || 0}`
    }));

    // Helper function to calculate time ago
    function getTimeAgo(date) {
      if (!date) return 'Just now';
      const now = new Date();
      const diffMs = now - new Date(date);
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      return new Date(date).toLocaleDateString();
    }

    // Get recent activity
    const recentActivityList = [];

    // Recent user registrations (last 10)
    const recentUsers = await User.find({})
      .select('firstName lastName email createdAt')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    recentUsers.forEach(user => {
      const timeAgo = getTimeAgo(user.createdAt);
      recentActivityList.push({
        type: 'user',
        message: `New user registered: ${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
        time: timeAgo,
        createdAt: user.createdAt
      });
    });

    // Recent payments (certificate + mentor)
    const recentCertificatePayments = await UserTrainingProgress.find({
      certificatePaymentStatus: 'completed',
      certificateAmount: { $exists: true }
    })
      .populate('user', 'firstName lastName email')
      .populate('course', 'title')
      .sort({ certificatePaidAt: -1 })
      .limit(3)
      .lean();

    recentCertificatePayments.forEach(payment => {
      if (payment.certificatePaidAt) {
        const timeAgo = getTimeAgo(payment.certificatePaidAt);
        recentActivityList.push({
          type: 'payment',
          message: `Certificate payment received: ₹${payment.certificateAmount} for ${payment.course?.title || 'Course'}`,
          time: timeAgo,
          createdAt: payment.certificatePaidAt
        });
      }
    });

    const recentMentorPayments = await MentorBooking.find({
      paymentStatus: 'completed',
      amount: { $exists: true }
    })
      .populate('user', 'firstName lastName email')
      .populate('mentor', 'firstName lastName')
      .sort({ paidAt: -1 })
      .limit(3)
      .lean();

    recentMentorPayments.forEach(booking => {
      if (booking.paidAt) {
        const timeAgo = getTimeAgo(booking.paidAt);
        recentActivityList.push({
          type: 'payment',
          message: `Mentor session payment: ₹${booking.amount} from ${booking.user?.firstName || booking.user?.email || 'User'}`,
          time: timeAgo,
          createdAt: booking.paidAt
        });
      }
    });

    // Recent training enrollments
    const recentEnrollments = await UserTrainingProgress.find({})
      .populate('user', 'firstName lastName email')
      .populate('course', 'title')
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();

    recentEnrollments.forEach(progress => {
      const timeAgo = getTimeAgo(progress.createdAt);
      recentActivityList.push({
        type: 'training',
        message: `${progress.user?.firstName || 'User'} enrolled in ${progress.course?.title || 'course'}`,
        time: timeAgo,
        createdAt: progress.createdAt
      });
    });

    // Recent legal service submissions
    const recentLegalSubmissions = await LegalSubmission.find({})
      .populate('user', 'firstName lastName email')
      .populate('service', 'title')
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();

    recentLegalSubmissions.forEach(submission => {
      const timeAgo = getTimeAgo(submission.createdAt);
      recentActivityList.push({
        type: 'legal',
        message: `Legal service submission: ${submission.service?.title || 'Service'} by ${submission.user?.firstName || 'User'}`,
        time: timeAgo,
        createdAt: submission.createdAt
      });
    });

    // Recent internship applications
    const recentApplications = await Application.find({})
      .populate('user', 'firstName lastName email')
      .populate('internship', 'title')
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();

    recentApplications.forEach(application => {
      const timeAgo = getTimeAgo(application.createdAt);
      recentActivityList.push({
        type: 'application',
        message: `New internship application: ${application.user?.firstName || 'User'} applied for ${application.internship?.title || 'position'}`,
        time: timeAgo,
        createdAt: application.createdAt
      });
    });

    // Sort all activities by date and take top 10
    recentActivityList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const topActivities = recentActivityList.slice(0, 10);

    // Get revenue trend (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Certificate payments by day
    const certificateRevenueTrend = await UserTrainingProgress.aggregate([
      {
        $match: {
          certificatePaymentStatus: 'completed',
          certificateAmount: { $exists: true },
          certificatePaidAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$certificatePaidAt' }
          },
          revenue: { $sum: '$certificateAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Mentor payments by day
    const mentorRevenueTrend = await MentorBooking.aggregate([
      {
        $match: {
          paymentStatus: 'completed',
          amount: { $exists: true },
          paidAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$paidAt' }
          },
          revenue: { $sum: '$amount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Combine revenue trends
    const revenueMap = new Map();

    certificateRevenueTrend.forEach(item => {
      const date = item._id;
      revenueMap.set(date, (revenueMap.get(date) || 0) + item.revenue);
    });

    mentorRevenueTrend.forEach(item => {
      const date = item._id;
      revenueMap.set(date, (revenueMap.get(date) || 0) + item.revenue);
    });

    // Convert to array and fill missing days with 0
    const revenueTrend = [];
    const startDate = new Date(thirtyDaysAgo);
    const endDate = new Date();

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      revenueTrend.push({
        date: dateStr,
        revenue: revenueMap.get(dateStr) || 0
      });
    }

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalCompanies,
          totalCAs,
          totalRevenue,
          activeLoans,
          legalServices,
          legalSubmissions,
          trainingModules,
          mentors: activeMentors,
          totalApplications
        },
        mentorBookings: {
          total: totalBookings,
          pending: pendingBookings,
          active: activeBookings,
          completed: completedBookings
        },
        recentBookings: formattedBookings,
        recentActivity: topActivities.map(activity => ({
          type: activity.type,
          message: activity.message,
          time: activity.time
        })),
        revenueTrend: revenueTrend.slice(-30) // Last 30 days
      }
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get all mentors (Admin management)
// @route   GET /api/admin/mentors
// @access  Private/Admin
const getAllMentorsForAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;

    const mentors = await Mentor.find({})
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Mentor.countDocuments();

    res.status(200).json({
      success: true,
      count: mentors.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: mentors
    });

  } catch (error) {
    console.error('Admin get all mentors error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get all companies (Admin management)
// @route   GET /api/admin/companies
// @access  Private/Admin
const getAllCompaniesForAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;

    const companies = await Company.find({})
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Company.countDocuments();

    res.status(200).json({
      success: true,
      count: companies.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: companies
    });

  } catch (error) {
    console.error('Admin get all companies error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get all CAs (Admin management)
// @route   GET /api/admin/cas
// @access  Private/Admin
const getAllCAsForAdmin = async (req, res) => {
  try {
    const cas = await CA.find({})
      .select('-password')
      .sort({ createdAt: -1 });

    const total = cas.length;

    res.status(200).json({
      success: true,
      count: cas.length,
      total,
      data: cas
    });

  } catch (error) {
    console.error('Admin get all CAs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Deactivate CA (Admin management)
// @route   PATCH /api/admin/cas/:id/deactivate
// @access  Private/Admin
const deactivateCAForAdmin = async (req, res) => {
  try {
    const ca = await CA.findById(req.params.id);

    if (!ca) {
      return res.status(404).json({
        success: false,
        message: 'CA not found'
      });
    }

    ca.isActive = !ca.isActive;
    await ca.save();

    res.status(200).json({
      success: true,
      message: `CA ${ca.isActive ? 'activated' : 'deactivated'} successfully`,
      data: ca
    });

  } catch (error) {
    console.error('Admin deactivate CA error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete CA (Admin management)
// @route   DELETE /api/admin/cas/:id
// @access  Private/Admin
const deleteCAForAdmin = async (req, res) => {
  try {
    const ca = await CA.findById(req.params.id);

    if (!ca) {
      return res.status(404).json({
        success: false,
        message: 'CA not found'
      });
    }

    await CA.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'CA deleted successfully'
    });

  } catch (error) {
    console.error('Admin delete CA error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Deactivate company (Admin management)
// @route   PATCH /api/admin/companies/:id/deactivate
// @access  Private/Admin
const deactivateCompanyForAdmin = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    company.isActive = !company.isActive;
    await company.save();

    res.status(200).json({
      success: true,
      message: `Company ${company.isActive ? 'activated' : 'deactivated'} successfully`,
      data: company
    });

  } catch (error) {
    console.error('Admin deactivate company error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete company (Admin management)
// @route   DELETE /api/admin/companies/:id
// @access  Private/Admin
const deleteCompanyForAdmin = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    await Company.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Company deleted successfully'
    });

  } catch (error) {
    console.error('Admin delete company error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Deactivate mentor (Admin management)
// @route   PATCH /api/admin/mentors/:id/deactivate
// @access  Private/Admin
const deactivateMentorForAdmin = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id);

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found'
      });
    }

    mentor.isActive = !mentor.isActive;
    await mentor.save();

    res.status(200).json({
      success: true,
      message: `Mentor ${mentor.isActive ? 'activated' : 'deactivated'} successfully`,
      data: mentor
    });

  } catch (error) {
    console.error('Admin deactivate mentor error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete mentor (Admin management)
// @route   DELETE /api/admin/mentors/:id
// @access  Private/Admin
const deleteMentorForAdmin = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id);

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found'
      });
    }

    await Mentor.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Mentor deleted successfully'
    });

  } catch (error) {
    console.error('Admin delete mentor error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Mark payment as settled (Legal Service)
// @route   PATCH /api/admin/legal-payments/:id/settle
// @access  Private/Admin
const markLegalSettlement = async (req, res) => {
  try {
    const submission = await LegalSubmission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    if (submission.settlementStatus === 'settled') {
      // Toggle back to pending if already settled
      submission.settlementStatus = 'pending';
      submission.settlementPaidAt = null;
      await submission.save();

      res.status(200).json({
        success: true,
        message: 'Settlement status reset to pending',
        data: submission
      });
    } else {
      // Mark as settled
      submission.settlementStatus = 'settled';
      submission.settlementPaidAt = new Date();
      await submission.save();

      res.status(200).json({
        success: true,
        message: 'Payment marked as settled',
        data: submission
      });
    }

  } catch (error) {
    console.error('Admin mark legal settlement error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Mark payment as settled (Mentor Booking)
// @route   PATCH /api/admin/mentor-payments/:id/settle
// @access  Private/Admin
const markMentorSettlement = async (req, res) => {
  try {
    const booking = await MentorBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.settlementStatus === 'settled') {
      // Toggle back to pending if already settled
      booking.settlementStatus = 'pending';
      booking.settlementPaidAt = null;
      await booking.save();

      res.status(200).json({
        success: true,
        message: 'Settlement status reset to pending',
        data: booking
      });
    } else {
      // Mark as settled
      booking.settlementStatus = 'settled';
      booking.settlementPaidAt = new Date();
      await booking.save();

      res.status(200).json({
        success: true,
        message: 'Payment marked as settled',
        data: booking
      });
    }

  } catch (error) {
    console.error('Admin mark mentor settlement error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  loginAdmin,
  getMe,
  getAllAdmins,
  createAdmin,
  updateProfile,
  changePassword,
  updateAdmin,
  deleteAdmin,
  adminListMentorBookings,
  adminUpdateMentorBookingStatus,
  getAllUsersForAdmin,
  getUserByIdForAdmin,
  updateUserForAdmin,
  deleteUserForAdmin,
  deactivateUserForAdmin,
  getDashboardStats,
  getAllMentorsForAdmin,
  getAllCompaniesForAdmin,
  getAllCAsForAdmin,
  deactivateCompanyForAdmin,
  deleteCompanyForAdmin,
  deactivateMentorForAdmin,
  deleteMentorForAdmin,
  deactivateCAForAdmin,
  deleteCAForAdmin,
  markLegalSettlement,
  markMentorSettlement
};

