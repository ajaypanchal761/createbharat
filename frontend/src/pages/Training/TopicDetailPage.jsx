import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { trainingAPI } from '../../utils/api';
import { FaSpinner } from 'react-icons/fa';

// Utility function to convert YouTube URL to embed URL
const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  
  // If already an embed URL, return as is
  if (url.includes('youtube.com/embed/')) {
    return url;
  }
  
  // Extract video ID from various YouTube URL formats
  let videoId = null;
  
  // https://www.youtube.com/watch?v=VIDEO_ID
  const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  if (watchMatch) {
    videoId = watchMatch[1];
  }
  
  // https://www.youtube.com/watch?v=VIDEO_ID&t=123s
  if (!videoId) {
    const watchMatch2 = url.match(/[?&]v=([^&\n?#]+)/);
    if (watchMatch2) {
      videoId = watchMatch2[1];
    }
  }
  
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }
  
  // If can't parse, return original URL (might be other video platform)
  return url;
};

// Utility function to get YouTube thumbnail URL
const getYouTubeThumbnail = (url) => {
  if (!url) return null;
  
  let videoId = null;
  const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  if (watchMatch) {
    videoId = watchMatch[1];
  }
  
  if (!videoId) {
    const watchMatch2 = url.match(/[?&]v=([^&\n?#]+)/);
    if (watchMatch2) {
      videoId = watchMatch2[1];
    }
  }
  
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }
  
  return null;
};

// Video Player Component with Thumbnail Support
const VideoPlayer = ({ videoUrl, title }) => {
  const [showVideo, setShowVideo] = useState(false);
  const embedUrl = getYouTubeEmbedUrl(videoUrl);
  const thumbnailUrl = getYouTubeThumbnail(videoUrl);

  if (!videoUrl) return null;

  if (!showVideo && thumbnailUrl) {
    return (
      <div className="relative w-full aspect-video bg-gray-900">
        <div 
          className="relative w-full h-full cursor-pointer group"
          onClick={() => setShowVideo(true)}
        >
          <img
            src={thumbnailUrl}
            alt={title || 'Video thumbnail'}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              const fallback = e.target.nextElementSibling;
              if (fallback) {
                fallback.style.display = 'flex';
              }
            }}
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
              <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          {/* Fallback if thumbnail fails */}
          <div className="hidden absolute inset-0 bg-gray-800 flex items-center justify-center">
            <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:scale-110 transition-transform">
              <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video bg-gray-900">
      <iframe
        src={embedUrl || videoUrl}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title={title || 'Video'}
      />
    </div>
  );
};

const TopicDetailPage = () => {
  const { courseId, moduleId, topicId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [module, setModule] = useState(null);
  const [topic, setTopic] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [progress, setProgress] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);

  useEffect(() => {
    fetchTopicDetails();
    fetchUserProgress();
  }, [courseId, moduleId, topicId]);

  const fetchTopicDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await trainingAPI.getCourseById(courseId);
      if (response.success) {
        setCourse(response.data.course);
        const foundModule = response.data.modules?.find(m => m._id === moduleId);
        if (foundModule) {
          setModule(foundModule);
          const foundTopic = foundModule.topics?.find(t => t._id === topicId);
          if (foundTopic) {
            setTopic(foundTopic);
            setQuizzes(foundTopic.quizzes || []);
          } else {
            setError('Topic not found');
          }
        } else {
          setError('Module not found');
        }
      }
    } catch (err) {
      console.error('Error fetching topic:', err);
      setError(err.message || 'Failed to fetch topic');
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

  const handleQuizAnswer = (quizId, answerIndex) => {
    setQuizAnswers({
      ...quizAnswers,
      [quizId]: answerIndex
    });
  };

  const submitQuiz = async () => {
    if (quizzes.length === 0) return;

    try {
      setSubmittingQuiz(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      let correctCount = 0;
      let totalPoints = 0;
      let earnedPoints = 0;

      // Submit each quiz question
      for (const quiz of quizzes) {
        const userAnswer = quizAnswers[quiz._id];
        if (userAnswer !== undefined) {
          const response = await trainingAPI.submitQuiz(token, quiz._id, {
            selectedAnswer: userAnswer,
            topicId: topicId,
            courseId: courseId
          });

          if (response.success && response.data.isCorrect) {
            correctCount++;
            earnedPoints += response.data.points || 1;
          }
          totalPoints += response.data.points || 1;
        }
      }

      const score = quizzes.length > 0 ? Math.round((correctCount / quizzes.length) * 100) : 0;
      setQuizScore(score);

      // If passed, mark topic as completed
      if (score >= (course?.minPassScore || 70)) {
        try {
          await trainingAPI.completeTopic(token, courseId, topicId);
          await fetchUserProgress();
          setQuizSubmitted(true);
        } catch (err) {
          console.error('Error completing topic:', err);
        }
      } else {
        setQuizSubmitted(true);
      }
    } catch (err) {
      console.error('Error submitting quiz:', err);
      alert('Error submitting quiz: ' + (err.message || 'Failed to submit'));
    } finally {
      setSubmittingQuiz(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-orange-600" />
      </div>
    );
  }

  if (error || !topic || !module) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Topic not found</h1>
          <p className="text-gray-600 mb-4">{error || 'Topic not available'}</p>
          <Link to="/training" className="text-blue-600 hover:text-blue-800">
            Back to Training
          </Link>
        </div>
      </div>
    );
  }

  const completedTopicIds = progress?.completedTopics?.map(id => id.toString()) || [];
  const isCompleted = completedTopicIds.includes(topicId);
  const currentTopicIndex = module.topics?.findIndex(t => t._id === topicId) || -1;
  const nextTopic = currentTopicIndex >= 0 && module.topics ? module.topics[currentTopicIndex + 1] : null;
  const prevTopic = currentTopicIndex > 0 && module.topics ? module.topics[currentTopicIndex - 1] : null;

  return (
    <div className="min-h-screen bg-gray-50 md:bg-gradient-to-br md:from-gray-50 md:via-blue-50 md:to-indigo-50">
      {/* Mobile Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="md:hidden bg-white px-4 py-3 flex justify-between items-center border-b border-gray-200"
      >
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-800"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{module.title}</h1>
            <p className="text-sm text-gray-600">{topic.title}</p>
          </div>
        </div>
      </motion.header>

      {/* Desktop Layout */}
      <div className="hidden md:block max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              className="space-y-6"
            >
              {/* Video Section */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                  {topic.videoUrl && (
                    <VideoPlayer videoUrl={topic.videoUrl} title={topic.title} />
                  )}
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">{topic.title}</h2>
                    <div className="flex items-center gap-6 mb-4 text-sm text-gray-600">
                      <span className="flex items-center gap-2">
                        <span>📊</span> {module.topics?.length || 0} Topics
                      </span>
                      {quizzes.length > 0 && (
                        <span className="flex items-center gap-2">
                          <span>⭐</span> Quiz Included
                        </span>
                      )}
                    </div>
                    {quizzes.length > 0 && (
                      <button
                        onClick={() => setShowQuiz(!showQuiz)}
                        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                      >
                        {showQuiz ? '📚 Hide Quiz' : '📝 Take Quiz'}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Content Section */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
                <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Topic Content</h3>
                  <div className="prose max-w-none">
                    <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                      {topic.content}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Quiz Section */}
              <AnimatePresence>
                {showQuiz && quizzes.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white rounded-xl p-8 shadow-lg border border-gray-200"
                  >
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Quiz: {topic.title}</h3>
                
                    {!quizSubmitted ? (
                      <div className="space-y-6">
                        {quizzes.map((quiz, qIndex) => (
                          <motion.div
                            key={quiz._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: qIndex * 0.1 }}
                            className="border-2 border-gray-200 rounded-xl p-6 bg-gray-50 hover:shadow-md transition-all"
                          >
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">
                              {qIndex + 1}. {quiz.question}
                            </h4>
                            <div className="space-y-3">
                              {quiz.options.map((option, oIndex) => (
                                <label
                                  key={oIndex}
                                  className={`flex items-center p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                                    quizAnswers[quiz._id] === oIndex
                                      ? 'bg-blue-100 border-2 border-blue-500 shadow-md'
                                      : 'bg-white border-2 border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name={`question-${quiz._id}`}
                                    checked={quizAnswers[quiz._id] === oIndex}
                                    onChange={() => handleQuizAnswer(quiz._id, oIndex)}
                                    className="sr-only"
                                  />
                                  <span className="text-gray-700 font-medium">{option}</span>
                                </label>
                              ))}
                            </div>
                          </motion.div>
                        ))}
                        
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={submitQuiz}
                          disabled={submittingQuiz || Object.keys(quizAnswers).length !== quizzes.length}
                          className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold text-lg shadow-lg disabled:opacity-50"
                        >
                          {submittingQuiz ? 'Submitting...' : 'Submit Quiz'}
                        </motion.button>
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-8"
                      >
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                          quizScore >= (course?.minPassScore || 70) ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          <span className={`text-3xl font-bold ${
                            quizScore >= (course?.minPassScore || 70) ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {quizScore}%
                          </span>
                        </div>
                        <h4 className={`text-2xl font-bold mb-2 ${
                          quizScore >= (course?.minPassScore || 70) ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {quizScore >= (course?.minPassScore || 70) ? '🎉 Congratulations!' : '❌ Try Again'}
                        </h4>
                        <p className="text-gray-600 mb-6">
                          {quizScore >= (course?.minPassScore || 70)
                            ? 'You passed the quiz! This topic is now marked as completed.'
                            : `You need at least ${course?.minPassScore || 70}% to pass. You got ${quizScore}%. Review the material and try again.`
                          }
                        </p>
                        <div className="flex gap-3 justify-center">
                          <button
                            onClick={() => {
                              setQuizSubmitted(false);
                              setQuizAnswers({});
                              setQuizScore(0);
                            }}
                            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                          >
                            Retake Quiz
                          </button>
                          {quizScore >= (course?.minPassScore || 70) && nextTopic && (
                            <button
                              onClick={() => navigate(`/training/module/${courseId}/${moduleId}/topic/${nextTopic._id}`)}
                              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                              Next Topic →
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Topic Progress */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Topic Progress</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      isCompleted ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {isCompleted ? '✓ Completed' : 'In Progress'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Module</span>
                    <span className="text-sm font-semibold text-gray-900">{module.title}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Topics</span>
                    <span className="text-sm font-semibold text-gray-900">{module.topics?.length || 0}</span>
                  </div>
                </div>
              </div>

              {/* Module Topics */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Module Topics</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {module.topics?.map((t, index) => (
                    <div
                      key={t._id}
                      className={`flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer ${
                        t._id === topicId
                          ? 'bg-blue-100 border border-blue-300'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => navigate(`/training/module/${courseId}/${moduleId}/topic/${t._id}`)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          completedTopicIds.includes(t._id.toString())
                            ? 'bg-green-500 text-white'
                            : t._id === topicId
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-300 text-gray-600'
                        }`}>
                          {completedTopicIds.includes(t._id.toString()) ? '✓' : index + 1}
                        </div>
                        <span className={`text-sm font-medium ${
                          t._id === topicId ? 'text-blue-700' : 'text-gray-700'
                        }`}>
                          {t.title}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Navigation</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate(`/training/modules/${courseId}`)}
                    className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    ← Back to Modules
                  </button>
                  
                  <div className="flex gap-2">
                    {prevTopic && (
                      <button
                        onClick={() => navigate(`/training/module/${courseId}/${moduleId}/topic/${prevTopic._id}`)}
                        className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        ← Previous
                      </button>
                    )}
                    {nextTopic && (
                      <button
                        onClick={() => navigate(`/training/module/${courseId}/${moduleId}/topic/${nextTopic._id}`)}
                        className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Next →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden px-4 py-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          className="space-y-6"
        >
          {/* Video Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              {topic.videoUrl && (
                <VideoPlayer videoUrl={topic.videoUrl} title={topic.title} />
              )}
              <div className="p-4">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{topic.title}</h2>
                {isCompleted && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium w-fit mb-3">
                    ✓ Completed
                  </div>
                )}
                {quizzes.length > 0 && (
                  <button
                    onClick={() => setShowQuiz(!showQuiz)}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    {showQuiz ? '📚 Hide Quiz' : '📝 Take Quiz'}
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Content Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Content</h3>
              <div className="text-gray-700 whitespace-pre-line leading-relaxed text-sm">
                {topic.content}
              </div>
            </div>
          </motion.div>

          {/* Quiz Section - Mobile */}
          <AnimatePresence>
            {showQuiz && quizzes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">Quiz</h3>
            
                {!quizSubmitted ? (
                  <div className="space-y-4">
                    {quizzes.map((quiz, qIndex) => (
                      <motion.div
                        key={quiz._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: qIndex * 0.1 }}
                        className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50"
                      >
                        <h4 className="font-semibold text-gray-900 mb-3">
                          {qIndex + 1}. {quiz.question}
                        </h4>
                        <div className="space-y-2">
                          {quiz.options.map((option, oIndex) => (
                            <label
                              key={oIndex}
                              className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                                quizAnswers[quiz._id] === oIndex
                                  ? 'bg-blue-100 border-2 border-blue-500'
                                  : 'bg-white border-2 border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`question-${quiz._id}`}
                                checked={quizAnswers[quiz._id] === oIndex}
                                onChange={() => handleQuizAnswer(quiz._id, oIndex)}
                                className="sr-only"
                              />
                              <span className="text-sm text-gray-700 font-medium">{option}</span>
                            </label>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={submitQuiz}
                      disabled={submittingQuiz || Object.keys(quizAnswers).length !== quizzes.length}
                      className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
                    >
                      {submittingQuiz ? 'Submitting...' : 'Submit Quiz'}
                    </motion.button>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6"
                  >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
                      quizScore >= (course?.minPassScore || 70) ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <span className={`text-2xl font-bold ${
                        quizScore >= (course?.minPassScore || 70) ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {quizScore}%
                      </span>
                    </div>
                    <h4 className={`text-lg font-bold mb-2 ${
                      quizScore >= (course?.minPassScore || 70) ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {quizScore >= (course?.minPassScore || 70) ? '🎉 Great Job!' : 'Try Again'}
                    </h4>
                    <p className="text-gray-600 mb-4 text-sm">
                      {quizScore >= (course?.minPassScore || 70)
                        ? 'You passed! This topic is completed.'
                        : `You got ${quizScore}%. Need ${course?.minPassScore || 70}% to pass.`
                      }
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setQuizSubmitted(false);
                          setQuizAnswers({});
                          setQuizScore(0);
                        }}
                        className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
                      >
                        Retake
                      </button>
                      {quizScore >= (course?.minPassScore || 70) && nextTopic && (
                        <button
                          onClick={() => navigate(`/training/module/${courseId}/${moduleId}/topic/${nextTopic._id}`)}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                        >
                          Next →
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation - Mobile */}
          <div className="flex gap-2">
            {prevTopic && (
              <button
                onClick={() => navigate(`/training/module/${courseId}/${moduleId}/topic/${prevTopic._id}`)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                ← Previous
              </button>
            )}
            {nextTopic && (
              <button
                onClick={() => navigate(`/training/module/${courseId}/${moduleId}/topic/${nextTopic._id}`)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next →
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TopicDetailPage;
