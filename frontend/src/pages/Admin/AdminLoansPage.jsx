import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminLoansAPI, loansAPI } from '../../utils/api';

const AdminLoansPage = () => {
    const [schemes, setSchemes] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingScheme, setEditingScheme] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Form state for create/edit
    const [formData, setFormData] = useState({
        name: '',
        shortName: '',
        description: '',
        provider: '',
        category: 'MSME',
        minAmount: '',
        maxAmount: '',
        interestRate: '',
        tenure: '',
        icon: '💰',
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
                setIsLoading(true);
                const res = await loansAPI.getSchemes({ limit: 100 });
                setSchemes(res.data || []);
            } catch (e) {
                setError(e.message || 'Failed to load schemes');
            } finally {
                setIsLoading(false);
            }
        };
        loadSchemes();
    }, []);

    // Filter schemes based on search
    const filteredSchemes = schemes.filter(scheme =>
        (scheme.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (scheme.shortName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (scheme.provider || '').toLowerCase().includes(searchTerm.toLowerCase())
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
            shortName: scheme.shortName,
            description: scheme.description,
            provider: scheme.provider,
            category: scheme.category,
            minAmount: scheme.minAmount.toString(),
            maxAmount: scheme.maxAmount.toString(),
            interestRate: scheme.interestRate || '',
            tenure: scheme.tenure || '',
            icon: scheme.icon,
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
            shortName: '',
            description: '',
            provider: '',
            category: 'MSME',
            minAmount: '',
            maxAmount: '',
            interestRate: '',
            tenure: '',
            icon: '💰',
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
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Loan Schemes Management</h1>
                        <p className="text-gray-600 mt-1">Manage all loan schemes and applications</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <div className="text-sm text-gray-500">Total Schemes</div>
                            <div className="text-2xl font-bold text-orange-600">{schemes.length}</div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="space-y-6">
                {/* Search and Create Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6"
                >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search schemes by name, provider, or category..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                resetForm();
                                setShowCreateModal(true);
                            }}
                            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold shadow-lg"
                        >
                            ➕ Create New Scheme
                        </motion.button>
                    </div>
                </motion.div>

                {/* Schemes Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {filteredSchemes.map((scheme, index) => (
                        <motion.div
                            key={scheme._id || scheme.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                            whileHover={{ scale: 1.02, y: -4 }}
                            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300"
                        >
                            {/* Scheme Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="text-3xl">{scheme.icon}</div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{scheme.shortName}</h3>
                                        <p className="text-sm text-gray-600">{scheme.provider}</p>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleEditScheme(scheme)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Edit Scheme"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </motion.button>
                                </div>
                            </div>

                            {/* Scheme Details */}
                            <div className="space-y-3 mb-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700">Full Name</h4>
                                    <p className="text-sm text-gray-900">{scheme.name}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700">Description</h4>
                                    <p className="text-sm text-gray-600 line-clamp-2">{scheme.description}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700">Amount Range</h4>
                                        <p className="text-sm text-gray-900">
                                            ₹{scheme.minAmount.toLocaleString()} - ₹{scheme.maxAmount.toLocaleString()}
                                        </p>
                                    </div>
                                    <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                                        {scheme.category}
                                    </span>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-xs text-gray-500">Active</span>
                                </div>
                                <div className="text-xs text-gray-500">
                                    {scheme.benefits?.length || 0} benefits
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* No Results */}
                {filteredSchemes.length === 0 && (
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
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Short Name *</label>
                                            <input
                                                type="text"
                                                value={formData.shortName}
                                                onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="Enter short name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Provider *</label>
                                            <input
                                                type="text"
                                                value={formData.provider}
                                                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="Enter provider name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                                            <select
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            >
                                                <option value="MSME">MSME</option>
                                                <option value="Startup">Startup</option>
                                                <option value="Women & SC/ST">Women & SC/ST</option>
                                                <option value="Agriculture">Agriculture</option>
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
                                    </div>
                                </div>

                                {/* Visual Elements */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">🖼️ Visual Elements</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                                            <input
                                                type="text"
                                                value={formData.icon}
                                                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="e.g., 💰"
                                            />
                                        </div>
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
                                <h2 className="text-2xl font-bold text-gray-900">Edit Loan Scheme - {editingScheme?.shortName}</h2>
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
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Short Name *</label>
                                            <input
                                                type="text"
                                                value={formData.shortName}
                                                onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="Enter short name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Provider *</label>
                                            <input
                                                type="text"
                                                value={formData.provider}
                                                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="Enter provider name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                                            <select
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            >
                                                <option value="MSME">MSME</option>
                                                <option value="Startup">Startup</option>
                                                <option value="Women & SC/ST">Women & SC/ST</option>
                                                <option value="Agriculture">Agriculture</option>
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
                                    </div>
                                </div>

                                {/* Visual Elements */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">🖼️ Visual Elements</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                                            <input
                                                type="text"
                                                value={formData.icon}
                                                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="e.g., 💰"
                                            />
                                        </div>
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
        </div>
    );
};

export default AdminLoansPage;