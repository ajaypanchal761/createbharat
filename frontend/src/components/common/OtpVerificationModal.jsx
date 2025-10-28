import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { authAPI } from '../../utils/api';

const OtpVerificationModal = ({ isOpen, onClose, phone, purpose, onSuccess }) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [countdown, setCountdown] = useState(60);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setCountdown(60);
            setCanResend(false);
        }
    }, [isOpen]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [countdown]);

    const handleOtpChange = (index, value) => {
        if (value.length > 1) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError('');

        // Auto-focus next input
        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`)?.focus();
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        const otpCode = otp.join('');

        if (otpCode.length !== 6) {
            setError('Please enter all 6 digits');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await authAPI.verifyOTP({
                phone,
                otp: otpCode,
                purpose
            });

            if (response.success) {
                // Save user data to localStorage
                const userData = response.data;
                localStorage.setItem('userData', JSON.stringify(userData));
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userType', userData.role || 'user');
                localStorage.setItem('isAdmin', 'false');
                localStorage.setItem('token', userData.token);

                onSuccess(userData);
            } else {
                setError('Invalid OTP. Please try again.');
            }
        } catch (error) {
            setError(error.message || 'Verification failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        setIsLoading(true);
        setError('');

        try {
            await authAPI.resendOTP(phone, purpose);
            setCountdown(60);
            setCanResend(false);
            setError('');
        } catch (error) {
            setError(error.message || 'Failed to resend OTP');
        } finally {
            setIsLoading(false);
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
                        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border-2 border-gray-200 p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Verify OTP</h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            >
                                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <p className="text-gray-600 text-sm mb-6">
                            Enter the 6-digit OTP sent to <span className="font-semibold">{phone}</span>
                        </p>

                        <form onSubmit={handleVerify} className="space-y-6">
                            <div className="flex justify-center gap-2">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`otp-${index}`}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                                    />
                                ))}
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Verifying...' : 'Verify OTP'}
                            </button>

                            <div className="text-center">
                                {canResend ? (
                                    <button
                                        type="button"
                                        onClick={handleResend}
                                        disabled={isLoading}
                                        className="text-orange-600 hover:text-orange-500 text-sm font-medium"
                                    >
                                        Resend OTP
                                    </button>
                                ) : (
                                    <p className="text-gray-500 text-sm">
                                        Resend OTP in {countdown}s
                                    </p>
                                )}
                            </div>

                            <div className="text-center text-xs text-gray-500 mt-4 p-3 bg-orange-50 rounded-lg">
                                <p className="font-semibold text-orange-800">Test Mode:</p>
                                <p>OTP is logged in backend console (not sent via SMS)</p>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default OtpVerificationModal;

