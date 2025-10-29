import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { mentorAPI } from '../../utils/api';
import BottomNavbar from '../../components/common/BottomNavbar';
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

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const MentorDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    completed: 0
  });

  // Fetch bookings on mount
  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('mentorToken');
        if (!token) {
          navigate('/mentors/login');
          return;
        }

        const response = await mentorAPI.getMentorBookings(token, { status: activeTab === 'all' ? '' : activeTab });
        if (response.success) {
          setBookings(response.data || []);
          if (response.stats) {
            setStats(response.stats);
          }
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [activeTab, navigate]);

  const handleAcceptBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem('mentorToken');
      if (!token) {
        navigate('/mentors/login');
        return;
      }

      const response = await mentorAPI.updateBookingStatus(token, bookingId, 'accepted');
      if (response.success) {
        // Refresh bookings
        const updatedResponse = await mentorAPI.getMentorBookings(token, { status: activeTab === 'all' ? '' : activeTab });
        if (updatedResponse.success) {
          setBookings(updatedResponse.data || []);
          if (updatedResponse.stats) {
            setStats(updatedResponse.stats);
          }
        }
        alert('Booking accepted successfully!');
      }
    } catch (error) {
      console.error('Error accepting booking:', error);
      alert(error.message || 'Failed to accept booking');
    }
  };

  const handleRejectBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to reject this booking?')) {
      return;
    }

    try {
      const token = localStorage.getItem('mentorToken');
      if (!token) {
        navigate('/mentors/login');
        return;
      }

      const response = await mentorAPI.updateBookingStatus(token, bookingId, 'rejected');
      if (response.success) {
        // Refresh bookings
        const updatedResponse = await mentorAPI.getMentorBookings(token, { status: activeTab === 'all' ? '' : activeTab });
        if (updatedResponse.success) {
          setBookings(updatedResponse.data || []);
          if (updatedResponse.stats) {
            setStats(updatedResponse.stats);
          }
        }
        alert('Booking rejected successfully!');
      }
    } catch (error) {
      console.error('Error rejecting booking:', error);
      alert(error.message || 'Failed to reject booking');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('mentorToken');
    localStorage.removeItem('isMentorLoggedIn');
    localStorage.removeItem('userType');
    localStorage.removeItem('mentorData');
    navigate('/mentors/login');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <ClockIcon />;
      case 'accepted':
        return <CheckIcon />;
      case 'completed':
        return <CheckIcon />;
      case 'rejected':
        return <XIcon />;
      default:
        return <ClockIcon />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'accepted':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'completed':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'rejected':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const filteredBookings = activeTab === 'all' ? bookings : bookings.filter(booking => booking.status === activeTab);

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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50/30 to-orange-50">
      {/* Mobile Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="md:hidden bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 sticky top-0 z-50 shadow-lg"
      >
        <div className="flex items-center justify-between">
          <Link to="/mentors" className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="h-8 w-auto" />
            <span className="text-lg font-bold">Mentor Dashboard</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Link
              to="/mentors/profile"
              className="px-3 py-1.5 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors text-sm font-medium"
            >
              Profile
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-lg hover:bg-white/20 transition-colors"
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Desktop Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden md:block bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/mentors" className="flex items-center space-x-3">
              <img src={logo} alt="Logo" className="h-8 w-auto" />
              <span className="text-xl font-bold text-gray-900">Mentor Dashboard</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                to="/mentors/profile"
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
              >
                Edit Profile
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex md:hidden">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="w-64 bg-white h-full shadow-xl"
            >
              <div className="p-6">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mb-6 p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XIcon />
                </button>
                <div className="space-y-2">
                  <Link
                    to="/mentors/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-3 px-4 rounded-lg hover:bg-gray-100 text-gray-700 font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/mentors/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-3 px-4 rounded-lg hover:bg-gray-100 text-gray-700 font-medium"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left py-3 px-4 rounded-lg hover:bg-gray-100 text-red-600 font-medium"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </motion.div>
            <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
          </div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 md:pb-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Mentor Dashboard</h1>
          <p className="text-gray-600">Manage your bookings and mentor sessions</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: 'Total Bookings', value: stats.total, color: 'blue' },
            { label: 'Pending', value: stats.pending, color: 'yellow' },
            { label: 'Accepted', value: stats.accepted, color: 'green' },
            { label: 'Completed', value: stats.completed, color: 'purple' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={scaleIn}
              className="bg-white rounded-xl p-4 shadow-lg border-2 border-gray-100 text-center"
            >
              <div className={`text-2xl font-bold mb-1 ${stat.color === 'blue' ? 'text-blue-600' :
                  stat.color === 'yellow' ? 'text-yellow-600' :
                    stat.color === 'green' ? 'text-green-600' :
                      'text-purple-600'
                }`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs and Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-xl p-4 md:p-6 shadow-lg border-2 border-gray-100 mb-6"
        >
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto scrollbar-hide">
            {[
              { id: 'all', label: 'All Bookings' },
              { id: 'pending', label: 'Pending' },
              { id: 'accepted', label: 'Accepted' },
              { id: 'completed', label: 'Completed' },
              { id: 'rejected', label: 'Rejected' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Bookings List */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading bookings...</p>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-4"
            >
              {filteredBookings.map((booking, index) => (
                <motion.div
                  key={booking._id || booking.id}
                  variants={scaleIn}
                  className="bg-gray-50 rounded-xl p-4 md:p-6 border-2 border-gray-100"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                    {/* Booking Info */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {booking.user?.firstName} {booking.user?.lastName}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border inline-flex items-center space-x-1 w-fit ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          <span className="capitalize">{booking.status}</span>
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600 mb-3">
                        <div>
                          <span className="font-medium">Email:</span> {booking.user?.email || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Phone:</span> {booking.user?.phone || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Session:</span> {booking.duration || booking.sessionType}
                        </div>
                        <div>
                          <span className="font-medium">Date:</span> {formatDate(booking.date)} at {booking.time || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Amount:</span> ₹{booking.amount}
                        </div>
                        <div>
                          <span className="font-medium">Payment:</span>
                          <span className={`ml-1 capitalize ${booking.paymentStatus === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                            {booking.paymentStatus || 'pending'}
                          </span>
                        </div>
                      </div>

                      {booking.message && (
                        <div className="mt-3">
                          <span className="font-medium text-gray-900">Message:</span>
                          <p className="text-gray-600 mt-1 text-sm">{booking.message}</p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    {booking.status === 'pending' && (
                      <div className="flex flex-row sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2 md:ml-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAcceptBooking(booking._id || booking.id)}
                          className="flex-1 sm:flex-none px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Accept
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleRejectBooking(booking._id || booking.id)}
                          className="flex-1 sm:flex-none px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Reject
                        </motion.button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {filteredBookings.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <div className="text-gray-500 text-lg mb-2">No bookings found</div>
                  <p className="text-gray-400 text-sm">Bookings will appear here when students book sessions with you</p>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
        <BottomNavbar />
      </div>
    </div>
  );
};

export default MentorDashboard;