const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getCASubmissions,
  getCASubmissionById,
  updateSubmissionStatus
} = require('../controllers/legalSubmissionController');
const { protect: caProtect } = require('../middleware/caAuth');

// Validation middleware
const statusValidation = [
  body('status').trim().notEmpty().withMessage('Status is required'),
  body('caNotes').optional().trim(),
  body('rejectionReason').optional().trim()
];

// CA routes - view and manage submissions
router.get('/submissions', caProtect, getCASubmissions);
router.get('/submissions/:id', caProtect, getCASubmissionById);
router.put('/submissions/:id/status', caProtect, statusValidation, updateSubmissionStatus);

module.exports = router;

