const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  registerCA,
  getCA,
  updateCA,
  deleteCA,
  loginCA,
  getCAProfile,
  updateCAProfile
} = require('../controllers/caController');
const { getCAServices, getCAServiceById, createService, updateService, deleteService } = require('../controllers/legalServiceController');
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

const profileUpdateValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Please provide a valid email'),
  body('phone').optional().matches(/^[6-9]\d{9}$/).withMessage('Please provide a valid 10-digit phone number'),
  body('caNumber').optional().trim().notEmpty().withMessage('CA Number cannot be empty'),
  body('firmName').optional().trim().notEmpty().withMessage('Firm Name cannot be empty'),
  body('experience').optional().trim().notEmpty().withMessage('Experience cannot be empty'),
  body('specialization').optional().trim().notEmpty().withMessage('Specialization cannot be empty'),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('currentPassword').optional().notEmpty().withMessage('Current password is required when changing password')
];

const serviceValidation = [
  body('name').trim().notEmpty().withMessage('Service name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').optional().isIn(['Business', 'Intellectual Property', 'IP Rights', 'Tax', 'Certification', 'Compliance']).withMessage('Invalid category'),
  body('price').optional().trim().notEmpty().withMessage('Price cannot be empty'),
  body('duration').optional().trim().notEmpty().withMessage('Duration cannot be empty')
];

const serviceUpdateValidation = [
  body('name').optional().trim().notEmpty().withMessage('Service name cannot be empty'),
  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
  body('category').optional().isIn(['Business', 'Intellectual Property', 'IP Rights', 'Tax', 'Certification', 'Compliance']).withMessage('Invalid category'),
  body('price').optional().trim().notEmpty().withMessage('Price cannot be empty'),
  body('duration').optional().trim().notEmpty().withMessage('Duration cannot be empty')
];

// Admin routes - CA management
router.post('/admin/register', adminProtect, registerValidation, registerCA);
router.get('/admin', adminProtect, getCA);
router.put('/admin', adminProtect, updateValidation, updateCA);
router.delete('/admin', adminProtect, deleteCA);

// CA routes - Authentication and profile
router.post('/login', loginValidation, loginCA);
router.get('/profile', caProtect, getCAProfile);
router.put('/profile', caProtect, profileUpdateValidation, updateCAProfile);

// CA routes - Legal services
router.get('/legal-services', caProtect, getCAServices);
router.get('/legal-services/:id', caProtect, getCAServiceById);
router.post('/legal-services', caProtect, serviceValidation, createService);
router.put('/legal-services/:id', caProtect, serviceUpdateValidation, updateService);
router.delete('/legal-services/:id', caProtect, deleteService);

module.exports = router;

