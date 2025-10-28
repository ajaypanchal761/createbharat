const express = require('express');
const {
  getAllLoanSchemes,
  getLoanSchemeById,
  createLoanScheme,
  updateLoanScheme,
  deleteLoanScheme,
  toggleLoanSchemeStatus,
  getLoanSchemeStats
} = require('../controllers/loanSchemeController');
const { protect } = require('../middleware/adminAuth');

const router = express.Router();

// Public routes (for users)
router.get('/schemes', getAllLoanSchemes);
router.get('/schemes/:id', getLoanSchemeById);

module.exports = router;

// Admin routes
const adminRouter = express.Router();

adminRouter.post('/loans/schemes', protect, createLoanScheme);
adminRouter.put('/loans/schemes/:id', protect, updateLoanScheme);
adminRouter.delete('/loans/schemes/:id', protect, deleteLoanScheme);
adminRouter.patch('/loans/schemes/:id/status', protect, toggleLoanSchemeStatus);
adminRouter.get('/loans/schemes/stats', protect, getLoanSchemeStats);

module.exports.adminLoanSchemeRoutes = adminRouter;

