const express = require('express');
const { createOtherServiceSubmission } = require('../controllers/otherServiceController');

const router = express.Router();

// Public submission route
router.post('/submit', createOtherServiceSubmission);

module.exports = router;

