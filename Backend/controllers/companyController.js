const Company = require('../models/company');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Generate JWT Token
const generateToken = (companyId) => {
  return jwt.sign({ companyId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @desc    Register a new company
// @route   POST /api/company/register
// @access  Public
const registerCompany = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      companyName,
      email,
      password,
      industry,
      companySize,
      website,
      description,
      address
    } = req.body;

    // Check if company already exists
    const existingCompany = await Company.findOne({ email });

    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create new company
    const companyData = {
      companyName,
      email,
      password,
      industry,
      companySize
    };

    // Only include optional fields if they are provided and not empty
    if (website && website.trim() !== '' && !website.includes('localhost') && !website.includes('127.0.0.1')) {
      companyData.website = website;
    }
    if (description && description.trim() !== '') {
      companyData.description = description;
    }
    if (address && Object.keys(address).length > 0) {
      companyData.address = address;
    }

    const company = await Company.create(companyData);

    // Generate token for immediate login
    const token = generateToken(company._id);

    res.status(201).json({
      success: true,
      message: 'Company registered successfully.',
      data: {
        company: {
          id: company._id,
          companyName: company.companyName,
          email: company.email,
          industry: company.industry,
          companySize: company.companySize,
          website: company.website,
          description: company.description,
          isEmailVerified: company.isEmailVerified
        },
        token
      }
    });

  } catch (error) {
    console.error('Company registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Login company
// @route   POST /api/company/login
// @access  Public
const loginCompany = async (req, res) => {
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

    const company = await Company.findOne({ email }).select('+password');

    if (!company) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if company is active
    if (!company.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Check if company is blocked
    if (company.isBlocked) {
      return res.status(401).json({
        success: false,
        message: 'Account is blocked. Please contact support.'
      });
    }

    // Check password
    const isPasswordValid = await company.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login and activity
    company.lastLogin = new Date();
    company.lastActiveAt = new Date();
    company.loginCount += 1;
    await company.save();

    // Generate token
    const token = generateToken(company._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        company: {
          id: company._id,
          companyName: company.companyName,
          email: company.email,
          industry: company.industry,
          companySize: company.companySize,
          website: company.website,
          description: company.description,
          isEmailVerified: company.isEmailVerified,
          lastLogin: company.lastLogin,
          logo: company.logo,
          stats: company.stats
        },
        token
      }
    });

  } catch (error) {
    console.error('Company login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get current company profile
// @route   GET /api/company/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const company = await Company.findById(req.company.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        company: {
          id: company._id,
          companyName: company.companyName,
          email: company.email,
          industry: company.industry,
          companySize: company.companySize,
          website: company.website,
          description: company.description,
          address: company.address,
          logo: company.logo,
          coverImage: company.coverImage,
          role: company.role,
          isEmailVerified: company.isEmailVerified,
          isVerified: company.isVerified,
          stats: company.stats,
          socialLinks: company.socialLinks,
          createdAt: company.createdAt,
          lastLogin: company.lastLogin
        }
      }
    });

  } catch (error) {
    console.error('Get company profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update company profile
// @route   PUT /api/company/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      companyName,
      industry,
      companySize,
      website,
      description,
      address,
      socialLinks
    } = req.body;

    const company = await Company.findById(req.company.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Update company fields
    if (companyName) company.companyName = companyName;
    if (industry) company.industry = industry;
    if (companySize) company.companySize = companySize;
    if (website !== undefined) company.website = website;
    if (description !== undefined) company.description = description;
    if (address) company.address = { ...company.address, ...address };
    if (socialLinks) company.socialLinks = { ...company.socialLinks, ...socialLinks };

    await company.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        company: {
          id: company._id,
          companyName: company.companyName,
          email: company.email,
          industry: company.industry,
          companySize: company.companySize,
          website: company.website,
          description: company.description,
          address: company.address,
          socialLinks: company.socialLinks
        }
      }
    });

  } catch (error) {
    console.error('Update company profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  registerCompany,
  loginCompany,
  getMe,
  updateProfile
};

