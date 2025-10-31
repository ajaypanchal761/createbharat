import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNavbar from '../../components/common/BottomNavbar';
import { legalServiceAPI, legalSubmissionAPI } from '../../utils/api';

// Icons
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const HomeIcon = ({ active }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> );
const BriefcaseIcon = ({ active }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> );
const ChatIcon = ({ active }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg> );
const DocumentIcon = ({ active }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> );
const UserIcon = ({ active }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> );
const StatusIcon = ({ active }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> );

const LegalPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    // Load active tab from localStorage, default to 'services'
    const storedTab = localStorage.getItem('legalActiveTab');
    const tab = storedTab && ['services', 'status'].includes(storedTab) ? storedTab : 'services';
    console.log('[LegalPage] Initial activeTab:', tab, 'stored:', storedTab);
    
    // Ensure localStorage is set correctly
    if (tab !== storedTab) {
      localStorage.setItem('legalActiveTab', tab);
    }
    
    return tab;
  });
  const [legalServices, setLegalServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userSubmissions, setUserSubmissions] = useState([]);
  const [isSubmissionsLoading, setIsSubmissionsLoading] = useState(false);

  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('legalActiveTab', activeTab);
  }, [activeTab]);

  // Listen for tab changes from Navbar (webview)
  useEffect(() => {
    const handleNavbarTabChange = (event) => {
      setActiveTab(event.detail.tab);
    };
    window.addEventListener('navbarLegalTabChange', handleNavbarTabChange);
    return () => window.removeEventListener('navbarLegalTabChange', handleNavbarTabChange);
  }, []);

  // Notify Navbar when tab changes in this page
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('legalTabChange', { detail: { tab: activeTab } }));
  }, [activeTab]);

  // Fetch legal services from backend
  useEffect(() => {
    fetchLegalServices();
  }, []);

  // Debug: Log whenever legalServices state changes
  useEffect(() => {
    console.log('[LegalPage] legalServices state changed:', {
      count: legalServices.length,
      services: legalServices,
      activeTab,
      isLoading
    });
  }, [legalServices, activeTab, isLoading]);

  // Fetch user submissions when status tab is active
  useEffect(() => {
    if (activeTab === 'status') {
      fetchUserSubmissions();
    }
  }, [activeTab]);

  const fetchUserSubmissions = async () => {
    setIsSubmissionsLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      if (!token) {
        setUserSubmissions([]);
        setIsSubmissionsLoading(false);
        return;
      }

      const response = await legalSubmissionAPI.getUserSubmissions(token);
      console.log('[LegalPage] User submissions response:', response);
      
      if (response && response.success && response.data) {
        const submissionsArray = Array.isArray(response.data) ? response.data : [];
        console.log('[LegalPage] Submissions array:', submissionsArray);
        
        // Transform submissions for display
        const transformedSubmissions = submissionsArray.map((submission) => {
          const service = submission.service || {};
          return {
            id: submission._id || submission.id,
            serviceName: submission.serviceName || service.name || 'Legal Service',
            serviceIcon: service.icon || submission.serviceIcon || '⚖️',
            appliedDate: submission.createdAt 
              ? new Date(submission.createdAt).toLocaleDateString('en-IN', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })
              : 'N/A',
            status: submission.status || 'pending',
            paymentStatus: submission.paymentStatus || 'pending',
            category: submission.category || '',
            serviceId: submission.service?._id || submission.service || '',
            rejectionReason: submission.rejectionReason || '',
            refundedAt: submission.refundedAt || null,
            refundId: submission.refundId || null,
            refundAmount: submission.refundAmount || 0,
            paymentAmount: submission.paymentAmount || 0
          };
        });
        
        console.log('[LegalPage] Transformed submissions:', transformedSubmissions);
        setUserSubmissions(transformedSubmissions);
      } else {
        console.warn('[LegalPage] Submissions response missing data:', response);
        setUserSubmissions([]);
      }
    } catch (err) {
      console.error('[LegalPage] Error fetching user submissions:', err);
      setUserSubmissions([]);
    } finally {
      setIsSubmissionsLoading(false);
    }
  };

  const fetchLegalServices = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('[LegalPage] Fetching legal services...');
      const response = await legalServiceAPI.getAll();
      console.log('[LegalPage] API Response received:', response);
      console.log('[LegalPage] Response type:', typeof response);
      console.log('[LegalPage] Response success:', response?.success);
      console.log('[LegalPage] Response data:', response?.data);
      
      if (response && response.success && response.data) {
        // Ensure response.data is an array
        const servicesArray = Array.isArray(response.data) ? response.data : [];
        console.log('[LegalPage] Services Array:', servicesArray);
        console.log('[LegalPage] Services Array Length:', servicesArray.length);
        
        if (servicesArray.length > 0) {
          // Transform backend data to match frontend format
          const transformedServices = servicesArray.map((service, index) => {
            // Generate color gradient based on index or use default
            const colors = [
              'from-blue-500 to-cyan-500',
              'from-green-500 to-emerald-500',
              'from-purple-500 to-violet-500',
              'from-orange-500 to-red-500',
              'from-indigo-500 to-blue-500',
              'from-teal-500 to-green-500',
              'from-pink-500 to-rose-500',
              'from-yellow-500 to-orange-500',
              'from-cyan-500 to-blue-500',
              'from-emerald-500 to-teal-500',
              'from-violet-500 to-purple-500',
              'from-red-500 to-pink-500',
              'from-blue-600 to-indigo-600',
              'from-green-600 to-emerald-600',
              'from-amber-500 to-yellow-500'
            ];
            
            const serviceId = service._id || service.id;
            const serviceName = service.name || 'Legal Service';
            const serviceIcon = service.icon || '⚖️';
            
            const transformed = {
              id: serviceId,
              name: serviceName,
              icon: serviceIcon,
              color: colors[index % colors.length]
            };
            
            console.log(`[LegalPage] Transformed service ${index}:`, transformed);
            return transformed;
          });
          
          console.log('[LegalPage] All Transformed Services:', transformedServices);
          console.log('[LegalPage] Setting legal services in state with count:', transformedServices.length);
          
          // Set state directly - more reliable than functional update
          setLegalServices(transformedServices);
          
          // Log after setting
          setTimeout(() => {
            console.log('[LegalPage] State set complete, services should be visible');
          }, 100);
        } else {
          console.warn('[LegalPage] Services array is empty after transformation');
          setLegalServices([]);
        }
      } else {
        console.warn('[LegalPage] API response missing data:', response);
        console.warn('[LegalPage] Response structure:', {
          hasResponse: !!response,
          hasSuccess: !!response?.success,
          hasData: !!response?.data,
          responseKeys: response ? Object.keys(response) : []
        });
        // Fallback to empty array if API fails
        setLegalServices([]);
      }
    } catch (err) {
      console.error('[LegalPage] Error fetching legal services:', err);
      console.error('[LegalPage] Error details:', {
        message: err.message,
        stack: err.stack,
        name: err.name
      });
      setError(err.message || 'Failed to fetch legal services');
      // Fallback to empty array if API fails
      setLegalServices([]);
    } finally {
      setIsLoading(false);
      console.log('[LegalPage] Loading state set to false');
    }
  };

  // Import legalSubmissionAPI for fetching user submissions
  // Using userSubmissions state instead of mock data

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

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Mobile Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="md:hidden sticky top-0 z-50 bg-gradient-to-r from-orange-400 to-orange-500 shadow-lg"
      >
        <div className="flex items-center justify-between px-4 py-3">
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>
          
          <h1 className="text-lg font-bold text-white">Legal Services</h1>
          
          <Link to="/ca/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-lg border border-white/30 hover:bg-white/30 transition-all"
            >
              CA Login
            </motion.button>
          </Link>
        </div>
      </motion.header>


      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="w-64 bg-white h-full shadow-xl"
            >
              <div className="p-6">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mb-6 p-2 hover:bg-gray-100 rounded-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="space-y-2">
                  <Link to="/" className="block py-3 px-4 rounded-lg hover:bg-gray-100 text-gray-700 font-medium">Home</Link>
                  <Link to="/loans" className="block py-3 px-4 rounded-lg hover:bg-gray-100 text-gray-700 font-medium">Loans</Link>
                  <Link to="/internships" className="block py-3 px-4 rounded-lg hover:bg-gray-100 text-gray-700 font-medium">Internships</Link>
                  <Link to="/mentors" className="block py-3 px-4 rounded-lg hover:bg-gray-100 text-gray-700 font-medium">Mentors</Link>
                  <Link to="/legal" className="block py-3 px-4 rounded-lg hover:bg-gray-100 text-gray-700 font-medium">Legal Services</Link>
                  <Link to="/training" className="block py-3 px-4 rounded-lg hover:bg-gray-100 text-gray-700 font-medium">Training</Link>
                  <Link to="/profile" className="block py-3 px-4 rounded-lg hover:bg-gray-100 text-gray-700 font-medium">Profile</Link>
                </div>
              </div>
            </motion.div>
            <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
          </div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="px-4 md:px-6 lg:px-8 pt-4 md:pt-8 pb-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-6 md:mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Legal Services</h1>
          <p className="text-sm md:text-base text-gray-600">Professional legal registration and compliance services</p>
          {/* CA Login Button - Desktop */}
          <div className="hidden md:block mt-4">
            <Link to="/ca/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg"
              >
                CA Login
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Services Grid - Debug */}
        {(() => {
          console.log('[LegalPage Render] Current state:', {
            activeTab,
            isLoading,
            servicesCount: legalServices.length,
            legalServices,
            activeTabIsServices: activeTab === 'services'
          });
          return null;
        })()}
        
        {/* Services Grid - Always show when activeTab is services */}
        {(activeTab === 'services' || !activeTab || activeTab === '') && (
          <div className="max-w-6xl mx-auto">
            {/* Debug: Show current state */}
            {console.log('[LegalPage Render] Rendering grid with activeTab:', activeTab, 'services:', legalServices.length) || null}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
            >
            {isLoading ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600">Loading services...</p>
              </div>
            ) : !legalServices || legalServices.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600">No services available at the moment.</p>
                <p className="text-sm text-gray-500 mt-2">Please check back later or contact support.</p>
                {error && (
                  <p className="text-sm text-red-500 mt-2">Error: {error}</p>
                )}
                <div className="mt-4 text-xs text-gray-400 space-y-1">
                  <p>Debug: legalServices = {JSON.stringify(legalServices)}</p>
                  <p>Debug: legalServices.length = {legalServices?.length || 0}</p>
                  <p>Debug: isLoading = {isLoading ? 'true' : 'false'}</p>
                  <p>Debug: activeTab = "{activeTab}"</p>
                </div>
              </div>
            ) : (
              (() => {
                const validServices = legalServices.filter((service) => service && service.id);
                console.log('[LegalPage Render] Rendering', validServices.length, 'services');
                if (validServices.length === 0) {
                  return (
                    <div className="col-span-full text-center py-12">
                      <p className="text-gray-600">No valid services to display.</p>
                      <p className="text-xs text-gray-400 mt-2">All services were filtered out.</p>
                    </div>
                  );
                }
                return validServices.map((service, index) => {
                  console.log(`[LegalPage Render] Rendering service ${index}:`, service);
                  return (
                    <motion.div
                      key={service.id || `service-${index}`}
                      initial="hidden"
                      animate="visible"
                      variants={scaleIn}
                    >
                  <Link to={`/legal/service/${service.id}`} className="group">
                    <motion.div 
                      whileHover={{ y: -5, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="bg-gray-50 rounded-lg p-3 shadow-md hover:shadow-lg border-2 border-gray-300 hover:border-gray-400 transition-all duration-300 cursor-pointer h-full flex flex-col"
                    >
                      {/* Service Icon */}
                      <div className="flex items-center justify-center mb-2">
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          transition={{ duration: 0.3 }}
                          className="text-2xl"
                        >
                          {service.icon || '⚖️'}
                        </motion.div>
                      </div>

                      {/* Service Name */}
                      <h3 className="text-xs font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 text-center">
                        {service.name || 'Legal Service'}
                      </h3>

                      {/* Spacer */}
                      <div className="flex-1"></div>

                      {/* Get Started Button */}
                      <div className="flex items-center justify-center">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full px-2 py-1.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-md font-medium text-xs hover:from-orange-600 hover:to-orange-700 transition-all flex items-center justify-center gap-1"
                        >
                          <span className="whitespace-nowrap">Get Started</span>
                          <motion.svg 
                            animate={{ x: [0, 3, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="w-2.5 h-2.5 flex-shrink-0" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </motion.svg>
                        </motion.button>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
                  );
                });
              })()
            )}
          </motion.div>
          </div>
        )}

        {/* Status Tab Content */}
        {activeTab === 'status' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 max-w-4xl mx-auto"
          >
            {isSubmissionsLoading ? (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">Loading your submissions...</div>
                <p className="text-gray-400 mt-2">Please wait</p>
              </div>
            ) : userSubmissions.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">No Applied Services</div>
                <p className="text-gray-400 mt-2">Your applied service status will appear here</p>
              </div>
            ) : (
              userSubmissions.map((submission) => {
                const getStatusColor = (status) => {
                  switch (status?.toLowerCase()) {
                    case 'completed':
                      return 'bg-green-100 text-green-800';
                    case 'in-progress':
                      return 'bg-blue-100 text-blue-800';
                    case 'rejected':
                      return 'bg-red-100 text-red-800';
                    case 'cancelled':
                      return 'bg-gray-100 text-gray-800';
                    case 'pending':
                    default:
                      return 'bg-yellow-100 text-yellow-800';
                  }
                };

                const getStatusLabel = (status) => {
                  switch (status?.toLowerCase()) {
                    case 'in-progress':
                      return 'In Progress';
                    case 'rejected':
                      return 'Rejected';
                    default:
                      return status?.charAt(0).toUpperCase() + status?.slice(1) || 'Pending';
                  }
                };

                return (
                  <motion.div
                    key={submission.id}
                    variants={fadeInUp}
                    className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100 hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="text-4xl">{submission.serviceIcon}</div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{submission.serviceName}</h3>
                          <p className="text-sm text-gray-600 mt-1">Applied on: {submission.appliedDate}</p>
                          {submission.category && (
                            <p className="text-xs text-gray-500 mt-1">Category: {submission.category}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(submission.status)}`}>
                          {getStatusLabel(submission.status)}
                        </span>
                        {submission.paymentStatus === 'completed' && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Paid
                          </span>
                        )}
                        {submission.status === 'rejected' && submission.rejectionReason && (
                          <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded-lg">
                            <strong>Reason:</strong> {submission.rejectionReason}
                          </div>
                        )}
                      </div>
                    </div>
                    {submission.status === 'pending' && submission.paymentStatus === 'completed' && (
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800 font-medium">✓ CA will contact you within 24 hours</p>
                        <p className="text-xs text-blue-600 mt-1">Your payment has been received and your submission is under review.</p>
                      </div>
                    )}
                    {submission.status === 'rejected' && submission.paymentStatus === 'refunded' && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800 font-medium">✓ Refund Processed</p>
                        <p className="text-xs text-green-600 mt-1">
                          Your payment of ₹{submission.refundAmount || submission.paymentAmount} has been refunded to your original payment method.
                          {submission.refundId && (
                            <span className="block mt-1">Refund ID: {submission.refundId}</span>
                          )}
                        </p>
                        {submission.rejectionReason && (
                          <p className="text-xs text-red-600 mt-2">
                            <strong>Reason:</strong> {submission.rejectionReason}
                          </p>
                        )}
                      </div>
                    )}
                    {submission.status === 'rejected' && submission.paymentStatus === 'completed' && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800 font-medium">⚠ Refund Processing</p>
                        <p className="text-xs text-yellow-600 mt-1">
                          Your submission has been rejected. Refund is being processed and will be credited to your original payment method within 5-7 business days.
                        </p>
                        {submission.rejectionReason && (
                          <p className="text-xs text-red-600 mt-2">
                            <strong>Reason:</strong> {submission.rejectionReason}
                          </p>
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })
            )}
          </motion.div>
        )}
      </div>

      {/* Bottom Navigation - Legal Specific */}
      <BottomNavbar 
        tabs={[
          { name: 'Home', path: '/', icon: <HomeIcon /> },
          { name: 'Services', path: '/legal', icon: <BriefcaseIcon />, onClick: () => setActiveTab('services'), isActive: activeTab === 'services' },
          { name: 'Status', path: '#', icon: <StatusIcon />, onClick: () => setActiveTab('status'), isActive: activeTab === 'status' },
          { name: 'Profile', path: '/profile', icon: <UserIcon /> }
        ]}
      />
    </div>
  );
};

export default LegalPage;