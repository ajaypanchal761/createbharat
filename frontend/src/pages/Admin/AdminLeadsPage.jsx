import React, { useState, useEffect, useCallback } from 'react';
import { FaSpinner, FaEye, FaTrash, FaCheckCircle, FaClock, FaEnvelope, FaPhone, FaUser, FaBuilding, FaCalendar } from 'react-icons/fa';
import { adminWebDevelopmentAPI } from '../../utils/api';

const AdminLeadsPage = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        total: 0,
        new: 0,
        contacted: 0,
        quoted: 0,
        inProgress: 0,
        completed: 0,
        viewed: 0,
        unviewed: 0
    });
    const [filterStatus, setFilterStatus] = useState('');
    const [filterViewed, setFilterViewed] = useState('');
    const [selectedLead, setSelectedLead] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);

    const fetchLeads = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('adminToken');
            
            const params = {};
            if (filterStatus) params.status = filterStatus;
            if (filterViewed !== '') params.viewed = filterViewed;
            
            const response = await adminWebDevelopmentAPI.getAllLeads(token, params);
            
            if (response.success) {
                setLeads(response.data || []);
                setStats(response.stats || {
                    total: 0,
                    new: 0,
                    contacted: 0,
                    quoted: 0,
                    inProgress: 0,
                    completed: 0,
                    viewed: 0,
                    unviewed: 0
                });
            } else {
                setError(response.message || 'Failed to fetch leads');
            }
        } catch (err) {
            console.error('Error fetching leads:', err);
            setError(err.message || 'Failed to fetch leads');
        } finally {
            setLoading(false);
        }
    }, [filterStatus, filterViewed]);

    useEffect(() => {
        fetchLeads();
    }, [fetchLeads]);

    const handleViewLead = async (leadId) => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await adminWebDevelopmentAPI.getLeadById(token, leadId);
            
            if (response.success) {
                setSelectedLead(response.data);
                setShowViewModal(true);
                // Refresh leads to update viewed status
                fetchLeads();
            }
        } catch (err) {
            console.error('Error fetching lead:', err);
            alert('Error: ' + (err.message || 'Failed to fetch lead details'));
        }
    };

    const handleDeleteLead = async (leadId) => {
        if (!window.confirm('Are you sure you want to delete this lead? This action cannot be undone.')) {
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            const response = await adminWebDevelopmentAPI.deleteLead(token, leadId);
            
            if (response.success) {
                alert('Lead deleted successfully!');
                fetchLeads();
            } else {
                alert('Error: ' + (response.message || 'Failed to delete lead'));
            }
        } catch (err) {
            console.error('Error deleting lead:', err);
            alert('Error: ' + (err.message || 'Failed to delete lead'));
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'new': { color: 'bg-blue-100 text-blue-800', icon: FaClock, label: 'New' },
            'contacted': { color: 'bg-yellow-100 text-yellow-800', icon: FaPhone, label: 'Contacted' },
            'quoted': { color: 'bg-purple-100 text-purple-800', icon: FaEnvelope, label: 'Quoted' },
            'in-progress': { color: 'bg-indigo-100 text-indigo-800', icon: FaClock, label: 'In Progress' },
            'completed': { color: 'bg-green-100 text-green-800', icon: FaCheckCircle, label: 'Completed' },
            'closed': { color: 'bg-gray-100 text-gray-800', icon: FaClock, label: 'Closed' }
        };

        const config = statusConfig[status] || statusConfig['new'];
        const Icon = config.icon;

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                <Icon className="w-3 h-3 mr-1" />
                {config.label}
            </span>
        );
    };

    const formatPlatform = (platform) => {
        const platformMap = {
            'ios': 'iOS',
            'android': 'Android',
            'both': 'iOS & Android',
            'web': 'Web Application',
            'cross-platform': 'Cross-Platform'
        };
        return platformMap[platform] || platform;
    };

    const formatBudget = (budget) => {
        if (!budget) return 'Not specified';
        const budgetMap = {
            'under-10k': 'Under ₹10,000',
            '10k-50k': '₹10,000 - ₹50,000',
            '50k-1l': '₹50,000 - ₹1,00,000',
            '1l-5l': '₹1,00,000 - ₹5,00,000',
            'above-5l': 'Above ₹5,00,000'
        };
        return budgetMap[budget] || budget;
    };

    const formatTimeline = (timeline) => {
        if (!timeline) return 'Not specified';
        const timelineMap = {
            '1-month': '1 Month',
            '2-3-months': '2-3 Months',
            '3-6-months': '3-6 Months',
            '6-12-months': '6-12 Months',
            'flexible': 'Flexible'
        };
        return timelineMap[timeline] || timeline;
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-4 md:py-8 px-2 md:px-6">
            {/* Header */}
            <div className="w-full max-w-7xl mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Leads Request</h1>
                <p className="text-sm md:text-base text-gray-600">Manage web development project requests</p>
            </div>

            {/* Summary Cards */}
            <div className="w-full max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-blue-500">
                    <div className="text-xs md:text-sm text-gray-600 mb-1">Total Leads</div>
                    <div className="text-lg md:text-2xl font-bold text-gray-900">{stats.total}</div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-yellow-500">
                    <div className="text-xs md:text-sm text-gray-600 mb-1">New Leads</div>
                    <div className="text-lg md:text-2xl font-bold text-gray-900">{stats.new}</div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-green-500">
                    <div className="text-xs md:text-sm text-gray-600 mb-1">Viewed</div>
                    <div className="text-lg md:text-2xl font-bold text-gray-900">{stats.viewed}</div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-red-500">
                    <div className="text-xs md:text-sm text-gray-600 mb-1">Unviewed</div>
                    <div className="text-lg md:text-2xl font-bold text-gray-900">{stats.unviewed}</div>
                </div>
            </div>

            {/* Filters */}
            <div className="w-full max-w-7xl bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Filters</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="">All Status</option>
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="quoted">Quoted</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Viewed Status</label>
                        <select
                            value={filterViewed}
                            onChange={(e) => setFilterViewed(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="">All</option>
                            <option value="true">Viewed</option>
                            <option value="false">Unviewed</option>
                        </select>
                    </div>
                </div>
            </div>

            {error && (
                <div className="w-full max-w-7xl mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {/* Leads Table */}
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
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {leads.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                                            No leads found
                                        </td>
                                    </tr>
                                ) : (
                                    leads.map((lead) => (
                                        <tr key={lead._id} className={`hover:bg-gray-50 ${!lead.viewed ? 'bg-blue-50' : ''}`}>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{lead.clientName}</div>
                                                <div className="text-xs text-gray-500">{lead.email}</div>
                                                <div className="text-xs text-gray-500">{lead.phone}</div>
                                                {lead.company && (
                                                    <div className="text-xs text-gray-400 mt-1">
                                                        <FaBuilding className="inline mr-1" />{lead.company}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-sm font-medium text-gray-900">{lead.projectName}</div>
                                                <div className="text-xs text-gray-500 mt-1 line-clamp-2">{lead.description}</div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{formatPlatform(lead.platform)}</div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{formatBudget(lead.budget)}</div>
                                                <div className="text-xs text-gray-500">{formatTimeline(lead.timeline)}</div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                {getStatusBadge(lead.status)}
                                                {!lead.viewed && (
                                                    <div className="mt-1">
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                                            New
                                                        </span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {new Date(lead.createdAt).toLocaleDateString()}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {new Date(lead.createdAt).toLocaleTimeString()}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => handleViewLead(lead._id)}
                                                        className="text-orange-600 hover:text-orange-900 p-2 hover:bg-orange-50 rounded-lg transition-colors"
                                                        title="View Details"
                                                    >
                                                        <FaEye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteLead(lead._id)}
                                                        className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete Lead"
                                                    >
                                                        <FaTrash className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* View Lead Modal */}
            {showViewModal && selectedLead && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                            <h3 className="text-2xl font-bold text-gray-900">Lead Details</h3>
                            <button
                                onClick={() => {
                                    setShowViewModal(false);
                                    setSelectedLead(null);
                                }}
                                className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Project Information */}
                            <div>
                                <h4 className="text-lg font-bold text-gray-900 mb-4">Project Information</h4>
                                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                    <div>
                                        <span className="text-sm font-medium text-gray-600">Project Name:</span>
                                        <p className="text-base text-gray-900 mt-1">{selectedLead.projectName}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-gray-600">Platform:</span>
                                        <p className="text-base text-gray-900 mt-1">{formatPlatform(selectedLead.platform)}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-gray-600">Description:</span>
                                        <p className="text-base text-gray-900 mt-1 whitespace-pre-wrap">{selectedLead.description}</p>
                                    </div>
                                    {selectedLead.features && (
                                        <div>
                                            <span className="text-sm font-medium text-gray-600">Key Features:</span>
                                            <p className="text-base text-gray-900 mt-1 whitespace-pre-wrap">{selectedLead.features}</p>
                                        </div>
                                    )}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-sm font-medium text-gray-600">Budget:</span>
                                            <p className="text-base text-gray-900 mt-1">{formatBudget(selectedLead.budget)}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-600">Timeline:</span>
                                            <p className="text-base text-gray-900 mt-1">{formatTimeline(selectedLead.timeline)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div>
                                <h4 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h4>
                                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                    <div>
                                        <span className="text-sm font-medium text-gray-600">Client Name:</span>
                                        <p className="text-base text-gray-900 mt-1">{selectedLead.clientName}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-gray-600">Email:</span>
                                        <p className="text-base text-gray-900 mt-1">{selectedLead.email}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-gray-600">Phone:</span>
                                        <p className="text-base text-gray-900 mt-1">{selectedLead.phone}</p>
                                    </div>
                                    {selectedLead.company && (
                                        <div>
                                            <span className="text-sm font-medium text-gray-600">Company:</span>
                                            <p className="text-base text-gray-900 mt-1">{selectedLead.company}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Additional Information */}
                            <div>
                                <h4 className="text-lg font-bold text-gray-900 mb-4">Additional Information</h4>
                                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                    <div>
                                        <span className="text-sm font-medium text-gray-600">Status:</span>
                                        <div className="mt-1">{getStatusBadge(selectedLead.status)}</div>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-gray-600">Submitted At:</span>
                                        <p className="text-base text-gray-900 mt-1">
                                            {new Date(selectedLead.createdAt).toLocaleString('en-IN', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                    {selectedLead.emailSent && (
                                        <div>
                                            <span className="text-sm font-medium text-gray-600">Email Sent:</span>
                                            <p className="text-base text-green-600 mt-1">
                                                Yes ({selectedLead.emailSentAt ? new Date(selectedLead.emailSentAt).toLocaleString() : 'N/A'})
                                            </p>
                                        </div>
                                    )}
                                    {selectedLead.viewed && selectedLead.viewedAt && (
                                        <div>
                                            <span className="text-sm font-medium text-gray-600">Viewed At:</span>
                                            <p className="text-base text-gray-900 mt-1">
                                                {new Date(selectedLead.viewedAt).toLocaleString()}
                                            </p>
                                        </div>
                                    )}
                                    {selectedLead.adminNotes && (
                                        <div>
                                            <span className="text-sm font-medium text-gray-600">Admin Notes:</span>
                                            <p className="text-base text-gray-900 mt-1 whitespace-pre-wrap">{selectedLead.adminNotes}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminLeadsPage;

