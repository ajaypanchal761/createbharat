const express = require('express');
const {
  getPublishedCourses,
  getCourseDetails,
  enrollInCourse,
  getMyProgress,
  completeTopic,
  submitQuiz,
  createCertificateOrder,
  updateCertificatePayment
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
router.put('/certificate/:courseId/payment', protect, updateCertificatePayment);

module.exports = router;

