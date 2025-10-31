const express = require('express');
const router = express.Router();
const {
  getAllBanners
} = require('../controllers/bannerController');

// Public routes
router.get('/', getAllBanners);

module.exports = router;

