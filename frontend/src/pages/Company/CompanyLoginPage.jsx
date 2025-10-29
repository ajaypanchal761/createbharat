import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../../assets/logo.png';

const CompanyLoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const { companyAPI } = await import('../../utils/api');
      const response = await companyAPI.login({
        email: formData.email,
        password: formData.password
      });

      if (response.success && response.data) {
        // Save company data and token
        localStorage.setItem('companyToken', response.data.token);
        localStorage.setItem('companyData', JSON.stringify(response.data.company));
        localStorage.setItem('companyEmail', response.data.company.email);
        localStorage.setItem('companyName', response.data.company.companyName);
        localStorage.setItem('userType', 'company');
        localStorage.setItem('isLoggedIn', 'true');

        setIsLoading(false);
        navigate('/company/internships');
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      setErrors({
        email: error.message.includes('email') ? error.message : '',
        password: error.message.includes('password') || error.message.includes('credentials') ? error.message : error.message
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 relative overflow-hidden">
      {/* Desktop Background Pattern */}
      <div className="hidden lg:block absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-orange-300 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-orange-400 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-orange-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-orange-300 rounded-full blur-2xl"></div>
      </div>

      <div className="flex items-center justify-center min-h-screen lg:p-4">
        {/* Mobile Full Screen / Desktop Layout */}
        <div className="w-full h-full lg:max-w-6xl lg:h-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white h-full lg:rounded-3xl lg:shadow-2xl overflow-hidden lg:flex lg:min-h-[600px]"
          >
            {/* Left Side - Header Section */}
            <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 p-8 lg:p-12 lg:w-1/2 lg:flex lg:flex-col lg:justify-center relative overflow-hidden">
              {/* Mobile Back Button */}
              <div className="lg:hidden absolute top-4 left-4 z-20">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  aria-label="Go back"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
              </div>

              {/* Background Pattern for Desktop */}
              <div className="hidden lg:block absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24"></div>
                <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-center mb-6 lg:mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    className="bg-white rounded-2xl p-4 lg:p-6 shadow-xl"
                  >
                    <img src={logo} alt="CreateBharat" className="w-16 h-16 lg:w-24 lg:h-24" />
                  </motion.div>
                </div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-3xl lg:text-5xl font-bold text-center text-white"
                >
                  Company Login
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="text-center mt-4 lg:mt-6 text-orange-100 text-lg lg:text-xl"
                >
                  Access your company dashboard and manage internships
                </motion.p>

                {/* Desktop Features */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="hidden lg:block mt-8 space-y-4"
                >
                  <div className="flex items-center space-x-3 text-orange-100">
                    <div className="w-2 h-2 bg-orange-200 rounded-full"></div>
                    <span className="text-sm">Manage internship postings</span>
                  </div>
                  <div className="flex items-center space-x-3 text-orange-100">
                    <div className="w-2 h-2 bg-orange-200 rounded-full"></div>
                    <span className="text-sm">Track applications and candidates</span>
                  </div>
                  <div className="flex items-center space-x-3 text-orange-100">
                    <div className="w-2 h-2 bg-orange-200 rounded-full"></div>
                    <span className="text-sm">Access analytics and insights</span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Right Side - Form Section */}
            <div className="p-6 lg:p-12 lg:w-1/2 lg:flex lg:flex-col lg:justify-center flex-1 flex flex-col justify-center">
              <div className="max-w-md mx-auto w-full">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Company Email
                    </label>
                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                      className="relative group"
                    >
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all duration-300 text-lg ${errors.email
                            ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                            : 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
                          } outline-none hover:border-orange-400`}
                        placeholder="Enter your company email"
                      />
                    </motion.div>
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 text-sm text-red-600 flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.email}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Password Field */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Password
                    </label>
                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                      className="relative group"
                    >
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all duration-300 text-lg ${errors.password
                            ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                            : 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
                          } outline-none hover:border-orange-400`}
                        placeholder="Enter your password"
                      />
                    </motion.div>
                    {errors.password && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 text-sm text-red-600 flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.password}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Forgot Password Link */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="flex items-center justify-end"
                  >
                    <Link
                      to="/forgot-password"
                      className="text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </motion.div>

                  {/* Submit Button */}
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg ${isLoading
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 hover:shadow-2xl hover:shadow-orange-200'
                      }`}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Logging in...
                      </span>
                    ) : (
                      'Login to Dashboard'
                    )}
                  </motion.button>
                </form>

                {/* Signup Section */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="mt-8 space-y-4"
                >
                  {/* Divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-gray-300"></div>
                    <span className="text-sm text-gray-500 font-medium">Or</span>
                    <div className="flex-1 h-px bg-gray-300"></div>
                  </div>

                  {/* Signup Button */}
                  <Link to="/company/signup">
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:from-indigo-600 hover:to-indigo-700 hover:shadow-2xl hover:shadow-indigo-200"
                    >
                      Create Company Account
                    </motion.button>
                  </Link>
                </motion.div>

                {/* Back to Home Link */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="mt-8 text-center hidden md:block"
                >
                  <Link
                    to="/"
                    className="text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors hover:underline flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Home
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CompanyLoginPage;

