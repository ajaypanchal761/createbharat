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

  // Payment methods selection removed; we open Razorpay directly

  const handlePayment = async () => {
    if (!booking) return;
    setIsProcessing(true);
    try {
      const rawToken = (localStorage.getItem('token') || localStorage.getItem('authToken') || '').trim();
      const token = rawToken.replace(/^["']/, '').replace(/["']$/, '');

      // 1) Create Razorpay order on backend
      const orderRes = await mentorBookingAPI.createOrder(token, booking._id);
      if (!orderRes.success) throw new Error('Failed to create order');
      const { orderId, amount, currency, keyId } = orderRes.data;

      // 2) Open Razorpay checkout
      const options = {
        key: keyId,
        amount,
        currency,
        name: 'CreateBharat',
        description: `Booking #${booking._id}`,
        order_id: orderId,
        prefill: {
          name: booking?.user ? `${booking.user.firstName || ''} ${booking.user.lastName || ''}`.trim() : '',
          email: booking?.user?.email || '',
          contact: booking?.user?.phone || '',
        },
        theme: { color: '#f97316' },
        handler: async (response) => {
          try {
            // 3) Mark payment as completed (basic flow; signature verification can be added later)
            await mentorBookingAPI.updatePayment(token, booking._id, {
              paymentMethod: 'razorpay',
              transactionId: response.razorpay_payment_id,
            });
            setIsProcessing(false);
            setIsCompleted(true);
            setTimeout(() => setShowNotification(true), 1500);
          } catch {
            setIsProcessing(false);
            alert('Payment confirmation failed');
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
        alert('Payment SDK not loaded');
      }
    } catch {
      setIsProcessing(false);
      alert('Payment failed');
    }
  };

  const handleComplete = () => {
    navigate('/mentors');
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('navbarMentorsTabChange', { detail: { tab: 'status' } }));
    }, 200);
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
          <p className="text-gray-600 mb-6">
            Your session with {booking?.mentor?.name} has been booked successfully.
            You'll receive a confirmation email shortly.
          </p>

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
              onClose={() => setShowNotification(false)}
            />
          )}
        </Motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      {/* Header */}
      <Motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50"
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

          {/* Payment Button */}
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
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

            <p className="text-xs text-gray-500 mt-3">
              Your payment is secure and encrypted
            </p>
          </Motion.div>
        </div>
      </div>
    </div>
  );
};

export default MentorBookingPage;
