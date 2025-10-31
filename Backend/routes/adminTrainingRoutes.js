const express = require('express');
const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  toggleCoursePublishStatus,
  createModule,
  updateModule,
  deleteModule,
  createTopic,
  updateTopic,
  deleteTopic,
  createQuiz,
  updateQuiz,
  deleteQuiz
} = require('../controllers/trainingController');
const { protect: adminProtect } = require('../middleware/adminAuth');

const router = express.Router();

// All routes require admin authentication
router.use(adminProtect);

// Course routes
router.post('/training/courses', createCourse);
router.get('/training/courses', getAllCourses);
router.get('/training/courses/:id', getCourseById);
router.put('/training/courses/:id', updateCourse);
router.delete('/training/courses/:id', deleteCourse);
router.patch('/training/courses/:id/publish', toggleCoursePublishStatus);

// Module routes
router.post('/training/courses/:courseId/modules', createModule);
router.put('/training/modules/:id', updateModule);
router.delete('/training/modules/:id', deleteModule);

// Topic routes
router.post('/training/modules/:moduleId/topics', createTopic);
router.put('/training/topics/:id', updateTopic);
router.delete('/training/topics/:id', deleteTopic);

// Quiz routes
router.post('/training/topics/:topicId/quizzes', createQuiz);
router.put('/training/quizzes/:id', updateQuiz);
router.delete('/training/quizzes/:id', deleteQuiz);

module.exports = router;

