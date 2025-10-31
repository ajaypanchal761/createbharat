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
  const [loan, setLoan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Get YouTube thumbnail URL
  const getYouTubeThumbnail = (videoId) => {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

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

  // Animation variants
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

      {/* Desktop Header - Removed to avoid duplication with main Navbar */}

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
                    {loan.description || `The ${loan.name} is a comprehensive government-backed financial assistance program designed to support entrepreneurs, startups, and established businesses across India. This flagship scheme provides access to affordable credit facilities with competitive interest rates, flexible repayment terms, and minimal documentation requirements.`}
                  </p>

                  {/* Key Features */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">💰 Loan Amount</h4>
                      <p className="text-sm text-gray-600">₹{loan.minAmount?.toLocaleString()} - ₹{loan.maxAmount?.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">📈 Interest Rate</h4>
                      <p className="text-sm text-gray-600">{loan.interestRate || 'Contact for details'}</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">⏰ Repayment</h4>
                      <p className="text-sm text-gray-600">{loan.tenure || 'Flexible terms available'}</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">📋 Processing</h4>
                      <p className="text-sm text-gray-600">{loan.processingTime || 'Quick approval process'}</p>
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
                    className="pt-4 space-y-6"
                  >
                    {/* Benefits Section */}
                    {loan.benefits && loan.benefits.length > 0 && (
                      <motion.div
                        className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
                      >
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Benefits
                        </h4>
                        <ul className="space-y-2">
                          {loan.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start">
                              <svg className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="text-gray-700 text-sm">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}

                      </motion.div>
                </motion.div>
              </motion.div>

              {/* Required Documents Section - List Format */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="mb-8 md:mb-12"
              >
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4 md:mb-6">Required Documents</h3>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-gradient-to-br from-white to-blue-50 rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 shadow-lg md:shadow-xl border border-blue-200 md:border-2"
                >
                  {loan.documents && loan.documents.length > 0 ? (
                    <ul className="space-y-0.5 md:space-y-1">
                      {loan.documents.map((document, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="flex items-start gap-2 md:gap-3 px-2 py-1 md:py-1.5 rounded-lg hover:bg-white/60 transition-all duration-300 group"
                        >
                          <div className="flex-shrink-0 mt-1.5 md:mt-2">
                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                          </div>
                          <span className="text-gray-800 text-xs md:text-sm lg:text-base font-medium leading-tight flex-1">{document}</span>
                        </motion.li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-6 md:py-8">
                      <p className="text-gray-500 text-sm md:text-base">No documents specified</p>
                    </div>
                  )}
                </motion.div>
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
                      {loan.videoUrl ? (() => {
                        const videoId = getYouTubeVideoId(loan.videoUrl);
                        if (videoId) {
                          return (
                            <div
                              className="relative w-full h-full cursor-pointer group"
                              onClick={() => window.open(loan.videoUrl, '_blank')}
                            >
                              <img
                                src={getYouTubeThumbnail(videoId)}
                                alt={`${loan.name} Video Thumbnail`}
                                className="w-full h-full object-cover rounded-2xl"
                              />
                              {/* Play Button Overlay */}
                              <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-all duration-300">
                                <motion.div
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="w-16 h-16 md:w-20 md:h-20 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300"
                                >
                                  <svg className="w-6 h-6 md:w-8 md:h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                </motion.div>
                              </div>
                              {/* YouTube Logo */}
                              <div className="absolute top-4 right-4 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
                                YouTube
                              </div>
                            </div>
                          );
                        } else {
                          return (
                            <div className="flex flex-col items-center justify-center text-white/80">
                              <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full mb-4 animate-spin" />
                              <p className="text-lg font-semibold mb-2">Invalid Video URL</p>
                              <p className="text-sm text-center">Please check the video link format.</p>
                            </div>
                          );
                        }
                      })() : (
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
                    <span className="font-semibold text-green-600">{loan.interestRate || 'Contact for details'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Loan Amount</span>
                    <span className="font-semibold text-blue-600">₹{loan.minAmount?.toLocaleString()} - ₹{loan.maxAmount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Processing Time</span>
                    <span className="font-semibold text-purple-600">{loan.processingTime || 'Quick approval process'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Repayment</span>
                    <span className="font-semibold text-orange-600">{loan.tenure || 'Flexible terms available'}</span>
                  </div>
                </div>
              </div>

              {/* Eligibility Card */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Eligibility</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  {loan.eligibility && loan.eligibility.length > 0 ? (
                    loan.eligibility.map((criteria, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        {criteria}
                      </li>
                    ))
                  ) : (
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      Contact for eligibility details
                    </li>
                  )}
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

          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mb-6"
          >
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/30 w-full"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">About {loan.name}</h3>
              <p className="text-gray-700 leading-relaxed mb-6 text-sm">
                {loan.description || `The ${loan.name} is a comprehensive government-backed financial assistance program designed to support entrepreneurs, startups, and established businesses across India. This flagship scheme provides access to affordable credit facilities with competitive interest rates, flexible repayment terms, and minimal documentation requirements.`}
              </p>

              {/* Key Features */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm flex items-center gap-1">
                    <span className="text-lg">💰</span>
                    Loan Amount
                  </h4>
                  <p className="text-xs text-gray-700 font-medium">₹{loan.minAmount?.toLocaleString()} - ₹{loan.maxAmount?.toLocaleString()}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm flex items-center gap-1">
                    <span className="text-lg">📈</span>
                    Interest Rate
                  </h4>
                  <p className="text-xs text-gray-700 font-medium">{loan.interestRate || 'Contact for details'}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm flex items-center gap-1">
                    <span className="text-lg">⏰</span>
                    Repayment
                  </h4>
                  <p className="text-xs text-gray-700 font-medium">{loan.tenure || 'Flexible terms available'}</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-100 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm flex items-center gap-1">
                    <span className="text-lg">📋</span>
                    Processing
                  </h4>
                  <p className="text-xs text-gray-700 font-medium">{loan.processingTime || 'Quick approval process'}</p>
                </div>
              </div>

              {/* Know More Button */}
              <div className="flex justify-center mb-4">
              <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowMoreInfo(!showMoreInfo)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 shadow-lg w-full sm:w-auto"
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
              </div>

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
                  className="pt-4 space-y-4 border-t border-gray-200 mt-4"
              >
                {/* Benefits Section */}
                {loan.benefits && loan.benefits.length > 0 && (
                  <motion.div
                    whileHover={{ x: 5 }}
                      className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-l-4 border-green-500"
                  >
                    <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Benefits
                    </h4>
                    <ul className="space-y-2">
                      {loan.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700 text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {/* Eligibility Section */}
                {loan.eligibility && loan.eligibility.length > 0 && (
                  <motion.div
                    whileHover={{ x: 5 }}
                      className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border-l-4 border-blue-500"
                  >
                    <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Eligibility Criteria
                    </h4>
                    <ul className="space-y-2">
                      {loan.eligibility.map((criteria, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700 text-sm">{criteria}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {/* Required Documents Section */}
                {loan.documents && loan.documents.length > 0 && (
                  <motion.div
                    whileHover={{ x: 5 }}
                      className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border-l-4 border-purple-500"
                  >
                    <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <svg className="w-5 h-5 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Required Documents
                    </h4>
                    <ul className="space-y-2">
                      {loan.documents.map((document, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="w-4 h-4 text-blue-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-gray-700 text-sm">{document}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Quick Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6"
          >
                <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-xl border border-blue-100 w-full"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Quick Info
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600 text-sm font-medium">Interest Rate</span>
                  <span className="font-semibold text-green-600 text-sm">{loan.interestRate || 'Contact for details'}</span>
                        </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600 text-sm font-medium">Loan Amount</span>
                  <span className="font-semibold text-blue-600 text-sm">₹{loan.minAmount?.toLocaleString()} - ₹{loan.maxAmount?.toLocaleString()}</span>
                      </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600 text-sm font-medium">Processing Time</span>
                  <span className="font-semibold text-purple-600 text-sm">{loan.processingTime || 'Quick approval process'}</span>
                    </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 text-sm font-medium">Repayment</span>
                  <span className="font-semibold text-orange-600 text-sm">{loan.tenure || 'Flexible terms available'}</span>
                  </div>
              </div>
            </motion.div>
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
                  {loan.videoUrl ? (() => {
                    const videoId = getYouTubeVideoId(loan.videoUrl);
                    if (videoId) {
                      return (
                        <div
                          className="relative w-full h-full cursor-pointer group"
                          onClick={() => window.open(loan.videoUrl, '_blank')}
                        >
                          <img
                            src={getYouTubeThumbnail(videoId)}
                            alt={`${loan.name} Video Thumbnail`}
                            className="w-full h-full object-cover rounded-2xl"
                          />
                          {/* Play Button Overlay */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-all duration-300">
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300"
                            >
                              <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </motion.div>
                          </div>
                          {/* YouTube Logo */}
                          <div className="absolute top-4 right-4 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
                            YouTube
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div className="flex flex-col items-center justify-center text-white/80">
                          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full mb-4 animate-spin" />
                          <p className="text-lg font-semibold mb-2">Invalid Video URL</p>
                          <p className="text-sm text-center">Please check the video link format.</p>
                        </div>
                      );
                    }
                  })() : (
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
    </div>
  );
};

export default LoanDetailPage;

