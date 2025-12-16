import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FaBars, 
    FaSearch, 
    FaBell, 
    FaUser, 
    FaSignOutAlt,
    FaChevronDown,
    FaCog,
    FaTimes
} from 'react-icons/fa';
import { adminNotificationsAPI } from '../../utils/api';

const AdminHeader = ({ onToggleSidebar, sidebarOpen }) => {
    const [showSearch, setShowSearch] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loadingNotifications, setLoadingNotifications] = useState(false);
    const navigate = useNavigate();
    const intervalRef = useRef(null);

    // Fetch notifications from API
    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token || token === 'null' || token === 'undefined') {
                return;
            }

            setLoadingNotifications(true);
            const cleanToken = token.trim().replace(/^["']|["']$/g, '');
            const response = await adminNotificationsAPI.getNotifications(cleanToken, { limit: 20 });
            
            if (response.success) {
                setNotifications(response.data || []);
                setUnreadCount(response.unreadCount || 0);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
            // Don't show error to user, just silently fail
        } finally {
            setLoadingNotifications(false);
        }
    };

    // Mark notification as read
    const handleMarkAsRead = async (notificationId, e) => {
        e.stopPropagation();
        try {
            const token = localStorage.getItem('adminToken');
            if (!token || token === 'null' || token === 'undefined') {
                return;
            }

            const cleanToken = token.trim().replace(/^["']|["']$/g, '');
            await adminNotificationsAPI.markAsRead(cleanToken, notificationId);
            
            // Update local state
            setNotifications(prev => 
                prev.map(n => 
                    n._id === notificationId 
                        ? { ...n, isRead: true } 
                        : n
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    // Mark all notifications as read
    const handleMarkAllAsRead = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token || token === 'null' || token === 'undefined') {
                return;
            }

            const cleanToken = token.trim().replace(/^["']|["']$/g, '');
            await adminNotificationsAPI.markAllAsRead(cleanToken);
            
            // Update local state
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    // Handle notification click
    const handleNotificationClick = (notification) => {
        if (!notification.isRead) {
            handleMarkAsRead(notification._id, { stopPropagation: () => {} });
        }
        
        if (notification.link) {
            navigate(notification.link);
            setShowNotifications(false);
        }
    };

    // Format time ago
    const formatTimeAgo = (dateString) => {
        if (!dateString) return 'Just now';
        
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hour${Math.floor(diffInSeconds / 3600) > 1 ? 's' : ''} ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} day${Math.floor(diffInSeconds / 86400) > 1 ? 's' : ''} ago`;
        return date.toLocaleDateString();
    };

    // Auto-refresh notifications every 10 seconds
    useEffect(() => {
        // Fetch immediately
        fetchNotifications();

        // Set up interval for auto-refresh
        intervalRef.current = setInterval(() => {
            fetchNotifications();
        }, 10000); // 10 seconds

        // Cleanup interval on unmount
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    const handleLogout = () => {
        // Clear interval on logout
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        localStorage.removeItem('userType');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('adminEmail');
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Implement search functionality
            console.log('Searching for:', searchQuery);
        }
    };

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

                        {/* CreateBharat Logo - Mobile */}
                        <div className="lg:hidden flex items-center space-x-2">
                            <img src="/logo.png" alt="CreateBharat Logo" className="w-8 h-8 object-contain flex-shrink-0" />
                            <span className="text-base font-bold text-gray-900">CreateBharat</span>
                        </div>

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
                                        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                                            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                                            {unreadCount > 0 && (
                                                <button
                                                    onClick={handleMarkAllAsRead}
                                                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                                >
                                                    Mark all as read
                                                </button>
                                            )}
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {loadingNotifications ? (
                                                <div className="flex items-center justify-center py-8">
                                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
                                                </div>
                                            ) : notifications.length === 0 ? (
                                                <div className="p-8 text-center">
                                                    <FaBell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                                    <p className="text-sm text-gray-500">No notifications yet</p>
                                                </div>
                                            ) : (
                                                notifications.map((notification) => (
                                                    <div
                                                        key={notification._id || notification.id}
                                                        onClick={() => handleNotificationClick(notification)}
                                                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                                                            !notification.isRead ? 'bg-blue-50' : ''
                                                        }`}
                                                    >
                                                        <div className="flex items-start space-x-3">
                                                            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                                                !notification.isRead ? 'bg-blue-500' : 'bg-gray-300'
                                                            }`} />
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium text-gray-900">
                                                                    {notification.title}
                                                                </p>
                                                                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                                                    {notification.message}
                                                                </p>
                                                                <p className="text-xs text-gray-500 mt-1">
                                                                    {formatTimeAgo(notification.createdAt)}
                                                                </p>
                                                            </div>
                                                            {!notification.isRead && (
                                                                <button
                                                                    onClick={(e) => handleMarkAsRead(notification._id || notification.id, e)}
                                                                    className="ml-2 p-1 text-gray-400 hover:text-gray-600 flex-shrink-0"
                                                                    title="Mark as read"
                                                                >
                                                                    <FaTimes className="w-3 h-3" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                        {notifications.length > 0 && (
                                            <div className="p-4 border-t border-gray-200">
                                                <button 
                                                    onClick={() => {
                                                        setShowNotifications(false);
                                                        navigate('/admin/notifications');
                                                    }}
                                                    className="w-full text-center text-sm text-orange-600 hover:text-orange-700 font-medium"
                                                >
                                                    View all notifications
                                                </button>
                                            </div>
                                        )}
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
