import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FaBars, 
    FaSearch, 
    FaBell, 
    FaUser, 
    FaSignOutAlt,
    FaChevronDown,
    FaCog
} from 'react-icons/fa';

const AdminHeader = ({ onToggleSidebar, sidebarOpen }) => {
    const [showSearch, setShowSearch] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('userType');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('adminEmail');
        navigate('/admin/login');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Implement search functionality
            console.log('Searching for:', searchQuery);
        }
    };

    const notifications = [
        { id: 1, title: 'New loan application', time: '2 min ago', unread: true },
        { id: 2, title: 'Legal service completed', time: '5 min ago', unread: true },
        { id: 3, title: 'User registration', time: '10 min ago', unread: false },
        { id: 4, title: 'System backup completed', time: '1 hour ago', unread: false }
    ];

    const unreadCount = notifications.filter(n => n.unread).length;

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
            <div className="px-4 lg:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Left side */}
                    <div className="flex items-center space-x-4">
                        {/* Mobile menu button */}
                        <button
                            onClick={onToggleSidebar}
                            className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 lg:hidden"
                        >
                            <FaBars className="w-5 h-5" />
                        </button>

                        {/* Desktop sidebar toggle */}
                        <button
                            onClick={onToggleSidebar}
                            className="hidden lg:flex p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        >
                            {sidebarOpen ? (
                                <FaBars className="w-5 h-5" />
                            ) : (
                                <FaBars className="w-5 h-5" />
                            )}
                        </button>

                        {/* Search */}
                        <div className="relative">
                            <AnimatePresence>
                                {showSearch ? (
                                    <motion.form
                                        initial={{ width: 0, opacity: 0 }}
                                        animate={{ width: 300, opacity: 1 }}
                                        exit={{ width: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        onSubmit={handleSearch}
                                        className="flex items-center"
                                    >
                                        <div className="relative">
                                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="Search admin panel..."
                                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent w-full"
                                                autoFocus
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setShowSearch(false)}
                                            className="ml-2 p-2 text-gray-400 hover:text-gray-600"
                                        >
                                            ×
                                        </button>
                                    </motion.form>
                                ) : (
                                    <button
                                        onClick={() => setShowSearch(true)}
                                        className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                    >
                                        <FaSearch className="w-5 h-5" />
                                    </button>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center space-x-4">
                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="relative p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                            >
                                <FaBell className="w-5 h-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* Notifications dropdown */}
                            <AnimatePresence>
                                {showNotifications && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50"
                                    >
                                        <div className="p-4 border-b border-gray-200">
                                            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {notifications.map((notification) => (
                                                <div
                                                    key={notification.id}
                                                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                                                        notification.unread ? 'bg-blue-50' : ''
                                                    }`}
                                                >
                                                    <div className="flex items-start space-x-3">
                                                        <div className={`w-2 h-2 rounded-full mt-2 ${
                                                            notification.unread ? 'bg-blue-500' : 'bg-gray-300'
                                                        }`} />
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {notification.title}
                                                            </p>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                {notification.time}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="p-4 border-t border-gray-200">
                                            <button className="w-full text-center text-sm text-orange-600 hover:text-orange-700 font-medium">
                                                View all notifications
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* User menu */}
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center space-x-3 p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                            >
                                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white text-sm font-medium">A</span>
                                </div>
                                <div className="hidden md:block text-left">
                                    <div className="text-sm font-medium text-gray-900">Admin User</div>
                                    <div className="text-xs text-gray-500">Super Admin</div>
                                </div>
                                <FaChevronDown className="w-3 h-3 text-gray-400" />
                            </button>

                            {/* User dropdown */}
                            <AnimatePresence>
                                {showUserMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 z-50"
                                    >
                                        <div className="p-4 border-b border-gray-200">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                                                    <span className="text-white font-medium">A</span>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">Admin User</div>
                                                    <div className="text-xs text-gray-500">admin@createbharat.com</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="py-2">
                                            <button onClick={() => { navigate('/admin/profile'); setShowUserMenu(false); }} className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                <FaUser className="w-4 h-4" />
                                                <span>Profile</span>
                                            </button>
                                            <button onClick={() => { navigate('/admin/settings'); setShowUserMenu(false); }} className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                <FaCog className="w-4 h-4" />
                                                <span>Settings</span>
                                            </button>
                                            <hr className="my-2" />
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                            >
                                                <FaSignOutAlt className="w-4 h-4" />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            {/* Click outside to close dropdowns */}
            {(showNotifications || showUserMenu) && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => {
                        setShowNotifications(false);
                        setShowUserMenu(false);
                    }}
                />
            )}
        </header>
    );
};

export default AdminHeader;
