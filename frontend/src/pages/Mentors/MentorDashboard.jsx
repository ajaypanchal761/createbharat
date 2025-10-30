import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ServiceNotification from '../../components/common/ServiceNotification';
import { mentorAPI } from "../../utils/api";

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
  const [activeTab, setActiveTab] = useState('pending');
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newSchedule, setNewSchedule] = useState({
    date: '',
    time: '',
    meetingLink: ''
  });
  const [rejectReason, setRejectReason] = useState('');
  const [showRefundNotification, setShowRefundNotification] = useState(false);
  const [refundAmount, setRefundAmount] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        // Assuming mentor token in localStorage
        const token = localStorage.getItem('mentorToken');
        const response = await mentorAPI.getMentorBookings(token);
        if (response.success && Array.isArray(response.data)) {
          setBookings(response.data);
          setError('');
        } else {
          setBookings([]);
          setError('No bookings found');
        }
      } catch {
        setBookings([]);
        setError('Error fetching bookings');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'all') return true;
    return booking.status === activeTab;
  });

  const handleAcceptBooking = (booking) => {
    setSelectedBooking(booking);
    setShowAcceptModal(true);
    // Set default new schedule to current booking details
    setNewSchedule({
      date: booking.date,
      time: booking.time,
      meetingLink: ''
    });
  };

  const handleConfirmAccept = async () => {
    if (!selectedBooking) return;
    try {
      const token = localStorage.getItem('mentorToken');
      await mentorAPI.updateBookingStatus(token, selectedBooking._id, 'accepted');
      setShowAcceptModal(false);
      setSelectedBooking(null);
      setNewSchedule({ date: '', time: '', meetingLink: '' });
      // Refresh bookings
      const response = await mentorAPI.getMentorBookings(token);
      if (response.success && Array.isArray(response.data)) setBookings(response.data);
    } catch {
      alert('Failed to accept booking.');
    }
  };

  const handleRejectBooking = (booking) => {
    setSelectedBooking(booking);
    setShowRejectModal(true);
    setRejectReason('');
  };

  const handleConfirmReject = async () => {
    if (!selectedBooking) return;
    try {
      const token = localStorage.getItem('mentorToken');
      await mentorAPI.updateBookingStatus(token, selectedBooking._id, 'rejected');
      setRefundAmount(selectedBooking.amount);
      setShowRejectModal(false);
      setSelectedBooking(null);
      setRejectReason('');
      setShowRefundNotification(true);
      // Refresh bookings
      const response = await mentorAPI.getMentorBookings(token);
      if (response.success && Array.isArray(response.data)) setBookings(response.data);
    } catch {
      alert('Failed to reject booking.');
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">

      {/* Main Content */}
      <div className="px-3 md:px-4 pt-4 md:pt-6 pb-4">
        {/* Header Section */}
        <div
          className="text-center mb-4 md:mb-8"
        >
          <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">Mentor Dashboard</h1>
          <p className="text-xs md:text-base text-gray-600">Manage your bookings and mentor sessions</p>
        </div>

        {/* Stats Cards */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-8"
        >
          {[
            { label: 'Total Bookings', value: bookings.length, color: 'blue' },
            { label: 'Pending', value: bookings.filter(b => b.status === 'pending').length, color: 'yellow' },
            { label: 'Accepted', value: bookings.filter(b => b.status === 'accepted').length, color: 'green' },
            { label: 'Completed', value: bookings.filter(b => b.status === 'completed').length, color: 'purple' }
          ].map((stat) => (
            <div
              key={stat.label}
              className={`bg-white rounded-lg md:rounded-xl p-2 md:p-4 shadow-lg border-2 border-gray-100 text-center`}
            >
              <div className={`text-lg md:text-2xl font-bold text-${stat.color}-600 mb-0.5 md:mb-1`}>{stat.value}</div>
              <div className="text-xs md:text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div
          className="bg-white rounded-lg md:rounded-xl p-3 md:p-6 shadow-lg border-2 border-gray-100 mb-4 md:mb-6"
        >
          <div className="flex gap-1 md:gap-2 mb-3 md:mb-6 overflow-x-auto scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
            {[
              { id: 'all', label: 'All Bookings' },
              { id: 'pending', label: 'Pending' },
              { id: 'accepted', label: 'Accepted' },
              { id: 'completed', label: 'Completed' },
              { id: 'profile', label: 'Profile' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-2 md:px-4 py-1 md:py-2 rounded-md md:rounded-lg font-medium transition-all whitespace-nowrap flex-shrink-0 text-xs md:text-base ${activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Bookings List */}
          {(activeTab === 'all' || activeTab === 'pending' || activeTab === 'accepted' || activeTab === 'completed') && (
            <div
              key={activeTab}
              className="space-y-2 md:space-y-4"
            >
              {isLoading ? (
                <div className="text-center py-8 md:py-12">
                  <div className="text-gray-500 text-base md:text-lg mb-1 md:mb-2">Loading bookings...</div>
                  <p className="text-gray-400 text-xs md:text-sm">Please wait while we fetch the latest bookings.</p>
                </div>
              ) : error ? (
                <div className="text-center py-8 md:py-12">
                  <div className="text-gray-500 text-base md:text-lg mb-1 md:mb-2">{error}</div>
                  <p className="text-gray-400 text-xs md:text-sm">No bookings found for this tab.</p>
                </div>
              ) : filteredBookings.length === 0 ? (
                <div className="text-center py-8 md:py-12">
                  <div className="text-gray-500 text-base md:text-lg mb-1 md:mb-2">No bookings found</div>
                  <p className="text-gray-400 text-xs md:text-sm">Bookings will appear here when students book sessions with you</p>
                </div>
              ) : (
                filteredBookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="bg-gray-50 rounded-lg md:rounded-xl p-3 md:p-6 border-2 border-gray-100"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
                      {/* Booking Info */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 md:space-x-3 mb-2">
                          <h3 className="text-base md:text-lg font-semibold text-gray-900">{booking.studentName}</h3>
                          <span className={`px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs md:text-sm font-medium border ${getStatusColor(booking.status)}`}>
                            <span className="flex items-center space-x-1">
                              {getStatusIcon(booking.status)}
                              <span className="capitalize">{booking.status}</span>
                            </span>
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 text-xs md:text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Email:</span> {booking.studentEmail}
                          </div>
                          <div>
                            <span className="font-medium">Session:</span> {booking.sessionType}
                          </div>
                          <div>
                            <span className="font-medium">Date:</span> {booking.date || '-'}{booking.time ? ` at ${booking.time}` : ''}
                          </div>
                          <div>
                            <span className="font-medium">Amount:</span> ₹{booking.amount}
                          </div>
                        </div>

                        <div className="mt-2 md:mt-3">
                          <span className="font-medium text-gray-900 text-xs md:text-sm">Message:</span>
                          <p className="text-gray-600 mt-0.5 md:mt-1 text-xs md:text-sm">{booking.message || '-'}</p>
                        </div>

                        <div className="mt-2 md:mt-3">
                          <span className="font-medium text-gray-900 text-xs md:text-sm">Specialties:</span>
                          <div className="flex flex-wrap gap-1 md:gap-2 mt-0.5 md:mt-1">
                            {(booking.specialties || []).map((specialty, idx) => (
                              <span
                                key={idx}
                                className="px-1.5 md:px-2 py-0.5 md:py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                              >
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      {booking.status === 'pending' && (
                        <div className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2 md:ml-4">
                          <button
                            onClick={() => handleAcceptBooking(booking)}
                            className="flex-1 md:flex-none px-3 md:px-4 py-1.5 md:py-2 bg-green-600 text-white font-medium rounded-md md:rounded-lg hover:bg-green-700 transition-colors text-xs md:text-base"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleRejectBooking(booking)}
                            className="flex-1 md:flex-none px-3 md:px-4 py-1.5 md:py-2 bg-red-600 text-white font-medium rounded-md md:rounded-lg hover:bg-red-700 transition-colors text-xs md:text-base"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div
              className="bg-white rounded-lg md:rounded-xl shadow-lg border-2 border-gray-100 mb-4 md:mb-6 overflow-hidden"
              style={{ height: 'calc(100vh - 300px)' }}
            >
              <iframe
                src="/mentors/profile"
                className="w-full h-full border-0"
                title="Mentor Profile"
              />
            </div>
          )}
        </div>
      </div>

      {/* Accept Modal */}
      {showAcceptModal && selectedBooking && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setShowAcceptModal(false)}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div
              className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-lg md:text-2xl font-bold text-gray-900">Accept Booking & Set Schedule</h2>
                <button
                  onClick={() => setShowAcceptModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Current Booking Details */}
              <div className="bg-gray-50 rounded-xl p-3 md:p-4 mb-4 md:mb-6">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Current Booking Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <span className="text-xs md:text-sm text-gray-600">Student Name:</span>
                    <p className="text-sm md:text-base text-gray-900 font-medium">{selectedBooking.studentName}</p>
                  </div>
                  <div>
                    <span className="text-xs md:text-sm text-gray-600">Email:</span>
                    <p className="text-sm md:text-base text-gray-900 font-medium">{selectedBooking.studentEmail}</p>
                  </div>
                  <div>
                    <span className="text-xs md:text-sm text-gray-600">Session Type:</span>
                    <p className="text-sm md:text-base text-gray-900 font-medium">{selectedBooking.sessionType}</p>
                  </div>
                  <div>
                    <span className="text-xs md:text-sm text-gray-600">Amount:</span>
                    <p className="text-sm md:text-base text-gray-900 font-medium">₹{selectedBooking.amount}</p>
                  </div>
                  <div>
                    <span className="text-xs md:text-sm text-gray-600">Current Date:</span>
                    <p className="text-sm md:text-base text-gray-900 font-medium">{selectedBooking.date}</p>
                  </div>
                  <div>
                    <span className="text-xs md:text-sm text-gray-600">Current Time:</span>
                    <p className="text-sm md:text-base text-gray-900 font-medium">{selectedBooking.time}</p>
                  </div>
                </div>
                <div className="mt-3 md:mt-4">
                  <span className="text-xs md:text-sm text-gray-600">Message:</span>
                  <p className="text-sm md:text-base text-gray-900 mt-1">{selectedBooking.message}</p>
                </div>
              </div>

              {/* New Schedule Form */}
              <div className="mb-4 md:mb-6">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Set New Schedule (Optional)</h3>
                <div className="space-y-3 md:space-y-4">
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                      Meeting Date
                    </label>
                    <input
                      type="date"
                      value={newSchedule.date}
                      onChange={(e) => setNewSchedule({ ...newSchedule, date: e.target.value })}
                      className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                      Meeting Time
                    </label>
                    <input
                      type="time"
                      value={newSchedule.time}
                      onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
                      className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                      Meeting Link
                    </label>
                    <input
                      type="url"
                      value={newSchedule.meetingLink}
                      onChange={(e) => setNewSchedule({ ...newSchedule, meetingLink: e.target.value })}
                      placeholder="https://meet.google.com/..."
                      className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 md:space-x-3">
                <button
                  onClick={() => setShowAcceptModal(false)}
                  className="flex-1 px-3 md:px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm md:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmAccept}
                  className="flex-1 px-3 md:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm md:text-base"
                >
                  Accept & Confirm
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedBooking && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setShowRejectModal(false)}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div
              className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 max-w-lg w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-base md:text-2xl font-bold text-gray-900">Reject Booking & Process Refund</h2>
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Booking Details */}
              <div className="bg-gray-50 rounded-xl p-3 md:p-4 mb-4 md:mb-6">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3">Booking Details</h3>
                <div className="space-y-2 text-xs md:text-sm">
                  <div>
                    <span className="text-gray-600">Student:</span>
                    <span className="text-gray-900 font-medium ml-2">{selectedBooking.studentName}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <span className="text-gray-900 font-medium ml-2">{selectedBooking.studentEmail}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Amount Paid:</span>
                    <span className="text-gray-900 font-medium ml-2">₹{selectedBooking.amount}</span>
                  </div>
                </div>
              </div>

              {/* Refund Warning */}
              <div className="bg-orange-50 border-l-4 border-orange-500 p-3 md:p-4 mb-4 md:mb-6 rounded-r-lg">
                <div className="flex items-start">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-orange-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <h4 className="text-orange-800 font-semibold mb-1 text-xs md:text-sm">Refund Information</h4>
                    <p className="text-orange-700 text-xs md:text-sm">
                      Rejecting this booking will automatically process a refund of <span className="font-semibold">₹{selectedBooking.amount}</span> to the student's account.
                    </p>
                  </div>
                </div>
              </div>

              {/* Reason for Rejection */}
              <div className="mb-4 md:mb-6">
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                  Reason for Rejection (Optional)
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows="3"
                  placeholder="Enter reason for rejection..."
                  className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none text-sm md:text-base"
                />
              </div>

              {/* Actions */}
              <div className="flex space-x-2 md:space-x-3">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 px-3 md:px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm md:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReject}
                  className="flex-1 px-3 md:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm md:text-base"
                >
                  Reject & Refund
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Refund Notification */}
      {showRefundNotification && (
        <ServiceNotification
          type="refund"
          refundAmount={refundAmount}
          onClose={() => setShowRefundNotification(false)}
        />
      )}
    </div>
  );
};

export default MentorDashboard;
