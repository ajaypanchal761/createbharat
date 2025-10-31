import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { mentorAPI, mentorBookingAPI } from '../../utils/api';

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
  const [isLoading, setIsLoading] = useState(true);
  const [mentorData, setMentorData] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            pricing: apiMentor.pricing,
            image: apiMentor.profileImage || '',
            specialties: apiMentor.skills || [],
    availability: 'Available',
            responseTime: apiMentor.responseTime || '24 hours',
            description: apiMentor.bio || '',
            achievements: apiMentor.certifications || [],
            education: apiMentor.education?.map(edu => `${edu.degree} - ${edu.university}`).join(', ') || '',
            languages: apiMentor.languages || []
          });
        } else {
          setMentorData(null);
        }
      } catch (err) {
        setMentorData(null);
        console.error('Error fetching mentor:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMentor();
  }, [mentorId]);

  // Use mentorData or mockMentor
  const mentor = mentorData;

  // Time slots based on pricing
  const timeSlots = [
    { id: 'quick', duration: mentor?.pricing?.quick?.duration || '20-25 minutes', price: mentor?.pricing?.quick?.price || 150, description: mentor?.pricing?.quick?.label || 'Quick consultation' },
    { id: 'inDepth', duration: mentor?.pricing?.inDepth?.duration || '50-60 minutes', price: mentor?.pricing?.inDepth?.price || 300, description: mentor?.pricing?.inDepth?.label || 'In-depth session' },
    { id: 'comprehensive', duration: mentor?.pricing?.comprehensive?.duration || '90-120 minutes', price: mentor?.pricing?.comprehensive?.price || 450, description: mentor?.pricing?.comprehensive?.label || 'Comprehensive consultation' }
  ];

  // (date/time selection handled later by mentor after acceptance)

  const handleBooking = async (slotId) => {
    if (!slotId) {
      alert('Please select a slot');
      return;
    }
    setIsBooking(true);
    try {
      const rawToken = (localStorage.getItem('token') || localStorage.getItem('authToken') || '').trim();
      const token = rawToken.replace(/^["']/, '').replace(/["']$/, '');
      const sessionTypeMap = { quick: '20min', inDepth: '50min', comprehensive: '90min' };
      const sessionType = sessionTypeMap[slotId];
      if (!sessionType) throw new Error('Invalid session type');
      const bookingData = { sessionType };
      const res = await mentorBookingAPI.create(token, mentorId, bookingData);
      if (res.success && res.data && res.data.booking && res.data.booking._id) {
        navigate(`/mentors/booking/${res.data.booking._id}`);
      } else {
        alert('Booking failed');
      }
    } catch {
      alert('Booking failed');
    }
    setIsBooking(false);
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

  if (!mentorData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
          <p className="text-lg text-gray-600">Mentor not found.</p>
              </div>
            </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-50">
      {/* Header */}
      <div
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
              <button 
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <MenuIcon />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            {/* Menu Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-64 bg-white shadow-2xl z-50 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                {/* Close button */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Menu</h2>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* Menu Items */}
                <div className="space-y-2">
                  <Link 
                    to="/" 
                    className="block py-3 px-4 rounded-lg hover:bg-gray-100 text-gray-700 font-medium transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link 
                    to="/mentors" 
                    className="block py-3 px-4 rounded-lg hover:bg-gray-100 text-gray-700 font-medium transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Mentors
                  </Link>
                  <Link 
                    to="/loans" 
                    className="block py-3 px-4 rounded-lg hover:bg-gray-100 text-gray-700 font-medium transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Loans
                  </Link>
                  <Link 
                    to="/internships" 
                    className="block py-3 px-4 rounded-lg hover:bg-gray-100 text-gray-700 font-medium transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Internships
                  </Link>
                  <Link 
                    to="/legal" 
                    className="block py-3 px-4 rounded-lg hover:bg-gray-100 text-gray-700 font-medium transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Legal Services
                  </Link>
                  <Link 
                    to="/training" 
                    className="block py-3 px-4 rounded-lg hover:bg-gray-100 text-gray-700 font-medium transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Training
                  </Link>
                  <Link 
                    to="/profile" 
                    className="block py-3 px-4 rounded-lg hover:bg-gray-100 text-gray-700 font-medium transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="px-4 pt-6 pb-4">
        <div className="max-w-4xl mx-auto">
          {/* Mentor Profile */}
          <div
            className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100 mb-6"
          >
            <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
              <img
                src={mentor.image || undefined}
                alt={mentor.name || 'Mentor'}
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
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Specialties */}
              <div
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
              </div>

              {/* Achievements */}
              <div
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
              </div>

              {/* Education */}
              <div
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
              </div>
            </div>

            {/* Right Column - Booking */}
            <div className="lg:col-span-1">
              <div
                className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100 sticky top-24"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Book a Session</h3>
                
                {/* Time Slots */}
                <div className="space-y-3 mb-6">
                  {timeSlots.map((slot) => (
                    <div
                      key={slot.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedSlot === slot.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'}`}
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
                    </div>
                  ))}
                </div>

                {/* Booking Button */}
                <button
                  onClick={() => handleBooking(selectedSlot)}
                  disabled={!selectedSlot || isBooking}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${selectedSlot && !isBooking
                      ? 'bg-orange-600 text-white hover:bg-orange-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isBooking ? 'Processing...' : 'Book Consultant'}
                </button>

                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    Response time: {mentor.responseTime}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDetailPage;
