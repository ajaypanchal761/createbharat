import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import BottomNavbar from '../../components/common/BottomNavbar';
import { authAPI } from '../../utils/api';

// Bottom Nav Icons
const HomeIcon = ({ active }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> );
const BriefcaseIcon = ({ active }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> );
const BarChartIcon = ({ active }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> );
const UserIcon = ({ active }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> );
const SearchIcon = ({ active }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> );
const HeartIcon = ({ active }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> );
const ClipboardIcon = ({ active }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg> );

const ProfilePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        phone: '',
        birth: '',
        gender: '',
        address: ''
    });
    const [userLoading, setUserLoading] = useState(true);
    const [profileImage, setProfileImage] = useState(null);
    const [profileImageUrl, setProfileImageUrl] = useState(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    
    // Load user data from localStorage when component mounts
    useEffect(() => {
        const loadUserData = () => {
            try {
                const userData = localStorage.getItem('userData');
                if (userData) {
                    const parsedUser = JSON.parse(userData);
                    const nameParts = (parsedUser.name || '').split(' ');
                    setFormData({
                        firstName: parsedUser.firstName || nameParts[0] || '',
                        lastName: parsedUser.lastName || nameParts.slice(1).join(' ') || '',
                        username: parsedUser.username || parsedUser.email?.split('@')[0] || '',
                        email: parsedUser.email || '',
                        phone: parsedUser.phone || '',
                        birth: parsedUser.birth || '',
                        gender: parsedUser.gender || '',
                        address: parsedUser.address || ''
                    });
                    // Load profile image if exists
                    if (parsedUser.profileImage) {
                        setProfileImageUrl(parsedUser.profileImage);
                    }
                }
            } catch (error) {
                console.error('Error loading user data:', error);
            } finally {
                setUserLoading(false);
            }
        };
        
        loadUserData();
    }, []);
    
    // Check if user is not logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' || localStorage.getItem('userData');
    if (!isLoggedIn) {
        navigate('/login');
        return null;
    }

    // Determine which page we're coming from to show appropriate bottom navbar
    const getBottomNavbarTabs = () => {
        const previousPage = localStorage.getItem('previousPageBeforeProfile');
        
        if (previousPage && previousPage.includes('/loans')) {
            return [
                { name: 'Home', path: '/', icon: <HomeIcon /> },
                { name: 'Loans', path: '/loans', icon: <BriefcaseIcon /> },
                { name: 'Status', path: '/loans/status', icon: <BarChartIcon /> },
                { name: 'Profile', path: '/profile', icon: <UserIcon /> }
            ];
        } else if (previousPage && previousPage.includes('/internships')) {
            return [
                { name: 'Home', path: '/', icon: <HomeIcon /> },
                { name: 'Search', path: '/internships', icon: <SearchIcon /> },
                { name: 'Applied', path: '/internships/applied', icon: <ClipboardIcon /> },
                { name: 'Profile', path: '/profile', icon: <UserIcon /> }
            ];
        } else if (previousPage && previousPage.includes('/legal')) {
            return [
                { name: 'Home', path: '/', icon: <HomeIcon /> },
                { name: 'Services', path: '/legal', icon: <BriefcaseIcon /> },
                { name: 'Status', path: '/legal', icon: <BarChartIcon /> },
                { name: 'Profile', path: '/profile', icon: <UserIcon /> }
            ];
        } else if (previousPage && previousPage.includes('/mentors')) {
            return [
                { name: 'Home', path: '/', icon: <HomeIcon /> },
                { name: 'Mentors', path: '/mentors', icon: <BriefcaseIcon /> },
                { name: 'Status', path: '/mentors', icon: <BarChartIcon /> },
                { name: 'Profile', path: '/profile', icon: <UserIcon /> }
            ];
        } else {
            return [
                { name: 'Home', path: '/', icon: <HomeIcon /> },
                { name: 'Loans', path: '/loans', icon: <BriefcaseIcon /> },
                { name: 'Status', path: '/loans/status', icon: <BarChartIcon /> },
                { name: 'Profile', path: '/profile', icon: <UserIcon /> }
            ];
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSaveChanges = () => {
        try {
            const existingUser = localStorage.getItem('userData');
            if (existingUser) {
                const parsedUser = JSON.parse(existingUser);
                const updatedUser = {
                    ...parsedUser,
                    name: `${formData.firstName} ${formData.lastName}`.trim(),
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    username: formData.username,
                    phone: formData.phone,
                    birth: formData.birth,
                    gender: formData.gender,
                    address: formData.address
                };
                localStorage.setItem('userData', JSON.stringify(updatedUser));
                alert('Profile updated successfully!');
                setShowEditProfile(false);
            }
        } catch (error) {
            console.error('Error saving user data:', error);
            alert('Error saving profile. Please try again.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userData');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userType');
        localStorage.removeItem('isAdmin');
        window.location.href = '/';
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            return;
        }

        setProfileImage(file);
        
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfileImageUrl(reader.result);
        };
        reader.readAsDataURL(file);

        // Upload image
        setIsUploadingImage(true);
        try {
            const token = localStorage.getItem('token');
            const response = await authAPI.uploadProfileImage(token, file);
            
            if (response.success) {
                // Update localStorage
                const existingUser = localStorage.getItem('userData');
                if (existingUser) {
                    const parsedUser = JSON.parse(existingUser);
                    const updatedUser = {
                        ...parsedUser,
                        profileImage: response.data.profileImage
                    };
                    localStorage.setItem('userData', JSON.stringify(updatedUser));
                }
                alert('Profile image uploaded successfully!');
            } else {
                alert(response.message || 'Failed to upload image');
                // Revert preview
                const existingUser = localStorage.getItem('userData');
                if (existingUser) {
                    const parsedUser = JSON.parse(existingUser);
                    setProfileImageUrl(parsedUser.profileImage || null);
                }
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert(error.message || 'Failed to upload image. Please try again.');
            // Revert preview
            const existingUser = localStorage.getItem('userData');
            if (existingUser) {
                const parsedUser = JSON.parse(existingUser);
                setProfileImageUrl(parsedUser.profileImage || null);
            }
        } finally {
            setIsUploadingImage(false);
        }
    };

    // Show loading
    if (userLoading) {
        return (
            <div className="min-h-screen bg-gray-50 pb-20 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    // Check if user is logged in
    const userData = localStorage.getItem('userData');
    
    if (!isLoggedIn || !userData) {
        return (
            <div className="min-h-screen bg-gray-50 pb-20">
                <div className="bg-white shadow-sm border-b border-gray-200 mb-8">
                    <div className="px-4 py-4">
                        <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
                    </div>
                </div>
                <div className="p-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center">
                        <svg className="w-16 h-16 mx-auto mb-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Please Login</h2>
                        <p className="text-gray-600 mb-4">You need to login to view your profile</p>
                        <Link
                            to="/login"
                            className="inline-block bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                        >
                            Go to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Render Edit Profile Form
    const renderEditProfile = () => (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Mobile Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="md:hidden bg-white shadow-sm border-b border-gray-200"
            >
                <div className="px-4 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setShowEditProfile(false)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h1 className="text-xl font-bold text-gray-800">Edit Profile</h1>
                        <div className="w-10"></div>
                    </div>
                </div>
            </motion.div>

            {/* Webview Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="hidden md:block bg-white shadow-sm border-b border-gray-200"
            >
                <div className="max-w-7xl mx-auto px-8 py-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-gray-800">Edit Profile</h1>
                        <button
                            onClick={() => setShowEditProfile(false)}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            ← Back
                        </button>
                    </div>
                </div>
            </motion.div>

            <div className="p-4 md:p-8 pt-4">
                <div className="max-w-2xl mx-auto">
                    {/* Gradient Header Background */}
                    <div className="hidden md:block relative bg-gradient-to-br from-pink-500 via-purple-500 to-red-500 rounded-3xl h-32 mb-8 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-400/50 to-purple-600/50"></div>
                        <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                            <path d="M0,150 Q100,100 200,150 T400,150 L400,200 L0,200 Z" fill="white" opacity="0.1"/>
                        </svg>
                    </div>

                    {/* Profile Picture Section */}
                    <div className="relative flex justify-center mt-2 md:-mt-16 mb-6">
                        <div className="relative">
                            <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                                {profileImageUrl ? (
                                    <img 
                                        src={profileImageUrl} 
                                        alt="Profile" 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <svg className="w-12 h-12 md:w-16 md:h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 w-8 h-8 md:w-10 md:h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors cursor-pointer">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    disabled={isUploadingImage}
                                    className="hidden"
                                />
                                {isUploadingImage ? (
                                    <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-white"></div>
                                ) : (
                                    <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                )}
                            </label>
                        </div>
                    </div>

                    {/* Form Container */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl md:rounded-3xl shadow-xl p-6 md:p-8"
                    >
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Edit Profile</h2>

                        <div className="space-y-4 md:space-y-6">
                            {/* First Name & Last Name */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                    <input
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="First Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="Last Name"
                                    />
                                </div>
                            </div>

                            {/* Username & Email */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                                    <input
                                        type="text"
                                        value={formData.username}
                                        onChange={(e) => handleInputChange('username', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="@username"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        disabled
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
                                        placeholder="email@example.com"
                                    />
                                </div>
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="+91 9876543210"
                                />
                            </div>

                            {/* Birth & Gender */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                                    <input
                                        type="date"
                                        value={formData.birth}
                                        onChange={(e) => handleInputChange('birth', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                                    <select
                                        value={formData.gender}
                                        onChange={(e) => handleInputChange('gender', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                <textarea
                                    value={formData.address}
                                    onChange={(e) => handleInputChange('address', e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                                    placeholder="Enter your address"
                                />
                            </div>

                            {/* Save & Cancel Buttons */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={() => setShowEditProfile(false)}
                                    className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveChanges}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-xl transition-colors"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );

    // Main Profile Page with Options List
    const renderProfileMain = () => (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Mobile Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="md:hidden bg-white shadow-sm border-b border-gray-200"
            >
                <div className="px-4 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h1 className="text-xl font-bold text-gray-800">My Profile</h1>
                        <div className="w-10"></div>
                    </div>
                </div>
            </motion.div>

            {/* Webview Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="hidden md:block bg-white shadow-sm border-b border-gray-200"
            >
                <div className="max-w-7xl mx-auto px-8 py-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
                    </div>
                </div>
            </motion.div>

            <div className="p-3 md:p-8 pt-4">
                <div className="max-w-4xl mx-auto">
                    {/* User Info Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl md:rounded-3xl shadow-lg p-4 md:p-8 mb-4 md:mb-6"
                    >
                        <div className="flex items-center space-x-3 md:space-x-6">
                            <div className="w-12 h-12 md:w-24 md:h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                                {profileImageUrl ? (
                                    <img 
                                        src={profileImageUrl} 
                                        alt="Profile" 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <svg className="w-6 h-6 md:w-12 md:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-base md:text-2xl font-bold text-gray-800 truncate">
                                    {formData.firstName} {formData.lastName}
                                </h2>
                                <p className="text-xs md:text-base text-gray-600 truncate">{formData.email}</p>
                            </div>
                            <button
                                onClick={() => setShowEditProfile(true)}
                                className="flex items-center gap-1.5 md:gap-2 px-3 md:px-6 py-1.5 md:py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg md:rounded-xl font-medium transition-colors text-xs md:text-base"
                            >
                                <svg className="w-3.5 h-3.5 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                <span className="hidden md:inline">Edit Profile</span>
                            </button>
                        </div>
                    </motion.div>

                    {/* Options List */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-3 md:space-y-4"
                    >
                        {/* My Services */}
                        <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg overflow-hidden">
                            <div className="p-3 md:p-6">
                                <h3 className="text-base md:text-xl font-semibold text-gray-800 mb-3 md:mb-4">My Services</h3>
                                <div className="space-y-1">
                                    <Link to="/internships/applied" className="flex items-center justify-between p-3 md:p-4 hover:bg-gray-50 rounded-lg md:rounded-xl transition-colors">
                                        <div className="flex items-center space-x-3 md:space-x-4">
                                            <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                                                <svg className="w-4 h-4 md:w-6 md:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <span className="text-sm md:text-base text-gray-800 font-medium">Internships</span>
                                        </div>
                                        <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>

                                    <Link to="/loans/status" className="flex items-center justify-between p-3 md:p-4 hover:bg-gray-50 rounded-lg md:rounded-xl transition-colors">
                                        <div className="flex items-center space-x-3 md:space-x-4">
                                            <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                                                <svg className="w-4 h-4 md:w-6 md:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <span className="text-sm md:text-base text-gray-800 font-medium">Loans</span>
                                        </div>
                                        <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>

                                    <Link to="/training" className="flex items-center justify-between p-3 md:p-4 hover:bg-gray-50 rounded-lg md:rounded-xl transition-colors">
                                        <div className="flex items-center space-x-3 md:space-x-4">
                                            <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-100 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                                                <svg className="w-4 h-4 md:w-6 md:h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <span className="text-sm md:text-base text-gray-800 font-medium">Courses</span>
                                        </div>
                                        <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>

                                    <Link to="/legal" className="flex items-center justify-between p-3 md:p-4 hover:bg-gray-50 rounded-lg md:rounded-xl transition-colors">
                                        <div className="flex items-center space-x-3 md:space-x-4">
                                            <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-100 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                                                <svg className="w-4 h-4 md:w-6 md:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <span className="text-sm md:text-base text-gray-800 font-medium">Legal Services</span>
                                        </div>
                                        <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Legal & Support Options */}
                        <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg overflow-hidden">
                            <div className="p-3 md:p-6">
                                <h3 className="text-base md:text-xl font-semibold text-gray-800 mb-3 md:mb-4">Legal & Support</h3>
                                <div className="space-y-1">
                                    <Link to="/contact" className="flex items-center justify-between p-3 md:p-4 hover:bg-gray-50 rounded-lg md:rounded-xl transition-colors">
                                        <div className="flex items-center space-x-3 md:space-x-4">
                                            <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                                                <svg className="w-4 h-4 md:w-6 md:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <span className="text-sm md:text-base text-gray-800 font-medium">Contact Us</span>
                                        </div>
                                        <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>

                                    <Link to="/faq" className="flex items-center justify-between p-3 md:p-4 hover:bg-gray-50 rounded-lg md:rounded-xl transition-colors">
                                        <div className="flex items-center space-x-3 md:space-x-4">
                                            <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                                                <svg className="w-4 h-4 md:w-6 md:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <span className="text-sm md:text-base text-gray-800 font-medium">FAQs</span>
                                        </div>
                                        <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>

                                    <Link to="/terms" className="flex items-center justify-between p-3 md:p-4 hover:bg-gray-50 rounded-lg md:rounded-xl transition-colors">
                                        <div className="flex items-center space-x-3 md:space-x-4">
                                            <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-100 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                                                <svg className="w-4 h-4 md:w-6 md:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <span className="text-sm md:text-base text-gray-800 font-medium">Terms & Conditions</span>
                                        </div>
                                        <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>

                                    <Link to="/privacy" className="flex items-center justify-between p-3 md:p-4 hover:bg-gray-50 rounded-lg md:rounded-xl transition-colors">
                                        <div className="flex items-center space-x-3 md:space-x-4">
                                            <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-100 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                                                <svg className="w-4 h-4 md:w-6 md:h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            </div>
                                            <span className="text-sm md:text-base text-gray-800 font-medium">Privacy Policy</span>
                                        </div>
                                        <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Account Options */}
                        <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg overflow-hidden">
                            <div className="p-3 md:p-6">
                                <h3 className="text-base md:text-xl font-semibold text-gray-800 mb-3 md:mb-4">Account</h3>
                                <div className="space-y-1">
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center justify-between p-3 md:p-4 hover:bg-red-50 rounded-lg md:rounded-xl transition-colors w-full"
                                    >
                                        <div className="flex items-center space-x-3 md:space-x-4">
                                            <div className="w-8 h-8 md:w-10 md:h-10 bg-red-100 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                                                <svg className="w-4 h-4 md:w-6 md:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                            </div>
                                            <span className="text-sm md:text-base text-gray-800 font-medium">Log Out</span>
                                        </div>
                                        <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* App Version */}
                        <div className="text-center py-4">
                            <p className="text-sm text-gray-500">App Version 2.0</p>
                        </div>
                    </motion.div>
                </div>
            </div>

            <BottomNavbar tabs={getBottomNavbarTabs()} />
        </div>
    );

    // Show Edit Profile or Main Profile
    if (showEditProfile) {
        return renderEditProfile();
    }

    return renderProfileMain();
};

export default ProfilePage;
