import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNavbar from '../../components/common/BottomNavbar';
import { applicationAPI } from '../../utils/api';

// Bottom Nav Icons
const HomeIcon = ({ active }) => (<svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>);
const SearchIcon = ({ active }) => (<svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>);
const HeartIcon = ({ active }) => (<svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>);
const ClipboardIcon = ({ active }) => (<svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>);
const UserIcon = ({ active }) => (<svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>);

const AppliedInternshipsPage = () => {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [appliedInternships, setAppliedInternships] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadApplications = async () => {
      try {
        setIsLoading(true);
        // Try multiple token keys to support different login flows
        let token = localStorage.getItem('token') || localStorage.getItem('authToken');

        // Also check userData for token
        if (!token) {
          const userDataStr = localStorage.getItem('userData');
          if (userDataStr) {
            try {
              const userData = JSON.parse(userDataStr);
              token = userData.token || token;
            } catch (e) {
              console.error('Error parsing userData:', e);
            }
          }
        }

        if (!token || token === 'null' || token === 'undefined') {
          navigate('/login');
          return;
        }

        // Clean token
        token = token.trim().replace(/^["']|["']$/g, '');

        const response = await applicationAPI.getMyApplications(token);
        if (response.success && response.data.applications) {
          // Map backend status to frontend format
          const mapped = response.data.applications.map(app => {
            let status = app.status || 'pending';
            let statusText = status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');
            let statusColor = 'text-blue-600';
            let bgColor = 'bg-blue-50';
            let borderColor = 'border-blue-200';

            // Map backend statuses to frontend format
            if (status === 'shortlisted') {
              status = 'under-review';
              statusText = 'Under Review';
              statusColor = 'text-yellow-600';
              bgColor = 'bg-yellow-50';
              borderColor = 'border-yellow-200';
            } else if (status === 'rejected') {
              statusText = 'Rejected';
              statusColor = 'text-red-600';
              bgColor = 'bg-red-50';
              borderColor = 'border-red-200';
            } else if (status === 'hired' || status === 'accepted') {
              status = 'accepted';
              statusText = 'Accepted';
              statusColor = 'text-green-600';
              bgColor = 'bg-green-50';
              borderColor = 'border-green-200';
            } else if (status === 'pending' || status === 'applied') {
              status = 'pending';
              statusText = 'Pending';
            }

            return {
              id: app._id,
              internship: app.internship ? {
                _id: app.internship._id,
                id: app.internship._id,
                title: app.internship.title,
                company: app.internship.companyName || app.internship.company?.companyName || 'Company',
                location: app.internship.location,
                stipend: app.internship.stipend && app.internship.stipend.trim() !== ''
                  ? app.internship.stipend
                  : (app.internship.stipendPerMonth && app.internship.stipendPerMonth.trim() !== '' && app.internship.stipendPerMonth !== '/month'
                    ? `₹${app.internship.stipendPerMonth}`
                    : 'Not specified'),
                duration: app.internship.duration,
                category: app.internship.category,
                description: app.internship.description
              } : null,
              appliedDate: app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : new Date().toLocaleDateString(),
              status,
              statusText,
              statusColor,
              bgColor,
              borderColor,
              estimatedDate: app.statusUpdatedAt ? new Date(app.statusUpdatedAt).toLocaleDateString() : null
            };
          });
          setAppliedInternships(mapped);
        }
      } catch (error) {
        console.error('Error loading applications:', error);
        setAppliedInternships([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadApplications();
  }, [navigate]);

  const statusFilters = [
    { key: 'all', label: 'All Applications', count: appliedInternships.length },
    { key: 'pending', label: 'Pending', count: appliedInternships.filter(app => app.status === 'pending').length },
    { key: 'under-review', label: 'Under Review', count: appliedInternships.filter(app => app.status === 'under-review').length },
    { key: 'accepted', label: 'Accepted', count: appliedInternships.filter(app => app.status === 'accepted').length },
    { key: 'rejected', label: 'Rejected', count: appliedInternships.filter(app => app.status === 'rejected').length }
  ];

  const filteredApplications = selectedStatus === 'all'
    ? appliedInternships
    : appliedInternships.filter(app => app.status === selectedStatus);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return (
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'under-review':
        return (
          <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'rejected':
        return (
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'pending':
        return (
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'interview':
        return (
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-y-auto">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between px-4 py-4 bg-white/90 backdrop-blur-lg border-b border-gradient-to-r from-blue-200 to-purple-200 shadow-lg sticky top-0 z-40"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="flex items-center gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.1, x: -2, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 transition-all duration-300"
            onClick={() => navigate('/internships')}
          >
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
          >
            Applied Internships
          </motion.h1>
        </motion.div>
      </motion.header>

      {/* Main Content */}
      <div className="px-4 pb-24 pt-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading applications...</p>
            </div>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl mx-auto"
          >
            {/* Status Summary */}
            <motion.div
              variants={fadeInUp}
              className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/40 mb-6"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4">Application Status</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {statusFilters.map((filter) => (
                  <motion.button
                    key={filter.key}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedStatus(filter.key)}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 ${selectedStatus === filter.key
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                  >
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${selectedStatus === filter.key ? 'text-blue-600' : 'text-gray-600'
                        }`}>
                        {filter.count}
                      </div>
                      <div className={`text-sm ${selectedStatus === filter.key ? 'text-blue-600' : 'text-gray-500'
                        }`}>
                        {filter.label}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Applications List */}
            <motion.div
              variants={staggerContainer}
              className="space-y-4"
            >
              {filteredApplications.map((application) => {
                if (!application.internship) {
                  return null; // Skip applications without internship data
                }
                return (
                  <motion.div
                    key={application.id}
                    variants={fadeInUp}
                    whileHover={{ scale: 1.02 }}
                    className={`${application.bgColor} ${application.borderColor} border-2 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">{application.internship.title || 'Internship'}</h3>
                        <p className="text-sm text-gray-600 mb-2">{application.internship.company}</p>
                        <p className="text-xs text-gray-500">Application ID: {application.id}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(application.status)}
                        <span className={`font-semibold ${application.statusColor}`}>
                          {application.statusText}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Applied Date</p>
                        <p className="font-semibold text-gray-800">{application.appliedDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="font-semibold text-gray-800">{application.internship.duration || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Stipend</p>
                        <p className="font-semibold text-gray-800">
                          {application.internship?.stipend || 'Not specified'}
                        </p>
                      </div>
                    </div>

                    {application.acceptedDate && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600">Accepted Date</p>
                        <p className="font-semibold text-green-600">{application.acceptedDate}</p>
                      </div>
                    )}

                    {application.startDate && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600">Start Date</p>
                        <p className="font-semibold text-gray-800">{application.startDate}</p>
                      </div>
                    )}

                    {application.interviewDate && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600">Interview Date</p>
                        <p className="font-semibold text-purple-600">{application.interviewDate} at {application.interviewTime}</p>
                      </div>
                    )}

                    {application.estimatedDate && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600">Expected Response</p>
                        <p className="font-semibold text-gray-800">{application.estimatedDate}</p>
                      </div>
                    )}

                    {application.reason && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600">Reason</p>
                        <p className="font-semibold text-red-600">{application.reason}</p>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        onClick={() => navigate(`/internships/${application.internship._id || application.internship.id}`)}
                      >
                        View Details
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Empty State */}
            {filteredApplications.length === 0 && (
              <motion.div
                variants={fadeInUp}
                className="text-center py-12"
              >
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No applications found</h3>
                <p className="text-gray-500 mb-4">No internship applications match the selected filter.</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/internships')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse Internships
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavbar
        tabs={[
          { name: 'Home', path: '/', icon: <HomeIcon /> },
          { name: 'Search', path: '/internships', icon: <SearchIcon /> },
          { name: 'Saved', path: '/internships/saved', icon: <HeartIcon /> },
          { name: 'Applied', path: '/internships/applied', icon: <ClipboardIcon /> },
          { name: 'Profile', path: '/profile', icon: <UserIcon /> }
        ]}
      />
    </div>
  );
};

export default AppliedInternshipsPage;
