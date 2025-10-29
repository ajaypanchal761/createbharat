import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../../assets/logo.png';

const TrainingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Mobile Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="md:hidden sticky top-0 z-50 bg-gradient-to-r from-orange-400 to-orange-500 shadow-lg"
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center">
              <motion.img 
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
                src={logo} 
                alt="CreateBharat Logo" 
                className="h-12 w-auto object-contain" 
              />
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Desktop Header - Removed to avoid duplication with main Navbar */}

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white py-16 md:py-24"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ 
              x: [0, 100, 0],
              y: [0, 100, 0],
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              x: [0, -100, 0],
              y: [0, -100, 0],
            }}
            transition={{ 
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mb-4"
          >
            Training Programs
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8"
          >
            Build your entrepreneurial skills with comprehensive training programs
          </motion.p>
        </div>
      </motion.section>

      {/* Courses Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Available Courses
          </h2>
          <p className="text-gray-600 text-lg">
            Choose from our professional training programs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Course Card */}
          <Link to="/training/modules/entrepreneurship-mastery">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden hover:shadow-2xl transition-all cursor-pointer group"
            >
              {/* Course Image */}
              <div className="relative h-48 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="text-8xl opacity-20"
                  >
                    📚
                  </motion.div>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-white/90 text-gray-900 text-xs font-bold rounded-full">
                    NEW
                  </span>
                </div>
              </div>

              {/* Course Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Complete Entrepreneurship Mastery Program
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  Master entrepreneurship with 9 comprehensive modules covering everything from startup fundamentals to investor readiness
                </p>
                
                {/* Course Stats */}
                <div className="flex flex-wrap gap-3 mb-4">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm font-semibold rounded-full">
                    📚 9 Modules
                  </span>
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 text-sm font-semibold rounded-full">
                    ⏱ 45 Hours
                  </span>
                  <span className="px-3 py-1 bg-pink-50 text-pink-700 text-sm font-semibold rounded-full">
                    🎓 Certificate
                  </span>
                </div>

                {/* Provider */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <span>By Innobharat (MSME Registered)</span>
                </div>

                {/* Button */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold text-center group-hover:from-indigo-700 group-hover:to-purple-700 transition-all">
                    Start Learning →
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Coming Soon Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden relative"
          >
            <div className="relative h-48 bg-gradient-to-br from-gray-400 to-gray-600 overflow-hidden">
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-8xl opacity-20">
                  🔒
                </div>
              </div>
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-gray-900/50 text-white text-xs font-bold rounded-full">
                  COMING SOON
                </span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-400 mb-3">
                More Courses
              </h3>
              <p className="text-gray-500 mb-4">
                Additional training programs will be available soon
              </p>
              <div className="pt-4 border-t border-gray-200">
                <div className="bg-gray-300 text-gray-600 py-3 rounded-xl font-semibold text-center">
                  Coming Soon
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            © 2024 CreateBharat. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrainingPage;
