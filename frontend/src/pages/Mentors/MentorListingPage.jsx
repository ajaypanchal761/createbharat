import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { mentorAPI } from '../../utils/api';
import BottomNavbar from '../../components/common/BottomNavbar';
import { mentorBookingAPI } from '../../utils/api';

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

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const MentorListingPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mentors, setMentors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('mentors');
  const [bookings, setBookings] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [bookingsError, setBookingsError] = useState('');

  // Navbar icons for bottom navigation
  const HomeIcon = ({ active }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );

  const UserIcon = ({ active }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  const StatusIcon = ({ active }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const ProfileIcon = ({ active }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const categoryNames = {
    business: 'Business & Entrepreneurship',
    technology: 'Technology & Programming',
    career: 'Career Development',
    finance: 'Finance & Investment',
    marketing: 'Marketing & Sales',
    personal: 'Personal Development'
  };

  const fetchUserBookings = async () => {
    try {
      setIsLoadingBookings(true);
      setBookingsError('');
      const rawToken = (localStorage.getItem('token') || localStorage.getItem('authToken') || '').trim();
      const token = rawToken.replace(/^['"]/, '').replace(/['"]$/, '');
      const res = await mentorBookingAPI.getMyBookings(token);
      if (res.success && Array.isArray(res.data)) {
        setBookings(res.data);
      } else {
        setBookings([]);
        setBookingsError('No bookings found');
      }
    } catch {
      setBookings([]);
      setBookingsError('Error fetching bookings');
    } finally {
      setIsLoadingBookings(false);
    }
  };

  useEffect(() => {
    const fetchMentors = async () => {
      setIsLoading(true);
      try {
        const params = {};
        if (categoryId) params.category = categoryId;
        if (searchTerm) params.search = searchTerm;
        if (selectedExperience) params.experience = selectedExperience;
        if (selectedRating) params.rating = selectedRating;

        const response = await mentorAPI.getAll(params);
        if (response.success && response.data && response.data.length > 0) {
          setMentors(response.data);
          setError('');
        } else {
          setMentors([]);
          setError('');
        }
      } catch {
        setMentors([]);
        setError('Error fetching mentors');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMentors();
  }, [categoryId, searchTerm, selectedExperience, selectedRating]);

  // Listen for tab changes from Navbar (webview)
  useEffect(() => {
    const handleNavbarTabChange = (e) => {
      if (e?.detail?.tab === 'status') {
        setActiveTab('status');
        fetchUserBookings();
      }
    };
    window.addEventListener('navbarMentorsTabChange', handleNavbarTabChange);
    return () => window.removeEventListener('navbarMentorsTabChange', handleNavbarTabChange);
  }, []);

  // Notify Navbar when tab changes in this page
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('mentorsTabChange', { detail: { tab: activeTab } }));
  }, [activeTab]);

  // Use only mentors fetched from API
  const mentorsToDisplay = mentors;

  const filteredMentors = mentorsToDisplay.map(mentor => {
    return {
      id: mentor._id || mentor.id,
      name: `${mentor.firstName || ''} ${mentor.lastName || ''}`.trim() || 'Mentor',
      title: mentor.title || '',
      company: mentor.company || '',
      experience: mentor.experience || '',
      rating: mentor.rating || 0,
      reviews: mentor.totalSessions || 0,
      price: mentor.pricing?.quick?.price || mentor.pricing?.inDepth?.price || mentor.pricing?.comprehensive?.price || 150,
      image: mentor.profileImage || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      specialties: mentor.skills || [],
      languages: mentor.languages || [],
      availability: 'Available',
      responseTime: mentor.responseTime || '24 hours'
    };
  });

  // Animation variants
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
      <Motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-orange-400 to-orange-500 shadow-lg sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Header */}
          <div className="md:hidden flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="p-2 rounded-lg hover:bg-white/20 transition-colors">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-sm font-semibold text-white">
                  {categoryId ? categoryNames[categoryId] : 'All Mentors'}
                </h1>
                <p className="text-xs text-orange-100">{filteredMentors.length} mentors available</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigate('/mentors/login')}
                className="px-3 py-1.5 bg-white text-orange-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-xs"
              >
                Mentor Login
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 rounded-lg hover:bg-white/20 transition-colors"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Desktop Header - simplified without back icon and availability */}
          <div className="hidden md:flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-xl font-bold text-white">
                  {categoryId ? categoryNames[categoryId] : 'All Mentors'}
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="px-6 py-2 bg-white text-orange-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Home
              </Link>
              <button
                onClick={() => navigate('/mentors/login')}
                className="px-6 py-2 bg-white text-orange-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Mentor Login
              </button>
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('navbarMentorsTabChange', { detail: { tab: 'status' } }));
                }}
                className="px-6 py-2 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
              >
                Status
              </button>
            </div>
          </div>
        </div>
      </Motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex">
            <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
            <Motion.div
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
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate('/mentors/login');
                    }}
                    className="w-full text-left block py-3 px-4 rounded-lg hover:bg-orange-50 text-orange-600 font-semibold border border-orange-600 mt-4"
                  >
                    Mentor Login
                  </button>
                </div>
              </div>
            </Motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="px-4 pt-6 pb-4">
        {/* Mentors Tab Content */}
        {activeTab === 'mentors' && (
          <>
            {/* Search and Filters */}
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6"
            >
              <div className="max-w-4xl mx-auto">
                {/* Search Bar */}
                <div className="relative mb-4">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon />
                  </div>
                  <input
                    type="text"
                    placeholder="Search mentors by name or specialty..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                {/* Filters */}
                <div className="flex gap-3">
                  <select
                    value={selectedExperience}
                    onChange={(e) => setSelectedExperience(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">All Experience</option>
                    <option value="5+">5+ years</option>
                    <option value="8+">8+ years</option>
                    <option value="10+">10+ years</option>
                  </select>

                  <select
                    value={selectedRating}
                    onChange={(e) => setSelectedRating(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">All Ratings</option>
                    <option value="4.5">4.5+ stars</option>
                    <option value="4.7">4.7+ stars</option>
                    <option value="4.8">4.8+ stars</option>
                  </select>
                </div>
              </div>
            </Motion.div>

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">Loading mentors...</div>
              </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <div className="text-center py-12">
                <div className="text-red-500 text-lg">{error}</div>
              </div>
            )}

            {/* Mentors Grid */}
            {!isLoading && !error && (
              <Motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
              >
                {filteredMentors.map((mentor) => (
                  <Motion.div
                    key={mentor.id}
                    variants={scaleIn}
                  >
                    <Link to={`/mentors/${mentor.id}`} className="group">
                      <Motion.div
                        whileHover={{ y: -8, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="bg-gray-50 rounded-xl p-6 shadow-lg hover:shadow-xl border-2 border-gray-300 hover:border-gray-400 transition-all duration-300 cursor-pointer h-full"
                      >
                        {/* Mentor Header */}
                        <div className="flex items-start space-x-4 mb-4">
                          <img
                            src={mentor.image}
                            alt={mentor.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
                          />
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                              {mentor.name}
                            </h3>
                            <p className="text-sm text-gray-600">{mentor.title}</p>
                            <p className="text-xs text-gray-500">{mentor.company}</p>
                          </div>
                        </div>

                        {/* Rating and Experience */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-1">
                            <StarIcon />
                            <span className="text-sm font-medium text-gray-900">{mentor.rating}</span>
                            <span className="text-xs text-gray-500">({mentor.reviews} reviews)</span>
                          </div>
                          <div className="text-sm text-gray-600">{mentor.experience}</div>
                        </div>

                        {/* Specialties */}
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {mentor.specialties.slice(0, 2).map((specialty, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded-full"
                              >
                                {specialty}
                              </span>
                            ))}
                            {mentor.specialties.length > 2 && (
                              <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-full">
                                +{mentor.specialties.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Availability and Price */}
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm text-green-600 font-medium">{mentor.availability}</div>
                            <div className="text-xs text-gray-500">Responds in {mentor.responseTime}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">₹{mentor.price}</div>
                            <div className="text-xs text-gray-500">per session</div>
                          </div>
                        </div>
                      </Motion.div>
                    </Link>
                  </Motion.div>
                ))}
              </Motion.div>
            )}

            {/* No Results */}
            {!isLoading && !error && filteredMentors.length === 0 && (
              <Motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="text-gray-500 text-lg">No mentors found matching your criteria</div>
                <p className="text-gray-400 mt-2">Try adjusting your search or filters</p>
              </Motion.div>
            )}
          </>
        )}

        {/* Status Tab Content */}
        {activeTab === 'status' && (
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 pb-32"
          >
            {isLoadingBookings ? (
              <div className="text-center py-12 text-gray-500">Loading bookings...</div>
            ) : bookingsError ? (
              <div className="text-center py-12 text-gray-500">{bookingsError}</div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">No Bookings Found</div>
                <p className="text-gray-400 mt-2">Your mentor booking status will appear here</p>
              </div>
            ) : (
              bookings.map((booking) => {
                const mentor = booking.mentor || {};
                const mentorName = `${mentor.firstName || ''} ${mentor.lastName || ''}`.trim() || 'Mentor';
                const whenDate = booking.date ? new Date(booking.date) : null;
                const dateStr = whenDate ? whenDate.toLocaleDateString() : '-';
                const timeStr = booking.time || '';
                const isAccepted = booking.status === 'accepted';
                const isPending = booking.status === 'pending';
                const isRejected = booking.status === 'rejected';
                return (
                  <Motion.div
                    key={booking._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src={mentor.profileImage || undefined}
                          alt={mentorName}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                        />
                        <div>
                          <div className="text-lg font-semibold text-gray-900">{mentorName}</div>
                          <div className="text-sm text-gray-600">{mentor.title || ''}</div>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full text-sm font-medium border capitalize">
                        {booking.status}
                      </span>
                    </div>

                    {/* Common: duration and amount */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Duration:</span> {booking.duration}
                      </div>
                      <div>
                        <span className="font-medium">Amount:</span> ₹{booking.amount}
                      </div>
                    </div>

                    {/* Accepted: date/time + session link */}
                    {isAccepted && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 mt-3">
                        <div>
                          <span className="font-medium">Date/Time:</span> {dateStr}{timeStr ? ` at ${timeStr}` : ''}
                        </div>
                        {booking.sessionLink && (
                          <div>
                            <span className="font-medium text-gray-900">Session Link:</span>{' '}
                            <a href={booking.sessionLink} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline break-all">
                              {booking.sessionLink}
                            </a>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Rejected: message */}
                    {isRejected && (
                      <div className="mt-3 text-sm text-gray-600">
                        <span className="font-medium">Message:</span> {booking.cancellationReason || booking.message || '-'}
                      </div>
                    )}
                  </Motion.div>
                );
              })
            )}
          </Motion.div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavbar
        tabs={[
          { name: 'Home', path: '/', icon: <HomeIcon /> },
          { name: 'Mentors', path: '/mentors', icon: <UserIcon />, onClick: () => setActiveTab('mentors'), isActive: activeTab === 'mentors' },
          { name: 'Status', path: '#', icon: <StatusIcon />, onClick: () => { setActiveTab('status'); fetchUserBookings(); }, isActive: activeTab === 'status' },
          { name: 'Profile', path: '/profile', icon: <ProfileIcon /> }
        ]}
      />
    </div>
  );
};

export default MentorListingPage;
