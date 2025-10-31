import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const RotatingBackgroundHero = () => {
  const backgroundImages = [
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
    'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80'
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative overflow-hidden text-white py-8 md:py-12"
    >
      {/* Rotating Background Images */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImages[currentImageIndex]})` }}
          />
        </AnimatePresence>
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 via-purple-900/40 to-pink-900/50" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
          className="text-2xl md:text-6xl font-bold mb-2 md:mb-4"
        >
          Training Programs
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="text-sm md:text-2xl text-white/90 max-w-3xl mx-auto mb-4 md:mb-8"
        >
          Build your entrepreneurial skills with comprehensive training programs
        </motion.p>
      </div>
    </motion.section>
  );
};

const TrainingPage = () => {
  const navigate = useNavigate();

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
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex-1" />

          <div className="w-10" />
        </div>
      </motion.header>

      {/* Desktop Header - Removed to avoid duplication with main Navbar */}

      {/* Hero Section */}
      <RotatingBackgroundHero />

      {/* Courses Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-16">
        <div className="text-center mb-6 md:mb-12">
          <h2 className="text-xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-4">
            Available Courses
          </h2>
          <p className="text-gray-600 text-sm md:text-lg">
            Choose from our professional training programs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {/* Course Card */}
          <Link to="/training/modules/entrepreneurship-mastery">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-xl md:rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden hover:shadow-2xl transition-all cursor-pointer group"
            >
              {/* Course Image */}
              <div className="relative h-32 md:h-48 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="text-4xl md:text-8xl opacity-20"
                  >
                    📚
                  </motion.div>
                </div>
                <div className="absolute top-2 right-2 md:top-4 md:right-4">
                  <span className="px-2 md:px-3 py-0.5 md:py-1 bg-white/90 text-gray-900 text-[10px] md:text-xs font-bold rounded-full">
                    NEW
                  </span>
                </div>
              </div>

              {/* Course Content */}
              <div className="p-3 md:p-6">
                <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">
                  Complete Entrepreneurship Mastery Program
                </h3>
                <p className="text-gray-600 text-xs md:text-base mb-3 md:mb-4 line-clamp-2">
                  Master entrepreneurship with 9 comprehensive modules covering everything from startup fundamentals to investor readiness
                </p>
                
                {/* Course Stats */}
                <div className="flex flex-wrap gap-2 md:gap-3 mb-3 md:mb-4">
                  <span className="px-2 md:px-3 py-0.5 md:py-1 bg-indigo-50 text-indigo-700 text-xs md:text-sm font-semibold rounded-full">
                    📚 9 Modules
                  </span>
                  <span className="px-2 md:px-3 py-0.5 md:py-1 bg-purple-50 text-purple-700 text-xs md:text-sm font-semibold rounded-full">
                    ⏱ 45 Hours
                  </span>
                  <span className="px-2 md:px-3 py-0.5 md:py-1 bg-pink-50 text-pink-700 text-xs md:text-sm font-semibold rounded-full">
                    🎓 Certificate
                  </span>
                </div>

                {/* Provider */}
                <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-3 md:mb-4">
                  <span>By Innobharat (MSME Registered)</span>
                </div>

                {/* Button */}
                <div className="pt-3 md:pt-4 border-t border-gray-200">
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 md:py-3 rounded-lg md:rounded-xl text-sm md:text-base font-semibold text-center group-hover:from-indigo-700 group-hover:to-purple-700 transition-all">
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
            className="bg-white rounded-xl md:rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden relative"
          >
            <div className="relative h-32 md:h-48 bg-gradient-to-br from-gray-400 to-gray-600 overflow-hidden">
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-4xl md:text-8xl opacity-20">
                  🔒
                </div>
              </div>
              <div className="absolute top-2 right-2 md:top-4 md:right-4">
                <span className="px-2 md:px-3 py-0.5 md:py-1 bg-gray-900/50 text-white text-[10px] md:text-xs font-bold rounded-full">
                  COMING SOON
                </span>
              </div>
            </div>
            <div className="p-3 md:p-6">
              <h3 className="text-lg md:text-2xl font-bold text-gray-400 mb-2 md:mb-3">
                More Courses
              </h3>
              <p className="text-gray-500 text-xs md:text-base mb-3 md:mb-4">
                Additional training programs will be available soon
              </p>
              <div className="pt-3 md:pt-4 border-t border-gray-200">
                <div className="bg-gray-300 text-gray-600 py-2 md:py-3 rounded-lg md:rounded-xl text-sm md:text-base font-semibold text-center">
                  Coming Soon
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Certificate Banner */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-xl md:rounded-2xl shadow-xl"
        >
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700"></div>
          
          {/* Animated Background Elements */}
          <div className="absolute inset-0 opacity-15 overflow-hidden">
            <motion.div
              animate={{ 
                x: [0, 50, 0],
                y: [0, 50, 0],
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute -top-10 -left-10 w-40 h-40 bg-white rounded-full blur-2xl"
            ></motion.div>
            <motion.div
              animate={{ 
                x: [0, -50, 0],
                y: [0, -50, 0],
              }}
              transition={{ 
                duration: 10,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute -bottom-10 -right-10 w-40 h-40 bg-white rounded-full blur-2xl"
            ></motion.div>
          </div>

          {/* Content */}
          <div className="relative z-10 p-5 md:p-8">
            <div className="flex items-center gap-4 md:gap-6">
              {/* Icon */}
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-white/25 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
                  <span className="text-3xl md:text-4xl">🎓</span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 text-white">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="inline-block px-2 py-0.5 bg-white/25 backdrop-blur-sm rounded-md text-[10px] md:text-xs font-bold border border-white/30">
                    CERTIFICATE
                  </span>
                  <span className="text-[10px] md:text-xs text-orange-100">70% Completion Required</span>
                </div>
                <h3 className="text-base md:text-xl font-bold mb-1.5 leading-tight">
                  Get Your Verified Certificate
                </h3>
                <p className="text-xs md:text-sm text-orange-50 mb-0 leading-relaxed">
                  Unlock your certificate after completing 70% of the course
                </p>
              </div>

              {/* Right Side - Features */}
              <div className="hidden md:flex items-center gap-2 flex-shrink-0">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/30">
                  <span className="text-lg">✅</span>
                  <span className="text-xs font-semibold">Verified</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/30">
                  <span className="text-lg">📥</span>
                  <span className="text-xs font-semibold">PDF</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
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
