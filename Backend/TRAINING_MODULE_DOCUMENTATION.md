# Training Module - Complete Backend Documentation

## Overview
Complete end-to-end backend implementation for Training Management System with Course, Module, Topic, and Quiz structure.

## Models Created

### 1. TrainingCourse (`Backend/models/trainingCourse.js`)
- Main course model with all course details
- Fields: title, description, provider, instructor, duration, modules count, certificate config, etc.
- Indexes for performance
- Virtual fields for modules and enrollment counts

### 2. TrainingModule (`Backend/models/trainingModule.js`)
- Module within a course
- Fields: title, objective, outcome, duration, number, evaluation method
- Unique module number per course
- Virtual for topics count

### 3. TrainingTopic (`Backend/models/trainingTopic.js`)
- Topic within a module
- Fields: title, content, videoUrl, number, duration
- Unique topic number per module
- Virtual for quizzes count

### 4. TrainingQuiz (`Backend/models/trainingQuiz.js`)
- Quiz questions for topics
- Fields: question, options (2-6), correctAnswer, explanation, points
- Validates correct answer index

### 5. UserTrainingProgress (`Backend/models/userTrainingProgress.js`)
- Tracks user enrollment and progress
- Fields: enrollment status, completed modules/topics, quiz attempts, scores, certificate info
- Calculates overall progress percentage
- Unique user-course combination

## Controllers

### Admin Controllers (`Backend/controllers/trainingController.js`)

#### Course Management:
- `createCourse` - Create new training course
- `getAllCourses` - Get all courses (with pagination and filters)
- `getCourseById` - Get single course with full module/topic/quiz tree
- `updateCourse` - Update course details
- `deleteCourse` - Delete course and all related data (cascading delete)

#### Module Management:
- `createModule` - Create module in a course
- `updateModule` - Update module details
- `deleteModule` - Delete module and related topics/quizzes

#### Topic Management:
- `createTopic` - Create topic in a module
- `updateTopic` - Update topic details
- `deleteTopic` - Delete topic and related quizzes

#### Quiz Management:
- `createQuiz` - Create quiz for a topic
- `updateQuiz` - Update quiz details
- `deleteQuiz` - Delete quiz

### User Controllers

#### Public Routes:
- `getPublishedCourses` - Get all published and active courses
- `getCourseDetails` - Get course with full structure (without exposing correct answers)

#### Protected Routes:
- `enrollInCourse` - Enroll user in a course
- `getMyProgress` - Get user's training progress for all courses
- `completeTopic` - Mark topic as completed
- `submitQuiz` - Submit quiz attempt and get results

## Routes

### Public/User Routes (`Backend/routes/trainingRoutes.js`)
- `GET /api/training/courses` - Get published courses
- `GET /api/training/courses/:id` - Get course details
- `POST /api/training/courses/:courseId/enroll` - Enroll (Protected)
- `GET /api/training/my-progress` - Get progress (Protected)
- `PATCH /api/training/progress/:courseId/complete-topic/:topicId` - Complete topic (Protected)
- `POST /api/training/quizzes/:quizId/submit` - Submit quiz (Protected)

### Admin Routes (`Backend/routes/adminTrainingRoutes.js`)
All routes require admin authentication via `adminProtect` middleware.

**Course Routes:**
- `POST /api/admin/training/courses` - Create course
- `GET /api/admin/training/courses` - Get all courses
- `GET /api/admin/training/courses/:id` - Get course details
- `PUT /api/admin/training/courses/:id` - Update course
- `DELETE /api/admin/training/courses/:id` - Delete course

**Module Routes:**
- `POST /api/admin/training/courses/:courseId/modules` - Create module
- `PUT /api/admin/training/modules/:id` - Update module
- `DELETE /api/admin/training/modules/:id` - Delete module

**Topic Routes:**
- `POST /api/admin/training/modules/:moduleId/topics` - Create topic
- `PUT /api/admin/training/topics/:id` - Update topic
- `DELETE /api/admin/training/topics/:id` - Delete topic

**Quiz Routes:**
- `POST /api/admin/training/topics/:topicId/quizzes` - Create quiz
- `PUT /api/admin/training/quizzes/:id` - Update quiz
- `DELETE /api/admin/training/quizzes/:id` - Delete quiz

## Frontend API Integration

### API Utilities Added (`frontend/src/utils/api.js`)

#### `trainingAPI` (Public & User):
- `getCourses(params)` - Get published courses
- `getCourseById(id)` - Get course details
- `enroll(token, courseId)` - Enroll in course
- `getMyProgress(token)` - Get user progress
- `completeTopic(token, courseId, topicId)` - Complete topic
- `submitQuiz(token, quizId, quizData)` - Submit quiz

#### `adminTrainingAPI` (Admin):
- `createCourse(token, courseData)` - Create course
- `getAllCourses(token, params)` - Get all courses
- `getCourseById(token, courseId)` - Get course details
- `updateCourse(token, courseId, courseData)` - Update course
- `deleteCourse(token, courseId)` - Delete course
- `createModule(token, courseId, moduleData)` - Create module
- `updateModule(token, moduleId, moduleData)` - Update module
- `deleteModule(token, moduleId)` - Delete module
- `createTopic(token, moduleId, topicData)` - Create topic
- `updateTopic(token, topicId, topicData)` - Update topic
- `deleteTopic(token, topicId)` - Delete topic
- `createQuiz(token, topicId, quizData)` - Create quiz
- `updateQuiz(token, quizId, quizData)` - Update quiz
- `deleteQuiz(token, quizId)` - Delete quiz

## Features

### Admin Features:
1. Complete CRUD operations for courses, modules, topics, and quizzes
2. Hierarchical structure management
3. Auto-numbering for modules and topics
4. Cascading deletes for data integrity
5. Course publishing/unpublishing
6. Full course tree retrieval for editing

### User Features:
1. Browse published courses
2. View course details
3. Enroll in courses
4. Track progress (completed topics, quiz scores)
5. Submit quiz attempts
6. Automatic progress calculation
7. Certificate generation support (when implemented)

## Database Structure

```
TrainingCourse (1) ──┬──> TrainingModule (Many)
                     │
                     └──> UserTrainingProgress (Many)

TrainingModule (1) ──> TrainingTopic (Many)

TrainingTopic (1) ──> TrainingQuiz (Many)

User (1) ──> UserTrainingProgress (Many) ──> TrainingCourse (1)
```

## Next Steps for Frontend Integration

1. **Update AdminTrainingPage.jsx:**
   - Replace mock data with API calls using `adminTrainingAPI`
   - Update wizard forms to save/load from backend
   - Add loading states and error handling

2. **Update User Training Pages:**
   - Replace mock data imports with `trainingAPI` calls
   - Implement enrollment functionality
   - Add progress tracking UI
   - Integrate quiz submission

3. **Remove Mock Data Files** (after integration):
   - `frontend/src/data/trainingData.js`
   - `frontend/src/data/trainings.js`
   - `frontend/src/data/entrepreneurshipTraining.js`

4. **Add Certificate Generation:**
   - Implement certificate PDF generation
   - Add certificate download functionality
   - Update UserTrainingProgress model with certificate URLs

## Testing

### Backend Testing:
1. Test all CRUD operations for courses, modules, topics, quizzes
2. Test cascading deletes
3. Test user enrollment and progress tracking
4. Test quiz submission and scoring
5. Test admin authentication middleware

### Frontend Testing:
1. Test admin course creation wizard
2. Test course browsing and enrollment
3. Test progress tracking
4. Test quiz functionality

## Environment Variables

No new environment variables required. Uses existing JWT_SECRET and MONGODB_URI.

## Notes

- All admin routes require authentication via `adminProtect` middleware
- User routes use standard `protect` middleware for authenticated operations
- Quiz correct answers are hidden from public endpoints
- Progress calculation is automatic on topic completion
- Course must be published (`isPublished: true`) to be visible to users

