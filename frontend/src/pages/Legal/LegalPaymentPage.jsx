import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ServiceNotification from '../../components/common/ServiceNotification';
import { legalServiceAPI, legalSubmissionAPI } from '../../utils/api';

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
  const location = useLocation();
  const [service, setService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submissionId, setSubmissionId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  // Get submissionId from location state or URL params
  useEffect(() => {
    const stateSubmissionId = location.state?.submissionId;
    if (stateSubmissionId) {
      setSubmissionId(stateSubmissionId);
    }
    fetchServiceDetails();
  }, [serviceId, location]);

  const fetchServiceDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await legalServiceAPI.getById(serviceId);
      if (response.success && response.data.service) {
        const serviceData = response.data.service;
        setService({
          id: serviceData._id,
          name: serviceData.name,
          icon: serviceData.icon || '⚖️',
          color: 'from-blue-500 to-cyan-500', // Default color
          price: serviceData.price || '₹0'
        });
      } else {
        setError('Service not found');
      }
    } catch (err) {
      console.error('Error fetching service details:', err);
      setError(err.message || 'Failed to fetch service details');
    } finally {
      setIsLoading(false);
    }
  };

  // Extract price number from string (e.g., "₹15,000" -> 15000)
  const getPriceAmount = (priceString) => {
    if (!priceString) return 0;
    const priceNum = priceString.replace(/[₹,]/g, '');
    return parseInt(priceNum) || 0;
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

  const handlePayment = async () => {
    if (!submissionId) {
      alert('Submission ID not found. Please go back and try again.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Get user token
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      if (!token) {
        alert('Please login to proceed with payment');
        navigate('/login');
        setIsProcessing(false);
        return;
      }

      // Create Razorpay order
      const orderResponse = await legalSubmissionAPI.createOrder(token, submissionId);
      
      if (!orderResponse.success) {
        const errorMessage = orderResponse.error || orderResponse.message || 'Failed to create payment order';
        console.error('Order creation failed:', orderResponse);
        throw new Error(errorMessage);
      }
      
      if (!orderResponse.data) {
        console.error('Order response missing data:', orderResponse);
        throw new Error('Invalid order response from server');
      }

      const { orderId, amount, currency, keyId } = orderResponse.data;

      // Validate required fields
      if (!orderId) {
        console.error('Order ID missing in response:', orderResponse.data);
        throw new Error('Order ID is missing from server response');
      }
      
      if (!keyId) {
        console.error('Razorpay Key ID missing in response:', orderResponse.data);
        throw new Error('Payment gateway configuration error. Please contact support.');
      }
      
      if (!amount || amount <= 0) {
        console.error('Invalid amount in response:', orderResponse.data);
        throw new Error('Invalid payment amount');
      }

      // Initialize Razorpay
      const options = {
        key: keyId,
        amount: amount,
        currency: currency || 'INR',
        name: service?.name || 'Legal Service',
        description: `Payment for ${service?.name || 'Legal Service'}`,
        order_id: orderId,
        handler: async function (response) {
          try {
            // Update payment with Razorpay response
            const paymentResponse = await legalSubmissionAPI.updatePayment(token, submissionId, {
              paymentMethod: 'razorpay',
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (paymentResponse.success) {
              setIsProcessing(false);
              setIsCompleted(true);
              
              // Show notification after payment completion
              setTimeout(() => {
                setShowNotification(true);
              }, 1500);

              // Redirect after 5 seconds
              setTimeout(() => {
                navigate('/legal');
              }, 5000);
            } else {
              throw new Error(paymentResponse.message || 'Payment verification failed');
            }
          } catch (err) {
            console.error('Payment verification error:', err);
            setIsProcessing(false);
            setError(err.message || 'Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: localStorage.getItem('userName') || '',
          email: localStorage.getItem('userEmail') || '',
          contact: localStorage.getItem('userPhone') || ''
        },
        theme: {
          color: '#2563eb'
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      razorpay.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        setIsProcessing(false);
        setError(response.error.description || 'Payment failed. Please try again.');
      });

    } catch (err) {
      console.error('Payment error:', err);
      const errorMessage = err.message || err.response?.data?.message || 'Failed to process payment. Please try again.';
      setError(errorMessage);
      setIsProcessing(false);
      
      // Show error notification
      alert(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'The service you are looking for does not exist.'}</p>
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
        <p className="text-lg text-gray-600 mb-4">Your payment for {service?.name || 'Legal Service'} has been processed successfully.</p>
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 max-w-md mx-auto mt-4">
          <p className="text-lg font-semibold text-blue-800 mb-2">✓ CA will contact you within 24 hours</p>
          <p className="text-sm text-blue-600">Our Chartered Accountant will review your submission and get in touch with you soon.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/legal')}
          className="mt-8 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold shadow-md hover:bg-green-700 transition-colors"
        >
          Back to Legal Services
        </motion.button>
        
        {/* Service Notification - Only show after successful payment */}
        {showNotification && isCompleted && (
          <ServiceNotification
            type="legal"
            serviceName={service.name}
            onClose={() => setShowNotification(false)}
          />
        )}
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
          
          <h1 className="text-xl font-bold text-gray-900">Payment</h1>
          
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
            className={`w-20 h-20 bg-gradient-to-r ${service.color || 'from-blue-500 to-cyan-500'} rounded-2xl flex items-center justify-center text-white text-4xl mx-auto mb-4 shadow-lg`}
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
              <span className="font-semibold">{service.price}</span>
            </div>
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total Amount</span>
                <span className="text-lg font-bold text-blue-600">{service.price}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6"
          >
            {error}
          </motion.div>
        )}

        {/* Payment Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-md mb-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Information</h2>
          <p className="text-gray-600">
            Click the button below to proceed with payment via Razorpay. You will be redirected to the secure payment gateway.
          </p>
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
            className={`w-full bg-gradient-to-r ${service.color || 'from-blue-500 to-cyan-500'} text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2`}
            disabled={isProcessing || !submissionId}
          >
            {isProcessing && <SpinnerIcon />}
            {isProcessing ? 'Processing Payment...' : `Pay ${service.price}`}
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
