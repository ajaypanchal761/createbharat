import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const GSTRegistrationTypePage = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState('');

  const gstTypes = [
    {
      id: 'proprietorship',
      name: 'Proprietorship (Individual Firm)',
      description: 'Sole proprietorship business owned by a single individual',
      icon: '👤',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'partnership',
      name: 'Partnership Firm',
      description: 'Business owned by two or more partners',
      icon: '🤝',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'llp',
      name: 'LLP (Limited Liability Partnership)',
      description: 'Partnership with limited liability protection',
      icon: '🏢',
      color: 'from-purple-500 to-violet-500'
    },
    {
      id: 'private-limited',
      name: 'Private Limited Company',
      description: 'Company with limited liability and private ownership',
      icon: '🏛️',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'public-limited',
      name: 'Public Limited Company',
      description: 'Company whose shares are traded publicly',
      icon: '📈',
      color: 'from-indigo-500 to-blue-500'
    },
    {
      id: 'huf',
      name: 'HUF (Hindu Undivided Family)',
      description: 'Family business structure under Hindu law',
      icon: '👨‍👩‍👧‍👦',
      color: 'from-teal-500 to-green-500'
    },
    {
      id: 'trust-society-ngo',
      name: 'Trust / Society / NGO',
      description: 'Non-profit organizations and charitable institutions',
      icon: '❤️',
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 'government',
      name: 'Government Department / Local Authority',
      description: 'Government entities and local authorities',
      icon: '🏛️',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'casual',
      name: 'Casual Taxable Person',
      description: 'Occasional suppliers without fixed place of business',
      icon: '📋',
      color: 'from-cyan-500 to-blue-500'
    }
  ];

  const handleTypeSelect = (typeId) => {
    setSelectedType(typeId);
  };

  const handleContinue = () => {
    if (selectedType) {
      // Navigate to GST registration detail page with the selected type
      navigate(`/legal/service/1?type=${selectedType}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 pb-8">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-gradient-to-r from-orange-400 to-orange-500 shadow-lg md:hidden"
      >
        <div className="flex items-center justify-between px-4 py-3">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/legal')}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
          <h1 className="text-xl font-bold text-white">GST Registration Type</h1>
          <div className="w-10"></div>
        </div>
      </motion.header>

      {/* Desktop Header */}
      <div className="hidden md:block bg-gradient-to-r from-orange-400 to-orange-500 shadow-lg">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate('/legal')}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>
              <h1 className="text-2xl font-bold text-white">Select GST Registration Type</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Choose Your Business Type</h2>
          <p className="text-gray-600">Select the type of business entity for GST registration</p>
        </motion.div>

        {/* GST Types Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
        >
          {gstTypes.map((type, index) => (
            <motion.div
              key={type.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleTypeSelect(type.id)}
              className={`relative cursor-pointer rounded-xl p-6 border-2 transition-all duration-300 ${
                selectedType === type.id
                  ? 'border-orange-500 bg-orange-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
              }`}
            >
              {/* Selection Indicator */}
              {selectedType === type.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}

              {/* Icon */}
              <div className="flex items-center justify-center mb-4">
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ duration: 0.3 }}
                  className={`w-16 h-16 bg-gradient-to-br ${type.color} rounded-xl flex items-center justify-center text-2xl shadow-lg`}
                >
                  {type.icon}
                </motion.div>
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">
                {type.name}
              </h3>
              <p className="text-sm text-gray-600 text-center leading-relaxed">
                {type.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleContinue}
            disabled={!selectedType}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg ${
              selectedType
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue with {selectedType ? gstTypes.find(t => t.id === selectedType)?.name : 'Selection'}
          </motion.button>
        </motion.div>

        {/* Help Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 text-center"
        >
          <div className="bg-blue-50 rounded-xl p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Need Help Choosing?</h3>
            <p className="text-blue-700 text-sm">
              If you're unsure about which business type applies to you, our legal experts can help you determine the best option for your specific situation.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GSTRegistrationTypePage;

