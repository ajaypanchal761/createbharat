const express = require('express');
const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  toggleCoursePublishStatus,
  getAllUserProgress,
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
const upload = require('../utils/multer');

const router = express.Router();

// All routes require admin authentication
router.use(adminProtect);

// Custom middleware to handle both FormData and JSON
const handleMultipartOrJson = (req, res, next) => {
  const contentType = req.get('content-type') || '';

  if (contentType.includes('multipart/form-data')) {
    // Multer will handle the multipart/form-data
    return upload.fields([{ name: 'image', maxCount: 1 }])(req, res, (err) => {
      if (err && err.code !== 'LIMIT_UNEXPECTED_FILE') {
        return next(err);
      }
      next();
    });
  } else {
    // For JSON/other requests, body is already parsed by express.json/urlencoded
    if (req.body) {
      return next();
    }
    next();
  }
};

// Course routes
router.post('/training/courses', handleMultipartOrJson, createCourse);
router.get('/training/courses', getAllCourses);
router.get('/training/courses/:id', getCourseById);
router.put('/training/courses/:id', handleMultipartOrJson, updateCourse);
router.delete('/training/courses/:id', deleteCourse);
router.patch('/training/courses/:id/publish', toggleCoursePublishStatus);

// User Progress routes
router.get('/training/user-progress', getAllUserProgress);

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

