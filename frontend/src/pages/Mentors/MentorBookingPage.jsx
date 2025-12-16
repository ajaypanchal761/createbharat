import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import ServiceNotification from '../../components/common/ServiceNotification';
import { mentorBookingAPI } from '../../utils/api';

// Icons
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const MentorBookingPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMessage, setPaymentMessage] = useState(null);

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
      setIsCompleted(true);
      setPaymentMessage('Payment successful! Booking confirmed.');
      setShowNotification(true);
      setIsProcessing(false);
      setError(null); // Clear any previous errors
      
      // Refresh booking data to get updated status
      const refreshBooking = async () => {
        try {
          const rawToken = (localStorage.getItem('token') || localStorage.getItem('authToken') || '').trim();
          const token = rawToken.replace(/^["']/, '').replace(/["']$/, '');
          const res = await mentorBookingAPI.getById(token, bookingId);
          if (res.success && res.data && res.data.booking) {
            setBooking(res.data.booking);
          }
        } catch (error) {
          console.error('[MentorBooking] Error refreshing booking after payment:', error);
        }
      };
      refreshBooking();
      
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    } else if (paymentStatus === 'failed' || paymentStatus === 'error') {
      const message = urlParams.get('message') || 'Booking failed. Payment was not completed. Please try again.';
      setError(message);
      setIsProcessing(false);
      setIsCompleted(false);
      
      // Refresh booking data
      const refreshBooking = async () => {
        try {
          const rawToken = (localStorage.getItem('token') || localStorage.getItem('authToken') || '').trim();
          const token = rawToken.replace(/^["']/, '').replace(/["']$/, '');
          const res = await mentorBookingAPI.getById(token, bookingId);
          if (res.success && res.data && res.data.booking) {
            setBooking(res.data.booking);
          }
        } catch (error) {
          console.error('[MentorBooking] Error refreshing booking after payment failure:', error);
        }
      };
      refreshBooking();
      
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [bookingId]);

  // Listen for postMessage from WebView payment callback
  useEffect(() => {
    const handleMessage = async (event) => {
      // Verify origin for security (adjust as needed)
      if (event.data && event.data.type === 'paymentCallback') {
        const { bookingId: callbackBookingId, status, paymentId } = event.data;
        
        // Check if this callback is for current booking
        if (callbackBookingId === bookingId) {
          console.log('[MentorBooking][PostMessage] Payment callback received', event.data);
          
          if (status === 'success') {
            try {
              // Refresh booking to get updated status
              const rawToken = (localStorage.getItem('token') || localStorage.getItem('authToken') || '').trim();
              const token = rawToken.replace(/^["']/, '').replace(/["']$/, '');
              const res = await mentorBookingAPI.getById(token, bookingId);
              
              if (res.success && res.data && res.data.booking) {
                setBooking(res.data.booking);
                if (res.data.booking.paymentStatus === 'completed') {
                  setIsCompleted(true);
                  setPaymentMessage('Payment successful! Booking confirmed.');
                  setShowNotification(true);
                  setIsProcessing(false);
                }
              }
            } catch (error) {
              console.error('[MentorBooking][PostMessage] Error refreshing booking:', error);
            }
          } else if (status === 'failed') {
            const errorMessage = event.data.message || 'Booking failed. Payment was not completed. Please try again.';
            setError(errorMessage);
            setIsProcessing(false);
            setIsCompleted(false);
            // Refresh booking to get latest status
            try {
              const rawToken = (localStorage.getItem('token') || localStorage.getItem('authToken') || '').trim();
              const token = rawToken.replace(/^["']/, '').replace(/["']$/, '');
              const res = await mentorBookingAPI.getById(token, bookingId);
              if (res.success && res.data && res.data.booking) {
                setBooking(res.data.booking);
              }
            } catch (error) {
              console.error('[MentorBooking][PostMessage] Error refreshing booking on failure:', error);
            }
          }
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [bookingId]);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const rawToken = (localStorage.getItem('token') || localStorage.getItem('authToken') || '').trim();
        const token = rawToken.replace(/^["']/, '').replace(/["']$/, '');
        const res = await mentorBookingAPI.getById(token, bookingId);
        if (res.success && res.data && res.data.booking) {
          setBooking(res.data.booking);
        } else {
          setBooking(null);
        }
      } catch {
        setBooking(null);
      }
    };
    fetchBooking();
  }, [bookingId]);

  // Payment status polling for WebView (fallback if redirect fails)
  useEffect(() => {
    if (!booking || !isWebView()) return;
    
    // Only poll if payment is pending and we have a payment gateway order ID
    if (booking.paymentStatus === 'pending' && booking.paymentGatewayOrderId) {
      console.log('[MentorBooking][Polling] Starting payment status polling');
      
      let pollCount = 0;
      const maxPolls = 100; // Poll for 5 minutes (100 * 3 seconds)
      
      const pollInterval = setInterval(async () => {
        pollCount++;
        
        try {
          const rawToken = (localStorage.getItem('token') || localStorage.getItem('authToken') || '').trim();
          const token = rawToken.replace(/^["']/, '').replace(/["']$/, '');
          
          // Verify payment status
          const verifyRes = await mentorBookingAPI.verifyPayment(token, bookingId);
          
          if (verifyRes.success && verifyRes.data && verifyRes.data.booking) {
            const updatedBooking = verifyRes.data.booking;
            
            if (updatedBooking.paymentStatus === 'completed') {
              console.log('[MentorBooking][Polling] Payment completed via polling');
              setBooking(updatedBooking);
              setIsCompleted(true);
              setPaymentMessage('Payment successful! Booking confirmed.');
              setShowNotification(true);
              setIsProcessing(false);
              setError(null); // Clear any previous errors
              clearInterval(pollInterval);
              return;
            } else if (updatedBooking.paymentStatus === 'failed') {
              // Payment failed - stop polling and show error
              console.log('[MentorBooking][Polling] Payment failed');
              setBooking(updatedBooking);
              setError('Booking failed. Payment was not completed. Please try again.');
              setIsProcessing(false);
              setIsCompleted(false);
              clearInterval(pollInterval);
              return;
            }
          }
          
          // Stop polling after max attempts
          if (pollCount >= maxPolls) {
            console.log('[MentorBooking][Polling] Max polling attempts reached');
            // Don't show error if still pending - user might complete payment later
            clearInterval(pollInterval);
          }
        } catch (error) {
          console.error('[MentorBooking][Polling] Error polling payment status:', error);
          // Don't stop polling on error, continue trying
        }
      }, 3000); // Poll every 3 seconds
      
      // Cleanup on unmount or when booking changes
      return () => {
        clearInterval(pollInterval);
      };
    }
  }, [booking, bookingId]);

  // Hybrid payment handler: modal for web, payment link for webview
  const handlePayment = async () => {
    if (!booking) return;
    setIsProcessing(true);
    setError(null);
    setPaymentMessage(null);
    
    try {
      const rawToken = (localStorage.getItem('token') || localStorage.getItem('authToken') || '').trim();
      const token = rawToken.replace(/^["']/, '').replace(/["']$/, '');
      
      const inWebView = isWebView();
      console.log('[MentorBooking][Payment] Environment detected', { isWebView: inWebView });

      if (inWebView) {
        // WebView: Use payment link (redirect-based)
        console.log('[MentorBooking][Payment] Using payment link for webview');
        
        try {
          const paymentLinkRes = await mentorBookingAPI.createPaymentLink(token, booking._id);
        
        if (!paymentLinkRes.success) {
          const errorMsg = paymentLinkRes.message || paymentLinkRes.error || 'Failed to create payment link';
          throw new Error(errorMsg);
        }
        
        if (!paymentLinkRes.data || !paymentLinkRes.data.paymentUrl) {
          throw new Error('Invalid payment link response from server');
        }
        
          const paymentUrl = paymentLinkRes.data.paymentUrl;
          console.log('[MentorBooking][Payment] Payment link created:', paymentUrl);
          
          // Try multiple methods to open payment link in WebView
          
          // Method 1: Flutter bridge (if available)
          if (window.FlutterPaymentBridge && typeof window.FlutterPaymentBridge.openPaymentLink === 'function') {
            console.log('[MentorBooking][Payment] Using Flutter bridge to open payment link');
            window.FlutterPaymentBridge.openPaymentLink(paymentUrl);
            // Keep processing state - polling will update status
            return;
          }
          
          // Method 2: window.open (might work in some WebViews)
          try {
            const paymentWindow = window.open(paymentUrl, '_blank', 'noopener,noreferrer');
            if (paymentWindow) {
              console.log('[MentorBooking][Payment] Opened payment link in new window');
              // Keep processing state - polling will update status
              return;
            }
          } catch (openError) {
            console.warn('[MentorBooking][Payment] window.open failed, trying redirect:', openError);
          }
          
          // Method 3: Standard redirect (fallback)
        console.log('[MentorBooking][Payment] Redirecting to payment link');
          window.location.href = paymentUrl;
          // Keep processing state - will be updated via callback or polling
          
        } catch (webViewError) {
          console.error('[MentorBooking][Payment] WebView payment error:', webViewError);
          throw new Error(`Payment link failed: ${webViewError.message || 'Please check your WebView settings or try in a browser.'}`);
        }
      } else {
        // Web Browser: Use Razorpay modal
        console.log('[MentorBooking][Payment] Using Razorpay modal for web browser');
        
        // 1) Create Razorpay order on backend
        const orderRes = await mentorBookingAPI.createOrder(token, booking._id);
        if (!orderRes.success) {
          const errorMsg = orderRes.message || orderRes.error || 'Failed to create payment order';
          throw new Error(errorMsg);
        }
        
        // Validate response data
        if (!orderRes.data) {
          throw new Error('Invalid response from server');
        }
        
        const { orderId, amount, currency, keyId } = orderRes.data;
        
        if (!orderId || !amount || !keyId) {
          throw new Error('Missing payment information. Please try again.');
        }

        // Wait for Razorpay SDK to load
        let razorpayLoaded = false;
        if (window.Razorpay) {
          razorpayLoaded = true;
        } else {
          // Wait up to 3 seconds for SDK to load
          for (let i = 0; i < 30; i++) {
            await new Promise(resolve => setTimeout(resolve, 100));
            if (window.Razorpay) {
              razorpayLoaded = true;
              break;
            }
          }
        }

        if (!razorpayLoaded || !window.Razorpay) {
          throw new Error('Razorpay SDK not loaded. Please refresh the page and try again.');
        }

        // 2) Open Razorpay checkout modal (in-app, no redirect)
        const options = {
          key: keyId,
          amount,
          currency,
          name: 'CreateBharat',
          description: `Mentor Booking - ${booking.sessionType} session`,
          order_id: orderId,
          // Important: redirect: false keeps payment in-app
          redirect: false,
          handler: async (response) => {
            try {
              console.log('[MentorBooking][Payment] Payment successful', response);
              
              const paymentResponse = await mentorBookingAPI.updatePayment(token, booking._id, {
                paymentMethod: 'razorpay',
                transactionId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              });
              
              if (paymentResponse.success) {
                setIsProcessing(false);
                setIsCompleted(true);
                setPaymentMessage('Payment successful! Booking confirmed.');
                setTimeout(() => setShowNotification(true), 1500);
              } else {
                throw new Error(paymentResponse.message || 'Payment confirmation failed');
              }
            } catch (err) {
              console.error('[MentorBooking][Payment] Confirmation error', err);
              setIsProcessing(false);
              setError(err.message || 'Payment confirmation failed. Please contact support.');
            }
          },
          modal: {
            ondismiss: () => {
              console.log('[MentorBooking][Payment] Modal dismissed by user');
              setIsProcessing(false);
            },
            escape: true,
            backdropclose: true
          },
          prefill: {
            name: localStorage.getItem('userName') || '',
            email: localStorage.getItem('userEmail') || '',
            contact: localStorage.getItem('userPhone') || ''
          },
          theme: {
            color: '#2563eb',
            backdrop_color: '#00000080'
          },
          config: {
            display: {
              blocks: {
                banks: {
                  name: "All payment methods",
                  instruments: [
                    { method: "upi" },
                    { method: "card" },
                    { method: "netbanking" },
                    { method: "wallet" }
                  ]
                }
              },
              sequence: ["block.banks"],
              preferences: {
                show_default_blocks: true
              }
            }
          }
        };

        const rzp = new window.Razorpay(options);
        
        rzp.on('payment.failed', (failure) => {
          console.error('[MentorBooking][Payment] Payment failed', failure);
          setIsProcessing(false);
          const errorMsg = failure.error?.description || failure.error?.reason || 'Payment failed. Please try again.';
          setError(errorMsg);
        });

        // Open modal (stays in-app)
        rzp.open();
        console.log('[MentorBooking][Payment] Razorpay modal opened in-app');
      }
    } catch (error) {
      console.error('[MentorBooking][Payment] Error launching payment', error);
      setIsProcessing(false);
      const message = error?.message || 'Payment failed. Please try again.';
      setError(message);
      setPaymentMessage(null);
    }
  };

  const handleComplete = () => {
    navigate('/mentors');
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('navbarMentorsTabChange', { detail: { tab: 'status' } }));
    }, 200);
  };

  // Manual payment verification (fallback for WebView)
  const handleVerifyPayment = async () => {
    if (!booking) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const rawToken = (localStorage.getItem('token') || localStorage.getItem('authToken') || '').trim();
      const token = rawToken.replace(/^["']/, '').replace(/["']$/, '');
      
      const verifyRes = await mentorBookingAPI.verifyPayment(token, bookingId);
      
      if (verifyRes.success && verifyRes.data && verifyRes.data.booking) {
        const updatedBooking = verifyRes.data.booking;
        setBooking(updatedBooking);
        
        if (updatedBooking.paymentStatus === 'completed') {
          setIsCompleted(true);
          setPaymentMessage('Payment successful! Booking confirmed.');
          setShowNotification(true);
          setError(null); // Clear any previous errors
        } else if (updatedBooking.paymentStatus === 'failed') {
          setError('Booking failed. Payment was not completed. Please try again.');
          setIsCompleted(false);
        } else {
          setError('Payment is still pending. Please complete the payment or try again later.');
          setIsCompleted(false);
        }
      } else {
        setError(verifyRes.message || 'Failed to verify payment. Please try again.');
      }
    } catch (error) {
      console.error('[MentorBooking][Verify] Error:', error);
      setError(error.message || 'Failed to verify payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 flex items-center justify-center">
        <Motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl p-8 shadow-xl border-2 border-gray-100 max-w-md mx-4 text-center"
        >
          <Motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckIcon />
          </Motion.div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-4">
            Your session with {booking?.mentor?.name} has been booked successfully.
            You'll receive a confirmation email shortly.
          </p>
          {booking?.mentor?.responseTime && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm">
                <strong>Response Time:</strong> The mentor typically responds within <strong>{booking.mentor.responseTime}</strong>. 
                You'll receive updates about your session schedule once the mentor confirms.
              </p>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleComplete}
              className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              View My Bookings
            </button>
            <Link
              to="/mentors"
              className="block w-full py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors text-center"
            >
              Browse More Mentors
            </Link>
          </div>

          {/* Service Notification - Only show after successful booking */}
          {showNotification && isCompleted && (
            <ServiceNotification
              type="mentor"
              mentorName={booking?.mentor?.name}
              responseTime={booking?.mentor?.responseTime}
              onClose={() => setShowNotification(false)}
            />
          )}
        </Motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      {/* Toast Notification for Payment Status */}
      <AnimatePresence>
        {error && (
          <Motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white shadow-lg"
          >
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <p className="font-semibold">Payment Failed</p>
                  <p className="text-sm text-red-100">{error}</p>
                </div>
              </div>
              <button
                onClick={() => setError(null)}
                className="ml-4 p-1 hover:bg-red-700 rounded"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </Motion.div>
        )}
        {paymentMessage && !error && (
          <Motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-0 left-0 right-0 z-50 bg-green-600 text-white shadow-lg"
          >
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <p className="font-semibold">Payment Successful</p>
                  <p className="text-sm text-green-100">{paymentMessage}</p>
                </div>
              </div>
              <button
                onClick={() => setPaymentMessage(null)}
                className="ml-4 p-1 hover:bg-green-700 rounded"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <Motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky z-40 ${error || paymentMessage ? 'top-12' : 'top-0'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to={`/mentors/${booking?.mentor?._id}`} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <ArrowLeftIcon />
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Book Session</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <MenuIcon />
              </button>
            </div>
          </div>
        </div>
      </Motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex">
            <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
            <Motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="w-64 bg-white h-full shadow-xl"
            >
              <div className="p-6">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mb-6 p-2 hover:bg-gray-100 rounded-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="space-y-2">
                  <Link to="/" className="block py-3 px-4 rounded-lg hover:bg-gray-100 text-gray-700 font-medium">Home</Link>
                  <Link to="/loans" className="block py-3 px-4 rounded-lg hover:bg-gray-100 text-gray-700 font-medium">Loans</Link>
                  <Link to="/internships" className="block py-3 px-4 rounded-lg hover:bg-gray-100 text-gray-700 font-medium">Internships</Link>
                  <Link to="/mentors" className="block py-3 px-4 rounded-lg hover:bg-gray-100 text-gray-700 font-medium">Mentors</Link>
                  <Link to="/legal" className="block py-3 px-4 rounded-lg hover:bg-gray-100 text-gray-700 font-medium">Legal Services</Link>
                  <Link to="/training" className="block py-3 px-4 rounded-lg hover:bg-gray-100 text-gray-700 font-medium">Training</Link>
                  <Link to="/profile" className="block py-3 px-4 rounded-lg hover:bg-gray-100 text-gray-700 font-medium">Profile</Link>
                </div>
              </div>
            </Motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="px-4 pt-6 pb-4">
        <div className="max-w-2xl mx-auto">
          {/* Booking Summary */}
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100 mb-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Summary</h2>

            <div className="flex items-center space-x-4 mb-4">
              <img
                src={booking?.mentor?.image}
                alt={booking?.mentor?.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{booking?.mentor?.name}</h3>
                <p className="text-gray-600">{booking?.mentor?.title}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Session Duration:</span>
                <span className="font-medium text-gray-900">{booking?.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Session Type:</span>
                <span className="font-medium text-gray-900">{booking?.sessionType}</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                <span className="text-lg font-bold text-gray-900">₹{booking?.amount}</span>
              </div>
            </div>
          </Motion.div>

          {/* Payment method selection removed */}

          {/* Error Message Display */}
          {error && (
            <Motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg"
            >
              <div className="flex items-start">
                <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <h3 className="text-red-800 font-semibold mb-1">Payment Failed</h3>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="ml-2 text-red-600 hover:text-red-800"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </Motion.div>
          )}

          {/* Success Message Display */}
          {paymentMessage && !error && (
            <Motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-4 bg-green-50 border-2 border-green-200 rounded-lg"
            >
              <div className="flex items-start">
                <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <h3 className="text-green-800 font-semibold mb-1">Payment Successful</h3>
                  <p className="text-green-700 text-sm">{paymentMessage}</p>
                </div>
                <button
                  onClick={() => setPaymentMessage(null)}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </Motion.div>
          )}

          {/* Payment Button */}
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            {booking?.paymentStatus === 'pending' && booking?.paymentGatewayOrderId ? (
              <>
                <Motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePayment}
                  disabled={isProcessing || !booking}
                  className={`w-full py-4 px-6 rounded-lg font-medium text-lg transition-all mb-3 ${!isProcessing && booking
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing Payment...</span>
                    </div>
                  ) : (
                    `Pay ₹${booking?.amount}`
                  )}
                </Motion.button>
                
                {/* Manual Verify Button for WebView */}
                {isWebView() && (
                  <Motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleVerifyPayment}
                    disabled={isProcessing}
                    className="w-full py-3 px-6 rounded-lg font-medium text-base transition-all bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:bg-gray-300 disabled:text-gray-500"
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                        <span>Verifying...</span>
                      </div>
                    ) : (
                      'Verify Payment Status'
                    )}
                  </Motion.button>
                )}
              </>
            ) : (
            <Motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePayment}
              disabled={isProcessing || !booking}
              className={`w-full py-4 px-6 rounded-lg font-medium text-lg transition-all ${!isProcessing && booking
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing Payment...</span>
                </div>
              ) : (
                `Pay ₹${booking?.amount}`
              )}
            </Motion.button>
            )}

            <p className="text-xs text-gray-500 mt-3">
              Your payment is secure and encrypted
            </p>
            {isWebView() && booking?.paymentStatus === 'pending' && booking?.paymentGatewayOrderId && (
              <p className="text-xs text-blue-600 mt-2">
                💡 If payment completed but status not updated, click "Verify Payment Status"
              </p>
            )}
          </Motion.div>
        </div>
      </div>
    </div>
  );
};

export default MentorBookingPage;
