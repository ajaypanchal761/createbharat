import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

// 3D SVG Icons with enhanced styling
const HomeIcon = ({ active }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500 drop-shadow-lg' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ filter: active ? 'drop-shadow(0 4px 8px rgba(251, 146, 60, 0.3))' : 'none' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

const BriefcaseIcon = ({ active }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500 drop-shadow-lg' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ filter: active ? 'drop-shadow(0 4px 8px rgba(251, 146, 60, 0.3))' : 'none' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const ChatIcon = ({ active }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500 drop-shadow-lg' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ filter: active ? 'drop-shadow(0 4px 8px rgba(251, 146, 60, 0.3))' : 'none' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

const PlusIcon = ({ active }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500 drop-shadow-lg' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ filter: active ? 'drop-shadow(0 4px 8px rgba(251, 146, 60, 0.3))' : 'none' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
    </svg>
);

const UserIcon = ({ active }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500 drop-shadow-lg' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ filter: active ? 'drop-shadow(0 4px 8px rgba(251, 146, 60, 0.3))' : 'none' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const SearchIcon = ({ active }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500 drop-shadow-lg' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ filter: active ? 'drop-shadow(0 4px 8px rgba(251, 146, 60, 0.3))' : 'none' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const HeartIcon = ({ active }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500 drop-shadow-lg' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ filter: active ? 'drop-shadow(0 4px 8px rgba(251, 146, 60, 0.3))' : 'none' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
);

const ClipboardIcon = ({ active }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500 drop-shadow-lg' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ filter: active ? 'drop-shadow(0 4px 8px rgba(251, 146, 60, 0.3))' : 'none' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
);

const DocumentIcon = ({ active }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500 drop-shadow-lg' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ filter: active ? 'drop-shadow(0 4px 8px rgba(251, 146, 60, 0.3))' : 'none' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const BarChartIcon = ({ active }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500 drop-shadow-lg' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ filter: active ? 'drop-shadow(0 4px 8px rgba(251, 146, 60, 0.3))' : 'none' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const BottomNavbar = ({ tabs = [] }) => {
    const location = useLocation();

    const defaultTabs = [
        { name: 'Home', path: '/', icon: <HomeIcon /> },
        { name: 'Jobs', path: '/internships', icon: <BriefcaseIcon /> },
        { name: 'Legal', path: '/legal', icon: <ChatIcon /> },
        { name: 'Mentors', path: '/mentors', icon: <UserIcon /> },
        { name: 'Profile', path: '/profile', icon: <UserIcon /> }
    ];

    const navTabs = tabs.length > 0 ? tabs : defaultTabs;

    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 z-50 md:hidden shadow-2xl"
            style={{
                boxShadow: '0 -10px 25px -5px rgba(0, 0, 0, 0.1), 0 -10px 10px -5px rgba(0, 0, 0, 0.04)',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)'
            }}
        >
            <div className="flex items-center justify-around py-3 px-2">
                {navTabs.map((tab, index) => {
                    const isActive = location.pathname === tab.path;
                    
                    return (
                        <motion.button
                            key={tab.name}
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-300 ${
                                isActive 
                                    ? 'bg-gradient-to-b from-orange-50 to-orange-100 shadow-lg' 
                                    : 'hover:bg-gray-50'
                            }`}
                            style={{
                                transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
                                boxShadow: isActive 
                                    ? '0 8px 25px -5px rgba(251, 146, 60, 0.3), 0 4px 10px -5px rgba(251, 146, 60, 0.2)' 
                                    : '0 2px 4px rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            <Link
                                to={tab.path}
                                className={`flex flex-col items-center space-y-1 ${
                                    isActive 
                                        ? 'text-orange-500' 
                                        : 'text-gray-600 hover:text-orange-500'
                                }`}
                            >
                                <motion.div
                                    animate={isActive ? { 
                                        scale: [1, 1.2, 1],
                                        rotateY: [0, 10, 0]
                                    } : {}}
                                    transition={{ duration: 0.4, ease: "easeInOut" }}
                                    style={{
                                        transformStyle: 'preserve-3d',
                                        perspective: '1000px'
                                    }}
                                >
                                    {React.cloneElement(tab.icon, { active: isActive })}
                                </motion.div>
                                <span className={`text-xs font-semibold transition-all duration-300 ${
                                    isActive 
                                        ? 'text-orange-500 scale-105' 
                                        : 'text-gray-600'
                                }`}>
                                    {tab.name}
                                </span>
                            </Link>
                        </motion.button>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default BottomNavbar;
