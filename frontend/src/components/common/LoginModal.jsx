import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';

const LoginModal = ({ isOpen, onClose, onSwitchToSignup, selectedService, isAdminLogin }) => {
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState(['', '', '', '']);
    const [step, setStep] = useState('phone'); // 'phone' or 'otp'
    const [isLoading, setIsLoading] = useState(false);
    const [loginType, setLoginType] = useState('user');
    const navigate = useNavigate();

    const handleSendOTP = (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        setTimeout(() => {
            setIsLoading(false);
            setStep('otp');
            alert(`OTP sent to your phone and email`);
        }, 2000);
    };

    const handleVerifyOTP = (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        setTimeout(() => {
            if (loginType === 'admin') {
                localStorage.setItem('userType', 'admin');
                localStorage.setItem('isAdmin', 'true');
                localStorage.setItem('isLoggedIn', 'true');
                navigate('/admin/dashboard');
            } else if (loginType === 'company') {
                localStorage.setItem('userType', 'company');
                localStorage.setItem('isLoggedIn', 'true');
                navigate('/company/internships');
            } else {
                const userData = {
                    name: phone,
                    firstName: phone,
                    lastName: '',
                    phone: phone,
                    address: ''
                };
                localStorage.setItem('userData', JSON.stringify(userData));
                localStorage.setItem('userType', 'user');
                localStorage.setItem('isAdmin', 'false');
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userPhone', phone);
                
                if (selectedService) {
                    navigate(selectedService);
                } else {
                    navigate('/');
                }
            }
            
            setIsLoading(false);
            onClose();
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

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={handleOverlayClick}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {step === 'phone' ? 'Sign In' : 'Verify OTP'}
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            >
                                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {step === 'phone' ? (
                            <>
                                {/* Login Type Options */}
                                {(isAdminLogin || selectedService === '/internships' || selectedService === '/legal') && (
                                    <div className="mb-6">
                                        <div className="flex bg-gray-100 rounded-lg p-1">
                                            <button
                                                type="button"
                                                onClick={() => setLoginType('user')}
                                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                                                    loginType === 'user'
                                                        ? 'bg-white text-gray-900 shadow-sm'
                                                        : 'text-gray-600 hover:text-gray-900'
                                                }`}
                                            >
                                                {selectedService === '/internships' ? 'Student' : 'User'}
                                            </button>
                                            {(isAdminLogin || selectedService === '/legal') && (
                                                <button
                                                    type="button"
                                                    onClick={() => setLoginType('admin')}
                                                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                                                        loginType === 'admin'
                                                            ? 'bg-white text-gray-900 shadow-sm'
                                                            : 'text-gray-600 hover:text-gray-900'
                                                    }`}
                                                >
                                                    Admin
                                                </button>
                                            )}
                                            {selectedService === '/internships' && (
                                                <button
                                                    type="button"
                                                    onClick={() => setLoginType('company')}
                                                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                                                        loginType === 'company'
                                                            ? 'bg-white text-gray-900 shadow-sm'
                                                            : 'text-gray-600 hover:text-gray-900'
                                                    }`}
                                                >
                                                    Company
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Form */}
                                <form onSubmit={handleSendOTP} className="space-y-4">
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
                                        className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? 'Sending OTP...' : 'Continue'}
                                    </motion.button>
                                </form>

                                {/* Sign Up Link */}
                                <div className="mt-4 text-center">
                                    <p className="text-gray-600 text-sm">
                                        Don't have an account?{' '}
                                        <button
                                            onClick={onSwitchToSignup}
                                            className="text-orange-600 hover:text-orange-500 font-medium"
                                        >
                                            Sign up
                                        </button>
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <p className="text-gray-600 text-sm mb-6">
                                    We have sent the verification code to your phone number.
                                </p>

                                <form onSubmit={handleVerifyOTP} className="space-y-6">
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
                                                className="w-14 h-14 md:w-16 md:h-16 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                                                autoFocus={index === 0}
                                            />
                                        ))}
                                    </div>

                                    <motion.button
                                        type="submit"
                                        disabled={isLoading || otp.some(d => !d)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? 'Verifying...' : 'Confirm'}
                                    </motion.button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setStep('phone');
                                            setOtp(['', '', '', '']);
                                        }}
                                        className="w-full text-gray-600 hover:text-gray-800 text-sm font-medium"
                                    >
                                        ← Change Phone Number
                                    </button>
                                </form>
                            </>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoginModal;
