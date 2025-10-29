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

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const DocumentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const SpinnerIcon = () => (
  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const LegalDocumentUploadPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const legalServices = {
    1: { name: 'GST Registration', icon: '📋', color: 'from-blue-500 to-cyan-500' },
    2: { name: 'GST Filing', icon: '📄', color: 'from-green-500 to-emerald-500' },
    3: { name: 'Income Tax Filing', icon: '💰', color: 'from-purple-500 to-violet-500' },
    4: { name: 'ROC Filing', icon: '🏢', color: 'from-orange-500 to-red-500' },
    5: { name: 'Import Export Registration', icon: '🚢', color: 'from-indigo-500 to-blue-500' },
    6: { name: 'MSME Registration', icon: '🏭', color: 'from-teal-500 to-green-500' },
    7: { name: 'Trade Mark Filing', icon: '™️', color: 'from-pink-500 to-rose-500' },
    8: { name: 'Food (FSSAI) License', icon: '🍽️', color: 'from-yellow-500 to-orange-500' },
    9: { name: 'PF/ESIC Registration', icon: '👥', color: 'from-cyan-500 to-blue-500' },
    10: { name: 'ISO Certification', icon: '🏆', color: 'from-emerald-500 to-teal-500' },
    11: { name: 'Proprietorship Company Registration', icon: '👤', color: 'from-violet-500 to-purple-500' },
    12: { name: 'Partnership Company Registration', icon: '🤝', color: 'from-red-500 to-pink-500' },
    13: { name: 'Private Limited/LLP Company Registration', icon: '🏛️', color: 'from-blue-600 to-indigo-600' },
    14: { name: 'NGO Registration', icon: '❤️', color: 'from-green-600 to-emerald-600' }
  };

  const service = legalServices[parseInt(serviceId)];

  // Document requirements for each service
  const documentRequirements = {
    1: [
      { name: 'PAN Card', required: true, description: 'PAN Card of the business/proprietor' },
      { name: 'Aadhaar Card', required: true, description: 'Aadhaar Card of the proprietor' },
      { name: 'Business Address Proof', required: true, description: 'Rental agreement or property documents' },
      { name: 'Bank Account Details', required: true, description: 'Bank account statement or passbook' },
      { name: 'Digital Signature Certificate', required: true, description: 'DSC for online filing' },
      { name: 'Business Registration Certificate', required: false, description: 'If business is already registered' },
      { name: 'Partnership Deed', required: false, description: 'If applicable' },
      { name: 'Board Resolution', required: false, description: 'For companies' }
    ],
    2: [
      { name: 'GST Registration Certificate', required: true, description: 'Valid GST registration certificate' },
      { name: 'Sales Records', required: true, description: 'Sales invoices and records' },
      { name: 'Purchase Records', required: true, description: 'Purchase invoices and records' },
      { name: 'Bank Statements', required: true, description: 'Bank statements for the period' },
      { name: 'Tax Invoices', required: true, description: 'All tax invoices issued' },
      { name: 'Credit/Debit Notes', required: false, description: 'If any adjustments made' },
      { name: 'E-way Bills', required: false, description: 'For goods transportation' },
      { name: 'HSN/SAC Codes', required: true, description: 'Product/service classification codes' }
    ],
    3: [
      { name: 'PAN Card', required: true, description: 'Personal PAN Card' },
      { name: 'Form 16/16A', required: true, description: 'Salary certificate from employer' },
      { name: 'Bank Statements', required: true, description: 'Bank statements for the year' },
      { name: 'Investment Proofs', required: false, description: 'FD, Mutual Fund, etc.' },
      { name: 'Rent Receipts', required: false, description: 'If claiming HRA' },
      { name: 'Medical Bills', required: false, description: 'Medical expenses' },
      { name: 'Insurance Premium Receipts', required: false, description: 'Life/Health insurance' },
      { name: 'Previous Year ITR', required: false, description: 'Last year tax return' }
    ],
    4: [
      { name: 'Annual Financial Statements', required: true, description: 'Audited financial statements' },
      { name: 'Audit Report', required: true, description: 'Auditor report' },
      { name: 'Board Resolution', required: true, description: 'Board resolution for filing' },
      { name: 'Director Report', required: true, description: 'Director annual report' },
      { name: 'MGT-7 Form', required: true, description: 'Annual return form' },
      { name: 'AOC-4 Form', required: true, description: 'Financial statement form' },
      { name: 'Company PAN Card', required: true, description: 'Company PAN card' },
      { name: 'Digital Signature Certificate', required: true, description: 'DSC for online filing' }
    ],
    5: [
      { name: 'PAN Card', required: true, description: 'Business PAN Card' },
      { name: 'Aadhaar Card', required: true, description: 'Proprietor Aadhaar Card' },
      { name: 'Business Registration', required: true, description: 'Business registration certificate' },
      { name: 'Bank Certificate', required: true, description: 'Bank certificate' },
      { name: 'Address Proof', required: true, description: 'Business address proof' },
      { name: 'Digital Signature Certificate', required: true, description: 'DSC for online filing' },
      { name: 'Mobile Number', required: true, description: 'Valid mobile number' },
      { name: 'Email ID', required: true, description: 'Valid email address' }
    ],
    6: [
      { name: 'PAN Card', required: true, description: 'Business PAN Card' },
      { name: 'Aadhaar Card', required: true, description: 'Proprietor Aadhaar Card' },
      { name: 'Business Registration', required: true, description: 'Business registration certificate' },
      { name: 'Bank Account Details', required: true, description: 'Bank account details' },
      { name: 'Business Address Proof', required: true, description: 'Business address proof' },
      { name: 'Investment Details', required: true, description: 'Investment in Plant & Machinery' },
      { name: 'Turnover Details', required: true, description: 'Annual turnover details' },
      { name: 'Mobile Number', required: true, description: 'Valid mobile number' }
    ],
    7: [
      { name: 'Trademark Application Form', required: true, description: 'Completed application form' },
      { name: 'Logo/Brand Image', required: true, description: 'High quality logo image' },
      { name: 'Goods/Services Description', required: true, description: 'Detailed description' },
      { name: 'Applicant Details', required: true, description: 'Complete applicant information' },
      { name: 'Power of Attorney', required: false, description: 'If filed by attorney' },
      { name: 'Priority Documents', required: false, description: 'If claiming priority' },
      { name: 'Mobile Number', required: true, description: 'Valid mobile number' },
      { name: 'Email ID', required: true, description: 'Valid email address' }
    ],
    8: [
      { name: 'PAN Card', required: true, description: 'Business PAN Card' },
      { name: 'Aadhaar Card', required: true, description: 'Proprietor Aadhaar Card' },
      { name: 'Business Registration', required: true, description: 'Business registration certificate' },
      { name: 'Food Safety Plan', required: true, description: 'Food safety management plan' },
      { name: 'Premises Documents', required: true, description: 'Premises ownership/rental documents' },
      { name: 'Equipment List', required: true, description: 'List of food processing equipment' },
      { name: 'Mobile Number', required: true, description: 'Valid mobile number' },
      { name: 'Email ID', required: true, description: 'Valid email address' }
    ],
    9: [
      { name: 'PAN Card', required: true, description: 'Business PAN Card' },
      { name: 'Business Registration', required: true, description: 'Business registration certificate' },
      { name: 'Bank Account Details', required: true, description: 'Bank account details' },
      { name: 'Employee Details', required: true, description: 'Employee information' },
      { name: 'Salary Structure', required: true, description: 'Salary structure details' },
      { name: 'Premises Documents', required: true, description: 'Office premises documents' },
      { name: 'Mobile Number', required: true, description: 'Valid mobile number' },
      { name: 'Email ID', required: true, description: 'Valid email address' }
    ],
    10: [
      { name: 'Business Registration', required: true, description: 'Business registration certificate' },
      { name: 'Quality Manual', required: true, description: 'Quality management manual' },
      { name: 'Process Documentation', required: true, description: 'Process documentation' },
      { name: 'Management System Records', required: true, description: 'Management system records' },
      { name: 'Internal Audit Reports', required: true, description: 'Internal audit reports' },
      { name: 'Corrective Action Records', required: true, description: 'Corrective action records' },
      { name: 'Training Records', required: true, description: 'Employee training records' },
      { name: 'Mobile Number', required: true, description: 'Valid mobile number' }
    ],
    11: [
      { name: 'PAN Card', required: true, description: 'Personal PAN Card' },
      { name: 'Aadhaar Card', required: true, description: 'Personal Aadhaar Card' },
      { name: 'Business Name', required: true, description: 'Proposed business name' },
      { name: 'Business Address', required: true, description: 'Business address proof' },
      { name: 'Bank Account Details', required: true, description: 'Bank account details' },
      { name: 'Mobile Number', required: true, description: 'Valid mobile number' },
      { name: 'Email ID', required: true, description: 'Valid email address' },
      { name: 'Business Activity Description', required: true, description: 'Detailed business activity' }
    ],
    12: [
      { name: 'Partnership Deed', required: true, description: 'Drafted partnership deed' },
      { name: 'PAN Cards of Partners', required: true, description: 'All partners PAN cards' },
      { name: 'Aadhaar Cards', required: true, description: 'All partners Aadhaar cards' },
      { name: 'Business Address Proof', required: true, description: 'Business address proof' },
      { name: 'Bank Account Details', required: true, description: 'Bank account details' },
      { name: 'Mobile Numbers', required: true, description: 'All partners mobile numbers' },
      { name: 'Email IDs', required: true, description: 'All partners email addresses' },
      { name: 'Business Activity Description', required: true, description: 'Detailed business activity' }
    ],
    13: [
      { name: 'Company Name', required: true, description: 'Proposed company name' },
      { name: 'Director/Partner Details', required: true, description: 'All directors/partners details' },
      { name: 'Registered Office Address', required: true, description: 'Registered office address' },
      { name: 'Memorandum of Association', required: true, description: 'MOA document' },
      { name: 'Articles of Association', required: true, description: 'AOA document' },
      { name: 'Digital Signature Certificates', required: true, description: 'DSC for all directors' },
      { name: 'PAN Cards', required: true, description: 'All directors PAN cards' },
      { name: 'Address Proofs', required: true, description: 'All directors address proofs' }
    ],
    14: [
      { name: 'Trust Deed/Society Registration', required: true, description: 'Trust deed or society registration' },
      { name: 'Founder Details', required: true, description: 'All founder details' },
      { name: 'Objectives Document', required: true, description: 'NGO objectives document' },
      { name: 'Registered Office Address', required: true, description: 'Registered office address' },
      { name: 'Bank Account Details', required: true, description: 'Bank account details' },
      { name: 'PAN Card', required: true, description: 'NGO PAN card' },
      { name: 'Mobile Number', required: true, description: 'Valid mobile number' },
      { name: 'Email ID', required: true, description: 'Valid email address' }
    ]
  };

  const [uploadedFiles, setUploadedFiles] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const documents = documentRequirements[parseInt(serviceId)] || [];

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

  const handleFileChange = (documentName, file) => {
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('File size exceeds 10MB limit.');
        return;
      }
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        alert('Only PDF, JPEG, PNG files are allowed.');
        return;
      }
      setUploadedFiles(prev => ({ ...prev, [documentName]: file }));
    } else {
      setUploadedFiles(prev => {
        const newFiles = { ...prev };
        delete newFiles[documentName];
        return newFiles;
      });
    }
  };

  const validateUploads = () => {
    const requiredDocs = documents.filter(doc => doc.required);
    const missingDocs = requiredDocs.filter(doc => !uploadedFiles[doc.name]);
    
    if (missingDocs.length > 0) {
      alert(`Please upload all required documents: ${missingDocs.map(doc => doc.name).join(', ')}`);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateUploads()) {
      setIsSubmitting(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSubmitting(false);
      setIsSubmitted(true);
      // Redirect to payment page
      setTimeout(() => {
        navigate(`/legal/service/${serviceId}/payment`);
      }, 3000);
    }
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

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col items-center justify-center p-4 text-center"
      >
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
        >
          <CheckCircleIcon />
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-800 mt-4 mb-2">Documents Uploaded Successfully!</h2>
        <p className="text-lg text-gray-600">Your documents have been submitted for {service.name}.</p>
        <p className="text-md text-gray-500 mt-2">Redirecting to payment page...</p>
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
            onClick={() => navigate(`/legal/service/${serviceId}`)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeftIcon />
          </motion.button>
          
          <h1 className="text-xl font-bold text-gray-900">Upload Documents</h1>
          
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Documents</h1>
          <p className="text-gray-600">Upload all required documents for {service.name}</p>
        </motion.div>

        {/* Upload Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-6"
        >
          {documents.map((doc, index) => (
            <motion.div
              key={doc.name}
              variants={fadeInUp}
              className="bg-white rounded-xl p-6 shadow-md"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <DocumentIcon />
                    {doc.name}
                    {doc.required && <span className="text-red-500 text-sm">*</span>}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                </div>
                {uploadedFiles[doc.name] && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-green-500"
                  >
                    <CheckCircleIcon />
                  </motion.div>
                )}
              </div>

              <label 
                htmlFor={`file-${index}`}
                className={`flex flex-col items-center justify-center w-full h-32 border-2 ${uploadedFiles[doc.name] ? 'border-green-500' : 'border-blue-300'} border-dashed rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors duration-200`}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadIcon />
                  <p className="mb-2 text-sm text-gray-600">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PDF, JPEG, PNG (MAX. 10MB)</p>
                </div>
                <input 
                  id={`file-${index}`}
                  type="file" 
                  className="hidden" 
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(doc.name, e.target.files[0])}
                />
              </label>

              {uploadedFiles[doc.name] && (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-gray-700 flex items-center gap-2"
                >
                  <CheckCircleIcon />
                  Uploaded: <span className="font-medium">{uploadedFiles[doc.name].name}</span>
                </motion.p>
              )}
            </motion.div>
          ))}

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02, boxShadow: "0 10px 20px rgba(59, 130, 246, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            className={`w-full bg-gradient-to-r ${service.color} text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2`}
            disabled={isSubmitting}
          >
            {isSubmitting && <SpinnerIcon />}
            {isSubmitting ? 'Processing...' : 'Submit Documents'}
          </motion.button>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-xs text-gray-500 mt-4"
          >
            All documents will be securely processed and kept confidential.
          </motion.p>
        </motion.form>
      </div>
    </div>
  );
};

export default LegalDocumentUploadPage;
