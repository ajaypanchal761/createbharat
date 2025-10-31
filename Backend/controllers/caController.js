const CA = require('../models/ca');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Generate JWT Token
const generateToken = (caId) => {
  return jwt.sign({ caId, type: 'ca' }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @desc    Register CA (Admin only - Only one CA can exist)
// @route   POST /api/admin/ca/register
// @access  Private/Admin
const registerCA = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Check if CA already exists (only one CA allowed)
    const existingCA = await CA.findOne();
    
    if (existingCA) {
      return res.status(400).json({
        success: false,
        message: 'A CA already exists. Please delete the existing CA before registering a new one.'
      });
    }

    const {
      name,
      email,
      password,
      phone,
      caNumber,
      firmName,
      experience,
      specialization
    } = req.body;

    // Check if email or CA number already exists (extra check)
    const existingEmail = await CA.findOne({ email });
    const existingCANumber = await CA.findOne({ caNumber });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    if (existingCANumber) {
      return res.status(400).json({
        success: false,
        message: 'CA Number already registered'
      });
    }

    // Create new CA
    const ca = await CA.create({
      name,
      email,
      password,
      phone,
      caNumber,
      firmName,
      experience,
      specialization
    });

    res.status(201).json({
      success: true,
      message: 'CA registered successfully',
      data: {
        ca: {
          id: ca._id,
          name: ca.name,
          email: ca.email,
          phone: ca.phone,
          caNumber: ca.caNumber,
          firmName: ca.firmName,
          experience: ca.experience,
          specialization: ca.specialization,
          isActive: ca.isActive
        }
      }
    });

  } catch (error) {
    console.error('Register CA error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get CA (Admin)
// @route   GET /api/admin/ca
// @access  Private/Admin
const getCA = async (req, res) => {
  try {
    const ca = await CA.findOne();

    if (!ca) {
      return res.status(404).json({
        success: false,
        message: 'No CA registered yet'
      });
    }

    res.status(200).json({
      success: true,
      data: { ca }
    });

  } catch (error) {
    console.error('Get CA error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update CA (Admin only)
// @route   PUT /api/admin/ca
// @access  Private/Admin
const updateCA = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const ca = await CA.findOne();

    if (!ca) {
      return res.status(404).json({
        success: false,
        message: 'No CA found to update'
      });
    }

    const {
      name,
      email,
      password,
      phone,
      caNumber,
      firmName,
      experience,
      specialization,
      isActive
    } = req.body;

    // Check if email is being changed and if it already exists
    if (email && email !== ca.email) {
      const existingEmail = await CA.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered'
        });
      }
      ca.email = email;
    }

    // Check if CA number is being changed and if it already exists
    if (caNumber && caNumber !== ca.caNumber) {
      const existingCANumber = await CA.findOne({ caNumber });
      if (existingCANumber) {
        return res.status(400).json({
          success: false,
          message: 'CA Number already registered'
        });
      }
      ca.caNumber = caNumber;
    }

    // Update allowed fields
    if (name !== undefined) ca.name = name;
    if (phone !== undefined) ca.phone = phone;
    if (firmName !== undefined) ca.firmName = firmName;
    if (experience !== undefined) ca.experience = experience;
    if (specialization !== undefined) ca.specialization = specialization;
    if (isActive !== undefined) ca.isActive = isActive;

    // Update password if provided
    if (password) {
      ca.password = password; // Will be hashed by pre-save hook
    }

    await ca.save();

    res.status(200).json({
      success: true,
      message: 'CA updated successfully',
      data: { ca }
    });

  } catch (error) {
    console.error('Update CA error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete CA (Admin only)
// @route   DELETE /api/admin/ca
// @access  Private/Admin
const deleteCA = async (req, res) => {
  try {
    const ca = await CA.findOne();

    if (!ca) {
      return res.status(404).json({
        success: false,
        message: 'No CA found to delete'
      });
    }

    await CA.findByIdAndDelete(ca._id);

    res.status(200).json({
      success: true,
      message: 'CA deleted successfully. You can now register a new CA.'
    });

  } catch (error) {
    console.error('Delete CA error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    CA Login
// @route   POST /api/ca/login
// @access  Public
const loginCA = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find CA by email and include password
    const ca = await CA.findOne({ email }).select('+password');

    if (!ca) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if CA is active
    if (!ca.isActive) {
      return res.status(403).json({
        success: false,
        message: 'CA account is inactive. Please contact administrator.'
      });
    }

    // Verify password
    const isPasswordValid = await ca.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update login tracking
    ca.lastLogin = new Date();
    ca.loginCount += 1;
    ca.lastActiveAt = new Date();
    await ca.save();

    // Generate token
    const token = generateToken(ca._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        ca: {
          id: ca._id,
          name: ca.name,
          email: ca.email,
          phone: ca.phone,
          caNumber: ca.caNumber,
          firmName: ca.firmName,
          experience: ca.experience,
          specialization: ca.specialization,
          lastLogin: ca.lastLogin
        },
        token
      }
    });

  } catch (error) {
    console.error('CA Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get CA Profile (CA)
// @route   GET /api/ca/profile
// @access  Private/CA
const getCAProfile = async (req, res) => {
  try {
    const ca = await CA.findById(req.ca.id);

    if (!ca) {
      return res.status(404).json({
        success: false,
        message: 'CA not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { ca }
    });

  } catch (error) {
    console.error('Get CA profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  registerCA,
  getCA,
  updateCA,
  deleteCA,
  loginCA,
  getCAProfile
};

