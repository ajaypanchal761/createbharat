const express = require('express');
const {
  getAllLeads,
  getLeadById,
  updateLeadStatus,
  deleteLead
} = require('../controllers/webDevelopmentController');
const { protect: adminProtect } = require('../middleware/adminAuth');

const router = express.Router();

// All routes require admin authentication
router.use(adminProtect);

// Get all leads
router.get('/web-development/leads', getAllLeads);

// Get single lead by ID
router.get('/web-development/leads/:id', getLeadById);

// Update lead status
router.put('/web-development/leads/:id/status', updateLeadStatus);

// Delete lead
router.delete('/web-development/leads/:id', deleteLead);

module.exports = router;

