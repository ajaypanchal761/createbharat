import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { entrepreneurshipCourse, allModules, modules as detailedModules } from '../../data/entrepreneurshipTraining';

const ModulesListPage = () => {
  const navigate = useNavigate();
  const [completedTopics, setCompletedTopics] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('completedTopics');
    if (saved) {
      setCompletedTopics(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    // Calculate total topics
    let totalTopics = 0;
    let completedCount = 0;

    detailedModules.forEach(module => {
      module.topics.forEach(topic => {
        totalTopics++;
        if (completedTopics.includes(`${module.id}-${topic.id}`)) {
          completedCount++;
        }
      });
    });

    const progressPercent = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;
    setProgress(progressPercent);
  }, [completedTopics]);

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
          <button
            onClick={() => navigate('/training')}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="CreateBharat Logo" className="h-12 w-auto object-contain" />
          </Link>

          <div className="w-10" />
        </div>
      </motion.header>

      {/* Desktop Header - Removed to avoid duplication with main Navbar */}

      {/* Course Title */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-8 md:py-12">
        <div className="max-w-5xl mx-auto px-4 md:px-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{entrepreneurshipCourse.title}</h1>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm md:text-base mt-4">
            <span>{entrepreneurshipCourse.totalModules} Modules</span>
            <span>•</span>
            <span>{entrepreneurshipCourse.minimumDuration}</span>
            <span>•</span>
            <span>⭐ {entrepreneurshipCourse.rating}/5.0</span>
          </div>
          <p className="mt-3 text-white/90 text-sm">By {entrepreneurshipCourse.provider}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">Your Progress</h3>
            <span className="text-sm font-medium text-gray-600">{progress}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-full"
            />
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Complete all modules and pass the quizzes to receive your certificate
          </p>
        </div>
      </div>

      {/* Modules List - Simple Design */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="divide-y divide-gray-200">
            {allModules.map((module, index) => {
              // Check if module is completed
              const detailedModule = detailedModules.find(m => m.id === module.id);
              const allTopicsCompleted = detailedModule?.topics.every(topic =>
                completedTopics.includes(`${module.id}-${topic.id}`)
              );

              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => navigate(`/training/module/${module.id}`)}
                  className="flex items-center justify-between p-4 md:p-6 hover:bg-gray-50 cursor-pointer transition-colors group"
                >
                  {/* Left: Module Number and Title */}
                  <div className="flex items-center gap-4 flex-1">
                    {/* Module Icon/Number or Completed Check */}
                    <div className={`text-3xl ${allTopicsCompleted ? 'text-green-600' : ''}`}>
                      {allTopicsCompleted ? '✓' : module.icon}
                    </div>

                    {/* Module Title */}
                    <div className="flex-1">
                      <h3 className="text-base md:text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {module.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{module.subtitle}</p>
                      {allTopicsCompleted && (
                        <span className="inline-block mt-1 text-xs text-green-600 font-medium">
                          ✓ Completed
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Arrow Icon */}
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Course Requirements */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Course Requirements</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <p className="text-gray-700"><strong>Minimum passing score:</strong> 70% in each module</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <p className="text-gray-700"><strong>Certificate:</strong> Automatically generated after all 9 modules</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <p className="text-gray-700"><strong>Eligibility:</strong> {entrepreneurshipCourse.eligibility}</p>
            </div>
          </div>
        </div>

        {/* Certificate Section */}
        {progress === 100 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-lg p-6 text-white"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl">
                🎓
              </div>
              <div>
                <h3 className="text-xl font-bold">Congratulations!</h3>
                <p className="text-green-100">You've completed all modules</p>
              </div>
            </div>
            <p className="text-green-50 mb-4">
              You are now eligible to receive your certificate. Complete the payment to download your verified certificate.
            </p>
            <button
              onClick={() => navigate('/training/certificate')}
              className="bg-white text-green-600 font-bold py-3 px-8 rounded-xl hover:bg-green-50 transition-colors"
            >
              Get Your Certificate
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ModulesListPage;
