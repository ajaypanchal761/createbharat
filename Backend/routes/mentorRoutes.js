const express = require('express');
const { body } = require('express-validator');
const {
  registerMentor,
  loginMentor,
  getMe,
  updateProfile,
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
  createRazorpayOrder
} = require('../controllers/mentorController');
const { protect: mentorProtect } = require('../middleware/mentorAuth');
const { protect: userProtect } = require('../middleware/auth');
const upload = require('../utils/multer');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('specialization').trim().notEmpty().withMessage('Specialization is required'),
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

const paymentValidation = [
  body('paymentMethod').isIn(['upi', 'card', 'netbanking', 'wallet', 'razorpay']).withMessage('Invalid payment method'),
  body('transactionId').optional().trim()
];

// Public routes
router.post('/register', registerValidation, registerMentor);
router.post('/login', loginValidation, loginMentor);
router.get('/', getAllMentors);

// Protected routes - Mentor
router.get('/me/profile', mentorProtect, getMe);
router.put('/profile', mentorProtect, updateProfile);
router.put('/profile/image', mentorProtect, upload.single('image'), uploadProfileImage);
router.get('/dashboard/bookings', mentorProtect, getMentorBookings);
router.put('/bookings/:id/status', mentorProtect, updateBookingStatus);
router.put('/bookings/:id/session-link', mentorProtect, setSessionLink);
router.put('/bookings/:id/details', mentorProtect, mentorUpdateBookingDetails);

// Protected routes - User (must come before /:id routes)
router.get('/my-bookings', userProtect, getUserBookings);
router.post('/:id/book', userProtect, bookingValidation, createBooking);
router.put('/bookings/:id/payment', userProtect, paymentValidation, updatePaymentStatus);
router.get('/bookings/:id', userProtect, getBookingById);
router.put('/bookings/:id/review', userProtect, addBookingReview);
router.post('/bookings/:id/create-order', userProtect, createRazorpayOrder);

// Keep dynamic :id route LAST to avoid conflicts with static paths
router.get('/:id', getMentorById);

module.exports = router;

