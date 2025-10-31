import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { allModules, modules as detailedModules } from '../../data/entrepreneurshipTraining';

const ModuleDetailPage = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [completedTopics, setCompletedTopics] = useState(() => {
    const saved = localStorage.getItem('completedTopics');
    return saved ? JSON.parse(saved) : [];
  });

  const module = allModules.find(m => m.id === parseInt(moduleId));
  const detailedModule = detailedModules.find(m => m.id === parseInt(moduleId));

  if (!module || !detailedModule) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Module not found</h1>
          <Link to="/training" className="text-blue-600 hover:text-blue-800">
            Back to Training
          </Link>
        </div>
      </div>
    );
  }

  const isTopicCompleted = (topicId) => completedTopics.includes(`${moduleId}-${topicId}`);

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
            onClick={() => navigate('/training/modules/entrepreneurship-mastery')}
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

      {/* Module Title */}
      <div className="bg-gray-100 py-6 md:py-8">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{module.title}</h1>
          <p className="text-gray-600">{detailedModule.objective}</p>
        </div>
      </div>

      {/* Topics List - Simple Design */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="divide-y divide-gray-200">
            {detailedModule.topics.map((topic, index) => {
              const isCompleted = isTopicCompleted(topic.id);
              return (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => navigate(`/training/module/${moduleId}/topic/${topic.id}`)}
                  className="flex items-center justify-between p-4 md:p-6 hover:bg-gray-50 cursor-pointer transition-colors group"
                >
                  {/* Left: Topic Number and Title */}
                  <div className="flex items-center gap-4 flex-1">
                    {/* Topic Number Badge */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      isCompleted 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-700 group-hover:bg-gray-300'
                    }`}>
                      {isCompleted ? '✓' : index + 1}
                    </div>
                    
                    {/* Topic Title */}
                    <div className="flex-1">
                      <h3 className="text-base md:text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {topic.title}
                      </h3>
                      {isCompleted && (
                        <p className="text-xs text-green-600 font-medium mt-1">Completed</p>
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

        {/* Module Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Module Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold text-gray-700">Objective: </span>
              <span className="text-gray-600">{detailedModule.objective}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Topics: </span>
              <span className="text-gray-600">{detailedModule.topics.length}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Outcome: </span>
              <span className="text-gray-600">{detailedModule.outcome}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Evaluation: </span>
              <span className="text-gray-600">{detailedModule.evaluationMethod}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleDetailPage;
