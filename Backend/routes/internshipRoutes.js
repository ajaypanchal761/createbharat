const express = require('express');
const { body, validationResult } = require('express-validator');
const {
  createInternship,
  getAllInternships,
  getInternship,
  getMyInternships,
  updateInternship,
  deleteInternship
} = require('../controllers/internshipController');
const { protect: protectUser } = require('../middleware/auth');
const { protect: protectCompany } = require('../middleware/companyAuth');

const router = express.Router();

// Validation error handler middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Validation for creating internship
const createInternshipValidation = [
  body('title')
    .notEmpty()
    .withMessage('Job title is required')
    .bail()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Job title must be between 1-100 characters'),
  body('location')
    .notEmpty()
    .withMessage('Location is required')
    .bail()
    .trim(),
  body('duration')
    .notEmpty()
    .withMessage('Duration is required')
    .bail()
    .trim(),
  body('stipend')
    .notEmpty()
    .withMessage('Stipend information is required')
    .bail()
    .trim(),
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .bail()
    .trim()
    .isLength({ min: 5, max: 2000 })
    .withMessage('Description must be between 5-2000 characters'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .bail()
    .trim()
    .isIn(['Technology', 'Design', 'Marketing', 'Finance', 'Legal', 'Operations', 'Content', 'Sales', 'HR', 'Other'])
    .withMessage('Invalid category. Must be one of: Technology, Design, Marketing, Finance, Legal, Operations, Content, Sales, HR, Other')
];

// Public routes
router.get('/', getAllInternships);
router.get('/:id', getInternship);

// Protected routes - Company
router.post('/', protectCompany, createInternshipValidation, handleValidationErrors, createInternship);
router.get('/company/my-internships', protectCompany, getMyInternships);
router.put('/:id', protectCompany, updateInternship);
router.delete('/:id', protectCompany, deleteInternship);

module.exports = router;

