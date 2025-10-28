import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNavbar from '../../components/common/BottomNavbar';

// Bottom Nav Icons
const HomeIcon = ({ active }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> );
const BriefcaseIcon = ({ active }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> );
const ChatIcon = ({ active }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg> );
const DocumentIcon = ({ active }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> );
const UserIcon = ({ active }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> );

const LegalDocumentsPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [uploadedDocuments, setUploadedDocuments] = useState([]);

  const documentCategories = [
    { id: 'business', name: 'Business Documents', icon: '🏢', count: 12 },
    { id: 'property', name: 'Property Documents', icon: '🏠', count: 8 },
    { id: 'personal', name: 'Personal Documents', icon: '👤', count: 15 },
    { id: 'legal', name: 'Legal Documents', icon: '⚖️', count: 6 },
    { id: 'financial', name: 'Financial Documents', icon: '💰', count: 10 },
    { id: 'government', name: 'Government Forms', icon: '🏛️', count: 20 }
  ];

  const documentTemplates = [
    {
      id: 1,
      name: 'Company Registration Form',
      category: 'business',
      description: 'Form for registering a new company',
      size: '2.5 MB',
      format: 'PDF',
      downloads: 1250,
      rating: 4.8,
      price: 'Free'
    },
    {
      id: 2,
      name: 'Property Sale Agreement',
      category: 'property',
      description: 'Legal agreement for property sale',
      size: '1.8 MB',
      format: 'PDF',
      downloads: 890,
      rating: 4.6,
      price: '₹500'
    },
    {
      id: 3,
      name: 'Power of Attorney',
      category: 'legal',
      description: 'Legal document granting authority',
      size: '1.2 MB',
      format: 'PDF',
      downloads: 2100,
      rating: 4.9,
      price: '₹300'
    },
    {
      id: 4,
      name: 'Will and Testament',
      category: 'personal',
      description: 'Legal document for inheritance',
      size: '2.1 MB',
      format: 'PDF',
      downloads: 750,
      rating: 4.7,
      price: '₹800'
    },
    {
      id: 5,
      name: 'Loan Agreement',
      category: 'financial',
      description: 'Standard loan agreement template',
      size: '1.5 MB',
      format: 'PDF',
      downloads: 3200,
      rating: 4.5,
      price: '₹400'
    },
    {
      id: 6,
      name: 'GST Registration Form',
      category: 'government',
      description: 'Government form for GST registration',
      size: '3.2 MB',
      format: 'PDF',
      downloads: 4500,
      rating: 4.8,
      price: 'Free'
    }
  ];

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newDocuments = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      type: file.type,
      uploadDate: new Date().toLocaleDateString(),
      status: 'uploaded'
    }));
    setUploadedDocuments(prev => [...prev, ...newDocuments]);
  };

  const filteredDocuments = selectedCategory === 'all' 
    ? documentTemplates 
    : documentTemplates.filter(doc => doc.category === selectedCategory);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between px-4 py-4 bg-white/90 backdrop-blur-lg border-b border-gradient-to-r from-blue-200 to-purple-200 shadow-lg"
      >
        <motion.div 
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="flex items-center gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.1, x: -2, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 transition-all duration-300"
            onClick={() => navigate('/legal')}
          >
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
          >
            Legal Documents
          </motion.h1>
        </motion.div>
      </motion.header>

      {/* Main Content */}
      <div className="px-4 pb-20 pt-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-4xl mx-auto"
        >
          {/* Document Categories */}
          <motion.div
            variants={fadeInUp}
            className="bg-white/90 backdrop-blur-lg rounded-xl p-4 shadow-xl border border-white/40 mb-4"
          >
            <h2 className="text-lg font-bold text-gray-800 mb-3">Document Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {documentCategories.map((category) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-lg mb-1">{category.icon}</div>
                    <div className={`text-xs font-semibold ${
                      selectedCategory === category.id ? 'text-blue-600' : 'text-gray-600'
                    }`}>
                      {category.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{category.count} documents</div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Upload Section */}
          <motion.div
            variants={fadeInUp}
            className="bg-white/90 backdrop-blur-lg rounded-xl p-4 shadow-xl border border-white/40 mb-4"
          >
            <h2 className="text-lg font-bold text-gray-800 mb-3">Upload Documents</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <svg className="w-8 h-8 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-gray-600 mb-3 text-sm">Drag and drop your documents here, or click to browse</p>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <motion.label
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                htmlFor="file-upload"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm"
              >
                Choose Files
              </motion.label>
            </div>
          </motion.div>

          {/* Uploaded Documents */}
          {uploadedDocuments.length > 0 && (
            <motion.div
              variants={fadeInUp}
              className="bg-white/90 backdrop-blur-lg rounded-xl p-4 shadow-xl border border-white/40 mb-4"
            >
              <h2 className="text-lg font-bold text-gray-800 mb-3">Your Uploaded Documents</h2>
              <div className="space-y-2">
                {uploadedDocuments.map((doc) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-2 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{doc.name}</p>
                        <p className="text-xs text-gray-600">{doc.size} • {doc.uploadDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {doc.status}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1 text-red-500 hover:bg-red-50 rounded-full"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Document Templates */}
          <motion.div
            variants={fadeInUp}
            className="bg-white/90 backdrop-blur-lg rounded-xl p-4 shadow-xl border border-white/40"
          >
            <h2 className="text-lg font-bold text-gray-800 mb-3">Document Templates</h2>
            <div className="space-y-3">
              {filteredDocuments.map((doc) => (
                <motion.div
                  key={doc.id}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-300 bg-white"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 text-sm truncate">{doc.name}</h3>
                      <p className="text-xs text-gray-600 truncate">{doc.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">{doc.size}</span>
                        <span className="text-xs text-gray-500">{doc.format}</span>
                        <span className="text-xs text-gray-500">{doc.downloads}</span>
                        <div className="flex items-center">
                          <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-xs text-gray-500 ml-1">{doc.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-2">
                    <div className="text-sm font-bold text-blue-600">{doc.price}</div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                    >
                      Download
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavbar 
        tabs={[
          { name: 'Home', path: '/', icon: <HomeIcon /> },
          { name: 'Services', path: '/legal', icon: <BriefcaseIcon /> },
          { name: 'Consult', path: '/legal/consult', icon: <ChatIcon /> },
          { name: 'Documents', path: '/legal/documents', icon: <DocumentIcon /> },
          { name: 'Profile', path: '/profile', icon: <UserIcon /> }
        ]}
      />
    </div>
  );
};

export default LegalDocumentsPage;
