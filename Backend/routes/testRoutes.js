const express = require('express');
const { testSMSConnection, getSMSBalance, sendOTP } = require('../utils/notifications');
const { protect, authorize } = require('../middleware/auth');
const { cloudinary } = require('../utils/cloudinary');

const router = express.Router();

// @desc    Test SMS connection
// @route   GET /api/test/sms-connection
// @access  Private/Admin
const testSMS = async (req, res) => {
  try {
    const result = await testSMSConnection();

    res.status(200).json({
      success: true,
      message: 'SMS connection test completed',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'SMS connection test failed',
      error: error.message
    });
  }
};

// @desc    Get SMS balance
// @route   GET /api/test/sms-balance
// @access  Private/Admin
const getSMSBalanceInfo = async (req, res) => {
  try {
    const balance = await getSMSBalance();

    res.status(200).json({
      success: true,
      message: 'SMS balance retrieved successfully',
      data: balance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get SMS balance',
      error: error.message
    });
  }
};

// @desc    Send test OTP
// @route   POST /api/test/send-otp
// @access  Private/Admin
const sendTestOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    const testOTP = '123456';
    const result = await sendOTP(phone, testOTP);

    res.status(200).json({
      success: true,
      message: 'Test OTP sent successfully',
      data: {
        phone,
        otp: testOTP,
        result
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to send test OTP',
      error: error.message
    });
  }
};

// @desc    Test Cloudinary configuration (Public for debugging)
// @route   GET /api/test/cloudinary-config
// @access  Public (for debugging)
router.get('/cloudinary-config', (req, res) => {
  try {
    const config = cloudinary.config();
    res.status(200).json({
      success: true,
      message: 'Cloudinary configuration retrieved',
      data: {
        cloud_name: config.cloud_name ? 'SET' : 'NOT SET',
        api_key: config.api_key ? 'SET' : 'NOT SET',
        api_secret: config.api_secret ? 'SET' : 'NOT SET'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get Cloudinary config',
      error: error.message
    });
  }
});

// All routes require admin access
router.use(protect);
router.use(authorize('admin'));

router.get('/sms-connection', testSMS);
router.get('/sms-balance', getSMSBalanceInfo);
router.post('/send-otp', sendTestOTP);

module.exports = router;
