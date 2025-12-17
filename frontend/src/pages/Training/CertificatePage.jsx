import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { trainingAPI, authAPI } from '../../utils/api';
import { FaSpinner } from 'react-icons/fa';

const CertificatePage = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('Your Name');
  const [loading, setLoading] = useState(true);
  const [hasPaid, setHasPaid] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails();
      fetchUserProgress();
      fetchUserData();
    }
  }, [courseId]);

  // Immediate check on mount (synchronous) - loads name before async operations
  useEffect(() => {
    try {
      const userDataStr = localStorage.getItem('userData');
      if (userDataStr) {
        const parsedUser = JSON.parse(userDataStr);
        let name = 'Your Name';
        if (parsedUser.firstName && parsedUser.lastName) {
          name = `${parsedUser.firstName} ${parsedUser.lastName}`.trim();
        } else if (parsedUser.name) {
          name = parsedUser.name.trim();
        } else if (parsedUser.firstName) {
          name = parsedUser.firstName.trim();
        } else if (parsedUser.username) {
          name = parsedUser.username.trim();
        } else if (parsedUser.email) {
          name = parsedUser.email.split('@')[0];
        }
        if (name && name !== 'Your Name') {
          setUserName(name);
          console.log('User name loaded immediately:', name);
        }
      }
    } catch (e) {
      console.error('Error in immediate user check:', e);
    }
  }, []); // Run once on mount

  // Update userName when user state changes
  useEffect(() => {
    if (user) {
      let name = 'Your Name';
      if (user.firstName && user.lastName) {
        name = `${user.firstName} ${user.lastName}`.trim();
      } else if (user.name) {
        name = user.name.trim();
      } else if (user.firstName) {
        name = user.firstName.trim();
      } else if (user.username) {
        name = user.username.trim();
      } else if (user.email) {
        name = user.email.split('@')[0];
      }
      
      if (name && name !== 'Your Name') {
        setUserName(name);
      }
    }
  }, [user]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const response = await trainingAPI.getCourseById(courseId);
      if (response.success) {
        setCourse(response.data.course);
      }
    } catch (err) {
      console.error('Error fetching course:', err);
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
          const adminAssigned = courseProgress.certificateManagedByAdmin && courseProgress.certificateAdminFileId;
          // Check payment status from progress
          setHasPaid(adminAssigned || courseProgress.certificatePaymentStatus === 'completed');
        }
      }
    } catch (err) {
      console.error('Error fetching progress:', err);
    }
  };

  const fetchUserData = async () => {
    try {
      // First, try localStorage (fastest)
      const userDataStr = localStorage.getItem('userData');
      if (userDataStr) {
        try {
          const parsedUser = JSON.parse(userDataStr);
          console.log('User data from localStorage:', parsedUser);
          setUser(parsedUser);
          
          // Extract and set name immediately
          let name = 'Your Name';
          if (parsedUser.firstName && parsedUser.lastName) {
            name = `${parsedUser.firstName} ${parsedUser.lastName}`.trim();
          } else if (parsedUser.name) {
            name = parsedUser.name.trim();
          } else if (parsedUser.firstName) {
            name = parsedUser.firstName.trim();
          } else if (parsedUser.username) {
            name = parsedUser.username.trim();
          } else if (parsedUser.email) {
            name = parsedUser.email.split('@')[0];
          }
          
          if (name && name !== 'Your Name') {
            setUserName(name);
            return;
          }
        } catch (e) {
          console.error('Error parsing userData from localStorage:', e);
        }
      }

      // Try API if token exists
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await authAPI.getMe(token);
          console.log('User data from API:', response);
          if (response.success && response.data) {
            setUser(response.data);
            
            // Extract and set name
            const userData = response.data;
            let name = 'Your Name';
            if (userData.firstName && userData.lastName) {
              name = `${userData.firstName} ${userData.lastName}`.trim();
            } else if (userData.name) {
              name = userData.name.trim();
            } else if (userData.firstName) {
              name = userData.firstName.trim();
            } else if (userData.username) {
              name = userData.username.trim();
            } else if (userData.email) {
              name = userData.email.split('@')[0];
            }
            
            if (name && name !== 'Your Name') {
              setUserName(name);
            }
            
            // Also save to localStorage for future use
            try {
              localStorage.setItem('userData', JSON.stringify(response.data));
            } catch (e) {
              console.warn('Could not save user data to localStorage:', e);
            }
            return;
          }
        } catch (apiErr) {
          console.error('Error fetching user from API:', apiErr);
        }
      }

      // Try alternative localStorage keys
      const storedUserName = localStorage.getItem('userName');
      const userEmail = localStorage.getItem('userEmail');
      if (storedUserName || userEmail) {
        const name = storedUserName || userEmail?.split('@')[0] || 'Your Name';
        setUserName(name);
        setUser({
          name: name,
          email: userEmail,
          firstName: storedUserName?.split(' ')[0] || storedUserName,
          lastName: storedUserName?.split(' ').slice(1).join(' ') || ''
        });
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };

  const handleDownloadCertificate = async () => {
    try {
      setIsDownloading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await trainingAPI.downloadCertificate(token, courseId);
      const blob = await response.blob();
      const disposition = response.headers.get('Content-Disposition') || '';
      let filename = 'certificate.pdf';
      const match = disposition.match(/filename="(.+)"/);
      if (match && match[1]) {
        filename = match[1];
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download certificate error:', err);
      alert(err.message || 'Failed to download certificate.');
    } finally {
      setIsDownloading(false);
    }
  };

  const adminAssigned = progress?.certificateManagedByAdmin && progress?.certificateAdminFileId;

  const getUserName = () => {
    // Always check localStorage first (most reliable)
    const userDataStr = localStorage.getItem('userData');
    if (userDataStr) {
      try {
        const parsedUser = JSON.parse(userDataStr);
        
        // Priority order: firstName + lastName > name > firstName > username > email
        if (parsedUser.firstName && parsedUser.lastName) {
          const fullName = `${parsedUser.firstName} ${parsedUser.lastName}`.trim();
          if (fullName) return fullName;
        }
        if (parsedUser.name) {
          return parsedUser.name.trim();
        }
        if (parsedUser.firstName) {
          return parsedUser.firstName.trim();
        }
        if (parsedUser.username) {
          return parsedUser.username.trim();
        }
        if (parsedUser.email) {
          return parsedUser.email.split('@')[0];
        }
      } catch (e) {
        console.error('Error parsing userData from localStorage:', e);
      }
    }
    
    // Check user state (if loaded)
    if (user) {
      if (user.firstName && user.lastName) {
        const fullName = `${user.firstName} ${user.lastName}`.trim();
        if (fullName) return fullName;
      }
      if (user.name) {
        return user.name.trim();
      }
      if (user.firstName) {
        return user.firstName.trim();
      }
      if (user.username) {
        return user.username.trim();
      }
      if (user.email) {
        return user.email.split('@')[0];
      }
    }
    
    // Try userName key from localStorage
    const userName = localStorage.getItem('userName');
    if (userName && userName.trim()) {
      return userName.trim();
    }
    
    // Final fallback
    return 'Your Name';
  };

  // Detect if running in webview - Enhanced for Flutter WebView
  const isWebView = () => {
    if (typeof window === 'undefined') return false;
    
    const userAgent = window.navigator.userAgent || '';
    
    // Flutter WebView detection (priority checks)
    const isFlutterWebView = 
      window.flutter_inappwebview !== undefined || // Flutter InAppWebView
      window.flutter !== undefined || // Flutter WebView
      window.FlutterWebView !== undefined; // Custom Flutter WebView
    
    // Standard WebView indicators
    const isStandardWebView = 
      /wv|WebView|Android.*wv|iPhone.*wv/i.test(userAgent) ||
      window.ReactNativeWebView !== undefined ||
      window.Android !== undefined ||
      (window.webkit && window.webkit.messageHandlers);
    
    // Mobile device check (but not standard browser)
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isStandardBrowser = !userAgent.includes('wv') && 
                             !userAgent.includes('WebView') &&
                             !window.flutter_inappwebview &&
                             !window.flutter &&
                             !window.ReactNativeWebView;
    
    // Return true if any WebView indicator is present
    return isFlutterWebView || isStandardWebView || (isMobile && !isStandardBrowser);
  };

  // Check for payment callback in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    
    if (paymentStatus === 'success') {
      setIsProcessing(false);
      setHasPaid(true);
      setShowPayment(false);
      // Refresh progress to get updated payment status
      fetchUserProgress();
      fetchUserData();
      alert('Payment successful! Your certificate is now unlocked.');
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    } else if (paymentStatus === 'failed' || paymentStatus === 'error') {
      const message = urlParams.get('message') || 'Payment failed. Please try again.';
      alert(message);
      setIsProcessing(false);
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [courseId]);

  const handlePayment = async () => {
    if (!courseId) {
      alert('Course ID is missing');
      return;
    }

    setIsProcessing(true);
    try {
      const rawToken = (localStorage.getItem('token') || localStorage.getItem('authToken') || '').trim();
      const token = rawToken.replace(/^["']/, '').replace(/["']$/, '');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const inWebView = isWebView();
      console.log('[CertificatePayment][Payment] Environment detected', { isWebView: inWebView });

      if (inWebView) {
        // WebView: Use payment link (redirect-based)
        console.log('[CertificatePayment][Payment] Using payment link for webview');
        
        try {
          const paymentLinkRes = await trainingAPI.createCertificatePaymentLink(token, courseId);
          
          if (!paymentLinkRes.success) {
            const errorMsg = paymentLinkRes.message || paymentLinkRes.error || 'Failed to create payment link';
            throw new Error(errorMsg);
          }
          
          if (!paymentLinkRes.data || !paymentLinkRes.data.paymentUrl) {
            throw new Error('Invalid payment link response from server');
          }
          
          const paymentUrl = paymentLinkRes.data.paymentUrl;
          console.log('[CertificatePayment][Payment] Payment link created:', paymentUrl);
          
          // Try multiple methods to open payment link in WebView
          
          // Method 1: Flutter bridge (if available)
          if (window.FlutterPaymentBridge && typeof window.FlutterPaymentBridge.openPaymentLink === 'function') {
            console.log('[CertificatePayment][Payment] Using Flutter bridge to open payment link');
            window.FlutterPaymentBridge.openPaymentLink(paymentUrl);
            // Keep processing state - will be updated via callback
            return;
          }
          
          // Method 2: window.open (might work in some WebViews)
          try {
            const paymentWindow = window.open(paymentUrl, '_blank', 'noopener,noreferrer');
            if (paymentWindow) {
              console.log('[CertificatePayment][Payment] Opened payment link in new window');
              // Keep processing state - will be updated via callback
              return;
            }
          } catch (openError) {
            console.warn('[CertificatePayment][Payment] window.open failed, trying redirect:', openError);
          }
          
          // Method 3: Standard redirect (fallback)
          console.log('[CertificatePayment][Payment] Redirecting to payment link');
          window.location.href = paymentUrl;
          // Keep processing state - will be updated via callback
          
        } catch (webViewError) {
          console.error('[CertificatePayment][Payment] WebView payment error:', webViewError);
          throw new Error(`Payment link failed: ${webViewError.message || 'Please check your WebView settings or try in a browser.'}`);
        }
      } else {
        // Web Browser: Use Razorpay modal
        console.log('[CertificatePayment][Payment] Using Razorpay modal for web browser');
        
        // 1) Create Razorpay order on backend
        const orderRes = await trainingAPI.createCertificateOrder(token, courseId);
        if (!orderRes.success) {
          const errorMsg = orderRes.message || orderRes.error || 'Failed to create order';
          console.error('Order creation failed:', orderRes);
          throw new Error(errorMsg);
        }
        
        if (!orderRes.data || !orderRes.data.orderId) {
          throw new Error('Invalid order response from server');
        }
        
        const { orderId, amount, currency, keyId } = orderRes.data;

        // 2) Open Razorpay checkout
        const options = {
          key: keyId,
          amount,
          currency,
          name: 'CreateBharat',
          description: `Certificate for ${course?.title || 'Training Course'}`,
          order_id: orderId,
          redirect: false,
          prefill: {
            name: localStorage.getItem('userName') || '',
            email: localStorage.getItem('userEmail') || '',
            contact: localStorage.getItem('userPhone') || '',
          },
          theme: { color: '#f97316' },
          handler: async (response) => {
            try {
              // 3) Mark payment as completed
              await trainingAPI.updateCertificatePayment(token, courseId, {
                transactionId: response.razorpay_payment_id,
                paymentStatus: 'completed',
              });
              setIsProcessing(false);
              setHasPaid(true);
              setShowPayment(false);
              await fetchUserProgress(); // Refresh progress to get updated payment status
              await fetchUserData(); // Refresh user data to ensure name is shown
              alert('Payment successful! Your certificate is now unlocked.');
            } catch (err) {
              console.error('Payment confirmation error:', err);
              setIsProcessing(false);
              alert('Payment confirmation failed: ' + (err.message || 'Please contact support'));
            }
          },
          modal: {
            ondismiss: () => {
              setIsProcessing(false);
            }
          }
        };

        if (window.Razorpay) {
          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          setIsProcessing(false);
          alert('Payment SDK not loaded. Please refresh the page.');
        }
      }
    } catch (err) {
      console.error('Payment error:', err);
      setIsProcessing(false);
      const errorMessage = err.message || err.error || 'Failed to process payment. Please try again.';
      
      // Show user-friendly error messages
      if (errorMessage.includes('Razorpay keys') || errorMessage.includes('Payment gateway not configured')) {
        alert('Payment service is not configured. Please contact administrator.');
      } else if (errorMessage.includes('Not enrolled') || errorMessage.includes('Course not found')) {
        alert(errorMessage + ' Please enroll in the course first.');
      } else if (errorMessage.includes('Course must be completed')) {
        alert(errorMessage + ' Complete all modules and quizzes first.');
      } else if (errorMessage.includes('already completed')) {
        alert(errorMessage + ' Your certificate should already be unlocked.');
      } else {
        alert('Payment failed: ' + errorMessage);
      }
    }
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
            onClick={() => navigate(courseId ? `/training/modules/${courseId}` : '/training')}
            className="flex items-center gap-2 text-gray-700 hover:text-orange-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Course
          </button>
          <div className="flex-1" />
        </div>
      </motion.header>

      {loading ? (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <FaSpinner className="animate-spin text-4xl text-orange-600" />
        </div>
      ) : !course ? (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Course not found</h1>
            <Link to="/training" className="text-blue-600 hover:text-blue-800">
              Back to Training
            </Link>
          </div>
        </div>
      ) : (
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
            {hasPaid ? 'Download and share your verified certificate' : adminAssigned ? 'Certificate assigned by admin' : 'Complete payment to unlock your certificate'}
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

              {/* User Name */}
              <div className="mb-8">
                <h3 className="text-3xl md:text-4xl font-bold text-blue-600 underline decoration-2 decoration-blue-400">
                  {userName !== 'Your Name' ? userName : getUserName()}
                </h3>
              </div>

              {/* Course Details */}
              <div className="mb-8">
                <p className="text-lg text-gray-700 mb-2">
                  has successfully completed the
                </p>
                <h4 className="text-2xl font-bold text-gray-900 mb-4">
                  {course.title}
                </h4>
                <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
                  <span>📅 {new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</span>
                  <span>⏱ {course.minimumDuration}</span>
                  <span>📚 {course.totalModules} Modules</span>
                </div>
              </div>

              {/* Signature Section */}
              <div className="flex justify-between items-end mt-12 pt-8 border-t border-gray-300">
                <div className="flex-1 text-left">
                  <div className="h-16 border-b-2 border-gray-800 mb-2"></div>
                  <p className="text-sm font-semibold">{course.instructor || 'Instructor Signature'}</p>
                </div>
                <div className="flex-1 text-right">
                  <div className="h-16 border-b-2 border-gray-800 mb-2"></div>
                  <p className="text-sm font-semibold">Date</p>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 text-xs text-gray-500">
                <p>Certificate ID: CB-{Date.now().toString().slice(-8)}</p>
                <p className="mt-2">Verified by {course.provider}</p>
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
                  Unlock Certificate - ₹{course?.certificateAmount || 199}
                </button>
              </motion.div>
            </div>
          )}
        </div>

        {/* Download Button (only if paid or admin-assigned) */}
        {hasPaid && (
          <div className="mt-6 flex justify-center">
            {adminAssigned ? (
              <button
                onClick={handleDownloadCertificate}
                disabled={isDownloading}
                className="bg-blue-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-blue-700 transition-colors shadow-lg disabled:opacity-60"
              >
                {isDownloading ? 'Downloading...' : 'Download Assigned Certificate'}
              </button>
            ) : (
              <button
                onClick={() => window.print()}
                className="bg-green-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-green-700 transition-colors shadow-lg"
              >
                Download Certificate
              </button>
            )}
          </div>
        )}
      </div>
      )}

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
                  <span className="text-xl font-bold text-gray-900">₹{course?.certificateAmount || 199}</span>
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
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayment}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : `Pay ₹${course?.certificateAmount || 199}`}
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

