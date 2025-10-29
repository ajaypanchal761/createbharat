const express = require('express');
const { body } = require('express-validator');
const {
  registerMentor,
  loginMentor,
  getMe,
  updateProfile,
  getAllMentors,
  getMentorById,
  createBooking,
  updatePaymentStatus,
  getMentorBookings,
  updateBookingStatus,
  getUserBookings
} = require('../controllers/mentorController');
const { protect: mentorProtect } = require('../middleware/mentorAuth');
const { protect: userProtect } = require('../middleware/auth');

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
  body('sessionType').isIn(['20min', '50min', '90min']).withMessage('Invalid session type'),
  body('date').notEmpty().withMessage('Date is required'),
  body('time').notEmpty().withMessage('Time is required'),
  body('message').optional().isLength({ max: 500 }).withMessage('Message cannot exceed 500 characters')
];

const paymentValidation = [
  body('paymentMethod').isIn(['upi', 'card', 'netbanking', 'wallet']).withMessage('Invalid payment method'),
  body('transactionId').optional().trim()
];

// Public routes
router.post('/register', registerValidation, registerMentor);
router.post('/login', loginValidation, loginMentor);
router.get('/', getAllMentors);
router.get('/:id', getMentorById);

// Protected routes - Mentor
router.get('/me/profile', mentorProtect, getMe);
router.put('/profile', mentorProtect, updateProfile);
router.get('/dashboard/bookings', mentorProtect, getMentorBookings);
router.put('/bookings/:id/status', mentorProtect, updateBookingStatus);

// Protected routes - User (must come before /:id routes)
router.get('/my-bookings', userProtect, getUserBookings);
router.post('/:id/book', userProtect, bookingValidation, createBooking);
router.put('/bookings/:id/payment', userProtect, paymentValidation, updatePaymentStatus);

module.exports = router;

