import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FaGavel, 
  FaFileUpload, 
  FaUsers, 
  FaSignOutAlt,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch
} from 'react-icons/fa';

const CADashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('services');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [showSubmissionDetail, setShowSubmissionDetail] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  
  // Mock Data - All Legal Services
  const [legalServices, setLegalServices] = useState([
    {
      id: 1,
      name: 'GST Registration',
      icon: '📋',
      category: 'Tax',
      price: '₹1,999',
      duration: '5-7 days',
      description: 'Complete GST registration process for your business',
      heading: 'Professional GST Registration',
      paragraph: 'Get your business GST registered with expert guidance',
      benefits: ['Tax Compliance', 'Input Credit', 'Business Legitimacy'],
      process: ['Document Collection', 'Application Submission', 'Certificate Generation'],
      requiredDocuments: ['PAN Card', 'Aadhaar Card', 'Bank Details'],
      documentUploads: ['PAN Card Copy', 'Aadhaar Card Copy', 'Bank Statement'],
      active: true,
      submissions: 12
    },
    {
      id: 2,
      name: 'Company Registration',
      icon: '🏢',
      category: 'Business',
      price: '₹15,000',
      duration: '15-30 days',
      description: 'Complete company registration including Private Limited, LLP',
      heading: 'Professional Company Registration',
      paragraph: 'Get your business registered with expert legal guidance',
      benefits: ['Legal Protection', 'Tax Benefits', 'Business Credibility'],
      process: ['Document Collection', 'Application Submission', 'Certificate Issuance'],
      requiredDocuments: ['PAN Card', 'Aadhaar Card', 'Address Proof', 'Business Plan'],
      documentUploads: ['Director PAN', 'Director Aadhaar', 'Address Proof', 'MOA/AOA'],
      active: true,
      submissions: 8
    },
    {
      id: 3,
      name: 'Trademark Registration',
      icon: '™️',
      category: 'IP Rights',
      price: '₹4,500',
      duration: '6-12 months',
      description: 'Protect your brand with comprehensive trademark registration',
      heading: 'Secure Your Brand Identity',
      paragraph: 'Protect your intellectual property with trademark registration',
      benefits: ['Brand Protection', 'Legal Rights', 'Market Exclusivity'],
      process: ['Trademark Search', 'Application Filing', 'Examination', 'Registration'],
      requiredDocuments: ['Trademark Design', 'Business Registration', 'Power of Attorney'],
      documentUploads: ['Logo/Design', 'Business Certificate', 'POA Document'],
      active: true,
      submissions: 5
    },
    {
      id: 4,
      name: 'ISO Certification',
      icon: '🏆',
      category: 'Certification',
      price: '₹35,000',
      duration: '30-45 days',
      description: 'Get ISO certification to enhance your business credibility',
      heading: 'Enhance Business Credibility',
      paragraph: 'Achieve ISO certification to demonstrate quality',
      benefits: ['Quality Assurance', 'Customer Trust', 'Market Access'],
      process: ['Gap Analysis', 'Documentation', 'Implementation', 'Audit & Certification'],
      requiredDocuments: ['Quality Manual', 'Process Documents', 'Training Records'],
      documentUploads: ['Quality Policy', 'Process Flow', 'Training Certificates'],
      active: true,
      submissions: 3
    },
    {
      id: 5,
      name: 'MSME Registration',
      icon: '🏭',
      category: 'Business',
      price: '₹999',
      duration: '3-5 days',
      description: 'Register your business as MSME for various benefits',
      heading: 'MSME Registration Benefits',
      paragraph: 'Get MSME certificate for business benefits and loans',
      benefits: ['Government Benefits', 'Easy Loans', 'Tax Benefits'],
      process: ['Application Submission', 'Document Verification', 'Certificate Generation'],
      requiredDocuments: ['PAN Card', 'Aadhaar Card', 'Business Address Proof'],
      documentUploads: ['PAN Card', 'Aadhaar', 'Address Proof'],
      active: true,
      submissions: 15
    }
  ]);
  
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
    documentUploads: []
  });

  const [userSubmissions, setUserSubmissions] = useState([
    {
      id: 1,
      userName: 'Rahul Sharma',
      serviceName: 'GST Registration',
      serviceId: 1,
      submittedDate: '2024-01-15',
      status: 'pending',
      email: 'rahul@example.com',
      phone: '9876543210',
      address: '123, Business Street, Mumbai, Maharashtra - 400001',
      documents: [
        { name: 'PAN Card Copy', url: '#', uploadedAt: '2024-01-15', fileType: 'pdf', size: '2.5 MB' },
        { name: 'Aadhaar Card Copy', url: '#', uploadedAt: '2024-01-15', fileType: 'pdf', size: '1.8 MB' },
        { name: 'Bank Statement', url: '#', uploadedAt: '2024-01-15', fileType: 'pdf', size: '3.2 MB' }
      ]
    },
    {
      id: 2,
      userName: 'Priya Patel',
      serviceName: 'Company Registration',
      serviceId: 2,
      submittedDate: '2024-01-14',
      status: 'in-progress',
      email: 'priya@example.com',
      phone: '9876543211',
      address: '456, Corporate Avenue, Delhi - 110001',
      documents: [
        { name: 'Director PAN', url: '#', uploadedAt: '2024-01-14', fileType: 'pdf', size: '2.1 MB' },
        { name: 'Director Aadhaar', url: '#', uploadedAt: '2024-01-14', fileType: 'pdf', size: '1.9 MB' },
        { name: 'Address Proof', url: '#', uploadedAt: '2024-01-14', fileType: 'pdf', size: '2.8 MB' },
        { name: 'MOA/AOA', url: '#', uploadedAt: '2024-01-14', fileType: 'pdf', size: '4.5 MB' }
      ]
    },
    {
      id: 3,
      userName: 'Amit Kumar',
      serviceName: 'Trademark Registration',
      serviceId: 3,
      submittedDate: '2024-01-13',
      status: 'pending',
      email: 'amit@example.com',
      phone: '9876543212',
      address: '789, Innovation Hub, Bangalore - 560001',
      documents: [
        { name: 'Logo/Design', url: '#', uploadedAt: '2024-01-13', fileType: 'png', size: '5.2 MB' },
        { name: 'Business Certificate', url: '#', uploadedAt: '2024-01-13', fileType: 'pdf', size: '3.1 MB' },
        { name: 'POA Document', url: '#', uploadedAt: '2024-01-13', fileType: 'pdf', size: '2.3 MB' }
      ]
    }
  ]);

  const handleLogout = () => {
    localStorage.removeItem('isCALoggedIn');
    localStorage.removeItem('userType');
    localStorage.removeItem('caEmail');
    localStorage.removeItem('caName');
    navigate('/ca/login');
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

  // Handle create new service
  const handleCreateService = () => {
    const newService = {
      id: Date.now(),
      ...formData,
      benefits: formData.benefits.filter(b => b.trim() !== ''),
      process: formData.process.filter(p => p.trim() !== ''),
      requiredDocuments: formData.requiredDocuments.filter(d => d.trim() !== ''),
      documentUploads: formData.documentUploads.filter(u => u.trim() !== ''),
      active: true,
      submissions: 0
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
      description: service.description || '',
      icon: service.icon,
      category: service.category,
      price: service.price,
      duration: service.duration,
      heading: service.heading || '',
      paragraph: service.paragraph || '',
      benefits: service.benefits || [],
      process: service.process || [],
      requiredDocuments: service.requiredDocuments || [],
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

  const addService = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const editService = (serviceId) => {
    const service = legalServices.find(s => s.id === serviceId);
    if (service) {
      handleEditService(service);
    }
  };

  const deleteService = (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      setLegalServices(legalServices.filter(s => s.id !== serviceId));
    }
  };

  // Service Form Component
  const ServiceForm = ({ isEdit = false }) => (
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter service name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Business">Business</option>
              <option value="Intellectual Property">Intellectual Property</option>
              <option value="IP Rights">IP Rights</option>
              <option value="Tax">Tax</option>
              <option value="Certification">Certification</option>
              <option value="Compliance">Compliance</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Icon (Default)</label>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) => setFormData({...formData, icon: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., ⚖️"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
            <input
              type="text"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., ₹15,000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Duration *</label>
            <input
              type="text"
              value={formData.duration}
              onChange={(e) => setFormData({...formData, duration: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 15-30 days"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter service heading"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Paragraph</label>
            <textarea
              value={formData.paragraph}
              onChange={(e) => setFormData({...formData, paragraph: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter benefit"
              />
              <button
                onClick={() => removeArrayItem('benefits', index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <FaTrash className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => addArrayItem('benefits')}
            className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
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
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter process step"
              />
              <button
                onClick={() => removeArrayItem('process', index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <FaTrash className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => addArrayItem('process')}
            className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
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
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter required document"
              />
              <button
                onClick={() => removeArrayItem('requiredDocuments', index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <FaTrash className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => addArrayItem('requiredDocuments')}
            className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
          >
            + Add Required Document
          </button>
        </div>
      </div>

      {/* Document Upload Fields */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📤 Document Upload Fields</h3>
        <p className="text-sm text-gray-600 mb-4">These are the fields that users will see when uploading documents for this service</p>
        <div className="space-y-2">
          {formData.documentUploads.map((upload, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={upload}
                onChange={(e) => updateArrayItem('documentUploads', index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter upload field name (e.g., PAN Card Copy)"
              />
              <button
                onClick={() => removeArrayItem('documentUploads', index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <FaTrash className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => addArrayItem('documentUploads')}
            className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
          >
            + Add Upload Field
          </button>
        </div>
      </div>
    </div>
  );

  const totalServices = legalServices.length;
  const totalSubmissions = userSubmissions.length;
  const pendingSubmissions = userSubmissions.filter(s => s.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">⚖️</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">CA Dashboard</h1>
                <p className="text-xs text-gray-500">Legal Services Management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {localStorage.getItem('caEmail') || 'ca@example.com'}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Services</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalServices}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FaGavel className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Submissions</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalSubmissions}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FaFileUpload className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">{pendingSubmissions}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <FaUsers className="text-orange-600 text-xl" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('services')}
              className={`flex-1 py-4 text-center font-medium transition-colors ${
                activeTab === 'services'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Legal Services
            </button>
            <button
              onClick={() => setActiveTab('submissions')}
              className={`flex-1 py-4 text-center font-medium transition-colors ${
                activeTab === 'submissions'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              User Submissions
            </button>
          </div>
        </div>

        {/* Services Tab */}
        {activeTab === 'services' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Legal Services</h2>
              <button
                onClick={addService}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                <FaPlus />
                <span>Add Service</span>
              </button>
            </div>

            <div className="space-y-4">
              {legalServices.map((service) => (
                <div
                  key={service.id}
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">{service.icon}</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{service.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span>📂 {service.category}</span>
                          <span>💰 {service.price}</span>
                          <span>⏱️ {service.duration}</span>
                          <span>📊 {service.submissions} submissions</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => editService(service.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => deleteService(service.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Submissions Tab */}
        {activeTab === 'submissions' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">User Submissions</h2>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search submissions..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {userSubmissions.map((submission) => (
                <div
                  key={submission.id}
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{submission.userName}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Service: {submission.serviceName}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                        <span>📅 {submission.submittedDate}</span>
                        <span>📧 {submission.email}</span>
                        <span>📱 {submission.phone}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        submission.status === 'pending'
                          ? 'bg-orange-100 text-orange-600'
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        {submission.status}
                      </span>
                      {submission.documents && submission.documents.length > 0 && (
                        <div className="text-xs text-gray-500">
                          📄 {submission.documents.length} documents uploaded
                        </div>
                      )}
                      <button 
                        onClick={() => {
                          setSelectedSubmission(submission);
                          setShowSubmissionDetail(true);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        View Details & Documents
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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

              <ServiceForm />

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateService}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Service
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submission Detail Modal */}
      <AnimatePresence>
        {showSubmissionDetail && selectedSubmission && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSubmissionDetail(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Submission Details</h2>
                  <p className="text-sm text-gray-600 mt-1">{selectedSubmission.serviceName}</p>
                </div>
                <button
                  onClick={() => setShowSubmissionDetail(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* User Information */}
              <div className="bg-blue-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaUsers className="text-blue-600" />
                  User Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Full Name</label>
                    <p className="text-gray-900 font-semibold mt-1">{selectedSubmission.userName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-gray-900 font-semibold mt-1">{selectedSubmission.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone</label>
                    <p className="text-gray-900 font-semibold mt-1">{selectedSubmission.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Submitted Date</label>
                    <p className="text-gray-900 font-semibold mt-1">{selectedSubmission.submittedDate}</p>
                  </div>
                  {selectedSubmission.address && (
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-600">Address</label>
                      <p className="text-gray-900 font-semibold mt-1">{selectedSubmission.address}</p>
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <div className="mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedSubmission.status === 'pending'
                        ? 'bg-orange-100 text-orange-600'
                        : selectedSubmission.status === 'in-progress'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-green-100 text-green-600'
                    }`}>
                      {selectedSubmission.status.charAt(0).toUpperCase() + selectedSubmission.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Documents Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaFileUpload className="text-green-600" />
                  Uploaded Documents ({selectedSubmission.documents?.length || 0})
                </h3>
                
                {selectedSubmission.documents && selectedSubmission.documents.length > 0 ? (
                  <div className="space-y-3">
                    {selectedSubmission.documents.map((doc, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 flex-1">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              doc.fileType === 'pdf' 
                                ? 'bg-red-100' 
                                : doc.fileType === 'png' || doc.fileType === 'jpg' 
                                ? 'bg-blue-100' 
                                : 'bg-gray-100'
                            }`}>
                              {doc.fileType === 'pdf' ? (
                                <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 truncate">{doc.name}</h4>
                              <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                                <span className="flex items-center gap-1">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                  </svg>
                                  {doc.fileType.toUpperCase()}
                                </span>
                                <span>{doc.size}</span>
                                {doc.uploadedAt && (
                                  <span>📅 {doc.uploadedAt}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => {
                                // In real app, this would open the document
                                window.open(doc.url !== '#' ? doc.url : '#', '_blank');
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Document"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => {
                                // In real app, this would download the document
                                const link = document.createElement('a');
                                link.href = doc.url !== '#' ? doc.url : '#';
                                link.download = doc.name;
                                link.click();
                              }}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Download Document"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-8 text-center">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-500">No documents uploaded yet</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowSubmissionDetail(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                {selectedSubmission.status === 'pending' && (
                  <button
                    onClick={() => {
                      setUserSubmissions(userSubmissions.map(s => 
                        s.id === selectedSubmission.id 
                          ? { ...s, status: 'in-progress' }
                          : s
                      ));
                      setSelectedSubmission({ ...selectedSubmission, status: 'in-progress' });
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Mark as In Progress
                  </button>
                )}
                {selectedSubmission.status === 'in-progress' && (
                  <button
                    onClick={() => {
                      setUserSubmissions(userSubmissions.map(s => 
                        s.id === selectedSubmission.id 
                          ? { ...s, status: 'completed' }
                          : s
                      ));
                      setSelectedSubmission({ ...selectedSubmission, status: 'completed' });
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Mark as Completed
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Service Modal */}
      <AnimatePresence>
        {showEditModal && editingService && (
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
                <h2 className="text-2xl font-bold text-gray-900">Edit Legal Service - {editingService.name}</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <ServiceForm isEdit={true} />

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateService}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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

export default CADashboard;

