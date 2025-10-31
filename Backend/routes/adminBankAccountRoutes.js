const express = require('express');
const {
  getAllLeads,
  getLeadById,
  updateLeadStatus,
  deleteLead
} = require('../controllers/bankLeadController');
const { protect: adminProtect, authorize } = require('../middleware/adminAuth');

const router = express.Router();

// All routes require admin authentication and master admin authorization
router.use(adminProtect);

// Get all bank leads (Master Admin only)
router.get('/bank-account/leads', authorize('super_admin'), getAllLeads);

// Get single bank lead by ID (Master Admin only)
router.get('/bank-account/leads/:id', authorize('super_admin'), getLeadById);

// Update bank lead status (Master Admin only)
router.put('/bank-account/leads/:id/status', authorize('super_admin'), updateLeadStatus);

// Delete bank lead (Master Admin only)
router.delete('/bank-account/leads/:id', authorize('super_admin'), deleteLead);

module.exports = router;

