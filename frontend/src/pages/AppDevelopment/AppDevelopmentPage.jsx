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
        <>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-50">
            {/* Mobile-Optimized Header */}
            <motion.header 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40 md:shadow-md"
            >
                <div className="px-3 md:max-w-7xl md:mx-auto md:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-12 md:h-16">
                        <div className="flex items-center space-x-2 md:space-x-3">
                            <Link
                                to="/"
                                className="p-1.5 md:p-2 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors flex-shrink-0"
                            >
                                <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </Link>
                            <div>
                                <h1 className="text-base md:text-xl font-bold text-gray-900">App Development</h1>
                                <p className="text-[10px] md:text-sm text-gray-600 hidden sm:block">Professional Services</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Hero Section - Enhanced */}
            <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-blue-50 md:from-orange-50/80 md:via-white md:to-blue-50/80">
                <div className="relative px-4 md:max-w-7xl md:mx-auto md:px-6 lg:px-8 pt-8 md:pt-16 pb-6 md:pb-12">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="text-center mb-6 md:mb-12"
                    >
                        <motion.div
                            variants={fadeInUp}
                            className="inline-block px-4 py-1.5 md:px-6 md:py-2 bg-gradient-to-r from-orange-100 to-blue-100 rounded-full mb-4 md:mb-6 border border-orange-200/50"
                        >
                            <span className="text-xs md:text-sm font-semibold text-gray-700">Professional App Development</span>
                        </motion.div>
                        <motion.h2
                            variants={fadeInUp}
                            className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-3 md:mb-6 leading-tight"
                        >
                            Transform Ideas Into
                            <span className="block mt-2 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
                                Powerful Applications
                            </span>
                        </motion.h2>
                        <motion.p
                            variants={fadeInUp}
                            className="text-sm md:text-lg text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed"
                        >
                            Build scalable, high-performance apps with cutting-edge technology and expert guidance
                        </motion.p>
                        <motion.div variants={fadeInUp}>
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowProjectForm(true)}
                                className="px-8 py-3 md:px-10 md:py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl md:rounded-2xl shadow-lg hover:shadow-2xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 text-sm md:text-base transform"
                            >
                                Start Your Project
                                <svg className="inline-block w-4 h-4 md:w-5 md:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </motion.button>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

                {/* Services Grid - Enhanced */}
                <div className="px-4 md:max-w-7xl md:mx-auto md:px-6 lg:px-8 py-6 md:py-12">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="mb-6 md:mb-10"
                    >
                        <h3 className="text-xl md:text-3xl font-bold text-gray-900 text-center mb-2 md:mb-3">
                            Our Services
                        </h3>
                        <p className="text-sm md:text-base text-gray-600 text-center max-w-2xl mx-auto">
                            Comprehensive app development solutions tailored to your needs
                        </p>
                    </motion.div>
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8"
                    >
                        {services.map((service, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="group relative"
                            >
                                <div className={`relative bg-white rounded-xl md:rounded-2xl p-5 md:p-6 border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col overflow-hidden`}>
                                    {/* Gradient Accent */}
                                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                                    
                                    {/* Content */}
                                    <h3 className={`text-base md:text-xl font-bold text-gray-900 mb-2 md:mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r ${service.color} transition-all duration-300`}>
                                        {service.title}
                                    </h3>
                                    <p className="text-xs md:text-sm text-gray-600 mb-4 md:mb-5 leading-relaxed flex-grow">
                                        {service.description}
                                    </p>

                                    {/* Features */}
                                    <ul className="space-y-2 mt-auto pt-3 md:pt-4 border-t border-gray-100">
                                        {service.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center text-xs md:text-sm text-gray-700">
                                                <div className={`w-5 h-5 md:w-6 md:h-6 rounded-lg bg-gradient-to-r ${service.color} opacity-10 flex items-center justify-center mr-2 flex-shrink-0`}>
                                                    <svg className="w-3 h-3 md:w-4 md:h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                                <span className="font-medium">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Stats Section - Enhanced */}
                <div className="px-4 md:max-w-7xl md:mx-auto md:px-6 lg:px-8 py-8 md:py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 shadow-2xl"
                    >
                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                        
                        <div className="relative">
                            <h3 className="text-xl md:text-2xl font-bold text-white mb-6 md:mb-8 text-center">
                                Trusted by Thousands
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                                {[
                                    { number: '500+', label: 'Apps Delivered', icon: '📱' },
                                    { number: '98%', label: 'Client Satisfaction', icon: '⭐' },
                                    { number: '24/7', label: 'Support Available', icon: '🔄' },
                                    { number: '10+', label: 'Years Experience', icon: '🎯' }
                                ].map((stat, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                                        whileHover={{ scale: 1.05, y: -5 }}
                                        className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-5 border border-white/20"
                                    >
                                        <div className="text-2xl md:text-3xl mb-2">{stat.icon}</div>
                                        <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-1 md:mb-2">
                                            {stat.number}
                                        </div>
                                        <div className="text-xs sm:text-sm md:text-base text-white/95 font-semibold leading-tight">
                                            {stat.label}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
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
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-3 sm:px-6 lg:px-8 py-3 sm:py-4 z-10 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Project Details</h3>
                                <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 mt-0.5">Let's bring your idea to life</p>
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
                        <form onSubmit={handleProjectSubmit} className="flex-1 px-3 sm:px-6 lg:px-8 py-3 sm:py-5 space-y-3 sm:space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                                        Project Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="projectName"
                                        value={projectFormData.projectName}
                                        onChange={handleProjectFormChange}
                                        required
                                        className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-xs sm:text-sm"
                                        placeholder="E-commerce Mobile App"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                                        Platform *
                                    </label>
                                    <select
                                        name="platform"
                                        value={projectFormData.platform}
                                        onChange={handleProjectFormChange}
                                        required
                                        className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-xs sm:text-sm"
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
                                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                                    Project Description *
                                </label>
                                <textarea
                                    name="description"
                                    value={projectFormData.description}
                                    onChange={handleProjectFormChange}
                                    required
                                    rows={3}
                                    className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-xs sm:text-sm resize-none"
                                    placeholder="Describe your app idea..."
                                />
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                                    Key Features
                                </label>
                                <textarea
                                    name="features"
                                    value={projectFormData.features}
                                    onChange={handleProjectFormChange}
                                    rows={2}
                                    className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-xs sm:text-sm resize-none"
                                    placeholder="List main features..."
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                                        Budget Range
                                    </label>
                                    <select
                                        name="budget"
                                        value={projectFormData.budget}
                                        onChange={handleProjectFormChange}
                                        className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-xs sm:text-sm"
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
                                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                                        Timeline
                                    </label>
                                    <select
                                        name="timeline"
                                        value={projectFormData.timeline}
                                        onChange={handleProjectFormChange}
                                        className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-xs sm:text-sm"
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

                            <div className="border-t border-gray-200 pt-3 sm:pt-4">
                                <h4 className="text-sm sm:text-base font-bold text-gray-900 mb-3 sm:mb-4">Contact Information</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div>
                                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="clientName"
                                            value={projectFormData.clientName}
                                            onChange={handleProjectFormChange}
                                            required
                                            className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-xs sm:text-sm"
                                            placeholder="Your full name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={projectFormData.email}
                                            onChange={handleProjectFormChange}
                                            required
                                            className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-xs sm:text-sm"
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                                            Phone *
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={projectFormData.phone}
                                            onChange={handleProjectFormChange}
                                            required
                                            className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-xs sm:text-sm"
                                            placeholder="+91 9876543210"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                                            Company (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            name="company"
                                            value={projectFormData.company}
                                            onChange={handleProjectFormChange}
                                            className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-xs sm:text-sm"
                                            placeholder="Company name"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer - Sticky on Mobile */}
                            <div className="sticky bottom-0 bg-white border-t border-gray-200 -mx-3 sm:-mx-6 lg:-mx-8 px-3 sm:px-6 lg:px-8 py-3 sm:py-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
                                <motion.button
                                    type="button"
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    onClick={() => setShowProjectForm(false)}
                                    className="flex-1 px-4 py-2 sm:py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all duration-300 text-xs sm:text-sm"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    type="submit"
                                    disabled={submitting}
                                    whileHover={{ scale: submitting ? 1 : 1.01 }}
                                    whileTap={{ scale: submitting ? 1 : 0.99 }}
                                    className={`flex-1 px-4 py-2 sm:py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-xs sm:text-sm ${
                                        submitting ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                >
                                    {submitting ? '⏳ Submitting...' : '🚀 Submit'}
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </>
    );

    // Always show the client page without requiring login
    return renderClientPage();
};

export default AppDevelopmentPage;
