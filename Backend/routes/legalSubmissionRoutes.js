const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createSubmission,
  createRazorpayOrder,
  updatePayment,
  getUserSubmissions,
  getSubmissionById,
  getCASubmissions,
  getCASubmissionById,
  updateSubmissionStatus
} = require('../controllers/legalSubmissionController');
const { protect: userProtect } = require('../middleware/auth');
const { protect: caProtect } = require('../middleware/caAuth');
const { uploadLegalDocuments } = require('../utils/multer');

// Validation middleware
const submissionValidation = [
  body('serviceId').trim().notEmpty().withMessage('Service ID is required'),
  body('category').optional().trim()
];

const paymentValidation = [
  body('paymentMethod').trim().notEmpty().withMessage('Payment method is required'),
  body('razorpay_order_id').optional().trim(),
  body('razorpay_payment_id').optional().trim(),
  body('razorpay_signature').optional().trim()
];

const statusValidation = [
  body('status').trim().notEmpty().withMessage('Status is required'),
  body('caNotes').optional().trim(),
  body('rejectionReason').optional().trim()
];

// User routes - submission management
router.post('/submissions', userProtect, uploadLegalDocuments.array('documents', 20), submissionValidation, createSubmission);
router.post('/submissions/:id/create-order', userProtect, createRazorpayOrder);
router.put('/submissions/:id/payment', userProtect, paymentValidation, updatePayment);
router.get('/submissions', userProtect, getUserSubmissions);
router.get('/submissions/:id', userProtect, getSubmissionById);

// CA routes - view and manage submissions (these routes are handled in server.js with /api/ca prefix)

module.exports = router;

