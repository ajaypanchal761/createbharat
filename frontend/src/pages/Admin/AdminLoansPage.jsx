import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminLoansAPI, loansAPI } from '../../utils/api';

const AdminLoansPage = () => {
    const [schemes, setSchemes] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingScheme, setEditingScheme] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showApplicantsView, setShowApplicantsView] = useState(false); // Changed from modal to view
    const [loanApplications, setLoanApplications] = useState([]);
    const [loadingApplications, setLoadingApplications] = useState(false);
    const [expandedApplications, setExpandedApplications] = useState(new Set()); // Store application IDs instead of indices
    const [documentPreview, setDocumentPreview] = useState(null);

    // Form state for create/edit
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'msme',
        minAmount: '',
        maxAmount: '',
        interestRate: '',
        tenure: '',
        processingTime: '',
        imageUrl: '',
        officialLink: '',
        videoUrl: '',
        heading: '',
        benefits: [],
        eligibility: [],
        documents: []
    });

    // Image file state
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    // Load schemes from backend
    useEffect(() => {
        const loadSchemes = async () => {
            try {
                const res = await loansAPI.getSchemes({ limit: 100 });
                setSchemes(res.data || []);
            } catch (e) {
                console.error('Failed to load schemes:', e.message);
            }
        };
        loadSchemes();
    }, []);

    // Filter schemes based on search
    const filteredSchemes = schemes.filter(scheme =>
        (scheme.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (scheme.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (scheme.category || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle create new scheme
    const handleCreateScheme = async () => {
        try {
            // Validate required fields
            if (!formData.name || !formData.description || !formData.minAmount || !formData.maxAmount) {
                alert('Please fill in all required fields (name, description, min/max amounts)');
                return;
            }

            const token = localStorage.getItem('adminToken');
            const payload = {
                ...formData,
                minAmount: parseInt(formData.minAmount),
                maxAmount: parseInt(formData.maxAmount),
                benefits: formData.benefits.filter(b => b.trim() !== ''),
                eligibility: formData.eligibility.filter(e => e.trim() !== ''),
                documents: formData.documents.filter(d => d.trim() !== ''),
            };

            // Remove imageUrl from payload if we're uploading a file
            if (selectedImage) {
                delete payload.imageUrl;
            }

            // Validate parsed amounts
            if (isNaN(payload.minAmount) || isNaN(payload.maxAmount)) {
                alert('Please enter valid numbers for min and max amounts');
                return;
            }

            const res = await adminLoansAPI.createScheme(token, payload, selectedImage);
            setSchemes([res.data, ...schemes]);
            setShowCreateModal(false);
            resetForm();
        } catch (e) {
            alert(e.message || 'Failed to create scheme');
        }
    };

    // Handle edit scheme
    const handleEditScheme = (scheme) => {
        setEditingScheme(scheme);
        setFormData({
            name: scheme.name,
            description: scheme.description,
            category: scheme.category,
            minAmount: scheme.minAmount.toString(),
            maxAmount: scheme.maxAmount.toString(),
            interestRate: scheme.interestRate || '',
            tenure: scheme.tenure || '',
            processingTime: scheme.processingTime || '',
            imageUrl: scheme.imageUrl || scheme.image || '',
            officialLink: scheme.officialLink || '',
            videoUrl: scheme.videoUrl || '',
            heading: scheme.heading || '',
            benefits: scheme.benefits || [],
            eligibility: scheme.eligibility || [],
            documents: scheme.documents || []
        });
        // Reset image selection
        setSelectedImage(null);

        // Set preview to existing image URL if available
        const existingImageUrl = scheme.imageUrl || scheme.image || '';
        setImagePreview(existingImageUrl);

        setShowEditModal(true);
    };

    // Handle update scheme
    const handleUpdateScheme = async () => {
        try {
            // Validate required fields
            if (!formData.name || !formData.description || !formData.minAmount || !formData.maxAmount) {
                alert('Please fill in all required fields (name, description, min/max amounts)');
                return;
            }

            const token = localStorage.getItem('adminToken');
            const payload = {
                ...formData,
                minAmount: parseInt(formData.minAmount),
                maxAmount: parseInt(formData.maxAmount),
                benefits: formData.benefits.filter(b => b.trim() !== ''),
                eligibility: formData.eligibility.filter(e => e.trim() !== ''),
                documents: formData.documents.filter(d => d.trim() !== ''),
            };

            // Remove imageUrl from payload if we're uploading a new file
            if (selectedImage) {
                delete payload.imageUrl;
            }

            // Validate parsed amounts
            if (isNaN(payload.minAmount) || isNaN(payload.maxAmount)) {
                alert('Please enter valid numbers for min and max amounts');
                return;
            }

            const res = await adminLoansAPI.updateScheme(token, editingScheme._id || editingScheme.id, payload, selectedImage);
            const updated = res.data;
            setSchemes(schemes.map(scheme =>
                (scheme._id || scheme.id) === (editingScheme._id || editingScheme.id) ? updated : scheme
            ));
            setShowEditModal(false);
            setEditingScheme(null);
            resetForm();
        } catch (e) {
            alert(e.message || 'Failed to update scheme');
        }
    };

    // Handle delete scheme
    const handleDeleteScheme = async (schemeId) => {
        if (!window.confirm('Are you sure you want to delete this scheme?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            await adminLoansAPI.deleteScheme(token, schemeId);
            setSchemes(schemes.filter(scheme => (scheme._id || scheme.id) !== schemeId));
        } catch (e) {
            alert(e.message || 'Failed to delete scheme');
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            category: 'msme',
            minAmount: '',
            maxAmount: '',
            interestRate: '',
            tenure: '',
            processingTime: '',
            imageUrl: '',
            officialLink: '',
            videoUrl: '',
            heading: '',
            benefits: [],
            eligibility: [],
            documents: []
        });
        setSelectedImage(null);
        setImagePreview('');
    };

    // Add new item to array fields
    const addArrayItem = (field) => {
        setFormData({
            ...formData,
            [field]: [...formData[field], '']
        });
    };

    // Update array item
    const updateArrayItem = (field, index, value) => {
        const updatedArray = [...formData[field]];
        updatedArray[index] = value;
        setFormData({
            ...formData,
            [field]: updatedArray
        });
    };

    // Remove array item
    const removeArrayItem = (field, index) => {
        const updatedArray = formData[field].filter((_, i) => i !== index);
        setFormData({
            ...formData,
            [field]: updatedArray
        });
    };

    // Handle image upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Load loan applications
    const loadLoanApplications = async () => {
        setLoadingApplications(true);
        try {
            const token = localStorage.getItem('adminToken');
            if (!token || token === 'null' || token === 'undefined') {
                alert('Admin authentication required');
                setLoanApplications([]);
                return;
            }

            const cleanToken = token.trim().replace(/^["']|["']$/g, '');
            const response = await adminLoansAPI.getApplications(cleanToken, { limit: 100 });
            
            if (response.success && response.data) {
                setLoanApplications(response.data || []);
            } else {
                setLoanApplications([]);
            }
        } catch (e) {
            console.error('Failed to load loan applications:', e);
            alert(e.message || 'Failed to load loan applications');
            setLoanApplications([]);
        } finally {
            setLoadingApplications(false);
        }
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Format field label
    const formatFieldLabel = (key) => {
        const labels = {
            applicantFullName: 'Applicant Full Name',
            mobileNumber: 'Mobile Number',
            emailAddress: 'Email Address',
            city: 'City',
            state: 'State',
            currentlyRunningBusiness: 'Currently Running Business',
            msmeUdyamNumber: 'MSME/Udyam Registration Number',
            businessType: 'Business Type',
            businessTypeOther: 'Business Type (Other)',
            businessName: 'Business Name/Brand Name',
            loanAmount: 'Loan Amount Required',
            loanPurpose: 'Loan Purpose',
            loanPurposeOther: 'Loan Purpose (Other)',
            loanType: 'Loan Type',
            loanTypeOther: 'Loan Type (Other)',
            businessRegistrationType: 'Business Registration Type',
            businessDocuments: 'Business Documents',
            appliedAt: 'Applied At'
        };
        return labels[key] || key;
    };

    // Format field value
    const formatFieldValue = (key, value) => {
        if (value === null || value === undefined || value === '') return 'N/A';
        if (key === 'appliedAt') return formatDate(value);
        if (key === 'currentlyRunningBusiness') return value === 'yes' ? 'Yes' : 'No';
        if (key === 'businessDocuments') return value ? 'File uploaded' : 'No file';
        if (key === 'loanAmount') return `₹${Number(value).toLocaleString('en-IN')}`;
        return value;
    };

    // Toggle application expansion
    const toggleApplication = (applicationId) => {
        const newExpanded = new Set(expandedApplications);
        if (newExpanded.has(applicationId)) {
            newExpanded.delete(applicationId);
        } else {
            newExpanded.add(applicationId);
        }
        setExpandedApplications(newExpanded);
    };

    // View document
    const viewDocument = (document) => {
        if (!document) return;
        
        // If document has url (from backend)
        if (document && typeof document === 'object' && document.url) {
            setDocumentPreview(document.url);
        } 
        // If document has dataUrl (from localStorage - fallback)
        else if (document && typeof document === 'object' && document.dataUrl) {
            setDocumentPreview(document.dataUrl);
        } 
        // If it's a string URL
        else if (document && typeof document === 'string') {
            setDocumentPreview(document);
        } 
        // If it's a File object, create object URL
        else if (document instanceof File) {
            const url = URL.createObjectURL(document);
            setDocumentPreview(url);
        }
    };

    // Close document preview
    const closeDocumentPreview = () => {
        setDocumentPreview(null);
    };

    // Delete loan application
    const handleDeleteApplication = async (applicationId, applicantName) => {
        // Confirmation dialog
        const confirmed = window.confirm(
            `Are you sure you want to delete the loan application for "${applicantName}"?\n\nThis action cannot be undone and will permanently delete the application and all associated documents.`
        );

        if (!confirmed) {
            return;
        }

        try {
            const token = localStorage.getItem('adminToken');
            if (!token || token === 'null' || token === 'undefined') {
                alert('Admin authentication required');
                return;
            }

            const cleanToken = token.trim().replace(/^["']|["']$/g, '');
            const response = await adminLoansAPI.deleteApplication(cleanToken, applicationId);

            if (response.success) {
                // Remove from expanded set if it was expanded
                setExpandedApplications(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(applicationId);
                    return newSet;
                });

                // Remove from local state
                setLoanApplications(prev => prev.filter(app => app._id !== applicationId));

                alert('Loan application deleted successfully');
            } else {
                throw new Error(response.message || 'Failed to delete application');
            }
        } catch (error) {
            console.error('Error deleting loan application:', error);
            alert(error.message || 'Failed to delete application. Please try again.');
        }
    };

    return (
        <div className="space-y-3 md:space-y-6">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-gray-200"
            >
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h1 className="text-lg md:text-3xl font-bold text-gray-900">Loan Schemes Management</h1>
                        <p className="text-sm md:text-base text-gray-600 mt-1">Manage all loan schemes and applications</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <div className="text-xs md:text-sm text-gray-500">Total Schemes</div>
                            <div className="text-xl md:text-2xl font-bold text-orange-600">{schemes.length}</div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="space-y-3 md:space-y-6">
                {/* Search and Create Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-4 md:mb-6"
                >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search schemes by name, description, or category..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm md:text-base"
                            />
                        </div>
                        <div className="flex gap-2 md:gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    setExpandedApplications(new Set()); // Reset expanded state
                                    setShowApplicantsView(true);
                                    loadLoanApplications();
                                }}
                                className="px-3 md:px-5 py-2 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-lg text-xs md:text-sm whitespace-nowrap"
                            >
                                👥 View Applicants
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    resetForm();
                                    setShowCreateModal(true);
                                }}
                                className="px-3 md:px-6 py-2 md:py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold shadow-lg text-xs md:text-sm whitespace-nowrap"
                            >
                                ➕ Create New Scheme
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Schemes Grid - Show only when not viewing applicants */}
                {!showApplicantsView && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6"
                    >
                        {filteredSchemes.map((scheme, index) => (
                        <motion.div
                            key={scheme._id || scheme.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                            whileHover={{ scale: 1.02, y: -4 }}
                            className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6 hover:shadow-xl transition-all duration-300"
                        >
                            {/* Scheme Header */}
                            <div className="flex items-start justify-between mb-3 md:mb-4">
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-base md:text-lg font-semibold text-gray-900 truncate">{scheme.name}</h3>
                                    <p className="text-xs md:text-sm text-gray-600 capitalize">{scheme.category}</p>
                                </div>
                                <div className="flex space-x-2 ml-2">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleEditScheme(scheme)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Edit Scheme"
                                    >
                                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleDeleteScheme(scheme._id || scheme.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete Scheme"
                                    >
                                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </motion.button>
                                </div>
                            </div>

                            {/* Scheme Details */}
                            <div className="space-y-2 md:space-y-3 mb-3 md:mb-4">
                                <div>
                                    <h4 className="text-xs md:text-sm font-medium text-gray-700">Full Name</h4>
                                    <p className="text-xs md:text-sm text-gray-900 truncate">{scheme.name}</p>
                                </div>
                                <div>
                                    <h4 className="text-xs md:text-sm font-medium text-gray-700">Description</h4>
                                    <p className="text-xs md:text-sm text-gray-600 line-clamp-2">{scheme.description}</p>
                                </div>
                                <div className="flex justify-between items-center gap-2">
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-xs md:text-sm font-medium text-gray-700">Amount Range</h4>
                                        <p className="text-xs md:text-sm text-gray-900 truncate">
                                            ₹{scheme.minAmount.toLocaleString()} - ₹{scheme.maxAmount.toLocaleString()}
                                        </p>
                                    </div>
                                    <span className="px-2 md:px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-[10px] md:text-xs font-medium whitespace-nowrap">
                                        {scheme.category}
                                    </span>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-gray-200">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-[10px] md:text-xs text-gray-500">Active</span>
                                </div>
                                <div className="text-[10px] md:text-xs text-gray-500">
                                    {scheme.benefits?.length || 0} benefits
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    </motion.div>
                )}

                {/* Applicants View - Show when showApplicantsView is true */}
                {showApplicantsView && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-3 md:space-y-4"
                    >
                        {/* Header with Back Button */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-4 md:mb-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg md:text-2xl font-bold text-gray-900">Loan Applicants</h2>
                                    <p className="text-xs md:text-sm text-gray-600 mt-1">{loanApplications.length} total applications</p>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        setShowApplicantsView(false);
                                        setExpandedApplications(new Set());
                                    }}
                                    className="px-3 md:px-5 py-2 md:py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold shadow-lg text-xs md:text-sm whitespace-nowrap flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Back to Schemes
                                </motion.button>
                            </div>
                        </div>

                        {/* Applicants List */}
                        {loadingApplications ? (
                            <div className="flex items-center justify-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        ) : loanApplications.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
                                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="text-gray-500 text-sm md:text-base">No loan applications found</p>
                            </div>
                        ) : (
                            <div className="space-y-3 md:space-y-4">
                                {loanApplications.map((application, index) => {
                                    const isExpanded = expandedApplications.has(application._id);
                                    return (
                                        <motion.div
                                            key={application._id || index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.03 }}
                                            className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden"
                                        >
                                            {/* Main Detail - Clickable Header (Only Name and Time) */}
                                            <div className="flex items-center w-full">
                                                <button
                                                    onClick={() => toggleApplication(application._id)}
                                                    className="flex-1 p-4 md:p-5 hover:bg-gray-50 transition-colors text-left"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                                                            <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg md:text-xl">
                                                                {application.applicantFullName?.charAt(0)?.toUpperCase() || 'A'}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h3 className="text-lg md:text-2xl font-bold text-gray-900 truncate mb-1">
                                                                    {application.applicantFullName || 'N/A'}
                                                                </h3>
                                                                <span className="text-xs md:text-sm text-gray-500 flex items-center gap-1.5">
                                                                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                    </svg>
                                                                    {formatDate(application.appliedAt || application.createdAt)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="ml-3 flex-shrink-0">
                                                            <svg 
                                                                className={`w-5 h-5 md:w-6 md:h-6 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                                                                fill="none" 
                                                                stroke="currentColor" 
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </button>
                                                {/* Delete Button */}
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteApplication(application._id, application.applicantFullName);
                                                    }}
                                                    className="p-3 md:p-4 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                                                    title="Delete Application"
                                                >
                                                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </motion.button>
                                            </div>

                                            {/* Application Details - Collapsible */}
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="overflow-hidden border-t border-gray-100"
                                                >
                                                    <div className="px-4 md:px-5 pb-4 md:pb-5 bg-gray-50">
                                                        <div className="pt-4 md:pt-5 space-y-4 md:space-y-5">
                                                            {/* Personal Information */}
                                                            <div className="bg-white rounded-lg p-4 md:p-5 border border-gray-200">
                                                                <h4 className="text-sm md:text-base font-semibold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
                                                                    <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                                    </svg>
                                                                    Personal Information
                                                                </h4>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                                                                    <div className="bg-gray-50 rounded-lg p-3">
                                                                        <p className="text-xs text-gray-500 mb-1">Email Address</p>
                                                                        <p className="text-sm font-medium text-gray-900">{formatFieldValue('emailAddress', application.emailAddress)}</p>
                                                                    </div>
                                                                    <div className="bg-gray-50 rounded-lg p-3">
                                                                        <p className="text-xs text-gray-500 mb-1">Mobile Number</p>
                                                                        <p className="text-sm font-medium text-gray-900">{formatFieldValue('mobileNumber', application.mobileNumber)}</p>
                                                                    </div>
                                                                    <div className="bg-gray-50 rounded-lg p-3">
                                                                        <p className="text-xs text-gray-500 mb-1">City</p>
                                                                        <p className="text-sm font-medium text-gray-900">{formatFieldValue('city', application.city)}</p>
                                                                    </div>
                                                                    <div className="bg-gray-50 rounded-lg p-3">
                                                                        <p className="text-xs text-gray-500 mb-1">State</p>
                                                                        <p className="text-sm font-medium text-gray-900">{formatFieldValue('state', application.state)}</p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Business Information */}
                                                            <div className="bg-white rounded-lg p-4 md:p-5 border border-gray-200">
                                                                <h4 className="text-sm md:text-base font-semibold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
                                                                    <svg className="w-4 h-4 md:w-5 md:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                                    </svg>
                                                                    Business Information
                                                                </h4>
                                                                <div className="space-y-3 md:space-y-4">
                                                                    <div className="bg-gray-50 rounded-lg p-3">
                                                                        <p className="text-xs text-gray-500 mb-1">Currently Running Business</p>
                                                                        <p className="text-sm font-medium text-gray-900">{formatFieldValue('currentlyRunningBusiness', application.currentlyRunningBusiness)}</p>
                                                                    </div>
                                                                    {application.currentlyRunningBusiness === 'yes' && (
                                                                        <>
                                                                            {application.msmeUdyamNumber && (
                                                                                <div className="bg-gray-50 rounded-lg p-3">
                                                                                    <p className="text-xs text-gray-500 mb-1">MSME/Udyam Registration Number</p>
                                                                                    <p className="text-sm font-medium text-gray-900">{formatFieldValue('msmeUdyamNumber', application.msmeUdyamNumber)}</p>
                                                                                </div>
                                                                            )}
                                                                            {application.businessDocuments && (
                                                                                <div className="bg-gray-50 rounded-lg p-3">
                                                                                    <p className="text-xs text-gray-500 mb-1">Business Documents</p>
                                                                                    <button
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation();
                                                                                            viewDocument(application.businessDocuments);
                                                                                        }}
                                                                                        className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-xs md:text-sm rounded-lg hover:bg-blue-700 transition-colors"
                                                                                    >
                                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                                        </svg>
                                                                                        View Document
                                                                                    </button>
                                                                                </div>
                                                                            )}
                                                                            {application.businessRegistrationType && (
                                                                                <div className="bg-gray-50 rounded-lg p-3">
                                                                                    <p className="text-xs text-gray-500 mb-1">Business Registration Type</p>
                                                                                    <p className="text-sm font-medium text-gray-900">{formatFieldValue('businessRegistrationType', application.businessRegistrationType)}</p>
                                                                                </div>
                                                                            )}
                                                                        </>
                                                                    )}
                                                                    <div className="bg-gray-50 rounded-lg p-3">
                                                                        <p className="text-xs text-gray-500 mb-1">Business Type</p>
                                                                        <p className="text-sm font-medium text-gray-900">
                                                                            {application.businessType === 'other' 
                                                                                ? formatFieldValue('businessTypeOther', application.businessTypeOther)
                                                                                : formatFieldValue('businessType', application.businessType)}
                                                                        </p>
                                                                    </div>
                                                                    <div className="bg-gray-50 rounded-lg p-3">
                                                                        <p className="text-xs text-gray-500 mb-1">Business Name/Brand Name</p>
                                                                        <p className="text-sm font-medium text-gray-900">{formatFieldValue('businessName', application.businessName)}</p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Loan Information */}
                                                            <div className="bg-white rounded-lg p-4 md:p-5 border border-gray-200">
                                                                <h4 className="text-sm md:text-base font-semibold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
                                                                    <svg className="w-4 h-4 md:w-5 md:h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                    Loan Information
                                                                </h4>
                                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                                                                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-3 md:p-4 border border-purple-200">
                                                                        <p className="text-xs text-gray-600 mb-1">Loan Amount Required</p>
                                                                        <p className="text-lg md:text-xl font-bold text-purple-700">{formatFieldValue('loanAmount', application.loanAmount)}</p>
                                                                    </div>
                                                                    <div className="bg-gray-50 rounded-lg p-3 md:p-4">
                                                                        <p className="text-xs text-gray-500 mb-1">Loan Purpose</p>
                                                                        <p className="text-sm font-medium text-gray-900">
                                                                            {application.loanPurpose === 'other'
                                                                                ? formatFieldValue('loanPurposeOther', application.loanPurposeOther)
                                                                                : formatFieldValue('loanPurpose', application.loanPurpose)}
                                                                        </p>
                                                                    </div>
                                                                    <div className="bg-gray-50 rounded-lg p-3 md:p-4">
                                                                        <p className="text-xs text-gray-500 mb-1">Loan Type</p>
                                                                        <p className="text-sm font-medium text-gray-900">
                                                                            {application.loanType === 'other'
                                                                                ? formatFieldValue('loanTypeOther', application.loanTypeOther)
                                                                                : formatFieldValue('loanType', application.loanType)}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* No Results - Show only when not viewing applicants */}
                {!showApplicantsView && filteredSchemes.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-200"
                    >
                        <div className="text-gray-500 text-lg">No schemes found</div>
                        <p className="text-gray-400 mt-2">Try adjusting your search or create a new scheme</p>
                    </motion.div>
                )}
            </div>

            {/* Create Scheme Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowCreateModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Create New Loan Scheme</h2>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Basic Information */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Basic Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Scheme Name *</label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="Enter full scheme name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                                            <select
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            >
                                                <option value="startup">Startup</option>
                                                <option value="msme">MSME</option>
                                                <option value="women">Women</option>
                                                <option value="women-sc-st">Women & SC/ST</option>
                                                <option value="sc-st">SC/ST</option>
                                                <option value="agriculture">Agriculture</option>
                                                <option value="all">All</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                rows="3"
                                                placeholder="Enter detailed description"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Processing Time</label>
                                            <input
                                                type="text"
                                                value={formData.processingTime}
                                                onChange={(e) => setFormData({ ...formData, processingTime: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="e.g., 15-30 days"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Financial Details */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">💰 Financial Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Amount *</label>
                                            <input
                                                type="number"
                                                value={formData.minAmount}
                                                onChange={(e) => setFormData({ ...formData, minAmount: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="Enter minimum amount"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Amount *</label>
                                            <input
                                                type="number"
                                                value={formData.maxAmount}
                                                onChange={(e) => setFormData({ ...formData, maxAmount: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="Enter maximum amount"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate</label>
                                            <input
                                                type="text"
                                                value={formData.interestRate}
                                                onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="e.g., 8.5% per annum"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Tenure</label>
                                            <input
                                                type="text"
                                                value={formData.tenure}
                                                onChange={(e) => setFormData({ ...formData, tenure: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="e.g., Up to 5 years"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Processing Time</label>
                                            <input
                                                type="text"
                                                value={formData.processingTime}
                                                onChange={(e) => setFormData({ ...formData, processingTime: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="e.g., 15-30 days"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Visual Elements */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">🖼️ Visual Elements</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Scheme Image</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            />
                                            {imagePreview && (
                                                <div className="mt-2">
                                                    <img src={imagePreview} alt="Preview" className="h-24 w-24 object-cover rounded-lg" />
                                                </div>
                                            )}
                                            {formData.imageUrl && !imagePreview && (
                                                <div className="mt-2">
                                                    <p className="text-xs text-gray-500">Current image: {formData.imageUrl}</p>
                                                    <img src={formData.imageUrl} alt="Current" className="h-24 w-24 object-cover rounded-lg mt-1" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
                                            <input
                                                type="text"
                                                value={formData.heading}
                                                onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="Enter scheme heading"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Processing Time</label>
                                            <input
                                                type="text"
                                                value={formData.processingTime}
                                                onChange={(e) => setFormData({ ...formData, processingTime: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="e.g., 15-30 days"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Links and Media */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">🔗 Links & Media</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Official Website Link *</label>
                                            <input
                                                type="url"
                                                value={formData.officialLink}
                                                onChange={(e) => setFormData({ ...formData, officialLink: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="https://example.com"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">This link is displayed on the loan detail page</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Video URL (YouTube)</label>
                                            <input
                                                type="url"
                                                value={formData.videoUrl}
                                                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="https://www.youtube.com/embed/..."
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Optional: YouTube embed URL for loan information video</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Processing Time</label>
                                            <input
                                                type="text"
                                                value={formData.processingTime}
                                                onChange={(e) => setFormData({ ...formData, processingTime: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="e.g., 15-30 days"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Benefits */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">✅ Benefits</h3>
                                    <div className="space-y-2">
                                        {formData.benefits.map((benefit, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <input
                                                    type="text"
                                                    value={benefit}
                                                    onChange={(e) => updateArrayItem('benefits', index, e.target.value)}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                    placeholder="Enter benefit"
                                                />
                                                <button
                                                    onClick={() => removeArrayItem('benefits', index)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => addArrayItem('benefits')}
                                            className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-orange-500 hover:text-orange-600 transition-colors"
                                        >
                                            + Add Benefit
                                        </button>
                                    </div>
                                </div>

                                {/* Eligibility Criteria */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Eligibility Criteria (Displayed on loan detail page)</h3>
                                    <div className="space-y-2">
                                        {formData.eligibility.map((criteria, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <input
                                                    type="text"
                                                    value={criteria}
                                                    onChange={(e) => updateArrayItem('eligibility', index, e.target.value)}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                    placeholder="Enter eligibility criteria"
                                                />
                                                <button
                                                    onClick={() => removeArrayItem('eligibility', index)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => addArrayItem('eligibility')}
                                            className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-orange-500 hover:text-orange-600 transition-colors"
                                        >
                                            + Add Eligibility Criteria
                                        </button>
                                    </div>
                                </div>

                                {/* Required Documents */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📄 Required Documents (Displayed on loan detail page)</h3>
                                    <div className="space-y-2">
                                        {formData.documents.map((document, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <input
                                                    type="text"
                                                    value={document}
                                                    onChange={(e) => updateArrayItem('documents', index, e.target.value)}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                    placeholder="Enter required document"
                                                />
                                                <button
                                                    onClick={() => removeArrayItem('documents', index)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => addArrayItem('documents')}
                                            className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-orange-500 hover:text-orange-600 transition-colors"
                                        >
                                            + Add Required Document
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateScheme}
                                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                                >
                                    Create Scheme
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Edit Scheme Modal */}
            <AnimatePresence>
                {showEditModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowEditModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Edit Loan Scheme - {editingScheme?.name}</h2>
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Same form structure as create modal */}
                            <div className="space-y-6">
                                {/* Basic Information */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Basic Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Scheme Name *</label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="Enter full scheme name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                                            <select
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            >
                                                <option value="startup">Startup</option>
                                                <option value="msme">MSME</option>
                                                <option value="women">Women</option>
                                                <option value="women-sc-st">Women & SC/ST</option>
                                                <option value="sc-st">SC/ST</option>
                                                <option value="agriculture">Agriculture</option>
                                                <option value="all">All</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                rows="3"
                                                placeholder="Enter detailed description"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Processing Time</label>
                                            <input
                                                type="text"
                                                value={formData.processingTime}
                                                onChange={(e) => setFormData({ ...formData, processingTime: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="e.g., 15-30 days"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Financial Details */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">💰 Financial Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Amount *</label>
                                            <input
                                                type="number"
                                                value={formData.minAmount}
                                                onChange={(e) => setFormData({ ...formData, minAmount: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="Enter minimum amount"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Amount *</label>
                                            <input
                                                type="number"
                                                value={formData.maxAmount}
                                                onChange={(e) => setFormData({ ...formData, maxAmount: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="Enter maximum amount"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate</label>
                                            <input
                                                type="text"
                                                value={formData.interestRate}
                                                onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="e.g., 8.5% per annum"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Tenure</label>
                                            <input
                                                type="text"
                                                value={formData.tenure}
                                                onChange={(e) => setFormData({ ...formData, tenure: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="e.g., Up to 5 years"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Processing Time</label>
                                            <input
                                                type="text"
                                                value={formData.processingTime}
                                                onChange={(e) => setFormData({ ...formData, processingTime: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="e.g., 15-30 days"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Visual Elements */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">🖼️ Visual Elements</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Scheme Image</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            />
                                            {imagePreview && (
                                                <div className="mt-2">
                                                    <img src={imagePreview} alt="Preview" className="h-24 w-24 object-cover rounded-lg" />
                                                </div>
                                            )}
                                            {formData.imageUrl && !imagePreview && (
                                                <div className="mt-2">
                                                    <p className="text-xs text-gray-500">Current image: {formData.imageUrl}</p>
                                                    <img src={formData.imageUrl} alt="Current" className="h-24 w-24 object-cover rounded-lg mt-1" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
                                            <input
                                                type="text"
                                                value={formData.heading}
                                                onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="Enter scheme heading"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Processing Time</label>
                                            <input
                                                type="text"
                                                value={formData.processingTime}
                                                onChange={(e) => setFormData({ ...formData, processingTime: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="e.g., 15-30 days"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Links and Media */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">🔗 Links & Media</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Official Website Link *</label>
                                            <input
                                                type="url"
                                                value={formData.officialLink}
                                                onChange={(e) => setFormData({ ...formData, officialLink: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="https://example.com"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">This link is displayed on the loan detail page</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Video URL (YouTube)</label>
                                            <input
                                                type="url"
                                                value={formData.videoUrl}
                                                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="https://www.youtube.com/embed/..."
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Optional: YouTube embed URL for loan information video</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Processing Time</label>
                                            <input
                                                type="text"
                                                value={formData.processingTime}
                                                onChange={(e) => setFormData({ ...formData, processingTime: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="e.g., 15-30 days"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Benefits */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">✅ Benefits</h3>
                                    <div className="space-y-2">
                                        {formData.benefits.map((benefit, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <input
                                                    type="text"
                                                    value={benefit}
                                                    onChange={(e) => updateArrayItem('benefits', index, e.target.value)}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                    placeholder="Enter benefit"
                                                />
                                                <button
                                                    onClick={() => removeArrayItem('benefits', index)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => addArrayItem('benefits')}
                                            className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-orange-500 hover:text-orange-600 transition-colors"
                                        >
                                            + Add Benefit
                                        </button>
                                    </div>
                                </div>

                                {/* Eligibility */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Eligibility Criteria</h3>
                                    <div className="space-y-2">
                                        {formData.eligibility.map((criteria, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <input
                                                    type="text"
                                                    value={criteria}
                                                    onChange={(e) => updateArrayItem('eligibility', index, e.target.value)}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                    placeholder="Enter eligibility criteria"
                                                />
                                                <button
                                                    onClick={() => removeArrayItem('eligibility', index)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => addArrayItem('eligibility')}
                                            className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-orange-500 hover:text-orange-600 transition-colors"
                                        >
                                            + Add Eligibility Criteria
                                        </button>
                                    </div>
                                </div>

                                {/* Required Documents */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📄 Required Documents</h3>
                                    <div className="space-y-2">
                                        {formData.documents.map((document, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <input
                                                    type="text"
                                                    value={document}
                                                    onChange={(e) => updateArrayItem('documents', index, e.target.value)}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                    placeholder="Enter required document"
                                                />
                                                <button
                                                    onClick={() => removeArrayItem('documents', index)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => addArrayItem('documents')}
                                            className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-orange-500 hover:text-orange-600 transition-colors"
                                        >
                                            + Add Required Document
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdateScheme}
                                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                                >
                                    Update Scheme
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>


            {/* Document Preview Modal */}
            <AnimatePresence>
                {documentPreview && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
                        onClick={closeDocumentPreview}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-xl md:rounded-2xl shadow-2xl border border-gray-200 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 flex-shrink-0">
                                <h2 className="text-lg md:text-xl font-bold text-gray-900">Document Preview</h2>
                                <button
                                    onClick={closeDocumentPreview}
                                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Document Content */}
                            <div className="flex-1 overflow-auto p-4 md:p-6 flex items-center justify-center bg-gray-50">
                                {documentPreview && (
                                    <div className="w-full h-full flex items-center justify-center">
                                        {(() => {
                                            const isPDF = documentPreview.toLowerCase().includes('pdf') || 
                                                         documentPreview.toLowerCase().includes('application/pdf') ||
                                                         (documentPreview.startsWith('data:') && documentPreview.includes('application/pdf'));
                                            const isImage = documentPreview.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/) || 
                                                          documentPreview.toLowerCase().includes('image/') ||
                                                          (documentPreview.startsWith('data:') && documentPreview.includes('image/'));
                                            
                                            if (isPDF) {
                                                return (
                                                    <iframe
                                                        src={documentPreview}
                                                        className="w-full h-[600px] border border-gray-300 rounded-lg"
                                                        title="Document Preview"
                                                    />
                                                );
                                            } else if (isImage) {
                                                return (
                                                    <img
                                                        src={documentPreview}
                                                        alt="Document Preview"
                                                        className="max-w-full max-h-[600px] object-contain rounded-lg shadow-lg"
                                                    />
                                                );
                                            } else {
                                                return (
                                                    <div className="text-center p-8">
                                                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        <p className="text-gray-600 mb-4">Document preview not available</p>
                                                        <a
                                                            href={documentPreview}
                                                            download
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                            </svg>
                                                            Download Document
                                                        </a>
                                                    </div>
                                                );
                                            }
                                        })()}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminLoansPage;