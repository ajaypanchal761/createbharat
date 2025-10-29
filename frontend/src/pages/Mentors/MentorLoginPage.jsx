import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../../assets/logo.png';

const MentorLoginPage = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // 6-digit OTP
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // TODO: Replace with actual mentor login API call
      // const response = await mentorAPI.sendLoginOTP(phone);
      
      // Mock API call for now
      setTimeout(() => {
        setStep('otp');
        localStorage.setItem('mentorLoginPhone', phone);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Send OTP error:', error);
      setError(error.message || 'Failed to send OTP. Please try again.');
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const otpCode = otp.join('');
      const loginPhone = localStorage.getItem('mentorLoginPhone') || phone;

      // TODO: Replace with actual mentor OTP verification API call
      // const response = await mentorAPI.verifyOTP({ phone: loginPhone, otp: otpCode });
      
      // Mock API call for now
      setTimeout(() => {
        localStorage.setItem('isMentorLoggedIn', 'true');
        localStorage.setItem('userType', 'mentor');
        localStorage.setItem('mentorPhone', loginPhone);
        navigate('/mentors/dashboard');
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
        document.getElementById(`mentor-otp-${index + 1}`)?.focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`mentor-otp-${index - 1}`)?.focus();
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-50 via-purple-50/30 to-orange-50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {step === 'phone' ? (
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
                Mentor Login
              </h1>
              <p className="text-gray-600 text-sm md:text-base">
                Enter your phone number to receive OTP
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSendOTP} className="space-y-5">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm"
                >
                  {error}
                </motion.div>
              )}

              <div>
                <label htmlFor="mentor-phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    id="mentor-phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    required
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-lg"
                    placeholder="9876543210"
                    maxLength="10"
                  />
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
                    📱
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Enter your 10-digit phone number</p>
              </div>

              <motion.button
                type="submit"
                disabled={isLoading || phone.length !== 10}
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
                  'Send OTP'
                )}
              </motion.button>
            </form>

            {/* Sign up Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Don't have an account?{' '}
                <Link to="/mentors/signup" className="text-orange-600 hover:text-purple-600 font-semibold transition-colors">
                  Sign up as Mentor
                </Link>
              </p>
            </div>

            {/* Back to regular login */}
            <div className="mt-4 text-center">
              <Link to="/login" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                ← Back to User Login
              </Link>
            </div>
          </motion.div>
        ) : (
          /* OTP Verification Form */
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
                <strong className="text-orange-600">{localStorage.getItem('mentorLoginPhone') || phone}</strong>
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
                    id={`mentor-otp-${index}`}
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
                    Verifying...
                  </span>
                ) : (
                  'Confirm & Login'
                )}
              </motion.button>

              <motion.button
                type="button"
                onClick={() => {
                  setStep('phone');
                  setOtp(['', '', '', '', '', '']);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
              >
                ← Back to Login
              </motion.button>
            </form>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default MentorLoginPage;

