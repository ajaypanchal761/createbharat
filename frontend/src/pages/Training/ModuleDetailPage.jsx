import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { modules } from '../../data/trainings';
import logo from '../../assets/logo.png';

// Icon Components
const BackIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg> );
const MenuIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg> );
const MessageIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg> );
const CheckIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg> );
const PlayIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg> );
const LockIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg> );

const ModuleDetailPage = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [completedTopics, setCompletedTopics] = useState(() => {
    const saved = localStorage.getItem('completedTopics');
    return saved ? JSON.parse(saved) : [];
  });

  const module = modules.find(m => m.id === parseInt(moduleId));

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

  const slideIn = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  useEffect(() => {
    localStorage.setItem('completedTopics', JSON.stringify(completedTopics));
  }, [completedTopics]);

  if (!module) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Module not found</h2>
          <Link to="/training" className="text-blue-600 hover:text-blue-800">
            Back to Training
          </Link>
        </div>
      </div>
    );
  }

  const handleTopicClick = (topic) => {
    navigate(`/training/module/${moduleId}/topic/${topic.id}`);
  };

  const isTopicCompleted = (topicId) => completedTopics.includes(topicId);

  const moduleProgress = (module.topics.filter(t => isTopicCompleted(t.id)).length / module.topics.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="md:hidden bg-white px-4 py-3 flex justify-between items-center border-b border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Link to="/training" className="text-gray-600 hover:text-gray-800">
            <BackIcon />
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{module.title}</h1>
            <p className="text-sm text-gray-600">{module.topics.length} topics</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-gray-600 hover:text-gray-800">
            <MessageIcon />
          </button>
          <button className="text-gray-600 hover:text-gray-800">
            <MenuIcon />
          </button>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="px-4 py-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-6xl mx-auto"
        >
          {/* Module Overview */}
          <motion.div variants={fadeInUp} className="mb-8">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{module.title}</h2>
                  <p className="text-gray-600 mb-4">{module.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>📚 {module.topics.length} Topics</span>
                    <span>⏱ {module.duration}</span>
                    <span>👥 {module.students} Students</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{Math.round(moduleProgress)}%</div>
                  <div className="text-sm text-gray-500">Complete</div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${moduleProgress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="bg-blue-600 h-2 rounded-full"
                />
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Topics List */}
            <motion.div
              variants={fadeInUp}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-xl p-4 shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Topics</h3>
                <div className="space-y-2">
                  {module.topics.map((topic, idx) => (
                    <motion.button
                      key={topic.id}
                      variants={slideIn}
                      onClick={() => handleTopicClick(topic)}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full text-left p-3 rounded-lg transition-all bg-gray-50 hover:bg-gray-100 border-2 border-transparent hover:border-gray-300"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-gray-500">Topic {idx + 1}</span>
                            {isTopicCompleted(topic.id) && (
                              <span className="flex items-center gap-1 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                                <CheckIcon />
                              </span>
                            )}
                          </div>
                          <h3 className="font-semibold text-sm text-gray-900">{topic.title}</h3>
                          <p className="text-xs text-gray-600 mt-1">{topic.description}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                            <span>⏱ {topic.duration}</span>
                            <span>❓ {topic.questions?.length || 0} Questions</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isTopicCompleted(topic.id) ? (
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <CheckIcon />
                            </div>
                          ) : (
                            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                              <PlayIcon />
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Content Area */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="lg:col-span-2 space-y-6"
            >
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎯</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Select a Topic to Start Learning</h2>
                <p className="text-gray-600 mb-6">Choose any topic from the list to watch videos and take quizzes</p>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <span>📹</span>
                  <span>Watch videos</span>
                  <span>•</span>
                  <span>📝</span>
                  <span>Take quizzes</span>
                  <span>•</span>
                  <span>✅</span>
                  <span>Track progress</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ModuleDetailPage;