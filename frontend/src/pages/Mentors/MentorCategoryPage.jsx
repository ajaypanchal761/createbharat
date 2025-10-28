import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';

const MentorCategoryPage = () => {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState('user');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [step, setStep] = useState('phone');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
      alert(`OTP sent to ${phone}`);
    }, 2000);
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    
    setIsLoading(true);
    
    setTimeout(() => {
      if (loginType === 'mentor') {
        localStorage.setItem('userType', 'mentor');
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('isMentor', 'true');
        navigate('/mentors/profile');
      } else {
        localStorage.setItem('userType', 'user');
        localStorage.setItem('isLoggedIn', 'true');
        navigate('/mentors/listing');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleOtpChange = (index, value) => {
    if (!value || /^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      if (value && index < 3) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col">
      {/* Back Button */}
      <Link to="/" className="absolute top-6 left-6 p-2 hover:bg-gray-100 rounded-full transition-colors">
        <FaArrowLeft className="text-gray-600" />
      </Link>

      {step === 'otp' && (
        <button
          onClick={() => {
            setStep('phone');
            setOtp(['', '', '', '']);
          }}
          className="absolute top-6 left-16 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <FaArrowLeft className="text-gray-600" />
        </button>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 md:py-16">
        {step === 'phone' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            {/* Illustration */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-32 h-32 bg-orange-100 rounded-full flex items-center justify-center">
                  <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-4xl">🎓</span>
                  </div>
            </div>
          </div>
        </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-2">
              OTP Verification
            </h1>
            <p className="text-gray-600 text-center mb-8">
              Enter your phone number to send one time Password.
            </p>

            {/* Login Type Selection */}
            <div className="mb-6">
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setLoginType('user')}
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                    loginType === 'user'
                      ? 'bg-white text-orange-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  👤 User
                </button>
                <button
                  type="button"
                  onClick={() => setLoginType('mentor')}
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                    loginType === 'mentor'
                      ? 'bg-white text-orange-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  🎓 Mentor
                </button>
                      </div>
                    </div>

            {/* Form */}
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  maxLength="10"
                  pattern="[0-9]{10}"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                  placeholder="9876543210"
                />
              </div>

              <motion.button
                type="submit"
                disabled={isLoading || phone.length !== 10}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-orange-500 text-white py-4 rounded-lg font-semibold hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : 'Continue'}
              </motion.button>
            </form>
                  </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-2">
              Verification Code
            </h1>
            <p className="text-gray-600 text-center mb-10">
              We have sent the verification code to your phone number.
            </p>

            <form onSubmit={handleVerifyOTP} className="space-y-8">
              <div className="flex justify-center gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-16 h-16 md:w-20 md:h-20 text-center text-2xl md:text-3xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              <motion.button
                type="submit"
                disabled={isLoading || otp.some(d => !d)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-orange-500 text-white py-4 rounded-lg font-semibold hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Verifying...' : 'Confirm'}
              </motion.button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MentorCategoryPage;