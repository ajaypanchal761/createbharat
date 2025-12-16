const express = require('express');
const { body } = require('express-validator');
const { registerUser, loginUser, sendLoginOTP, verifyOTP, resendOTP, getMe, updateProfile, changePassword, uploadProfileImage } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const upload = require('../utils/multer');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('phone').matches(/^[6-9]\d{9}$/).withMessage('Please provide a valid 10-digit phone number'),
  body('dateOfBirth').optional().isISO8601().withMessage('Please provide a valid date of birth'),
  body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Please provide a valid gender'),
  body('username').optional().isLength({ min: 3, max: 30 }).withMessage('Username must be between 3-30 characters'),
  body('userType').optional().isIn(['individual', 'business', 'startup', 'ngo']).withMessage('Invalid user type')
];

const loginValidation = [
  body('email').optional().isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('phone').optional().matches(/^[6-9]\d{9}$/).withMessage('Please provide a valid 10-digit phone number'),
  body('password').notEmpty().withMessage('Password is required'),
  body('loginMethod').optional().isIn(['email', 'phone']).withMessage('Invalid login method')
];

const loginOtpValidation = [
  body('phone').matches(/^[6-9]\d{9}$/).withMessage('Please provide a valid 10-digit phone number')
];

const otpValidation = [
  body('phone').matches(/^[6-9]\d{9}$/).withMessage('Please provide a valid 10-digit phone number'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
];

const resendOtpValidation = [
  body('phone').matches(/^[6-9]\d{9}$/).withMessage('Please provide a valid 10-digit phone number')
];

const updateProfileValidation = [
  body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
  body('phone').optional().matches(/^[6-9]\d{9}$/).withMessage('Please provide a valid 10-digit phone number'),
  body('dateOfBirth').optional().isISO8601().withMessage('Please provide a valid date of birth'),
  body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Please provide a valid gender')
];

const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
];

// Public routes
router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);
router.post('/login-otp', loginOtpValidation, sendLoginOTP);
router.post('/verify-otp', otpValidation, verifyOTP);
router.post('/resend-otp', resendOtpValidation, resendOTP);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfileValidation, updateProfile);
router.put('/profile/image', protect, upload.single('image'), uploadProfileImage);
router.put('/change-password', protect, changePasswordValidation, changePassword);

module.exports = router;
