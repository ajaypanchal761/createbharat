import React, { useState } from 'react';

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
    students: '',
    certificate: false,
    minPassScore: 70,
    autoGenerateCert: true,
    modules: [],
};
const initialModuleForm = {
    title: '',
    subtitle: '',
    description: '',
    objective: '',
    duration: '',
    icon: '',
    color: '',
    outcome: '',
    evaluation: '',
    topics: [],
};
const initialTopicForm = {
    title: '',
    content: '',
    videoUrl: '',
    quizzes: [],
};
const initialQuizForm = {
    question: '',
    options: ['', '', '', ''],
    correct: 0,
};

const STEP = {
    COURSE: 1,
    MODULES: 2,
    TOPICS: 3,
    QUIZ: 4
};

const AdminTrainingPage = () => {
    const [step, setStep] = useState(STEP.COURSE);
    const [courseForm, setCourseForm] = useState(initialCourseForm);
    const [createdCourse, setCreatedCourse] = useState(null);
    const [moduleForm, setModuleForm] = useState(initialModuleForm);
    const [editingModuleIndex, setEditingModuleIndex] = useState(null);
    const [selectedModuleIdx, setSelectedModuleIdx] = useState(null);
    const [topicForm, setTopicForm] = useState(initialTopicForm);
    const [editingTopicIndex, setEditingTopicIndex] = useState(null);
    const [selectedTopicIdx, setSelectedTopicIdx] = useState(null);
    const [quizForm, setQuizForm] = useState(initialQuizForm);
    const [editingQuizIndex, setEditingQuizIndex] = useState(null);

    const handleCourseChange = e => {
        const { name, value, type, checked } = e.target;
        setCourseForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // Wizard: Step 1 -> Step 2
    const handleCreateCourse = e => {
        e.preventDefault();
        setCreatedCourse(courseForm);
        setStep(STEP.MODULES);
    };
    // Wizard: Step 2 -> Step 3
    const handleEnterTopics = moduleIdx => {
        setSelectedModuleIdx(moduleIdx);
        setStep(STEP.TOPICS);
    };
    // Wizard: Step 3 -> Step 4
    const handleEnterQuiz = topicIdx => {
        setSelectedTopicIdx(topicIdx);
        setStep(STEP.QUIZ);
    };

    // Modules logic
    const handleModuleChange = e => {
        const { name, value } = e.target;
        setModuleForm(prev => ({ ...prev, [name]: value }));
    };
    const handleAddOrEditModule = e => {
        e.preventDefault();
        let modules = createdCourse.modules ? [...createdCourse.modules] : [];
        if (editingModuleIndex !== null) {
            modules[editingModuleIndex] = { ...moduleForm };
        } else {
            modules.push({ ...moduleForm });
        }
        setCreatedCourse(prev => ({ ...prev, modules }));
        setModuleForm(initialModuleForm);
        setEditingModuleIndex(null);
    };
    const handleEditModule = idx => {
        setModuleForm(createdCourse.modules[idx]);
        setEditingModuleIndex(idx);
    };
    const handleDeleteModule = idx => {
        let modules = createdCourse.modules.filter((_, i) => i !== idx);
        setCreatedCourse(prev => ({ ...prev, modules }));
        setModuleForm(initialModuleForm);
        setEditingModuleIndex(null);
    };
    // Module step navigation
    const backToCourse = () => setStep(STEP.COURSE);

    // Topics logic
    const handleTopicChange = e => {
        const { name, value } = e.target;
        setTopicForm(prev => ({ ...prev, [name]: value }));
    };
    const handleAddOrEditTopic = e => {
        e.preventDefault();
        let modules = [...createdCourse.modules];
        let topics = modules[selectedModuleIdx].topics ? [...modules[selectedModuleIdx].topics] : [];
        if (editingTopicIndex !== null) {
            topics[editingTopicIndex] = { ...topicForm };
        } else {
            // Auto-generate ID for new topic
            const topicId = `${selectedModuleIdx + 1}.${topics.length + 1}`;
            topics.push({ ...topicForm, id: topicId });
        }
        modules[selectedModuleIdx] = { ...modules[selectedModuleIdx], topics };
        setCreatedCourse(prev => ({ ...prev, modules }));
        setTopicForm(initialTopicForm);
        setEditingTopicIndex(null);
    };
    const handleEditTopic = tIdx => {
        setTopicForm(createdCourse.modules[selectedModuleIdx].topics[tIdx]);
        setEditingTopicIndex(tIdx);
    };
    const handleDeleteTopic = tIdx => {
        let modules = [...createdCourse.modules];
        let topics = modules[selectedModuleIdx].topics.filter((_, i) => i !== tIdx);
        modules[selectedModuleIdx] = { ...modules[selectedModuleIdx], topics };
        setCreatedCourse(prev => ({ ...prev, modules }));
        setTopicForm(initialTopicForm);
        setEditingTopicIndex(null);
    };
    const backToModules = () => setStep(STEP.MODULES);

    // Quizzes logic
    const handleQuizFormChange = (e, idx = null) => {
        if (idx === null) {
            const { name, value } = e.target;
            setQuizForm(prev => ({ ...prev, [name]: name === 'correct' ? parseInt(value) : value }));
        } else {
            setQuizForm(prev => ({ ...prev, options: prev.options.map((opt, i) => (i === idx ? e.target.value : opt)) }));
        }
    };
    const handleAddOrEditQuiz = e => {
        e.preventDefault();
        let modules = [...createdCourse.modules];
        let topics = modules[selectedModuleIdx].topics;
        let quizzes = topics[selectedTopicIdx].quizzes ? [...topics[selectedTopicIdx].quizzes] : [];
        if (editingQuizIndex !== null) {
            quizzes[editingQuizIndex] = { ...quizForm };
        } else {
            // Auto-generate ID for new quiz
            const quizId = quizzes.length + 1;
            quizzes.push({ ...quizForm, id: quizId });
        }
        topics[selectedTopicIdx] = { ...topics[selectedTopicIdx], quizzes };
        modules[selectedModuleIdx] = { ...modules[selectedModuleIdx], topics };
        setCreatedCourse(prev => ({ ...prev, modules }));
        setQuizForm(initialQuizForm);
        setEditingQuizIndex(null);
    };
    const handleEditQuiz = idx => {
        setQuizForm(createdCourse.modules[selectedModuleIdx].topics[selectedTopicIdx].quizzes[idx]);
        setEditingQuizIndex(idx);
    };
    const handleDeleteQuiz = idx => {
        let modules = [...createdCourse.modules];
        let topics = modules[selectedModuleIdx].topics;
        let quizzes = topics[selectedTopicIdx].quizzes.filter((_, i) => i !== idx);
        topics[selectedTopicIdx] = { ...topics[selectedTopicIdx], quizzes };
        modules[selectedModuleIdx] = { ...modules[selectedModuleIdx], topics };
        setCreatedCourse(prev => ({ ...prev, modules }));
        setQuizForm(initialQuizForm);
        setEditingQuizIndex(null);
    };
    const backToTopics = () => setStep(STEP.TOPICS);

    // --- UI ---
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-2 md:px-6">
            {/* STEP 1: COURSE */}
            {step === STEP.COURSE && (
                <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-6 mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-orange-600 mb-4 text-center">Create Course (Step 1/4)</h1>
                    <form className="space-y-4" onSubmit={handleCreateCourse}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Course Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={courseForm.title}
                                onChange={handleCourseChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="Enter course title"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Course Subtitle</label>
                            <input
                                type="text"
                                name="subtitle"
                                value={courseForm.subtitle}
                                onChange={handleCourseChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="Enter course subtitle"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                name="description"
                                value={courseForm.description}
                                onChange={handleCourseChange}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="Course description"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                                <input
                                    type="text"
                                    name="provider"
                                    value={courseForm.provider}
                                    onChange={handleCourseChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="Provider/Organization"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Instructor Name</label>
                                <input
                                    type="text"
                                    name="instructor"
                                    value={courseForm.instructor}
                                    onChange={handleCourseChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="e.g. Koushik Chakraborty"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Instructor Email</label>
                                <input
                                    type="email"
                                    name="instructorEmail"
                                    value={courseForm.instructorEmail}
                                    onChange={handleCourseChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="e.g. koushik@innobharat.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Instructor Website</label>
                                <input
                                    type="text"
                                    name="instructorWebsite"
                                    value={courseForm.instructorWebsite}
                                    onChange={handleCourseChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="e.g. www.innobharat.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Duration</label>
                                <input
                                    type="text"
                                    name="minimumDuration"
                                    value={courseForm.minimumDuration}
                                    onChange={handleCourseChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="e.g. 45 hours"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Total Modules</label>
                                <input
                                    type="number"
                                    name="totalModules"
                                    value={courseForm.totalModules}
                                    onChange={handleCourseChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="e.g. 9"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Language(s)</label>
                                <input
                                    type="text"
                                    name="language"
                                    value={courseForm.language}
                                    onChange={handleCourseChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="e.g. Hindi, English"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Eligibility</label>
                                <input
                                    type="text"
                                    name="eligibility"
                                    value={courseForm.eligibility}
                                    onChange={handleCourseChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="e.g. Students, Entrepreneurs"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                                <input
                                    type="text"
                                    name="rating"
                                    value={courseForm.rating}
                                    onChange={handleCourseChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="e.g. 4.9"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Students Enrolled</label>
                                <input
                                    type="text"
                                    name="students"
                                    value={courseForm.students}
                                    onChange={handleCourseChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="e.g. 12,458"
                                />
                            </div>
                        </div>
                        <div className="flex items-center space-x-6 pt-2">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="certificate"
                                    checked={courseForm.certificate}
                                    onChange={handleCourseChange}
                                    className="form-checkbox h-5 w-5 text-orange-600"
                                />
                                <span className="text-sm text-gray-700">Certificate Available?</span>
                            </label>
                            {courseForm.certificate && (
                                <>
                                    <span className="text-sm text-gray-600">Min Passing Score:</span>
                                    <input
                                        type="number"
                                        name="minPassScore"
                                        value={courseForm.minPassScore}
                                        onChange={handleCourseChange}
                                        min={0}
                                        max={100}
                                        className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-orange-500"
                                    />
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="autoGenerateCert"
                                            checked={courseForm.autoGenerateCert}
                                            onChange={handleCourseChange}
                                            className="form-checkbox h-5 w-5 text-orange-600"
                                        />
                                        <span className="text-sm text-gray-700">Auto-generate Certificate</span>
                                    </label>
                                </>
                            )}
                        </div>
                        <div>
                            <button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-orange-600 py-2 px-6 rounded-lg text-white font-semibold hover:shadow-lg transition-all duration-300 mt-3">Create Course &gt;</button>
                        </div>
                    </form>
                </div>
            )}

            {/* STEP 2: MODULES */}
            {step === STEP.MODULES && (
                <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl p-6 mb-6">
                    <h2 className="text-xl md:text-2xl font-bold text-orange-500 mb-2 text-center">Add Modules to Course (Step 2/4)</h2>
                    <p className="text-gray-700 text-center mb-4">Course: <span className="font-bold">{createdCourse.title}</span></p>
                    {createdCourse.modules && createdCourse.modules.length > 0 && (
                        <div className="space-y-4 mb-6">
                            {createdCourse.modules.map((mod, idx) => (
                                <div key={idx} className="p-4 rounded-lg border border-gray-200 bg-gray-50 mb-2 relative">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div>
                                            <span className="font-semibold text-gray-900">{mod.title || 'Untitled Module'}</span>
                                            <span className="ml-2 text-xs text-gray-500">({mod.duration || 'No duration'})</span>
                                            <div className="text-gray-600 text-sm mt-1 line-clamp-1">{mod.description}</div>
                                        </div>
                                        <div className="flex space-x-2 mt-2 md:mt-0">
                                            <button type="button" onClick={() => handleEditModule(idx)} className="px-3 py-1 text-orange-700 bg-orange-50 rounded hover:bg-orange-100 font-medium">Edit</button>
                                            <button type="button" onClick={() => handleDeleteModule(idx)} className="px-3 py-1 text-red-600 bg-red-50 hover:bg-red-100 rounded font-medium">Delete</button>
                                            <button type="button" onClick={() => handleEnterTopics(idx)} className="px-3 py-1 bg-blue-600 text-white hover:bg-blue-700 rounded font-medium">Topics &gt;</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {/* Add/edit module form */}
                    <form onSubmit={handleAddOrEditModule} className="space-y-4">
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
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Module Subtitle</label>
                            <input
                                type="text"
                                name="subtitle"
                                value={moduleForm.subtitle}
                                onChange={handleModuleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500"
                                placeholder="Module subtitle (optional)"
                            />
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Icon/Emoji</label>
                                <input
                                    type="text"
                                    name="icon"
                                    value={moduleForm.icon}
                                    onChange={handleModuleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500"
                                    placeholder="e.g. 💼"
                                    maxLength={2}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Color/Theme</label>
                                <input
                                    type="text"
                                    name="color"
                                    value={moduleForm.color}
                                    onChange={handleModuleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500"
                                    placeholder="e.g. from-blue-500 to-cyan-500"
                                />
                            </div>
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
                                name="evaluation"
                                value={moduleForm.evaluation}
                                onChange={handleModuleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500"
                                placeholder="e.g. Quiz, Assignment, Final Assessment"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button type="button" onClick={backToCourse} className="flex-1 px-6 py-2 rounded bg-gray-100 border text-gray-700 font-semibold hover:bg-gray-200">&lt; Back</button>
                            <button type="submit" className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 py-2 px-6 rounded-lg text-white font-semibold hover:shadow-lg transition-all duration-300">
                                {editingModuleIndex !== null ? 'Update Module' : 'Add Module'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* STEP 3: TOPICS */}
            {step === STEP.TOPICS && (
                <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl p-6 mb-6">
                    <h2 className="text-xl md:text-2xl font-bold text-blue-600 mb-2 text-center">Add Topics (Step 3/4)</h2>
                    <p className="text-gray-700 text-center mb-3">Module: <span className="font-bold">{createdCourse.modules[selectedModuleIdx].title}</span></p>
                    {createdCourse.modules[selectedModuleIdx].topics && createdCourse.modules[selectedModuleIdx].topics.length > 0 && (
                        <div className="space-y-3 mb-6">
                            {createdCourse.modules[selectedModuleIdx].topics.map((topic, tIdx) => (
                                <div key={tIdx} className="p-3 rounded border border-gray-200 bg-gray-50 flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-1">
                                    <div>
                                        <span className="font-semibold text-gray-800">{topic.title}</span>
                                    </div>
                                    <div className="flex gap-2 mt-1 md:mt-0">
                                        <button type="button" onClick={() => handleEditTopic(tIdx)} className="px-3 py-1 text-blue-700 bg-blue-50 rounded hover:bg-blue-100 font-medium">Edit</button>
                                        <button type="button" onClick={() => handleDeleteTopic(tIdx)} className="px-3 py-1 text-red-600 bg-red-50 hover:bg-red-100 rounded font-medium">Delete</button>
                                        <button type="button" onClick={() => handleEnterQuiz(tIdx)} className="px-3 py-1 bg-green-600 text-white hover:bg-green-700 rounded font-medium">Quizzes &gt;</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {/* Add/edit topic form */}
                    <form onSubmit={handleAddOrEditTopic} className="space-y-3 mb-3">
                        <div>
                            <label className="block text-sm font-medium mb-1">Topic Title</label>
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
                            <label className="block text-sm font-medium mb-1">Content / Details</label>
                            <textarea
                                name="content"
                                value={topicForm.content}
                                onChange={handleTopicChange}
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded"
                                required
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
                                required
                            />
                        </div>
                        <div className="flex gap-2">
                            <button type="button" onClick={backToModules} className="flex-1 px-6 py-2 rounded bg-gray-100 border text-gray-700 font-semibold hover:bg-gray-200">&lt; Modules</button>
                            <button type="submit" className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 py-2 px-6 rounded-lg text-white font-semibold hover:shadow-lg transition-all duration-300">
                                {editingTopicIndex !== null ? 'Update Topic' : 'Add Topic'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* STEP 4: QUIZZES */}
            {step === STEP.QUIZ && (
                <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl p-6 mb-6">
                    <h2 className="text-xl md:text-2xl font-bold text-green-600 mb-2 text-center">Add Quizzes (Step 4/4)</h2>
                    <p className="text-gray-700 text-center mb-3">Topic: <span className="font-bold">{createdCourse.modules[selectedModuleIdx].topics[selectedTopicIdx].title}</span></p>
                    {/* List of quizzes */}
                    {createdCourse.modules[selectedModuleIdx].topics[selectedTopicIdx].quizzes && createdCourse.modules[selectedModuleIdx].topics[selectedTopicIdx].quizzes.length > 0 && (
                        <div className="space-y-2 mb-3">
                            {createdCourse.modules[selectedModuleIdx].topics[selectedTopicIdx].quizzes.map((quiz, qIdx) => (
                                <div key={qIdx} className="rounded border border-gray-200 p-2 bg-gray-50 flex flex-col gap-1 mb-1">
                                    <span className="font-medium text-gray-800 text-sm">Q{qIdx + 1}: {quiz.question}</span>
                                    <ol className="pl-6 list-decimal">
                                        {quiz.options.map((opt, i) => (
                                            <li key={i} className={quiz.correct === i ? 'font-bold text-green-600' : ''}>{opt}</li>
                                        ))}
                                    </ol>
                                    <div className="flex gap-2 mt-1">
                                        <button type="button" className="text-xs text-green-700" onClick={() => handleEditQuiz(qIdx)}>
                                            Edit
                                        </button>
                                        <button type="button" className="text-xs text-red-700" onClick={() => handleDeleteQuiz(qIdx)}>
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
                            placeholder="Enter question"
                            className="w-full px-2 py-1 border rounded text-sm mb-1"
                            required
                        />
                        {[0, 1, 2, 3].map(i => (
                            <div key={i} className="flex items-center gap-2">
                                <input
                                    type="text"
                                    placeholder={`Option ${i + 1}`}
                                    value={quizForm.options[i]}
                                    onChange={e => handleQuizFormChange(e, i)}
                                    className="px-2 py-1 border rounded text-sm flex-1"
                                    required
                                />
                                <input
                                    type="radio"
                                    name="correct"
                                    value={i}
                                    checked={quizForm.correct === i}
                                    onChange={handleQuizFormChange}
                                />
                                <span className="text-xs">Correct</span>
                            </div>
                        ))}
                        <div className="flex gap-2">
                            <button type="button" onClick={backToTopics} className="flex-1 px-4 py-2 rounded bg-gray-100 border text-gray-700 font-semibold hover:bg-gray-200">&lt; Topics</button>
                            <button type="submit" className="flex-1 bg-gradient-to-r from-green-500 to-green-600 py-2 px-6 rounded-lg text-white font-semibold hover:shadow-lg transition-all duration-300">
                                {editingQuizIndex !== null ? 'Update' : 'Add'} Question
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AdminTrainingPage;
