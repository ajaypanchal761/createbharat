const express = require('express');
const { body } = require('express-validator');
const {
  loginAdmin,
  getMe,
  getAllAdmins,
  createAdmin,
  updateProfile,
  changePassword,
  updateAdmin,
  deleteAdmin,
  adminListMentorBookings,
  adminUpdateMentorBookingStatus,
  getAllUsersForAdmin,
  getUserByIdForAdmin,
  updateUserForAdmin,
  deleteUserForAdmin,
  deactivateUserForAdmin
} = require('../controllers/adminController');
const { getAdminPaymentHistory } = require('../controllers/legalSubmissionController');
const { protect, authorize, protect: adminProtect } = require('../middleware/adminAuth');

const router = express.Router();

// Validation rules
const loginValidation = [
  body('email').optional().isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('username').optional().isLength({ min: 3, max: 30 }).withMessage('Username must be between 3-30 characters'),
  body('password').notEmpty().withMessage('Password is required')
];

const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
];

const createAdminValidation = [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role').optional().isIn(['super_admin', 'admin', 'moderator']).withMessage('Invalid role')
];

// Public routes
router.post('/login', loginValidation, loginAdmin);

// Protected routes (Admin)
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePasswordValidation, changePassword);

// Protected routes (Super Admin only)
router.get('/', protect, authorize('super_admin'), getAllAdmins);
router.post('/create', protect, authorize('super_admin'), createAdminValidation, createAdmin);
router.put('/:id', protect, authorize('super_admin'), updateAdmin);
router.delete('/:id', protect, authorize('super_admin'), deleteAdmin);

router.get('/mentor-bookings', adminProtect, adminListMentorBookings);
router.put('/mentor-bookings/:id/status', adminProtect, adminUpdateMentorBookingStatus);

// User Management Routes (Admin access)
router.get('/users', adminProtect, getAllUsersForAdmin);
router.get('/users/:id', adminProtect, getUserByIdForAdmin);
router.put('/users/:id', adminProtect, updateUserForAdmin);
router.delete('/users/:id', adminProtect, deleteUserForAdmin);
router.patch('/users/:id/deactivate', adminProtect, deactivateUserForAdmin);

// Legal Service Payment History (Admin access)
router.get('/legal-payments', adminProtect, getAdminPaymentHistory);

module.exports = router;

