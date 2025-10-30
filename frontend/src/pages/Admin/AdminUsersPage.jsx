import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUsers, FaSearch, FaFilter, FaEye, FaTrash, FaCheckCircle, FaTimesCircle, FaSpinner, FaPhone, FaEnvelope, FaMapMarkerAlt, FaUser, FaCalendarAlt, FaIdCard, FaBan, FaUnlock } from 'react-icons/fa';
import { adminAPI } from '../../utils/api';

const AdminUsersPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalUsers, setTotalUsers] = useState(0);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [loadingUserDetails, setLoadingUserDetails] = useState(false);

    // Fetch users from backend
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const token = localStorage.getItem('adminToken');
            if (!token) {
                throw new Error('Admin token not found. Please login again.');
            }

            const response = await adminAPI.getAllUsers(token, { limit: 100 });
            
            if (response.success && response.data) {
                // Transform backend data to frontend format
                const transformedUsers = response.data.map((user, index) => ({
                    id: user._id,
                    name: `${user.firstName} ${user.lastName}`,
                    email: user.email,
                    role: user.role || 'user',
                    status: user.isActive && !user.isBlocked ? 'active' : 'inactive',
                    joinDate: new Date(user.createdAt).toLocaleDateString('en-GB'),
                    lastActive: user.lastLogin 
                        ? formatLastActive(user.lastLogin)
                        : 'Never',
                    phone: user.phone,
                    phoneVerified: user.isPhoneVerified,
                    emailVerified: user.isEmailVerified,
                    formattedUserId: formatUserId(index)
                }));
                
                setUsers(transformedUsers);
                setTotalUsers(response.total || transformedUsers.length);
            }
        } catch (err) {
            console.error('Error fetching users:', err);
            setError(err.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    // Helper function to format last active time
    const formatLastActive = (date) => {
        const now = new Date();
        const lastActive = new Date(date);
        const diffInSeconds = Math.floor((now - lastActive) / 1000);
        
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
        return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    };

    // Helper function to format user ID (USR0001 format)
    const formatUserId = (index) => {
        const paddedNumber = String(index + 1).padStart(4, '0');
        return `USR${paddedNumber}`;
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const token = localStorage.getItem('adminToken');
                await adminAPI.deleteUser(token, userId);
                // Remove user from state
            setUsers(users.filter(user => user.id !== userId));
                setTotalUsers(totalUsers - 1);
                alert('User deleted successfully');
            } catch (err) {
                console.error('Error deleting user:', err);
                alert('Failed to delete user: ' + err.message);
            }
        }
    };

    const handleToggleStatus = async (userId) => {
        try {
            const token = localStorage.getItem('adminToken');
            await adminAPI.deactivateUser(token, userId);
            // Fetch users again to get updated status
            fetchUsers();
        } catch (err) {
            console.error('Error toggling user status:', err);
            alert('Failed to update user status: ' + err.message);
        }
    };

    const handleViewUser = async (userId) => {
        try {
            setLoadingUserDetails(true);
            const token = localStorage.getItem('adminToken');
            const response = await adminAPI.getUserById(token, userId);
            
            if (response.success && response.data) {
                // Find the user in our users list to get the formatted ID
                const userFromList = users.find(u => u.id === userId);
                const userWithFormattedId = {
                    ...response.data,
                    formattedUserId: userFromList?.formattedUserId || `USR${userId.slice(-4).toUpperCase()}`
                };
                setSelectedUser(userWithFormattedId);
                setShowViewModal(true);
            }
        } catch (err) {
            console.error('Error fetching user details:', err);
            alert('Failed to fetch user details: ' + err.message);
        } finally {
            setLoadingUserDetails(false);
        }
    };

    const handleBlockUser = async (userId) => {
        const user = users.find(u => u.id === userId);
        const action = user?.status === 'inactive' ? 'unblock' : 'block';
        const confirmMessage = `Are you sure you want to ${action} this user?`;
        
        if (window.confirm(confirmMessage)) {
            try {
                const token = localStorage.getItem('adminToken');
                await adminAPI.deactivateUser(token, userId);
                // Fetch users again to get updated status
                fetchUsers();
                alert(`User ${action}ed successfully`);
            } catch (err) {
                console.error('Error blocking/unblocking user:', err);
                alert(`Failed to ${action} user: ` + err.message);
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">User Management</h1>
                        <p className="text-gray-600 mt-1">Manage all platform users and their accounts</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <div className="text-sm text-gray-500">Total Users</div>
                            <div className="text-2xl font-bold text-orange-600">{totalUsers}</div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Search and Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
            >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search users by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <FaFilter className="text-gray-400 w-4 h-4" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            >
                                <option value="all">All Users</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Loading State */}
            {loading && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12">
                    <div className="flex flex-col items-center justify-center">
                        <FaSpinner className="w-12 h-12 text-orange-500 animate-spin mb-4" />
                        <div className="text-gray-600 text-lg">Loading users...</div>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                    <div className="flex items-center space-x-3">
                        <FaTimesCircle className="w-6 h-6 text-red-500" />
                        <div>
                            <div className="text-red-800 font-semibold">Error loading users</div>
                            <div className="text-red-600 text-sm">{error}</div>
                            <button
                                onClick={fetchUsers}
                                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Users Table */}
            {!loading && !error && (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Activity
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredUsers.map((user, index) => (
                                <motion.tr
                                    key={user.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                                                <span className="text-white text-sm font-medium">
                                                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {user.name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                user.role === 'mentor' 
                                                ? 'bg-purple-100 text-purple-800'
                                                    : user.role === 'company'
                                                    ? 'bg-green-100 text-green-800'
                                                : 'bg-blue-100 text-blue-800'
                                        }`}>
                                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => handleToggleStatus(user.id)}
                                            className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                                                user.status === 'active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            {user.status === 'active' ? (
                                                <FaCheckCircle className="w-3 h-3 mr-1" />
                                            ) : (
                                                <FaTimesCircle className="w-3 h-3 mr-1" />
                                            )}
                                            {user.status}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div>Last active: {user.lastActive}</div>
                                        <div className="text-xs">Joined: {user.joinDate}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center space-x-2">
                                                <button 
                                                    onClick={() => handleViewUser(user.id)}
                                                    className="text-blue-600 hover:text-blue-900 p-1" 
                                                    title="View Details"
                                                    disabled={loadingUserDetails}
                                                >
                                                    {loadingUserDetails ? (
                                                        <FaSpinner className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                <FaEye className="w-4 h-4" />
                                                    )}
                                            </button>
                                                <button 
                                                    onClick={() => handleBlockUser(user.id)}
                                                    className={`p-1 ${user.status === 'inactive' ? 'text-green-600 hover:text-green-900' : 'text-yellow-600 hover:text-yellow-900'}`}
                                                    title={user.status === 'inactive' ? 'Unblock User' : 'Block User'}
                                                >
                                                    {user.status === 'inactive' ? (
                                                        <FaUnlock className="w-4 h-4" />
                                                    ) : (
                                                        <FaBan className="w-4 h-4" />
                                                    )}
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteUser(user.id)}
                                                    className="text-red-600 hover:text-red-900 p-1" title="Delete User"
                                            >
                                                <FaTrash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* No Results */}
                    {filteredUsers.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <FaUsers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <div className="text-gray-500 text-lg">No users found</div>
                        <p className="text-gray-400 mt-2">Try adjusting your search or filters</p>
                    </div>
                )}
            </motion.div>
            )}

            {/* User Details Modal */}
            <AnimatePresence>
                {showViewModal && selectedUser && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            {/* Modal Header */}
                            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-t-2xl">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                                            <span className="text-2xl font-bold text-orange-600">
                                                {`${selectedUser.firstName?.[0] || ''}${selectedUser.lastName?.[0] || ''}`.toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-white">
                                                {`${selectedUser.firstName || ''} ${selectedUser.lastName || ''}`}
                                            </h2>
                                            <p className="text-orange-100">User Details</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowViewModal(false)}
                                        className="text-white hover:text-gray-200 transition-colors p-2"
                                    >
                                        <FaTimesCircle className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 space-y-6">
                                {/* Basic Information */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <FaUser className="w-5 h-5 mr-2 text-orange-500" />
                                        Basic Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="text-sm text-gray-500 mb-1">Email Address</div>
                                            <div className="flex items-center text-gray-900 font-medium">
                                                <FaEnvelope className="w-4 h-4 mr-2 text-orange-500" />
                                                {selectedUser.email || 'N/A'}
                                            </div>
                                            {selectedUser.isEmailVerified && (
                                                <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    <FaCheckCircle className="w-3 h-3 mr-1" />
                                                    Verified
                                                </span>
                                            )}
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="text-sm text-gray-500 mb-1">Phone Number</div>
                                            <div className="flex items-center text-gray-900 font-medium">
                                                <FaPhone className="w-4 h-4 mr-2 text-orange-500" />
                                                {selectedUser.phone || 'N/A'}
                                            </div>
                                            {selectedUser.isPhoneVerified && (
                                                <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    <FaCheckCircle className="w-3 h-3 mr-1" />
                                                    Verified
                                                </span>
                                            )}
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="text-sm text-gray-500 mb-1">Username</div>
                                            <div className="text-gray-900 font-medium">
                                                {selectedUser.username || 'N/A'}
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="text-sm text-gray-500 mb-1">Gender</div>
                                            <div className="text-gray-900 font-medium capitalize">
                                                {selectedUser.gender || 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Role & Status */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <FaIdCard className="w-5 h-5 mr-2 text-orange-500" />
                                        Role & Status
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="text-sm text-gray-500 mb-1">Role</div>
                                            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                                                selectedUser.role === 'mentor' 
                                                    ? 'bg-purple-100 text-purple-800'
                                                    : selectedUser.role === 'company'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-blue-100 text-blue-800'
                                            }`}>
                                                {selectedUser.role?.charAt(0).toUpperCase() + selectedUser.role?.slice(1) || 'User'}
                                            </span>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="text-sm text-gray-500 mb-1">User Type</div>
                                            <div className="text-gray-900 font-medium capitalize">
                                                {selectedUser.userType || 'N/A'}
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="text-sm text-gray-500 mb-1">Account Status</div>
                                            <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${
                                                selectedUser.isActive && !selectedUser.isBlocked
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {selectedUser.isActive && !selectedUser.isBlocked ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="text-sm text-gray-500 mb-1">Blocked Status</div>
                                            <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${
                                                selectedUser.isBlocked
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-green-100 text-green-800'
                                            }`}>
                                                {selectedUser.isBlocked ? 'Blocked' : 'Not Blocked'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Joined Date */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <FaCalendarAlt className="w-5 h-5 mr-2 text-orange-500" />
                                        Registration Information
                                    </h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="text-sm text-gray-500 mb-1">Joined Date</div>
                                        <div className="text-gray-900 font-medium">
                                            {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString('en-GB', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            }) : 'N/A'}
                                        </div>
                                    </div>
                                </div>

                                {/* Address Information */}
                                {selectedUser.address && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                            <FaMapMarkerAlt className="w-5 h-5 mr-2 text-orange-500" />
                                            Address Information
                                        </h3>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="text-sm text-gray-500 mb-1">Address</div>
                                            <div className="text-gray-900 font-medium">
                                                {[
                                                    selectedUser.address.street,
                                                    selectedUser.address.city,
                                                    selectedUser.address.state,
                                                    selectedUser.address.pincode,
                                                    selectedUser.address.country
                                                ].filter(Boolean).join(', ') || 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* User ID */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="text-sm text-gray-500 mb-1">User ID</div>
                                    <div className="text-lg font-bold text-gray-900">
                                        {selectedUser.formattedUserId || 'N/A'}
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowViewModal(false)}
                                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminUsersPage;
