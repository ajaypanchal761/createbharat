import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { trainingAPI } from '../../utils/api';
import { FaSpinner } from 'react-icons/fa';

const ModulesListPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourseDetails();
    fetchUserProgress();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await trainingAPI.getCourseById(courseId);
      if (response.success) {
        setCourse(response.data.course);
        setModules(response.data.modules || []);
      }
    } catch (err) {
      console.error('Error fetching course:', err);
      setError(err.message || 'Failed to fetch course');
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
      // Not critical, continue without progress
    }
  };

  const handleEnroll = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await trainingAPI.enroll(token, courseId);
      if (response.success) {
        alert('Successfully enrolled in course!');
        await fetchUserProgress();
      }
    } catch (err) {
      console.error('Error enrolling:', err);
      alert(err.message || 'Failed to enroll in course');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-orange-600" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course not found</h1>
          <p className="text-gray-600 mb-4">{error || 'Course not available'}</p>
          <Link to="/training" className="text-blue-600 hover:text-blue-800">
            Back to Training
          </Link>
        </div>
      </div>
    );
  }

  const progressPercent = progress?.overallProgress || 0;
  const completedTopicIds = progress?.completedTopics?.map(id => id.toString()) || [];

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
          <div className="flex-1" />
          <div className="w-10" />
        </div>
      </motion.header>

      {/* Desktop Back Button */}
      <div className="hidden md:block max-w-5xl mx-auto px-4 md:px-8 pt-6">
        <button
          onClick={() => navigate('/training')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Training</span>
        </button>
      </div>

      {/* Course Title */}
      <div className={`bg-gradient-to-r ${course.color || 'from-indigo-600 via-purple-600 to-pink-600'} text-white py-8 md:py-12`}>
        <div className="max-w-5xl mx-auto px-4 md:px-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{course.title}</h1>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm md:text-base mt-4">
            <span>{course.totalModules} Modules</span>
            <span>•</span>
            <span>{course.minimumDuration}</span>
            <span>•</span>
            <span>⭐ {course.rating}/5.0</span>
          </div>
          <p className="mt-3 text-white/90 text-sm">By {course.provider}</p>
          {!progress && (
            <button
              onClick={handleEnroll}
              className="mt-4 px-6 py-2 bg-white text-orange-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Enroll Now
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {progress && (
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Your Progress</h3>
              <span className="text-sm font-medium text-gray-600">{progressPercent}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`h-3 bg-gradient-to-r ${course.color || 'from-indigo-600 via-purple-600 to-pink-600'} rounded-full`}
              />
            </div>
            <p className="text-sm text-gray-600 mt-3">
              Complete all modules and pass the quizzes to receive your certificate
            </p>
          </div>
        </div>
      )}

      {/* Modules List */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="divide-y divide-gray-200">
            {modules.map((module, index) => {
              const moduleTopics = module.topics || [];
              const allTopicsCompleted = moduleTopics.length > 0 && 
                moduleTopics.every(topic => completedTopicIds.includes(topic._id.toString()));

              return (
                <motion.div
                  key={module._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => navigate(`/training/module/${courseId}/${module._id}`)}
                  className="flex items-center justify-between p-4 md:p-6 hover:bg-gray-50 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`text-3xl ${allTopicsCompleted ? 'text-green-600' : ''}`}>
                      {allTopicsCompleted ? '✓' : (module.icon || '💼')}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base md:text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        Module {module.number}: {module.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{module.subtitle || module.description}</p>
                      {allTopicsCompleted && (
                        <span className="inline-block mt-1 text-xs text-green-600 font-medium">
                          ✓ Completed
                        </span>
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

        {/* Course Requirements */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Course Requirements</h3>
          <div className="space-y-2 text-sm">
            {course.minPassScore && (
              <div className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <p className="text-gray-700"><strong>Minimum passing score:</strong> {course.minPassScore}% in each module</p>
              </div>
            )}
            {course.certificate && (
              <div className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <p className="text-gray-700"><strong>Certificate:</strong> {course.autoGenerateCert ? 'Automatically generated' : 'Available'} after completion</p>
              </div>
            )}
            {course.eligibility && (
              <div className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <p className="text-gray-700"><strong>Eligibility:</strong> {course.eligibility}</p>
              </div>
            )}
          </div>
        </div>

        {/* Certificate Banner */}
        {progressPercent >= 70 && progressPercent < 100 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 md:mt-6 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-md p-4 md:p-5 text-white"
          >
            <div className="flex items-start md:items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center text-xl md:text-2xl flex-shrink-0">
                🎓
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base md:text-lg font-bold mb-1">Get Your Certificate!</h3>
                <p className="text-xs md:text-sm text-orange-100">
                  Complete 70% of the course to unlock your certificate. You're at {progressPercent}% - just a few more modules to go!
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Certificate Section */}
        {progressPercent >= 100 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 md:mt-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-lg p-4 md:p-6 text-white"
          >
            <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl md:text-3xl">
                🎓
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold">Congratulations!</h3>
                <p className="text-xs md:text-sm text-green-100">You've completed all modules</p>
              </div>
            </div>
            <p className="text-xs md:text-sm text-green-50 mb-3 md:mb-4">
              You are now eligible to receive your certificate.
            </p>
            <button
              onClick={() => navigate(`/training/certificate/${courseId}`)}
              className="w-full md:w-auto bg-white text-green-600 font-bold py-2 md:py-3 px-6 md:px-8 rounded-xl hover:bg-green-50 transition-colors text-sm md:text-base"
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
