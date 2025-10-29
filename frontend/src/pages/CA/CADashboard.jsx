import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
import UserSubmissionDetailsModal from '../../components/CA/UserSubmissionDetailsModal';

const CADashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('services');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Default Legal Services
  const defaultServices = [
    { id: 1, name: 'GST Registration', icon: '📋', category: 'Tax', price: '₹1,999', duration: '5-7 days', active: true },
    { id: 2, name: 'GST Filing', icon: '📄', category: 'Tax', price: '₹999', duration: 'Monthly/Quarterly', active: true },
    { id: 3, name: 'Income Tax Filing', icon: '💰', category: 'Tax', price: '₹1,499', duration: 'Before July 31st', active: true },
    { id: 4, name: 'ROC Filing', icon: '🏢', category: 'Compliance', price: '₹2,999', duration: 'Within 60 days of AGM', active: true },
    { id: 5, name: 'Import Export Registration', icon: '🚢', category: 'Business', price: '₹3,999', duration: '10-15 days', active: true },
    { id: 6, name: 'MSME Registration', icon: '🏭', category: 'Business', price: '₹999', duration: '1-3 business days', active: true },
    { id: 7, name: 'Trade Mark Filing', icon: '™️', category: 'IP Rights', price: '₹4,500', duration: '6-12 months', active: true },
    { id: 8, name: 'Food (FSSAI) License', icon: '🍽️', category: 'License', price: '₹5,999', duration: '15-30 days', active: true },
    { id: 9, name: 'PF/ESIC Registration', icon: '👥', category: 'Compliance', price: '₹2,499', duration: '7-10 days', active: true },
    { id: 10, name: 'ISO Certification', icon: '🏆', category: 'Certification', price: '₹15,000', duration: '30-45 days', active: true },
    { id: 11, name: 'Proprietorship Company Registration', icon: '👤', category: 'Business', price: '₹2,999', duration: '5-7 days', active: true },
    { id: 12, name: 'Partnership Company Registration', icon: '🤝', category: 'Business', price: '₹3,999', duration: '3-7 days', active: true },
    { id: 13, name: 'Private Limited/LLP Company Registration', icon: '🏛️', category: 'Business', price: '₹4,999', duration: '7-15 days', active: true },
    { id: 14, name: 'NGO Registration', icon: '❤️', category: 'NGO', price: '₹2,999', duration: '15-30 days', active: true },
    { id: 15, name: 'Project Report', icon: '📊', category: 'Documentation', price: '₹5,999', duration: '10-15 days', active: true }
  ];

  const [legalServices, setLegalServices] = useState([]);
  const [userSubmissions, setUserSubmissions] = useState([]);

  // Load services from localStorage and merge with defaults
  useEffect(() => {
    const loadServices = () => {
      try {
        const caServices = JSON.parse(localStorage.getItem('caLegalServices') || '[]');
        // Merge CA services with default services, avoiding duplicates
        const allServices = [...defaultServices];
        caServices.forEach(caService => {
          const existingIndex = allServices.findIndex(s => s.id === caService.id);
          if (existingIndex !== -1) {
            allServices[existingIndex] = caService;
          } else {
            allServices.push(caService);
          }
        });
        
        // Add submission count
        const submissions = JSON.parse(localStorage.getItem('caUserSubmissions') || '[]');
        const servicesWithCounts = allServices.map(service => ({
          ...service,
          submissions: submissions.filter(s => s.serviceId === service.id).length
        }));
        
        setLegalServices(servicesWithCounts);
      } catch (error) {
        console.error('Error loading services:', error);
        setLegalServices(defaultServices.map(s => ({ ...s, submissions: 0 })));
      }
    };

    loadServices();
  }, []);

  // Load user submissions from localStorage
  useEffect(() => {
    const loadSubmissions = () => {
      try {
        const submissions = JSON.parse(localStorage.getItem('caUserSubmissions') || '[]');
        
        // If no submissions exist, create some mock data with documents
        if (submissions.length === 0) {
          const mockSubmissions = [
            {
              id: 1,
              userName: 'Rahul Sharma',
              serviceName: 'GST Registration',
              serviceId: 1,
              submittedDate: '2024-01-15',
              status: 'pending',
              email: 'rahul@example.com',
              phone: '9876543210',
              address: '123 Main Street, Mumbai, Maharashtra 400001',
              companyName: 'Sharma Enterprises',
              panNumber: 'ABCDE1234F',
              gstType: 'Proprietorship (Individual Firm)',
              paymentStatus: 'paid',
              paymentAmount: '₹1,999',
              paymentDate: '2024-01-15',
              documents: [
                {
                  name: 'PAN Card',
                  type: 'PDF',
                  size: '245 KB',
                  uploadDate: '2024-01-15',
                  url: '#',
                  file: null
                },
                {
                  name: 'Aadhaar Card',
                  type: 'PDF',
                  size: '312 KB',
                  uploadDate: '2024-01-15',
                  url: '#',
                  file: null
                },
                {
                  name: 'Business Address Proof',
                  type: 'PDF',
                  size: '189 KB',
                  uploadDate: '2024-01-15',
                  url: '#',
                  file: null
                },
                {
                  name: 'Bank Account Details',
                  type: 'PDF',
                  size: '156 KB',
                  uploadDate: '2024-01-15',
                  url: '#',
                  file: null
                }
              ],
              notes: 'User has submitted all required documents. Ready for processing.'
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
              address: '456 Business Park, Bangalore, Karnataka 560001',
              companyName: 'Patel Technologies Pvt Ltd',
              panNumber: 'FGHIJ5678K',
              paymentStatus: 'paid',
              paymentAmount: '₹15,000',
              paymentDate: '2024-01-14',
              documents: [
                {
                  name: 'Company Name Certificate',
                  type: 'PDF',
                  size: '156 KB',
                  uploadDate: '2024-01-14',
                  url: '#',
                  file: null
                },
                {
                  name: 'Director PAN Cards',
                  type: 'PDF',
                  size: '445 KB',
                  uploadDate: '2024-01-14',
                  url: '#',
                  file: null
                },
                {
                  name: 'Registered Office Address Proof',
                  type: 'PDF',
                  size: '223 KB',
                  uploadDate: '2024-01-14',
                  url: '#',
                  file: null
                }
              ],
              notes: 'Company registration is in progress. Waiting for ROC approval.'
            }
          ];
          localStorage.setItem('caUserSubmissions', JSON.stringify(mockSubmissions));
          setUserSubmissions(mockSubmissions);
        } else {
          setUserSubmissions(submissions);
        }
      } catch (error) {
        console.error('Error loading submissions:', error);
        setUserSubmissions([]);
      }
    };

    loadSubmissions();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isCALoggedIn');
    localStorage.removeItem('userType');
    localStorage.removeItem('caEmail');
    localStorage.removeItem('caName');
    navigate('/ca/login');
  };

  const addService = () => {
    // Navigate to add service page
    navigate('/ca/services/add');
  };

  const editService = (serviceId) => {
    // Navigate to edit service page
    navigate(`/ca/services/${serviceId}/edit`);
  };

  const deleteService = (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        // Remove from localStorage
        const caServices = JSON.parse(localStorage.getItem('caLegalServices') || '[]');
        const updatedServices = caServices.filter(s => s.id !== serviceId);
        localStorage.setItem('caLegalServices', JSON.stringify(updatedServices));
        
        // Update state
        setLegalServices(legalServices.filter(s => s.id !== serviceId));
      } catch (error) {
        console.error('Error deleting service:', error);
        // Fallback to just updating state
        setLegalServices(legalServices.filter(s => s.id !== serviceId));
      }
    }
  };

  const handleViewDetails = (submission) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  const filteredSubmissions = userSubmissions.filter(submission =>
    submission.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.phone.includes(searchTerm)
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
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search submissions..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((submission) => (
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
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        submission.status === 'pending'
                          ? 'bg-orange-100 text-orange-600'
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        {submission.status}
                      </span>
                      <button
                        onClick={() => handleViewDetails(submission)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
              ) : (
                <div className="text-center py-12">
                  <FaFileUpload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    {searchTerm ? 'No submissions found matching your search.' : 'No user submissions yet.'}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* User Submission Details Modal */}
        <UserSubmissionDetailsModal
          submission={selectedSubmission}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedSubmission(null);
          }}
        />
      </div>
    </div>
  );
};

export default CADashboard;

