import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { loansAPI, authAPI } from '../../utils/api';
import BottomNavbar from '../../components/common/BottomNavbar';
import govLoanImg from '../../assets/Government-personal-loan-scheme.webp';

// Bottom Nav Icons (copied from HomePage for consistency)
const HomeIcon = ({ active }) => (<svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>);
const BriefcaseIcon = ({ active }) => (<svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>);
const ChatIcon = ({ active }) => (<svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>);
const PlusIcon = ({ active }) => (<svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-white' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>);
const UserIcon = ({ active }) => (<svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>);
const BellIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>);

const LoansPage = () => {
  const navigate = useNavigate();
  const [governmentLoans, setGovernmentLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userLoanApplications, setUserLoanApplications] = useState([]);

  useEffect(() => {
    const loadSchemes = async () => {
      try {
        setIsLoading(true);
        const res = await loansAPI.getSchemes({ limit: 20 });
        const items = (res.data || []).map((s) => ({
          id: s._id,
          title: s.name,
          image: s.imageUrl || govLoanImg,
          description: s.description?.slice(0, 100) || '',
          color: s.color || 'from-blue-500 to-indigo-600',
          bgColor: 'from-blue-50 to-indigo-50',
          textColor: 'text-blue-700',
        }));
        setGovernmentLoans(items);
      } catch (e) {
        setError(e.message || 'Failed to load schemes');
      } finally {
        setIsLoading(false);
      }
    };
    loadSchemes();
  }, []);

  // Load user loan applications
  useEffect(() => {
    const loadUserApplications = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token || token === 'null' || token === 'undefined') {
          return;
        }

        const cleanToken = token.trim().replace(/^["']|["']$/g, '');
        const userResponse = await authAPI.getMe(cleanToken);
        
        if (userResponse.success && userResponse.data?.user?.applications?.loans) {
          setUserLoanApplications(userResponse.data.user.applications.loans || []);
        }
      } catch (e) {
        console.error('Error loading user loan applications:', e);
      }
    };
    loadUserApplications();
  }, []);

  // Animation variants
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

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  // Get status for a loan scheme
  const getLoanStatus = (schemeId) => {
    const application = userLoanApplications.find(app => 
      app.loanId && app.loanId.toString() === schemeId.toString()
    );
    
    if (!application) return null;

    const statusMap = {
      'applied': { text: 'Applied', color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-300' },
      'under_review': { text: 'Under Review', color: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-300' },
      'approved': { text: 'Approved', color: 'text-green-600', bg: 'bg-green-100', border: 'border-green-300' },
      'rejected': { text: 'Rejected', color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-300' },
      'disbursed': { text: 'Disbursed', color: 'text-purple-600', bg: 'bg-purple-100', border: 'border-purple-300' }
    };

    const status = application.status || 'applied';
    return statusMap[status] || statusMap['applied'];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 md:bg-gradient-to-br md:from-gray-50 md:via-blue-50 md:to-indigo-50">

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="md:hidden flex items-center justify-between px-4 py-4 bg-white border-b border-gray-200 shadow-md sticky top-0 z-50"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="flex items-center gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.1, x: -2, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-300"
          >
            <Link to="/" className="flex items-center">
              <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
          </motion.button>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-2xl font-bold text-gray-900"
          >
            Government Loans
          </motion.h1>
        </motion.div>
      </motion.header>

      {/* Main Content - Enhanced Grid Layout */}
      <div className="px-4 pb-20 pt-6 md:px-8 lg:px-12">
        {/* Page Header for Desktop */}
        <div className="hidden md:block mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Government Loans</h1>
          <p className="text-lg text-gray-600 mb-6">Explore various government loan schemes for entrepreneurs and businesses</p>

          {/* Search and Filter Section */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search loan schemes..."
                  className="w-full px-4 py-3 pl-10 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium">
                All Schemes
              </button>
            </div>
          </div>
        </div>


        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5"
        >
          {(isLoading ? Array.from({ length: 8 }).map((_, index) => ({ skeleton: true, id: index })) : governmentLoans).map((loan, index) => (
            <motion.div
              key={loan.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.08,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ y: -8, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="group relative"
            >
              <Link to={`/loans/${loan.id}`} className="block">
                <div className={`relative bg-white rounded-2xl p-0 shadow-md border border-gray-200 overflow-hidden h-full flex flex-col min-h-[120px] md:min-h-[160px] transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1`}>
                  {/* Image Container */}
                  <div className="relative flex-shrink-0">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="relative w-full h-12 md:h-16 overflow-hidden group-hover:shadow-md transition-shadow duration-300"
                    >
                      {loan.skeleton ? (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
                      ) : (
                        <img
                          src={loan.image}
                          alt={loan.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </motion.div>
                  </div>
                  {/* Content Section */}
                  <div className="relative z-10 flex flex-col flex-grow min-h-0 p-2 md:p-3">
                    {/* Title */}
                    <motion.h3
                      whileHover={{ x: 1 }}
                      className={`font-bold text-gray-900 text-xs md:text-sm mb-0.5 line-clamp-2 flex-shrink-0`}
                    >
                      {loan.skeleton ? (
                        <div className="h-3 md:h-4 bg-gray-200 rounded animate-pulse" />
                      ) : (
                        loan.title
                      )}
                    </motion.h3>

                    {/* Description - Fixed height */}
                    <div className="h-[28px] md:h-[32px] mb-1 flex-shrink-0">
                      <p className="text-[10px] md:text-xs text-gray-600 line-clamp-2 leading-tight">
                        {loan.skeleton ? (
                          <>
                            <div className="h-2 md:h-3 bg-gray-200 rounded animate-pulse mb-1" />
                            <div className="h-2 md:h-3 bg-gray-200 rounded animate-pulse w-3/4" />
                          </>
                        ) : (
                          loan.description || 'Explore this government loan scheme for your business needs'
                        )}
                      </p>
                    </div>

                    {/* Spacer to push button to bottom */}
                    <div className="flex-grow"></div>

                    {/* Action Section - Always at bottom */}
                    <div className="flex justify-end items-center pt-1 md:pt-1.5 border-t border-gray-100 mt-auto flex-shrink-0">
                      {/* Status Badge - Only show if status exists */}
                      {getLoanStatus(loan.id) && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            navigate('/loans/status');
                          }}
                          className="cursor-pointer mr-auto"
                        >
                          <div className={`px-2 md:px-2.5 py-1 md:py-1 rounded-full ${getLoanStatus(loan.id).bg} border ${getLoanStatus(loan.id).border} shadow-sm hover:shadow-md transition-all duration-300`}>
                            <span className={`text-[10px] md:text-xs font-semibold ${getLoanStatus(loan.id).color} flex items-center gap-1`}>
                              <svg className="w-2.5 h-2.5 md:w-3 md:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="hidden sm:inline">{getLoanStatus(loan.id).text}</span>
                              <span className="sm:hidden">✓</span>
                            </span>
                          </div>
                        </motion.div>
                      )}
                      
                      {/* CTA Button */}
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                        className={`relative w-8 h-8 md:w-11 md:h-11 rounded-xl bg-gradient-to-r ${loan.color} flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group/btn`}
                      >
                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </motion.div>
                    </div>
                  </div>

                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom Navigation - Loans Specific */}
      <BottomNavbar
        tabs={[
          { name: 'Home', path: '/', icon: <HomeIcon /> },
          { name: 'Loans', path: '/loans', icon: <BriefcaseIcon /> },
          { name: 'Profile', path: '/profile', icon: <UserIcon /> }
        ]}
      />
    </div>
  );
};

export default LoansPage;

