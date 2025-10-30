import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '../../contexts/UserContext';
import { authAPI } from '../../utils/api';

const SignupPage = () => {
    const [step, setStep] = useState('details'); // 'details' or 'otp'
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        phone: '',
        email: '',
        dateOfBirth: '',
        gender: 'male',
        address: {
            street: '',
            city: '',
            state: '',
            pincode: ''
        }
    });
    const [otp, setOtp] = useState(['', '', '', '', '', '']); // 6-digit OTP
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useUser();

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
            // Prepare registration data, filtering out empty optional fields
            const registrationData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                gender: formData.gender
            };
            
            // Only include optional fields if they have values
            if (formData.username && formData.username.trim()) {
                registrationData.username = formData.username.trim();
            }
            if (formData.dateOfBirth && formData.dateOfBirth.trim()) {
                registrationData.dateOfBirth = formData.dateOfBirth;
            }
            if (formData.address && Object.values(formData.address).some(val => val && val.trim())) {
                registrationData.address = formData.address;
            }
            
            console.log('📝 Sending registration data:', registrationData);
            
            // Call the real backend API for registration
            const response = await authAPI.register(registrationData);
            
            if (response.success) {
                console.log('Registration successful:', response);
                setStep('otp');
                // Store token for later use
                localStorage.setItem('authToken', response.data.token);
            } else {
                setError(response.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setError(error.message || 'Failed to register. Please try again.');
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
            
            // Call the real backend API for OTP verification
            const response = await authAPI.verifyOTP({
                phone: formData.phone,
                otp: otpCode
            });
            
            if (response.success) {
                console.log('OTP verification successful:', response);
                
                // Get user profile
                const token = localStorage.getItem('authToken');
                const userResponse = await authAPI.getMe(token);
                
                if (userResponse.success) {
                    const userData = {
                        id: userResponse.data.user.id,
                        name: `${userResponse.data.user.firstName} ${userResponse.data.user.lastName}`,
                        firstName: userResponse.data.user.firstName,
                        lastName: userResponse.data.user.lastName,
                        username: userResponse.data.user.username,
                        email: userResponse.data.user.email,
                        phone: userResponse.data.user.phone,
                        role: userResponse.data.user.role,
                        isPhoneVerified: userResponse.data.user.isPhoneVerified,
                        referralCode: userResponse.data.user.referralCode
                    };
                    
                    login(userData);
                    navigate('/');
                } else {
                    setError('Failed to get user profile');
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

    const handleBack = () => {
        setStep('details');
        setOtp(['', '', '', '']);
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-orange-50/20 to-slate-50 flex items-center justify-center px-4 py-12">
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
                    >
                        {/* Logo */}
                        <div className="flex justify-center mb-8">
                            <div className="w-20 h-20 md:w-24 md:h-24 bg-orange-100 rounded-full flex items-center justify-center">
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-orange-500 rounded-full flex items-center justify-center">
                                    <img src="/logo.png" alt="CreateBharat" className="w-12 h-12 md:w-16 md:h-16 object-contain" />
                                </div>
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
                            Create Account
                        </h1>
                        <p className="text-gray-600 text-center mb-8 text-sm md:text-base">
                            Enter your details to get started
                        </p>

                        {/* Form */}
                        <form onSubmit={handleSendOTP} className="space-y-4">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                                        placeholder="First name"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                                        placeholder="Last name"
                                    />
                                </div>
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


                            <motion.button
                                type="submit"
                                disabled={isLoading || formData.phone.length !== 10 || !formData.email || !formData.firstName || !formData.lastName}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-orange-500 text-white py-4 rounded-lg font-semibold hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Sending OTP...' : 'Continue'}
                            </motion.button>
                        </form>

                        {/* Login Link */}
                        <div className="mt-6 text-center">
                            <p className="text-gray-600 text-sm">
                                Already have an account?{' '}
                                <Link to="/login" className="text-orange-500 hover:text-orange-600 font-medium">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
                            Verification Code
                        </h1>
                        <p className="text-gray-600 text-center mb-6 text-sm md:text-base">
                            We have sent a 6-digit verification code to your phone number: <strong>{formData.phone}</strong>
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
                                {isLoading ? 'Creating Account...' : 'Confirm'}
                            </motion.button>

                            <motion.button
                                type="button"
                                onClick={handleBack}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full text-gray-600 hover:text-gray-800 text-sm font-medium"
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

export default SignupPage;
