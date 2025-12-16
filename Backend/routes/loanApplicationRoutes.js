const express = require('express');
const {
  submitLoanApplication,
  getAllLoanApplications,
  getLoanApplicationById,
  updateLoanApplicationStatus,
  deleteLoanApplication,
  getLoanApplicationStats
} = require('../controllers/loanApplicationController');
const { protect } = require('../middleware/adminAuth');
const { optionalAuth } = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

// Public route - Submit loan application (with optional user authentication)
router.post('/applications', 
  optionalAuth, // Optional: user can be authenticated or not
  upload.fields([{ name: 'businessDocuments', maxCount: 1 }]),
  submitLoanApplication
);

module.exports = router;

// Admin routes - separate router for admin endpoints
const adminRouter = express.Router();

adminRouter.get('/loans/applications', protect, getAllLoanApplications);
adminRouter.get('/loans/applications/stats', protect, getLoanApplicationStats);
adminRouter.get('/loans/applications/:id', protect, getLoanApplicationById);
adminRouter.put('/loans/applications/:id/status', protect, updateLoanApplicationStatus);
adminRouter.delete('/loans/applications/:id', protect, deleteLoanApplication);

module.exports.adminLoanApplicationRoutes = adminRouter;

