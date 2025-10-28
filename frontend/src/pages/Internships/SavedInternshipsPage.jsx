import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { internships } from '../../data/internships';
import BottomNavbar from '../../components/common/BottomNavbar';

// Bottom Nav Icons
const HomeIcon = ({ active }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> );
const SearchIcon = ({ active }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> );
const HeartIcon = ({ active }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> );
const ClipboardIcon = ({ active }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg> );
const UserIcon = ({ active }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> );

const SavedInternshipsPage = () => {
  const navigate = useNavigate();
  const [savedInternships, setSavedInternships] = useState(internships.slice(0, 6)); // Mock saved internships
  const [savedIds, setSavedIds] = useState(new Set(internships.slice(0, 6).map(i => i.id)));

  const toggleSave = (internshipId) => {
    setSavedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(internshipId)) {
        newSet.delete(internshipId);
      } else {
        newSet.add(internshipId);
      }
      return newSet;
    });
    
    // Update saved internships list
    setSavedInternships(prev => {
      if (savedIds.has(internshipId)) {
        return prev.filter(i => i.id !== internshipId);
      } else {
        const internship = internships.find(i => i.id === internshipId);
        return internship ? [...prev, internship] : prev;
      }
    });
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-indigo-100">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between px-4 py-4 bg-white/90 backdrop-blur-lg border-b border-gradient-to-r from-orange-200 to-purple-200 shadow-lg"
      >
        <motion.div 
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="flex items-center gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.1, x: -2, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full bg-gradient-to-r from-orange-100 to-purple-100 hover:from-orange-200 hover:to-purple-200 transition-all duration-300"
            onClick={() => navigate('/internships')}
          >
            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-2xl font-bold bg-gradient-to-r from-orange-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
          >
            Saved Internships
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
          {/* Summary Card */}
          <motion.div
            variants={fadeInUp}
            className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/40 mb-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Your Saved Internships</h2>
                <p className="text-gray-600">{savedInternships.length} internships saved</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-orange-500">{savedInternships.length}</div>
                <div className="text-sm text-gray-500">Saved</div>
              </div>
            </div>
          </motion.div>

          {/* Internships Grid */}
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {savedInternships.map((internship) => (
              <motion.div
                key={internship.id}
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
                className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/40 hover:shadow-2xl transition-all duration-300"
              >
                {/* Heart Icon - Inside the card with animation */}
                <div className="flex items-start justify-between mb-4 relative">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{internship.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{internship.company}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                        {internship.type}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {internship.duration}
                      </span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.3, rotate: 10 }}
                    whileTap={{ scale: 0.8 }}
                    onClick={() => toggleSave(internship.id)}
                    className="relative p-2 rounded-full transition-colors z-10"
                  >
                    {savedIds.has(internship.id) ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center"
                      >
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                      </motion.div>
                    ) : (
                      <div className="w-8 h-8 border-2 border-gray-300 rounded-full flex items-center justify-center hover:border-red-500 transition-colors">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                    )}
                  </motion.button>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm text-gray-600">{internship.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <span className="text-sm text-gray-600">{internship.stipend}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors"
                    onClick={() => navigate(`/internships/${internship.id}`)}
                  >
                    View Details
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/internships/${internship.id}/apply`)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Apply Now
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Empty State */}
          {savedInternships.length === 0 && (
            <motion.div
              variants={fadeInUp}
              className="text-center py-12"
            >
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No saved internships</h3>
              <p className="text-gray-500 mb-4">Start exploring internships and save your favorites!</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/internships')}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Browse Internships
              </motion.button>
            </motion.div>
          )}
        </motion.div>
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

export default SavedInternshipsPage;
