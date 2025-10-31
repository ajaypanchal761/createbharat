import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { webDevelopmentAPI } from '../../utils/api';

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

    const [submitting, setSubmitting] = useState(false);

    const handleProjectSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        
        try {
            const response = await webDevelopmentAPI.submitProject(projectFormData);
            
            if (response.success) {
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
            } else {
                alert(response.message || 'Failed to submit project. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting project:', error);
            alert(error.message || 'Failed to submit project. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleLogout = () => {
        setUserType(null);
        setIsLoggedIn(false);
        setShowProjectForm(false);
    };

    // Animation variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08
            }
        }
    };

    const services = [
        {
            icon: '📱',
            title: 'Mobile Apps',
            description: 'iOS and Android native applications built with cutting-edge technology',
            color: 'from-orange-500 to-red-500',
            bgColor: 'from-orange-50 to-red-50',
            features: ['Native Performance', 'App Store Ready', 'Offline Support']
        },
        {
            icon: '🌐',
            title: 'Web Applications',
            description: 'Responsive web apps and PWAs that work seamlessly across all devices',
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'from-blue-50 to-cyan-50',
            features: ['Responsive Design', 'Progressive Web App', 'Cloud Integration']
        },
        {
            icon: '⚡',
            title: 'Cross-Platform',
            description: 'React Native and Flutter apps for maximum reach and efficiency',
            color: 'from-green-500 to-emerald-500',
            bgColor: 'from-green-50 to-emerald-50',
            features: ['Single Codebase', 'Faster Development', 'Cost Effective']
        },
        {
            icon: '🔧',
            title: 'Custom Development',
            description: 'Tailored solutions designed specifically for your business needs',
            color: 'from-purple-500 to-pink-500',
            bgColor: 'from-purple-50 to-pink-50',
            features: ['Bespoke Solutions', 'Scalable Architecture', 'Enterprise Grade']
        },
        {
            icon: '🛡️',
            title: 'Security & Testing',
            description: 'Comprehensive security audits and rigorous quality assurance',
            color: 'from-red-500 to-rose-500',
            bgColor: 'from-red-50 to-rose-50',
            features: ['Security Audits', 'QA Testing', 'Performance Optimization']
        },
        {
            icon: '🚀',
            title: 'Deployment & Support',
            description: 'App store deployment and ongoing maintenance and support',
            color: 'from-yellow-500 to-amber-500',
            bgColor: 'from-yellow-50 to-amber-50',
            features: ['App Store Setup', '24/7 Support', 'Regular Updates']
        }
    ];

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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-50">
            {/* Mobile-Optimized Header */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white/95 backdrop-blur-md shadow-md border-b border-gray-200 sticky top-0 z-40 md:bg-white/80 md:backdrop-blur-lg md:shadow-lg"
            >
                <div className="px-4 md:max-w-7xl md:mx-auto md:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-14 md:h-16 lg:h-20">
                        <div className="flex items-center space-x-2 md:space-x-3 lg:space-x-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg md:rounded-xl lg:rounded-2xl flex items-center justify-center shadow-md">
                                <span className="text-xl md:text-2xl lg:text-3xl">📱</span>
                            </div>
                            <div>
                                <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800">App Development</h1>
                                <p className="text-xs md:text-sm text-gray-600 hidden sm:block">Professional Development Services</p>
                            </div>
                        </div>
                        <Link
                            to="/"
                            className="px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-lg md:rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-200 text-xs md:text-sm lg:text-base font-medium shadow-sm whitespace-nowrap"
                        >
                            <span className="hidden sm:inline">← Back to Home</span>
                            <span className="sm:hidden">←</span>
                        </Link>
                    </div>
                </div>
            </motion.div>

            {/* Hero Section - Mobile Optimized */}
            <div className="px-4 md:max-w-7xl md:mx-auto md:px-6 lg:px-8 pt-6 md:pt-8 lg:pt-12 pb-4 md:pb-6 lg:pb-8">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="text-center mb-6 md:mb-8 lg:mb-12"
                >
                    <motion.h2
                        variants={fadeInUp}
                        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-3 md:mb-4 lg:mb-6 leading-tight"
                    >
                        Transform Your Ideas Into
                        <span className="block bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent mt-2">
                            Powerful Applications
                        </span>
                    </motion.h2>
                    <motion.div variants={fadeInUp}>
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setShowProjectForm(true)}
                            className="px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl md:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 text-sm sm:text-base md:text-lg w-full sm:w-auto min-w-[200px]"
                        >
                            🚀 Start Your Project
                        </motion.button>
                    </motion.div>
                </motion.div>

                {/* Services Grid - Mobile Optimized */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8 lg:mb-12"
                >
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            variants={fadeInUp}
                            whileHover={{ scale: 1.02, y: -4 }}
                            className="group relative overflow-hidden"
                        >
                            <div className={`relative bg-gradient-to-br ${service.bgColor} rounded-xl md:rounded-2xl p-5 md:p-6 lg:p-8 border-2 border-white shadow-md hover:shadow-xl transition-all duration-300 h-full`}>
                                {/* Icon */}
                                <div className={`w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-gradient-to-r ${service.color} rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-lg`}>
                                    <span className="text-2xl md:text-3xl lg:text-4xl">{service.icon}</span>
                                </div>

                                {/* Content */}
                                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2 md:mb-3">
                                    {service.title}
                                </h3>
                                <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4 lg:mb-6 leading-relaxed">
                                    {service.description}
                                </p>

                                {/* Features */}
                                <ul className="space-y-1.5 md:space-y-2">
                                    {service.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center text-xs md:text-sm text-gray-700">
                                            <svg className="w-4 h-4 md:w-5 md:h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Stats Section - Mobile Optimized */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl md:rounded-2xl lg:rounded-3xl p-5 md:p-6 lg:p-8 mb-6 md:mb-8 lg:mb-12 shadow-xl"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {[
                            { number: '500+', label: 'Apps Delivered' },
                            { number: '98%', label: 'Client Satisfaction' },
                            { number: '24/7', label: 'Support Available' },
                            { number: '10+', label: 'Years Experience' }
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                                className="text-center"
                            >
                                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-1 md:mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-xs sm:text-sm md:text-base text-white/90 font-medium leading-tight">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Project Form Modal - Mobile Optimized */}
            {showProjectForm && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4 z-50"
                    onClick={() => setShowProjectForm(false)}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-white rounded-t-2xl md:rounded-2xl lg:rounded-3xl w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-3xl overflow-y-auto shadow-2xl flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header - Sticky on Mobile */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 z-10 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Project Details</h3>
                                <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1">Let's bring your idea to life</p>
                            </div>
                            <motion.button
                                whileHover={{ rotate: 90, scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setShowProjectForm(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                            >
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </motion.button>
                        </div>

                        {/* Modal Content */}
                        <form onSubmit={handleProjectSubmit} className="flex-1 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <div>
                                    <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
                                        Project Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="projectName"
                                        value={projectFormData.projectName}
                                        onChange={handleProjectFormChange}
                                        required
                                        className="w-full px-4 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm sm:text-base"
                                        placeholder="e.g., E-commerce Mobile App"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
                                        Platform *
                                    </label>
                                    <select
                                        name="platform"
                                        value={projectFormData.platform}
                                        onChange={handleProjectFormChange}
                                        required
                                        className="w-full px-4 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm sm:text-base"
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
                                <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
                                    Project Description *
                                </label>
                                <textarea
                                    name="description"
                                    value={projectFormData.description}
                                    onChange={handleProjectFormChange}
                                    required
                                    rows={4}
                                    className="w-full px-4 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm sm:text-base"
                                    placeholder="Describe your app idea, target audience, and main features..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
                                    Key Features
                                </label>
                                <textarea
                                    name="features"
                                    value={projectFormData.features}
                                    onChange={handleProjectFormChange}
                                    rows={3}
                                    className="w-full px-4 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm sm:text-base"
                                    placeholder="List the main features you want in your app..."
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <div>
                                    <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
                                        Budget Range
                                    </label>
                                    <select
                                        name="budget"
                                        value={projectFormData.budget}
                                        onChange={handleProjectFormChange}
                                        className="w-full px-4 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm sm:text-base"
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
                                    <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
                                        Timeline
                                    </label>
                                    <select
                                        name="timeline"
                                        value={projectFormData.timeline}
                                        onChange={handleProjectFormChange}
                                        className="w-full px-4 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm sm:text-base"
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

                            <div className="border-t-2 border-gray-200 pt-4 sm:pt-6">
                                <h4 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Contact Information</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="clientName"
                                            value={projectFormData.clientName}
                                            onChange={handleProjectFormChange}
                                            required
                                            className="w-full px-4 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm sm:text-base"
                                            placeholder="Your full name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={projectFormData.email}
                                            onChange={handleProjectFormChange}
                                            required
                                            className="w-full px-4 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm sm:text-base"
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
                                            Phone *
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={projectFormData.phone}
                                            onChange={handleProjectFormChange}
                                            required
                                            className="w-full px-4 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm sm:text-base"
                                            placeholder="+91 9876543210"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
                                            Company (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            name="company"
                                            value={projectFormData.company}
                                            onChange={handleProjectFormChange}
                                            className="w-full px-4 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm sm:text-base"
                                            placeholder="Your company name"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer - Sticky on Mobile */}
                            <div className="sticky bottom-0 bg-white border-t border-gray-200 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
                                <motion.button
                                    type="button"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setShowProjectForm(false)}
                                    className="flex-1 px-6 py-3 sm:py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300 text-sm sm:text-base"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    type="submit"
                                    disabled={submitting}
                                    whileHover={{ scale: submitting ? 1 : 1.02 }}
                                    whileTap={{ scale: submitting ? 1 : 0.98 }}
                                    className={`flex-1 px-6 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 text-sm sm:text-base ${
                                        submitting ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                >
                                    {submitting ? '⏳ Submitting...' : '🚀 Submit Project'}
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );

    // Always show the client page without requiring login
    return renderClientPage();
};

export default AppDevelopmentPage;
