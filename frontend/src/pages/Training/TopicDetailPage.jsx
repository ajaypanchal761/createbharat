import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { allModules, modules as detailedModules } from '../../data/entrepreneurshipTraining';

// Icon Components
const BackIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg> );
const CheckIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg> );
const PlayIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg> );

const TopicDetailPage = () => {
  const { moduleId, topicId } = useParams();
  const navigate = useNavigate();
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [completedTopics, setCompletedTopics] = useState(() => {
    const saved = localStorage.getItem('completedTopics');
    return saved ? JSON.parse(saved) : [];
  });

  // Get module and topic data
  const module = allModules.find(m => m.id === parseInt(moduleId));
  const detailedModule = detailedModules.find(m => m.id === parseInt(moduleId));
  const topic = detailedModule?.topics.find(t => t.id === topicId);

  if (!module || !topic) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Topic not found</h1>
          <Link to="/training" className="text-blue-600 hover:text-blue-800">
            Back to Training
          </Link>
        </div>
      </div>
    );
  }

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const handleQuizAnswer = (questionId, answerIndex) => {
    setQuizAnswers({
      ...quizAnswers,
      [questionId]: answerIndex
    });
  };

  const submitQuiz = () => {
    let correct = 0;
    topic.quiz.forEach(q => {
      const userAnswer = quizAnswers[q.id];
      if (userAnswer === q.correctAnswer) {
        correct++;
      }
    });
    
    const score = Math.round((correct / topic.quiz.length) * 100);
    setQuizScore(score);
    setQuizSubmitted(true);
    
    if (score >= 70) {
      const newCompletedTopics = [...completedTopics, `${moduleId}-${topicId}`];
      setCompletedTopics(newCompletedTopics);
      localStorage.setItem('completedTopics', JSON.stringify(newCompletedTopics));
    }
  };

  const isCompleted = completedTopics.includes(`${moduleId}-${topicId}`);
  const currentTopicIndex = detailedModule.topics.findIndex(t => t.id === topicId);
  const nextTopic = detailedModule.topics[currentTopicIndex + 1];
  const prevTopic = detailedModule.topics[currentTopicIndex - 1];

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
            <BackIcon />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{module.title}</h1>
            <p className="text-sm text-gray-600">{topic.title}</p>
          </div>
        </div>
      </motion.header>

      {/* Desktop Header - Removed to avoid duplication with main Navbar */}

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
              <motion.div variants={fadeInUp}>
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                  {/* Video Player */}
                  <div className="relative w-full aspect-video bg-gray-900">
                    <iframe
                      src={topic.videoUrl}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={topic.title}
                    />
                  </div>
                  
                  {/* Video Info */}
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">{topic.title}</h2>
                    <div className="flex items-center gap-6 mb-4 text-sm text-gray-600">
                      <span className="flex items-center gap-2">
                        <span>📊</span> {detailedModule.topics.length} Topics
                      </span>
                      <span className="flex items-center gap-2">
                        <span>⭐</span> Quiz Included
                      </span>
                    </div>
                    <button
                      onClick={() => setShowQuiz(!showQuiz)}
                      className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                      {showQuiz ? '📚 Hide Quiz' : '📝 Take Quiz'}
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Content Section */}
              <motion.div variants={fadeInUp}>
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
                {showQuiz && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white rounded-xl p-8 shadow-lg border border-gray-200"
                  >
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                      Quiz: {topic.title}
                    </h3>
                
                    {!quizSubmitted ? (
                      <div className="space-y-6">
                        {topic.quiz.map((question, qIndex) => (
                          <motion.div
                            key={question.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: qIndex * 0.1 }}
                            className="border-2 border-gray-200 rounded-xl p-6 bg-gray-50 hover:shadow-md transition-all"
                          >
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">
                              {qIndex + 1}. {question.question}
                            </h4>
                            <div className="space-y-3">
                              {question.options.map((option, oIndex) => (
                                <label
                                  key={oIndex}
                                  className={`flex items-center p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                                    quizAnswers[question.id] === oIndex
                                      ? 'bg-blue-100 border-2 border-blue-500 shadow-md'
                                      : 'bg-white border-2 border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name={`question-${question.id}`}
                                    checked={quizAnswers[question.id] === oIndex}
                                    onChange={() => handleQuizAnswer(question.id, oIndex)}
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
                          className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold text-lg shadow-lg"
                        >
                          Submit Quiz
                        </motion.button>
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-8"
                      >
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                          quizScore >= 70 ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          <span className={`text-3xl font-bold ${
                            quizScore >= 70 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {quizScore}%
                          </span>
                        </div>
                        <h4 className={`text-2xl font-bold mb-2 ${
                          quizScore >= 70 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {quizScore >= 70 ? '🎉 Congratulations!' : '❌ Try Again'}
                        </h4>
                        <p className="text-gray-600 mb-6">
                          {quizScore >= 70 
                            ? 'You passed the quiz! This topic is now marked as completed.'
                            : `You need at least 70% to pass. You got ${quizScore}%. Review the material and try again.`
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
                          {quizScore >= 70 && nextTopic && (
                            <button
                              onClick={() => navigate(`/training/module/${moduleId}/topic/${nextTopic.id}`)}
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
                    <span className="text-sm font-semibold text-gray-900">{detailedModule.topics.length}</span>
                  </div>
                </div>
              </div>

              {/* Module Topics */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Module Topics</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {detailedModule.topics.map((t, index) => (
                    <div
                      key={t.id}
                      className={`flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer ${
                        t.id === topicId
                          ? 'bg-blue-100 border border-blue-300'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => navigate(`/training/module/${moduleId}/topic/${t.id}`)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          completedTopics.includes(`${moduleId}-${t.id}`)
                            ? 'bg-green-500 text-white'
                            : t.id === topicId
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-300 text-gray-600'
                        }`}>
                          {completedTopics.includes(`${moduleId}-${t.id}`) ? '✓' : index + 1}
                        </div>
                        <span className={`text-sm font-medium ${
                          t.id === topicId ? 'text-blue-700' : 'text-gray-700'
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
                    onClick={() => navigate(`/training/modules/entrepreneurship-mastery`)}
                    className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    ← Back to Modules
                  </button>
                  
                  <div className="flex gap-2">
                    {prevTopic && (
                      <button
                        onClick={() => navigate(`/training/module/${moduleId}/topic/${prevTopic.id}`)}
                        className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        ← Previous
                      </button>
                    )}
                    {nextTopic && (
                      <button
                        onClick={() => navigate(`/training/module/${moduleId}/topic/${nextTopic.id}`)}
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
          <motion.div variants={fadeInUp}>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="relative w-full aspect-video bg-gray-900">
                <iframe
                  src={topic.videoUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={topic.title}
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{topic.title}</h2>
                {isCompleted && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium w-fit mb-3">
                    ✓ Completed
                  </div>
                )}
                <button
                  onClick={() => setShowQuiz(!showQuiz)}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  {showQuiz ? '📚 Hide Quiz' : '📝 Take Quiz'}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Content Section */}
          <motion.div variants={fadeInUp}>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Content</h3>
              <div className="text-gray-700 whitespace-pre-line leading-relaxed text-sm">
                {topic.content}
              </div>
            </div>
          </motion.div>

          {/* Quiz Section */}
          <AnimatePresence>
            {showQuiz && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">Quiz</h3>
            
                {!quizSubmitted ? (
                  <div className="space-y-4">
                    {topic.quiz.map((question, qIndex) => (
                      <motion.div
                        key={question.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: qIndex * 0.1 }}
                        className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50"
                      >
                        <h4 className="font-semibold text-gray-900 mb-3">
                          {qIndex + 1}. {question.question}
                        </h4>
                        <div className="space-y-2">
                          {question.options.map((option, oIndex) => (
                            <label
                              key={oIndex}
                              className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                                quizAnswers[question.id] === oIndex
                                  ? 'bg-blue-100 border-2 border-blue-500'
                                  : 'bg-white border-2 border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`question-${question.id}`}
                                checked={quizAnswers[question.id] === oIndex}
                                onChange={() => handleQuizAnswer(question.id, oIndex)}
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
                      className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                      Submit Quiz
                    </motion.button>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6"
                  >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
                      quizScore >= 70 ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <span className={`text-2xl font-bold ${
                        quizScore >= 70 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {quizScore}%
                      </span>
                    </div>
                    <h4 className={`text-lg font-bold mb-2 ${
                      quizScore >= 70 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {quizScore >= 70 ? '🎉 Great Job!' : 'Try Again'}
                    </h4>
                    <p className="text-gray-600 mb-4 text-sm">
                      {quizScore >= 70 
                        ? 'You passed! This topic is completed.'
                        : `You got ${quizScore}%. Need 70% to pass.`
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
                      {quizScore >= 70 && nextTopic && (
                        <button
                          onClick={() => navigate(`/training/module/${moduleId}/topic/${nextTopic.id}`)}
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

          {/* Navigation */}
          <div className="flex gap-2">
            {prevTopic && (
              <button
                onClick={() => navigate(`/training/module/${moduleId}/topic/${prevTopic.id}`)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                ← Previous
              </button>
            )}
            {nextTopic && (
              <button
                onClick={() => navigate(`/training/module/${moduleId}/topic/${nextTopic.id}`)}
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
