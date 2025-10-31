import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const AppDevelopmentPage = () => {
    const navigate = useNavigate();
    
    // Login form state
    const [loginType, setLoginType] = useState('client');
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    
    // App development state
    const [userType, setUserType] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showProjectForm, setShowProjectForm] = useState(false);
    const [projectFormData, setProjectFormData] = useState({
        projectName: '',
        description: '',
        platform: '',
        features: '',
        budget: '',
        timeline: '',
        clientName: '',
        email: '',
        phone: '',
        company: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Save login information
        localStorage.setItem('userType', loginType);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', formData.email);
        
        // Update state and show the appropriate page
        setUserType(loginType);
        setIsLoggedIn(true);
    };

    const handleProjectFormChange = (e) => {
        setProjectFormData({
            ...projectFormData,
            [e.target.name]: e.target.value
        });
    };

    const handleProjectSubmit = (e) => {
        e.preventDefault();
        alert('Project submitted successfully! We will contact you soon.');
        setShowProjectForm(false);
        setProjectFormData({
            projectName: '',
            description: '',
            platform: '',
            features: '',
            budget: '',
            timeline: '',
            clientName: '',
            email: '',
            phone: '',
            company: ''
        });
    };

    const handleLogout = () => {
        setUserType(null);
        setIsLoggedIn(false);
        setShowProjectForm(false);
    };

    const renderLoginPage = () => (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md"
            >
                <div className="bg-white rounded-2xl shadow-2xl border-2 border-gray-200 p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">📱</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
                        <p className="text-gray-600">Sign in to access app development</p>
                    </div>

                    {/* Login Type Selection */}
                    <div className="mb-6">
                        <div className="flex bg-gray-100 rounded-xl p-1">
                            <button
                                type="button"
                                onClick={() => setLoginType('client')}
                                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    loginType === 'client'
                                        ? 'bg-white text-orange-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                👤 Client
                            </button>
                            <button
                                type="button"
                                onClick={() => setLoginType('admin')}
                                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    loginType === 'admin'
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                👨‍💼 Admin
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                                placeholder="Enter your password"
                            />
                        </div>

                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-300"
                        >
                            Sign In
                        </motion.button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link to="/" className="text-gray-600 hover:text-orange-500 text-sm font-medium">
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );

    const renderClientPage = () => (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mr-3">
                                <span className="text-xl">📱</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-800">App Development</h1>
                                <p className="text-sm text-gray-600">Web Development Services</p>
                            </div>
                        </div>
                        <Link
                            to="/"
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>

            <div className="p-4">
                {/* App Development Information */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl p-6 shadow-lg mb-6"
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">App Development Services</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                                    <span className="text-white text-sm">📱</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-1">Mobile Apps</h3>
                                    <p className="text-sm text-gray-600">iOS and Android native applications</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                                    <span className="text-white text-sm">🌐</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-1">Web Applications</h3>
                                    <p className="text-sm text-gray-600">Responsive web apps and PWAs</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start">
                                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                                    <span className="text-white text-sm">⚡</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-1">Cross-Platform</h3>
                                    <p className="text-sm text-gray-600">React Native and Flutter apps</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                                    <span className="text-white text-sm">🔧</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-1">Custom Development</h3>
                                    <p className="text-sm text-gray-600">Tailored solutions for your business</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start">
                                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                                    <span className="text-white text-sm">🛡️</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-1">Security & Testing</h3>
                                    <p className="text-sm text-gray-600">Comprehensive security and QA</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start">
                                <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                                    <span className="text-white text-sm">🚀</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-1">Deployment & Support</h3>
                                    <p className="text-sm text-gray-600">App store deployment and maintenance</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowProjectForm(true)}
                        className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
                    >
                        Submit Your Project
                    </motion.button>
                </motion.div>

                {/* Project Form Modal */}
                {showProjectForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                        onClick={() => setShowProjectForm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-800">Project Details</h3>
                                <button
                                    onClick={() => setShowProjectForm(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleProjectSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                                        <input
                                            type="text"
                                            name="projectName"
                                            value={projectFormData.projectName}
                                            onChange={handleProjectFormChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            placeholder="e.g., E-commerce Mobile App"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                                        <select
                                            name="platform"
                                            value={projectFormData.platform}
                                            onChange={handleProjectFormChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        >
                                            <option value="">Select Platform</option>
                                            <option value="ios">iOS</option>
                                            <option value="android">Android</option>
                                            <option value="both">Both iOS & Android</option>
                                            <option value="web">Web Application</option>
                                            <option value="cross-platform">Cross-Platform</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Description</label>
                                    <textarea
                                        name="description"
                                        value={projectFormData.description}
                                        onChange={handleProjectFormChange}
                                        required
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="Describe your app idea, target audience, and main features..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Key Features</label>
                                    <textarea
                                        name="features"
                                        value={projectFormData.features}
                                        onChange={handleProjectFormChange}
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="List the main features you want in your app..."
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
                                        <select
                                            name="budget"
                                            value={projectFormData.budget}
                                            onChange={handleProjectFormChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        >
                                            <option value="">Select Budget</option>
                                            <option value="under-10k">Under ₹10,000</option>
                                            <option value="10k-50k">₹10,000 - ₹50,000</option>
                                            <option value="50k-1l">₹50,000 - ₹1,00,000</option>
                                            <option value="1l-5l">₹1,00,000 - ₹5,00,000</option>
                                            <option value="above-5l">Above ₹5,00,000</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Timeline</label>
                                        <select
                                            name="timeline"
                                            value={projectFormData.timeline}
                                            onChange={handleProjectFormChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        >
                                            <option value="">Select Timeline</option>
                                            <option value="1-month">1 Month</option>
                                            <option value="2-3-months">2-3 Months</option>
                                            <option value="3-6-months">3-6 Months</option>
                                            <option value="6-12-months">6-12 Months</option>
                                            <option value="flexible">Flexible</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                name="clientName"
                                                value={projectFormData.clientName}
                                                onChange={handleProjectFormChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="Your full name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={projectFormData.email}
                                                onChange={handleProjectFormChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="your@email.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={projectFormData.phone}
                                                onChange={handleProjectFormChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="+91 9876543210"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Company (Optional)</label>
                                            <input
                                                type="text"
                                                name="company"
                                                value={projectFormData.company}
                                                onChange={handleProjectFormChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="Your company name"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex space-x-4 pt-4">
                                    <motion.button
                                        type="button"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setShowProjectForm(false)}
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
                                        Submit Project
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </div>
    );

    const renderAdminPage = () => (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-3">
                                <span className="text-xl">👨‍💼</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
                                <p className="text-sm text-gray-600">Project Management</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-4">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl p-4 shadow-lg">
                        <h3 className="text-2xl font-bold text-gray-800">24</h3>
                        <p className="text-sm text-gray-600">Total Projects</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-lg">
                        <h3 className="text-2xl font-bold text-gray-800">8</h3>
                        <p className="text-sm text-gray-600">In Progress</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-lg">
                        <h3 className="text-2xl font-bold text-gray-800">12</h3>
                        <p className="text-sm text-gray-600">Completed</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-lg">
                        <h3 className="text-2xl font-bold text-gray-800">4</h3>
                        <p className="text-sm text-gray-600">Pending</p>
                    </div>
                </div>

                {/* Recent Projects */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Projects</h2>
                    <div className="space-y-4">
                        {[
                            { name: 'E-commerce App', client: 'John Doe', status: 'In Progress', budget: '₹2,50,000' },
                            { name: 'Food Delivery App', client: 'Jane Smith', status: 'Completed', budget: '₹1,80,000' },
                            { name: 'Fitness Tracker', client: 'Mike Johnson', status: 'Pending', budget: '₹3,20,000' }
                        ].map((project, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <h3 className="font-semibold text-gray-800">{project.name}</h3>
                                    <p className="text-sm text-gray-600">Client: {project.client}</p>
                                    <p className="text-sm text-gray-600">Budget: {project.budget}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                    project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                    'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {project.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderAppzetoPage = () => (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                                <span className="text-xl">👨‍💻</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-800">Appzeto Team</h1>
                                <p className="text-sm text-gray-600">Development Dashboard</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-4">
                {/* Team Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-xl p-4 shadow-lg">
                        <h3 className="text-2xl font-bold text-gray-800">5</h3>
                        <p className="text-sm text-gray-600">Active Developers</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-lg">
                        <h3 className="text-2xl font-bold text-gray-800">8</h3>
                        <p className="text-sm text-gray-600">Current Tasks</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-lg">
                        <h3 className="text-2xl font-bold text-gray-800">95%</h3>
                        <p className="text-sm text-gray-600">Code Quality</p>
                    </div>
                </div>

                {/* Development Tasks */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Development Tasks</h2>
                    <div className="space-y-4">
                        {[
                            { task: 'Implement User Authentication', project: 'E-commerce App', assignee: 'Alex', priority: 'High' },
                            { task: 'Design Mobile UI', project: 'Food Delivery App', assignee: 'Sarah', priority: 'Medium' },
                            { task: 'API Integration', project: 'Fitness Tracker', assignee: 'David', priority: 'High' }
                        ].map((task, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <h3 className="font-semibold text-gray-800">{task.task}</h3>
                                    <p className="text-sm text-gray-600">Project: {task.project}</p>
                                    <p className="text-sm text-gray-600">Assignee: {task.assignee}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    task.priority === 'High' ? 'bg-red-100 text-red-800' :
                                    task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-green-100 text-green-800'
                                }`}>
                                    {task.priority}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    // Always show the client page without requiring login
    return renderClientPage();
};

export default AppDevelopmentPage;
