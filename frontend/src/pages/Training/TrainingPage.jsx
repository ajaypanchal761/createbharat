import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { trainingCourse, modules } from '../../data/trainings';
import logo from '../../assets/logo.png';

// Icon Components
const MenuIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg> );
const MessageIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg> );
const CheckIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg> );
const LockIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg> );
const StarIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg> );
const ArrowRightIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg> );
const HomeIcon = ({ active }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-indigo-600' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> );
const BriefcaseIcon = ({ active }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-indigo-600' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> );

const TrainingPage = () => {
  const navigate = useNavigate();
  
  const [completedTopics, setCompletedTopics] = useState(() => {
    const saved = localStorage.getItem('completedTopics');
    return saved ? JSON.parse(saved) : [];
  });


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
      transition: { staggerChildren: 0.1 }
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

  // Calculate progress
  const totalTopics = modules.reduce((acc, module) => acc + module.topics.length, 0);
  const progress = (completedTopics.length / totalTopics) * 100;

  const isTopicCompleted = (topicId) => completedTopics.includes(topicId);


  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Top Header */}
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
            onClick={() => {
              // Handle menu icon click
              alert('Menu feature coming soon!');
            }}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            title="Menu"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>
          
          <Link to="/" className="flex items-center">
            <motion.img 
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
              src={logo} 
              alt="CreateBharat Logo" 
              className="h-12 w-auto object-contain" 
            />
          </Link>
          
          <div className="flex items-center space-x-2">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                // Handle message icon click
                alert('Messages feature coming soon!');
              }}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors relative"
              title="Messages"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <motion.span 
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"
              />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white py-12 px-4"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold mb-2"
          >
            {trainingCourse.title}
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <div className="flex">
              {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
            </div>
            <span className="text-white/90 text-sm">{trainingCourse.rating} ({trainingCourse.students}+ students)</span>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
            className="text-white/90 text-lg mb-6 max-w-2xl mx-auto"
          >
            {trainingCourse.description}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3 mb-6"
          >
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
              className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold"
            >
              📚 {modules.length} Modules
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.6 }}
              className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold"
            >
              ⏱ {totalTopics} Topics
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.7 }}
              className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold"
            >
              🎯 100% Free Content
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.8 }}
              className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold"
            >
              🏆 Paid Certificate
            </motion.span>
          </motion.div>
        </div>
      </motion.section>

      {/* Progress Bar */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="sticky top-16 z-40 bg-white shadow-md py-4 px-4"
      >
        <div className="max-w-4xl mx-auto">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Your Progress: {progress.toFixed(0)}% ({completedTopics.length}/{totalTopics} topics)
          </h3>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 h-full rounded-full"
            />
          </div>
        </div>
      </motion.div>

      {/* Modules Grid */}
      <div className="px-4 py-8">
        <motion.h2 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-2xl font-bold text-gray-900 mb-6 text-center"
        >
          Course Modules
        </motion.h2>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {modules.map((module, idx) => {
            const moduleTopicsCompleted = module.topics.filter(t => isTopicCompleted(t.id)).length;
            const moduleProgress = (moduleTopicsCompleted / module.topics.length) * 100;
            
            return (
              <Link 
                key={module.id} 
                to={`/training/module/${module.id}`}
              >
                <motion.div
                  variants={fadeInUp}
                  whileHover={{ scale: 1.03, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className={`bg-gradient-to-br ${module.color} rounded-2xl p-6 md:p-4 shadow-lg border-2 border-white/20 hover:shadow-2xl transition-all cursor-pointer h-full`}
                >
                  {/* Module Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-white/90 text-gray-900 text-xs font-bold rounded-full">
                        Module {module.id}
                      </span>
                      {moduleProgress === 100 && (
                        <motion.span 
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full flex items-center gap-1"
                        >
                          <CheckIcon /> Done
                        </motion.span>
                      )}
                    </div>
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="text-white"
                    >
                      <ArrowRightIcon />
                    </motion.div>
                  </div>

                  {/* Module Content */}
                  <h3 className="text-xl font-bold text-white mb-2">{module.title}</h3>
                  <p className="text-white/80 text-sm mb-4 line-clamp-2">{module.description}</p>

                  {/* Module Stats */}
                  <div className="flex items-center gap-4 text-white/90 text-xs mb-4">
                    <span>⏱ {module.duration}</span>
                    <span>📚 {module.topics.length} Topics</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-white/90">
                      <span>Progress</span>
                      <span className="font-semibold">{Math.round(moduleProgress)}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${moduleProgress}%` }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: idx * 0.1 }}
                        className="h-full bg-white rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </motion.div>
      </div>

      {/* Certificate Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="px-4 py-8"
      >
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border-2 border-amber-200 shadow-xl">
          <div className="text-center">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="text-6xl mb-4"
            >
              🏆
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Get Certified!</h2>
            <p className="text-gray-600 mb-6">Complete all modules and unlock your certificate for ₹{trainingCourse.certificatePrice}</p>
            
            {progress === 100 ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Get Your Certificate Now
              </motion.button>
            ) : (
              <div className="flex items-center justify-center gap-2 text-gray-500">
                <LockIcon />
                <span className="font-semibold">Complete all modules to unlock</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <Link to="/" className="flex flex-col items-center gap-1 p-2">
            <HomeIcon active={false} />
            <span className="text-xs text-gray-500">Home</span>
          </Link>
          <Link to="/internships" className="flex flex-col items-center gap-1 p-2">
            <BriefcaseIcon active={false} />
            <span className="text-xs text-gray-500">Internships</span>
          </Link>
          <Link to="/training" className="flex flex-col items-center gap-1 p-2">
            <div className="flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>
              <span className="text-xs text-indigo-600 font-semibold">Training</span>
            </div>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default TrainingPage;
