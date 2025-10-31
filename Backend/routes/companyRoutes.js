const express = require('express');
const { body } = require('express-validator');
const { registerCompany, loginCompany, getMe, updateProfile } = require('../controllers/companyController');
const { protect } = require('../middleware/companyAuth');
const { uploadDocuments } = require('../utils/multer');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('companyName').trim().notEmpty().withMessage('Company name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('industry').trim().notEmpty().withMessage('Industry is required'),
  body('companySize').isIn(['1-10 employees', '11-50 employees', '51-200 employees', '201-500 employees', '500+ employees']).withMessage('Invalid company size'),
  body('website').optional({ checkFalsy: true, nullable: true }).custom((value) => {
    if (!value || value.trim() === '') return true;
    // Don't validate if it's a localhost URL (might be accidentally sent from frontend)
    if (typeof value === 'string' && (value.includes('localhost') || value.includes('127.0.0.1'))) {
      return true; // Allow empty or skip validation for localhost URLs
    }
    // Check if it's a valid URL
    try {
      const urlToCheck = value.startsWith('http') ? value : `https://${value}`;
      new URL(urlToCheck);
      return true;
    } catch {
      return false;
    }
  }).withMessage('Please provide a valid website URL'),
  body('description').optional({ checkFalsy: true, nullable: true }).isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters')
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

const updateProfileValidation = [
  body('companyName').optional().trim().notEmpty().withMessage('Company name cannot be empty'),
  body('industry').optional().trim().notEmpty().withMessage('Industry cannot be empty'),
  body('companySize').optional().isIn(['1-10 employees', '11-50 employees', '51-200 employees', '201-500 employees', '500+ employees']).withMessage('Invalid company size'),
  body('website').optional({ checkFalsy: true, nullable: true }).custom((value) => {
    if (!value || value.trim() === '') return true;
    if (typeof value === 'string' && (value.includes('localhost') || value.includes('127.0.0.1'))) {
      return true;
    }
    try {
      const urlToCheck = value.startsWith('http') ? value : `https://${value}`;
      new URL(urlToCheck);
      return true;
    } catch {
      return false;
    }
  }).withMessage('Please provide a valid website URL'),
  body('description').optional({ checkFalsy: true, nullable: true }).isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters')
];

// Public routes
router.post('/register', registerValidation, registerCompany);
router.post('/login', loginValidation, loginCompany);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, uploadDocuments.fields([
  { name: 'registrationCertificate', maxCount: 1 },
  { name: 'gstCertificate', maxCount: 1 }
]), updateProfile);

module.exports = router;

