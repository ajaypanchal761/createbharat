const mongoose = require('mongoose');
const TrainingCourse = require('../models/trainingCourse');
const TrainingModule = require('../models/trainingModule');
const TrainingTopic = require('../models/trainingTopic');
const TrainingQuiz = require('../models/trainingQuiz');
const UserTrainingProgress = require('../models/userTrainingProgress');
const User = require('../models/user');
const { uploadToCloudinary } = require('../utils/cloudinary');

// ========================================
// ADMIN CONTROLLERS
// ========================================

// @desc    Create training course (Admin)
// @route   POST /api/admin/training/courses
// @access  Private/Admin
const createCourse = async (req, res) => {
  try {
    // Check MongoDB connection status
    const connectionState = mongoose.connection.readyState;
    if (connectionState !== 1) {
      const stateMessages = {
        0: 'disconnected',
        2: 'connecting',
        3: 'disconnecting'
      };
      console.error(`⚠️ MongoDB connection state: ${connectionState} (${stateMessages[connectionState] || 'unknown'})`);
      
      // Try to reconnect if disconnected
      if (connectionState === 0) {
        try {
          console.log('🔄 Attempting to reconnect to MongoDB...');
          const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://sarthaknamdev:sarthak123@cluster0.q5dpigj.mongodb.net/createbharat?retryWrites=true&w=majority&appName=Cluster0';
          
          // Close existing connection if any
          if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
          }
          
          // Connect fresh
          await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
          });
          
          console.log('✅ MongoDB reconnected successfully');
        } catch (reconnectError) {
          console.error('❌ Failed to reconnect to MongoDB:', reconnectError.message);
          console.error('Full error:', reconnectError);
          return res.status(500).json({
            success: false,
            message: 'Database connection error. Please check if MongoDB is running and restart the backend server.',
            connectionState: connectionState,
            error: process.env.NODE_ENV === 'development' ? reconnectError.message : 'Unable to connect to database'
          });
        }
      } else if (connectionState === 2) {
        // Connection is in progress, wait a bit
        return res.status(503).json({
          success: false,
          message: 'Database is connecting. Please wait a moment and try again.',
          connectionState: connectionState
        });
      } else {
        return res.status(500).json({
          success: false,
          message: `Database connection is ${stateMessages[connectionState] || 'not ready'}. Please restart the backend server.`,
          connectionState: connectionState
        });
      }
    }
    
    // Check if request has a file (FormData) or is pure JSON
    let courseData = {};
    if (req.files && req.files.image && req.files.image[0]) {
      // File upload via FormData - data should be in req.body
      courseData = { ...req.body };
    } else {
      // No file - JSON request, data should already be in req.body
      courseData = req.body || {};
    }

    const {
      title,
      subtitle,
      description,
      provider,
      instructor,
      instructorEmail,
      instructorWebsite,
      minimumDuration,
      totalModules,
      language,
      eligibility,
      rating,
      studentsEnrolled,
      certificate,
      certificateAmount,
      minPassScore,
      autoGenerateCert,
      color,
      icon
    } = courseData;

    if (!title || !description || !provider || !instructor) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, provider, and instructor are required'
      });
    }

    // Handle image upload if present
    let imageUrl = '';
    if (req.files && req.files.image && req.files.image[0]) {
      try {
        const uploadResult = await uploadToCloudinary(req.files.image[0].path, 'training-courses');
        imageUrl = uploadResult.url;
      } catch (uploadError) {
        console.error('Image upload failed:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload image',
          error: uploadError.message
        });
      }
    }

    // Ensure totalModules is at least 1 (required by model)
    const finalTotalModules = totalModules && parseInt(totalModules) > 0 ? parseInt(totalModules) : 1;
    
    // Handle empty strings for required fields
    const finalMinimumDuration = (minimumDuration && minimumDuration.trim()) || '0 hours';
    const finalLanguage = (language && language.trim()) || 'English';
    
    // MongoDB text index conflict fix: Ensure language is a valid single value
    // MongoDB interprets "language" field in text search context, so we need to handle it carefully
    const safeLanguage = finalLanguage.includes(',') ? finalLanguage.split(',')[0].trim() : finalLanguage;

    const course = await TrainingCourse.create({
      title,
      subtitle,
      description,
      provider,
      instructor,
      instructorEmail,
      instructorWebsite,
      minimumDuration: finalMinimumDuration,
      totalModules: finalTotalModules,
      language: safeLanguage,
      eligibility,
      rating: rating || '0.0',
      studentsEnrolled: studentsEnrolled || 0,
      certificate: certificate || false,
      certificateAmount: certificateAmount || 199,
      minPassScore: minPassScore || 70,
      autoGenerateCert: autoGenerateCert !== undefined ? autoGenerateCert : true,
      imageUrl: imageUrl || '',
      color: color || 'from-indigo-500 to-purple-600',
      icon: icon || '📚',
      isActive: true,
      isPublished: false
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: { course }
    });
  } catch (error) {
    console.error('Create course error:', error);
    console.error('Error stack:', error.stack);
    console.error('Request body:', req.body);
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate entry. This course already exists.'
      });
    }

    // Handle database connection errors
    if (error.name === 'MongoServerError' || error.message.includes('MongoServerError')) {
      return res.status(500).json({
        success: false,
        message: 'Database connection error. Please check if MongoDB is running.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Failed to create course. Please check all required fields are filled.',
      errorType: error.name || 'Unknown',
      errorDetails: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Get all courses (Admin)
// @route   GET /api/admin/training/courses
// @access  Private/Admin
const getAllCourses = async (req, res) => {
  try {
    const { page = 1, limit = 20, isActive, isPublished } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = {};
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (isPublished !== undefined) query.isPublished = isPublished === 'true';

    const courses = await TrainingCourse.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('modulesCount')
      .populate('enrolledStudentsCount');

    const total = await TrainingCourse.countDocuments(query);

    res.status(200).json({
      success: true,
      count: courses.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: courses
    });
  } catch (error) {
    console.error('Get all courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get single course (Admin)
// @route   GET /api/admin/training/courses/:id
// @access  Private/Admin
const getCourseById = async (req, res) => {
  try {
    const course = await TrainingCourse.findById(req.params.id)
      .populate({
        path: 'modulesCount',
        select: '_id'
      })
      .populate({
        path: 'enrolledStudentsCount',
        select: '_id'
      });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Get modules with topics and quizzes
    const modules = await TrainingModule.find({ course: course._id })
      .sort({ number: 1 })
      .populate({
        path: 'topicsCount',
        select: '_id'
      });

    const modulesWithDetails = await Promise.all(
      modules.map(async (module) => {
        const topics = await TrainingTopic.find({ module: module._id })
          .sort({ number: 1 });

        const topicsWithQuizzes = await Promise.all(
          topics.map(async (topic) => {
            const quizzes = await TrainingQuiz.find({ topic: topic._id });
            return {
              ...topic.toObject(),
              quizzes
            };
          })
        );

        return {
          ...module.toObject(),
          topics: topicsWithQuizzes
        };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        course,
        modules: modulesWithDetails
      }
    });
  } catch (error) {
    console.error('Get course by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update course (Admin)
// @route   PUT /api/admin/training/courses/:id
// @access  Private/Admin
const updateCourse = async (req, res) => {
  try {
    const course = await TrainingCourse.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if request has a file (FormData) or is pure JSON
    let updateData = {};
    if (req.files && req.files.image && req.files.image[0]) {
      // File upload via FormData - data should be in req.body
      updateData = { ...req.body };
    } else {
      // No file - JSON request, data should already be in req.body
      updateData = req.body || {};
    }

    // Handle image upload if present
    if (req.files && req.files.image && req.files.image[0]) {
      try {
        const uploadResult = await uploadToCloudinary(req.files.image[0].path, 'training-courses');
        updateData.imageUrl = uploadResult.url;
        
        // TODO: Delete old image from Cloudinary if exists
        // if (course.imageUrl) {
        //   await deleteFromCloudinary(course.public_id);
        // }
      } catch (uploadError) {
        console.error('Image upload failed:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload image',
          error: uploadError.message
        });
      }
    }

    const allowedUpdates = [
      'title', 'subtitle', 'description', 'provider', 'instructor',
      'instructorEmail', 'instructorWebsite', 'minimumDuration',
      'totalModules', 'language', 'eligibility', 'rating',
      'studentsEnrolled', 'certificate', 'certificateAmount', 'minPassScore',
      'autoGenerateCert', 'imageUrl', 'color', 'icon', 'isActive', 'isPublished'
    ];

    allowedUpdates.forEach(field => {
      if (updateData[field] !== undefined) {
        course[field] = updateData[field];
      }
    });

    await course.save();

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: { course }
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete course (Admin)
// @route   DELETE /api/admin/training/courses/:id
// @access  Private/Admin
const deleteCourse = async (req, res) => {
  try {
    const course = await TrainingCourse.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Delete all related data
    const modules = await TrainingModule.find({ course: course._id });
    const moduleIds = modules.map(m => m._id);

    const topics = await TrainingTopic.find({ module: { $in: moduleIds } });
    const topicIds = topics.map(t => t._id);

    await TrainingQuiz.deleteMany({ topic: { $in: topicIds } });
    await TrainingTopic.deleteMany({ module: { $in: moduleIds } });
    await TrainingModule.deleteMany({ course: course._id });
    await UserTrainingProgress.deleteMany({ course: course._id });
    await TrainingCourse.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Course and all related data deleted successfully'
    });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Create module (Admin)
// @route   POST /api/admin/training/courses/:courseId/modules
// @access  Private/Admin
const createModule = async (req, res) => {
  try {
    const { courseId } = req.params;
    const {
      title,
      subtitle,
      description,
      objective,
      outcome,
      duration,
      number,
      evaluationMethod,
      icon,
      color
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Module title is required'
      });
    }

    const course = await TrainingCourse.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Auto-generate module number if not provided
    let moduleNumber = number;
    if (!moduleNumber) {
      const lastModule = await TrainingModule.findOne({ course: courseId })
        .sort({ number: -1 });
      moduleNumber = lastModule ? lastModule.number + 1 : 1;
    }

    const module = await TrainingModule.create({
      course: courseId,
      title,
      subtitle,
      description,
      objective,
      outcome,
      duration,
      number: moduleNumber,
      evaluationMethod,
      icon: icon || '💼',
      color: color || 'from-blue-500 to-cyan-500',
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: 'Module created successfully',
      data: { module }
    });
  } catch (error) {
    console.error('Create module error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Module number already exists for this course'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update module (Admin)
// @route   PUT /api/admin/training/modules/:id
// @access  Private/Admin
const updateModule = async (req, res) => {
  try {
    const module = await TrainingModule.findById(req.params.id);

    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    const allowedUpdates = [
      'title', 'subtitle', 'description', 'objective', 'outcome',
      'duration', 'number', 'evaluationMethod', 'icon', 'color', 'isActive'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        module[field] = req.body[field];
      }
    });

    await module.save();

    res.status(200).json({
      success: true,
      message: 'Module updated successfully',
      data: { module }
    });
  } catch (error) {
    console.error('Update module error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete module (Admin)
// @route   DELETE /api/admin/training/modules/:id
// @access  Private/Admin
const deleteModule = async (req, res) => {
  try {
    const module = await TrainingModule.findById(req.params.id);

    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    // Delete all related topics and quizzes
    const topics = await TrainingTopic.find({ module: module._id });
    const topicIds = topics.map(t => t._id);

    await TrainingQuiz.deleteMany({ topic: { $in: topicIds } });
    await TrainingTopic.deleteMany({ module: module._id });
    await TrainingModule.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Module and all related data deleted successfully'
    });
  } catch (error) {
    console.error('Delete module error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Create topic (Admin)
// @route   POST /api/admin/training/modules/:moduleId/topics
// @access  Private/Admin
const createTopic = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const {
      title,
      content,
      videoUrl,
      number,
      duration
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Topic title and content are required'
      });
    }

    const module = await TrainingModule.findById(moduleId);
    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    // Auto-generate topic number if not provided
    let topicNumber = number;
    if (!topicNumber) {
      const lastTopic = await TrainingTopic.findOne({ module: moduleId })
        .sort({ number: -1 });
      topicNumber = lastTopic ? lastTopic.number + 1 : 1;
    }

    const topic = await TrainingTopic.create({
      module: moduleId,
      title,
      content,
      videoUrl,
      number: topicNumber,
      duration,
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: 'Topic created successfully',
      data: { topic }
    });
  } catch (error) {
    console.error('Create topic error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Topic number already exists for this module'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update topic (Admin)
// @route   PUT /api/admin/training/topics/:id
// @access  Private/Admin
const updateTopic = async (req, res) => {
  try {
    const topic = await TrainingTopic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found'
      });
    }

    const allowedUpdates = ['title', 'content', 'videoUrl', 'number', 'duration', 'isActive'];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        topic[field] = req.body[field];
      }
    });

    await topic.save();

    res.status(200).json({
      success: true,
      message: 'Topic updated successfully',
      data: { topic }
    });
  } catch (error) {
    console.error('Update topic error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete topic (Admin)
// @route   DELETE /api/admin/training/topics/:id
// @access  Private/Admin
const deleteTopic = async (req, res) => {
  try {
    const topic = await TrainingTopic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found'
      });
    }

    await TrainingQuiz.deleteMany({ topic: topic._id });
    await TrainingTopic.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Topic and all related quizzes deleted successfully'
    });
  } catch (error) {
    console.error('Delete topic error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Create quiz (Admin)
// @route   POST /api/admin/training/topics/:topicId/quizzes
// @access  Private/Admin
const createQuiz = async (req, res) => {
  try {
    const { topicId } = req.params;
    const {
      question,
      options,
      correctAnswer,
      explanation,
      points
    } = req.body;

    if (!question || !options || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Question and at least 2 options are required'
      });
    }

    if (correctAnswer === undefined || correctAnswer < 0 || correctAnswer >= options.length) {
      return res.status(400).json({
        success: false,
        message: 'Valid correct answer index is required'
      });
    }

    const topic = await TrainingTopic.findById(topicId);
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found'
      });
    }

    const quiz = await TrainingQuiz.create({
      topic: topicId,
      question,
      options,
      correctAnswer,
      explanation,
      points: points || 1,
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: 'Quiz created successfully',
      data: { quiz }
    });
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update quiz (Admin)
// @route   PUT /api/admin/training/quizzes/:id
// @access  Private/Admin
const updateQuiz = async (req, res) => {
  try {
    const quiz = await TrainingQuiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    const allowedUpdates = ['question', 'options', 'correctAnswer', 'explanation', 'points', 'isActive'];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        quiz[field] = req.body[field];
      }
    });

    // Validate correctAnswer if options changed
    if (req.body.options && req.body.correctAnswer !== undefined) {
      if (req.body.correctAnswer < 0 || req.body.correctAnswer >= req.body.options.length) {
        return res.status(400).json({
          success: false,
          message: 'Correct answer index must be within options range'
        });
      }
    }

    await quiz.save();

    res.status(200).json({
      success: true,
      message: 'Quiz updated successfully',
      data: { quiz }
    });
  } catch (error) {
    console.error('Update quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete quiz (Admin)
// @route   DELETE /api/admin/training/quizzes/:id
// @access  Private/Admin
const deleteQuiz = async (req, res) => {
  try {
    const quiz = await TrainingQuiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    await TrainingQuiz.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Quiz deleted successfully'
    });
  } catch (error) {
    console.error('Delete quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ========================================
// USER CONTROLLERS
// ========================================

// @desc    Get all published courses (User)
// @route   GET /api/training/courses
// @access  Public
const getPublishedCourses = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const courses = await TrainingCourse.find({
      isActive: true,
      isPublished: true
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    const total = await TrainingCourse.countDocuments({
      isActive: true,
      isPublished: true
    });

    res.status(200).json({
      success: true,
      count: courses.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: courses
    });
  } catch (error) {
    console.error('Get published courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get single course with full details (User)
// @route   GET /api/training/courses/:id
// @access  Public
const getCourseDetails = async (req, res) => {
  try {
    const course = await TrainingCourse.findOne({
      _id: req.params.id,
      isActive: true,
      isPublished: true
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or not published'
      });
    }

    // Get modules with topics and quizzes
    const modules = await TrainingModule.find({
      course: course._id,
      isActive: true
    })
      .sort({ number: 1 });

    const modulesWithDetails = await Promise.all(
      modules.map(async (module) => {
        const topics = await TrainingTopic.find({
          module: module._id,
          isActive: true
        })
          .sort({ number: 1 });

        const topicsWithQuizzes = await Promise.all(
          topics.map(async (topic) => {
            const quizzes = await TrainingQuiz.find({
              topic: topic._id,
              isActive: true
            }).select('-correctAnswer'); // Don't expose correct answer

            return {
              ...topic.toObject(),
              quizzes
            };
          })
        );

        return {
          ...module.toObject(),
          topics: topicsWithQuizzes
        };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        course,
        modules: modulesWithDetails
      }
    });
  } catch (error) {
    console.error('Get course details error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Enroll in course (User)
// @route   POST /api/training/courses/:courseId/enroll
// @access  Private/User
const enrollInCourse = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { courseId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }

    const course = await TrainingCourse.findOne({
      _id: courseId,
      isActive: true,
      isPublished: true
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or not available'
      });
    }

    // Check if already enrolled
    const existingProgress = await UserTrainingProgress.findOne({
      user: userId,
      course: courseId
    });

    if (existingProgress) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course',
        data: { progress: existingProgress }
      });
    }

    // Create enrollment
    const progress = await UserTrainingProgress.create({
      user: userId,
      course: courseId,
      enrollmentStatus: 'enrolled',
      startedAt: new Date(),
      lastAccessedAt: new Date()
    });

    // Update course enrollment count
    course.studentsEnrolled += 1;
    await course.save();

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in course',
      data: { progress }
    });
  } catch (error) {
    console.error('Enroll in course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get user progress (User)
// @route   GET /api/training/my-progress
// @access  Private/User
const getMyProgress = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }

    const progress = await UserTrainingProgress.find({ user: userId })
      .populate('course', 'title description provider instructor minimumDuration totalModules')
      .sort({ lastAccessedAt: -1 });

    res.status(200).json({
      success: true,
      count: progress.length,
      data: progress
    });
  } catch (error) {
    console.error('Get my progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update topic completion (User)
// @route   PATCH /api/training/progress/:courseId/complete-topic/:topicId
// @access  Private/User
const completeTopic = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { courseId, topicId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }

    const progress = await UserTrainingProgress.findOne({
      user: userId,
      course: courseId
    });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Not enrolled in this course'
      });
    }

    // Check if topic already completed
    if (!progress.completedTopics.includes(topicId)) {
      progress.completedTopics.push(topicId);
      progress.enrollmentStatus = 'in_progress';
      progress.lastAccessedAt = new Date();
      await progress.save();

      // Calculate overall progress
      await calculateProgress(progress);
    }

    res.status(200).json({
      success: true,
      message: 'Topic marked as completed',
      data: { progress }
    });
  } catch (error) {
    console.error('Complete topic error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Submit quiz attempt (User)
// @route   POST /api/training/quizzes/:quizId/submit
// @access  Private/User
const submitQuiz = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { quizId } = req.params;
    const { selectedAnswer, topicId, courseId } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }

    const quiz = await TrainingQuiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    const isCorrect = selectedAnswer === quiz.correctAnswer;
    const points = isCorrect ? quiz.points : 0;

    // Get or create progress
    let progress = await UserTrainingProgress.findOne({
      user: userId,
      course: courseId
    });

    if (!progress) {
      progress = await UserTrainingProgress.create({
        user: userId,
        course: courseId,
        enrollmentStatus: 'in_progress',
        startedAt: new Date()
      });
    }

    // Save quiz attempt
    progress.quizAttempts.push({
      topic: topicId,
      quiz: quizId,
      selectedAnswer,
      isCorrect,
      points,
      attemptedAt: new Date()
    });

    progress.lastAccessedAt = new Date();
    await progress.save();

    res.status(200).json({
      success: true,
      message: 'Quiz submitted',
      data: {
        isCorrect,
        points,
        correctAnswer: quiz.correctAnswer,
        explanation: quiz.explanation
      }
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Helper function to calculate progress
const calculateProgress = async (progress) => {
  try {
    const course = await TrainingCourse.findById(progress.course);
    if (!course) return;

    const modules = await TrainingModule.find({ course: course._id, isActive: true });
    const totalTopics = await TrainingTopic.countDocuments({
      module: { $in: modules.map(m => m._id) },
      isActive: true
    });

    if (totalTopics === 0) {
      progress.overallProgress = 0;
    } else {
      const completedCount = progress.completedTopics.length;
      progress.overallProgress = Math.round((completedCount / totalTopics) * 100);
    }

    // Check if course is completed
    if (progress.overallProgress >= 100) {
      progress.enrollmentStatus = 'completed';
      progress.completedAt = new Date();
    }

    await progress.save();
  } catch (error) {
    console.error('Calculate progress error:', error);
  }
};

// @desc    Toggle course publish status (Admin)
// @route   PATCH /api/admin/training/courses/:id/publish
// @access  Private/Admin
const toggleCoursePublishStatus = async (req, res) => {
  try {
    const course = await TrainingCourse.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Toggle publish status
    course.isPublished = !course.isPublished;
    await course.save();

    res.status(200).json({
      success: true,
      message: `Course ${course.isPublished ? 'published' : 'unpublished'} successfully`,
      data: { course }
    });
  } catch (error) {
    console.error('Toggle course publish status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Create Razorpay order for certificate payment (User)
// @route   POST /api/training/certificate/:courseId/create-order
// @access  Private/User
const createCertificateOrder = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { courseId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }

    // Check if user has progress and course is completed
    const progress = await UserTrainingProgress.findOne({
      user: userId,
      course: courseId
    });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Not enrolled in this course'
      });
    }

    // Get course to get certificate amount
    const course = await TrainingCourse.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if course is completed
    if (progress.overallProgress < 100) {
      return res.status(400).json({
        success: false,
        message: 'Course must be completed to get certificate'
      });
    }

    // Check if already paid
    if (progress.certificatePaymentStatus === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Certificate payment already completed'
      });
    }

    const certificateAmount = course.certificateAmount || 199;

    // Validate certificate amount
    if (!certificateAmount || certificateAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid certificate amount. Please contact administrator.'
      });
    }

    let razorpay;
    try {
      const { getRazorpayClient } = require('../services/razorpay');
      razorpay = getRazorpayClient();
    } catch (razorpayError) {
      console.error('Razorpay client initialization error:', razorpayError);
      return res.status(500).json({
        success: false,
        message: 'Payment gateway not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.',
        error: process.env.NODE_ENV === 'development' ? razorpayError.message : undefined
      });
    }
    
    // Generate a unique receipt ID (Razorpay requirement: max 40 characters)
    // Format: CERT-{shortProgressId}-{shortTimestamp}
    // MongoDB ObjectId is 24 chars, so we'll use last 12 chars + timestamp
    const progressIdShort = progress._id.toString().slice(-12); // Last 12 characters
    const timestampShort = Date.now().toString().slice(-8); // Last 8 digits
    const receipt = `CERT-${progressIdShort}-${timestampShort}`; // Max 24 chars (CERT- + 12 + - + 8)
    
    const options = {
      amount: Math.round(certificateAmount * 100), // Convert to paise
      currency: 'INR',
      receipt: receipt,
      notes: {
        progressId: progress._id.toString(),
        userId: userId.toString(),
        courseId: courseId,
        courseTitle: course.title || 'Training Course'
      },
    };

    let order;
    try {
      console.log('Creating Razorpay order with options:', {
        amount: options.amount,
        currency: options.currency,
        receipt: options.receipt
      });
      order = await razorpay.orders.create(options);
      console.log('Razorpay order created successfully:', order.id);
    } catch (razorpayOrderError) {
      console.error('Razorpay order creation error:', razorpayOrderError);
      console.error('Error details:', {
        message: razorpayOrderError.message,
        statusCode: razorpayOrderError.statusCode,
        error: razorpayOrderError.error
      });
      
      let errorMessage = 'Failed to create payment order. Please try again later.';
      
      // Provide specific error messages based on Razorpay error
      if (razorpayOrderError.error) {
        if (razorpayOrderError.error.description) {
          errorMessage = razorpayOrderError.error.description;
        } else if (razorpayOrderError.error.code) {
          errorMessage = `Payment error (${razorpayOrderError.error.code}): ${razorpayOrderError.error.description || 'Please check your payment gateway configuration'}`;
        }
      } else if (razorpayOrderError.message) {
        errorMessage = razorpayOrderError.message;
      }
      
      return res.status(500).json({
        success: false,
        message: errorMessage,
        error: process.env.NODE_ENV === 'development' ? (razorpayOrderError.message || JSON.stringify(razorpayOrderError)) : undefined,
        errorCode: razorpayOrderError.error?.code || razorpayOrderError.statusCode
      });
    }
    
    const keyId = process.env.RAZORPAY_KEY_ID;
    if (!keyId) {
      console.error('RAZORPAY_KEY_ID is not set in environment variables');
      return res.status(500).json({
        success: false,
        message: 'Payment gateway key not configured. Please contact administrator.',
        error: 'RAZORPAY_KEY_ID missing'
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: keyId,
        progressId: progress._id
      }
    });
  } catch (error) {
    console.error('Create certificate order error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', {
      userId: req.user?.id || req.user?._id,
      courseId: req.params.courseId,
      errorName: error.name,
      errorMessage: error.message
    });

    let message = 'Server error';
    let statusCode = 500;

    if (error.message && error.message.includes('Razorpay keys')) {
      message = 'Payment gateway not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.';
    } else if (error.name === 'ValidationError') {
      message = 'Validation error: ' + error.message;
      statusCode = 400;
    } else if (error.message) {
      message = error.message;
    }

    return res.status(statusCode).json({
      success: false,
      message,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      errorDetails: process.env.NODE_ENV === 'development' ? {
        name: error.name,
        stack: error.stack
      } : undefined
    });
  }
};

// @desc    Update certificate payment status (User)
// @route   PUT /api/training/certificate/:courseId/payment
// @access  Private/User
const updateCertificatePayment = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { courseId } = req.params;
    const { transactionId, paymentStatus = 'completed' } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }

    const progress = await UserTrainingProgress.findOne({
      user: userId,
      course: courseId
    });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Not enrolled in this course'
      });
    }

    // Get course to get certificate amount
    const course = await TrainingCourse.findById(courseId);
    if (course && paymentStatus === 'completed') {
      progress.certificateAmount = course.certificateAmount || 199;
    }

    progress.certificatePaymentStatus = paymentStatus;
    if (transactionId) {
      progress.certificatePaymentId = transactionId;
    }
    if (paymentStatus === 'completed') {
      progress.certificatePaidAt = new Date();
      progress.certificateGenerated = true;
      progress.certificateGeneratedAt = new Date();
    }

    await progress.save();

    res.status(200).json({
      success: true,
      message: 'Payment status updated successfully',
      data: { progress }
    });
  } catch (error) {
    console.error('Update certificate payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get all user progress with certificates and quiz completion (Admin)
// @route   GET /api/admin/training/user-progress
// @access  Private/Admin
const getAllUserProgress = async (req, res) => {
  try {
    const { courseId, certificateOnly, completedOnly, paymentStatus } = req.query;

    // Build query
    const query = {};
    if (courseId) {
      query.course = courseId;
    }
    if (certificateOnly === 'true') {
      query.certificateGenerated = true;
    }
    if (completedOnly === 'true') {
      query.enrollmentStatus = 'completed';
    }
    if (paymentStatus) {
      query.certificatePaymentStatus = paymentStatus;
    }

    // Get all progress with populated user and course details
    const progressList = await UserTrainingProgress.find(query)
      .populate('user', 'firstName lastName email phone')
      .populate('course', 'title provider instructor minimumDuration totalModules')
      .sort({ createdAt: -1 })
      .lean();

    // Get quiz details for each progress
    const progressWithQuizDetails = await Promise.all(
      progressList.map(async (progress) => {
        // Get course modules and topics
        const course = await TrainingCourse.findById(progress.course._id || progress.course);
        if (!course) return null;

        const modules = await TrainingModule.find({ course: course._id, isActive: true })
          .sort({ number: 1 });
        
        // Get all topics for these modules
        const moduleIds = modules.map(m => m._id);
        const topics = await TrainingTopic.find({ module: { $in: moduleIds }, isActive: true })
          .sort({ number: 1 });
        
        // Get all quizzes for these topics
        const topicIds = topics.map(t => t._id);
        const quizzes = await TrainingQuiz.find({ topic: { $in: topicIds }, isActive: true });

        // Count total quizzes
        let totalQuizzes = quizzes.length;
        let completedQuizzes = 0;
        const quizDetails = [];

        quizzes.forEach(quiz => {
          // Find the topic for this quiz
          const topic = topics.find(t => t._id.toString() === quiz.topic.toString());
          const module = modules.find(m => topic && m._id.toString() === topic.module.toString());
          
          // Check if this quiz was attempted and answered correctly
          const quizAttempt = progress.quizAttempts?.find(
            att => att.quiz?.toString() === quiz._id.toString()
          );
          if (quizAttempt && quizAttempt.isCorrect) {
            completedQuizzes++;
          }
          quizDetails.push({
            quizId: quiz._id,
            question: quiz.question,
            topicId: topic?._id || null,
            topicTitle: topic?.title || 'Unknown Topic',
            moduleId: module?._id || null,
            moduleTitle: module?.title || 'Unknown Module',
            attempted: !!quizAttempt,
            isCorrect: quizAttempt?.isCorrect || false,
            attemptedAt: quizAttempt?.attemptedAt || null
          });
        });

        return {
          ...progress,
          totalQuizzes,
          completedQuizzes,
          allQuizzesCompleted: totalQuizzes > 0 && completedQuizzes === totalQuizzes,
          quizDetails,
          courseTitle: course.title,
          courseProvider: course.provider
        };
      })
    );

    // Filter out null values
    const filteredProgress = progressWithQuizDetails.filter(p => p !== null);

    res.status(200).json({
      success: true,
      count: filteredProgress.length,
      data: filteredProgress
    });
  } catch (error) {
    console.error('Get all user progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  // Admin
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
  deleteQuiz,
  // User
  getPublishedCourses,
  getCourseDetails,
  enrollInCourse,
  getMyProgress,
  completeTopic,
  submitQuiz,
  createCertificateOrder,
  updateCertificatePayment
};

