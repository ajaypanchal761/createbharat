import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaUserPlus, FaSearch, FaFilter, FaEye, FaEdit, FaTrash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const AdminUsersPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showCreateModal, setShowCreateModal] = useState(false);

    const [users, setUsers] = useState([
        {
            id: 1,
            name: 'Rajesh Kumar',
            email: 'rajesh@example.com',
            role: 'User',
            status: 'active',
            joinDate: '2024-01-15',
            lastActive: '2 hours ago',
            totalLoans: 2,
            totalServices: 1
        },
        {
            id: 2,
            name: 'Priya Sharma',
            email: 'priya@example.com',
            role: 'User',
            status: 'active',
            joinDate: '2024-01-20',
            lastActive: '1 day ago',
            totalLoans: 1,
            totalServices: 3
        },
        {
            id: 3,
            name: 'Amit Singh',
            email: 'amit@example.com',
            role: 'User',
            status: 'inactive',
            joinDate: '2024-01-10',
            lastActive: '1 week ago',
            totalLoans: 0,
            totalServices: 2
        },
        {
            id: 4,
            name: 'Sneha Patel',
            email: 'sneha@example.com',
            role: 'Mentor',
            status: 'active',
            joinDate: '2024-01-05',
            lastActive: '30 minutes ago',
            totalLoans: 0,
            totalServices: 0
        }
    ]);

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const handleDeleteUser = (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            setUsers(users.filter(user => user.id !== userId));
        }
    };

    const handleToggleStatus = (userId) => {
        setUsers(users.map(user => 
            user.id === userId 
                ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
                : user
        ));
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
                            <div className="text-2xl font-bold text-orange-600">{users.length}</div>
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
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowCreateModal(true)}
                            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold shadow-lg flex items-center space-x-2"
                        >
                            <FaUserPlus className="w-4 h-4" />
                            <span>Add User</span>
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* Users Table */}
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
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                                                <span className="text-white text-sm font-medium">
                                                    {user.name.split(' ').map(n => n[0]).join('')}
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
                                            user.role === 'Mentor' 
                                                ? 'bg-purple-100 text-purple-800'
                                                : 'bg-blue-100 text-blue-800'
                                        }`}>
                                            {user.role}
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
                                            <button className="text-blue-600 hover:text-blue-900 p-1">
                                                <FaEye className="w-4 h-4" />
                                            </button>
                                            <button className="text-orange-600 hover:text-orange-900 p-1">
                                                <FaEdit className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="text-red-600 hover:text-red-900 p-1"
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
                {filteredUsers.length === 0 && (
                    <div className="text-center py-12">
                        <FaUsers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <div className="text-gray-500 text-lg">No users found</div>
                        <p className="text-gray-400 mt-2">Try adjusting your search or filters</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default AdminUsersPage;
