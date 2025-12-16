const express = require('express');
const {
  submitPitch,
  getMyPitches,
  getPitchById,
  downloadPitchDocumentUser
} = require('../controllers/pitchController');
const { protect } = require('../middleware/auth');
const { uploadPitchDocuments } = require('../utils/multer');

const router = express.Router();

// User routes
router.post(
  '/submit',
  protect,
  uploadPitchDocuments.fields([
    { name: 'pitchDeck', maxCount: 1 },
    { name: 'executiveSummary', maxCount: 1 },
    { name: 'financials', maxCount: 1 }
  ]),
  submitPitch
);

router.get('/my-pitches', protect, getMyPitches);
router.get('/:id/download/:documentType', protect, downloadPitchDocumentUser);
router.get('/:id', protect, getPitchById);

module.exports = router;

