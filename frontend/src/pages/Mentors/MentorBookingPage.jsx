import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../../assets/logo.png';

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
  const { mentorId, slotId } = useParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  // Mock mentor data
  const mentor = {
    id: parseInt(mentorId),
    name: 'Sarah Johnson',
    title: 'Senior Business Consultant',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    price: 150
  };

  const slotDetails = {
    '20min': { duration: '20-25 minutes', price: mentor.price, description: 'Quick consultation' },
    '50min': { duration: '50-60 minutes', price: mentor.price * 2, description: 'In-depth session' },
    '90min': { duration: '90-120 minutes', price: mentor.price * 3, description: 'Comprehensive consultation' }
  };

  const slot = slotDetails[slotId] || slotDetails['20min'];

  const paymentMethods = [
    { id: 'upi', name: 'UPI', icon: '📱', description: 'Pay using UPI ID' },
    { id: 'card', name: 'Credit/Debit Card', icon: '💳', description: 'Visa, Mastercard, RuPay' },
    { id: 'netbanking', name: 'Net Banking', icon: '🏦', description: 'All major banks' },
    { id: 'wallet', name: 'Digital Wallet', icon: '💰', description: 'Paytm, PhonePe, Google Pay' }
  ];

  const handlePayment = () => {
    if (!selectedPaymentMethod) {
      alert('Please select a payment method');
      return;
    }
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsCompleted(true);
    }, 3000);
  };

  const handleComplete = () => {
    navigate('/mentors/my-bookings');
  };

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
      transition: {
        staggerChildren: 0.1
      }
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

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl p-8 shadow-xl border-2 border-gray-100 max-w-md mx-4 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckIcon />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-6">
            Your session with {mentor.name} has been booked successfully. 
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
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to={`/mentors/${mentorId}`} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <ArrowLeftIcon />
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Book Session</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <MenuIcon />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="px-4 pt-6 pb-4">
        <div className="max-w-2xl mx-auto">
          {/* Booking Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100 mb-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Summary</h2>
            
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={mentor.image}
                alt={mentor.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{mentor.name}</h3>
                <p className="text-gray-600">{mentor.title}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Session Duration:</span>
                <span className="font-medium text-gray-900">{slot.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Session Type:</span>
                <span className="font-medium text-gray-900">{slot.description}</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                <span className="text-lg font-bold text-gray-900">₹{slot.price}</span>
              </div>
            </div>
          </motion.div>

          {/* Payment Methods */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100 mb-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Payment Method</h2>
            
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <motion.div
                  key={method.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedPaymentMethod === method.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedPaymentMethod(method.id)}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{method.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{method.name}</h3>
                      <p className="text-sm text-gray-600">{method.description}</p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedPaymentMethod === method.id
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedPaymentMethod === method.id && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Payment Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePayment}
              disabled={!selectedPaymentMethod || isProcessing}
              className={`w-full py-4 px-6 rounded-lg font-medium text-lg transition-all ${
                selectedPaymentMethod && !isProcessing
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
                `Pay ₹${slot.price}`
              )}
            </motion.button>
            
            <p className="text-xs text-gray-500 mt-3">
              Your payment is secure and encrypted
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MentorBookingPage;
