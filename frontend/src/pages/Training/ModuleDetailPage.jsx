import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { trainingAPI } from '../../utils/api';
import { FaSpinner } from 'react-icons/fa';

const ModuleDetailPage = () => {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [module, setModule] = useState(null);
  const [topics, setTopics] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchModuleDetails();
    fetchUserProgress();
  }, [courseId, moduleId]);

  const fetchModuleDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await trainingAPI.getCourseById(courseId);
      if (response.success) {
        setCourse(response.data.course);
        const foundModule = response.data.modules?.find(m => m._id === moduleId);
        if (foundModule) {
          setModule(foundModule);
          setTopics(foundModule.topics || []);
        } else {
          setError('Module not found');
        }
      }
    } catch (err) {
      console.error('Error fetching module:', err);
      setError(err.message || 'Failed to fetch module');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProgress = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await trainingAPI.getMyProgress(token);
      if (response.success) {
        const courseProgress = response.data.find(p => p.course._id === courseId || p.course === courseId);
        if (courseProgress) {
          setProgress(courseProgress);
        }
      }
    } catch (err) {
      console.error('Error fetching progress:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-orange-600" />
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Module not found</h1>
          <p className="text-gray-600 mb-4">{error || 'Module not available'}</p>
          <Link to="/training" className="text-blue-600 hover:text-blue-800">
            Back to Training
          </Link>
        </div>
      </div>
    );
  }

  const completedTopicIds = progress?.completedTopics?.map(id => id.toString()) || [];
  const isTopicCompleted = (topicId) => completedTopicIds.includes(topicId.toString());

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
            onClick={() => navigate(`/training/modules/${courseId}`)}
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

      {/* Module Title */}
      <div className="bg-gray-100 py-6 md:py-8">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Module {module.number}: {module.title}
          </h1>
          <p className="text-gray-600">{module.objective || module.description}</p>
        </div>
      </div>

      {/* Topics List */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="divide-y divide-gray-200">
            {topics.map((topic, index) => {
              const isCompleted = isTopicCompleted(topic._id);
              return (
                <motion.div
                  key={topic._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => navigate(`/training/module/${courseId}/${moduleId}/topic/${topic._id}`)}
                  className="flex items-center justify-between p-4 md:p-6 hover:bg-gray-50 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      isCompleted 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-700 group-hover:bg-gray-300'
                    }`}>
                      {isCompleted ? '✓' : index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base md:text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        Topic {topic.number}: {topic.title}
                      </h3>
                      {isCompleted && (
                        <p className="text-xs text-green-600 font-medium mt-1">Completed</p>
                      )}
                    </div>
                  </div>
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
            {module.objective && (
              <div>
                <span className="font-semibold text-gray-700">Objective: </span>
                <span className="text-gray-600">{module.objective}</span>
              </div>
            )}
            <div>
              <span className="font-semibold text-gray-700">Topics: </span>
              <span className="text-gray-600">{topics.length}</span>
            </div>
            {module.outcome && (
              <div>
                <span className="font-semibold text-gray-700">Outcome: </span>
                <span className="text-gray-600">{module.outcome}</span>
              </div>
            )}
            {module.evaluationMethod && (
              <div>
                <span className="font-semibold text-gray-700">Evaluation: </span>
                <span className="text-gray-600">{module.evaluationMethod}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleDetailPage;
