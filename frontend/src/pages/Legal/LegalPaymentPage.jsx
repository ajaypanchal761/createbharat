import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../../assets/logo.png';

// Icons
const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const CreditCardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const UpiIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const NetBankingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const WalletIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const SpinnerIcon = () => (
  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const LegalPaymentPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const legalServices = {
    1: { name: 'GST Registration', icon: '📋', color: 'from-blue-500 to-cyan-500', fees: '₹1,999' },
    2: { name: 'GST Filing', icon: '📄', color: 'from-green-500 to-emerald-500', fees: '₹999' },
    3: { name: 'Income Tax Filing', icon: '💰', color: 'from-purple-500 to-violet-500', fees: '₹1,499' },
    4: { name: 'ROC Filing', icon: '🏢', color: 'from-orange-500 to-red-500', fees: '₹2,999' },
    5: { name: 'Import Export Registration', icon: '🚢', color: 'from-indigo-500 to-blue-500', fees: '₹1,999' },
    6: { name: 'MSME Registration', icon: '🏭', color: 'from-teal-500 to-green-500', fees: '₹999' },
    7: { name: 'Trade Mark Filing', icon: '™️', color: 'from-pink-500 to-rose-500', fees: '₹4,999' },
    8: { name: 'Food (FSSAI) License', icon: '🍽️', color: 'from-yellow-500 to-orange-500', fees: '₹1,999' },
    9: { name: 'PF/ESIC Registration', icon: '👥', color: 'from-cyan-500 to-blue-500', fees: '₹1,499' },
    10: { name: 'ISO Certification', icon: '🏆', color: 'from-emerald-500 to-teal-500', fees: '₹9,999' },
    11: { name: 'Proprietorship Company Registration', icon: '👤', color: 'from-violet-500 to-purple-500', fees: '₹999' },
    12: { name: 'Partnership Company Registration', icon: '🤝', color: 'from-red-500 to-pink-500', fees: '₹1,999' },
    13: { name: 'Private Limited/LLP Company Registration', icon: '🏛️', color: 'from-blue-600 to-indigo-600', fees: '₹4,999' },
    14: { name: 'NGO Registration', icon: '❤️', color: 'from-green-600 to-emerald-600', fees: '₹2,999' }
  };

  const service = legalServices[parseInt(serviceId)];

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const paymentMethods = [
    {
      id: 'credit-card',
      name: 'Credit/Debit Card',
      icon: <CreditCardIcon />,
      description: 'Visa, Mastercard, RuPay',
      color: 'border-blue-500 bg-blue-50'
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: <UpiIcon />,
      description: 'Google Pay, PhonePe, Paytm',
      color: 'border-green-500 bg-green-50'
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: <NetBankingIcon />,
      description: 'All major banks',
      color: 'border-purple-500 bg-purple-50'
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      icon: <WalletIcon />,
      description: 'Paytm, Mobikwik, Freecharge',
      color: 'border-orange-500 bg-orange-50'
    }
  ];

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

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      alert('Please select a payment method');
      return;
    }

    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsProcessing(false);
    setIsCompleted(true);

    // Redirect to success page or home after 3 seconds
    setTimeout(() => {
      navigate('/legal');
    }, 3000);
  };

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h1>
          <button
            onClick={() => navigate('/legal')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Legal Services
          </button>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex flex-col items-center justify-center p-4 text-center"
      >
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
        >
          <CheckCircleIcon />
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-800 mt-4 mb-2">Payment Successful!</h2>
        <p className="text-lg text-gray-600">Your payment for {service.name} has been processed successfully.</p>
        <p className="text-md text-gray-500 mt-2">We will process your application and get back to you shortly.</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/legal')}
          className="mt-8 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold shadow-md hover:bg-green-700 transition-colors"
        >
          Back to Legal Services
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm"
      >
        <div className="flex items-center justify-between px-4 py-3">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(`/legal/service/${serviceId}/upload`)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeftIcon />
          </motion.button>
          
          <div className="flex items-center">
            <motion.img 
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
              src={logo} 
              alt="CreateBharat Logo" 
              className="h-12 w-auto object-contain" 
            />
          </div>
          
          <div className="w-10"></div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="px-4 pt-6 pb-4 max-w-4xl mx-auto">
        {/* Service Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
            className={`w-20 h-20 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center text-white text-4xl mx-auto mb-4 shadow-lg`}
          >
            {service.icon}
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Payment</h1>
          <p className="text-gray-600">Pay for {service.name} service</p>
        </motion.div>

        {/* Payment Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-md mb-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Service Fee</span>
              <span className="font-semibold">{service.fees}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Processing Fee</span>
              <span className="font-semibold">₹99</span>
            </div>
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total Amount</span>
                <span className="text-lg font-bold text-blue-600">{service.fees}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Payment Methods */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-4"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Payment Method</h2>
          
          {paymentMethods.map((method, index) => (
            <motion.div
              key={method.id}
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedPaymentMethod(method.id)}
              className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                selectedPaymentMethod === method.id 
                  ? `${method.color} border-opacity-100` 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${method.color}`}>
                  {method.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{method.name}</h3>
                  <p className="text-sm text-gray-600">{method.description}</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 ${
                  selectedPaymentMethod === method.id 
                    ? 'border-blue-500 bg-blue-500' 
                    : 'border-gray-300'
                }`}>
                  {selectedPaymentMethod === method.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-full h-full rounded-full bg-white flex items-center justify-center"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Pay Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 10px 20px rgba(59, 130, 246, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePayment}
            className={`w-full bg-gradient-to-r ${service.color} text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2`}
            disabled={isProcessing}
          >
            {isProcessing && <SpinnerIcon />}
            {isProcessing ? 'Processing Payment...' : `Pay ${service.fees}`}
          </motion.button>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-6"
        >
          <p className="text-xs text-gray-500">
            🔒 Your payment is secured with 256-bit SSL encryption
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LegalPaymentPage;
