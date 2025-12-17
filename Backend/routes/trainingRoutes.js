const express = require('express');
const {
  getPublishedCourses,
  getCourseDetails,
  enrollInCourse,
  getMyProgress,
  completeTopic,
  submitQuiz,
  createCertificateOrder,
  createCertificatePaymentLink,
  handleCertificatePaymentCallback,
  updateCertificatePayment,
  downloadAssignedCertificate
} = require('../controllers/trainingController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/courses', getPublishedCourses);
router.get('/courses/:id', getCourseDetails);

// Protected routes (User)
router.post('/courses/:courseId/enroll', protect, enrollInCourse);
router.get('/my-progress', protect, getMyProgress);
router.patch('/progress/:courseId/complete-topic/:topicId', protect, completeTopic);
router.post('/quizzes/:quizId/submit', protect, submitQuiz);

// Certificate payment routes
router.post('/certificate/:courseId/create-order', protect, createCertificateOrder);
router.post('/certificate/:courseId/create-payment-link', protect, createCertificatePaymentLink);
router.get('/certificate/:courseId/payment-callback', handleCertificatePaymentCallback); // Public callback route (called by Razorpay)
router.put('/certificate/:courseId/payment', protect, updateCertificatePayment);
router.get('/certificate/:courseId/download', protect, downloadAssignedCertificate);

module.exports = router;

