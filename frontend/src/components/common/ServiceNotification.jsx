import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ServiceNotification = ({ 
  type, // 'legal' or 'mentor'
  serviceName,
  mentorName,
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-hide after 10 seconds (giving users more time to read)
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose?.(), 300); // Call onClose after animation
    }, 10000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(), 300);
  };

  const getNotificationContent = () => {
    if (type === 'legal') {
      return {
        icon: '⚖️',
        title: 'CA Will Connect Soon!',
        message: `Our certified CA will connect with you within 24 hours for ${serviceName}`,
        bgColor: 'from-blue-500 to-indigo-600',
        iconBg: 'bg-blue-100',
        textColor: 'text-blue-800'
      };
    } else if (type === 'mentor') {
      return {
        icon: '📧',
        title: 'Link Will Be Shared Soon!',
        message: `${mentorName} आपको 24 घंटे के अंदर Gmail पर session link share करेंगे`,
        bgColor: 'from-purple-500 to-pink-600',
        iconBg: 'bg-purple-100',
        textColor: 'text-purple-800'
      };
    }
    return null;
  };

  const content = getNotificationContent();
  if (!content) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50"
        >
          <div className={`bg-gradient-to-r ${content.bgColor} rounded-xl shadow-2xl border border-white/20 overflow-hidden`}>
            {/* Header */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className={`w-10 h-10 ${content.iconBg} rounded-full flex items-center justify-center`}
                >
                  <span className="text-xl">{content.icon}</span>
                </motion.div>
                <div>
                  <h3 className="text-white font-bold text-lg">{content.title}</h3>
                  <p className="text-white/90 text-sm">24 Hours Guarantee</p>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                className="p-1 rounded-full hover:bg-white/20 transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>

            {/* Message */}
            <div className="px-4 pb-4">
              <p className="text-white/95 text-sm leading-relaxed">
                {content.message}
              </p>
              
              {/* Progress Bar */}
              <div className="mt-3 bg-white/20 rounded-full h-1 overflow-hidden">
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 10, ease: "linear" }}
                  className="h-full bg-white/60 rounded-full"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-4 pb-4 flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClose}
                className="flex-1 py-2 px-4 bg-white/20 text-white text-sm font-medium rounded-lg hover:bg-white/30 transition-colors"
              >
                Got it!
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  // Navigate to contact or support
                  window.open('tel:+91-1234567890', '_self');
                }}
                className="flex-1 py-2 px-4 bg-white text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                Contact Us
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ServiceNotification;
