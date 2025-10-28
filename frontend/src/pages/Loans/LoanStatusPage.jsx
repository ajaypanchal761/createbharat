import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNavbar from '../../components/common/BottomNavbar';

// Bottom Nav Icons
const HomeIcon = ({ active }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> );
const BriefcaseIcon = ({ active }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> );
const PlusIcon = ({ active }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg> );
const BarChartIcon = ({ active }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> );
const UserIcon = ({ active }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> );

const LoanStatusPage = () => {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Mock loan applications data
  const loanApplications = [
    {
      id: 'LA001',
      loanType: 'Mudra Yojana',
      amount: '₹5,00,000',
      appliedDate: '2024-01-15',
      status: 'approved',
      statusText: 'Approved',
      statusColor: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      approvedDate: '2024-01-25',
      disbursedAmount: '₹4,50,000'
    },
    {
      id: 'LA002',
      loanType: 'Stand Up India',
      amount: '₹10,00,000',
      appliedDate: '2024-01-20',
      status: 'under-review',
      statusText: 'Under Review',
      statusColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      estimatedDate: '2024-02-15'
    },
    {
      id: 'LA003',
      loanType: 'PMEGP',
      amount: '₹2,50,000',
      appliedDate: '2024-01-10',
      status: 'rejected',
      statusText: 'Rejected',
      statusColor: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      reason: 'Incomplete documentation'
    },
    {
      id: 'LA004',
      loanType: 'Startup India',
      amount: '₹15,00,000',
      appliedDate: '2024-01-25',
      status: 'pending',
      statusText: 'Pending',
      statusColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      estimatedDate: '2024-02-20'
    }
  ];

  const statusFilters = [
    { key: 'all', label: 'All Applications', count: loanApplications.length },
    { key: 'pending', label: 'Pending', count: loanApplications.filter(app => app.status === 'pending').length },
    { key: 'under-review', label: 'Under Review', count: loanApplications.filter(app => app.status === 'under-review').length },
    { key: 'approved', label: 'Approved', count: loanApplications.filter(app => app.status === 'approved').length },
    { key: 'rejected', label: 'Rejected', count: loanApplications.filter(app => app.status === 'rejected').length }
  ];

  const filteredApplications = selectedStatus === 'all' 
    ? loanApplications 
    : loanApplications.filter(app => app.status === selectedStatus);

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
      case 'approved':
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
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between px-4 py-4 bg-white/90 backdrop-blur-lg border-b border-gradient-to-r from-blue-200 to-purple-200 shadow-lg"
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
            onClick={() => navigate('/loans')}
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
            Loan Status
          </motion.h1>
        </motion.div>
      </motion.header>

      {/* Main Content */}
      <div className="px-4 pb-20 pt-6">
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
            <h2 className="text-xl font-bold text-gray-800 mb-4">Application Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {statusFilters.map((filter) => (
                <motion.button
                  key={filter.key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedStatus(filter.key)}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                    selectedStatus === filter.key
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${
                      selectedStatus === filter.key ? 'text-blue-600' : 'text-gray-600'
                    }`}>
                      {filter.count}
                    </div>
                    <div className={`text-sm ${
                      selectedStatus === filter.key ? 'text-blue-600' : 'text-gray-500'
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
            {filteredApplications.map((application) => (
              <motion.div
                key={application.id}
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
                className={`${application.bgColor} ${application.borderColor} border-2 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{application.loanType}</h3>
                    <p className="text-sm text-gray-600">Application ID: {application.id}</p>
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
                    <p className="text-sm text-gray-600">Loan Amount</p>
                    <p className="font-semibold text-gray-800">{application.amount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Applied Date</p>
                    <p className="font-semibold text-gray-800">{application.appliedDate}</p>
                  </div>
                  {application.approvedDate && (
                    <div>
                      <p className="text-sm text-gray-600">Approved Date</p>
                      <p className="font-semibold text-gray-800">{application.approvedDate}</p>
                    </div>
                  )}
                </div>

                {application.disbursedAmount && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Disbursed Amount</p>
                    <p className="font-semibold text-green-600">{application.disbursedAmount}</p>
                  </div>
                )}

                {application.estimatedDate && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Estimated Completion</p>
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
                  >
                    View Details
                  </motion.button>
                  {application.status === 'rejected' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      Reapply
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Empty State */}
          {filteredApplications.length === 0 && (
            <motion.div
              variants={fadeInUp}
              className="text-center py-12"
            >
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No applications found</h3>
              <p className="text-gray-500 mb-4">No loan applications match the selected filter.</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/loans/apply')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Apply for Loan
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavbar 
        tabs={[
          { name: 'Home', path: '/', icon: <HomeIcon /> },
          { name: 'Loans', path: '/loans', icon: <BriefcaseIcon /> },
          { name: 'Apply', path: '/loans/apply', icon: <PlusIcon /> },
          { name: 'Status', path: '/loans/status', icon: <BarChartIcon /> },
          { name: 'Profile', path: '/profile', icon: <UserIcon /> }
        ]}
      />
    </div>
  );
};

export default LoanStatusPage;
