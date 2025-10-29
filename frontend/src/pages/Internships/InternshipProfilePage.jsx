import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNavbar from '../../components/common/BottomNavbar';
import { authAPI, applicationAPI } from '../../utils/api';

// Bottom Nav Icons
const HomeIcon = ({ active }) => (<svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>);
const BriefcaseIcon = ({ active }) => (<svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>);
const SearchIcon = ({ active }) => (<svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>);
const HeartIcon = ({ active }) => (<svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>);
const ClipboardIcon = ({ active }) => (<svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>);
const UserIcon = ({ active }) => (<svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>);

const InternshipProfilePage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('personal');
    const [isEditing, setIsEditing] = useState(false);
    const [personalInfo, setPersonalInfo] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        education: '',
        skills: [],
        experience: '',
        preferredLocation: '',
        preferredDomain: ''
    });
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUserData = async () => {
            try {
                setIsLoading(true);
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                // Load user profile
                const userResponse = await authAPI.getMe(token);
                if (userResponse.success && userResponse.data.user) {
                    const user = userResponse.data.user;
                    setPersonalInfo({
                        name: user.name || '',
                        email: user.email || '',
                        phone: user.phone || '',
                        address: user.address || '',
                        education: user.education || '',
                        skills: user.skills || [],
                        experience: user.experience || '',
                        preferredLocation: user.preferredLocation || '',
                        preferredDomain: user.preferredDomain || ''
                    });
                }

                // Load applications
                const appsResponse = await applicationAPI.getMyApplications(token, { limit: 10 });
                if (appsResponse.success && appsResponse.data.applications) {
                    const mappedApps = appsResponse.data.applications.map(app => ({
                        id: app._id,
                        company: app.internship?.companyName || app.internship?.company?.companyName || 'Company',
                        position: app.internship?.title || 'Position',
                        status: app.status === 'shortlisted' ? 'Under Review' :
                            app.status === 'hired' ? 'Accepted' :
                                app.status.charAt(0).toUpperCase() + app.status.slice(1),
                        date: app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : new Date().toLocaleDateString()
                    }));
                    setApplications(mappedApps);
                }
            } catch (error) {
                console.error('Error loading user data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadUserData();
    }, [navigate]);

    // Internship-specific bottom navbar
    const getBottomNavbarTabs = () => {
        return [
            { name: 'Home', path: '/', icon: <HomeIcon /> },
            { name: 'Search', path: '/internships', icon: <SearchIcon /> },
            { name: 'Saved', path: '/internships/saved', icon: <HeartIcon /> },
            { name: 'Applied', path: '/internships/applied', icon: <ClipboardIcon /> },
            { name: 'Profile', path: '/internships/profile', icon: <UserIcon /> }
        ];
    };

    const tabs = [
        { id: 'personal', name: 'Personal', icon: <UserIcon /> },
        { id: 'applications', name: 'Applications', icon: <ClipboardIcon /> },
        { id: 'preferences', name: 'Preferences', icon: <HeartIcon /> }
    ];

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
                        <h2 className="text-2xl font-bold">{personalInfo.name}</h2>
                        <p className="text-orange-100">{personalInfo.email}</p>
                        <p className="text-orange-100">{personalInfo.phone}</p>
                    </div>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditing(!isEditing)}
                    className="mt-4 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-white font-medium"
                >
                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                </motion.button>
            </div>

            {/* Personal Details */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                        <input
                            type="text"
                            value={personalInfo.name}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                        <input
                            type="email"
                            value={personalInfo.email}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                        <input
                            type="tel"
                            value={personalInfo.phone}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
                        <textarea
                            value={personalInfo.address}
                            disabled={!isEditing}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 resize-none"
                        />
                    </div>
                </div>
            </div>

            {/* Professional Details */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Professional Information</h3>
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Education</label>
                        <input
                            type="text"
                            value={personalInfo.education}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Experience</label>
                        <input
                            type="text"
                            value={personalInfo.experience}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Skills</label>
                        <div className="flex flex-wrap gap-2">
                            {personalInfo.skills.map((skill, index) => (
                                <span key={index} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    const renderApplications = () => (
        <motion.div
            key="applications"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
        >
            <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">My Applications</h3>
                <div className="space-y-4">
                    {applications.map((app) => (
                        <motion.div
                            key={app.id}
                            whileHover={{ scale: 1.02 }}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-semibold text-gray-900">{app.position}</h4>
                                    <p className="text-gray-600">{app.company}</p>
                                    <p className="text-sm text-gray-500">Applied on: {app.date}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${app.status === 'Applied' ? 'bg-orange-100 text-orange-800' :
                                        app.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' :
                                            app.status === 'Interview Scheduled' ? 'bg-green-100 text-green-800' :
                                                'bg-gray-100 text-gray-800'
                                    }`}>
                                    {app.status}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );

    const renderPreferences = () => (
        <motion.div
            key="preferences"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
        >
            <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Job Preferences</h3>
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Preferred Location</label>
                        <input
                            type="text"
                            value={personalInfo.preferredLocation}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Preferred Domain</label>
                        <input
                            type="text"
                            value={personalInfo.preferredDomain}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );

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
                        <h1 className="text-2xl font-bold text-gray-800">Internship Profile</h1>
                        <Link
                            to="/internships"
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
                                className={`flex-1 py-3 px-4 text-sm font-medium rounded-t-lg transition-all duration-200 ${activeTab === tab.id
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
                    {activeTab === 'applications' && renderApplications()}
                    {activeTab === 'preferences' && renderPreferences()}
                </AnimatePresence>
            </div>

            {/* Bottom Navigation */}
            <BottomNavbar tabs={getBottomNavbarTabs()} />
        </div>
    );
};

export default InternshipProfilePage;
