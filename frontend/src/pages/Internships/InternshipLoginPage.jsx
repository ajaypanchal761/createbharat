import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';

const InternshipLoginPage = () => {
    const navigate = useNavigate();
    const [userType, setUserType] = useState(null); // 'candidate' or 'company'
    const [formData, setFormData] = useState({
        username: '',
        phone: '',
        email: '',
        location: '',
        resume: null
    });
    const [companyFormData, setCompanyFormData] = useState({
        companyName: '',
        email: '',
        phone: '',
        gstNumber: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        if (e.target.name === 'resume') {
            setFormData({
                ...formData,
                resume: e.target.files[0]
            });
        } else {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            });
        }
    };

    const handleCompanyChange = (e) => {
        setCompanyFormData({
            ...companyFormData,
            [e.target.name]: e.target.value
        });
    };

    const handleCandidateSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        setTimeout(() => {
            localStorage.setItem('userType', 'candidate');
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userName', formData.username);
            localStorage.setItem('userEmail', formData.email);
            localStorage.setItem('userPhone', formData.phone);
            localStorage.setItem('userLocation', formData.location);
            navigate('/internships');
            setIsLoading(false);
        }, 1000);
    };

    const handleCompanySubmit = (e) => {
        e.preventDefault();
        
        setIsLoading(true);
        
        setTimeout(() => {
            localStorage.setItem('companyName', companyFormData.companyName);
            localStorage.setItem('companyEmail', companyFormData.email);
            localStorage.setItem('companyPhone', companyFormData.phone);
            localStorage.setItem('gstNumber', companyFormData.gstNumber);
            localStorage.setItem('userType', 'company');
            localStorage.setItem('isLoggedIn', 'true');
            navigate('/company/internships');
            setIsLoading(false);
        }, 1000);
    };

    // Show selection screen if no user type selected
    if (!userType) {
        return (
            <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-orange-50/20 to-slate-50 flex flex-col items-center justify-center px-6 py-12">
                <Link to="/" className="absolute top-6 left-6 p-2 hover:bg-gray-100 rounded-full transition-colors z-10">
                    <FaArrowLeft className="text-gray-600" />
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md"
                >
                    {/* Illustration */}
                    <div className="flex justify-center mb-8">
                        <div className="w-24 h-24 md:w-32 md:h-32 bg-orange-100 rounded-full flex items-center justify-center">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-orange-500 rounded-full flex items-center justify-center">
                                <span className="text-3xl md:text-4xl">💼</span>
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl md:text-4xl font-bold text-gray-900 text-center mb-2">
                        Join as Intern
                    </h1>
                    <p className="text-gray-600 text-center mb-8 text-sm md:text-base">
                        Choose how you want to use our platform
                    </p>

                    {/* Selection Options */}
                    <div className="space-y-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setUserType('candidate')}
                            className="w-full p-6 bg-white border-2 border-orange-200 rounded-2xl hover:border-orange-500 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <span className="text-3xl">👤</span>
                                </div>
                                <div className="text-left">
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">I'm a Candidate</h3>
                                    <p className="text-sm text-gray-600">Looking for internships</p>
                                </div>
                            </div>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setUserType('company')}
                            className="w-full p-6 bg-white border-2 border-blue-200 rounded-2xl hover:border-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <span className="text-3xl">🏢</span>
                                </div>
                                <div className="text-left">
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">I'm a Company</h3>
                                    <p className="text-sm text-gray-600">Post internships and hire</p>
                                </div>
                            </div>
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-orange-50/20 to-slate-50 flex flex-col items-center justify-center px-4 py-8">
            {/* Back Button */}
            <button
                onClick={() => setUserType(null)}
                className="absolute top-6 left-6 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
            >
                <FaArrowLeft className="text-gray-600" />
            </button>

            <div className="w-full max-w-md">
                {userType === 'candidate' ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-4xl">👤</span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                Candidate Registration
                            </h1>
                            <p className="text-gray-600 text-sm md:text-base">
                                Register to find your dream internship
                            </p>
                        </div>

                        <form onSubmit={handleCandidateSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                                    placeholder="Enter your username"
                                />
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    maxLength="10"
                                    pattern="[0-9]{10}"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                                    placeholder="9876543210"
                                />
                            </div>

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
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                                    placeholder="your@email.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                                    placeholder="Enter your location"
                                />
                            </div>

                            <div>
                                <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-2">
                                    Upload Resume
                                </label>
                                <input
                                    type="file"
                                    id="resume"
                                    name="resume"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                                />
                                <p className="mt-1 text-xs text-gray-500">Upload PDF, DOC, or DOCX</p>
                            </div>

                            <motion.button
                                type="submit"
                                disabled={isLoading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-orange-500 text-white py-4 rounded-lg font-semibold hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Registering...' : 'Register'}
                            </motion.button>
                        </form>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-4xl">🏢</span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                Company Registration
                            </h1>
                            <p className="text-gray-600 text-sm md:text-base">
                                Register your company to post internships
                            </p>
                        </div>

                        <form onSubmit={handleCompanySubmit} className="space-y-5">
                            <div>
                                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                                    Company Name
                                </label>
                                <input
                                    type="text"
                                    id="companyName"
                                    name="companyName"
                                    value={companyFormData.companyName}
                                    onChange={handleCompanyChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                    placeholder="Enter company name"
                                />
                            </div>

                            <div>
                                <label htmlFor="companyEmail" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="companyEmail"
                                    name="email"
                                    value={companyFormData.email}
                                    onChange={handleCompanyChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                    placeholder="company@example.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="companyPhone" className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    id="companyPhone"
                                    name="phone"
                                    value={companyFormData.phone}
                                    onChange={handleCompanyChange}
                                    required
                                    maxLength="10"
                                    pattern="[0-9]{10}"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                    placeholder="9876543210"
                                />
                            </div>

                            <div>
                                <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700 mb-2">
                                    GST Number
                                </label>
                                <input
                                    type="text"
                                    id="gstNumber"
                                    name="gstNumber"
                                    value={companyFormData.gstNumber}
                                    onChange={handleCompanyChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 uppercase"
                                    placeholder="Enter GST number"
                                />
                            </div>

                            <motion.button
                                type="submit"
                                disabled={isLoading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-blue-500 text-white py-4 rounded-lg font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Registering...' : 'Register'}
                            </motion.button>
                        </form>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default InternshipLoginPage;
