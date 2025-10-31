const express = require('express');
const {
  createLead
} = require('../controllers/bankLeadController');

const router = express.Router();

// Public route - anyone can submit bank account opening form
router.post('/submit', createLead);

module.exports = router;

