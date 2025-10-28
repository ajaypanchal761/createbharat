import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { loansAPI } from '../../utils/api';

// Bottom Nav Icons (copied from HomePage for consistency)
const HomeIcon = ({ active }) => (<svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-indigo-600' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>);
const BriefcaseIcon = ({ active }) => (<svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-indigo-600' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>);
const ChatIcon = ({ active }) => (<svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-indigo-600' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>);
const PlusIcon = ({ active }) => (<svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-white' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>);
const UserIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6 text-gray-400"} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>);
const BellIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>);

const LoanDetailPage = () => {
  const { schemeId } = useParams();
  const navigate = useNavigate();
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [loan, setLoan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadScheme = async () => {
      try {
        setIsLoading(true);
        const res = await loansAPI.getSchemeById(schemeId);
        setLoan(res.data);
      } catch (e) {
        setError(e.message || 'Failed to load loan scheme');
      } finally {
        setIsLoading(false);
      }
    };
    loadScheme();
  }, [schemeId]);

  // Handle Apply Now button
  const handleApplyNow = () => {
    setIsApplying(true);
    setToastMessage('Redirecting to application form...');
    setShowToast(true);

    // Simulate application process
    setTimeout(() => {
      setIsApplying(false);
      setShowToast(false);
      // Navigate to application page
      navigate(`/loans/${schemeId}/apply`);
    }, 1000);
  };

  // Handle Save for Later button
  const handleSaveForLater = () => {
    setIsSaved(true);
    setToastMessage('Loan saved successfully!');
    setShowToast(true);

    // Save to localStorage or send to backend
    const savedLoans = JSON.parse(localStorage.getItem('savedLoans') || '[]');
    if (!savedLoans.find(l => l.id === loan.id)) {
      savedLoans.push({
        id: loan.id,
        name: loan.name,
        savedAt: new Date().toISOString()
      });
      localStorage.setItem('savedLoans', JSON.stringify(savedLoans));
    }

    // Show success feedback
    setTimeout(() => {
      setIsSaved(false);
      setShowToast(false);
    }, 2000);
  };

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

  if (isLoading) return <div className="text-center py-10">Loading scheme...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;
  if (!loan) return <div className="text-center py-10">Loan scheme not found.</div>;

  // Downloadable checklists data
  const checklists = [
    {
      id: 'basic-registration',
      title: 'Checklist of Basic Registration',
      description: 'Essential documents for basic loan registration'
    },
    {
      id: 'central-license',
      title: 'Checklist of Central License',
      description: 'Documents required for central government loans'
    },
    {
      id: 'state-license',
      title: 'Checklist for State License',
      description: 'State-specific loan documentation requirements'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 md:bg-gradient-to-br md:from-gray-50 md:via-blue-50 md:to-indigo-50">

      {/* Mobile Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="md:hidden flex items-center justify-between px-4 py-4 bg-white/90 backdrop-blur-lg border-b border-gradient-to-r from-blue-200 to-purple-200 shadow-lg"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="flex items-center gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.1, x: -2, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 transition-all duration-300"
          >
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
          >
            {loan.name}
          </motion.h1>
        </motion.div>
      </motion.header>

      {/* Desktop Header */}
      <div className="hidden md:block bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{loan.name}</h1>
                <p className="text-gray-600 mt-1">Government Loan Scheme Details</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleApplyNow}
                disabled={isApplying}
                className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${isApplying
                    ? 'bg-blue-400 text-white cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
              >
                {isApplying ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Applying...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Apply Now
                  </>
                )}
              </button>
              <button
                onClick={handleSaveForLater}
                disabled={isSaved}
                className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${isSaved
                    ? 'bg-green-100 text-green-700 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {isSaved ? (
                  <>
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Saved!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    Save for Later
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 pb-20 md:px-8 md:py-8">
        {/* Desktop Layout */}
        <div className="hidden md:block max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Section Heading - Mobile Only */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="md:hidden text-xl font-bold bg-gradient-to-r from-gray-800 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-8 text-center"
              >
                {loan.name}
              </motion.h2>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-8 w-full"
              >
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 md:p-8 shadow-xl border border-white/20 w-full"
                >
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">About {loan.name}</h3>
                  <p className="text-gray-700 leading-relaxed mb-6 text-sm md:text-base w-full">
                    The <span className="font-bold text-blue-600">{loan.name}</span> is a comprehensive government-backed financial assistance program designed to support entrepreneurs, startups, and established businesses across India. This flagship scheme provides access to affordable credit facilities with competitive interest rates, flexible repayment terms, and minimal documentation requirements.
                  </p>

                  {/* Key Features */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">💰 Loan Amount</h4>
                      <p className="text-sm text-gray-600">Up to ₹50 Lakhs for eligible businesses</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">📈 Interest Rate</h4>
                      <p className="text-sm text-gray-600">Starting from 8.5% per annum</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">⏰ Repayment</h4>
                      <p className="text-sm text-gray-600">Flexible tenure up to 7 years</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">📋 Processing</h4>
                      <p className="text-sm text-gray-600">Quick approval within 15 days</p>
                    </div>
                  </div>

                  {/* Know More Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowMoreInfo(!showMoreInfo)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    {showMoreInfo ? 'Show Less' : 'Know More'}
                    <motion.svg
                      animate={{ rotate: showMoreInfo ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </motion.svg>
                  </motion.button>
                </motion.div>

                {/* Additional Information */}
                <motion.div
                  initial={false}
                  animate={{
                    height: showMoreInfo ? "auto" : 0,
                    opacity: showMoreInfo ? 1 : 0
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: showMoreInfo ? 1 : 0, y: showMoreInfo ? 0 : 20 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="pt-4 space-y-4"
                  >
                    <motion.div
                      className="bg-gray-50 rounded-xl p-4 border border-gray-200 w-full"
                    >
                      <p className="text-gray-700 leading-relaxed text-sm w-full">
                        The loan scheme is mandatory for eligible business operators who are involved in manufacturing, processing, storage, distribution, or sale of products and services. The distinction between basic registration and full license depends on the business size, annual turnover, and nature of operations.
                      </p>
                    </motion.div>
                    <motion.div
                      className="bg-gray-50 rounded-xl p-4 border border-gray-200 w-full"
                    >
                      <p className="text-gray-700 leading-relaxed text-sm w-full">
                        Each approved loan comes with a unique 14-digit registration number that includes the state code and producer's permit details. This system enhances accountability and maintains the quality of financial products and services provided to beneficiaries.
                      </p>
                    </motion.div>
                    <motion.div
                      className="bg-gray-50 rounded-xl p-4 border border-gray-200 w-full"
                    >
                      <p className="text-gray-700 leading-relaxed text-sm w-full">
                        The loan scheme is regulated under the Government of India's financial assistance regulations, ensuring transparency and proper implementation of the program across all states and union territories.
                      </p>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Downloadable Checklists */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="space-y-3 mb-8"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">Required Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {checklists.map((checklist, index) => (
                    <motion.div
                      key={checklist.id}
                      variants={scaleIn}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="group"
                    >
                      <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1">{checklist.title}</h3>
                              <p className="text-sm text-gray-600">{checklist.description}</p>
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors shadow-md"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* How To Apply Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mb-8"
              >
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 shadow-lg"
                >
                  <h3 className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4 flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-2xl"
                    >
                      🚀
                    </motion.span>
                    How To Apply:
                  </h3>
                  <motion.a
                    href={loan.officialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05, x: 5, boxShadow: "0 10px 25px rgba(34, 197, 94, 0.3)" }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-full font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg"
                  >
                    <span>Visit Official Website</span>
                    <motion.svg
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </motion.svg>
                  </motion.a>
                  <p className="text-xs text-gray-600 mt-2 break-all w-full">{loan.officialLink}</p>
                </motion.div>
              </motion.div>

              {/* Video Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mb-8"
              >
                <motion.h3
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-6 text-center flex items-center justify-center gap-2"
                >
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-3xl"
                  >
                    🎥
                  </motion.span>
                  Learn More About {loan.name}
                </motion.h3>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative group"
                >
                  <div className="relative bg-gray-800 rounded-2xl overflow-hidden shadow-lg">
                    <div className="aspect-video md:aspect-[16/9] flex items-center justify-center relative">
                      {loan.videoUrl ? (
                        <iframe
                          className="w-full h-full rounded-2xl"
                          src={loan.videoUrl}
                          title={`${loan.name} Information Video`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-white/80">
                          <motion.div
                            animate={{
                              rotate: 360,
                              scale: [1, 1.1, 1]
                            }}
                            transition={{
                              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                            }}
                            className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full mb-4"
                          />
                          <p className="text-lg font-semibold mb-2">
                            Video Coming Soon
                          </p>
                          <p className="text-xs text-center px-6 text-white/60 w-full">
                            We're working on adding an informative video for this loan scheme.
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="p-6 bg-gradient-to-r from-purple-600 to-pink-600">
                      <motion.p
                        animate={{ opacity: [0.8, 1, 0.8] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-white font-medium text-center flex items-center justify-center gap-2"
                      >
                        <span className="text-xl">📹</span>
                        Complete Guide to {loan.name}
                      </motion.p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Quick Info Card */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Info</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Interest Rate</span>
                    <span className="font-semibold text-green-600">8.5% - 12%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Loan Amount</span>
                    <span className="font-semibold text-blue-600">₹10L - ₹50L</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Processing Time</span>
                    <span className="font-semibold text-purple-600">15 Days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Repayment</span>
                    <span className="font-semibold text-orange-600">Up to 7 Years</span>
                  </div>
                </div>
              </div>

              {/* Eligibility Card */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Eligibility</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    Indian citizen or registered entity
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    Minimum 2 years business experience
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    Annual turnover ₹10L - ₹5Cr
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    Valid business registration
                  </li>
                </ul>
              </div>

              {/* Contact Card */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-4">Our loan experts are here to assist you.</p>
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout - Keep existing mobile content */}
        <div className="md:hidden">
          {/* Section Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl font-bold bg-gradient-to-r from-gray-800 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-8 text-center"
          >
            {loan.name}
          </motion.h2>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 w-full"
          >
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 w-full"
            >
              <p className="text-gray-700 leading-relaxed mb-4 text-sm w-full">
                The <span className="font-bold text-blue-600">{loan.name}</span> is a government-backed financial assistance program designed to support entrepreneurs and businesses in India. This scheme provides access to affordable credit facilities with competitive interest rates and flexible repayment terms.
              </p>

              {/* Know More Button */}
              <motion.button
                whileHover={{ scale: 1.05, x: 5, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowMoreInfo(!showMoreInfo)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 shadow-lg"
              >
                {showMoreInfo ? 'Show Less' : 'Know More'}
                <motion.svg
                  animate={{ rotate: showMoreInfo ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
              </motion.button>
            </motion.div>

            {/* Additional Information */}
            <motion.div
              initial={false}
              animate={{
                height: showMoreInfo ? "auto" : 0,
                opacity: showMoreInfo ? 1 : 0
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: showMoreInfo ? 1 : 0, y: showMoreInfo ? 0 : 20 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="pt-4 space-y-4"
              >
                <motion.div
                  whileHover={{ x: 5 }}
                  className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border-l-4 border-blue-500 w-full"
                >
                  <p className="text-gray-700 leading-relaxed text-sm w-full">
                    The loan scheme is mandatory for eligible business operators who are involved in manufacturing, processing, storage, distribution, or sale of products and services. The distinction between basic registration and full license depends on the business size, annual turnover, and nature of operations.
                  </p>
                </motion.div>
                <motion.div
                  whileHover={{ x: 5 }}
                  className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-l-4 border-green-500 w-full"
                >
                  <p className="text-gray-700 leading-relaxed text-sm w-full">
                    Each approved loan comes with a unique 14-digit registration number that includes the state code and producer's permit details. This system enhances accountability and maintains the quality of financial products and services provided to beneficiaries.
                  </p>
                </motion.div>
                <motion.div
                  whileHover={{ x: 5 }}
                  className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border-l-4 border-purple-500 w-full"
                >
                  <p className="text-gray-700 leading-relaxed text-sm w-full">
                    The loan scheme is regulated under the Government of India's financial assistance regulations, ensuring transparency and proper implementation of the program across all states and union territories.
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Downloadable Checklists */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-3 mb-8"
          >
            {checklists.map((checklist, index) => (
              <motion.div
                key={checklist.id}
                variants={scaleIn}
                whileHover={{ scale: 1.03, y: -5, rotateY: 5 }}
                whileTap={{ scale: 0.98 }}
                className="relative group"
              >
                {/* Animated Border */}
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 rounded-2xl blur-sm opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"
                  animate={{
                    background: [
                      "linear-gradient(45deg, #f97316, #ef4444, #ec4899)",
                      "linear-gradient(45deg, #ec4899, #f97316, #ef4444)",
                      "linear-gradient(45deg, #ef4444, #ec4899, #f97316)"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />

                <div className="relative bg-white/90 backdrop-blur-lg rounded-xl p-4 shadow-lg border border-white/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center shadow-md"
                      >
                        <span className="text-white text-xs font-bold">PDF</span>
                      </motion.div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-xs mb-1">{checklist.title}</h3>
                        <p className="text-xs text-gray-600">{checklist.description}</p>
                      </div>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer shadow-md"
                    >
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* How To Apply Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 shadow-lg"
            >
              <h3 className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4 flex items-center gap-2">
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-2xl"
                >
                  🚀
                </motion.span>
                How To Apply:
              </h3>
              <motion.a
                href={loan.officialLink}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, x: 5, boxShadow: "0 10px 25px rgba(34, 197, 94, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-full font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg"
              >
                <span>Visit Official Website</span>
                <motion.svg
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </motion.svg>
              </motion.a>
              <p className="text-xs text-gray-600 mt-2 break-all w-full">{loan.officialLink}</p>
            </motion.div>
          </motion.div>

          {/* Video Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-8"
          >
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-6 text-center flex items-center justify-center gap-2"
            >
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-3xl"
              >
                🎥
              </motion.span>
              Learn More About {loan.name}
            </motion.h3>

            <motion.div
              whileHover={{ scale: 1.03, y: -5, rotateY: 2 }}
              className="relative group"
            >
              {/* Animated Border */}
              <motion.div
                className="absolute -inset-2 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-3xl blur-lg opacity-60 group-hover:opacity-100 transition duration-1000"
                animate={{
                  background: [
                    "linear-gradient(45deg, #a855f7, #ec4899, #ef4444)",
                    "linear-gradient(45deg, #ec4899, #ef4444, #a855f7)",
                    "linear-gradient(45deg, #ef4444, #a855f7, #ec4899)"
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden shadow-2xl">
                <div className="aspect-video flex items-center justify-center relative">
                  {loan.videoUrl ? (
                    <iframe
                      className="w-full h-full rounded-2xl"
                      src={loan.videoUrl}
                      title={`${loan.name} Information Video`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-white/80">
                      <motion.div
                        animate={{
                          rotate: 360,
                          scale: [1, 1.1, 1]
                        }}
                        transition={{
                          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                        }}
                        className="w-20 h-20 border-4 border-white/30 border-t-white rounded-full mb-6"
                      />
                      <motion.p
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-xl font-bold mb-3"
                      >
                        Video Coming Soon
                      </motion.p>
                      <p className="text-xs text-center px-6 text-white/60 w-full">
                        We're working on adding an informative video for this loan scheme.
                      </p>
                    </div>
                  )}
                </div>
                <div className="p-6 bg-gray-700">
                  <p className="text-white font-medium text-center flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Complete Guide to {loan.name}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <motion.footer
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="md:hidden fixed bottom-0 left-0 right-0 w-full bg-white/95 backdrop-blur-xl rounded-t-3xl shadow-[0_-10px_30px_-5px_rgba(0,0,0,0.2)] border-t border-gradient-to-r from-blue-200 to-purple-200 z-50"
      >
        <nav className="flex justify-around items-center h-16 px-1">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link to="/" className="flex flex-col items-center justify-center text-gray-500 flex-1 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <HomeIcon active={false} />
              </motion.div>
              <span className="text-[10px] group-hover:text-blue-600 transition-colors">Home</span>
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link to="/loans" className="flex flex-col items-center justify-center text-indigo-600 flex-1 group">
              <motion.div
                whileHover={{ scale: 1.2, rotate: 5 }}
                transition={{ duration: 0.3 }}
                className="p-2 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </motion.div>
              <span className="text-[10px] font-bold">Loans</span>
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link to="/internships" className="flex flex-col items-center justify-center text-gray-500 flex-1 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <BriefcaseIcon />
              </motion.div>
              <span className="text-[10px] group-hover:text-blue-600 transition-colors">Internships</span>
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link to="/legal" className="flex flex-col items-center justify-center text-gray-500 flex-1 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
              </motion.div>
              <span className="text-[10px] group-hover:text-blue-600 transition-colors">Legal</span>
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link to="/mentors" className="flex flex-col items-center justify-center text-gray-500 flex-1 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </motion.div>
              <span className="text-[10px] group-hover:text-blue-600 transition-colors">Mentors</span>
            </Link>
          </motion.div>
        </nav>
      </motion.footer>

      {/* Toast Notification */}
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 bg-white rounded-lg shadow-lg border border-gray-200 px-6 py-4 flex items-center gap-3"
        >
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-gray-700 font-medium">{toastMessage}</span>
        </motion.div>
      )}
    </div>
  );
};

export default LoanDetailPage;

