import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../../assets/logo.png';
import { mentorAPI } from '../../utils/api';

// Icons
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const MentorDetailPage = () => {
  const { mentorId } = useParams();
  const navigate = useNavigate();
  const [selectedSlot, setSelectedSlot] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [mentorData, setMentorData] = useState(null);

  // Mock mentor data (fallback)
  const mockMentor = {
    id: parseInt(mentorId),
    name: 'Sarah Johnson',
    title: 'Senior Business Consultant',
    company: 'TechCorp Inc.',
    experience: '10+ years',
    rating: 4.9,
    reviews: 127,
    pricing: {
      quick: { duration: '20-25 minutes', price: 150, label: 'Quick consultation' },
      inDepth: { duration: '50-60 minutes', price: 300, label: 'In-depth session' },
      comprehensive: { duration: '90-120 minutes', price: 450, label: 'Comprehensive consultation' }
    },
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face',
    specialties: ['Startup Strategy', 'Business Planning', 'Leadership', 'Team Management'],
    availability: 'Available',
    responseTime: '2 hours',
    description: 'Experienced business consultant with over 10 years of helping startups and established companies grow. Specialized in strategic planning, team leadership, and scaling operations.',
    achievements: [
      'Helped 50+ startups raise funding',
      'Led teams of 100+ employees',
      'MBA from Harvard Business School',
      'Certified Business Consultant'
    ],
    education: 'MBA - Harvard Business School, BS - Stanford University',
    languages: ['English', 'Spanish', 'French']
  };

  // Fetch mentor data
  useEffect(() => {
    const fetchMentor = async () => {
      setIsLoading(true);
      try {
        const response = await mentorAPI.getById(mentorId);
        if (response.success && response.data.mentor) {
          const apiMentor = response.data.mentor;
          setMentorData({
            id: apiMentor._id || apiMentor.id,
            name: `${apiMentor.firstName || ''} ${apiMentor.lastName || ''}`.trim() || 'Mentor',
            title: apiMentor.title || '',
            company: apiMentor.company || '',
            experience: apiMentor.experience || '',
            rating: apiMentor.rating || 0,
            reviews: apiMentor.totalSessions || 0,
            pricing: apiMentor.pricing || mockMentor.pricing,
            image: apiMentor.profileImage || mockMentor.image,
            specialties: apiMentor.skills || [],
            availability: 'Available',
            responseTime: apiMentor.responseTime || '24 hours',
            description: apiMentor.bio || 'Experienced mentor ready to help you achieve your goals.',
            achievements: apiMentor.certifications || [],
            education: apiMentor.education?.map(edu => `${edu.degree} - ${edu.university}`).join(', ') || '',
            languages: apiMentor.languages || []
          });
        } else {
          // Use mock data if API fails
          setMentorData(mockMentor);
        }
      } catch (err) {
        console.error('Error fetching mentor:', err);
        // Use mock data on error
        setMentorData(mockMentor);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMentor();
  }, [mentorId]);

  // Use mentorData or mockMentor
  const mentor = mentorData || mockMentor;

  // Time slots based on pricing
  const timeSlots = [
    { id: 'quick', duration: mentor.pricing?.quick?.duration || '20-25 minutes', price: mentor.pricing?.quick?.price || 150, description: mentor.pricing?.quick?.label || 'Quick consultation' },
    { id: 'inDepth', duration: mentor.pricing?.inDepth?.duration || '50-60 minutes', price: mentor.pricing?.inDepth?.price || 300, description: mentor.pricing?.inDepth?.label || 'In-depth session' },
    { id: 'comprehensive', duration: mentor.pricing?.comprehensive?.duration || '90-120 minutes', price: mentor.pricing?.comprehensive?.price || 450, description: mentor.pricing?.comprehensive?.label || 'Comprehensive consultation' }
  ];

  // Available dates (next 7 days)
  const availableDates = [
    { date: '2024-01-15', day: 'Today', available: true },
    { date: '2024-01-16', day: 'Tomorrow', available: true },
    { date: '2024-01-17', day: 'Wednesday', available: true },
    { date: '2024-01-18', day: 'Thursday', available: true },
    { date: '2024-01-19', day: 'Friday', available: true },
    { date: '2024-01-20', day: 'Saturday', available: false },
    { date: '2024-01-21', day: 'Sunday', available: false }
  ];

  // Available time slots
  const availableTimes = [
    { time: '09:00 AM', available: true },
    { time: '10:00 AM', available: true },
    { time: '11:00 AM', available: false },
    { time: '12:00 PM', available: true },
    { time: '02:00 PM', available: true },
    { time: '03:00 PM', available: true },
    { time: '04:00 PM', available: false },
    { time: '05:00 PM', available: true },
    { time: '06:00 PM', available: true }
  ];

  const handleBooking = () => {
    if (!selectedSlot) {
      alert('Please select a time slot');
      return;
    }
    setShowBookingModal(true);
  };

  const handleConfirmBooking = () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select date and time');
      return;
    }
    setIsBooking(true);
    // Navigate to payment page
    navigate(`/mentors/${mentorId}/book/${selectedSlot}`);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading mentor profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-50">
      {/* Booking Modal */}
      {showBookingModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowBookingModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Book Consultation</h2>
              <button
                onClick={() => setShowBookingModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mentor Info */}
            <div className="flex items-center space-x-4 mb-6 p-4 bg-orange-50 rounded-xl">
              <img
                src={mentor.image}
                alt={mentor.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-orange-200"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{mentor.name}</h3>
                <p className="text-orange-600">{mentor.title}</p>
                <p className="text-sm text-gray-600">Session: {timeSlots.find(s => s.id === selectedSlot)?.duration}</p>
              </div>
            </div>

            {/* Date Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Date</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {availableDates.map((date) => (
                  <motion.button
                    key={date.date}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedDate(date.date)}
                    disabled={!date.available}
                    className={`p-3 rounded-lg border-2 transition-all ${selectedDate === date.date
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : date.available
                        ? 'border-gray-200 hover:border-orange-300 text-gray-700'
                        : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-sm font-medium">{date.day}</div>
                      <div className="text-xs text-gray-500">{date.date}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Time</h3>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {availableTimes.map((timeSlot) => (
                  <motion.button
                    key={timeSlot.time}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedTime(timeSlot.time)}
                    disabled={!timeSlot.available}
                    className={`p-3 rounded-lg border-2 transition-all ${selectedTime === timeSlot.time
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : timeSlot.available
                        ? 'border-gray-200 hover:border-orange-300 text-gray-700'
                        : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {timeSlot.time}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleConfirmBooking}
                disabled={!selectedDate || !selectedTime}
                className={`flex-1 py-3 px-4 font-medium rounded-lg transition-all ${selectedDate && selectedTime
                    ? 'bg-orange-600 text-white hover:bg-orange-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Confirm Booking
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/mentors" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <ArrowLeftIcon />
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Mentor Details</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <MenuIcon />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="px-4 pt-6 pb-4">
        <div className="max-w-4xl mx-auto">
          {/* Mentor Profile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100 mb-6"
          >
            <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
              <img
                src={mentor.image}
                alt={mentor.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
              />
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{mentor.name}</h1>
                <p className="text-lg text-gray-600 mb-1">{mentor.title}</p>
                <p className="text-sm text-gray-500 mb-4">{mentor.company}</p>
                
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1">
                    <StarIcon />
                    <span className="font-medium text-gray-900">{mentor.rating}</span>
                    <span className="text-gray-500">({mentor.reviews} reviews)</span>
                  </div>
                  <div className="text-gray-500">•</div>
                  <div className="text-gray-600">{mentor.experience}</div>
                  <div className="text-gray-500">•</div>
                  <div className="text-green-600 font-medium">{mentor.availability}</div>
                </div>

                <p className="text-gray-700 leading-relaxed">{mentor.description}</p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Specialties */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Specialties</h3>
                <div className="flex flex-wrap gap-3">
                  {mentor.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-orange-50 text-orange-700 rounded-full text-sm font-medium"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Achievements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Achievements</h3>
                <ul className="space-y-3">
                  {mentor.achievements.map((achievement, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckIcon />
                      <span className="text-gray-700">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Education */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Education & Languages</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900">Education</h4>
                    <p className="text-gray-600">{mentor.education}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Languages</h4>
                    <p className="text-gray-600">{mentor.languages.join(', ')}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Booking */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100 sticky top-24"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Book a Session</h3>
                
                {/* Time Slots */}
                <div className="space-y-3 mb-6">
                  {timeSlots.map((slot) => (
                    <motion.div
                      key={slot.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedSlot === slot.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                      onClick={() => setSelectedSlot(slot.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <ClockIcon />
                          <span className="font-medium text-gray-900">{slot.duration}</span>
                        </div>
                        <span className="font-bold text-gray-900">₹{slot.price}</span>
                      </div>
                      <p className="text-sm text-gray-600">{slot.description}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Booking Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBooking}
                  disabled={!selectedSlot || isBooking}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${selectedSlot && !isBooking
                      ? 'bg-orange-600 text-white hover:bg-orange-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isBooking ? 'Processing...' : 'Book Consultant'}
                </motion.button>

                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    Response time: {mentor.responseTime}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDetailPage;
