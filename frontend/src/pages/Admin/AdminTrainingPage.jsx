import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AdminTrainingPage = () => {
    const [activeTab, setActiveTab] = useState('modules');
    const [showModuleForm, setShowModuleForm] = useState(false);
    const [showTopicForm, setShowTopicForm] = useState(false);
    const [editingModule, setEditingModule] = useState(null);
    const [editingTopic, setEditingTopic] = useState(null);
    const [selectedModule, setSelectedModule] = useState(null);
    
    const [moduleFormData, setModuleFormData] = useState({
        name: '',
        description: '',
        topics: []
    });

    const [topicFormData, setTopicFormData] = useState({
        title: '',
        description: '',
        video: null,
        quiz: null,
        videoFile: null,
        quizFile: null
    });

    const [modules, setModules] = useState([
        {
            id: 1,
            name: 'Introduction to Entrepreneurship',
            description: 'Learn the fundamentals of starting and running a successful business.',
            topics: [
                {
                    id: 1,
                    title: 'What is Entrepreneurship?',
                    description: 'Understanding the core concepts of entrepreneurship',
                    videoUrl: 'https://example.com/video1.mp4',
                    quizUrl: 'https://example.com/quiz1.pdf'
                },
                {
                    id: 2,
                    title: 'Types of Business Models',
                    description: 'Exploring different business model frameworks',
                    videoUrl: 'https://example.com/video2.mp4',
                    quizUrl: 'https://example.com/quiz2.pdf'
                }
            ]
        },
        {
            id: 2,
            name: 'Digital Marketing Fundamentals',
            description: 'Master the essential digital marketing strategies for modern businesses.',
            topics: [
                {
                    id: 3,
                    title: 'Social Media Marketing',
                    description: 'Leveraging social platforms for business growth',
                    videoUrl: 'https://example.com/video3.mp4',
                    quizUrl: 'https://example.com/quiz3.pdf'
                }
            ]
        }
    ]);

    // Set first module as selected by default
    useEffect(() => {
        if (modules.length > 0 && !selectedModule) {
            setSelectedModule(modules[0]);
        }
    }, [modules, selectedModule]);

    const handleModuleFormChange = (e) => {
        setModuleFormData({
            ...moduleFormData,
            [e.target.name]: e.target.value
        });
    };

    const handleTopicFormChange = (e) => {
        setTopicFormData({
            ...topicFormData,
            [e.target.name]: e.target.value
        });
    };

    const handleVideoUpload = (e) => {
        const file = e.target.files[0];
        setTopicFormData({
            ...topicFormData,
            videoFile: file,
            video: file ? file.name : null
        });
    };

    const handleQuizUpload = (e) => {
        const file = e.target.files[0];
        setTopicFormData({
            ...topicFormData,
            quizFile: file,
            quiz: file ? file.name : null
        });
    };

    const handleModuleSubmit = (e) => {
        e.preventDefault();
        if (editingModule) {
            // Update existing module
            setModules(modules.map(module => 
                module.id === editingModule.id 
                    ? { ...module, ...moduleFormData }
                    : module
            ));
        } else {
            // Create new module
            const newModule = {
                id: Date.now(),
                ...moduleFormData,
                topics: []
            };
            setModules([...modules, newModule]);
        }
        setShowModuleForm(false);
        setEditingModule(null);
        setModuleFormData({ name: '', description: '', topics: [] });
    };

    const handleTopicSubmit = (e) => {
        e.preventDefault();
        if (editingTopic) {
            // Update existing topic
            const updatedModules = modules.map(module => {
                if (module.id === selectedModule.id) {
                    return {
                        ...module,
                        topics: module.topics.map(topic =>
                            topic.id === editingTopic.id
                                ? { ...topic, ...topicFormData }
                                : topic
                        )
                    };
                }
                return module;
            });
            setModules(updatedModules);
        } else {
            // Create new topic
            const newTopic = {
                id: Date.now(),
                ...topicFormData
            };
            const updatedModules = modules.map(module => {
                if (module.id === selectedModule.id) {
                    return {
                        ...module,
                        topics: [...module.topics, newTopic]
                    };
                }
                return module;
            });
            setModules(updatedModules);
        }
        setShowTopicForm(false);
        setEditingTopic(null);
        setTopicFormData({ title: '', description: '', video: null, quiz: null, videoFile: null, quizFile: null });
    };

    const handleEditModule = (module) => {
        setEditingModule(module);
        setModuleFormData({
            name: module.name,
            description: module.description,
            topics: module.topics
        });
        setShowModuleForm(true);
    };

    const handleEditTopic = (topic) => {
        setEditingTopic(topic);
        setTopicFormData({
            title: topic.title,
            description: topic.description,
            video: topic.videoUrl,
            quiz: topic.quizUrl,
            videoFile: null,
            quizFile: null
        });
        setShowTopicForm(true);
    };

    const handleDeleteModule = (moduleId) => {
        if (window.confirm('Are you sure you want to delete this module?')) {
            setModules(modules.filter(module => module.id !== moduleId));
        }
    };

    const handleDeleteTopic = (topicId) => {
        if (window.confirm('Are you sure you want to delete this topic?')) {
            const updatedModules = modules.map(module => ({
                ...module,
                topics: module.topics.filter(topic => topic.id !== topicId)
            }));
            setModules(updatedModules);
        }
    };

    const renderModulesList = () => (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Training Modules</h2>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        setEditingModule(null);
                        setModuleFormData({ name: '', description: '', topics: [] });
                        setShowModuleForm(true);
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
                >
                    Create New Module
                </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {modules.map((module) => (
                    <motion.div
                        key={module.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                                <span className="text-white text-xl">📚</span>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEditModule(module)}
                                    className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => handleDeleteModule(module.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-gray-800 mb-2">{module.name}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">{module.description}</p>
                        
                        <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-gray-500">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                {module.topics.length} Topics
                            </div>
                            <button
                                onClick={() => {
                                    setSelectedModule(module);
                                    setActiveTab('topics');
                                }}
                                className="text-orange-600 hover:text-orange-700 font-medium text-sm"
                            >
                                Manage Topics →
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );

    const renderTopicsList = () => (
        <div className="space-y-4">
            <div className="mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-shrink-0">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">Topics in "{selectedModule?.name}"</h2>
                        <p className="text-gray-600 text-sm md:text-base">{selectedModule?.topics.length} topics</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                setEditingTopic(null);
                                setTopicFormData({ title: '', description: '', video: null, quiz: null, videoFile: null, quizFile: null });
                                setShowTopicForm(true);
                            }}
                            className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 text-sm md:text-base"
                        >
                            Create New Topic
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveTab('modules')}
                            className="px-4 py-2 md:px-6 md:py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300 text-sm md:text-base"
                        >
                            Back to Modules
                        </motion.button>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {selectedModule?.topics.map((topic) => (
                    <motion.div
                        key={topic.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start space-x-4">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                    <span className="text-white text-lg">🎯</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-800 mb-2">{topic.title}</h3>
                                    <p className="text-gray-600 mb-3">{topic.description}</p>
                                    
                                    <div className="flex flex-wrap gap-4 text-sm">
                                        <div className="flex items-center text-green-600">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                            Video: {topic.videoUrl ? 'Uploaded' : 'Not uploaded'}
                                        </div>
                                        <div className="flex items-center text-purple-600">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            Quiz: {topic.quizUrl ? 'Uploaded' : 'Not uploaded'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEditTopic(topic)}
                                    className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => handleDeleteTopic(topic.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );

    const renderModuleForm = () => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowModuleForm(false)}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800">
                        {editingModule ? 'Edit Module' : 'Create New Module'}
                    </h3>
                    <button
                        onClick={() => setShowModuleForm(false)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleModuleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Module Name</label>
                        <input
                            type="text"
                            name="name"
                            value={moduleFormData.name}
                            onChange={handleModuleFormChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="Enter module name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            name="description"
                            value={moduleFormData.description}
                            onChange={handleModuleFormChange}
                            required
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="Enter module description"
                        />
                    </div>

                    <div className="flex space-x-4 pt-4">
                        <motion.button
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowModuleForm(false)}
                            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                        >
                            {editingModule ? 'Update Module' : 'Create Module'}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );

    const renderTopicForm = () => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowTopicForm(false)}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800">
                        {editingTopic ? 'Edit Topic' : 'Create New Topic'}
                    </h3>
                    <button
                        onClick={() => setShowTopicForm(false)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleTopicSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Topic Title</label>
                        <input
                            type="text"
                            name="title"
                            value={topicFormData.title}
                            onChange={handleTopicFormChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="Enter topic title"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            name="description"
                            value={topicFormData.description}
                            onChange={handleTopicFormChange}
                            required
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="Enter topic description"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Video Upload</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                            <input
                                type="file"
                                accept="video/*"
                                onChange={handleVideoUpload}
                                className="w-full"
                            />
                            {topicFormData.video && (
                                <p className="text-sm text-green-600 mt-2">✓ {topicFormData.video}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Upload</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={handleQuizUpload}
                                className="w-full"
                            />
                            {topicFormData.quiz && (
                                <p className="text-sm text-green-600 mt-2">✓ {topicFormData.quiz}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex space-x-4 pt-4">
                        <motion.button
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowTopicForm(false)}
                            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                        >
                            {editingTopic ? 'Update Topic' : 'Create Topic'}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Training Management</h1>
                        <p className="text-gray-600 mt-1">Manage training modules and topics</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <div className="text-sm text-gray-500">Total Modules</div>
                            <div className="text-2xl font-bold text-orange-600">{modules.length}</div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200">

                {/* Tab Navigation */}
                <div className="border-b border-gray-200">
                    <div className="px-2 md:px-6">
                        <div className="flex space-x-1 md:space-x-2 overflow-x-auto scrollbar-hide">
                        <motion.button
                            onClick={() => setActiveTab('modules')}
                            className={`relative py-2 md:py-4 text-xs md:text-sm font-medium rounded-lg md:rounded-t-2xl transition-all duration-300 whitespace-nowrap px-3 md:px-4 ${
                                activeTab === 'modules'
                                    ? 'text-white'
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                            whileHover={{ y: -1 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {activeTab === 'modules' && (
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg md:rounded-t-2xl shadow-md"
                                    layoutId="activeTab"
                                    transition={{
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 30
                                    }}
                                />
                            )}
                            <span className="relative z-10">
                                Modules
                            </span>
                        </motion.button>

                        <motion.button
                            onClick={() => setActiveTab('topics')}
                            disabled={!selectedModule}
                            className={`relative py-2 md:py-4 text-xs md:text-sm font-medium rounded-lg md:rounded-t-2xl transition-all duration-300 whitespace-nowrap px-3 md:px-4 ${
                                activeTab === 'topics'
                                    ? 'text-white'
                                    : selectedModule 
                                        ? 'text-gray-600 hover:text-gray-800'
                                        : 'text-gray-400 cursor-not-allowed'
                            }`}
                            whileHover={selectedModule ? { y: -1 } : {}}
                            whileTap={selectedModule ? { scale: 0.98 } : {}}
                        >
                            {activeTab === 'topics' && (
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg md:rounded-t-2xl shadow-md"
                                    layoutId="activeTab"
                                    transition={{
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 30
                                    }}
                                />
                            )}
                            <span className="relative z-10">
                                Topics
                            </span>
                        </motion.button>
                    </div>
                </div>
            </div>

                {/* Content */}
                <div className="p-4">
                    {activeTab === 'modules' && renderModulesList()}
                    {activeTab === 'topics' && selectedModule && renderTopicsList()}
                </div>
            </div>

            {/* Forms */}
            {showModuleForm && renderModuleForm()}
            {showTopicForm && renderTopicForm()}
        </div>
    );
};

export default AdminTrainingPage;
