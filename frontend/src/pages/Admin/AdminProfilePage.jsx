import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaShieldAlt, FaCalendarAlt } from 'react-icons/fa';
import { adminAPI } from '../../utils/api';

const AdminProfilePage = () => {
    const [adminData, setAdminData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                if (!token) {
                    setLoading(false);
                    return;
                }
                const response = await adminAPI.getMe(token);
                if (response.success) {
                    setAdminData(response.data.admin);
                }
            } catch (error) {
                console.error('Error fetching admin data:', error);
                // Fallback to localStorage if API fails
                const adminDataString = localStorage.getItem('adminData');
                if (adminDataString) {
                    const data = JSON.parse(adminDataString);
                    setAdminData(data);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchAdminData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    if (!adminData) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">Admin data not found</p>
            </div>
        );
    }

    const profileInfo = [
        { icon: FaUser, label: 'Name', value: adminData.fullName || adminData.name || adminData.username || 'Admin User' },
        { icon: FaEnvelope, label: 'Email', value: adminData.email || 'admin@createbharat.com' },
        { icon: FaShieldAlt, label: 'Role', value: adminData.role || 'Super Admin' },
        { icon: FaCalendarAlt, label: 'Account Created', value: adminData.createdAt ? new Date(adminData.createdAt).toLocaleDateString() : 'N/A' }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
            >
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Profile</h1>
                <p className="text-gray-600">View your admin account information</p>
            </motion.div>

            {/* Profile Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
            >
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
                    {/* Avatar */}
                    <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-4xl font-bold">
                            {(adminData.fullName || adminData.name || adminData.username || 'A').charAt(0).toUpperCase()}
                        </span>
                    </div>

                    {/* Basic Info */}
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">
                            {adminData.fullName || adminData.name || adminData.username || 'Admin User'}
                        </h2>
                        <p className="text-gray-600 mb-2">
                            {adminData.email || 'admin@createbharat.com'}
                        </p>
                        <div className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold">
                            {adminData.role || 'Super Admin'}
                        </div>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profileInfo.map((info, index) => {
                        const Icon = info.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + (index * 0.1) }}
                                className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600 mb-1">{info.label}</div>
                                    <div className="text-lg font-semibold text-gray-900">{info.value}</div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>

            {/* Additional Info */}
            {adminData.lastLogin && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-blue-50 border border-blue-200 rounded-xl p-4"
                >
                    <div className="flex items-center space-x-3">
                        <FaCalendarAlt className="text-blue-600 w-5 h-5" />
                        <div>
                            <div className="text-sm font-semibold text-blue-900">Last Login</div>
                            <div className="text-sm text-blue-700">
                                {new Date(adminData.lastLogin).toLocaleString()}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default AdminProfilePage;

