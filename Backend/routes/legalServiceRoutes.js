const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getAllServices,
  getServiceById,
  getCAServices,
  createService,
  updateService,
  deleteService
} = require('../controllers/legalServiceController');
const { protect: caProtect } = require('../middleware/caAuth');

// Validation middleware
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

// Public routes - for users
router.get('/services', getAllServices);
router.get('/services/:id', getServiceById);

// CA routes - service management
router.get('/legal-services', caProtect, getCAServices);
router.post('/legal-services', caProtect, serviceValidation, createService);
router.put('/legal-services/:id', caProtect, serviceUpdateValidation, updateService);
router.delete('/legal-services/:id', caProtect, deleteService);

module.exports = router;

