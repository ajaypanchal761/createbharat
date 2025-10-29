import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { loanCategories } from '../../data/loanSchemes';
import { loansAPI } from '../../utils/api';
import BottomNavbar from '../../components/common/BottomNavbar';
import logo from '../../assets/logo.png';
import govLoanImg from '../../assets/Government-personal-loan-scheme.webp';
import techImage from '../../assets/techImage.webp';
import mentorImage from '../../assets/mentor.png';
import legalImage from '../../assets/legal.png';

// Bottom Nav Icons (copied from HomePage for consistency)
const HomeIcon = ({ active }) => (<svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>);
const BriefcaseIcon = ({ active }) => (<svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>);
const ChatIcon = ({ active }) => (<svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>);
const PlusIcon = ({ active }) => (<svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-white' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>);
const UserIcon = ({ active }) => (<svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>);
const BarChartIcon = ({ active }) => (<svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>);
const BellIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>);

const LoansPage = () => {
  const [governmentLoans, setGovernmentLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSchemes = async () => {
      try {
        setIsLoading(true);
        const res = await loansAPI.getSchemes({ limit: 20 });
        const items = (res.data || []).map((s) => ({
          id: s._id,
          title: s.shortName || s.name,
          image: govLoanImg,
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 md:bg-gradient-to-br md:from-gray-50 md:via-blue-50 md:to-indigo-50">

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="md:hidden flex items-center justify-between px-4 py-4 bg-gradient-to-r from-orange-400 to-orange-500 shadow-lg sticky top-0 z-50"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="flex items-center gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.1, x: -2, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300"
          >
            <Link to="/" className="flex items-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
          </motion.button>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-2xl font-bold text-white"
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
              <button className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium">
                Micro Loans
              </button>
              <button className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium">
                Startup Loans
              </button>
            </div>
          </div>
        </div>


        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {(isLoading ? Array.from({ length: 8 }).map((_, index) => ({ skeleton: true, id: index })) : governmentLoans).map((loan, index) => (
            <motion.div
              key={loan.id}
              variants={scaleIn}
              whileHover={{ scale: 1.05, y: -8, rotateY: 5 }}
              whileTap={{ scale: 0.95 }}
              className="group relative"
            >
              {/* Animated Border */}
              <motion.div
                className="absolute -inset-0.5 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 rounded-2xl blur-sm opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"
                animate={{
                  background: [
                    "linear-gradient(45deg, #f97316, #ef4444, #ec4899)",
                    "linear-gradient(45deg, #ec4899, #f97316, #ef4444)",
                    "linear-gradient(45deg, #ef4444, #ec4899, #f97316)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />

              <Link to={`/loans/${loan.id}`}>
                <div className={`relative bg-gradient-to-br ${loan.bgColor} backdrop-blur-lg rounded-2xl p-4 md:p-5 shadow-lg border border-white/40 overflow-hidden h-52 md:h-48 hover:shadow-xl transition-all duration-300`}>
                  {/* Image */}
                  <div className="relative mb-3 md:mb-4">
                    <motion.div
                      whileHover={{ scale: 1.05, rotate: 1 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-16 md:h-20 rounded-lg overflow-hidden shadow-md"
                    >
                      {loan.skeleton ? (
                        <div className="w-full h-full bg-gray-200 animate-pulse rounded" />
                      ) : (
                        <img
                          src={loan.image}
                          alt={loan.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </motion.div>
                    {/* Gradient Overlay */}
                    <motion.div
                      whileHover={{ opacity: 0.4 }}
                      className={`absolute inset-0 bg-gradient-to-t ${loan.color} opacity-30 rounded-lg transition-opacity duration-300`}
                    ></motion.div>

                    {/* Floating Icon */}
                    <motion.div
                      animate={{
                        y: [0, -3, 0],
                        rotate: [0, 3, -3, 0]
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className={`absolute top-1 right-1 w-6 h-6 md:w-7 md:h-7 bg-gradient-to-r ${loan.color} rounded-full flex items-center justify-center shadow-md`}
                    >
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </motion.div>
                  </div>

                  {/* Title */}
                  <motion.h3
                    whileHover={{ scale: 1.02 }}
                    className={`font-bold ${loan.textColor} text-sm md:text-base mb-2 group-hover:text-gray-800 transition-colors line-clamp-1`}
                  >
                    {loan.skeleton ? 'Loading...' : loan.title}
                  </motion.h3>

                  {/* Description */}
                  <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4 line-clamp-2 leading-relaxed">
                    {loan.skeleton ? 'Please wait while we load the schemes...' : loan.description}
                  </p>

                  {/* Action Button */}
                  <div className="flex justify-end">
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: 8 }}
                      whileTap={{ scale: 0.9 }}
                      className={`w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r ${loan.color} rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300`}
                    >
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.div>
                  </div>

                  {/* Hover Glow Effect */}
                  <motion.div
                    className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r ${loan.color}20`}
                    initial={false}
                    animate={{
                      scale: [1, 1.05, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    style={{
                      filter: 'blur(15px)'
                    }}
                  />
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
          { name: 'Status', path: '/loans/status', icon: <BarChartIcon /> },
          { name: 'Profile', path: '/profile', icon: <UserIcon /> }
        ]}
      />
    </div>
  );
};

export default LoansPage;

