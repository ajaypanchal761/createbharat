import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { entrepreneurshipCourse } from '../../data/entrepreneurshipTraining';

const CertificatePage = () => {
  const navigate = useNavigate();
  const [hasPaid, setHasPaid] = useState(() => {
    return localStorage.getItem('certificatePaid') === 'true';
  });
  const [showPayment, setShowPayment] = useState(false);

  const handlePayment = () => {
    // Simulate payment processing
    setTimeout(() => {
      localStorage.setItem('certificatePaid', 'true');
      setHasPaid(true);
      setShowPayment(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 pb-20">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200"
      >
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate('/training/modules/entrepreneurship-mastery')}
            className="flex items-center gap-2 text-gray-700 hover:text-orange-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Course
          </button>
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="CreateBharat Logo" className="h-8 w-auto object-contain" />
          </Link>
        </div>
      </motion.header>

      {/* Certificate Display */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Your Certificate
          </h1>
          <p className="text-gray-600">
            {hasPaid ? 'Download and share your verified certificate' : 'Complete payment to unlock your certificate'}
          </p>
        </motion.div>

        {/* Certificate */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className={`bg-white rounded-2xl shadow-2xl p-8 md:p-12 border-8 border-blue-600 ${!hasPaid ? 'blur-sm' : ''}`}
          >
            {/* Certificate Design */}
            <div className="text-center">
              {/* Certificate Header */}
              <div className="mb-8">
                <div className="flex justify-center mb-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-5xl">
                    🏆
                  </div>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 uppercase tracking-wide">
                  Certificate of Completion
                </h2>
                <p className="text-gray-600 mt-2">This is to certify that</p>
              </div>

              {/* User Name Placeholder */}
              <div className="mb-8">
                <h3 className="text-3xl md:text-4xl font-bold text-blue-600 underline decoration-2 decoration-blue-400">
                  [Your Name]
                </h3>
              </div>

              {/* Course Details */}
              <div className="mb-8">
                <p className="text-lg text-gray-700 mb-2">
                  has successfully completed the
                </p>
                <h4 className="text-2xl font-bold text-gray-900 mb-4">
                  {entrepreneurshipCourse.title}
                </h4>
                <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
                  <span>📅 January 2024</span>
                  <span>⏱ 45 Hours</span>
                  <span>📚 9 Modules</span>
                </div>
              </div>

              {/* Signature Section */}
              <div className="flex justify-between items-end mt-12 pt-8 border-t border-gray-300">
                <div className="flex-1 text-left">
                  <div className="h-16 border-b-2 border-gray-800 mb-2"></div>
                  <p className="text-sm font-semibold">Instructor Signature</p>
                </div>
                <div className="flex-1 text-right">
                  <div className="h-16 border-b-2 border-gray-800 mb-2"></div>
                  <p className="text-sm font-semibold">Date</p>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 text-xs text-gray-500">
                <p>Certificate ID: CB-{Date.now().toString().slice(-8)}</p>
                <p className="mt-2">Verified by {entrepreneurshipCourse.provider}</p>
              </div>
            </div>
          </motion.div>

          {/* Payment Overlay */}
          {!hasPaid && (
            <div className="absolute inset-0 bg-black/80 rounded-2xl flex items-center justify-center flex-col p-8 z-10">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center"
              >
                <div className="text-6xl mb-4">🔒</div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Certificate Locked
                </h3>
                <p className="text-gray-300 mb-6 max-w-md">
                  Complete your payment to unlock and download your verified certificate
                </p>
                <button
                  onClick={() => setShowPayment(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-8 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  Unlock Certificate - ₹199
                </button>
              </motion.div>
            </div>
          )}
        </div>

        {/* Download Button (only if paid) */}
        {hasPaid && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => window.print()}
              className="bg-green-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-green-700 transition-colors shadow-lg"
            >
              Download Certificate
            </button>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPayment && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Complete Payment
              </h3>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Certificate Fee</span>
                  <span className="text-xl font-bold text-gray-900">₹199</span>
                </div>
                <div className="text-sm text-gray-600">
                  <p>• Verified certificate</p>
                  <p>• Lifetime access</p>
                  <p>• Downloadable PDF</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPayment(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayment}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  Pay ₹199
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CertificatePage;

