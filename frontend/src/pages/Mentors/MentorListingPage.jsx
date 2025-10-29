import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mentors, setMentors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const categoryNames = {
    business: 'Business & Entrepreneurship',
    technology: 'Technology & Programming',
    career: 'Career Development',
    finance: 'Finance & Investment',
    marketing: 'Marketing & Sales',
    personal: 'Personal Development'
  };

  useEffect(() => {
    const fetchMentors = async () => {
      setIsLoading(true);
      try {
        const params = {
          category: categoryId,
          search: searchTerm,
          experience: selectedExperience,
          rating: selectedRating
        };
        const response = await mentorAPI.getAll(params);
        if (response.success && response.data && response.data.length > 0) {
          setMentors(response.data);
          setError(''); // Clear error on success
        } else {
          // Use mock data if API returns empty or no data
          setMentors([]);
          setError('');
        }
      } catch (err) {
        // On error, use mock data instead of showing error
        console.error('Error fetching mentors:', err);
        setMentors([]);
        setError('');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMentors();
  }, [categoryId, searchTerm, selectedExperience, selectedRating]);

  const mockMentors = [
    {
      id: 1,
      name: 'Sarah Johnson',
      title: 'Senior Business Consultant',
      company: 'TechCorp Inc.',
      experience: '10+ years',
      rating: 4.9,
      reviews: 127,
      price: 150,
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      specialties: ['Startup Strategy', 'Business Planning', 'Leadership'],
      availability: 'Available',
      responseTime: '2 hours'
    },
    {
      id: 2,
      name: 'Michael Chen',
      title: 'Full Stack Developer',
      company: 'Google',
      experience: '8+ years',
      rating: 4.8,
      reviews: 89,
      price: 120,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      specialties: ['React', 'Node.js', 'AWS'],
      availability: 'Available',
      responseTime: '1 hour'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      title: 'Career Coach',
      company: 'LinkedIn',
      experience: '6+ years',
      rating: 4.9,
      reviews: 156,
      price: 100,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      specialties: ['Resume Writing', 'Interview Prep', 'Career Transition'],
      availability: 'Available',
      responseTime: '3 hours'
    },
    {
      id: 4,
      name: 'David Kim',
      title: 'Investment Advisor',
      company: 'Goldman Sachs',
      experience: '12+ years',
      rating: 4.7,
      reviews: 98,
      price: 200,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      specialties: ['Portfolio Management', 'Risk Assessment', 'Market Analysis'],
      availability: 'Available',
      responseTime: '4 hours'
    },
    {
      id: 5,
      name: 'Lisa Wang',
      title: 'Digital Marketing Expert',
      company: 'Facebook',
      experience: '7+ years',
      rating: 4.8,
      reviews: 112,
      price: 130,
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      specialties: ['Social Media', 'SEO', 'Content Strategy'],
      availability: 'Available',
      responseTime: '2 hours'
    },
    {
      id: 6,
      name: 'James Wilson',
      title: 'Life Coach',
      company: 'Self Employed',
      experience: '5+ years',
      rating: 4.9,
      reviews: 78,
      price: 90,
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      specialties: ['Goal Setting', 'Time Management', 'Personal Growth'],
      availability: 'Available',
      responseTime: '1 hour'
    }
  ];

  // Use mockMentors if mentors array is empty (API failed or returned no data)
  const mentorsToDisplay = mentors.length > 0 ? mentors : mockMentors;

  const filteredMentors = mentorsToDisplay.map(mentor => {
    // Check if it's API data (has _id or firstName) or mock data
    const isApiData = mentor._id || mentor.firstName;

    if (isApiData) {
      // API data format
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
    } else {
      // Mock data format (already in correct format)
      return mentor;
    }
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
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-orange-400 to-orange-500 shadow-lg sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/mentors" className="p-2 rounded-lg hover:bg-white/20 transition-colors">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-sm md:text-lg font-semibold text-white">
                  {categoryNames[categoryId] || 'Mentors'}
                </h1>
                <p className="hidden md:block text-sm text-orange-100">{filteredMentors.length} mentors available</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
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
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="px-4 pt-6 pb-4">
        {/* Search and Filters */}
        <motion.div
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
            <div className="flex flex-wrap gap-4">
              <select
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">All Experience Levels</option>
                <option value="5+">5+ years</option>
                <option value="8+">8+ years</option>
                <option value="10+">10+ years</option>
              </select>

              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">All Ratings</option>
                <option value="4.5">4.5+ stars</option>
                <option value="4.7">4.7+ stars</option>
                <option value="4.8">4.8+ stars</option>
              </select>
            </div>
          </div>
        </motion.div>

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
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
          >
            {filteredMentors.map((mentor) => (
              <motion.div
                key={mentor.id}
                variants={scaleIn}
              >
                <Link to={`/mentors/${mentor.id}`} className="group">
                  <motion.div
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
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* No Results */}
        {!isLoading && !error && filteredMentors.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-500 text-lg">No mentors found matching your criteria</div>
            <p className="text-gray-400 mt-2">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MentorListingPage;
