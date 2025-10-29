import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../../assets/logo.png';

// Icons
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const MyBookingsPage = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const bookings = [
    {
      id: 1,
      mentorName: 'Sarah Johnson',
      mentorTitle: 'Senior Business Consultant',
      mentorImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      sessionType: '50-60 minutes',
      amount: 300,
      status: 'confirmed',
      date: '2024-01-20',
      time: '10:00 AM',
      message: 'Business strategy consultation for my startup',
      specialties: ['Startup Strategy', 'Business Planning']
    },
    {
      id: 2,
      mentorName: 'Michael Chen',
      mentorTitle: 'Full Stack Developer',
      mentorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      sessionType: '20-25 minutes',
      amount: 150,
      status: 'pending',
      date: '2024-01-22',
      time: '2:00 PM',
      message: 'Code review and technical guidance',
      specialties: ['React', 'Node.js']
    },
    {
      id: 3,
      mentorName: 'Emily Rodriguez',
      mentorTitle: 'Career Coach',
      mentorImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      sessionType: '90-120 minutes',
      amount: 450,
      status: 'completed',
      date: '2024-01-15',
      time: '3:00 PM',
      message: 'Career transition and resume building',
      specialties: ['Career Development', 'Resume Writing']
    }
  ];

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'all') return true;
    return booking.status === activeTab;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <ClockIcon />;
      case 'confirmed':
        return <CheckIcon />;
      case 'completed':
        return <CheckIcon />;
      default:
        return <ClockIcon />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'confirmed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'completed':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
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
            <div className="flex items-center">
              <img src={logo} alt="Logo" className="h-8 w-auto" />
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
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
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
                  <Link to="/mentors/my-bookings" className="block py-3 px-4 rounded-lg hover:bg-gray-100 text-gray-700 font-medium">My Bookings</Link>
                </div>
              </div>
            </motion.div>
            <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
          </div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="px-4 pt-6 pb-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">Track your mentor sessions and bookings</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: 'Total Bookings', value: bookings.length, color: 'blue' },
            { label: 'Upcoming', value: bookings.filter(b => b.status === 'confirmed').length, color: 'green' },
            { label: 'Pending', value: bookings.filter(b => b.status === 'pending').length, color: 'yellow' },
            { label: 'Completed', value: bookings.filter(b => b.status === 'completed').length, color: 'purple' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={scaleIn}
              className={`bg-white rounded-xl p-4 shadow-lg border-2 border-gray-100 text-center`}
            >
              <div className={`text-2xl font-bold text-${stat.color}-600 mb-1`}>{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100 mb-6"
        >
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { id: 'all', label: 'All Bookings' },
              { id: 'confirmed', label: 'Upcoming' },
              { id: 'pending', label: 'Pending' },
              { id: 'completed', label: 'Completed' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Bookings List */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-4"
          >
            {filteredBookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                variants={scaleIn}
                className="bg-gray-50 rounded-xl p-6 border-2 border-gray-100"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                  {/* Booking Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <img
                        src={booking.mentorImage}
                        alt={booking.mentorName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{booking.mentorName}</h3>
                        <p className="text-gray-600">{booking.mentorTitle}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
                        <span className="flex items-center space-x-1">
                          {getStatusIcon(booking.status)}
                          <span className="capitalize">{booking.status}</span>
                        </span>
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Session:</span> {booking.sessionType}
                      </div>
                      <div>
                        <span className="font-medium">Date:</span> {booking.date} at {booking.time}
                      </div>
                      <div>
                        <span className="font-medium">Amount:</span> ₹{booking.amount}
                      </div>
                      <div>
                        <span className="font-medium">Message:</span> {booking.message}
                      </div>
                    </div>

                    <div className="mt-3">
                      <span className="font-medium text-gray-900">Specialties:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {booking.specialties.map((specialty, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {booking.status === 'confirmed' && (
                    <div className="flex flex-col space-y-2 md:ml-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Join Session
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Reschedule
                      </motion.button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {filteredBookings.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-500 text-lg">No bookings found</div>
              <p className="text-gray-400 mt-2">Your bookings will appear here</p>
              <Link
                to="/mentors"
                className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Mentors
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MyBookingsPage;
