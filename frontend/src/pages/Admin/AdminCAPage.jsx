import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FaBalanceScale, 
    FaPlus, 
    FaTimes, 
    FaEye, 
    FaTrash,
    FaEdit,
    FaUser,
    FaRupeeSign,
    FaCalendar
} from 'react-icons/fa';
import { adminCAAPI } from '../../utils/api';

const AdminCAPage = () => {
    const [showRegisterForm, setShowRegisterForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        caNumber: '',
        phone: '',
        experience: '',
        specialization: '',
        firmName: ''
    });

    // CA data - only one CA can exist
    const [ca, setCa] = useState(null);

    // Payment history state
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [isPaymentHistoryLoading, setIsPaymentHistoryLoading] = useState(false);
    const [paymentHistoryError, setPaymentHistoryError] = useState('');
    const [totalRevenue, setTotalRevenue] = useState(0);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Fetch CA data and payment history on mount
    useEffect(() => {
        fetchCA();
        fetchPaymentHistory();
    }, []);

    const fetchCA = async () => {
        setIsFetching(true);
        setError('');
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                setError('Admin token not found');
                setIsFetching(false);
                return;
            }
            const response = await adminCAAPI.getCA(token);
            if (response.success && response.data.ca) {
                setCa(response.data.ca);
            } else {
                setCa(null); // No CA registered yet
            }
        } catch (err) {
            console.error('Error fetching CA:', err);
            setCa(null); // No CA registered yet
        } finally {
            setIsFetching(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                setError('Admin token not found');
                setIsLoading(false);
                return;
            }
            const response = await adminCAAPI.register(token, formData);
            if (response.success) {
                setCa(response.data.ca);
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    caNumber: '',
                    phone: '',
                    experience: '',
                    specialization: '',
                    firmName: ''
                });
                setShowRegisterForm(false);
                alert('CA registered successfully!');
            } else {
                setError(response.message || 'Failed to register CA');
            }
        } catch (err) {
            console.error('Error registering CA:', err);
            setError(err.message || 'Failed to register CA. Only one CA can exist at a time.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = () => {
        if (ca) {
            setFormData({
                name: ca.name || '',
                email: ca.email || '',
                password: '', // Don't populate password
                caNumber: ca.caNumber || '',
                phone: ca.phone || '',
                experience: ca.experience || '',
                specialization: ca.specialization || '',
                firmName: ca.firmName || ''
            });
            setShowEditForm(true);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                setError('Admin token not found');
                setIsLoading(false);
                return;
            }
            // Only send fields that are being updated (exclude empty password)
            const updateData = { ...formData };
            if (!updateData.password) {
                delete updateData.password;
            }
            const response = await adminCAAPI.updateCA(token, updateData);
            if (response.success) {
                setCa(response.data.ca);
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    caNumber: '',
                    phone: '',
                    experience: '',
                    specialization: '',
                    firmName: ''
                });
                setShowEditForm(false);
                alert('CA updated successfully!');
            } else {
                setError(response.message || 'Failed to update CA');
            }
        } catch (err) {
            console.error('Error updating CA:', err);
            setError(err.message || 'Failed to update CA');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchPaymentHistory = async () => {
        setIsPaymentHistoryLoading(true);
        setPaymentHistoryError('');
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                setPaymentHistoryError('Admin token not found');
                setIsPaymentHistoryLoading(false);
                return;
            }
            const response = await adminCAAPI.getPaymentHistory(token);
            if (response.success && response.data) {
                // Transform backend data to match frontend format
                const transformedHistory = response.data.map(payment => ({
                    id: payment.id,
                    userName: payment.userName || 'User',
                    userEmail: payment.userEmail || '',
                    userPhone: payment.userPhone || '',
                    serviceType: payment.serviceName || 'Legal Service',
                    serviceIcon: payment.serviceIcon || '⚖️',
                    serviceCategory: payment.serviceCategory || '',
                    amount: payment.paymentAmount || 0,
                    paymentMethod: payment.paymentMethod || 'razorpay',
                    transactionId: payment.transactionId || payment.razorpayPaymentId || '',
                    razorpayOrderId: payment.razorpayOrderId || '',
                    razorpayPaymentId: payment.razorpayPaymentId || '',
                    paymentDate: payment.paidAt
                        ? new Date(payment.paidAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })
                        : 'N/A',
                    completedDate: payment.completedAt
                        ? new Date(payment.completedAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })
                        : 'N/A',
                    submittedDate: payment.submittedAt
                        ? new Date(payment.submittedAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })
                        : 'N/A'
                }));
                setPaymentHistory(transformedHistory);
                setTotalRevenue(response.totalRevenue || 0);
            } else {
                setPaymentHistory([]);
                setTotalRevenue(0);
            }
        } catch (err) {
            console.error('Error fetching payment history:', err);
            setPaymentHistoryError(err.message || 'Failed to fetch payment history');
            setPaymentHistory([]);
            setTotalRevenue(0);
        } finally {
            setIsPaymentHistoryLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this CA? You will be able to register a new CA after deletion.')) {
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                setError('Admin token not found');
                setIsLoading(false);
                return;
            }
            const response = await adminCAAPI.deleteCA(token);
            if (response.success) {
                setCa(null);
                alert('CA deleted successfully! You can now register a new CA.');
            } else {
                setError(response.message || 'Failed to delete CA');
            }
        } catch (err) {
            console.error('Error deleting CA:', err);
            setError(err.message || 'Failed to delete CA');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                            <FaBalanceScale className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">CA Management</h1>
                            <p className="text-sm text-gray-600">Manage Chartered Accountants</p>
                        </div>
                    </div>
                    {!ca ? (
                        <button
                            onClick={() => setShowRegisterForm(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <FaPlus className="w-4 h-4" />
                            Register CA
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={handleEdit}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <FaEdit className="w-4 h-4" />
                                Update CA
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isLoading}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                <FaTrash className="w-4 h-4" />
                                Delete CA
                            </button>
                        </div>
                    )}
                </motion.div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Register Form Modal */}
                <AnimatePresence>
                    {showRegisterForm && !ca && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                                onClick={() => setShowRegisterForm(false)}
                            >
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.9, opacity: 0 }}
                                    className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl">
                                        <h2 className="text-2xl font-bold text-gray-900">Register New CA</h2>
                                        <button
                                            onClick={() => setShowRegisterForm(false)}
                                            className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                        >
                                            <FaTimes className="w-4 h-4 text-gray-600" />
                                        </button>
                                    </div>
                                    <form onSubmit={handleRegister} className="p-6 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">CA Number *</label>
                                                <input
                                                    type="text"
                                                    name="caNumber"
                                                    value={formData.caNumber}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Experience *</label>
                                                <input
                                                    type="text"
                                                    name="experience"
                                                    value={formData.experience}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="e.g., 10 years"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Specialization *</label>
                                                <input
                                                    type="text"
                                                    name="specialization"
                                                    value={formData.specialization}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="e.g., GST, Income Tax"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Firm Name *</label>
                                                <input
                                                    type="text"
                                                    name="firmName"
                                                    value={formData.firmName}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-3 pt-4">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowRegisterForm(false);
                                                    setError('');
                                                }}
                                                disabled={isLoading}
                                                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                                            >
                                                {isLoading ? 'Registering...' : 'Register CA'}
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Edit Form Modal */}
                <AnimatePresence>
                    {showEditForm && ca && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                                onClick={() => {
                                    setShowEditForm(false);
                                    setError('');
                                }}
                            >
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.9, opacity: 0 }}
                                    className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl">
                                        <h2 className="text-2xl font-bold text-gray-900">Update CA</h2>
                                        <button
                                            onClick={() => {
                                                setShowEditForm(false);
                                                setError('');
                                            }}
                                            className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                        >
                                            <FaTimes className="w-4 h-4 text-gray-600" />
                                        </button>
                                    </div>
                                    <form onSubmit={handleUpdate} className="p-6 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Password (leave blank to keep current)</label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">CA Number *</label>
                                                <input
                                                    type="text"
                                                    name="caNumber"
                                                    value={formData.caNumber}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Experience *</label>
                                                <input
                                                    type="text"
                                                    name="experience"
                                                    value={formData.experience}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="e.g., 10 years"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Specialization *</label>
                                                <input
                                                    type="text"
                                                    name="specialization"
                                                    value={formData.specialization}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="e.g., GST, Income Tax"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Firm Name *</label>
                                                <input
                                                    type="text"
                                                    name="firmName"
                                                    value={formData.firmName}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-3 pt-4">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowEditForm(false);
                                                    setError('');
                                                }}
                                                disabled={isLoading}
                                                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                                            >
                                                {isLoading ? 'Updating...' : 'Update CA'}
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* CA Display */}
                <div className="space-y-4 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Registered CA</h2>
                    {isFetching ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                            <p className="text-gray-600">Loading...</p>
                        </div>
                    ) : ca ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <FaBalanceScale className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-900">{ca.name}</h3>
                                        <p className="text-sm text-gray-600">{ca.email}</p>
                                        <div className="flex flex-wrap gap-3 mt-3">
                                            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                                                {ca.caNumber}
                                            </span>
                                            <span className="text-xs bg-gray-50 text-gray-700 px-2 py-1 rounded-full">
                                                {ca.phone}
                                            </span>
                                            <span className={`text-xs px-2 py-1 rounded-full ${ca.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                                {ca.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <div className="mt-2 space-y-1">
                                            <p className="text-sm text-gray-700"><strong>Experience:</strong> {ca.experience}</p>
                                            <p className="text-sm text-gray-700"><strong>Specialization:</strong> {ca.specialization}</p>
                                            <p className="text-sm text-gray-700"><strong>Firm:</strong> {ca.firmName}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                            <p className="text-gray-600">No CA registered yet. Click "Register CA" to add one.</p>
                        </div>
                    )}
                </div>

                {/* Payment History Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Payment History</h2>
                        {totalRevenue > 0 && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                                <span className="text-sm text-gray-600">Total Revenue:</span>
                                <span className="text-lg font-bold text-green-600 flex items-center gap-1">
                                    <FaRupeeSign />{totalRevenue.toLocaleString('en-IN')}
                                </span>
                            </div>
                        )}
                    </div>
                    
                    {paymentHistoryError && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {paymentHistoryError}
                        </div>
                    )}

                    {isPaymentHistoryLoading ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                            <p className="text-gray-600">Loading payment history...</p>
                        </div>
                    ) : paymentHistory.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                            <p className="text-gray-600">No payment history available. Payments will appear here once users complete legal services.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {paymentHistory.map((payment) => (
                                <motion.div
                                    key={payment.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className="text-2xl flex-shrink-0">
                                            {payment.serviceIcon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-bold text-gray-900 truncate">{payment.userName}</h3>
                                            <p className="text-xs text-gray-600 truncate">{payment.userEmail}</p>
                                            {payment.userPhone && (
                                                <p className="text-xs text-gray-500 truncate">{payment.userPhone}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-600">Service</span>
                                            <span className="text-xs font-semibold text-gray-900">{payment.serviceType}</span>
                                        </div>
                                        {payment.serviceCategory && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-gray-600">Category</span>
                                                <span className="text-xs text-gray-700 bg-blue-50 px-2 py-0.5 rounded-full">{payment.serviceCategory}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-600">Amount</span>
                                            <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                                                <FaRupeeSign />{payment.amount.toLocaleString('en-IN')}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-600">Payment Date</span>
                                            <span className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                                                <FaCalendar className="w-3 h-3" />
                                                {payment.paymentDate}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-600">Completed</span>
                                            <span className="text-xs text-gray-700">{payment.completedDate}</span>
                                        </div>
                                        {payment.transactionId && (
                                            <div className="mt-2 pt-2 border-t border-gray-100">
                                                <p className="text-xs text-gray-500 truncate">
                                                    <span className="font-medium">Txn ID:</span> {payment.transactionId}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminCAPage;

