const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');

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

module.exports = {
  loginAdmin,
  getMe,
  getAllAdmins,
  createAdmin,
  updateProfile,
  changePassword,
  updateAdmin,
  deleteAdmin
};

