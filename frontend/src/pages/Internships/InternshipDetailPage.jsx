import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { internshipAPI } from '../../utils/api';
import logo from '../../assets/logo.png';

// Bottom Nav Icons
const HomeIcon = ({ active }) => (<svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-indigo-600' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>);
const BriefcaseIcon = ({ active }) => (<svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-indigo-600' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>);
const ChatIcon = ({ active }) => (<svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-indigo-600' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>);
const PlusIcon = ({ active }) => (<svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-white' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>);
const UserIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6 text-gray-400"} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>);
const BellIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>);

// Job Detail Icons
const WalletIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>);
const LocationIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>);
const BriefcaseIconDetail = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>);
const ClockIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const LightningIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>);
const SparkleIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 20l-2.286-6.857L5 12l5.714-2.143L13 4z" /></svg>);

const InternshipDetailPage = () => {
  const { internshipId } = useParams();
  const navigate = useNavigate();
  const [internship, setInternship] = useState(null);
  const [similarInternships, setSimilarInternships] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInternship = async () => {
      try {
        setIsLoading(true);
        const response = await internshipAPI.getById(internshipId);
        if (response.success && response.data.internship) {
          const internshipData = response.data.internship;
          setInternship(internshipData);

          // Load similar internships based on category
          if (internshipData.category) {
            try {
              const similarResponse = await internshipAPI.getAll({
                category: internshipData.category,
                limit: 10
              });
              if (similarResponse.success && similarResponse.data.internships) {
                // Filter out current internship and normalize data
                const similar = similarResponse.data.internships
                  .filter(i => i._id !== internshipId)
                  .slice(0, 3)
                  .map(i => ({
                    ...i,
                    id: i._id || i.id,
                    company: i.companyName || i.company?.companyName || 'Company',
                    stipend: i.stipend || 'Not specified'
                  }));
                setSimilarInternships(similar);
              }
            } catch (error) {
              console.error('Error loading similar internships:', error);
              setSimilarInternships([]);
            }
          }
        } else {
          setInternship(null);
        }
      } catch (error) {
        console.error('Error loading internship:', error);
        setInternship(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadInternship();
  }, [internshipId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!internship) {
    return <div className="text-center py-10">Internship not found.</div>;
  }

  // Normalize data structure for display
  const internshipData = internship._id ? {
    ...internship,
    id: internship._id,
    company: internship.companyName || internship.company?.companyName || 'Company',
    stipendPerMonth: internship.stipendPerMonth || '/month',
    postedDate: internship.postedDateFormatted || internship.createdAt ? new Date(internship.createdAt).toLocaleDateString() : 'Recently',
    responsibilities: internship.responsibilities || [],
    skills: internship.skills || [],
    perks: internship.perks || [],
    requirements: Array.isArray(internship.requirements) ? internship.requirements : (internship.requirements ? [internship.requirements] : [])
  } : internship;

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

  return (
    <div className="min-h-screen bg-gray-50 pb-32 md:bg-gradient-to-br md:from-gray-50 md:via-blue-50 md:to-indigo-50">
      {/* Mobile Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-40 md:hidden bg-white px-4 py-3 flex justify-between items-center border-b border-gray-200"
      >
        <h1 className="text-sm font-medium text-gray-800">Applying to {internship.title} internship</h1>
        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 hover:text-gray-800"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </motion.header>

      {/* Desktop Header - Removed to avoid duplication with main Navbar */}

      {/* Main Content */}
      <div className="bg-white px-4 py-4 md:px-8 md:py-8">
        {/* Desktop Layout */}
        <div className="hidden md:block max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Job Overview */}
              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{internship.title}</h1>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xl font-semibold text-gray-700">{internshipData.company}</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                        Actively hiring
                      </span>
                    </div>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-2xl text-white shadow-lg">
                    {internship.icon}
                  </div>
                </div>

                {/* Key Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <span className="text-2xl">💰</span>
                    <div>
                      <p className="text-sm text-gray-500">Stipend</p>
                      <p className="font-semibold text-gray-900">{internship.stipend}{internship.stipendPerMonth}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <span className="text-2xl">📍</span>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-semibold text-gray-900">{internship.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <span className="text-2xl">💼</span>
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-semibold text-gray-900">{internship.duration} experience</p>
                    </div>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <div className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-800 rounded-full">
                    <span className="text-lg">⏰</span>
                    <span className="text-sm font-medium">{internship.postedDate}</span>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-2 bg-yellow-100 text-yellow-800 rounded-full">
                    <span className="text-lg">⚡</span>
                    <span className="text-sm font-medium">Be an early applicant</span>
                  </div>

                  <div className="px-3 py-2 bg-gray-100 text-gray-800 rounded-full">
                    <span className="text-sm font-medium">Internship</span>
                  </div>
                </div>

                {/* Vacancies */}
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-1">Number of Openings</p>
                  <p className="text-lg text-gray-900 font-semibold">{internship.openings}</p>
                </div>
              </div>

              {/* About the Job Section */}
              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">About the Job</h2>
                  <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                    <span className="text-sm">✨</span>
                    <span className="text-sm font-medium">Summarized by AI</span>
                  </div>
                </div>

                {/* About the Role - combined */}
                <div className="mb-6">
                  <p className="text-gray-700 leading-relaxed">{internshipData.description || 'No description available.'}</p>
                </div>

                {/* Requirements Section */}
                {internshipData.requirements && internshipData.requirements.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Required Documents</h4>
                    <ul className="space-y-2">
                      {internshipData.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          <span className="text-gray-700">{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Responsibilities Section */}
                {internshipData.responsibilities && internshipData.responsibilities.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Responsibilities</h4>
                    <ul className="space-y-2">
                      {internshipData.responsibilities.map((responsibility, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          <span className="text-gray-700">{responsibility}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Salary Breakup Section */}
              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Salary Breakdown</h2>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Monthly Stipend</p>
                      <p className="text-2xl font-bold text-gray-900">{internship.stipend}{internship.stipendPerMonth}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">💰</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Quick Apply Card */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 sticky top-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Ready to Apply?</h3>
                <p className="text-gray-600 mb-6">Join thousands of students who have found their dream internships through our platform.</p>

                <button
                  onClick={() => navigate(`/internships/${internshipId}/apply`)}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl mb-4"
                >
                  Apply Now
                </button>

                <div className="text-center text-sm text-gray-500">
                  <p>Quick application • Resume upload • Instant confirmation</p>
                </div>
              </div>

              {/* Company Info Card */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">About {internshipData.company}</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🏢</span>
                    <span className="text-gray-700">{internshipData.company}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg">📍</span>
                    <span className="text-gray-700">{internship.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg">💼</span>
                    <span className="text-gray-700">{internship.category}</span>
                  </div>
                </div>
              </div>

              {/* Similar Internships */}
              {similarInternships.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Similar Internships</h3>
                  <div className="space-y-4">
                    {similarInternships.map((similarInternship) => (
                      <Link
                        key={similarInternship.id}
                        to={`/internships/${similarInternship.id}`}
                        className="block border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <h4 className="font-semibold text-gray-900 mb-1">{similarInternship.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{similarInternship.company}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>📍</span>
                          <span>{similarInternship.location}</span>
                          <span>•</span>
                          <span>{similarInternship.stipend}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* Job Title and Company */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="mb-4"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-lg font-semibold text-gray-900 mb-2"
            >
              {internship.title}
            </motion.h1>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-gray-700 font-medium">{internshipData.company}</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                Actively hiring
              </span>
            </div>
          </motion.div>

          {/* Key Details */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-3 mb-4"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">💰</span>
              <span className="text-gray-700">{internship.stipend}{internship.stipendPerMonth}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-2xl">📍</span>
              <span className="text-gray-700">{internship.location}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-2xl">💼</span>
              <span className="text-gray-700">{internship.duration} experience</span>
            </div>
          </motion.div>

          {/* Status Badges */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-wrap gap-2 mb-4"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">⏰</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                {internship.postedDate}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-lg">⚡</span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                Be an early applicant
              </span>
            </div>

            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
              Internship
            </span>
          </motion.div>

          {/* Vacancies */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="mb-6"
          >
            <p className="text-xs text-gray-600 mb-1">Number of Openings</p>
            <p className="text-base text-gray-900 font-semibold">{internship.openings}</p>
          </motion.div>

          {/* About the Job Section */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="mb-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-lg font-semibold text-gray-900">About the job</h2>
              <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                <span className="text-sm">✨</span>
                <span>Summarized by AI</span>
              </div>
            </div>

            {/* About the Role - combined */}
            <div className="mb-4">
              <p className="text-sm text-gray-700 leading-relaxed">{internshipData.description || 'No description available.'}</p>
            </div>

            {/* Requirements Section */}
            {internshipData.requirements && internshipData.requirements.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Required Documents</h4>
                <ul className="space-y-2">
                  {internshipData.requirements.slice(0, 5).map((requirement, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      <span className="text-sm text-gray-700">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Responsibilities Section */}
            {internshipData.responsibilities && internshipData.responsibilities.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Responsibilities</h4>
                <ul className="space-y-2">
                  {internshipData.responsibilities.slice(0, 5).map((responsibility, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      <span className="text-sm text-gray-700">{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>

          {/* Salary Breakup Section */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="mb-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Salary breakup</h2>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-700">
                Monthly Stipend: {internship.stipend}{internship.stipendPerMonth}
              </p>
            </div>
          </motion.div>

          {/* Premium Apply Button */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="mb-6"
          >
            <motion.button
              whileHover={{
                scale: 1.02,
                boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)",
                y: -2
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/internships/${internshipId}/apply`)}
              className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
            >
              {/* Animated background effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />

              {/* Button content */}
              <div className="relative z-10 flex items-center justify-center gap-2">
                <motion.span
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                  className="text-xl"
                >
                  ⚡
                </motion.span>
                <span>Apply Now</span>
                <motion.svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ x: [0, 5, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity
                  }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </motion.svg>
              </div>

              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
                animate={{ x: ["-100%", "100%"] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              />
            </motion.button>

            {/* Additional info */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center text-sm text-gray-500 mt-2"
            >
              Quick application • Resume upload • Instant confirmation
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <footer className="fixed bottom-0 left-0 right-0 w-full bg-white/90 backdrop-blur-lg rounded-t-3xl shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)] border-t border-gray-200 z-50 md:hidden">
        <nav className="flex justify-around items-center h-16 px-1">
          <Link to="/" className="flex flex-col items-center justify-center text-gray-500 flex-1">
            <HomeIcon active={false} />
            <span className="text-[10px]">Home</span>
          </Link>
          <Link to="/loans" className="flex flex-col items-center justify-center text-gray-500 flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            <span className="text-[10px]">Loans</span>
          </Link>
          <Link to="/internships" className="flex flex-col items-center justify-center text-indigo-600 flex-1">
            <BriefcaseIcon active={true} />
            <span className="text-[10px] font-bold">Internships</span>
          </Link>
          <Link to="/legal" className="flex flex-col items-center justify-center text-gray-500 flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
            <span className="text-[10px]">Legal</span>
          </Link>
          <Link to="/mentors" className="flex flex-col items-center justify-center text-gray-500 flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            <span className="text-[10px]">Mentors</span>
          </Link>
        </nav>
      </footer>
    </div>
  );
};

export default InternshipDetailPage;

