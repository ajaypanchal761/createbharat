import React, { useState, useEffect, useCallback } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FaGavel,
  FaFileUpload,
  FaUsers,
  FaSignOutAlt,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch, 
  FaUserCircle
} from 'react-icons/fa';
import { caAPI, caLegalServiceAPI, caLegalSubmissionAPI } from '../../utils/api';

const CADashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('services');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isServicesLoading, setIsServicesLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [showSubmissionDetail, setShowSubmissionDetail] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Legal Services State
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

  // CA Profile Data
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    caNumber: '',
    firmName: '',
    experience: '',
    specialization: ''
  });

  const [profileFormData, setProfileFormData] = useState({
    name: '',
    email: '',
    phone: '',
    caNumber: '',
    firmName: '',
    experience: '',
    specialization: '',
    password: '',
    confirmPassword: '',
    currentPassword: ''
  });

  const [isSubmissionsLoading, setIsSubmissionsLoading] = useState(false);
  const [submissionsError, setSubmissionsError] = useState(null);
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

  // Fetch CA profile on mount
  useEffect(() => {
    if (activeTab === 'profile') {
      fetchCAProfile();
    }
  }, [activeTab]);

  // Fetch legal services on mount and when services tab is active
  useEffect(() => {
    if (activeTab === 'services') {
      fetchLegalServices();
    }
  }, [activeTab]);

  // Fetch submissions when submissions tab is active
  useEffect(() => {
    if (activeTab === 'submissions') {
      fetchSubmissions();
    }
  }, [activeTab]);

  const fetchLegalServices = async () => {
    setIsServicesLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('caToken');
      if (!token) {
        setError('CA token not found');
        setIsServicesLoading(false);
        return;
      }
      const response = await caLegalServiceAPI.getAll(token);
      if (response.success && response.data) {
        // Transform backend data to match frontend format
        const transformedServices = response.data.map(service => ({
          id: service._id,
          name: service.name,
          description: service.description,
          icon: service.icon,
          category: service.category,
          price: service.price,
          duration: service.duration,
          heading: service.heading,
          paragraph: service.paragraph,
          benefits: service.benefits || [],
          process: service.process || [],
          requiredDocuments: service.requiredDocuments || [],
          documentUploads: service.documentUploads || [],
          active: service.isActive,
          submissions: service.totalSubmissions || 0
        }));
        setLegalServices(transformedServices);
      }
    } catch (err) {
      console.error('Error fetching legal services:', err);
      setError(err.message || 'Failed to fetch legal services');
    } finally {
      setIsServicesLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    setIsSubmissionsLoading(true);
    setSubmissionsError(null);
    try {
      const token = localStorage.getItem('caToken');
      if (!token) {
        setSubmissionsError('CA token not found');
        setIsSubmissionsLoading(false);
        return;
      }
      const response = await caLegalSubmissionAPI.getAll(token);
      if (response.success && response.data) {
        // Transform backend data to match frontend format
        const transformedSubmissions = response.data.map(submission => ({
          id: submission.id || submission._id,
          userName: submission.userName || 'User',
          userEmail: submission.userEmail || '',
          userPhone: submission.userPhone || '',
          serviceName: submission.serviceName || '',
          submittedDate: submission.submittedDate || new Date().toISOString().split('T')[0],
          status: submission.status || 'pending',
          paymentStatus: submission.paymentStatus || 'pending',
          paymentAmount: submission.paymentAmount || 0,
          documents: submission.documents || [],
          category: submission.category || '',
          caNotes: submission.caNotes || '',
          rejectionReason: submission.rejectionReason || ''
        }));
        setUserSubmissions(transformedSubmissions);
      }
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setSubmissionsError(err.message || 'Failed to fetch submissions');
    } finally {
      setIsSubmissionsLoading(false);
    }
  };

  const fetchSubmissionDetails = async (submissionId) => {
    try {
      const token = localStorage.getItem('caToken');
      if (!token) {
        console.error('CA token not found');
        return;
      }

      const response = await caLegalSubmissionAPI.getById(token, submissionId);
      if (response.success && response.data && response.data.submission) {
        const submission = response.data.submission;
        const user = submission.user || {};

        // Update selectedSubmission with full details including user email and phone
        setSelectedSubmission({
          id: submission._id || submission.id,
          userName: user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`.trim()
            : user.email || 'User',
          userEmail: user.email || '',
          userPhone: user.phone || '',
          serviceName: submission.serviceName || '',
          submittedDate: submission.createdAt
            ? new Date(submission.createdAt).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })
            : submission.submittedDate || 'N/A',
          status: submission.status || 'pending',
          paymentStatus: submission.paymentStatus || 'pending',
          paymentAmount: submission.paymentAmount || 0,
          documents: submission.documents || [],
          category: submission.category || '',
          caNotes: submission.caNotes || '',
          rejectionReason: submission.rejectionReason || '',
          address: user.address || ''
        });
      }
    } catch (err) {
      console.error('Error fetching submission details:', err);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!selectedSubmission || !selectedSubmission.id) {
      alert('Submission ID not found');
      return;
    }

    setIsUpdatingStatus(true);
    try {
      const token = localStorage.getItem('caToken');
      if (!token) {
        alert('CA token not found. Please login again.');
        setIsUpdatingStatus(false);
        return;
      }

      const statusData = {
        status: newStatus,
        caNotes: selectedSubmission.caNotes || ''
      };

      const response = await caLegalSubmissionAPI.updateStatus(token, selectedSubmission.id, statusData);

      if (response.success) {
        // Update local state
        setUserSubmissions(userSubmissions.map(s =>
          s.id === selectedSubmission.id
            ? { ...s, status: newStatus }
            : s
        ));
        setSelectedSubmission({ ...selectedSubmission, status: newStatus });

        // Refresh submissions list
        await fetchSubmissions();
        alert('Status updated successfully');
      } else {
        throw new Error(response.message || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert(err.message || 'Failed to update status. Please try again.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleRejectSubmission = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    if (!selectedSubmission || !selectedSubmission.id) {
      alert('Submission ID not found');
      return;
    }

    setIsUpdatingStatus(true);
    try {
      const token = localStorage.getItem('caToken');
      if (!token) {
        alert('CA token not found. Please login again.');
        setIsUpdatingStatus(false);
        return;
      }

      const statusData = {
        status: 'rejected',
        rejectionReason: rejectionReason.trim(),
        caNotes: selectedSubmission.caNotes || ''
      };

      const response = await caLegalSubmissionAPI.updateStatus(token, selectedSubmission.id, statusData);

      if (response.success) {
        // Update local state
        setUserSubmissions(userSubmissions.map(s =>
          s.id === selectedSubmission.id
            ? { ...s, status: 'rejected', rejectionReason: rejectionReason.trim() }
            : s
        ));
        setSelectedSubmission({
          ...selectedSubmission,
          status: 'rejected',
          rejectionReason: rejectionReason.trim()
        });

        // Close reject modal and reset reason
        setShowRejectModal(false);
        setRejectionReason('');

        // Refresh submissions list
        await fetchSubmissions();
        alert('Submission rejected successfully');
      } else {
        throw new Error(response.message || 'Failed to reject submission');
      }
    } catch (err) {
      console.error('Error rejecting submission:', err);
      alert(err.message || 'Failed to reject submission. Please try again.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const fetchCAProfile = async () => {
    setIsFetching(true);
    setError('');
    try {
      const token = localStorage.getItem('caToken');
      if (!token) {
        setError('CA token not found');
        setIsFetching(false);
        return;
      }
      const response = await caAPI.getProfile(token);
      if (response.success && response.data.ca) {
        const ca = response.data.ca;
        setProfileData({
          name: ca.name || '',
          email: ca.email || '',
          phone: ca.phone || '',
          caNumber: ca.caNumber || '',
          firmName: ca.firmName || '',
          experience: ca.experience || '',
          specialization: ca.specialization || ''
        });
        setProfileFormData({
          name: ca.name || '',
          email: ca.email || '',
          phone: ca.phone || '',
          caNumber: ca.caNumber || '',
          firmName: ca.firmName || '',
          experience: ca.experience || '',
          specialization: ca.specialization || '',
          password: '',
          confirmPassword: '',
          currentPassword: ''
        });
      }
    } catch (err) {
      console.error('Error fetching CA profile:', err);
      setError(err.message || 'Failed to fetch profile');
    } finally {
      setIsFetching(false);
    }
  };

  const handleProfileChange = (e) => {
    setProfileFormData({
      ...profileFormData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error on input change
  };

  const handleProfileSave = async () => {
    setIsLoading(true);
    setError('');

    // Validate password if changing
    if (profileFormData.password) {
      if (!profileFormData.currentPassword) {
        setError('Current password is required to change password');
        setIsLoading(false);
        return;
      }
      if (profileFormData.password !== profileFormData.confirmPassword) {
        setError('New password and confirm password do not match');
        setIsLoading(false);
        return;
      }
      if (profileFormData.password.length < 6) {
        setError('Password must be at least 6 characters');
        setIsLoading(false);
        return;
      }
    }

    try {
      const token = localStorage.getItem('caToken');
      if (!token) {
        setError('CA token not found');
        setIsLoading(false);
        return;
      }

      // Prepare update data (exclude confirmPassword and empty password)
      const updateData = {
        name: profileFormData.name,
        email: profileFormData.email,
        phone: profileFormData.phone,
        caNumber: profileFormData.caNumber,
        firmName: profileFormData.firmName,
        experience: profileFormData.experience,
        specialization: profileFormData.specialization
      };

      // Only include password fields if password is being changed
      if (profileFormData.password) {
        updateData.password = profileFormData.password;
        updateData.currentPassword = profileFormData.currentPassword;
      }

      const response = await caAPI.updateProfile(token, updateData);
      if (response.success) {
        setProfileData({
          name: response.data.ca.name || '',
          email: response.data.ca.email || '',
          phone: response.data.ca.phone || '',
          caNumber: response.data.ca.caNumber || '',
          firmName: response.data.ca.firmName || '',
          experience: response.data.ca.experience || '',
          specialization: response.data.ca.specialization || ''
        });
        // Reset password fields
        setProfileFormData({
          ...profileFormData,
          password: '',
          confirmPassword: '',
          currentPassword: ''
        });
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        setError(response.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileCancel = () => {
    setProfileFormData({
      name: profileData.name,
      email: profileData.email,
      phone: profileData.phone,
      caNumber: profileData.caNumber,
      firmName: profileData.firmName,
      experience: profileData.experience,
      specialization: profileData.specialization,
      password: '',
      confirmPassword: '',
      currentPassword: ''
    });
    setIsEditing(false);
    setError('');
  };

  const handleLogout = () => {
    localStorage.removeItem('isCALoggedIn');
    localStorage.removeItem('userType');
    localStorage.removeItem('caEmail');
    localStorage.removeItem('caName');
    localStorage.removeItem('caToken');
    localStorage.removeItem('caData');
    navigate('/ca/login');
  };

  // Reset form
  const resetForm = useCallback(() => {
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
  }, []);

  // Handle form field changes
  const handleFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Add new item to array fields
  const addArrayItem = useCallback((field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  }, []);

  // Update array item
  const updateArrayItem = useCallback((field, index, value) => {
    setFormData(prev => {
      const updatedArray = [...prev[field]];
      updatedArray[index] = value;
      return {
        ...prev,
        [field]: updatedArray
      };
    });
  }, []);

  // Remove array item
  const removeArrayItem = useCallback((field, index) => {
    setFormData(prev => {
      const updatedArray = prev[field].filter((_, i) => i !== index);
      return {
        ...prev,
        [field]: updatedArray
      };
    });
  }, []);

  // Handle create new service
  const handleCreateService = async () => {
    setIsLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('caToken');
      if (!token) {
        setError('CA token not found');
        setIsLoading(false);
        return;
      }

      const serviceData = {
        name: formData.name,
        description: formData.description,
        icon: formData.icon || '⚖️',
        category: formData.category || 'Business',
        price: formData.price,
        duration: formData.duration,
        heading: formData.heading || '',
        paragraph: formData.paragraph || '',
        benefits: formData.benefits.filter(b => b.trim() !== ''),
        process: formData.process.filter(p => p.trim() !== ''),
        requiredDocuments: formData.requiredDocuments.filter(d => d.trim() !== ''),
        documentUploads: formData.documentUploads.filter(u => u.trim() !== ''),
        isActive: true
      };

      const response = await caLegalServiceAPI.create(token, serviceData);
      if (response.success) {
        await fetchLegalServices(); // Refresh services list
        setShowCreateModal(false);
        resetForm();
        alert('Service created successfully!');
      } else {
        setError(response.message || 'Failed to create service');
      }
    } catch (err) {
      console.error('Error creating service:', err);
      setError(err.message || 'Failed to create service');
    } finally {
      setIsLoading(false);
    }
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
  const handleUpdateService = async () => {
    setIsLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('caToken');
      if (!token) {
        setError('CA token not found');
        setIsLoading(false);
        return;
      }

      const serviceData = {
        name: formData.name,
        description: formData.description,
        icon: formData.icon || '⚖️',
        category: formData.category || 'Business',
        price: formData.price,
        duration: formData.duration,
        heading: formData.heading || '',
        paragraph: formData.paragraph || '',
        benefits: formData.benefits.filter(b => b.trim() !== ''),
        process: formData.process.filter(p => p.trim() !== ''),
        requiredDocuments: formData.requiredDocuments.filter(d => d.trim() !== ''),
        documentUploads: formData.documentUploads.filter(u => u.trim() !== ''),
        isActive: editingService.active
      };

      const response = await caLegalServiceAPI.update(token, editingService.id, serviceData);
      if (response.success) {
        await fetchLegalServices(); // Refresh services list
        setShowEditModal(false);
        setEditingService(null);
        resetForm();
        alert('Service updated successfully!');
      } else {
        setError(response.message || 'Failed to update service');
      }
    } catch (err) {
      console.error('Error updating service:', err);
      setError(err.message || 'Failed to update service');
    } finally {
      setIsLoading(false);
    }
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

  const deleteService = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service?')) {
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('caToken');
      if (!token) {
        setError('CA token not found');
        setIsLoading(false);
        return;
      }

      const response = await caLegalServiceAPI.delete(token, serviceId);
      if (response.success) {
        await fetchLegalServices(); // Refresh services list
        alert('Service deleted successfully!');
      } else {
        setError(response.message || 'Failed to delete service');
      }
    } catch (err) {
      console.error('Error deleting service:', err);
      setError(err.message || 'Failed to delete service');
    } finally {
      setIsLoading(false);
    }
  };


  const totalServices = legalServices.length;
  const totalSubmissions = userSubmissions.length;
  const pendingSubmissions = userSubmissions.filter(s => s.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-x-hidden">
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
        <Motion.div
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
        </Motion.div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('services')}
              className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'services'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Legal Services
            </button>
            <button
              onClick={() => setActiveTab('submissions')}
              className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'submissions'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              User Submissions
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'profile'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Profile
            </button>
          </div>
        </div>

        {/* Services Tab */}
        {activeTab === 'services' && (
          <Motion.div
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

            {error && activeTab === 'services' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl">
                {error}
              </div>
            )}

            {isServicesLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading services...</p>
              </div>
            ) : legalServices.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No services found. Click "Add Service" to create one.</p>
              </div>
            ) : (
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
            )}
          </Motion.div>
        )}

        {/* Submissions Tab */}
        {activeTab === 'submissions' && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">User Submissions</h2>
              <button
                onClick={fetchSubmissions}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                disabled={isSubmissionsLoading}
              >
                {isSubmissionsLoading ? 'Loading...' : 'Refresh'}
              </button>
            </div>

            {submissionsError && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-4">
                {submissionsError}
              </div>
            )}

            {isSubmissionsLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading submissions...</p>
              </div>
            ) : userSubmissions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No submissions found.</p>
              </div>
            ) : (
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
                          {submission.userEmail && <span>📧 {submission.userEmail}</span>}
                          {submission.userPhone && <span>📱 {submission.userPhone}</span>}
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${submission.status === 'pending'
                          ? 'bg-orange-100 text-orange-600'
                          : submission.status === 'in-progress'
                            ? 'bg-blue-100 text-blue-600'
                            : submission.status === 'rejected'
                              ? 'bg-red-100 text-red-600'
                              : 'bg-green-100 text-green-600'
                          }`}>
                          {submission.status.charAt(0).toUpperCase() + submission.status.slice(1).replace('-', ' ')}
                        </span>
                        {submission.documents && submission.documents.length > 0 && (
                          <div className="text-xs text-gray-500">
                            📄 {submission.documents.length} documents uploaded
                          </div>
                        )}
                        <button
                          onClick={async () => {
                            setSelectedSubmission(submission);
                            setShowSubmissionDetail(true);
                            // Fetch full submission details from API
                            await fetchSubmissionDetails(submission.id);
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
            )}
          </Motion.div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Profile</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <FaEdit />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleProfileCancel}
                    disabled={isLoading}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleProfileSave}
                    disabled={isLoading}
                    className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl">
                {error}
              </div>
            )}

            {isFetching ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading profile...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          value={profileFormData.name}
                          onChange={handleProfileChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      ) : (
                        <p className="text-gray-900 font-semibold">{profileData.name || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={profileFormData.email}
                          onChange={handleProfileChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      ) : (
                        <p className="text-gray-900 font-semibold">{profileData.email || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={profileFormData.phone}
                          onChange={handleProfileChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      ) : (
                        <p className="text-gray-900 font-semibold">{profileData.phone || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CA Number *</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="caNumber"
                          value={profileFormData.caNumber}
                          onChange={handleProfileChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      ) : (
                        <p className="text-gray-900 font-semibold">{profileData.caNumber || 'N/A'}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Firm Name *</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="firmName"
                          value={profileFormData.firmName}
                          onChange={handleProfileChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      ) : (
                        <p className="text-gray-900 font-semibold">{profileData.firmName || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Experience *</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="experience"
                          value={profileFormData.experience}
                          onChange={handleProfileChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., 10 years"
                          required
                        />
                      ) : (
                        <p className="text-gray-900 font-semibold">{profileData.experience || 'N/A'}</p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Specialization *</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="specialization"
                          value={profileFormData.specialization}
                          onChange={handleProfileChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., GST, Income Tax"
                          required
                        />
                      ) : (
                        <p className="text-gray-900 font-semibold">{profileData.specialization || 'N/A'}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Password Change Section (only in edit mode) */}
                {isEditing && (
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                    <p className="text-sm text-gray-600 mb-4">Leave blank if you don't want to change password</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                        <input
                          type="password"
                          name="currentPassword"
                          value={profileFormData.currentPassword}
                          onChange={handleProfileChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter current password"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                        <input
                          type="password"
                          name="password"
                          value={profileFormData.password}
                          onChange={handleProfileChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter new password"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={profileFormData.confirmPassword}
                          onChange={handleProfileChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Motion.div>
        )}
      </div>

      {/* Create Service Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              // Only close if clicking the backdrop, not the modal content
              if (e.target === e.currentTarget) {
                setShowCreateModal(false);
              }
            }}
          >
            <Motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                // Prevent modal from closing on Escape key while typing
                if (e.key === 'Escape' && e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                  e.stopPropagation();
                }
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Create New Legal Service</h2>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Service Form */}
              <div className="space-y-6">
                {/* Basic Information Section */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-xl">📋</span> Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Service Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Enter service name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        required
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Icon (Default)
                      </label>
                      <input
                        type="text"
                        name="icon"
                        value={formData.icon}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-xl"
                        placeholder="e.g., ⚖️"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="price"
                        value={formData.price}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="e.g., ₹15,000"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="duration"
                        value={formData.duration}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="e.g., 15-30 days"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                        rows="3"
                        placeholder="Enter detailed description"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Content Information Section */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-xl">📄</span> Content Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Heading
                      </label>
                      <input
                        type="text"
                        name="heading"
                        value={formData.heading}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                        placeholder="Enter service heading"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Paragraph
                      </label>
                      <textarea
                        name="paragraph"
                        value={formData.paragraph}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none"
                        rows="4"
                        placeholder="Enter detailed paragraph about the service"
                      />
                    </div>
                  </div>
                </div>

                {/* Benefits Section */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-xl">✅</span> Benefits
                  </h3>
                  <div className="space-y-3">
                    {formData.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{index + 1}</span>
                        </div>
                        <input
                          type="text"
                          value={benefit}
                          onChange={(e) => updateArrayItem('benefits', index, e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                          placeholder="Enter benefit"
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem('benefits', index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem('benefits')}
                      className="w-full px-4 py-2 border-2 border-dashed border-green-300 rounded-lg text-green-600 hover:border-green-500 hover:bg-green-50 transition-all font-medium"
                    >
                      + Add Benefit
                    </button>
                  </div>
                </div>

                {/* Process Steps Section */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-xl">📋</span> Process Steps
                  </h3>
                  <div className="space-y-3">
                    {formData.process.map((step, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <input
                          type="text"
                          value={step}
                          onChange={(e) => updateArrayItem('process', index, e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                          placeholder="Enter process step"
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem('process', index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem('process')}
                      className="w-full px-4 py-2 border-2 border-dashed border-orange-300 rounded-lg text-orange-600 hover:border-orange-500 hover:bg-orange-50 transition-all font-medium"
                    >
                      + Add Process Step
                    </button>
                  </div>
                </div>

                {/* Required Documents Section */}
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-xl">📄</span> Required Documents
                  </h3>
                  <div className="space-y-3">
                    {formData.requiredDocuments.map((document, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <span className="text-indigo-600 text-sm">📎</span>
                        </div>
                        <input
                          type="text"
                          value={document}
                          onChange={(e) => updateArrayItem('requiredDocuments', index, e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                          placeholder="Enter required document"
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem('requiredDocuments', index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem('requiredDocuments')}
                      className="w-full px-4 py-2 border-2 border-dashed border-indigo-300 rounded-lg text-indigo-600 hover:border-indigo-500 hover:bg-indigo-50 transition-all font-medium"
                    >
                      + Add Required Document
                    </button>
                  </div>
                </div>

                {/* Document Upload Fields Section */}
                <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-xl p-6 border border-cyan-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-xl">📤</span> Document Upload Fields
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    These are the fields that users will see when uploading documents for this service
                  </p>
                  <div className="space-y-3">
                    {formData.documentUploads.map((upload, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                          <span className="text-cyan-600 text-sm">📁</span>
                        </div>
                        <input
                          type="text"
                          value={upload}
                          onChange={(e) => updateArrayItem('documentUploads', index, e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                          placeholder="Enter upload field name (e.g., PAN Card Copy)"
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem('documentUploads', index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem('documentUploads')}
                      className="w-full px-4 py-2 border-2 border-dashed border-cyan-300 rounded-lg text-cyan-600 hover:border-cyan-500 hover:bg-cyan-50 transition-all font-medium"
                    >
                      + Add Upload Field
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateService}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Creating...' : 'Create Service'}
                </button>
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* Submission Detail Modal */}
      <AnimatePresence>
        {showSubmissionDetail && selectedSubmission && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSubmissionDetail(false)}
          >
            <Motion.div
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
                    <p className="text-gray-900 font-semibold mt-1">{selectedSubmission.userEmail || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone</label>
                    <p className="text-gray-900 font-semibold mt-1">{selectedSubmission.userPhone || 'N/A'}</p>
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
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${selectedSubmission.status === 'pending'
                      ? 'bg-orange-100 text-orange-600'
                      : selectedSubmission.status === 'in-progress'
                        ? 'bg-blue-100 text-blue-600'
                        : selectedSubmission.status === 'rejected'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-green-100 text-green-600'
                      }`}>
                      {selectedSubmission.status.charAt(0).toUpperCase() + selectedSubmission.status.slice(1).replace('-', ' ')}
                    </span>
                    {selectedSubmission.status === 'rejected' && selectedSubmission.rejectionReason && (
                      <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded-lg">
                        <strong>Rejection Reason:</strong> {selectedSubmission.rejectionReason}
                      </div>
                    )}
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
                      <Motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 flex-1">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${doc.fileType === 'pdf'
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
                            <Motion.button
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
                            </Motion.button>
                            <Motion.button
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
                            </Motion.button>
                          </div>
                        </div>
                      </Motion.div>
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
                  <>
                    <button
                      onClick={() => handleStatusUpdate('in-progress')}
                      disabled={isUpdatingStatus}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpdatingStatus ? 'Updating...' : 'Mark as In Progress'}
                    </button>
                    <button
                      onClick={() => setShowRejectModal(true)}
                      disabled={isUpdatingStatus}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Reject
                    </button>
                  </>
                )}
                {selectedSubmission.status === 'in-progress' && (
                  <button
                    onClick={() => handleStatusUpdate('completed')}
                    disabled={isUpdatingStatus}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdatingStatus ? 'Updating...' : 'Mark as Completed'}
                  </button>
                )}
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* Reject Submission Modal */}
      <AnimatePresence>
        {showRejectModal && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              if (!isUpdatingStatus) {
                setShowRejectModal(false);
                setRejectionReason('');
              }
            }}
          >
            <Motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Reject Submission</h2>
                <button
                  onClick={() => {
                    if (!isUpdatingStatus) {
                      setShowRejectModal(false);
                      setRejectionReason('');
                    }
                  }}
                  disabled={isUpdatingStatus}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                >
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Service: <span className="font-semibold">{selectedSubmission?.serviceName}</span>
                </p>
                <p className="text-sm text-gray-600">
                  User: <span className="font-semibold">{selectedSubmission?.userName}</span>
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  disabled={isUpdatingStatus}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Please provide a reason for rejection..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    if (!isUpdatingStatus) {
                      setShowRejectModal(false);
                      setRejectionReason('');
                    }
                  }}
                  disabled={isUpdatingStatus}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectSubmission}
                  disabled={isUpdatingStatus || !rejectionReason.trim()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdatingStatus ? 'Rejecting...' : 'Confirm Reject'}
                </button>
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* Edit Service Modal */}
      <AnimatePresence>
        {showEditModal && editingService && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              // Only close if clicking the backdrop, not the modal content
              if (e.target === e.currentTarget) {
                setShowEditModal(false);
              }
            }}
          >
            <Motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                // Prevent modal from closing on Escape key while typing
                if (e.key === 'Escape' && e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                  e.stopPropagation();
                }
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Edit Legal Service - {editingService?.name}</h2>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Service Form - Same as Create Form */}
              <div className="space-y-6">
                {/* Basic Information Section */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-xl">📋</span> Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Service Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Enter service name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        required
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Icon (Default)
                      </label>
                      <input
                        type="text"
                        name="icon"
                        value={formData.icon}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-xl"
                        placeholder="e.g., ⚖️"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="price"
                        value={formData.price}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="e.g., ₹15,000"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="duration"
                        value={formData.duration}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="e.g., 15-30 days"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                        rows="3"
                        placeholder="Enter detailed description"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Content Information Section */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-xl">📄</span> Content Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Heading
                      </label>
                      <input
                        type="text"
                        name="heading"
                        value={formData.heading}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                        placeholder="Enter service heading"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Paragraph
                      </label>
                      <textarea
                        name="paragraph"
                        value={formData.paragraph}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none"
                        rows="4"
                        placeholder="Enter detailed paragraph about the service"
                      />
                    </div>
                  </div>
                </div>

                {/* Benefits Section */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-xl">✅</span> Benefits
                  </h3>
                  <div className="space-y-3">
                    {formData.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{index + 1}</span>
                        </div>
                        <input
                          type="text"
                          value={benefit}
                          onChange={(e) => updateArrayItem('benefits', index, e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                          placeholder="Enter benefit"
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem('benefits', index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem('benefits')}
                      className="w-full px-4 py-2 border-2 border-dashed border-green-300 rounded-lg text-green-600 hover:border-green-500 hover:bg-green-50 transition-all font-medium"
                    >
                      + Add Benefit
                    </button>
                  </div>
                </div>

                {/* Process Steps Section */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-xl">📋</span> Process Steps
                  </h3>
                  <div className="space-y-3">
                    {formData.process.map((step, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <input
                          type="text"
                          value={step}
                          onChange={(e) => updateArrayItem('process', index, e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                          placeholder="Enter process step"
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem('process', index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem('process')}
                      className="w-full px-4 py-2 border-2 border-dashed border-orange-300 rounded-lg text-orange-600 hover:border-orange-500 hover:bg-orange-50 transition-all font-medium"
                    >
                      + Add Process Step
                    </button>
                  </div>
                </div>

                {/* Required Documents Section */}
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-xl">📄</span> Required Documents
                  </h3>
                  <div className="space-y-3">
                    {formData.requiredDocuments.map((document, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <span className="text-indigo-600 text-sm">📎</span>
                        </div>
                        <input
                          type="text"
                          value={document}
                          onChange={(e) => updateArrayItem('requiredDocuments', index, e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                          placeholder="Enter required document"
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem('requiredDocuments', index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem('requiredDocuments')}
                      className="w-full px-4 py-2 border-2 border-dashed border-indigo-300 rounded-lg text-indigo-600 hover:border-indigo-500 hover:bg-indigo-50 transition-all font-medium"
                    >
                      + Add Required Document
                    </button>
                  </div>
                </div>

                {/* Document Upload Fields Section */}
                <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-xl p-6 border border-cyan-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-xl">📤</span> Document Upload Fields
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    These are the fields that users will see when uploading documents for this service
                  </p>
                  <div className="space-y-3">
                    {formData.documentUploads.map((upload, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                          <span className="text-cyan-600 text-sm">📁</span>
                        </div>
                        <input
                          type="text"
                          value={upload}
                          onChange={(e) => updateArrayItem('documentUploads', index, e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                          placeholder="Enter upload field name (e.g., PAN Card Copy)"
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem('documentUploads', index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem('documentUploads')}
                      className="w-full px-4 py-2 border-2 border-dashed border-cyan-300 rounded-lg text-cyan-600 hover:border-cyan-500 hover:bg-cyan-50 transition-all font-medium"
                    >
                      + Add Upload Field
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdateService}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Updating...' : 'Update Service'}
                </button>
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CADashboard;

