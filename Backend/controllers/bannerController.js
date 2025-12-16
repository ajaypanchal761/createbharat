const Banner = require('../models/banner');
const { uploadToCloudinary } = require('../utils/cloudinary');

// @desc    Get all banners (public)
// @route   GET /api/banners
// @access  Public
const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true })
      .sort({ position: 1, createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: banners.length,
      data: banners
    });
  } catch (error) {
    console.error('Get all banners error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get all banners (admin)
// @route   GET /api/admin/banners
// @access  Private/Admin
const getAdminBanners = async (req, res) => {
  try {
    const banners = await Banner.find({})
      .sort({ position: 1, createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: banners.length,
      data: banners
    });
  } catch (error) {
    console.error('Get admin banners error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get single banner (admin)
// @route   GET /api/admin/banners/:id
// @access  Private/Admin
const getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }

    res.status(200).json({
      success: true,
      data: banner
    });
  } catch (error) {
    console.error('Get banner by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Create banner (admin)
// @route   POST /api/admin/banners
// @access  Private/Admin
const createBanner = async (req, res) => {
  try {
    const { title, position } = req.body;

    if (!req.files || !req.files.image) {
      return res.status(400).json({
        success: false,
        message: 'Banner image is required'
      });
    }

    // Upload image to Cloudinary
    const imageResult = await uploadToCloudinary(req.files.image[0].path, 'banners', `banner_${Date.now()}`);

    const bannerData = {
      title,
      image: req.files.image[0].filename || 'banner',
      imageUrl: imageResult.url,
      position: position || 0,
      isActive: true
    };

    const banner = await Banner.create(bannerData);

    res.status(201).json({
      success: true,
      message: 'Banner created successfully',
      data: banner
    });
  } catch (error) {
    console.error('Create banner error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update banner (admin)
// @route   PUT /api/admin/banners/:id
// @access  Private/Admin
const updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }

    const { title, position } = req.body;

    if (title) banner.title = title;
    if (position !== undefined) banner.position = position;

    // Handle image update if provided
    if (req.files && req.files.image) {
      const imageResult = await uploadToCloudinary(req.files.image[0].path, 'banners', `banner_${banner._id}_${Date.now()}`);
      banner.imageUrl = imageResult.url;
      banner.image = req.files.image[0].filename || banner.image;
    }

    await banner.save();

    res.status(200).json({
      success: true,
      message: 'Banner updated successfully',
      data: banner
    });
  } catch (error) {
    console.error('Update banner error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete banner (admin)
// @route   DELETE /api/admin/banners/:id
// @access  Private/Admin
const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }

    await Banner.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Banner deleted successfully'
    });
  } catch (error) {
    console.error('Delete banner error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getAllBanners,
  getAdminBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner
};

