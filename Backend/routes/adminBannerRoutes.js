const express = require('express');
const router = express.Router();
const {
  getAdminBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner
} = require('../controllers/bannerController');
const { protect: adminProtect } = require('../middleware/adminAuth');
const upload = require('../utils/multer');

// Middleware to handle multipart/form-data or JSON
const handleMultipartOrJson = (req, res, next) => {
  // Check if content-type is multipart/form-data
  if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
    // Let multer handle it
    next();
  } else {
    // Parse JSON body
    express.json()(req, res, next);
  }
};

// Admin routes
router.get('/', adminProtect, getAdminBanners);
router.get('/:id', adminProtect, getBannerById);
router.post('/', adminProtect, upload.fields([{ name: 'image', maxCount: 1 }]), createBanner);
router.put('/:id', adminProtect, upload.fields([{ name: 'image', maxCount: 1 }]), updateBanner);
router.delete('/:id', adminProtect, deleteBanner);

module.exports = router;

