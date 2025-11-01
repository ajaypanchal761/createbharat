import React, { useState, useEffect, useCallback } from 'react';
import { FaSpinner, FaCheckCircle, FaClock, FaExclamationTriangle, FaCreditCard, FaGraduationCap, FaUserTie, FaBalanceScale } from 'react-icons/fa';
import { adminPaymentsAPI } from '../../utils/api';

const AdminPaymentsPage = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totals, setTotals] = useState({
        total: 0,
        completed: 0,
        pending: 0,
        certificates: 0,
        mentors: 0,
        legal: 0
    });
    const [filterType, setFilterType] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    const fetchPayments = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('adminToken');
            
            const params = {};
            if (filterType) params.type = filterType;
            if (filterStatus) params.status = filterStatus;
            
            const response = await adminPaymentsAPI.getAllPayments(token, params);
            
            if (response.success) {
                setPayments(response.data || []);
                setTotals(response.totals || {
                    total: 0,
                    completed: 0,
                    pending: 0,
                    certificates: 0,
                    mentors: 0,
                    legal: 0
                });
            } else {
                setError(response.message || 'Failed to fetch payments');
            }
        } catch (err) {
            console.error('Error fetching payments:', err);
            setError(err.message || 'Failed to fetch payments');
        } finally {
            setLoading(false);
        }
    }, [filterType, filterStatus]);

    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]);

    const getPaymentIcon = (type) => {
        switch (type) {
            case 'certificate':
                return <FaGraduationCap className="w-5 h-5" />;
            case 'mentor':
                return <FaUserTie className="w-5 h-5" />;
            case 'legal':
                return <FaBalanceScale className="w-5 h-5" />;
            default:
                return <FaCreditCard className="w-5 h-5" />;
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'completed':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <FaCheckCircle className="w-3 h-3 mr-1" />
                        Paid
                    </span>
                );
            case 'pending':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <FaClock className="w-3 h-3 mr-1" />
                        Pending
                    </span>
                );
            case 'failed':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <FaExclamationTriangle className="w-3 h-3 mr-1" />
                        Failed
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {status}
                    </span>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-4 md:py-8 px-2 md:px-6">
            {/* Header */}
            <div className="w-full max-w-7xl mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Payment Management</h1>
                <p className="text-sm md:text-base text-gray-600">View all payments and transactions</p>
            </div>

            {/* Summary Cards */}
            <div className="w-full max-w-7xl grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-blue-500">
                    <div className="text-xs md:text-sm text-gray-600 mb-1">Total Payments</div>
                    <div className="text-lg md:text-2xl font-bold text-gray-900">₹{totals.total.toLocaleString()}</div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-green-500">
                    <div className="text-xs md:text-sm text-gray-600 mb-1">Completed</div>
                    <div className="text-lg md:text-2xl font-bold text-gray-900">₹{totals.completed.toLocaleString()}</div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-purple-500">
                    <div className="text-xs md:text-sm text-gray-600 mb-1">Certificates</div>
                    <div className="text-lg md:text-2xl font-bold text-gray-900">₹{totals.certificates.toLocaleString()}</div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-orange-500">
                    <div className="text-xs md:text-sm text-gray-600 mb-1">Mentor Sessions</div>
                    <div className="text-lg md:text-2xl font-bold text-gray-900">₹{totals.mentors.toLocaleString()}</div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-red-500">
                    <div className="text-xs md:text-sm text-gray-600 mb-1">Legal Services</div>
                    <div className="text-lg md:text-2xl font-bold text-gray-900">₹{totals.legal.toLocaleString()}</div>
                </div>
            </div>

            {/* Filters */}
            <div className="w-full max-w-7xl bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Filters</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Type</label>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="">All Types</option>
                            <option value="certificate">Training Certificates</option>
                            <option value="mentor">Mentor Sessions</option>
                            <option value="legal">Legal Services</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="">All Status</option>
                            <option value="completed">Paid</option>
                            <option value="failed">Failed</option>
                        </select>
                    </div>
                </div>
            </div>

            {error && (
                <div className="w-full max-w-7xl mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {/* Payments Table */}
            <div className="w-full max-w-7xl bg-white rounded-xl shadow-lg overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <FaSpinner className="animate-spin text-4xl text-orange-600" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {payments.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                                            No payments found
                                        </td>
                                    </tr>
                                ) : (
                                    payments.map((payment) => {
                                        const userName = payment.user
                                            ? `${payment.user.firstName || ''} ${payment.user.lastName || ''}`.trim() || payment.user.email
                                            : 'Unknown User';
                                        const userEmail = payment.user?.email || 'N/A';

                                        return (
                                            <tr key={payment._id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{userName}</div>
                                                    <div className="text-xs text-gray-500">{userEmail}</div>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <div className="flex items-center space-x-2">
                                                        <div className={`p-2 rounded-lg ${
                                                            payment.type === 'certificate' ? 'bg-purple-100 text-purple-600' :
                                                            payment.type === 'legal' ? 'bg-red-100 text-red-600' :
                                                            'bg-orange-100 text-orange-600'
                                                        }`}>
                                                            {getPaymentIcon(payment.type)}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">{payment.typeLabel}</div>
                                                            <div className="text-xs text-gray-500 capitalize">{payment.type}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {payment.type === 'certificate' ? (
                                                        <div className="text-sm text-gray-900">
                                                            <div className="font-medium">{payment.details.courseTitle}</div>
                                                            <div className="text-xs text-gray-500">Provider: {payment.details.courseProvider}</div>
                                                            <div className="text-xs text-gray-500">Progress: {payment.details.progress}%</div>
                                                        </div>
                                                    ) : payment.type === 'legal' ? (
                                                        <div className="text-sm text-gray-900">
                                                            <div className="font-medium">{payment.details.serviceName}</div>
                                                            <div className="text-xs text-gray-500">Category: {payment.details.serviceCategory}</div>
                                                            <div className="text-xs text-gray-500">Status: {payment.details.submissionStatus}</div>
                                                        </div>
                                                    ) : (
                                                        <div className="text-sm text-gray-900">
                                                            <div className="font-medium">{payment.details.mentorName}</div>
                                                            <div className="text-xs text-gray-500">Specialization: {payment.details.mentorSpecialization}</div>
                                                            <div className="text-xs text-gray-500">Session: {payment.details.sessionType} - {payment.details.duration}</div>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <div className="text-sm font-bold text-gray-900">₹{payment.amount?.toLocaleString() || '0'}</div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {payment.paymentId ? (
                                                        <div className="text-sm text-gray-900 font-mono">
                                                            <div className="truncate max-w-xs" title={payment.paymentId}>
                                                                {payment.paymentId}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="text-sm text-gray-400 italic">N/A</div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    {getStatusBadge(payment.status)}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    {payment.paidAt ? (
                                                        <div>
                                                            <div className="text-sm text-gray-900">
                                                                {new Date(payment.paidAt).toLocaleDateString()}
                                                            </div>
                                                            <div className="text-xs text-gray-500">
                                                                {new Date(payment.paidAt).toLocaleTimeString()}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="text-sm text-gray-500">
                                                            {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : 'N/A'}
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPaymentsPage;

