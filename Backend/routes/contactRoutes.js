const express = require('express');
const { submitContactForm } = require('../controllers/contactController');

const router = express.Router();

// Public route - anyone can submit contact form
router.post('/', submitContactForm);

module.exports = router;

