import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '../../contexts/UserContext';
import { authAPI } from '../../utils/api';
import logo from '../../assets/logo.png';

const LoginPage = () => {
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']); // 6-digit OTP
    const [step, setStep] = useState('phone'); // 'phone' or 'otp'
    const [isLoading, setIsLoading] = useState(false);
    const [resendCountdown, setResendCountdown] = useState(0);
    const [error, setError] = useState('');
    const [loginType, setLoginType] = useState('user'); // 'user' or 'admin'
    const navigate = useNavigate();
    const { login } = useUser();

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // For passwordless login, send OTP to user's phone
            // Ensure phone is exactly 10 digits starting with 6-9
            const sanitizedPhone = (phone || '').replace(/\D/g, '');
            
            // Validate phone format before sending
            if (sanitizedPhone.length !== 10 || !/^[6-9]/.test(sanitizedPhone)) {
                setError('Please enter a valid 10-digit phone number starting with 6-9');
                setIsLoading(false);
                return;
            }

            console.log('📱 Sending OTP to phone:', {
                original: phone,
                sanitized: sanitizedPhone,
                length: sanitizedPhone.length,
                startsWith6to9: /^[6-9]/.test(sanitizedPhone),
                isValid: sanitizedPhone.length === 10 && /^[6-9]/.test(sanitizedPhone)
            });
            const response = await authAPI.sendLoginOTP(sanitizedPhone);

            if (response.success) {
                console.log('OTP sent for login:', response);
                setStep('otp');
                // Store phone for OTP verification
                localStorage.setItem('loginPhone', sanitizedPhone);
                setResendCountdown(60);
            } else {
                setError(response.message || 'Failed to send OTP');
            }
        } catch (error) {
            console.error('Send OTP error:', error);
            setError(error.message || 'Failed to send OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const otpCode = otp.join('');
            if (otpCode.length !== 6) {
                setIsLoading(false);
                setError('Please enter the 6-digit code.');
                return;
            }
            const loginPhone = localStorage.getItem('loginPhone') || (phone || '').replace(/\D/g, '');

            // Call the real backend API for OTP verification with login purpose
            console.log('🔐 Verifying OTP with:', { 
                phone: loginPhone, 
                otp: otpCode, 
                purpose: 'login',
                phoneLength: loginPhone.length,
                otpLength: otpCode.length,
                phoneStartsWith6to9: /^[6-9]/.test(loginPhone),
                otpIsNumeric: /^\d+$/.test(otpCode)
            });
            const response = await authAPI.verifyOTP({
                phone: loginPhone,
                otp: otpCode,
                purpose: 'login'
            });

            if (response.success) {
                console.log('OTP verification successful:', response);

                // Get token from response (now returned by backend)
                const token = response.data.token;
                const userData = response.data.user;

                if (!token) {
                    setError('Login token not received. Please try again.');
                    return;
                }

                // Store token
                localStorage.setItem('token', token);
                localStorage.setItem('authToken', token);

                if (loginType === 'admin') {
                    localStorage.setItem('userType', 'admin');
                    localStorage.setItem('isAdmin', 'true');
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('adminEmail', userData.email);
                    navigate('/admin/dashboard');
                } else {
                    // Prepare user data for context
                    const fullUserData = {
                        id: userData.id,
                        name: `${userData.firstName} ${userData.lastName}`,
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        username: userData.username,
                        email: userData.email,
                        phone: userData.phone,
                        role: userData.role,
                        isPhoneVerified: userData.isPhoneVerified,
                        referralCode: userData.referralCode,
                        token: token
                    };

                    // login() function already sets isLoggedIn and userData
                    console.log('🔐 Calling login function with user data:', fullUserData);
                    login(fullUserData);
                    localStorage.setItem('userType', 'user');
                    localStorage.setItem('userData', JSON.stringify(fullUserData));
                    // Mark first-visit handled so mobile modal doesn't reopen
                    localStorage.setItem('hasVisited', 'true');
                    console.log('🏠 Navigating to home page...');
                    // Go to Home hero section (top). Navigate, then smooth scroll.
                    navigate('/');
                    setTimeout(() => {
                        console.log('🎯 Scrolling to hero section...');
                        const heroEl = document.getElementById('hero');
                        if (heroEl && heroEl.scrollIntoView) {
                            heroEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        } else {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                    }, 100);
                }
            } else {
                setError(response.message || 'OTP verification failed');
            }
        } catch (error) {
            console.error('OTP verification error:', error);
            setError(error.message || 'Failed to verify OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Countdown effect for resend
    React.useEffect(() => {
        if (resendCountdown <= 0) return;
        const id = setInterval(() => setResendCountdown((s) => s - 1), 1000);
        return () => clearInterval(id);
    }, [resendCountdown]);

    const handleResend = async () => {
        setError('');
        try {
            const loginPhone = localStorage.getItem('loginPhone') || (phone || '').replace(/\D/g, '');
            if (!loginPhone || loginPhone.length !== 10) {
                setError('Enter a valid phone number first.');
                setStep('phone');
                return;
            }
            setIsLoading(true);
            const response = await authAPI.resendOTP(loginPhone, 'login');
            if (response.success) {
                setResendCountdown(60);
            } else {
                setError(response.message || 'Could not resend OTP.');
            }
        } catch (err) {
            setError(err.message || 'Could not resend OTP.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpChange = (index, value) => {
        if (!value || /^[0-9]$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            if (value && index < 5) {
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
        <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-orange-50/20 to-slate-50 flex items-center justify-center px-4 py-12">
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
                    >
                        {/* Logo */}
                        <div className="flex justify-center mb-8">
                            <div className="w-20 h-20 md:w-24 md:h-24 bg-orange-100 rounded-full flex items-center justify-center">
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-orange-500 rounded-full flex items-center justify-center">
                                    <img src={logo} alt="CreateBharat" className="w-12 h-12 md:w-16 md:h-16 object-contain" />
                                </div>
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
                            Phone Login
                        </h1>
                        <p className="text-gray-600 text-center mb-8 text-sm md:text-base">
                            Enter your phone number to receive OTP
                        </p>

                        {/* Form */}
                        <form onSubmit={handleSendOTP} className="space-y-5">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

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
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                                    placeholder="9876543210"
                                    maxLength="10"
                                />
                            </div>

                            <motion.button
                                type="submit"
                                disabled={isLoading || phone.length !== 10}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-orange-500 text-white py-4 rounded-lg font-semibold hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Sending OTP...' : 'Send OTP'}
                            </motion.button>
                        </form>

                        {/* Sign up Link */}
                        <div className="mt-6 text-center">
                            <p className="text-gray-600 text-sm">
                                Don't have an account?{' '}
                                <Link to="/signup" className="text-orange-500 hover:text-orange-600 font-medium">
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    /* OTP Verification Form */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
                            Verification Code
                        </h1>
                        <p className="text-gray-600 text-center mb-6 text-sm md:text-base">
                            We have sent a 6-digit verification code to your phone number: <strong>{localStorage.getItem('loginPhone') || phone}</strong>
                        </p>

                        <form onSubmit={handleVerifyOTP} className="space-y-6">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

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
                                className="w-full bg-orange-500 text-white py-4 rounded-lg font-semibold hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Verifying...' : 'Confirm'}
                            </motion.button>

                            <div className="text-center text-sm text-gray-600">
                                {resendCountdown > 0 ? (
                                    <span>Resend code in 0:{String(resendCountdown).padStart(2, '0')}</span>
                                ) : (
                                    <button type="button" onClick={handleResend} className="text-orange-600 hover:text-orange-700 font-medium">
                                        Resend OTP
                                    </button>
                                )}
                            </div>

                            <motion.button
                                type="button"
                                onClick={() => {
                                    setStep('phone');
                                    setOtp(['', '', '', '', '', '']);
                                }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full text-gray-600 hover:text-gray-800 text-sm font-medium"
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

export default LoginPage;
