const express = require('express');
const { body } = require('express-validator');
const {
  applyToInternship,
  getApplication,
  getCompanyApplications,
  getUserApplications,
  updateApplicationStatus,
  viewApplication
} = require('../controllers/applicationController');
const { protect: protectUser } = require('../middleware/auth');
const { protect: protectCompany } = require('../middleware/companyAuth');

const router = express.Router();

// Validation for applying
const applyValidation = [
  body('internshipId').isMongoId().withMessage('Valid internship ID is required'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required')
];

// Protected routes - Users
router.post('/', protectUser, applyValidation, applyToInternship);
// Specific routes must come before parameterized routes
router.get('/user/my-applications', protectUser, getUserApplications);
router.get('/company/my-applications', protectCompany, getCompanyApplications);
router.get('/:id', protectUser, getApplication);

// Protected routes - Companies
router.put('/:id/status', protectCompany, updateApplicationStatus);
router.put('/:id/view', protectCompany, viewApplication);

module.exports = router;

