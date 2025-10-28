import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import BottomNavbar from '../../components/common/BottomNavbar';
import MobileFirstLoginPage from '../MobileFirstLoginPage';

// Bottom Nav Icons
const HomeIcon = ({ active }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> );
const BriefcaseIcon = ({ active }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> );
const PlusIcon = ({ active }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg> );
const BarChartIcon = ({ active }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> );
const UserIcon = ({ active }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> );
const SearchIcon = ({ active }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> );
const HeartIcon = ({ active }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> );
const ClipboardIcon = ({ active }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg> );
const ChatIcon = ({ active }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg> );
const DocumentIcon = ({ active }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> );

const ProfilePage = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('personal');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });
    const [userLoading, setUserLoading] = useState(true);
    
    // Load user data from localStorage when component mounts
    useEffect(() => {
        const loadUserData = () => {
            try {
                const userData = localStorage.getItem('userData');
                if (userData) {
                    const parsedUser = JSON.parse(userData);
                    setFormData({
                        name: parsedUser.name || '',
                        email: parsedUser.email || '',
                        phone: parsedUser.phone || '',
                        address: parsedUser.address || ''
                    });
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
        return <MobileFirstLoginPage />;
    }

    // Determine which page we're coming from to show appropriate bottom navbar
    const getBottomNavbarTabs = () => {
        if (location.pathname.includes('/loans')) {
            return [
                { name: 'Home', path: '/', icon: <HomeIcon /> },
                { name: 'Loans', path: '/loans', icon: <BriefcaseIcon /> },
                { name: 'Apply', path: '/loans/apply', icon: <PlusIcon /> },
                { name: 'Status', path: '/loans/status', icon: <BarChartIcon /> },
                { name: 'Profile', path: '/profile', icon: <UserIcon /> }
            ];
        } else if (location.pathname.includes('/internships')) {
            return [
                { name: 'Home', path: '/', icon: <HomeIcon /> },
                { name: 'Search', path: '/internships', icon: <SearchIcon /> },
                { name: 'Saved', path: '/internships/saved', icon: <HeartIcon /> },
                { name: 'Applied', path: '/internships/applied', icon: <ClipboardIcon /> },
                { name: 'Profile', path: '/profile', icon: <UserIcon /> }
            ];
        } else if (location.pathname.includes('/legal')) {
            return [
                { name: 'Home', path: '/', icon: <HomeIcon /> },
                { name: 'Services', path: '/legal', icon: <BriefcaseIcon /> },
                { name: 'Consult', path: '/legal/consult', icon: <ChatIcon /> },
                { name: 'Documents', path: '/legal/documents', icon: <DocumentIcon /> },
                { name: 'Profile', path: '/profile', icon: <UserIcon /> }
            ];
        } else {
            // Default navbar
            return [
                { name: 'Home', path: '/', icon: <HomeIcon /> },
                { name: 'Loans', path: '/loans', icon: <BriefcaseIcon /> },
                { name: 'Apply', path: '/loans/apply', icon: <PlusIcon /> },
                { name: 'Status', path: '/loans/status', icon: <BarChartIcon /> },
                { name: 'Profile', path: '/profile', icon: <UserIcon /> }
            ];
        }
    };

    const tabs = [
        { id: 'personal', name: 'Personal', icon: <UserIcon /> }
    ];

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSaveChanges = () => {
        if (isEditing) {
            // Save changes to localStorage
            try {
                const existingUser = localStorage.getItem('userData');
                if (existingUser) {
                    const parsedUser = JSON.parse(existingUser);
                    const updatedUser = {
                        ...parsedUser,
                        name: formData.name,
                        phone: formData.phone,
                        address: formData.address,
                        // Split name into first and last name if needed
                        firstName: formData.name.split(' ')[0] || '',
                        lastName: formData.name.split(' ').slice(1).join(' ') || ''
                    };
                    localStorage.setItem('userData', JSON.stringify(updatedUser));
                    alert('Profile updated successfully!');
                }
            } catch (error) {
                console.error('Error saving user data:', error);
                alert('Error saving profile. Please try again.');
            }
        }
        setIsEditing(!isEditing);
    };
    
    const handleLogout = () => {
        // Clear all user data
        localStorage.removeItem('userData');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userType');
        localStorage.removeItem('isAdmin');
        
        // Redirect to home page
        window.location.href = '/';
    };

    // Personal info from form data
    const personalInfo = {
        name: formData.name || '',
        email: formData.email || '',
        phone: formData.phone || '',
        address: formData.address || ''
    };

    const renderPersonalInfo = () => (
        <motion.div
            key="personal"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
                <div className="flex items-center space-x-4">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center"
                    >
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </motion.div>
                    <div>
                        <h2 className="text-2xl font-bold">{formData.name || 'User'}</h2>
                        <p className="text-orange-100">{formData.email || 'No email'}</p>
                        <p className="text-orange-100">{formData.phone || 'No phone number'}</p>
                    </div>
                </div>
                <div className="mt-4 flex gap-3">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSaveChanges}
                        className="flex-1 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-white font-medium"
                    >
                        {isEditing ? 'Save Changes' : 'Edit Profile'}
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleLogout}
                        className="flex-1 bg-red-500/20 backdrop-blur-sm px-4 py-2 rounded-lg text-white font-medium"
                    >
                        Logout
                    </motion.button>
                </div>
            </div>

            {/* Personal Details */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            disabled={true}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
                        <textarea
                            value={formData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            disabled={!isEditing}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 resize-none"
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );

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

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="md:hidden bg-white shadow-sm border-b border-gray-200"
            >
                <div className="px-4 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
                        <Link
                            to="/"
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </motion.div>

            {/* Tab Navigation */}
            <div className="bg-white border-b border-gray-200">
                <div className="px-4">
                    <div className="flex space-x-1">
                        {tabs.map((tab) => (
                            <motion.button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 py-3 px-4 text-sm font-medium rounded-t-lg transition-all duration-200 ${
                                    activeTab === tab.id
                                        ? 'text-orange-600 bg-orange-50 border-b-2 border-orange-600'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="flex flex-col items-center space-y-1">
                                    {tab.icon}
                                    <span>{tab.name}</span>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <AnimatePresence mode="wait">
                    {activeTab === 'personal' && renderPersonalInfo()}
                </AnimatePresence>
            </div>

            {/* Bottom Navigation */}
            <BottomNavbar tabs={getBottomNavbarTabs()} />
        </div>
    );
};

export default ProfilePage;
