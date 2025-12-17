const express = require('express');
const {
  getAllOtherServiceSubmissions,
  getOtherServiceSubmissionById,
  updateOtherServiceSubmissionStatus,
  deleteOtherServiceSubmission,
} = require('../controllers/otherServiceController');
const { protect: adminProtect } = require('../middleware/adminAuth');

const router = express.Router();

router.use(adminProtect);

router.get('/other-services', getAllOtherServiceSubmissions);
router.get('/other-services/:id', getOtherServiceSubmissionById);
router.put('/other-services/:id/status', updateOtherServiceSubmissionStatus);
router.delete('/other-services/:id', deleteOtherServiceSubmission);

module.exports = router;

