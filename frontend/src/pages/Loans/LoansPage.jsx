import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [formData, setFormData] = useState({
    city: '',
    state: '',
    currentlyRunningBusiness: '',
    msmeUdyamNumber: '',
    businessDocuments: null,
    businessType: '',
    businessTypeOther: '',
    businessName: '',
    loanAmount: '',
    loanPurpose: '',
    loanPurposeOther: '',
    loanType: '',
    loanTypeOther: '',
    businessRegistrationType: '',
    applicantFullName: '',
    mobileNumber: '',
    emailAddress: ''
  });
  const [submitting, setSubmitting] = useState(false);

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

  const handleLoanFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Get token if user is logged in
      const token = localStorage.getItem('token');
      const cleanToken = token && token !== 'null' && token !== 'undefined' 
        ? token.trim().replace(/^["']|["']$/g, '') 
        : null;

      // Submit loan application to backend
      const response = await loansAPI.submitApplication(formData, cleanToken);
      
      if (response.success) {
        alert('Loan application submitted successfully! We will contact you soon.');
        setShowLoanForm(false);
        setFormData({
          city: '',
          state: '',
          currentlyRunningBusiness: '',
          msmeUdyamNumber: '',
          businessDocuments: null,
          businessType: '',
          businessTypeOther: '',
          businessName: '',
          loanAmount: '',
          loanPurpose: '',
          loanPurposeOther: '',
          loanType: '',
          loanTypeOther: '',
          businessRegistrationType: '',
          applicantFullName: '',
          mobileNumber: '',
          emailAddress: ''
        });
      } else {
        throw new Error(response.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting loan application:', error);
      alert(error.message || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
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
              <button 
                onClick={() => setShowLoanForm(true)}
                className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                Apply Loan
              </button>
            </div>
          </div>
        </div>


        {/* Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-6 md:mb-10"
        >
          <button
            type="button"
            onClick={() => setShowLoanForm(true)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                setShowLoanForm(true);
              }
            }}
            className="group relative w-full overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 text-left shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 min-h-[90px] sm:min-h-[150px] md:min-h-[175px] lg:min-h-[190px]"
          >
            <div className="absolute inset-0">
              <img
                src={govLoanImg}
                alt="Government loan support"
                className="h-full w-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 via-blue-900/70 to-sky-900/60" />
            </div>

            <div className="relative z-10 h-full w-full p-3.5 sm:p-6 md:p-7 lg:p-8 flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center">
              <div className="flex-1 space-y-1.5 sm:space-y-3 text-white">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[10px] sm:text-xs font-semibold uppercase tracking-wide shadow-sm backdrop-blur">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Business Funding Support
                </div>

                <div className="flex flex-col gap-1 sm:hidden">
                  <h2 className="text-lg font-semibold leading-snug">
                    Need funding to grow your business?
                  </h2>
                  <span className="inline-flex items-center gap-2 text-xs font-semibold text-white/90">
                    Tap to connect with verified partners
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                  <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-white/85">
                    {[{
                      label: 'Government & private banks'
                    }, {
                      label: 'Verified loan partners'
                    }, {
                      label: 'Guidance in 48 hrs'
                    }].map((item) => (
                      <span
                        key={item.label}
                        className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-1 font-medium tracking-wide"
                      >
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400/90 text-[8px] font-bold text-indigo-900">✓</span>
                        {item.label}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="hidden sm:block space-y-3 md:space-y-4">
                  <h2 className="text-2xl md:text-2xl lg:text-3xl font-extrabold leading-snug">
                    Need funding to grow your business?
                  </h2>
                  <p className="text-sm md:text-base text-blue-100/90 max-w-2xl">
                    We connect you with government-backed schemes and trusted private banks. Verified banking partners guide you through every step so you secure the right capital fast.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 text-sm">
                    {[
                      'Access government & private bank offers',
                      'Verified banking partners with fast approvals',
                      'Personalised funding roadmap within 48 hours'
                    ].map((point) => (
                      <div key={point} className="flex items-center gap-2 text-white/90">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs font-bold">✓</span>
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="hidden sm:flex md:w-48 lg:w-56">
                <div className="rounded-2xl bg-white text-indigo-900 shadow-lg px-4 py-4 sm:px-5 sm:py-5 md:py-6 flex flex-col gap-2.5 items-start md:items-center">
                  <span className="text-xs font-semibold uppercase tracking-widest text-indigo-500">Click to apply</span>
                  <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 text-left md:text-center">
                    Match with verified banking partners
                  </p>
                  <div className="w-full border-t border-gray-200/70" />
                  <span className="text-xs font-medium text-gray-500">Government & private options</span>
                  <span className="text-xl sm:text-2xl md:text-3xl font-black text-indigo-600">Fast Decisions</span>
                  <span className="text-xs text-gray-500">Guidance within 48 hours</span>
                </div>
              </div>
            </div>

          </button>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5 auto-rows-fr"
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
                <div className={`relative bg-white rounded-2xl p-0 shadow-md border border-gray-200 overflow-hidden h-full flex flex-col min-h-[150px] md:min-h-[200px] transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1`}>
                  {/* Image Container */}
                  <div className="relative flex-shrink-0">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="relative w-full h-[4.5rem] md:h-[6rem] overflow-hidden group-hover:shadow-md transition-shadow duration-300"
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
                      className={`font-bold text-gray-900 text-xs md:text-sm mb-0.5 line-clamp-2 flex-shrink-0 min-h-[32px] md:min-h-[40px]`}
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
                            <span className="block h-2 md:h-3 bg-gray-200 rounded animate-pulse mb-1" />
                            <span className="block h-2 md:h-3 bg-gray-200 rounded animate-pulse w-3/4" />
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
          { 
            name: 'Apply', 
            path: '#', 
            icon: <PlusIcon />,
            onClick: () => setShowLoanForm(true),
            isActive: showLoanForm
          },
          { name: 'Profile', path: '/profile', icon: <UserIcon /> }
        ]}
      />

      {/* Loan Application Form Modal */}
      <AnimatePresence>
        {showLoanForm && (
          <div className="fixed inset-0 z-50 flex flex-col bg-white md:bg-black/50 md:backdrop-blur-sm md:flex md:items-center md:justify-center md:p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white w-full h-full md:h-auto md:max-h-[90vh] md:max-w-2xl md:rounded-2xl shadow-none md:shadow-2xl overflow-hidden flex flex-col"
            >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 sticky top-0 z-10">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">Apply for Loan</h2>
              <button
                onClick={() => setShowLoanForm(false)}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              <form onSubmit={handleLoanFormSubmit} className="space-y-4 md:space-y-5">
                {/* Applicant Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Applicant Full Name *</label>
                  <input
                    type="text"
                    value={formData.applicantFullName}
                    onChange={(e) => setFormData({...formData, applicantFullName: e.target.value})}
                    required
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Mobile Number *</label>
                  <input
                    type="tel"
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})}
                    required
                    pattern="[0-9]{10}"
                    maxLength="10"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter 10-digit mobile number"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    value={formData.emailAddress}
                    onChange={(e) => setFormData({...formData, emailAddress: e.target.value})}
                    required
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email address"
                  />
                </div>

                {/* City and State */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">City *</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      required
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your city"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">State *</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                      required
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your state"
                    />
                  </div>
                </div>

                {/* Currently Running Business - FIRST QUESTION */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Are you currently running a business? *</label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="currentlyRunningBusiness"
                        value="yes"
                        checked={formData.currentlyRunningBusiness === 'yes'}
                        onChange={(e) => setFormData({...formData, currentlyRunningBusiness: e.target.value})}
                        required
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="currentlyRunningBusiness"
                        value="no"
                        checked={formData.currentlyRunningBusiness === 'no'}
                        onChange={(e) => setFormData({...formData, currentlyRunningBusiness: e.target.value})}
                        required
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">No</span>
                    </label>
                  </div>
                </div>

                {/* Business-related fields - Only show if they have a business */}
                {formData.currentlyRunningBusiness === 'yes' && (
                  <>
                    {/* MSME/Udyam Registration Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">MSME/Udyam Registration Number (Optional)</label>
                      <input
                        type="text"
                        value={formData.msmeUdyamNumber}
                        onChange={(e) => setFormData({...formData, msmeUdyamNumber: e.target.value})}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter MSME/Udyam registration number"
                      />
                    </div>

                    {/* Upload Business Documents */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Upload Business Documents *</label>
                      <input
                        type="file"
                        onChange={(e) => setFormData({...formData, businessDocuments: e.target.files[0]})}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        required={formData.currentlyRunningBusiness === 'yes'}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">Accepted formats: PDF, DOC, DOCX, JPG, PNG</p>
                    </div>

                    {/* Business Registration Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Business Registration Type (if any)</label>
                      <select
                        value={formData.businessRegistrationType}
                        onChange={(e) => setFormData({...formData, businessRegistrationType: e.target.value})}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select registration type</option>
                        <option value="sole-proprietorship">Sole Proprietorship</option>
                        <option value="partnership">Partnership</option>
                        <option value="llp">Limited Liability Partnership (LLP)</option>
                        <option value="private-limited">Private Limited Company</option>
                        <option value="public-limited">Public Limited Company</option>
                        <option value="one-person-company">One Person Company (OPC)</option>
                        <option value="not-registered">Not Registered</option>
                      </select>
                    </div>
                  </>
                )}

                {/* Business Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {formData.currentlyRunningBusiness === 'yes' 
                      ? 'What type of business do you have? *' 
                      : 'What type of business do you plan to start? *'}
                  </label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => setFormData({...formData, businessType: e.target.value, businessTypeOther: ''})}
                    required
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select business type</option>
                    <option value="retail">Retail</option>
                    <option value="wholesale">Wholesale</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="service">Service</option>
                    <option value="technology">Technology</option>
                    <option value="agriculture">Agriculture</option>
                    <option value="food-beverage">Food & Beverage</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="education">Education</option>
                    <option value="hospitality">Hospitality</option>
                    <option value="other">Other</option>
                  </select>
                  {formData.businessType === 'other' && (
                    <input
                      type="text"
                      value={formData.businessTypeOther}
                      onChange={(e) => setFormData({...formData, businessTypeOther: e.target.value})}
                      required
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-2"
                      placeholder="Please specify business type"
                    />
                  )}
                </div>

                {/* Business Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Business Name/Brand Name *</label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                    required
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter business/brand name"
                  />
                </div>

                {/* Loan Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Amount of Loan Required *</label>
                  <input
                    type="number"
                    value={formData.loanAmount}
                    onChange={(e) => setFormData({...formData, loanAmount: e.target.value})}
                    required
                    min="0"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter loan amount (₹)"
                  />
                </div>

                {/* Loan Purpose */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">What will the loan be used for? *</label>
                  <select
                    value={formData.loanPurpose}
                    onChange={(e) => setFormData({...formData, loanPurpose: e.target.value, loanPurposeOther: ''})}
                    required
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select purpose</option>
                    <option value="working-capital">Working Capital</option>
                    <option value="business-expansion">Business Expansion</option>
                    <option value="equipment-purchase">Equipment Purchase</option>
                    <option value="infrastructure">Infrastructure Development</option>
                    <option value="inventory">Inventory Purchase</option>
                    <option value="marketing">Marketing & Advertising</option>
                    <option value="technology-upgrade">Technology Upgrade</option>
                    <option value="other">Other</option>
                  </select>
                  {formData.loanPurpose === 'other' && (
                    <input
                      type="text"
                      value={formData.loanPurposeOther}
                      onChange={(e) => setFormData({...formData, loanPurposeOther: e.target.value})}
                      required
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-2"
                      placeholder="Please specify loan purpose"
                    />
                  )}
                </div>

                {/* Loan Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Which loan type are you interested in? *</label>
                  <select
                    value={formData.loanType}
                    onChange={(e) => setFormData({...formData, loanType: e.target.value, loanTypeOther: ''})}
                    required
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select loan type</option>
                    <option value="mudra">MUDRA Loan</option>
                    <option value="pmegp">PMEGP</option>
                    <option value="stand-up-india">Stand-Up India</option>
                    <option value="startup-india">Startup India</option>
                    <option value="cgtmse">CGTMSE</option>
                    <option value="other">Other</option>
                  </select>
                  {formData.loanType === 'other' && (
                    <input
                      type="text"
                      value={formData.loanTypeOther}
                      onChange={(e) => setFormData({...formData, loanTypeOther: e.target.value})}
                      required
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-2"
                      placeholder="Please specify loan type"
                    />
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowLoanForm(false)}
                    className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoansPage;

