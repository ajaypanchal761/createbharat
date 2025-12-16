const express = require('express');
const { body } = require('express-validator');
const {
  registerMentor,
  loginMentor,
  getMe,
  updateProfile,
  changePassword,
  uploadProfileImage,
  getAllMentors,
  getMentorById,
  createBooking,
  updatePaymentStatus,
  getMentorBookings,
  updateBookingStatus,
  getUserBookings,
  addBookingReview,
  setSessionLink,
  mentorUpdateBookingDetails,
  getBookingById,
  createRazorpayOrder,
  getSpecializations,
  verifyAndUpdatePayment,
  createRazorpayPaymentLink,
  handlePaymentCallback
} = require('../controllers/mentorController');
const { protect: mentorProtect } = require('../middleware/mentorAuth');
const { protect: userProtect } = require('../middleware/auth');
const upload = require('../utils/multer');
const { resolveSpecialization } = require('../utils/mentorSpecializations');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('specialization')
    .trim()
    .notEmpty()
    .withMessage('Specialization is required')
    .custom((value) => {
      if (!resolveSpecialization(value)) {
        throw new Error('Invalid specialization selected');
      }
      return true;
    }),
  body('experience').trim().notEmpty().withMessage('Experience is required')
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

const bookingValidation = [
  body('sessionType').isIn(['20min', '50min', '90min']).withMessage('Invalid session type')
  // date and time are not required from user side, so remove those validations
];

const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
];

const allowedPaymentMethods = ['upi', 'card', 'netbanking', 'wallet', 'razorpay'];

const paymentValidation = [
  body('paymentMethod')
    .optional({ nullable: true })
    .isString()
    .trim()
    .customSanitizer((value) => value ? value.toLowerCase() : 'razorpay')
    .default('razorpay')
    .isIn(allowedPaymentMethods)
    .withMessage(`Invalid payment method. Must be one of: ${allowedPaymentMethods.join(', ')}`),
  body('transactionId')
    .optional({ nullable: true })
    .isString()
    .trim()
    .withMessage('Transaction ID must be a string'),
  body('razorpayOrderId')
    .optional({ nullable: true })
    .isString()
    .trim()
    .custom((value) => {
      // Allow empty or valid order ID format
      if (!value || value === '') return true;
      return /^order_[A-Za-z0-9]+$/.test(value);
    })
    .withMessage('Invalid Razorpay order id format'),
  body('razorpaySignature')
    .optional({ nullable: true })
    .isString()
    .trim()
    .custom((value) => {
      // Allow empty or valid signature format (64 hex chars)
      if (!value || value === '') return true;
      return /^[a-f0-9]{64}$/i.test(value);
    })
    .withMessage('Invalid Razorpay signature format')
];

// Public routes
router.post('/register', registerValidation, registerMentor);
router.post('/login', loginValidation, loginMentor);
router.get('/', getAllMentors);
router.get('/specializations', getSpecializations);

// Protected routes - Mentor
router.get('/me/profile', mentorProtect, getMe);
router.put('/profile', mentorProtect, updateProfile);
router.put('/change-password', mentorProtect, changePasswordValidation, changePassword);
router.put('/profile/image', mentorProtect, upload.single('image'), uploadProfileImage);
router.get('/dashboard/bookings', mentorProtect, getMentorBookings);
router.put('/bookings/:id/status', mentorProtect, updateBookingStatus);
router.put('/bookings/:id/session-link', mentorProtect, setSessionLink);
router.put('/bookings/:id/details', mentorProtect, mentorUpdateBookingDetails);

// Protected routes - User (must come before /:id routes)
router.get('/my-bookings', userProtect, getUserBookings);
router.post('/:id/book', userProtect, bookingValidation, createBooking);
router.put('/bookings/:id/payment', userProtect, paymentValidation, updatePaymentStatus);
router.post('/bookings/:id/verify-payment', userProtect, verifyAndUpdatePayment);
router.get('/bookings/:id', userProtect, getBookingById);
router.put('/bookings/:id/review', userProtect, addBookingReview);
router.post('/bookings/:id/create-order', userProtect, createRazorpayOrder);
router.post('/bookings/:id/create-payment-link', userProtect, createRazorpayPaymentLink);
// Public callback route (called by Razorpay)
router.get('/bookings/:id/payment-callback', handlePaymentCallback);

// Keep dynamic :id route LAST to avoid conflicts with static paths
router.get('/:id', getMentorById);

module.exports = router;

