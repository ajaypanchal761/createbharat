const express = require('express');
const {
  getAllPitches,
  getPitchByIdAdmin,
  updatePitchStatus,
  downloadPitchDocument
} = require('../controllers/pitchController');
const { protect } = require('../middleware/adminAuth');

const router = express.Router();

// Admin routes
router.get('/', protect, getAllPitches);
router.get('/:id', protect, getPitchByIdAdmin);
router.put('/:id/status', protect, updatePitchStatus);
router.get('/:id/download/:documentType', protect, downloadPitchDocument);

module.exports = router;

