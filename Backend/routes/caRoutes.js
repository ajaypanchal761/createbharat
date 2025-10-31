const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  registerCA,
  getCA,
  updateCA,
  deleteCA,
  loginCA,
  getCAProfile
} = require('../controllers/caController');
const { protect: adminProtect } = require('../middleware/adminAuth');
const { protect: caProtect } = require('../middleware/caAuth');

// Validation middleware
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').matches(/^[6-9]\d{9}$/).withMessage('Please provide a valid 10-digit phone number'),
  body('caNumber').trim().notEmpty().withMessage('CA Number is required'),
  body('firmName').trim().notEmpty().withMessage('Firm Name is required'),
  body('experience').trim().notEmpty().withMessage('Experience is required'),
  body('specialization').trim().notEmpty().withMessage('Specialization is required')
];

const updateValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Please provide a valid email'),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').optional().matches(/^[6-9]\d{9}$/).withMessage('Please provide a valid 10-digit phone number'),
  body('caNumber').optional().trim().notEmpty().withMessage('CA Number cannot be empty'),
  body('firmName').optional().trim().notEmpty().withMessage('Firm Name cannot be empty'),
  body('experience').optional().trim().notEmpty().withMessage('Experience cannot be empty'),
  body('specialization').optional().trim().notEmpty().withMessage('Specialization cannot be empty')
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// Admin routes - CA management
router.post('/admin/register', adminProtect, registerValidation, registerCA);
router.get('/admin', adminProtect, getCA);
router.put('/admin', adminProtect, updateValidation, updateCA);
router.delete('/admin', adminProtect, deleteCA);

// CA routes - Authentication and profile
router.post('/login', loginValidation, loginCA);
router.get('/profile', caProtect, getCAProfile);

module.exports = router;

