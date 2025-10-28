import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBuilding, FaEnvelope, FaLock } from 'react-icons/fa';
import logo from '../../assets/logo.png';

const CompanyLoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        companyName: '',
        email: '',
        phone: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.companyName || !formData.email || !formData.phone) {
            setError('Please fill in all fields');
            return;
        }
        
        setIsLoading(true);
        setError('');

        // Simulate login
        setTimeout(() => {
            // Save company login state
            localStorage.setItem('userType', 'company');
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('companyName', formData.companyName);
            localStorage.setItem('companyEmail', formData.email);
            
            setIsLoading(false);
            navigate('/company/internships');
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-blue-50/30 to-slate-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md bg-white rounded-2xl shadow-2xl border-2 border-gray-200 p-6 md:p-8"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <img src={logo} alt="CreateBharat" className="w-10 h-10 object-contain" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Company Login</h1>
                    <p className="text-gray-600 text-sm md:text-base">Post internships and hire talented students</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Company Name */}
                    <div>
                        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                            Company Name
                        </label>
                        <div className="relative">
                            <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                            <input
                                type="text"
                                id="companyName"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                required
                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                                placeholder="Enter company name"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                                placeholder="company@example.com"
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                        </label>
                        <div className="relative">
                            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                                placeholder="9876543210"
                                maxLength="10"
                            />
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-50 border border-red-200 rounded-lg p-3"
                        >
                            <p className="text-red-800 text-sm">{error}</p>
                        </motion.div>
                    )}

                    {/* Submit Button */}
                    <motion.button
                        type="submit"
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing in...
                            </span>
                        ) : (
                            'Sign In as Company'
                        )}
                    </motion.button>
                </form>

                {/* Demo Credentials */}
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-3">
                    <h3 className="text-xs font-semibold text-blue-900 mb-1">Demo Credentials:</h3>
                    <div className="text-xs text-blue-800">
                        <div><strong>Company:</strong> TechCorp Solutions</div>
                        <div><strong>Email:</strong> company@example.com</div>
                        <div><strong>Phone:</strong> 9876543210</div>
                    </div>
                </div>

                {/* Sign Up Link */}
                <div className="mt-6 text-center">
                    <p className="text-gray-600 text-sm">
                        Don't have an account?{' '}
                        <button
                            onClick={() => alert('Sign up feature coming soon!')}
                            className="text-orange-600 hover:text-orange-500 font-medium"
                        >
                            Sign up
                        </button>
                    </p>
                </div>

                {/* Back Link */}
                <div className="mt-4 text-center">
                    <button
                        onClick={() => navigate('/internships')}
                        className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                    >
                        ← Back to Internships
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default CompanyLoginPage;

