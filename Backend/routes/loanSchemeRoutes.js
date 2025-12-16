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
const upload = require('../utils/multer');

const router = express.Router();

// Custom middleware to handle both FormData and JSON
// Image field is optional - so we need to handle requests with or without files
const handleMultipartOrJson = (req, res, next) => {
  const contentType = req.get('content-type') || '';

  if (contentType.includes('multipart/form-data')) {
    // Multer will handle the multipart/form-data
    return upload.fields([{ name: 'image', maxCount: 1 }])(req, res, (err) => {
      if (err && err.code !== 'LIMIT_UNEXPECTED_FILE') {
        return next(err);
      }
      next();
    });
  } else {
    // For JSON/other requests, body is already parsed by express.json/urlencoded
    // If body is already parsed by express middleware, just continue
    if (req.body) {
      return next();
    }

    // Otherwise, manually parse JSON from raw body stream
    let rawBody = '';
    req.on('data', chunk => {
      rawBody += chunk.toString();
    });

    req.on('end', () => {
      if (rawBody) {
        try {
          req.body = JSON.parse(rawBody);
        } catch (e) {
          // Silently ignore parse errors
        }
      }
      next();
    });
  }
};

// Public routes (for users)
router.get('/schemes', getAllLoanSchemes);
router.get('/schemes/:id', getLoanSchemeById);

module.exports = router;

// Admin routes
const adminRouter = express.Router();

// Upload single image field name: 'image'
adminRouter.post('/loans/schemes', protect, handleMultipartOrJson, createLoanScheme);
adminRouter.put('/loans/schemes/:id', protect, handleMultipartOrJson, updateLoanScheme);
adminRouter.delete('/loans/schemes/:id', protect, deleteLoanScheme);
adminRouter.patch('/loans/schemes/:id/status', protect, toggleLoanSchemeStatus);
adminRouter.get('/loans/schemes/stats', protect, getLoanSchemeStats);

module.exports.adminLoanSchemeRoutes = adminRouter;

