import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminPitchAPI } from '../../utils/api';
import { FaSpinner, FaEye, FaDownload, FaCheck, FaTimes, FaExclamationTriangle, FaFilePdf } from 'react-icons/fa';

const AdminPitchesPage = () => {
    const [pitches, setPitches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedPitch, setSelectedPitch] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [statusFilter, setStatusFilter] = useState('');
    const [stats, setStats] = useState({
        total: 0,
        underReview: 0,
        approved: 0,
        moreDetailsRequired: 0,
        rejected: 0
    });
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [statusUpdateData, setStatusUpdateData] = useState({
        status: '',
        rejectionReason: '',
        adminNotes: ''
    });

    useEffect(() => {
        loadPitches();
    }, [statusFilter]);

    const loadPitches = async () => {
        try {
            setLoading(true);
            setError('');
            const token = localStorage.getItem('adminToken');
            if (!token || token === 'null' || token === 'undefined') {
                setError('Admin authentication required. Please login again.');
                setLoading(false);
                return;
            }

            const params = statusFilter ? { status: statusFilter } : {};
            const response = await adminPitchAPI.getAllPitches(token, params);

            if (response.success) {
                setPitches(response.data || []);
                if (response.stats) {
                    setStats(response.stats);
                }
            } else {
                setError(response.message || 'Failed to load pitches');
            }
        } catch (err) {
            console.error('Load pitches error:', err);
            // Check if it's a 404 (route not found) or authentication error
            if (err.message && err.message.includes('Not Found')) {
                setError('Pitch management route not found. Please ensure the backend server is running and has been restarted with the latest changes.');
            } else if (err.message && (err.message.includes('token') || err.message.includes('authentication'))) {
                setError('Authentication failed. Please login again.');
                // Optionally redirect to login
                setTimeout(() => {
                    window.location.href = '/admin/login';
                }, 2000);
            } else {
                setError(err.message || 'Failed to load pitches. Please check if the backend server is running.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = async (pitchId) => {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token || token === 'null' || token === 'undefined') {
                alert('Admin authentication required. Please login again.');
                return;
            }
            const response = await adminPitchAPI.getPitchById(token, pitchId);

            if (response.success) {
                setSelectedPitch(response.data);
                setShowDetailsModal(true);
                setStatusUpdateData({
                    status: response.data.status,
                    rejectionReason: response.data.rejectionReason || '',
                    adminNotes: response.data.adminNotes || ''
                });
            } else {
                alert(response.message || 'Failed to load pitch details');
            }
        } catch (err) {
            console.error('Load pitch details error:', err);
            alert(err.message || 'Failed to load pitch details');
        }
    };

    const handleDownloadDocument = async (pitchId, documentType) => {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token || token === 'null' || token === 'undefined') {
                alert('Admin authentication required. Please login again.');
                return;
            }
            
            // Download from backend (GridFS)
            const response = await adminPitchAPI.downloadPitchDocument(token, pitchId, documentType);
            const blob = await response.blob();
            
            // Get filename from response headers or use default
            const contentDisposition = response.headers.get('content-disposition');
            let fileName = `${documentType}.pdf`;
            if (contentDisposition) {
                const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/i);
                if (fileNameMatch) {
                    fileName = decodeURIComponent(fileNameMatch[1]);
                }
            }
            
            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
            }, 100);
        } catch (err) {
            console.error('Download document error:', err);
            alert(err.message || 'Failed to download document');
        }
    };

    const handleUpdateStatus = async () => {
        if (!selectedPitch) return;

        if (statusUpdateData.status === 'Rejected' && !statusUpdateData.rejectionReason.trim()) {
            alert('Rejection reason is required when rejecting a pitch');
            return;
        }

        try {
            setUpdatingStatus(true);
            const token = localStorage.getItem('adminToken');
            if (!token || token === 'null' || token === 'undefined') {
                alert('Admin authentication required. Please login again.');
                setUpdatingStatus(false);
                return;
            }
            const response = await adminPitchAPI.updatePitchStatus(
                token,
                selectedPitch._id,
                statusUpdateData.status,
                statusUpdateData.rejectionReason,
                statusUpdateData.adminNotes
            );

            if (response.success) {
                alert('Pitch status updated successfully');
                setShowDetailsModal(false);
                setSelectedPitch(null);
                loadPitches();
            } else {
                alert(response.message || 'Failed to update status');
            }
        } catch (err) {
            console.error('Update status error:', err);
            alert(err.message || 'Failed to update status');
        } finally {
            setUpdatingStatus(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'Rejected':
                return 'bg-red-100 text-red-700 border-red-200';
            case 'More Details Required':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Under Review':
            default:
                return 'bg-blue-100 text-blue-700 border-blue-200';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <FaSpinner className="animate-spin text-4xl text-orange-500" />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Pitch Management</h1>
                    <p className="text-gray-600">Manage and review all submitted pitches</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
                        <div className="text-sm text-gray-600">Total Pitches</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg shadow p-4 border border-blue-200">
                        <div className="text-2xl font-bold text-blue-700">{stats.underReview}</div>
                        <div className="text-sm text-blue-600">Under Review</div>
                    </div>
                    <div className="bg-green-50 rounded-lg shadow p-4 border border-green-200">
                        <div className="text-2xl font-bold text-green-700">{stats.approved}</div>
                        <div className="text-sm text-green-600">Approved</div>
                    </div>
                    <div className="bg-yellow-50 rounded-lg shadow p-4 border border-yellow-200">
                        <div className="text-2xl font-bold text-yellow-700">{stats.moreDetailsRequired}</div>
                        <div className="text-sm text-yellow-600">More Details</div>
                    </div>
                    <div className="bg-red-50 rounded-lg shadow p-4 border border-red-200">
                        <div className="text-2xl font-bold text-red-700">{stats.rejected}</div>
                        <div className="text-sm text-red-600">Rejected</div>
                    </div>
                </div>

                {/* Filter */}
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                    <div className="flex items-center gap-4">
                        <label className="text-sm font-semibold text-gray-700">Filter by Status:</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                            <option value="">All Statuses</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Approved">Approved</option>
                            <option value="More Details Required">More Details Required</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                        <button
                            onClick={loadPitches}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                        >
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                {/* Pitches Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Pitch ID</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Startup Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Founder</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Category</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Submitted</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {pitches.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                                            No pitches found
                                        </td>
                                    </tr>
                                ) : (
                                    pitches.map((pitch) => (
                                        <tr key={pitch._id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-600">{pitch.pitchId || 'N/A'}</td>
                                            <td className="px-4 py-3 text-sm font-medium text-gray-800">{pitch.startupName}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{pitch.founderName}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{pitch.category}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(pitch.status)}`}>
                                                    {pitch.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{formatDate(pitch.submittedAt)}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleViewDetails(pitch._id)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="View Details"
                                                    >
                                                        <FaEye />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Details Modal */}
            {showDetailsModal && selectedPitch && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                            <h2 className="text-2xl font-bold text-gray-800">Pitch Details</h2>
                            <button
                                onClick={() => {
                                    setShowDetailsModal(false);
                                    setSelectedPitch(null);
                                }}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <FaTimes className="text-gray-600" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-semibold text-gray-700">Pitch ID</label>
                                    <p className="text-gray-800">{selectedPitch.pitchId || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-700">Status</label>
                                    <p>
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(selectedPitch.status)}`}>
                                            {selectedPitch.status}
                                        </span>
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-700">Startup Name</label>
                                    <p className="text-gray-800">{selectedPitch.startupName}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-700">One-line Pitch</label>
                                    <p className="text-gray-800">{selectedPitch.oneLinePitch}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-700">Category</label>
                                    <p className="text-gray-800">{selectedPitch.category}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-700">Startup Stage</label>
                                    <p className="text-gray-800">{selectedPitch.startupStage}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-700">Founder Name</label>
                                    <p className="text-gray-800">{selectedPitch.founderName}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-700">Location</label>
                                    <p className="text-gray-800">{selectedPitch.city}, {selectedPitch.state}</p>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-700">Problem Statement</label>
                                <p className="text-gray-800 mt-1">{selectedPitch.problemStatement}</p>
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-700">Solution Description</label>
                                <p className="text-gray-800 mt-1">{selectedPitch.solutionDescription}</p>
                            </div>

                            {/* User Info */}
                            {selectedPitch.user && (
                                <div className="border-t border-gray-200 pt-4">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">User Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-semibold text-gray-700">Name</label>
                                            <p className="text-gray-800">
                                                {selectedPitch.user.firstName} {selectedPitch.user.lastName}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-gray-700">Email</label>
                                            <p className="text-gray-800">{selectedPitch.user.email}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-gray-700">Phone</label>
                                            <p className="text-gray-800">{selectedPitch.user.phone}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Documents */}
                            <div className="border-t border-gray-200 pt-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Documents</h3>
                                <div className="space-y-3">
                                    {selectedPitch.documents?.pitchDeck?.fileId && (
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <FaFilePdf className="text-red-600 text-xl" />
                                                <div>
                                                    <p className="font-medium text-gray-800">Pitch Deck</p>
                                                    <p className="text-sm text-gray-600">{selectedPitch.documents.pitchDeck.fileName || 'pitch-deck.pdf'}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDownloadDocument(selectedPitch._id, 'pitchDeck')}
                                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                                            >
                                                <FaDownload /> Download
                                            </button>
                                        </div>
                                    )}
                                    {selectedPitch.documents?.executiveSummary?.fileId && (
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <FaFilePdf className="text-red-600 text-xl" />
                                                <div>
                                                    <p className="font-medium text-gray-800">Executive Summary</p>
                                                    <p className="text-sm text-gray-600">{selectedPitch.documents.executiveSummary.fileName || 'executive-summary.pdf'}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDownloadDocument(selectedPitch._id, 'executiveSummary')}
                                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                                            >
                                                <FaDownload /> Download
                                            </button>
                                        </div>
                                    )}
                                    {selectedPitch.documents?.financials?.fileId && (
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <FaFilePdf className="text-red-600 text-xl" />
                                                <div>
                                                    <p className="font-medium text-gray-800">Financials</p>
                                                    <p className="text-sm text-gray-600">{selectedPitch.documents.financials.fileName || 'financials.xlsx'}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDownloadDocument(selectedPitch._id, 'financials')}
                                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                                            >
                                                <FaDownload /> Download
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Status Update */}
                            <div className="border-t border-gray-200 pt-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Update Status</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Status *</label>
                                        <select
                                            value={statusUpdateData.status}
                                            onChange={(e) => setStatusUpdateData({ ...statusUpdateData, status: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        >
                                            <option value="Under Review">Under Review</option>
                                            <option value="Approved">Approved</option>
                                            <option value="More Details Required">More Details Required</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                    </div>

                                    {statusUpdateData.status === 'Rejected' && (
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Rejection Reason *</label>
                                            <textarea
                                                value={statusUpdateData.rejectionReason}
                                                onChange={(e) => setStatusUpdateData({ ...statusUpdateData, rejectionReason: e.target.value })}
                                                rows={3}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                                                placeholder="Enter rejection reason..."
                                                required
                                            />
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Notes</label>
                                        <textarea
                                            value={statusUpdateData.adminNotes}
                                            onChange={(e) => setStatusUpdateData({ ...statusUpdateData, adminNotes: e.target.value })}
                                            rows={3}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                                            placeholder="Add admin notes (optional)..."
                                        />
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleUpdateStatus}
                                            disabled={updatingStatus}
                                            className={`flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-colors ${
                                                updatingStatus ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                        >
                                            {updatingStatus ? 'Updating...' : 'Update Status'}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowDetailsModal(false);
                                                setSelectedPitch(null);
                                            }}
                                            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default AdminPitchesPage;

