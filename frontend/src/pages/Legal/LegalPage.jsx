import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNavbar from '../../components/common/BottomNavbar';

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
    // Load active tab from localStorage
    return localStorage.getItem('legalActiveTab') || 'services';
  });

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
  
  const legalServices = [
    { id: 1, name: 'GST Registration', icon: '📋', color: 'from-blue-500 to-cyan-500' },
    { id: 2, name: 'GST Filing', icon: '📄', color: 'from-green-500 to-emerald-500' },
    { id: 3, name: 'Income Tax Filing', icon: '💰', color: 'from-purple-500 to-violet-500' },
    { id: 4, name: 'ROC Filing', icon: '🏢', color: 'from-orange-500 to-red-500' },
    { id: 5, name: 'Import Export Registration', icon: '🚢', color: 'from-indigo-500 to-blue-500' },
    { id: 6, name: 'MSME Registration', icon: '🏭', color: 'from-teal-500 to-green-500' },
    { id: 7, name: 'Trade Mark Filing', icon: '™️', color: 'from-pink-500 to-rose-500' },
    { id: 8, name: 'Food (FSSAI) License', icon: '🍽️', color: 'from-yellow-500 to-orange-500' },
    { id: 9, name: 'PF/ESIC Registration', icon: '👥', color: 'from-cyan-500 to-blue-500' },
    { id: 10, name: 'ISO Certification', icon: '🏆', color: 'from-emerald-500 to-teal-500' },
    { id: 11, name: 'Proprietorship Company Registration', icon: '👤', color: 'from-violet-500 to-purple-500' },
    { id: 12, name: 'Partnership Company Registration', icon: '🤝', color: 'from-red-500 to-pink-500' },
    { id: 13, name: 'Private Limited/LLP Company Registration', icon: '🏛️', color: 'from-blue-600 to-indigo-600' },
    { id: 14, name: 'NGO Registration', icon: '❤️', color: 'from-green-600 to-emerald-600' },
    { id: 15, name: 'Project Report', icon: '📊', color: 'from-amber-500 to-yellow-500' }
  ];

  // Mock applied services with status
  const appliedServices = [
    {
      id: 1,
      serviceName: 'GST Registration',
      serviceIcon: '📋',
      appliedDate: '2024-01-15',
      status: 'pending'
    },
    {
      id: 2,
      serviceName: 'Income Tax Filing',
      serviceIcon: '💰',
      appliedDate: '2024-01-20',
      status: 'accepted'
    }
  ];

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
      {/* Header */}
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
          
          <h1 className="text-xl font-bold text-white">Legal Services</h1>
          
          <div className="w-10"></div>
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
      <div className="px-4 pt-6 pb-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Legal Services</h1>
          <p className="text-gray-600">Professional legal registration and compliance services</p>
        </motion.div>

        {/* Services Grid */}
        {activeTab === 'services' && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-6xl mx-auto"
        >
          {legalServices.map((service, index) => (
            <motion.div
              key={service.id}
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
                      {service.icon}
                    </motion.div>
                  </div>

                  {/* Service Name */}
                  <h3 className="text-xs font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 text-center">
                    {service.name}
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
          ))}
        </motion.div>
        )}

        {/* Status Tab Content */}
        {activeTab === 'status' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 max-w-4xl mx-auto"
          >
            {appliedServices.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">No Applied Services</div>
                <p className="text-gray-400 mt-2">Your applied service status will appear here</p>
              </div>
            ) : (
              appliedServices.map((service) => (
                <motion.div
                  key={service.id}
                  variants={fadeInUp}
                  className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">{service.serviceIcon}</div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{service.serviceName}</h3>
                        <p className="text-sm text-gray-600 mt-1">Applied on: {service.appliedDate}</p>
                      </div>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                      service.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : service.status === 'accepted' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                    </span>
                  </div>

                </motion.div>
              ))
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