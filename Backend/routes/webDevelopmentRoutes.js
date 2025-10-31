const express = require('express');
const {
  createLead
} = require('../controllers/webDevelopmentController');

const router = express.Router();

// Public route - anyone can submit a project
router.post('/submit', createLead);

module.exports = router;

