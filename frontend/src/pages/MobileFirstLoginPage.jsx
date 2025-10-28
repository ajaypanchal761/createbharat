import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import logo from '../assets/logo.png';

const MobileFirstLoginPage = () => {
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [activeOtpIndex, setActiveOtpIndex] = useState(0);
    const [step, setStep] = useState('phone'); // 'phone' or 'otp'
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useUser();

    const handleSendOTP = (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Simulate sending OTP
        setTimeout(() => {
            setIsLoading(false);
            setStep('otp');
            setActiveOtpIndex(0);
        }, 2000);
    };

    const handleVerifyOTP = (e) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            const existingUser = localStorage.getItem('userData');
            let userData;
            
            if (existingUser) {
                userData = JSON.parse(existingUser);
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userPhone', phone);
                localStorage.setItem('userEmail', email);
            } else {
                userData = {
                    name: email.split('@')[0],
                    firstName: email.split('@')[0],
                    lastName: '',
                    email: email,
                    phone: phone,
                    address: ''
                };
                login(userData);
            }
            
            localStorage.setItem('userType', 'user');
            localStorage.setItem('isAdmin', 'false');
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userPhone', phone);
            localStorage.setItem('userEmail', email);
            localStorage.setItem('hasVisited', 'true');
            
            setIsLoading(false);
            navigate('/', { replace: true });
        }, 1000);
    };

    const handleSkipLogin = () => {
        localStorage.setItem('hasVisited', 'true');
        localStorage.setItem('userType', 'guest');
        localStorage.setItem('isLoggedIn', 'false');
        navigate('/', { replace: true });
    };

    const handleBack = () => {
        setStep('phone');
        setOtp('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm"
            >
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <img src={logo} alt="CreateBharat" className="w-12 h-12 object-contain" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        {step === 'phone' ? 'Welcome to CreateBharat' : 'Verify OTP'}
                    </h1>
                    <p className="text-gray-600 text-sm">
                        {step === 'phone' ? 'Sign in with your phone number' : 'Enter the 6-digit code'}
                    </p>
                </div>


                {/* Phone Number Form */}
                {step === 'phone' ? (
                    <form onSubmit={handleSendOTP} className="space-y-4">
                    <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number
                        </label>
                            <div className="flex items-center">
                                <span className="px-4 py-3 bg-gray-100 border-2 border-r-0 border-gray-300 rounded-l-xl text-sm font-medium text-gray-700">
                                    +91
                                </span>
                            <input
                                    type="tel"
                                    name="phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                required
                                    maxLength="10"
                                    pattern="[0-9]{10}"
                                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-r-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg tracking-wider"
                                    placeholder="9876543210"
                            />
                        </div>
                    </div>

                        <motion.button
                            type="submit"
                            disabled={isLoading || phone.length !== 10}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                ) : (
                    /* OTP Verification Form */
                    <form onSubmit={handleVerifyOTP} className="space-y-4">
                    <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Enter OTP
                        </label>
                            <input
                                type="text"
                                name="otp"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                maxLength="6"
                                pattern="[0-9]{6}"
                                className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-2xl tracking-[0.5em] text-center font-semibold"
                                placeholder="000000"
                            />
                            <p className="mt-2 text-xs text-gray-500 text-center">
                                OTP sent to +91 {phone}
                            </p>
                    </div>

                    <motion.button
                        type="submit"
                            disabled={isLoading || otp.length !== 6}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Verifying...
                                </span>
                            ) : (
                                'Verify'
                        )}
                    </motion.button>

                        <motion.button
                            type="button"
                            onClick={handleBack}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full text-gray-600 hover:text-gray-800 text-sm font-medium"
                        >
                            ← Change Phone Number
                        </motion.button>
                </form>
                )}

                {/* Skip Login Option */}
                {step === 'phone' && (
                <div className="mt-4 text-center">
                    <button
                        onClick={handleSkipLogin}
                        className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                    >
                        Continue as Guest
                    </button>
                </div>
                )}
            </motion.div>
        </div>
    );
};

export default MobileFirstLoginPage;
