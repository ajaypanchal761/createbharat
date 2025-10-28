import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLegalPage = () => {
    const [legalServices, setLegalServices] = useState([
        {
            id: 1,
            name: 'Company Registration',
            description: 'Complete company registration process including LLP, Private Limited, and Public Limited companies',
            icon: '🏢',
            category: 'Business',
            price: '₹15,000',
            duration: '15-30 days',
            featured: true,
            popular: true,
            heading: 'Professional Company Registration Services',
            paragraph: 'Get your business registered with expert legal guidance and comprehensive support throughout the process.',
            benefits: ['Legal Protection', 'Tax Benefits', 'Business Credibility', 'Access to Funding'],
            process: ['Document Collection', 'Application Submission', 'Government Processing', 'Certificate Issuance'],
            requiredDocuments: ['PAN Card', 'Aadhaar Card', 'Address Proof', 'Business Plan'],
            timeline: '15-30 days',
            fee: '₹15,000'
        },
        {
            id: 2,
            name: 'Trademark Registration',
            description: 'Protect your brand with comprehensive trademark registration and monitoring',
            icon: '™️',
            category: 'Intellectual Property',
            price: '₹4,500',
            duration: '6-12 months',
            featured: true,
            popular: false,
            heading: 'Secure Your Brand Identity',
            paragraph: 'Protect your intellectual property with our comprehensive trademark registration services.',
            benefits: ['Brand Protection', 'Legal Rights', 'Market Exclusivity', 'Asset Value'],
            process: ['Trademark Search', 'Application Filing', 'Examination', 'Registration'],
            requiredDocuments: ['Trademark Design', 'Business Registration', 'Power of Attorney', 'User Affidavit'],
            timeline: '6-12 months',
            fee: '₹4,500'
        },
        {
            id: 3,
            name: 'Patent Filing',
            description: 'File patents for your innovations with expert guidance and documentation',
            icon: '📋',
            category: 'Intellectual Property',
            price: '₹25,000',
            duration: '18-24 months',
            featured: false,
            popular: true,
            heading: 'Protect Your Innovations',
            paragraph: 'Secure patent protection for your inventions with expert legal assistance.',
            benefits: ['Innovation Protection', 'Market Monopoly', 'Revenue Generation', 'Competitive Advantage'],
            process: ['Patent Search', 'Documentation', 'Application Filing', 'Examination Process'],
            requiredDocuments: ['Patent Specification', 'Technical Drawings', 'Abstract', 'Claims'],
            timeline: '18-24 months',
            fee: '₹25,000'
        },
        {
            id: 4,
            name: 'GST Registration',
            description: 'Complete GST registration and compliance for your business',
            icon: '📊',
            category: 'Tax',
            price: '₹2,000',
            duration: '7-15 days',
            featured: true,
            popular: true,
            heading: 'Streamlined GST Registration',
            paragraph: 'Get GST registered quickly and efficiently with our expert guidance.',
            benefits: ['Tax Compliance', 'Input Credit', 'Business Legitimacy', 'Government Benefits'],
            process: ['Document Preparation', 'Online Application', 'Verification', 'Certificate Generation'],
            requiredDocuments: ['PAN Card', 'Aadhaar Card', 'Bank Details', 'Business Address Proof'],
            timeline: '7-15 days',
            fee: '₹2,000'
        },
        {
            id: 5,
            name: 'ISO Certification',
            description: 'Get ISO certification to enhance your business credibility',
            icon: '🏆',
            category: 'Certification',
            price: '₹35,000',
            duration: '30-45 days',
            featured: false,
            popular: false,
            heading: 'Enhance Business Credibility',
            paragraph: 'Achieve ISO certification to demonstrate quality and reliability to your customers.',
            benefits: ['Quality Assurance', 'Customer Trust', 'Market Access', 'Process Improvement'],
            process: ['Gap Analysis', 'Documentation', 'Implementation', 'Audit & Certification'],
            requiredDocuments: ['Quality Manual', 'Process Documents', 'Training Records', 'Management Review'],
            timeline: '30-45 days',
            fee: '₹35,000'
        },
        {
            id: 6,
            name: 'Labour License',
            description: 'Obtain necessary labour licenses for your business operations',
            icon: '👥',
            category: 'Compliance',
            price: '₹5,000',
            duration: '10-20 days',
            featured: false,
            popular: true,
            heading: 'Compliance Made Easy',
            paragraph: 'Ensure your business meets all labour law requirements with our expert assistance.',
            benefits: ['Legal Compliance', 'Employee Protection', 'Business Continuity', 'Risk Mitigation'],
            process: ['Application Submission', 'Document Verification', 'Site Inspection', 'License Issuance'],
            requiredDocuments: ['Factory License', 'Employee Records', 'Safety Certificates', 'Compliance Reports'],
            timeline: '10-20 days',
            fee: '₹5,000'
        }
    ]);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Form state for create/edit
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        icon: '⚖️',
        category: 'Business',
        price: '',
        duration: '',
        heading: '',
        paragraph: '',
        benefits: [],
        process: [],
        requiredDocuments: [],
        timeline: '',
        fee: '',
        documentUploads: []
    });

    // Filter services based on search
    const filteredServices = legalServices.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle create new service
    const handleCreateService = () => {
        const newService = {
            id: Date.now(),
            ...formData,
            benefits: formData.benefits.filter(b => b.trim() !== ''),
            process: formData.process.filter(p => p.trim() !== ''),
            requiredDocuments: formData.requiredDocuments.filter(d => d.trim() !== ''),
            documentUploads: formData.documentUploads.filter(u => u.trim() !== ''),
            featured: false,
            popular: false
        };
        
        setLegalServices([...legalServices, newService]);
        setShowCreateModal(false);
        resetForm();
    };

    // Handle edit service
    const handleEditService = (service) => {
        setEditingService(service);
        setFormData({
            name: service.name,
            description: service.description,
            icon: service.icon,
            category: service.category,
            price: service.price,
            duration: service.duration,
            heading: service.heading || '',
            paragraph: service.paragraph || '',
            benefits: service.benefits || [],
            process: service.process || [],
            requiredDocuments: service.requiredDocuments || [],
            timeline: service.timeline || '',
            fee: service.fee || '',
            documentUploads: service.documentUploads || []
        });
        setShowEditModal(true);
    };

    // Handle update service
    const handleUpdateService = () => {
        const updatedService = {
            ...editingService,
            ...formData,
            benefits: formData.benefits.filter(b => b.trim() !== ''),
            process: formData.process.filter(p => p.trim() !== ''),
            requiredDocuments: formData.requiredDocuments.filter(d => d.trim() !== ''),
            documentUploads: formData.documentUploads.filter(u => u.trim() !== '')
        };
        
        setLegalServices(legalServices.map(service => 
            service.id === editingService.id ? updatedService : service
        ));
        setShowEditModal(false);
        setEditingService(null);
        resetForm();
    };

    // Handle delete service
    const handleDeleteService = (serviceId) => {
        if (window.confirm('Are you sure you want to delete this service?')) {
            setLegalServices(legalServices.filter(service => service.id !== serviceId));
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            icon: '⚖️',
            category: 'Business',
            price: '',
            duration: '',
            heading: '',
            paragraph: '',
            benefits: [],
            process: [],
            requiredDocuments: [],
            timeline: '',
            fee: '',
            documentUploads: []
        });
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
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Legal Services Management</h1>
                        <p className="text-gray-600 mt-1">Manage all legal services and consultations</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <div className="text-sm text-gray-500">Total Services</div>
                            <div className="text-2xl font-bold text-orange-600">{legalServices.length}</div>
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
                                placeholder="Search services by name, description, or category..."
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
                            ➕ Create New Service
                        </motion.button>
                    </div>
                </motion.div>

                {/* Services Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {filteredServices.map((service, index) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                            whileHover={{ scale: 1.02, y: -4 }}
                            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300"
                        >
                            {/* Service Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="text-3xl">{service.icon}</div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                                        <p className="text-sm text-gray-600">{service.category}</p>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleEditService(service)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Edit Service"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleDeleteService(service.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete Service"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </motion.button>
                                </div>
                            </div>

                            {/* Service Details */}
                            <div className="space-y-3 mb-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700">Description</h4>
                                    <p className="text-sm text-gray-600 line-clamp-2">{service.description}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700">Price</h4>
                                        <p className="text-sm text-gray-900 font-semibold">{service.price}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700">Duration</h4>
                                        <p className="text-sm text-gray-900">{service.duration}</p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700">Benefits</h4>
                                        <p className="text-sm text-gray-900">{service.benefits?.length || 0} benefits</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700">Documents</h4>
                                        <p className="text-sm text-gray-900">{service.requiredDocuments?.length || 0} required</p>
                                    </div>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-xs text-gray-500">Active</span>
                                </div>
                                <div className="flex space-x-1">
                                    {service.featured && (
                                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                                            ⭐ Featured
                                        </span>
                                    )}
                                    {service.popular && (
                                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                            🔥 Popular
                                        </span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* No Results */}
                {filteredServices.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-200"
                    >
                        <div className="text-gray-500 text-lg">No services found</div>
                        <p className="text-gray-400 mt-2">Try adjusting your search or create a new service</p>
                    </motion.div>
                )}
            </div>

            {/* Create Service Modal */}
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
                                <h2 className="text-2xl font-bold text-gray-900">Create New Legal Service</h2>
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
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Service Name *</label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="Enter service name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                                            <select
                                                value={formData.category}
                                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            >
                                                <option value="Business">Business</option>
                                                <option value="Intellectual Property">Intellectual Property</option>
                                                <option value="Tax">Tax</option>
                                                <option value="Certification">Certification</option>
                                                <option value="Compliance">Compliance</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                                            <input
                                                type="text"
                                                value={formData.icon}
                                                onChange={(e) => setFormData({...formData, icon: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="e.g., ⚖️"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                                            <input
                                                type="text"
                                                value={formData.price}
                                                onChange={(e) => setFormData({...formData, price: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="e.g., ₹15,000"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                                            <input
                                                type="text"
                                                value={formData.duration}
                                                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="e.g., 15-30 days"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Timeline</label>
                                            <input
                                                type="text"
                                                value={formData.timeline}
                                                onChange={(e) => setFormData({...formData, timeline: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="e.g., 15-30 days"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Fee</label>
                                            <input
                                                type="text"
                                                value={formData.fee}
                                                onChange={(e) => setFormData({...formData, fee: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="e.g., ₹15,000"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                rows="3"
                                                placeholder="Enter detailed description"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Content Information */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📄 Content Information</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
                                            <input
                                                type="text"
                                                value={formData.heading}
                                                onChange={(e) => setFormData({...formData, heading: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="Enter service heading"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Paragraph</label>
                                            <textarea
                                                value={formData.paragraph}
                                                onChange={(e) => setFormData({...formData, paragraph: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                rows="4"
                                                placeholder="Enter detailed paragraph about the service"
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

                                {/* Process */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Process</h3>
                                    <div className="space-y-2">
                                        {formData.process.map((step, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <input
                                                    type="text"
                                                    value={step}
                                                    onChange={(e) => updateArrayItem('process', index, e.target.value)}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                    placeholder="Enter process step"
                                                />
                                                <button
                                                    onClick={() => removeArrayItem('process', index)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => addArrayItem('process')}
                                            className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-orange-500 hover:text-orange-600 transition-colors"
                                        >
                                            + Add Process Step
                                        </button>
                                    </div>
                                </div>

                                {/* Required Documents */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📄 Required Documents</h3>
                                    <div className="space-y-2">
                                        {formData.requiredDocuments.map((document, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <input
                                                    type="text"
                                                    value={document}
                                                    onChange={(e) => updateArrayItem('requiredDocuments', index, e.target.value)}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                    placeholder="Enter required document"
                                                />
                                                <button
                                                    onClick={() => removeArrayItem('requiredDocuments', index)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => addArrayItem('requiredDocuments')}
                                            className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-orange-500 hover:text-orange-600 transition-colors"
                                        >
                                            + Add Required Document
                                        </button>
                                    </div>
                                </div>

                                {/* Document Upload Fields */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📤 Document Upload Fields</h3>
                                    <div className="space-y-2">
                                        {formData.documentUploads.map((upload, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <input
                                                    type="text"
                                                    value={upload}
                                                    onChange={(e) => updateArrayItem('documentUploads', index, e.target.value)}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                    placeholder="Enter upload field name"
                                                />
                                                <button
                                                    onClick={() => removeArrayItem('documentUploads', index)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => addArrayItem('documentUploads')}
                                            className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-orange-500 hover:text-orange-600 transition-colors"
                                        >
                                            + Add Upload Field
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
                                    onClick={handleCreateService}
                                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                                >
                                    Create Service
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Edit Service Modal */}
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
                                <h2 className="text-2xl font-bold text-gray-900">Edit Legal Service - {editingService?.name}</h2>
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
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Service Name *</label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="Enter service name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                                            <select
                                                value={formData.category}
                                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            >
                                                <option value="Business">Business</option>
                                                <option value="Intellectual Property">Intellectual Property</option>
                                                <option value="Tax">Tax</option>
                                                <option value="Certification">Certification</option>
                                                <option value="Compliance">Compliance</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                                            <input
                                                type="text"
                                                value={formData.icon}
                                                onChange={(e) => setFormData({...formData, icon: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="e.g., ⚖️"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                                            <input
                                                type="text"
                                                value={formData.price}
                                                onChange={(e) => setFormData({...formData, price: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="e.g., ₹15,000"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                                            <input
                                                type="text"
                                                value={formData.duration}
                                                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="e.g., 15-30 days"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Timeline</label>
                                            <input
                                                type="text"
                                                value={formData.timeline}
                                                onChange={(e) => setFormData({...formData, timeline: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="e.g., 15-30 days"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Fee</label>
                                            <input
                                                type="text"
                                                value={formData.fee}
                                                onChange={(e) => setFormData({...formData, fee: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="e.g., ₹15,000"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                rows="3"
                                                placeholder="Enter detailed description"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Content Information */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📄 Content Information</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
                                            <input
                                                type="text"
                                                value={formData.heading}
                                                onChange={(e) => setFormData({...formData, heading: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="Enter service heading"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Paragraph</label>
                                            <textarea
                                                value={formData.paragraph}
                                                onChange={(e) => setFormData({...formData, paragraph: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                rows="4"
                                                placeholder="Enter detailed paragraph about the service"
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

                                {/* Process */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Process</h3>
                                    <div className="space-y-2">
                                        {formData.process.map((step, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <input
                                                    type="text"
                                                    value={step}
                                                    onChange={(e) => updateArrayItem('process', index, e.target.value)}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                    placeholder="Enter process step"
                                                />
                                                <button
                                                    onClick={() => removeArrayItem('process', index)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => addArrayItem('process')}
                                            className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-orange-500 hover:text-orange-600 transition-colors"
                                        >
                                            + Add Process Step
                                        </button>
                                    </div>
                                </div>

                                {/* Required Documents */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📄 Required Documents</h3>
                                    <div className="space-y-2">
                                        {formData.requiredDocuments.map((document, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <input
                                                    type="text"
                                                    value={document}
                                                    onChange={(e) => updateArrayItem('requiredDocuments', index, e.target.value)}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                    placeholder="Enter required document"
                                                />
                                                <button
                                                    onClick={() => removeArrayItem('requiredDocuments', index)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => addArrayItem('requiredDocuments')}
                                            className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-orange-500 hover:text-orange-600 transition-colors"
                                        >
                                            + Add Required Document
                                        </button>
                                    </div>
                                </div>

                                {/* Document Upload Fields */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📤 Document Upload Fields</h3>
                                    <div className="space-y-2">
                                        {formData.documentUploads.map((upload, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <input
                                                    type="text"
                                                    value={upload}
                                                    onChange={(e) => updateArrayItem('documentUploads', index, e.target.value)}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                    placeholder="Enter upload field name"
                                                />
                                                <button
                                                    onClick={() => removeArrayItem('documentUploads', index)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => addArrayItem('documentUploads')}
                                            className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-orange-500 hover:text-orange-600 transition-colors"
                                        >
                                            + Add Upload Field
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
                                    onClick={handleUpdateService}
                                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                                >
                                    Update Service
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminLegalPage;