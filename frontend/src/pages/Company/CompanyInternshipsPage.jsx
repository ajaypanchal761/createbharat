import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const CompanyInternshipsPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isPostingJob, setIsPostingJob] = useState(false);
    const [jobFormData, setJobFormData] = useState({
        title: '',
        company: '',
        location: '',
        duration: '3 months',
        description: '',
        requirements: '',
        salary: '',
        type: 'internship'
    });
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [companyProfile, setCompanyProfile] = useState({
        name: localStorage.getItem('companyName') || 'TechCorp Solutions',
        industry: 'Technology',
        size: '51-200 employees',
        location: localStorage.getItem('companyLocation') || '',
        website: 'www.techcorp.com',
        description: 'Leading technology company focused on innovation'
    });

    const handleJobFormChange = (e) => {
        setJobFormData({
            ...jobFormData,
            [e.target.name]: e.target.value
        });
    };

    const handlePostJob = (e) => {
        e.preventDefault();
        setIsPostingJob(true);
        
        // Simulate API call
        setTimeout(() => {
            setIsPostingJob(false);
            alert('Job posted successfully!');
            setJobFormData({
                title: '',
                company: '',
                location: '',
                duration: '3 months',
                description: '',
                requirements: '',
                salary: '',
                type: 'internship'
            });
            setActiveTab('dashboard');
        }, 2000);
    };

    const handleApplicationAction = (applicationId, action) => {
        // Simulate API call
        alert(`Application ${action} successfully!`);
        // Update application status in real app
    };

    const handleProfileChange = (e) => {
        setCompanyProfile({
            ...companyProfile,
            [e.target.name]: e.target.value
        });
    };

    const handleProfileUpdate = (e) => {
        e.preventDefault();
        // Save location to localStorage
        localStorage.setItem('companyLocation', companyProfile.location);
        localStorage.setItem('companyName', companyProfile.name);
        alert('Profile updated successfully!');
    };

    const tabs = [
        { id: 'dashboard', name: 'Dashboard' },
        { id: 'post', name: 'Post Job' },
        { id: 'applications', name: 'Applications' },
        { id: 'profile', name: 'Profile' }
    ];

    const stats = [
        { label: 'Total Jobs Posted', value: '12', change: '+2 this month' },
        { label: 'Active Applications', value: '45', change: '+15 this week' },
        { label: 'Hired Candidates', value: '8', change: '+3 this month' },
        { label: 'Response Rate', value: '85%', change: '+5% this month' }
    ];

    const recentApplications = [
        {
            id: 1,
            candidate: 'John Doe',
            position: 'Frontend Developer Intern',
            status: 'New',
            appliedDate: '2024-01-20',
            experience: '1 year'
        },
        {
            id: 2,
            candidate: 'Jane Smith',
            position: 'Backend Developer Intern',
            status: 'Under Review',
            appliedDate: '2024-01-19',
            experience: '2 years'
        },
        {
            id: 3,
            candidate: 'Mike Johnson',
            position: 'UI/UX Designer Intern',
            status: 'Shortlisted',
            appliedDate: '2024-01-18',
            experience: '6 months'
        }
    ];

    const renderDashboard = () => (
        <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-2xl p-6 shadow-lg"
                    >
                        <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                        <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                        <p className="text-xs text-green-600 mt-1">{stat.change}</p>
                    </motion.div>
                ))}
            </div>

            {/* Recent Applications */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Recent Applications</h3>
                    <Link
                        to="#"
                        className="text-blue-600 text-sm font-medium hover:text-blue-800"
                    >
                        View All
                    </Link>
                </div>
                <div className="space-y-3">
                    {recentApplications.map((app, index) => (
                        <motion.div
                            key={app.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                            <div>
                                <h4 className="font-semibold text-gray-800">{app.candidate}</h4>
                                <p className="text-sm text-gray-600">{app.position}</p>
                                <p className="text-xs text-gray-500">{app.experience} experience</p>
                            </div>
                            <div className="text-right">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    app.status === 'New' ? 'bg-blue-100 text-blue-800' :
                                    app.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-green-100 text-green-800'
                                }`}>
                                    {app.status}
                                </span>
                                <p className="text-xs text-gray-500 mt-1">{app.appliedDate}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );

    const renderPostJob = () => (
        <motion.div
            key="post"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="relative">
                {/* Premium Border Effect */}
                <motion.div
                    className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl opacity-75"
                    animate={{
                        background: [
                            'linear-gradient(45deg, #3B82F6, #8B5CF6, #6366F1)',
                            'linear-gradient(45deg, #8B5CF6, #6366F1, #3B82F6)',
                            'linear-gradient(45deg, #6366F1, #3B82F6, #8B5CF6)',
                            'linear-gradient(45deg, #3B82F6, #8B5CF6, #6366F1)'
                        ]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
                
                {/* Rotating Border */}
                <motion.div
                    className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-3xl"
                    animate={{
                        rotate: 360
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
                
                {/* Inner Container */}
                <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
                    {/* Form Header with Premium Effects */}
                    <motion.div
                        className="relative mb-8"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Header Background Effect */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 rounded-2xl"
                            animate={{
                                opacity: [0.5, 0.8, 0.5]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                        
                        <h3 className="relative text-3xl font-bold text-gray-800 text-center py-4">
                            Post New Internship
                            <motion.div
                                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                                animate={{
                                    scaleX: [0.8, 1.2, 0.8]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                        </h3>
                    </motion.div>
                    
                    <form onSubmit={handlePostJob} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Job Title</label>
                            <motion.div
                                className="relative"
                                whileFocus={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                            >
                                {/* Input Border Effect */}
                                <motion.div
                                    className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-xl opacity-0"
                                    whileFocus={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                />
                                <input
                                    type="text"
                                    name="title"
                                    value={jobFormData.title}
                                    onChange={handleJobFormChange}
                                    required
                                    className="relative w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-transparent bg-white/90 backdrop-blur-sm transition-all duration-300"
                                    placeholder="e.g., Frontend Developer Intern"
                                />
                            </motion.div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Company</label>
                            <motion.div
                                className="relative"
                                whileFocus={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                            >
                                <motion.div
                                    className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-xl opacity-0"
                                    whileFocus={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                />
                                <input
                                    type="text"
                                    name="company"
                                    value={jobFormData.company}
                                    onChange={handleJobFormChange}
                                    required
                                    className="relative w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-transparent bg-white/90 backdrop-blur-sm transition-all duration-300"
                                    placeholder="Your company name"
                                />
                            </motion.div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Location</label>
                            <motion.div
                                className="relative"
                                whileFocus={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                            >
                                <motion.div
                                    className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-xl opacity-0"
                                    whileFocus={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                />
                                <input
                                    type="text"
                                    name="location"
                                    value={jobFormData.location}
                                    onChange={handleJobFormChange}
                                    required
                                    className="relative w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-transparent bg-white/90 backdrop-blur-sm transition-all duration-300"
                                    placeholder="e.g., Mumbai, India"
                                />
                            </motion.div>
                        </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                        <select 
                            name="duration"
                            value={jobFormData.duration}
                            onChange={handleJobFormChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="3 months">3 months</option>
                            <option value="6 months">6 months</option>
                            <option value="1 year">1 year</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Salary/Stipend</label>
                        <input
                            type="text"
                            name="salary"
                            value={jobFormData.salary}
                            onChange={handleJobFormChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., ₹15,000/month"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            name="description"
                            value={jobFormData.description}
                            onChange={handleJobFormChange}
                            required
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Describe the internship role and requirements..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
                        <textarea
                            name="requirements"
                            value={jobFormData.requirements}
                            onChange={handleJobFormChange}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="List the required skills and qualifications..."
                        />
                    </div>
                    {/* Premium Submit Button */}
                    <motion.div
                        className="relative mt-8"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {/* Button Border Effect */}
                        <motion.div
                            className={`absolute -inset-1 rounded-2xl ${
                                isPostingJob 
                                    ? 'bg-gray-400' 
                                    : 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600'
                            }`}
                            animate={!isPostingJob ? {
                                background: [
                                    'linear-gradient(45deg, #3B82F6, #8B5CF6, #6366F1)',
                                    'linear-gradient(45deg, #8B5CF6, #6366F1, #3B82F6)',
                                    'linear-gradient(45deg, #6366F1, #3B82F6, #8B5CF6)',
                                    'linear-gradient(45deg, #3B82F6, #8B5CF6, #6366F1)'
                                ]
                            } : {}}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        />
                        
                        {/* Shimmer Effect */}
                        {!isPostingJob && (
                            <motion.div
                                className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-2xl"
                                animate={{
                                    x: ['-100%', '100%']
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatDelay: 1,
                                    ease: "easeInOut"
                                }}
                            />
                        )}
                        
                        <motion.button
                            type="submit"
                            disabled={isPostingJob}
                            className={`relative w-full md:w-auto md:px-12 py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-300 ${
                                isPostingJob 
                                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                                    : 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white shadow-2xl'
                            }`}
                            whileHover={!isPostingJob ? {
                                boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)",
                                y: -2
                            } : {}}
                        >
                            <motion.span
                                animate={isPostingJob ? {
                                    opacity: [0.5, 1, 0.5]
                                } : {}}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                {isPostingJob ? 'Posting...' : 'Post Internship'}
                            </motion.span>
                        </motion.button>
                    </motion.div>
                </form>
                </div>
            </div>
        </motion.div>
    );

    const renderApplications = () => (
        <motion.div
            key="applications"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
        >
            {recentApplications.map((app, index) => (
                <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-lg"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">{app.candidate}</h3>
                            <p className="text-gray-600">{app.position}</p>
                            <p className="text-sm text-gray-500">Applied on {app.appliedDate}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            app.status === 'New' ? 'bg-blue-100 text-blue-800' :
                            app.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                        }`}>
                            {app.status}
                        </span>
                    </div>
                    <div className="flex space-x-2">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => alert(`Viewing resume for ${app.candidate}`)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                        >
                            View Resume
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleApplicationAction(app.id, 'accepted')}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                        >
                            Accept
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleApplicationAction(app.id, 'rejected')}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                        >
                            Reject
                        </motion.button>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );

    const renderProfile = () => (
        <motion.div
            key="profile"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Company Profile</h3>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                        <input
                            type="text"
                            name="name"
                            value={companyProfile.name}
                            onChange={handleProfileChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                        <input
                            type="text"
                            name="industry"
                            value={companyProfile.industry}
                            onChange={handleProfileChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
                        <select 
                            name="size"
                            value={companyProfile.size}
                            onChange={handleProfileChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="1-10 employees">1-10 employees</option>
                            <option value="11-50 employees">11-50 employees</option>
                            <option value="51-200 employees">51-200 employees</option>
                            <option value="200+ employees">200+ employees</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={companyProfile.location}
                            onChange={handleProfileChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., Mumbai, Maharashtra"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                        <input
                            type="url"
                            name="website"
                            value={companyProfile.website}
                            onChange={handleProfileChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            name="description"
                            value={companyProfile.description}
                            onChange={handleProfileChange}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full md:w-auto md:px-8 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        Update Profile
                    </motion.button>
                </form>
            </div>
        </motion.div>
    );

    const companyEmail = localStorage.getItem('companyEmail') || 'company@example.com';
    const companyName = localStorage.getItem('companyName') || 'Your Company';

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Header */}
            <div className="md:hidden bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 sticky top-0 z-40">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h1 className="text-xl font-bold">Company Dashboard</h1>
                    </div>
                    <button
                        onClick={() => {
                            localStorage.removeItem('userType');
                            localStorage.removeItem('isLoggedIn');
                            localStorage.removeItem('companyName');
                            localStorage.removeItem('companyEmail');
                            navigate('/');
                        }}
                        className="px-3 py-1 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors font-semibold backdrop-blur-sm"
                    >
                        Edit
                    </button>
                </div>
            </div>

            {/* Desktop Header */}
            <div className="hidden md:block bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h1 className="text-2xl font-bold">Company Dashboard</h1>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => {
                                localStorage.removeItem('userType');
                                localStorage.removeItem('isLoggedIn');
                                localStorage.removeItem('companyName');
                                localStorage.removeItem('companyEmail');
                                navigate('/');
                            }}
                            className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors font-semibold"
                        >
                            Logout
                        </button>
                    </div>
                    </div>
                </div>

            {/* Tab Navigation */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100/30 border-b border-gray-200">
                <div className="px-4 md:px-6 max-w-7xl mx-auto">
                    <div className="flex space-x-2 overflow-x-auto scrollbar-hide py-2 md:py-3">
                        {tabs.map((tab, index) => (
                            <motion.button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative py-2.5 md:py-3 text-xs md:text-sm font-semibold rounded-xl transition-all duration-300 whitespace-nowrap px-4 md:px-5 ${
                                    activeTab === tab.id
                                        ? 'text-white'
                                        : 'text-gray-800'
                                }`}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {/* Active Tab Background */}
                                {activeTab === tab.id && (
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-md"
                                        layoutId="activeTab"
                                        initial={false}
                                        transition={{
                                            type: "spring",
                                            stiffness: 400,
                                            damping: 30
                                        }}
                                    />
                                )}
                                
                                {/* Tab Content */}
                                <span className="relative z-10 block">
                                    {tab.name}
                                </span>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 md:p-6 max-w-7xl mx-auto pb-20 md:pb-6">
                {activeTab === 'dashboard' && renderDashboard()}
                {activeTab === 'post' && renderPostJob()}
                {activeTab === 'applications' && renderApplications()}
                {activeTab === 'profile' && renderProfile()}
            </div>

        </div>
    );
};

export default CompanyInternshipsPage;
