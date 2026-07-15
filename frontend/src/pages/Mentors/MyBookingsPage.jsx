import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { mentorBookingAPI } from '../../utils/api';

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
  const [activeTab, setActiveTab] = useState('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewModal, setReviewModal] = useState({ open: false, booking: null });
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const modalMentorName = reviewModal.booking
    ? (
        `${reviewModal.booking.mentor?.firstName || ''} ${reviewModal.booking.mentor?.lastName || ''}`.trim() ||
        'the mentor'
      )
    : '';

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const rawToken = (localStorage.getItem('token') || localStorage.getItem('authToken') || '').trim();
        const token = rawToken.replace(/^['"]/, '').replace(/['"]$/, '');
        const res = await mentorBookingAPI.getMyBookings(token);
        if (res.success && Array.isArray(res.data)) {
          setBookings(res.data);
          setError('');
        } else {
          setBookings([]);
          setError('No bookings found');
        }
      } catch {
        setBookings([]);
        setError('Error fetching bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  useEffect(() => {
    if (!bookings || bookings.length === 0 || reviewModal.open) {
      return;
    }

    let dismissed = [];
    try {
      dismissed = JSON.parse(localStorage.getItem('mentorReviewDismissed') || '[]');
    } catch {
      dismissed = [];
    }

    const activeDismissed = dismissed.filter((id) =>
      bookings.some(
        (booking) =>
          booking._id === id &&
          booking.status === 'completed' &&
          (!booking.review || !booking.review.rating)
      )
    );

    if (activeDismissed.length !== dismissed.length) {
      localStorage.setItem('mentorReviewDismissed', JSON.stringify(activeDismissed));
    }

    const pendingReview = bookings.find(
      (booking) =>
        booking.status === 'completed' &&
        (!booking.review || !booking.review.rating) &&
        !activeDismissed.includes(booking._id)
    );

    if (pendingReview) {
      setReviewRating(5);
      setReviewComment('');
      setReviewModal({ open: true, booking: pendingReview });
    }
  }, [bookings, reviewModal.open]);

  const handleSelectReviewRating = (value) => {
    setReviewRating(value);
  };

  const handleDismissReview = () => {
    if (reviewModal.booking) {
      let dismissed = [];
      try {
        dismissed = JSON.parse(localStorage.getItem('mentorReviewDismissed') || '[]');
      } catch {
        dismissed = [];
      }
      dismissed.push(reviewModal.booking._id);
      localStorage.setItem('mentorReviewDismissed', JSON.stringify(Array.from(new Set(dismissed))));
    }
    setReviewModal({ open: false, booking: null });
    setReviewComment('');
    setReviewRating(5);
  };

  const handleSubmitReview = async () => {
    if (!reviewModal.booking) return;
    setIsSubmittingReview(true);
    try {
      const rawToken = (localStorage.getItem('token') || localStorage.getItem('authToken') || '').trim();
      const token = rawToken.replace(/^['"]|['"]$/g, '');
      const res = await mentorBookingAPI.submitReview(token, reviewModal.booking._id, {
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
      if (res.success) {
        setBookings((prev) =>
          prev.map((booking) =>
            booking._id === reviewModal.booking._id
              ? {
                  ...booking,
                  review: res.data?.review || {
                    rating: reviewRating,
                    comment: reviewComment.trim(),
                    createdAt: new Date().toISOString(),
                  },
                }
              : booking
          )
        );
        try {
          const dismissed = JSON.parse(localStorage.getItem('mentorReviewDismissed') || '[]');
          const filtered = dismissed.filter((id) => id !== reviewModal.booking._id);
          if (filtered.length !== dismissed.length) {
            localStorage.setItem('mentorReviewDismissed', JSON.stringify(filtered));
          }
        } catch {
          // ignore parse errors
        }
        setReviewModal({ open: false, booking: null });
        setReviewComment('');
        setReviewRating(5);
        window.dispatchEvent(new CustomEvent('mentorRatingUpdated'));
        alert('Thank you for sharing your feedback!');
      } else {
        throw new Error(res.message || 'Failed to submit review');
      }
    } catch (err) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'all') return true;
    return booking.status === activeTab;
  });

  const formatStatus = (s) => (s || '').charAt(0).toUpperCase() + (s || '').slice(1);

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
            <div className="flex-1" />
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
            <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
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
            { label: 'Upcoming', value: bookings.filter(b => b.status === 'accepted').length, color: 'green' },
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
              { id: 'accepted', label: 'Upcoming' },
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
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : error ? (
              <div className="text-center py-8 text-gray-500">{error}</div>
            ) : (
              filteredBookings.map((booking) => {
                const mentor = booking.mentor || {};
                const mentorName = `${mentor.firstName || ''} ${mentor.lastName || ''}`.trim() || 'Mentor';
                const mentorTitle = mentor.title || '';
                const mentorImg = mentor.profileImage || undefined;
                const whenDate = booking.date ? new Date(booking.date) : null;
                const dateStr = whenDate ? whenDate.toLocaleDateString() : '-';
                const timeStr = booking.time || '';
                return (
                  <motion.div
                    key={booking._id}
                    variants={scaleIn}
                    className="bg-gray-50 rounded-xl p-6 border-2 border-gray-100"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                      {/* Booking Info */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <img
                            src={mentorImg}
                            alt={mentorName}
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-100 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 truncate" title={mentorName}>{mentorName}</h3>
                            <p className="text-gray-600 truncate" title={mentorTitle}>{mentorTitle}</p>
                          </div>
                          <span className={`flex-shrink-0 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
                            <span className="flex items-center space-x-1">
                              <span className="capitalize">{formatStatus(booking.status)}</span>
                            </span>
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="break-words">
                            <span className="font-medium">Session:</span> {booking.sessionType}
                          </div>
                          <div className="break-words">
                            <span className="font-medium">Date/Time:</span> {dateStr}{timeStr ? ` at ${timeStr}` : ''}
                          </div>
                          <div className="break-words">
                            <span className="font-medium">Amount:</span> ₹{booking.amount}
                          </div>
                          <div className="break-words">
                            <span className="font-medium">Message:</span> {booking.message || '-'}
                          </div>
                        </div>

                        {booking.sessionLink && booking.status === 'accepted' && (
                          <div className="mt-3">
                            <span className="font-medium text-gray-900">Session Link:</span>{' '}
                            <a
                              href={booking.sessionLink}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:underline break-all"
                            >
                              {booking.sessionLink}
                            </a>
                          </div>
                        )}

                        {booking.status === 'completed' && (
                          <div className="mt-4">
                            {booking.review && booking.review.rating ? (
                              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 text-sm text-gray-700">
                                <span className="font-medium text-gray-800">Your rating:</span>
                                <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4, 5].map((value) => (
                                    <span
                                      key={value}
                                      className={`text-lg ${value <= booking.review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                    >
                                      ★
                                    </span>
                                  ))}
                                </div>
                                <span className="text-gray-500 sm:ml-2">({booking.review.rating}/5)</span>
                                {booking.review.comment && (
                                  <span className="text-gray-500 sm:ml-2 italic">“{booking.review.comment}”</span>
                                )}
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setReviewRating(5);
                                  setReviewComment('');
                                  setReviewModal({ open: true, booking });
                                }}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                Rate this session
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
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

      <AnimatePresence>
        {reviewModal.open && reviewModal.booking && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Rate your session</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    How was your session with <span className="font-medium text-gray-900">{modalMentorName}</span>?
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDismissReview}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Close review modal"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleSelectReviewRating(value)}
                    className={`text-3xl transition-transform ${value <= reviewRating ? 'text-yellow-400' : 'text-gray-300'} hover:scale-110`}
                    aria-label={`Rate ${value} star${value > 1 ? 's' : ''}`}
                  >
                    ★
                  </button>
                ))}
              </div>

              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share more about your experience (optional)"
                rows={4}
                maxLength={500}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              />

              <div className="mt-6 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3">
                <button
                  type="button"
                  onClick={handleDismissReview}
                  className="px-5 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Maybe later
                </button>
                <button
                  type="button"
                  onClick={handleSubmitReview}
                  disabled={isSubmittingReview}
                  className="px-5 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingReview ? 'Submitting...' : 'Submit review'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyBookingsPage;
