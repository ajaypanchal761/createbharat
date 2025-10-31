import React, { useState, useEffect, useCallback } from 'react';
import { adminTrainingAPI } from '../../utils/api';
import { FaSpinner, FaTrash, FaEdit, FaPlus, FaCheck, FaTimes } from 'react-icons/fa';

const initialCourseForm = {
    title: '',
    subtitle: '',
    description: '',
    provider: '',
    instructor: '',
    instructorEmail: '',
    instructorWebsite: '',
    minimumDuration: '',
    totalModules: '',
    language: '',
    eligibility: '',
    rating: '',
    studentsEnrolled: 0,
    certificate: false,
    certificateAmount: 199,
    minPassScore: 70,
    autoGenerateCert: true,
    color: 'from-indigo-500 to-purple-600',
    icon: '📚',
};

const initialModuleForm = {
    title: '',
    subtitle: '',
    description: '',
    objective: '',
    duration: '',
    icon: '💼',
    color: 'from-blue-500 to-cyan-500',
    outcome: '',
    evaluationMethod: '',
    number: '',
};

const initialTopicForm = {
    title: '',
    content: '',
    videoUrl: '',
    number: '',
    duration: '',
};

const initialQuizForm = {
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
    points: 1,
};

const STEP = {
    COURSE: 1,
    MODULES: 2,
    TOPICS: 3,
    QUIZ: 4
};

const VIEW = {
    LIST: 'LIST',
    CREATE: 'CREATE',
    USER_PROGRESS: 'USER_PROGRESS',
};

const AdminTrainingPage = () => {
    const [view, setView] = useState(VIEW.LIST);
    const [step, setStep] = useState(STEP.COURSE);
    const [courseForm, setCourseForm] = useState(initialCourseForm);
    const [currentCourseId, setCurrentCourseId] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [courseDetails, setCourseDetails] = useState(null);
    
    const [moduleForm, setModuleForm] = useState(initialModuleForm);
    const [editingModuleId, setEditingModuleId] = useState(null);
    const [selectedModuleId, setSelectedModuleId] = useState(null);
    
    const [topicForm, setTopicForm] = useState(initialTopicForm);
    const [editingTopicId, setEditingTopicId] = useState(null);
    const [selectedTopicId, setSelectedTopicId] = useState(null);
    
    const [quizForm, setQuizForm] = useState(initialQuizForm);
    const [editingQuizId, setEditingQuizId] = useState(null);
    
    const [viewingCourse, setViewingCourse] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    // Image file state
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    
    // User progress state
    const [userProgress, setUserProgress] = useState([]);
    const [filterCourseId, setFilterCourseId] = useState('');
    const [filterCertificateOnly, setFilterCertificateOnly] = useState(false);
    const [filterCompletedOnly, setFilterCompletedOnly] = useState(false);
    const [filterPaymentStatus, setFilterPaymentStatus] = useState('');

    // Define fetchCourses with useCallback
    const fetchCourses = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('adminToken');
            const response = await adminTrainingAPI.getAllCourses(token);
            if (response.success) {
                setCourses(response.data);
            }
        } catch (err) {
            console.error('Error fetching courses:', err);
            setError(err.message || 'Failed to fetch courses');
        } finally {
            setLoading(false);
        }
    }, []);

    // Define fetchUserProgress with useCallback
    const fetchUserProgress = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('adminToken');
            const params = {};
            if (filterCourseId) params.courseId = filterCourseId;
            if (filterCertificateOnly) params.certificateOnly = 'true';
            if (filterCompletedOnly) params.completedOnly = 'true';
            if (filterPaymentStatus) params.paymentStatus = filterPaymentStatus;
            
            const response = await adminTrainingAPI.getUserProgress(token, params);
            if (response.success) {
                setUserProgress(response.data || []);
            }
        } catch (err) {
            console.error('Error fetching user progress:', err);
            setError(err.message || 'Failed to fetch user progress');
        } finally {
            setLoading(false);
        }
    }, [filterCourseId, filterCertificateOnly, filterCompletedOnly, filterPaymentStatus]);

    // Fetch courses on mount
    useEffect(() => {
        if (view === VIEW.LIST || view === VIEW.USER_PROGRESS) {
            fetchCourses();
        }
    }, [view, fetchCourses]);

    // Fetch user progress when filters change
    useEffect(() => {
        if (view === VIEW.USER_PROGRESS) {
            fetchUserProgress();
        }
    }, [view, fetchUserProgress]);

    // Fetch course details when editing
    useEffect(() => {
        if (currentCourseId && view === VIEW.CREATE && isEditMode) {
            fetchCourseDetails();
        }
    }, [currentCourseId, view, isEditMode]);

    const fetchCourseDetails = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            const response = await adminTrainingAPI.getCourseById(token, currentCourseId);
            if (response.success) {
                setCourseDetails(response.data);
                // Populate course form
                const course = response.data.course;
                const existingImageUrl = course.imageUrl || '';
                setCourseForm({
                    title: course.title || '',
                    subtitle: course.subtitle || '',
                    description: course.description || '',
                    provider: course.provider || '',
                    instructor: course.instructor || '',
                    instructorEmail: course.instructorEmail || '',
                    instructorWebsite: course.instructorWebsite || '',
                    minimumDuration: course.minimumDuration || '',
                    totalModules: course.totalModules || '',
                    language: course.language || '',
                    eligibility: course.eligibility || '',
                    rating: course.rating || '',
                    studentsEnrolled: course.studentsEnrolled || 0,
                    certificate: course.certificate || false,
                    certificateAmount: course.certificateAmount || 199,
                    minPassScore: course.minPassScore || 70,
                    autoGenerateCert: course.autoGenerateCert !== undefined ? course.autoGenerateCert : true,
                    color: course.color || 'from-indigo-500 to-purple-600',
                    icon: course.icon || '📚',
                    imageUrl: existingImageUrl,
                });
                // Reset image selection
                setSelectedImage(null);
                // Set preview to existing image URL if available
                setImagePreview(existingImageUrl);
            }
        } catch (err) {
            console.error('Error fetching course details:', err);
            setError(err.message || 'Failed to fetch course details');
        } finally {
            setLoading(false);
        }
    };

    const handleCourseChange = e => {
        const { name, value, type, checked } = e.target;
        setCourseForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleCreateCourse = async e => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('adminToken');
            
            const courseData = {
                ...courseForm,
                totalModules: courseForm.totalModules ? parseInt(courseForm.totalModules) : 1,
                studentsEnrolled: parseInt(courseForm.studentsEnrolled) || 0,
                certificateAmount: parseInt(courseForm.certificateAmount) || 199,
                minPassScore: parseInt(courseForm.minPassScore) || 70,
                // Ensure required fields have default values
                minimumDuration: courseForm.minimumDuration || '0 hours',
                language: courseForm.language || 'English',
            };

            // Remove imageUrl from payload if we're uploading a file
            if (selectedImage) {
                delete courseData.imageUrl;
            }

            let response;
            if (isEditMode && currentCourseId) {
                response = await adminTrainingAPI.updateCourse(token, currentCourseId, courseData, selectedImage);
            } else {
                response = await adminTrainingAPI.createCourse(token, courseData, selectedImage);
            }

            if (response.success) {
                setCurrentCourseId(response.data.course._id || response.data.course.id);
                await fetchCourseDetails();
        setStep(STEP.MODULES);
                // Reset image selection after successful save
                setSelectedImage(null);
                alert(isEditMode ? 'Course updated successfully!' : 'Course created successfully!');
            }
        } catch (err) {
            console.error('Error saving course:', err);
            const errorMessage = err.message || 'Failed to save course';
            setError(errorMessage);
            
            // Show detailed error if available
            if (err.errors && Array.isArray(err.errors)) {
                alert('Validation errors:\n' + err.errors.join('\n'));
            } else {
                alert('Error: ' + errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleModuleChange = e => {
        const { name, value } = e.target;
        setModuleForm(prev => ({ ...prev, [name]: value }));
    };

    const handleAddOrEditModule = async e => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('adminToken');
            
            const moduleData = {
                ...moduleForm,
                number: moduleForm.number ? parseInt(moduleForm.number) : undefined,
            };

            let response;
            if (editingModuleId) {
                response = await adminTrainingAPI.updateModule(token, editingModuleId, moduleData);
        } else {
                response = await adminTrainingAPI.createModule(token, currentCourseId, moduleData);
        }

            if (response.success) {
                await fetchCourseDetails();
        setModuleForm(initialModuleForm);
                setEditingModuleId(null);
                alert(editingModuleId ? 'Module updated successfully!' : 'Module created successfully!');
            }
        } catch (err) {
            console.error('Error saving module:', err);
            setError(err.message || 'Failed to save module');
            alert('Error: ' + (err.message || 'Failed to save module'));
        } finally {
            setLoading(false);
        }
    };

    const handleEditModule = (moduleId) => {
        const module = courseDetails?.modules?.find(m => m._id === moduleId);
        if (module) {
            setModuleForm({
                title: module.title || '',
                subtitle: module.subtitle || '',
                description: module.description || '',
                objective: module.objective || '',
                duration: module.duration || '',
                icon: module.icon || '💼',
                color: module.color || 'from-blue-500 to-cyan-500',
                outcome: module.outcome || '',
                evaluationMethod: module.evaluationMethod || '',
                number: module.number || '',
            });
            setEditingModuleId(moduleId);
        }
    };

    const handleDeleteModule = async (moduleId) => {
        if (!window.confirm('Are you sure you want to delete this module? All topics and quizzes will also be deleted.')) {
            return;
        }
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            const response = await adminTrainingAPI.deleteModule(token, moduleId);
            if (response.success) {
                await fetchCourseDetails();
                alert('Module deleted successfully!');
            }
        } catch (err) {
            console.error('Error deleting module:', err);
            alert('Error: ' + (err.message || 'Failed to delete module'));
        } finally {
            setLoading(false);
        }
    };

    const handleTopicChange = e => {
        const { name, value } = e.target;
        setTopicForm(prev => ({ ...prev, [name]: value }));
    };

    const handleAddOrEditTopic = async e => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('adminToken');
            
            const topicData = {
                ...topicForm,
                number: topicForm.number ? parseInt(topicForm.number) : undefined,
            };

            let response;
            if (editingTopicId) {
                response = await adminTrainingAPI.updateTopic(token, editingTopicId, topicData);
        } else {
                response = await adminTrainingAPI.createTopic(token, selectedModuleId, topicData);
        }

            if (response.success) {
                await fetchCourseDetails();
        setTopicForm(initialTopicForm);
                setEditingTopicId(null);
                alert(editingTopicId ? 'Topic updated successfully!' : 'Topic created successfully!');
            }
        } catch (err) {
            console.error('Error saving topic:', err);
            setError(err.message || 'Failed to save topic');
            alert('Error: ' + (err.message || 'Failed to save topic'));
        } finally {
            setLoading(false);
        }
    };

    const handleEditTopic = (topicId) => {
        const module = courseDetails?.modules?.find(m => m._id === selectedModuleId);
        const topic = module?.topics?.find(t => t._id === topicId);
        if (topic) {
            setTopicForm({
                title: topic.title || '',
                content: topic.content || '',
                videoUrl: topic.videoUrl || '',
                number: topic.number || '',
                duration: topic.duration || '',
            });
            setEditingTopicId(topicId);
        }
    };

    const handleDeleteTopic = async (topicId) => {
        if (!window.confirm('Are you sure you want to delete this topic? All quizzes will also be deleted.')) {
            return;
        }
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            const response = await adminTrainingAPI.deleteTopic(token, topicId);
            if (response.success) {
                await fetchCourseDetails();
                alert('Topic deleted successfully!');
            }
        } catch (err) {
            console.error('Error deleting topic:', err);
            alert('Error: ' + (err.message || 'Failed to delete topic'));
        } finally {
            setLoading(false);
        }
    };

    const handleQuizFormChange = (e, idx = null) => {
        if (idx === null) {
            const { name, value } = e.target;
            setQuizForm(prev => ({ ...prev, [name]: name === 'correctAnswer' ? parseInt(value) : value }));
        } else {
            setQuizForm(prev => ({ ...prev, options: prev.options.map((opt, i) => (i === idx ? e.target.value : opt)) }));
        }
    };

    const handleAddOrEditQuiz = async e => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('adminToken');
            
            const quizData = {
                ...quizForm,
                options: quizForm.options.filter(opt => opt.trim() !== ''),
            };

            if (quizData.options.length < 2) {
                alert('Please provide at least 2 options');
                setLoading(false);
                return;
            }

            let response;
            if (editingQuizId) {
                response = await adminTrainingAPI.updateQuiz(token, editingQuizId, quizData);
        } else {
                response = await adminTrainingAPI.createQuiz(token, selectedTopicId, quizData);
            }

            if (response.success) {
                await fetchCourseDetails();
        setQuizForm(initialQuizForm);
                setEditingQuizId(null);
                alert(editingQuizId ? 'Quiz updated successfully!' : 'Quiz created successfully!');
            }
        } catch (err) {
            console.error('Error saving quiz:', err);
            setError(err.message || 'Failed to save quiz');
            alert('Error: ' + (err.message || 'Failed to save quiz'));
        } finally {
            setLoading(false);
        }
    };

    const handleEditQuiz = (quizId) => {
        const module = courseDetails?.modules?.find(m => m._id === selectedModuleId);
        const topic = module?.topics?.find(t => t._id === selectedTopicId);
        const quiz = topic?.quizzes?.find(q => q._id === quizId);
        if (quiz) {
            setQuizForm({
                question: quiz.question || '',
                options: quiz.options?.length ? [...quiz.options, '', '', '', ''].slice(0, 4) : ['', '', '', ''],
                correctAnswer: quiz.correctAnswer || 0,
                explanation: quiz.explanation || '',
                points: quiz.points || 1,
            });
            setEditingQuizId(quizId);
        }
    };

    const handleDeleteQuiz = async (quizId) => {
        if (!window.confirm('Are you sure you want to delete this quiz?')) {
            return;
        }
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            const response = await adminTrainingAPI.deleteQuiz(token, quizId);
            if (response.success) {
                await fetchCourseDetails();
                alert('Quiz deleted successfully!');
            }
        } catch (err) {
            console.error('Error deleting quiz:', err);
            alert('Error: ' + (err.message || 'Failed to delete quiz'));
        } finally {
            setLoading(false);
        }
    };

    const handleEnterTopics = (moduleId) => {
        setSelectedModuleId(moduleId);
        setStep(STEP.TOPICS);
    };

    const handleEnterQuiz = (topicId) => {
        setSelectedTopicId(topicId);
        setStep(STEP.QUIZ);
    };

    const backToCourse = () => {
        setStep(STEP.COURSE);
        setModuleForm(initialModuleForm);
        setEditingModuleId(null);
    };

    const backToModules = () => {
        setStep(STEP.MODULES);
        setTopicForm(initialTopicForm);
        setEditingTopicId(null);
        setSelectedModuleId(null);
    };

    const backToTopics = () => {
        setStep(STEP.TOPICS);
        setQuizForm(initialQuizForm);
        setEditingQuizId(null);
        setSelectedTopicId(null);
    };

    const handleEditCourse = async (course) => {
        setCurrentCourseId(course._id);
        setIsEditMode(true);
        setView(VIEW.CREATE);
        setStep(STEP.COURSE);
        // Reset image selection when starting to edit
        setSelectedImage(null);
        setImagePreview(course.imageUrl || '');
    };

    // Handle image upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteCourse = async (courseId) => {
        if (!window.confirm('Are you sure you want to delete this course? All modules, topics, and quizzes will also be deleted.')) {
            return;
        }
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            const response = await adminTrainingAPI.deleteCourse(token, courseId);
            if (response.success) {
                await fetchCourses();
                alert('Course deleted successfully!');
            }
        } catch (err) {
            console.error('Error deleting course:', err);
            alert('Error: ' + (err.message || 'Failed to delete course'));
        } finally {
            setLoading(false);
        }
    };

    const handleViewCourse = async (courseId) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            const response = await adminTrainingAPI.getCourseById(token, courseId);
            if (response.success) {
                setViewingCourse(response.data);
            }
        } catch (err) {
            console.error('Error fetching course:', err);
            alert('Error: ' + (err.message || 'Failed to fetch course'));
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePublish = async (courseId, currentStatus) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            const response = await adminTrainingAPI.toggleCoursePublish(token, courseId);
            if (response.success) {
                await fetchCourses();
                alert(response.message || `Course ${currentStatus ? 'unpublished' : 'published'} successfully!`);
            } else {
                alert('Error: ' + (response.message || 'Failed to toggle publish status'));
            }
        } catch (err) {
            console.error('Error toggling publish status:', err);
            alert('Error: ' + (err.message || 'Failed to toggle publish status'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-4 md:py-8 px-2 md:px-6">
            {/* Header */}
            <div className="w-full max-w-6xl mb-3 md:mb-6">
                <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-xl md:text-3xl font-bold text-gray-900">Training Management</h1>
                    <p className="text-xs md:text-sm text-gray-600 mt-0.5 md:mt-1">Manage courses, modules, topics, and quizzes</p>
                </div>
                    <div className="flex gap-2">
                        {view === VIEW.USER_PROGRESS ? (
                            <button
                                type="button"
                                onClick={() => setView(VIEW.LIST)}
                                className="shrink-0 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs md:text-sm font-semibold px-3 py-2 md:px-4 md:py-2 rounded-lg border"
                            >
                                ← Back to Courses
                            </button>
                        ) : view === VIEW.LIST ? (
                            <>
                                <button
                                    type="button"
                                    onClick={() => setView(VIEW.USER_PROGRESS)}
                                    className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm font-semibold px-3 py-2 md:px-4 md:py-2 rounded-lg shadow"
                                >
                                    📊 User Progress
                                </button>
                    <button
                        type="button"
                        onClick={() => {
                            setIsEditMode(false);
                            setCourseForm(initialCourseForm);
                            setCurrentCourseId(null);
                            setCourseDetails(null);
                                        setSelectedImage(null);
                                        setImagePreview('');
                            setView(VIEW.CREATE);
                            setStep(STEP.COURSE);
                        }}
                        className="shrink-0 bg-orange-600 hover:bg-orange-700 text-white text-xs md:text-sm font-semibold px-3 py-2 md:px-4 md:py-2 rounded-lg shadow"
                    >
                        + Create Course
                    </button>
                            </>
                ) : (
                    <button
                        type="button"
                        onClick={() => {
                            setView(VIEW.LIST);
                            setCurrentCourseId(null);
                            setCourseDetails(null);
                        }}
                        className="shrink-0 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs md:text-sm font-semibold px-3 py-2 md:px-4 md:py-2 rounded-lg border"
                    >
                        ← Back to Courses
                    </button>
                )}
                    </div>
                </div>
            </div>

            {error && (
                <div className="w-full max-w-6xl mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {/* USER PROGRESS VIEW */}
            {view === VIEW.USER_PROGRESS && (
                <div className="w-full max-w-6xl">
                    {/* Filters */}
                    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-4 md:mb-6">
                        <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Filters</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                                <select
                                    value={filterCourseId}
                                    onChange={(e) => setFilterCourseId(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                >
                                    <option value="">All Courses</option>
                                    {courses.map(course => (
                                        <option key={course._id} value={course._id}>{course.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                                <select
                                    value={filterPaymentStatus}
                                    onChange={(e) => setFilterPaymentStatus(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                >
                                    <option value="">All Payments</option>
                                    <option value="completed">Paid</option>
                                    <option value="pending">Pending</option>
                                    <option value="failed">Failed</option>
                                </select>
                            </div>
                            <div className="flex items-center">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={filterCertificateOnly}
                                        onChange={(e) => setFilterCertificateOnly(e.target.checked)}
                                        className="form-checkbox h-4 w-4 text-orange-600"
                                    />
                                    <span className="text-sm text-gray-700">Certificate Only</span>
                                </label>
                            </div>
                            <div className="flex items-center">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={filterCompletedOnly}
                                        onChange={(e) => setFilterCompletedOnly(e.target.checked)}
                                        className="form-checkbox h-4 w-4 text-orange-600"
                                    />
                                    <span className="text-sm text-gray-700">Completed Only</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* User Progress Table */}
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <FaSpinner className="animate-spin text-4xl text-orange-600" />
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quizzes</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Certificate</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {userProgress.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                                                    No user progress found
                                                </td>
                                            </tr>
                                        ) : (
                                            userProgress.map((progress) => {
                                                const userName = progress.user
                                                    ? `${progress.user.firstName || ''} ${progress.user.lastName || ''}`.trim() || progress.user.email
                                                    : 'Unknown User';
                                                const userEmail = progress.user?.email || 'N/A';
                                                const courseTitle = progress.courseTitle || progress.course?.title || 'Unknown Course';
                                                
                                                return (
                                                    <tr key={progress._id} className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">{userName}</div>
                                                            <div className="text-xs text-gray-500">{userEmail}</div>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="text-sm text-gray-900">{courseTitle}</div>
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">{progress.overallProgress || 0}%</div>
                                                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                                                <div
                                                                    className="bg-orange-600 h-2 rounded-full"
                                                                    style={{ width: `${progress.overallProgress || 0}%` }}
                                                                ></div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">
                                                                {progress.completedQuizzes || 0} / {progress.totalQuizzes || 0}
                                                            </div>
                                                            {progress.allQuizzesCompleted && (
                                                                <span className="text-xs text-green-600 font-medium">✓ All Clear</span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            {progress.certificateGenerated ? (
                                                                <div>
                                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                        ✓ Generated
                                                                    </span>
                                                                    {progress.certificateGeneratedAt && (
                                                                        <div className="text-xs text-gray-500 mt-1">
                                                                            {new Date(progress.certificateGeneratedAt).toLocaleDateString()}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                                    Not Generated
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            {progress.certificatePaymentStatus ? (
                                                                <div>
                                                                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                        progress.certificatePaymentStatus === 'completed'
                                                                            ? 'bg-green-100 text-green-800'
                                                                            : progress.certificatePaymentStatus === 'pending'
                                                                            ? 'bg-yellow-100 text-yellow-800'
                                                                            : 'bg-red-100 text-red-800'
                                                                    }`}>
                                                                        {progress.certificatePaymentStatus === 'completed' ? '✓ Paid' : 
                                                                         progress.certificatePaymentStatus === 'pending' ? '⏳ Pending' : 
                                                                         progress.certificatePaymentStatus}
                                                                    </div>
                                                                    {progress.certificateAmount && (
                                                                        <div className="text-sm font-semibold text-gray-900 mt-1">
                                                                            ₹{progress.certificateAmount}
                                                                        </div>
                                                                    )}
                                                                    {progress.certificatePaidAt && (
                                                                        <div className="text-xs text-gray-500 mt-1">
                                                                            {new Date(progress.certificatePaidAt).toLocaleDateString()}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                                    No Payment
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                progress.enrollmentStatus === 'completed' 
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : progress.enrollmentStatus === 'in_progress'
                                                                    ? 'bg-yellow-100 text-yellow-800'
                                                                    : 'bg-blue-100 text-blue-800'
                                                            }`}>
                                                                {progress.enrollmentStatus || 'enrolled'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* LIST VIEW */}
            {view === VIEW.LIST && (
                <div className="w-full max-w-6xl">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <FaSpinner className="animate-spin text-4xl text-orange-600" />
                        </div>
                    ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                        {courses.map(course => (
                                <div key={course._id} className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 md:p-6 flex flex-col">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <h3 className="text-base md:text-lg font-semibold text-gray-900 line-clamp-1">{course.title}</h3>
                                        <p className="text-xs md:text-sm text-gray-600 line-clamp-2">{course.subtitle}</p>
                                    </div>
                                        <span className={`text-[10px] md:text-xs px-2 py-1 rounded font-medium ${
                                            course.isPublished ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-700'
                                        }`}>
                                            {course.isPublished ? 'Published' : 'Draft'}
                                        </span>
                                </div>
                                <div className="mt-3 md:mt-4 grid grid-cols-2 gap-2 text-[11px] md:text-sm text-gray-700">
                                    <div className="bg-gray-50 rounded px-2 py-1.5">Duration: <span className="font-semibold">{course.minimumDuration}</span></div>
                                    <div className="bg-gray-50 rounded px-2 py-1.5">Modules: <span className="font-semibold">{course.totalModules}</span></div>
                                    <div className="bg-gray-50 rounded px-2 py-1.5">Rating: <span className="font-semibold">{course.rating}</span></div>
                                        <div className="bg-gray-50 rounded px-2 py-1.5">Students: <span className="font-semibold">{course.studentsEnrolled}</span></div>
                                </div>
                                <div className="mt-3 md:mt-4 flex items-center justify-between gap-2">
                                    <span className="text-[10px] md:text-xs text-gray-500">Language: {course.language}</span>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                                onClick={() => handleViewCourse(course._id)}
                                            className="text-[11px] md:text-sm px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium"
                                        >
                                            View
                                        </button>
                                        <button
                                            type="button"
                                                onClick={() => handleTogglePublish(course._id, course.isPublished)}
                                                className={`text-[11px] md:text-sm px-3 py-1.5 rounded font-semibold ${
                                                    course.isPublished 
                                                        ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                                                        : 'bg-green-600 hover:bg-green-700 text-white'
                                                }`}
                                        >
                                            {course.isPublished ? 'Unpublish' : 'Publish'}
                                        </button>
                                        <button
                                            type="button"
                                                onClick={() => handleEditCourse(course)}
                                            className="text-[11px] md:text-sm px-3 py-1.5 rounded bg-orange-600 hover:bg-orange-700 text-white font-semibold"
                                        >
                                            Edit
                                        </button>
                        <button
                            type="button"
                                                onClick={() => handleDeleteCourse(course._id)}
                                                className="text-[11px] md:text-sm px-3 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white font-semibold"
                                            >
                                                Delete
                        </button>
                    </div>
                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                        </div>
                                                    )}

            {/* CREATE/EDIT VIEW: Wizard Steps */}
            {view === VIEW.CREATE && loading && (
                <div className="flex items-center justify-center py-12">
                    <FaSpinner className="animate-spin text-4xl text-orange-600" />
                        </div>
                    )}

            {/* STEP 1: COURSE */}
            {view === VIEW.CREATE && step === STEP.COURSE && !loading && (
                <div className="bg-white rounded-xl md:rounded-2xl shadow-lg w-full max-w-2xl p-4 md:p-6 mb-4 md:mb-6">
                    <h1 className="text-lg md:text-3xl font-bold text-orange-600 mb-3 md:mb-4 text-center">
                        {isEditMode ? 'Edit Course (Step 1/4)' : 'Create Course (Step 1/4)'}
                    </h1>
                    <form className="space-y-3 md:space-y-4" onSubmit={handleCreateCourse}>
                        <div>
                            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Course Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={courseForm.title}
                                onChange={handleCourseChange}
                                required
                                className="w-full px-3 md:px-4 py-1.5 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm md:text-base"
                                placeholder="Enter course title"
                            />
                        </div>
                        <div>
                            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Course Subtitle</label>
                            <input
                                type="text"
                                name="subtitle"
                                value={courseForm.subtitle}
                                onChange={handleCourseChange}
                                className="w-full px-3 md:px-4 py-1.5 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm md:text-base"
                                placeholder="Enter course subtitle"
                            />
                        </div>
                        <div>
                            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Description *</label>
                            <textarea
                                name="description"
                                value={courseForm.description}
                                onChange={handleCourseChange}
                                rows={3}
                                required
                                className="w-full px-3 md:px-4 py-1.5 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm md:text-base"
                                placeholder="Course description"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                            <div>
                                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Provider *</label>
                                <input
                                    type="text"
                                    name="provider"
                                    value={courseForm.provider}
                                    onChange={handleCourseChange}
                                    required
                                    className="w-full px-3 md:px-4 py-1.5 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm md:text-base"
                                />
                            </div>
                            <div>
                                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Instructor Name *</label>
                                <input
                                    type="text"
                                    name="instructor"
                                    value={courseForm.instructor}
                                    onChange={handleCourseChange}
                                    required
                                    className="w-full px-3 md:px-4 py-1.5 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm md:text-base"
                                />
                            </div>
                            <div>
                                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Instructor Email</label>
                                <input
                                    type="email"
                                    name="instructorEmail"
                                    value={courseForm.instructorEmail}
                                    onChange={handleCourseChange}
                                    className="w-full px-3 md:px-4 py-1.5 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm md:text-base"
                                />
                            </div>
                            <div>
                                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Instructor Website</label>
                                <input
                                    type="text"
                                    name="instructorWebsite"
                                    value={courseForm.instructorWebsite}
                                    onChange={handleCourseChange}
                                    className="w-full px-3 md:px-4 py-1.5 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm md:text-base"
                                />
                            </div>
                            <div>
                                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Minimum Duration *</label>
                                <input
                                    type="text"
                                    name="minimumDuration"
                                    value={courseForm.minimumDuration}
                                    onChange={handleCourseChange}
                                    required
                                    className="w-full px-3 md:px-4 py-1.5 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm md:text-base"
                                    placeholder="e.g. 45 hours"
                                />
                            </div>
                            <div>
                                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Total Modules</label>
                                <input
                                    type="number"
                                    name="totalModules"
                                    value={courseForm.totalModules}
                                    onChange={handleCourseChange}
                                    className="w-full px-3 md:px-4 py-1.5 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm md:text-base"
                                    placeholder="e.g. 9"
                                />
                            </div>
                            <div>
                                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Language *</label>
                                <input
                                    type="text"
                                    name="language"
                                    value={courseForm.language}
                                    onChange={handleCourseChange}
                                    required
                                    className="w-full px-3 md:px-4 py-1.5 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm md:text-base"
                                    placeholder="e.g. Hindi, English"
                                />
                            </div>
                            <div>
                                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Eligibility</label>
                                <input
                                    type="text"
                                    name="eligibility"
                                    value={courseForm.eligibility}
                                    onChange={handleCourseChange}
                                    className="w-full px-3 md:px-4 py-1.5 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm md:text-base"
                                />
                            </div>
                            <div>
                                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Rating</label>
                                <input
                                    type="text"
                                    name="rating"
                                    value={courseForm.rating}
                                    onChange={handleCourseChange}
                                    className="w-full px-3 md:px-4 py-1.5 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm md:text-base"
                                    placeholder="e.g. 4.9"
                                />
                            </div>
                            <div>
                                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Students Enrolled</label>
                                <input
                                    type="number"
                                    name="studentsEnrolled"
                                    value={courseForm.studentsEnrolled}
                                    onChange={handleCourseChange}
                                    className="w-full px-3 md:px-4 py-1.5 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm md:text-base"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center md:flex-wrap gap-3 md:gap-6 pt-2">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="certificate"
                                    checked={courseForm.certificate}
                                    onChange={handleCourseChange}
                                    className="form-checkbox h-4 w-4 md:h-5 md:w-5 text-orange-600"
                                />
                                <span className="text-xs md:text-sm text-gray-700">Certificate Available?</span>
                            </label>
                            {courseForm.certificate && (
                                <>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xs md:text-sm text-gray-600">Certificate Amount (₹):</span>
                                        <input
                                            type="number"
                                            name="certificateAmount"
                                            value={courseForm.certificateAmount}
                                            onChange={handleCourseChange}
                                            min={0}
                                            className="w-20 md:w-24 px-2 py-1 border border-gray-300 rounded focus:ring-orange-500 text-xs md:text-sm"
                                            placeholder="199"
                                        />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xs md:text-sm text-gray-600">Min Passing Score:</span>
                                    <input
                                        type="number"
                                        name="minPassScore"
                                        value={courseForm.minPassScore}
                                        onChange={handleCourseChange}
                                        min={0}
                                        max={100}
                                            className="w-16 md:w-20 px-2 py-1 border border-gray-300 rounded focus:ring-orange-500 text-xs md:text-sm"
                                    />
                                    </div>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="autoGenerateCert"
                                            checked={courseForm.autoGenerateCert}
                                            onChange={handleCourseChange}
                                            className="form-checkbox h-4 w-4 md:h-5 md:w-5 text-orange-600"
                                        />
                                        <span className="text-xs md:text-sm text-gray-700">Auto-generate Certificate</span>
                                    </label>
                                </>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Course Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full px-3 md:px-4 py-1.5 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm md:text-base"
                            />
                            {imagePreview && (
                                <div className="mt-2">
                                    <p className="text-xs text-gray-500 mb-1">Image Preview:</p>
                                    <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover rounded-lg border border-gray-200" />
                                </div>
                            )}
                        </div>
                        <div>
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 py-2 px-6 rounded-lg text-white font-semibold hover:shadow-lg transition-all duration-300 mt-3 text-sm md:text-base disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : (isEditMode ? 'Update Course →' : 'Create Course →')}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* STEP 2: MODULES */}
            {view === VIEW.CREATE && step === STEP.MODULES && !loading && (
                <div className="bg-white rounded-xl md:rounded-2xl shadow-lg w-full max-w-3xl p-4 md:p-6 mb-4 md:mb-6">
                    <h2 className="text-lg md:text-2xl font-bold text-orange-500 mb-2 text-center">Add Modules (Step 2/4)</h2>
                    <p className="text-sm md:text-base text-gray-700 text-center mb-3 md:mb-4">Course: <span className="font-bold">{courseForm.title}</span></p>
                    
                    {courseDetails?.modules && courseDetails.modules.length > 0 && (
                        <div className="space-y-2 md:space-y-4 mb-4 md:mb-6">
                            {courseDetails.modules.map((mod) => (
                                <div key={mod._id} className="p-3 md:p-4 rounded-lg border border-gray-200 bg-gray-50 mb-2 relative">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center flex-wrap gap-1 md:gap-2">
                                                <span className="font-semibold text-sm md:text-base text-gray-900 truncate">
                                                    Module {mod.number}: {mod.title || 'Untitled Module'}
                                                </span>
                                                <span className="text-[10px] md:text-xs text-gray-500 whitespace-nowrap">({mod.duration || 'No duration'})</span>
                                            </div>
                                            <div className="text-gray-600 text-xs md:text-sm mt-1 line-clamp-1">{mod.description}</div>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <button type="button" onClick={() => handleEditModule(mod._id)} className="px-2 md:px-3 py-1 text-orange-700 bg-orange-50 rounded hover:bg-orange-100 font-medium text-xs md:text-sm">
                                                <FaEdit className="inline mr-1" /> Edit
                                            </button>
                                            <button type="button" onClick={() => handleDeleteModule(mod._id)} className="px-2 md:px-3 py-1 text-red-600 bg-red-50 hover:bg-red-100 rounded font-medium text-xs md:text-sm">
                                                <FaTrash className="inline mr-1" /> Delete
                                            </button>
                                            <button type="button" onClick={() => handleEnterTopics(mod._id)} className="px-2 md:px-3 py-1 bg-blue-600 text-white hover:bg-blue-700 rounded font-medium text-xs md:text-sm">
                                                Topics →
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    <form onSubmit={handleAddOrEditModule} className="space-y-3 md:space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Module Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={moduleForm.title}
                                onChange={handleModuleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500"
                                placeholder="Module title"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Module Number</label>
                                <input
                                    type="number"
                                    name="number"
                                    value={moduleForm.number}
                                    onChange={handleModuleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500"
                                    placeholder="Auto if empty"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                            <input
                                type="text"
                                    name="duration"
                                    value={moduleForm.duration}
                                onChange={handleModuleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500"
                                    placeholder="e.g. 5 hours"
                            />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                name="description"
                                value={moduleForm.description}
                                onChange={handleModuleChange}
                                rows={2}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500"
                                placeholder="Module description"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Objective</label>
                            <input
                                type="text"
                                name="objective"
                                value={moduleForm.objective}
                                onChange={handleModuleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500"
                                placeholder="Module objective"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Outcome</label>
                            <input
                                type="text"
                                name="outcome"
                                value={moduleForm.outcome}
                                onChange={handleModuleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500"
                                placeholder="What will the learner achieve?"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Evaluation Method</label>
                            <input
                                type="text"
                                name="evaluationMethod"
                                value={moduleForm.evaluationMethod}
                                onChange={handleModuleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500"
                                placeholder="e.g. Quiz, Assignment, Final Assessment"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button type="button" onClick={backToCourse} className="flex-1 px-6 py-2 rounded bg-gray-100 border text-gray-700 font-semibold hover:bg-gray-200">
                                ← Back
                            </button>
                            <button type="submit" disabled={loading} className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 py-2 px-6 rounded-lg text-white font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50">
                                {loading ? 'Saving...' : (editingModuleId ? 'Update Module' : 'Add Module')}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* STEP 3: TOPICS */}
            {view === VIEW.CREATE && step === STEP.TOPICS && !loading && (
                <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl p-6 mb-6">
                    <h2 className="text-xl md:text-2xl font-bold text-blue-600 mb-2 text-center">Add Topics (Step 3/4)</h2>
                    {courseDetails?.modules && (
                        <p className="text-gray-700 text-center mb-3">
                            Module: <span className="font-bold">{courseDetails.modules.find(m => m._id === selectedModuleId)?.title}</span>
                        </p>
                    )}
                    
                    {courseDetails?.modules?.find(m => m._id === selectedModuleId)?.topics && 
                     courseDetails.modules.find(m => m._id === selectedModuleId).topics.length > 0 && (
                        <div className="space-y-3 mb-6">
                            {courseDetails.modules.find(m => m._id === selectedModuleId).topics.map((topic) => (
                                <div key={topic._id} className="p-3 rounded border border-gray-200 bg-gray-50 flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-1">
                                    <div>
                                        <span className="font-semibold text-gray-800">Topic {topic.number}: {topic.title}</span>
                                    </div>
                                    <div className="flex gap-2 mt-1 md:mt-0">
                                        <button type="button" onClick={() => handleEditTopic(topic._id)} className="px-3 py-1 text-blue-700 bg-blue-50 rounded hover:bg-blue-100 font-medium">
                                            Edit
                                        </button>
                                        <button type="button" onClick={() => handleDeleteTopic(topic._id)} className="px-3 py-1 text-red-600 bg-red-50 hover:bg-red-100 rounded font-medium">
                                            Delete
                                        </button>
                                        <button type="button" onClick={() => handleEnterQuiz(topic._id)} className="px-3 py-1 bg-green-600 text-white hover:bg-green-700 rounded font-medium">
                                            Quizzes →
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    <form onSubmit={handleAddOrEditTopic} className="space-y-3 mb-3">
                        <div>
                            <label className="block text-sm font-medium mb-1">Topic Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={topicForm.title}
                                onChange={handleTopicChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Content / Details *</label>
                            <textarea
                                name="content"
                                value={topicForm.content}
                                onChange={handleTopicChange}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">Topic Number</label>
                                <input
                                    type="number"
                                    name="number"
                                    value={topicForm.number}
                                    onChange={handleTopicChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                    placeholder="Auto if empty"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Video URL</label>
                            <input
                                type="url"
                                name="videoUrl"
                                value={topicForm.videoUrl}
                                onChange={handleTopicChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded"
                                placeholder="https://..."
                            />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button type="button" onClick={backToModules} className="flex-1 px-6 py-2 rounded bg-gray-100 border text-gray-700 font-semibold hover:bg-gray-200">
                                ← Modules
                            </button>
                            <button type="submit" disabled={loading} className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 py-2 px-6 rounded-lg text-white font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50">
                                {loading ? 'Saving...' : (editingTopicId ? 'Update Topic' : 'Add Topic')}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* STEP 4: QUIZZES */}
            {view === VIEW.CREATE && step === STEP.QUIZ && !loading && (
                <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl p-6 mb-6">
                    <h2 className="text-xl md:text-2xl font-bold text-green-600 mb-2 text-center">Add Quizzes (Step 4/4)</h2>
                    {courseDetails?.modules && (
                        <p className="text-gray-700 text-center mb-3">
                            Topic: <span className="font-bold">{courseDetails.modules.find(m => m._id === selectedModuleId)?.topics?.find(t => t._id === selectedTopicId)?.title}</span>
                        </p>
                    )}
                    
                    {courseDetails?.modules?.find(m => m._id === selectedModuleId)?.topics?.find(t => t._id === selectedTopicId)?.quizzes && 
                     courseDetails.modules.find(m => m._id === selectedModuleId).topics.find(t => t._id === selectedTopicId).quizzes.length > 0 && (
                        <div className="space-y-2 mb-3">
                            {courseDetails.modules.find(m => m._id === selectedModuleId).topics.find(t => t._id === selectedTopicId).quizzes.map((quiz) => (
                                <div key={quiz._id} className="rounded border border-gray-200 p-2 bg-gray-50 flex flex-col gap-1 mb-1">
                                    <span className="font-medium text-gray-800 text-sm">Q: {quiz.question}</span>
                                    <ol className="pl-6 list-decimal">
                                        {quiz.options.map((opt, i) => (
                                            <li key={i} className={quiz.correctAnswer === i ? 'font-bold text-green-600' : ''}>{opt}</li>
                                        ))}
                                    </ol>
                                    <div className="flex gap-2 mt-1">
                                        <button type="button" className="text-xs text-green-700" onClick={() => handleEditQuiz(quiz._id)}>
                                            Edit
                                        </button>
                                        <button type="button" className="text-xs text-red-700" onClick={() => handleDeleteQuiz(quiz._id)}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    <form onSubmit={handleAddOrEditQuiz} className="bg-white border px-4 py-4 rounded shadow-sm mb-3 space-y-2">
                        <input
                            type="text"
                            name="question"
                            value={quizForm.question}
                            onChange={handleQuizFormChange}
                            placeholder="Enter question *"
                            className="w-full px-2 py-1 border rounded text-sm mb-1"
                            required
                        />
                        {[0, 1, 2, 3].map(i => (
                            <div key={i} className="flex items-center gap-2">
                                <input
                                    type="text"
                                    placeholder={`Option ${i + 1}${i < 2 ? ' *' : ''}`}
                                    value={quizForm.options[i]}
                                    onChange={e => handleQuizFormChange(e, i)}
                                    className="px-2 py-1 border rounded text-sm flex-1"
                                    required={i < 2}
                                />
                                <input
                                    type="radio"
                                    name="correctAnswer"
                                    value={i}
                                    checked={quizForm.correctAnswer === i}
                                    onChange={handleQuizFormChange}
                                />
                                <span className="text-xs">Correct</span>
                            </div>
                        ))}
                        <div>
                            <label className="block text-sm font-medium mb-1">Explanation (Optional)</label>
                            <input
                                type="text"
                                name="explanation"
                                value={quizForm.explanation}
                                onChange={handleQuizFormChange}
                                className="w-full px-2 py-1 border rounded text-sm"
                                placeholder="Explanation for correct answer"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button type="button" onClick={backToTopics} className="flex-1 px-4 py-2 rounded bg-gray-100 border text-gray-700 font-semibold hover:bg-gray-200">
                                ← Topics
                            </button>
                            <button type="submit" disabled={loading} className="flex-1 bg-gradient-to-r from-green-500 to-green-600 py-2 px-6 rounded-lg text-white font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50">
                                {loading ? 'Saving...' : (editingQuizId ? 'Update' : 'Add')} Question
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* View Course Modal */}
            {viewingCourse && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 md:p-4">
                    <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between p-4 md:p-6 border-b">
                            <div>
                                <h2 className="text-lg md:text-2xl font-bold text-gray-900">{viewingCourse.course?.title}</h2>
                                <p className="text-xs md:text-sm text-gray-600 mt-1">{viewingCourse.course?.subtitle}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setViewingCourse(null)}
                                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                            >
                                ×
                            </button>
                        </div>
                        <div className="overflow-y-auto flex-1 p-4 md:p-6">
                            {viewingCourse.modules && viewingCourse.modules.length > 0 ? (
                                <div className="space-y-4">
                                    {viewingCourse.modules.map((module, mIdx) => (
                                        <div key={module._id || mIdx} className="border border-gray-200 rounded-lg p-3 md:p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="text-sm md:text-base font-semibold text-gray-900">
                                                    Module {module.number}: {module.title}
                                                </h3>
                                                <span className="text-[10px] md:text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                                    {module.duration}
                                                </span>
                                            </div>
                                            {module.topics && module.topics.length > 0 && (
                                                <div className="space-y-2 ml-2 md:ml-4">
                                                    {module.topics.map((topic, tIdx) => (
                                                        <div key={topic._id || tIdx} className="border-l-2 border-orange-200 pl-3 py-2">
                                                            <div className="flex items-start justify-between gap-2">
                                                                <div className="flex-1">
                                                                    <h4 className="text-xs md:text-sm font-medium text-gray-800">
                                                                        Topic {topic.number}: {topic.title}
                                                                    </h4>
                                                                    {topic.videoUrl && (
                                                                        <div className="mt-1 text-[10px] md:text-xs text-gray-600">
                                                                            📹 Video: <span className="text-orange-600 truncate">{topic.videoUrl}</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            {topic.quizzes && topic.quizzes.length > 0 && (
                                                                <div className="mt-2 ml-2 space-y-1">
                                                                    {topic.quizzes.map((quiz, qIdx) => (
                                                                        <div key={quiz._id || qIdx} className="text-[10px] md:text-xs text-gray-600">
                                                                            ❓ Quiz {qIdx + 1}: <span className="font-medium">{quiz.question}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500 text-sm">No modules found</div>
                            )}
                        </div>
                        <div className="border-t p-4 md:p-6">
                            <button
                                type="button"
                                onClick={() => setViewingCourse(null)}
                                className="w-full md:w-auto px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium text-sm md:text-base"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminTrainingPage;
