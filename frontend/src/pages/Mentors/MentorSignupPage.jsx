import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../../assets/logo.png';

const MentorSignupPage = () => {
  const [step, setStep] = useState('details'); // 'details' or 'otp'
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialization: '',
    experience: '',
    company: '',
    bio: ''
  });
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // 6-digit OTP
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // TODO: Replace with actual mentor registration API call
      // const response = await mentorAPI.register(formData);
      
      // Mock API call for now
      setTimeout(() => {
        setStep('otp');
        localStorage.setItem('mentorSignupData', JSON.stringify(formData));
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Failed to register. Please try again.');
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const otpCode = otp.join('');
      const signupData = JSON.parse(localStorage.getItem('mentorSignupData') || '{}');

      // TODO: Replace with actual mentor OTP verification API call
      // const response = await mentorAPI.verifyOTP({ phone: formData.phone, otp: otpCode });
      
      // Mock API call for now
      setTimeout(() => {
        localStorage.setItem('isMentorLoggedIn', 'true');
        localStorage.setItem('userType', 'mentor');
        localStorage.setItem('mentorData', JSON.stringify({ ...signupData, phoneVerified: true }));
        localStorage.removeItem('mentorSignupData');
        navigate('/mentors/profile');
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('OTP verification error:', error);
      setError(error.message || 'Failed to verify OTP. Please try again.');
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!value || /^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        document.getElementById(`mentor-signup-otp-${index + 1}`)?.focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`mentor-signup-otp-${index - 1}`)?.focus();
    }
  };

  const isFormValid = () => {
    return (
      formData.firstName.trim() &&
      formData.lastName.trim() &&
      formData.email.trim() &&
      formData.phone.length === 10 &&
      formData.specialization.trim() &&
      formData.experience.trim()
    );
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-50 via-purple-50/30 to-orange-50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {step === 'details' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-100"
          >
            {/* Logo */}
            <div className="flex justify-center mb-6 md:mb-8">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-orange-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center">
                  <img src={logo} alt="CreateBharat" className="w-12 h-12 md:w-16 md:h-16 object-contain" />
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-6 md:mb-8">
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Become a Mentor
              </h1>
              <p className="text-gray-600 text-sm md:text-base">
                Share your expertise and guide others
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSendOTP} className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                    placeholder="Doe"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                    placeholder="john@example.com"
                  />
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    📧
                  </span>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    required
                    maxLength="10"
                    pattern="[0-9]{10}"
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                    placeholder="9876543210"
                  />
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    📱
                  </span>
                </div>
              </div>

              {/* Specialization */}
              <div>
                <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-2">
                  Specialization *
                </label>
                <input
                  type="text"
                  id="specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                  placeholder="e.g., Business Strategy, Tech Consulting"
                />
              </div>

              {/* Experience */}
              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience *
                </label>
                <input
                  type="text"
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                  placeholder="e.g., 5+ years"
                />
              </div>

              {/* Company (Optional) */}
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                  Company / Organization
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                  placeholder="Company name (optional)"
                />
              </div>

              {/* Bio (Optional) */}
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                  Bio / About You
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 resize-none"
                  placeholder="Tell us about yourself and your expertise..."
                />
              </div>

              <motion.button
                type="submit"
                disabled={isLoading || !isFormValid()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-orange-500 to-purple-600 text-white py-4 rounded-lg font-semibold hover:from-orange-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending OTP...
                  </span>
                ) : (
                  'Continue to Verification'
                )}
              </motion.button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Already have an account?{' '}
                <Link to="/mentors/login" className="text-orange-600 hover:text-purple-600 font-semibold transition-colors">
                  Sign in
                </Link>
              </p>
            </div>

            {/* Back to regular signup */}
            <div className="mt-4 text-center">
              <Link to="/signup" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                ← Back to User Signup
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-100"
          >
            <div className="text-center mb-6 md:mb-8">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-orange-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl md:text-3xl">🔐</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Verification Code
              </h1>
              <p className="text-gray-600 text-sm md:text-base">
                We have sent a 6-digit verification code to your phone number:
                <br />
                <strong className="text-orange-600">{formData.phone}</strong>
              </p>
            </div>

            <form onSubmit={handleVerifyOTP} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm"
                >
                  {error}
                </motion.div>
              )}

              <div className="flex justify-center gap-2 md:gap-3">
                {otp.map((digit, index) => (
                  <motion.input
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    id={`mentor-signup-otp-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-12 h-12 md:w-16 md:h-16 text-center text-xl md:text-2xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              <motion.button
                type="submit"
                disabled={isLoading || otp.some(d => !d)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-orange-500 to-purple-600 text-white py-4 rounded-lg font-semibold hover:from-orange-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  'Confirm & Create Account'
                )}
              </motion.button>

              <motion.button
                type="button"
                onClick={() => {
                  setStep('details');
                  setOtp(['', '', '', '', '', '']);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
              >
                ← Back to Details
              </motion.button>
            </form>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default MentorSignupPage;

