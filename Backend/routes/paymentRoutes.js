const express = require('express');
const { getAllPayments } = require('../controllers/paymentController');
const { protect: adminProtect } = require('../middleware/adminAuth');

const router = express.Router();

// All routes require admin authentication
router.use(adminProtect);

// Get all payments
router.get('/payments', getAllPayments);

module.exports = router;

