import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { pitchAPI } from '../../utils/api';
import { useUser } from '../../contexts/UserContext';

const SubmitPitchPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [myPitches, setMyPitches] = useState([]);
  const [loadingPitches, setLoadingPitches] = useState(false);
  const [selectedPitch, setSelectedPitch] = useState(null);
  const [showPitchDetails, setShowPitchDetails] = useState(false);

  // Step 1: Basic Info
  const [basicInfo, setBasicInfo] = useState({
    startupName: '',
    oneLinePitch: '',
    category: '',
    startupStage: '',
    founderName: '',
    city: '',
    state: '',
    problemStatement: '',
    solutionDescription: ''
  });

  // Step 2: Documents
  const [documents, setDocuments] = useState({
    pitchDeck: null,
    executiveSummary: null,
    financials: null
  });

  const [documentErrors, setDocumentErrors] = useState({});

  // Categories for dropdown
  const categories = [
    'Technology',
    'Healthcare',
    'Education',
    'Finance',
    'E-commerce',
    'Food & Beverage',
    'Real Estate',
    'Transportation',
    'Energy',
    'Agriculture',
    'Entertainment',
    'Other'
  ];

  // States for dropdown
  const startupStages = ['Idea', 'Prototype', 'MVP', 'Revenue'];

  // Indian States
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir',
    'Ladakh', 'Puducherry', 'Andaman and Nicobar Islands', 'Chandigarh',
    'Dadra and Nagar Haveli and Daman and Diu', 'Lakshadweep'
  ];

  // Check authentication
  React.useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Load user's pitches for history
  useEffect(() => {
    const loadPitches = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        setLoadingPitches(true);
        const response = await pitchAPI.getMyPitches(token);
        if (response.success) {
          setMyPitches(response.data || []);
        }
      } catch (error) {
        console.error('Error loading pitches:', error);
      } finally {
        setLoadingPitches(false);
      }
    };

    if (isAuthenticated() && showHistory) {
      loadPitches();
    }
  }, [isAuthenticated, showHistory]);

  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDocumentChange = (e, docType) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setDocumentErrors(prev => ({
        ...prev,
        [docType]: 'File size must be less than 10MB'
      }));
      return;
    }

    // Validate file type
    let allowedTypes = [];
    if (docType === 'pitchDeck') {
      allowedTypes = ['application/pdf'];
    } else if (docType === 'executiveSummary') {
      allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    } else if (docType === 'financials') {
      allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    }

    if (!allowedTypes.includes(file.type)) {
      setDocumentErrors(prev => ({
        ...prev,
        [docType]: docType === 'pitchDeck' ? 'Only PDF files are allowed' : 'Only PDF, Word, or Excel files are allowed'
      }));
      return;
    }

    setDocuments(prev => ({
      ...prev,
      [docType]: file
    }));

    // Clear error
    setDocumentErrors(prev => ({
      ...prev,
      [docType]: ''
    }));
  };

  const validateStep1 = () => {
    const required = ['startupName', 'oneLinePitch', 'category', 'startupStage', 'founderName', 'city', 'state', 'problemStatement', 'solutionDescription'];
    for (const field of required) {
      if (!basicInfo[field] || basicInfo[field].trim() === '') {
        setError(`${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} is required`);
        return false;
      }
    }
    return true;
  };

  const validateStep2 = () => {
    if (!documents.pitchDeck) {
      setError('Pitch deck (PDF) is required');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setError('');
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
      }
    } else if (step === 2) {
      if (validateStep2()) {
        setStep(3);
      }
    }
  };

  const handleBack = () => {
    setError('');
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setError('');
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const formData = {
        ...basicInfo,
        pitchDeck: documents.pitchDeck,
        executiveSummary: documents.executiveSummary,
        financials: documents.financials
      };

      const response = await pitchAPI.submitPitch(token, formData);

      if (response.success) {
        alert('Pitch submitted successfully! We will review it and get back to you soon.');
        navigate('/profile');
      } else {
        setError(response.message || 'Failed to submit pitch. Please try again.');
      }
    } catch (err) {
      console.error('Submit pitch error:', err);
      setError(err.message || 'Failed to submit pitch. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  // Step 1: Basic Info
  const renderStep1 = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Startup Name *
        </label>
        <input
          type="text"
          name="startupName"
          value={basicInfo.startupName}
          onChange={handleBasicInfoChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="Enter your startup name"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          One-line Pitch (Tagline) *
        </label>
        <input
          type="text"
          name="oneLinePitch"
          value={basicInfo.oneLinePitch}
          onChange={handleBasicInfoChange}
          required
          maxLength={200}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="A short tagline describing your startup"
        />
        <p className="text-xs text-gray-500 mt-1">{basicInfo.oneLinePitch.length}/200</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Category *
          </label>
          <select
            name="category"
            value={basicInfo.category}
            onChange={handleBasicInfoChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Startup Stage *
          </label>
          <select
            name="startupStage"
            value={basicInfo.startupStage}
            onChange={handleBasicInfoChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">Select Stage</option>
            {startupStages.map(stage => (
              <option key={stage} value={stage}>{stage}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Founder Name *
        </label>
        <input
          type="text"
          name="founderName"
          value={basicInfo.founderName}
          onChange={handleBasicInfoChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="Enter founder name"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            City *
          </label>
          <input
            type="text"
            name="city"
            value={basicInfo.city}
            onChange={handleBasicInfoChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Enter city"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            State *
          </label>
          <select
            name="state"
            value={basicInfo.state}
            onChange={handleBasicInfoChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">Select State</option>
            {indianStates.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Short Problem Statement *
        </label>
        <textarea
          name="problemStatement"
          value={basicInfo.problemStatement}
          onChange={handleBasicInfoChange}
          required
          maxLength={1000}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
          placeholder="Describe the problem your startup is solving..."
        />
        <p className="text-xs text-gray-500 mt-1">{basicInfo.problemStatement.length}/1000</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Short Solution Description *
        </label>
        <textarea
          name="solutionDescription"
          value={basicInfo.solutionDescription}
          onChange={handleBasicInfoChange}
          required
          maxLength={1000}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
          placeholder="Describe your solution..."
        />
        <p className="text-xs text-gray-500 mt-1">{basicInfo.solutionDescription.length}/1000</p>
      </div>
    </div>
  );

  // Step 2: Document Upload
  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Pitch Deck (PDF) * <span className="text-red-500">Required</span>
        </label>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => handleDocumentChange(e, 'pitchDeck')}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
        {documents.pitchDeck && (
          <p className="text-sm text-green-600 mt-2">
            ✓ {documents.pitchDeck.name} ({formatFileSize(documents.pitchDeck.size)})
          </p>
        )}
        {documentErrors.pitchDeck && (
          <p className="text-sm text-red-600 mt-2">{documentErrors.pitchDeck}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">Maximum file size: 10MB</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Executive Summary (PDF/DOCX) <span className="text-gray-500">Optional</span>
        </label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => handleDocumentChange(e, 'executiveSummary')}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
        {documents.executiveSummary && (
          <p className="text-sm text-green-600 mt-2">
            ✓ {documents.executiveSummary.name} ({formatFileSize(documents.executiveSummary.size)})
          </p>
        )}
        {documentErrors.executiveSummary && (
          <p className="text-sm text-red-600 mt-2">{documentErrors.executiveSummary}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">Maximum file size: 10MB</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Financials (Excel/PDF) <span className="text-gray-500">Optional</span>
        </label>
        <input
          type="file"
          accept=".pdf,.xls,.xlsx"
          onChange={(e) => handleDocumentChange(e, 'financials')}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
        {documents.financials && (
          <p className="text-sm text-green-600 mt-2">
            ✓ {documents.financials.name} ({formatFileSize(documents.financials.size)})
          </p>
        )}
        {documentErrors.financials && (
          <p className="text-sm text-red-600 mt-2">{documentErrors.financials}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">Maximum file size: 10MB</p>
      </div>
    </div>
  );

  // Step 3: Preview & Submit
  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Preview Your Pitch</h3>
        
        <div>
          <h4 className="font-semibold text-gray-700">Startup Name:</h4>
          <p className="text-gray-600">{basicInfo.startupName}</p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-700">One-line Pitch:</h4>
          <p className="text-gray-600">{basicInfo.oneLinePitch}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-gray-700">Category:</h4>
            <p className="text-gray-600">{basicInfo.category}</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700">Stage:</h4>
            <p className="text-gray-600">{basicInfo.startupStage}</p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-700">Founder:</h4>
          <p className="text-gray-600">{basicInfo.founderName}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-gray-700">City:</h4>
            <p className="text-gray-600">{basicInfo.city}</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700">State:</h4>
            <p className="text-gray-600">{basicInfo.state}</p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-700">Problem Statement:</h4>
          <p className="text-gray-600">{basicInfo.problemStatement}</p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-700">Solution Description:</h4>
          <p className="text-gray-600">{basicInfo.solutionDescription}</p>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <h4 className="font-semibold text-gray-700 mb-2">Documents:</h4>
          <ul className="space-y-2">
            <li className="text-gray-600">✓ Pitch Deck: {documents.pitchDeck?.name || 'Not uploaded'}</li>
            {documents.executiveSummary && (
              <li className="text-gray-600">✓ Executive Summary: {documents.executiveSummary.name}</li>
            )}
            {documents.financials && (
              <li className="text-gray-600">✓ Financials: {documents.financials.name}</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Submit Your Pitch</h1>
              <p className="text-sm text-gray-600 mt-1">Step {step} of 3</p>
            </div>
            <div className="flex items-center gap-2">
              {/* History Icon */}
              <button
                onClick={() => setShowHistory(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="View Pitch History"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              {/* Close Button */}
              <button
                onClick={() => {
                  // Navigate to home page instead of going back
                  navigate('/');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="relative flex justify-between mb-8">
          {/* Connecting Line Background */}
          <div className="absolute left-0 top-5 w-full h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
          {/* Connecting Line Active */}
          <div 
            className="absolute left-0 top-5 h-1 bg-orange-500 -translate-y-1/2 z-0 transition-all duration-300" 
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          ></div>

          {[
            { id: 1, label: 'Basic Info' },
            { id: 2, label: 'Documents' },
            { id: 3, label: 'Submit' }
          ].map((s) => (
            <div key={s.id} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                  step >= s.id
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                    : 'bg-white border-2 border-gray-200 text-gray-500'
                }`}
              >
                {s.id}
              </div>
              <span className={`text-xs mt-2 text-center absolute top-12 whitespace-nowrap ${step >= s.id ? 'text-orange-500 font-semibold' : 'text-gray-500'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Form Content */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                step === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Back
            </button>

            {step < 3 ? (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-colors ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Pitch'}
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* History Modal - Full Page */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 bg-white z-50 overflow-y-auto"
          >
            {/* Full Page Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 shadow-sm px-4 py-4 z-10">
              <div className="max-w-4xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowHistory(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h2 className="text-2xl font-bold text-gray-800">My Pitch History</h2>
                </div>
                <button
                  onClick={() => setShowHistory(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Full Page Content */}
            <div className="max-w-4xl mx-auto px-4 py-6">
                {loadingPitches ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                  </div>
                ) : myPitches.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-500 text-lg font-medium">No pitches submitted yet</p>
                    <p className="text-gray-400 text-sm mt-2">Submit your first pitch to see it here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myPitches.map((pitch) => (
                      <div key={pitch._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-800 mb-1">{pitch.startupName}</h3>
                            <p className="text-sm text-gray-600 mb-2">{pitch.oneLinePitch}</p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                pitch.status === 'Approved' ? 'bg-green-100 text-green-700 border border-green-200' :
                                pitch.status === 'Rejected' ? 'bg-red-100 text-red-700 border border-red-200' :
                                pitch.status === 'More Details Required' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                                'bg-blue-100 text-blue-700 border border-blue-200'
                              }`}>
                                {pitch.status}
                              </span>
                              {pitch.pitchId && (
                                <span className="text-xs text-gray-500">ID: {pitch.pitchId}</span>
                              )}
                              <span className="text-xs text-gray-500">
                                {new Date(pitch.submittedAt || pitch.createdAt).toLocaleDateString('en-IN', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Status Messages */}
                        {pitch.status === 'Approved' && (
                          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-800 font-medium flex items-center gap-2">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Approved! We will contact you within 48 hours.
                            </p>
                          </div>
                        )}

                        {pitch.status === 'Rejected' && pitch.rejectionReason && (
                          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-800 font-medium mb-1">Rejection Reason:</p>
                            <p className="text-sm text-red-700">{pitch.rejectionReason}</p>
                          </div>
                        )}

                        {pitch.status === 'More Details Required' && (
                          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-800 font-medium">
                              More details are required. Please check your email for instructions.
                            </p>
                          </div>
                        )}

                        {/* Pitch Details */}
                        <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-500">Category:</span>
                            <span className="text-gray-800 font-medium ml-2">{pitch.category}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Stage:</span>
                            <span className="text-gray-800 font-medium ml-2">{pitch.startupStage}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Founder:</span>
                            <span className="text-gray-800 font-medium ml-2">{pitch.founderName}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Location:</span>
                            <span className="text-gray-800 font-medium ml-2">{pitch.city}, {pitch.state}</span>
                          </div>
                        </div>

                        {/* Details Button */}
                        <div className="mt-4 pt-3 border-t border-gray-200">
                          <button
                            onClick={async () => {
                              try {
                                const token = localStorage.getItem('token');
                                if (token) {
                                  // Fetch full pitch details
                                  const response = await pitchAPI.getPitchById(token, pitch._id);
                                  if (response.success) {
                                    setSelectedPitch(response.data);
                                    setShowPitchDetails(true);
                                  } else {
                                    // Fallback to existing pitch data
                                    setSelectedPitch(pitch);
                                    setShowPitchDetails(true);
                                  }
                                } else {
                                  setSelectedPitch(pitch);
                                  setShowPitchDetails(true);
                                }
                              } catch (error) {
                                console.error('Error loading pitch details:', error);
                                // Fallback to existing pitch data
                                setSelectedPitch(pitch);
                                setShowPitchDetails(true);
                              }
                            }}
                            className="w-full px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-colors flex items-center justify-center gap-2"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            View Full Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pitch Details Modal - Full Page */}
      <AnimatePresence>
        {showPitchDetails && selectedPitch && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 bg-white z-[60] overflow-y-auto"
          >
            {/* Full Page Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 shadow-sm px-4 py-4 z-10">
              <div className="max-w-4xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowPitchDetails(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h2 className="text-2xl font-bold text-gray-800">Pitch Details</h2>
                </div>
                <button
                  onClick={() => setShowPitchDetails(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Full Page Content */}
            <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
                {/* Basic Info */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Pitch ID</label>
                      <p className="text-gray-800 mt-1">{selectedPitch.pitchId || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Status</label>
                      <p className="mt-1">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          selectedPitch.status === 'Approved' ? 'bg-green-100 text-green-700 border border-green-200' :
                          selectedPitch.status === 'Rejected' ? 'bg-red-100 text-red-700 border border-red-200' :
                          selectedPitch.status === 'More Details Required' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                          'bg-blue-100 text-blue-700 border border-blue-200'
                        }`}>
                          {selectedPitch.status}
                        </span>
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Startup Name</label>
                      <p className="text-gray-800 mt-1">{selectedPitch.startupName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">One-line Pitch</label>
                      <p className="text-gray-800 mt-1">{selectedPitch.oneLinePitch}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Category</label>
                      <p className="text-gray-800 mt-1">{selectedPitch.category}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Startup Stage</label>
                      <p className="text-gray-800 mt-1">{selectedPitch.startupStage}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Founder Name</label>
                      <p className="text-gray-800 mt-1">{selectedPitch.founderName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Location</label>
                      <p className="text-gray-800 mt-1">{selectedPitch.city}, {selectedPitch.state}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Submitted On</label>
                      <p className="text-gray-800 mt-1">
                        {new Date(selectedPitch.submittedAt || selectedPitch.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Problem Statement */}
                <div>
                  <label className="text-sm font-semibold text-gray-700">Problem Statement</label>
                  <p className="text-gray-800 mt-2 bg-gray-50 p-4 rounded-lg">{selectedPitch.problemStatement}</p>
                </div>

                {/* Solution Description */}
                <div>
                  <label className="text-sm font-semibold text-gray-700">Solution Description</label>
                  <p className="text-gray-800 mt-2 bg-gray-50 p-4 rounded-lg">{selectedPitch.solutionDescription}</p>
                </div>

                {/* Documents */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Documents</h3>
                  <div className="space-y-3">
                    {selectedPitch.documents?.pitchDeck?.fileId && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          <div>
                            <p className="font-medium text-gray-800">Pitch Deck</p>
                            <p className="text-sm text-gray-600">{selectedPitch.documents.pitchDeck.fileName || 'pitch-deck.pdf'}</p>
                          </div>
                        </div>
                        <button
                          onClick={async () => {
                            try {
                              const token = localStorage.getItem('token');
                              if (!token) {
                                alert('Please login to download files');
                                return;
                              }
                              
                              const fileName = selectedPitch.documents.pitchDeck.fileName || 'pitch-deck.pdf';
                              
                              // Download from backend (GridFS)
                              const response = await pitchAPI.downloadPitchDocument(token, selectedPitch._id, 'pitchDeck');
                              const blob = await response.blob();
                              
                              // Create download link
                              const link = document.createElement('a');
                              const blobUrl = window.URL.createObjectURL(blob);
                              link.href = blobUrl;
                              link.download = fileName;
                              link.style.display = 'none';
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                              
                              // Clean up
                              setTimeout(() => {
                                window.URL.revokeObjectURL(blobUrl);
                              }, 100);
                            } catch (error) {
                              console.error('Download error:', error);
                              const errorMessage = error.message || 'Failed to download file. Please try again.';
                              alert(errorMessage);
                            }
                          }}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold"
                        >
                          Download
                        </button>
                      </div>
                    )}
                    {selectedPitch.documents?.executiveSummary?.fileId && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          <div>
                            <p className="font-medium text-gray-800">Executive Summary</p>
                            <p className="text-sm text-gray-600">{selectedPitch.documents.executiveSummary.fileName || 'executive-summary.pdf'}</p>
                          </div>
                        </div>
                        <button
                          onClick={async () => {
                            try {
                              const token = localStorage.getItem('token');
                              if (!token) {
                                alert('Please login to download files');
                                return;
                              }
                              
                              const fileName = selectedPitch.documents.executiveSummary.fileName || 'executive-summary.pdf';
                              
                              // Download from backend (GridFS)
                              const response = await pitchAPI.downloadPitchDocument(token, selectedPitch._id, 'executiveSummary');
                              const blob = await response.blob();
                              
                              // Create download link
                              const link = document.createElement('a');
                              const blobUrl = window.URL.createObjectURL(blob);
                              link.href = blobUrl;
                              link.download = fileName;
                              link.style.display = 'none';
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                              
                              // Clean up
                              setTimeout(() => {
                                window.URL.revokeObjectURL(blobUrl);
                              }, 100);
                            } catch (error) {
                              console.error('Download error:', error);
                              const errorMessage = error.message || 'Failed to download file. Please try again.';
                              alert(errorMessage);
                            }
                          }}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold"
                        >
                          Download
                        </button>
                      </div>
                    )}
                    {selectedPitch.documents?.financials?.fileId && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          <div>
                            <p className="font-medium text-gray-800">Financials</p>
                            <p className="text-sm text-gray-600">{selectedPitch.documents.financials.fileName || 'financials.xlsx'}</p>
                          </div>
                        </div>
                        <button
                          onClick={async () => {
                            try {
                              const token = localStorage.getItem('token');
                              if (!token) {
                                alert('Please login to download files');
                                return;
                              }
                              
                              const fileName = selectedPitch.documents.financials.fileName || 'financials.xlsx';
                              
                              // Download from backend (GridFS)
                              const response = await pitchAPI.downloadPitchDocument(token, selectedPitch._id, 'financials');
                              const blob = await response.blob();
                              
                              // Create download link
                              const link = document.createElement('a');
                              const blobUrl = window.URL.createObjectURL(blob);
                              link.href = blobUrl;
                              link.download = fileName;
                              link.style.display = 'none';
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                              
                              // Clean up
                              setTimeout(() => {
                                window.URL.revokeObjectURL(blobUrl);
                              }, 100);
                            } catch (error) {
                              console.error('Download error:', error);
                              const errorMessage = error.message || 'Failed to download file. Please try again.';
                              alert(errorMessage);
                            }
                          }}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold"
                        >
                          Download
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Messages */}
                {selectedPitch.status === 'Approved' && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800 font-medium flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Approved! We will contact you within 48 hours.
                    </p>
                  </div>
                )}

                {selectedPitch.status === 'Rejected' && selectedPitch.rejectionReason && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800 font-medium mb-1">Rejection Reason:</p>
                    <p className="text-sm text-red-700">{selectedPitch.rejectionReason}</p>
                  </div>
                )}

                {selectedPitch.status === 'More Details Required' && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800 font-medium">
                      More details are required. Please check your email for instructions.
                    </p>
                  </div>
                )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubmitPitchPage;

