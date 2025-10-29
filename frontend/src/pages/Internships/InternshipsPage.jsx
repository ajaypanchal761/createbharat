import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNavbar from '../../components/common/BottomNavbar';
import logo from '../../assets/logo.png';
import { internshipAPI } from '../../utils/api';

// Icon Components
const MenuIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>);
const MessageIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>);
const StarIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>);
const HomeIcon = ({ active }) => (<svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-indigo-600' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>);
const BriefcaseIcon = ({ active }) => (<svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-indigo-600' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>);
const SearchIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>);
const HeartIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>);
const ClipboardIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>);
const UserIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>);

const InternshipsPage = () => {
  const navigate = useNavigate();
  
  const trendingInternships = internships.filter(internship => internship.featured || internship.popular).slice(0, 6);
  const recommendedInternships = internships.slice(0, 8);
  const scrollContainerRef = useRef(null);
  const recommendedScrollRef = useRef(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [activeRecommendedIndex, setActiveRecommendedIndex] = useState(0);

  // Define filter options
  const locations = ['All', 'Remote', 'Hybrid (Mumbai)', 'On-site (Bangalore)', 'On-site (Delhi)', 'Hybrid (Pune)', 'On-site (Hyderabad)'];
  const domains = ['All', 'Technology', 'Design', 'Marketing', 'Finance', 'Legal', 'Operations'];
  const workTypes = ['All', 'Full-time', 'Part-time'];
  const stipendRanges = ['All', '0-10k', '10k-20k', '20k-30k', '30k-50k', '50k+'];
  const durations = ['All', '2-3 months', '3 months', '3-4 months', '3-6 months', '4-6 months', '6 months'];

  // Filter states
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    domain: '',
    datePosted: '',
    stipendRange: '',
    workType: '',
    duration: ''
  });
  const [filteredInternships, setFilteredInternships] = useState([]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const applyFilters = async () => {
    try {
      setIsLoading(true);
      // Build backend filter params
      const params = { limit: 50 };

      if (filters.domain && filters.domain !== 'All') {
        params.category = filters.domain;
      }

      if (filters.location && filters.location !== 'All') {
        // Extract location name if it's in format "Type (Location)"
        let locationName = filters.location;
        if (locationName.includes('(')) {
          locationName = locationName.split('(')[1].replace(')', '').trim();
        }

        // Check if remote
        if (filters.location.toLowerCase().includes('remote')) {
          params.remote = 'true';
        } else {
          params.location = locationName;
        }
      }

      if (filters.workType && filters.workType !== 'All') {
        params.type = filters.workType;
      }

      // Fetch filtered internships from backend
      const response = await internshipAPI.getAll(params);
      if (response.success && response.data.internships) {
        const normalized = response.data.internships.map(i => ({
          ...i,
          id: i._id || i.id,
          company: i.companyName || i.company?.companyName || 'Company',
          stipendPerMonth: i.stipendPerMonth || '/month',
          postedDate: i.postedDateFormatted || (i.createdAt ? new Date(i.createdAt).toLocaleDateString() : 'Recently'),
          icon: i.icon || '💼',
          color: i.color || 'from-blue-500 to-cyan-500'
        }));

        // Apply client-side stipend range filter if needed
        let filtered = normalized;
        if (filters.stipendRange && filters.stipendRange !== 'All') {
          filtered = normalized.filter(i => {
            const stipend = parseInt((i.stipend || '').replace(/[^\d]/g, '')) || 0;
            switch (filters.stipendRange) {
              case '0-10k': return stipend <= 10000;
              case '10k-20k': return stipend > 10000 && stipend <= 20000;
              case '20k-30k': return stipend > 20000 && stipend <= 30000;
              case '30k-50k': return stipend > 30000 && stipend <= 50000;
              case '50k+': return stipend > 50000;
              default: return true;
            }
          });
        }

        setFilteredInternships(filtered);
        setApiInternships(filtered); // Update main list
      }
    } catch (error) {
      console.error('Error applying filters:', error);
    } finally {
      setIsLoading(false);
      setIsFilterOpen(false);
    }
  };

  const clearFilters = async () => {
    setFilters({ location: '', domain: '', datePosted: '', stipendRange: '', workType: '', duration: '' });
    try {
      setIsLoading(true);
      // Reload all internships
      const response = await internshipAPI.getAll({ limit: 100 });
      if (response.success && response.data.internships) {
        const normalized = response.data.internships.map(i => ({
          ...i,
          id: i._id || i.id,
          company: i.companyName || i.company?.companyName || 'Company',
          stipendPerMonth: i.stipendPerMonth || '/month',
          postedDate: i.postedDateFormatted || (i.createdAt ? new Date(i.createdAt).toLocaleDateString() : 'Recently'),
          icon: i.icon || '💼',
          color: i.color || 'from-blue-500 to-cyan-500'
        }));
        setApiInternships(normalized);
        setFilteredInternships(normalized.slice(0, 8));
      }
    } catch (error) {
      console.error('Error clearing filters:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getActiveFiltersCount = () => Object.values(filters).filter(v => v && v !== 'All').length;

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  // Premium professional background colors for trending cards
  const cardBackgrounds = [
    'from-slate-700 to-indigo-700',
    'from-blue-600 to-indigo-600',
    'from-emerald-600 to-teal-700',
    'from-violet-600 to-purple-700',
    'from-rose-600 to-pink-700',
    'from-cyan-600 to-blue-600',
  ];

  // placement courses removed per user request

  // placement course click handler removed

  // Handle scroll to update active card indicator
  useEffect(() => {
    const handleTrendingScroll = () => {
      if (scrollContainerRef.current) {
        const scrollLeft = scrollContainerRef.current.scrollLeft;
        const cardWidth = 336; // w-80 = 320px + 16px gap
        const index = Math.round(scrollLeft / cardWidth);
        setActiveCardIndex(index);
      }
    };

    const handleRecommendedScroll = () => {
      if (recommendedScrollRef.current) {
        const scrollLeft = recommendedScrollRef.current.scrollLeft;
        const cardWidth = 336; // w-80 = 320px + 16px gap
        const index = Math.round(scrollLeft / cardWidth);
        setActiveRecommendedIndex(index);
      }
    };

    const trendingContainer = scrollContainerRef.current;
    const recommendedContainer = recommendedScrollRef.current;

    if (trendingContainer) {
      trendingContainer.addEventListener('scroll', handleTrendingScroll);
    }
    if (recommendedContainer) {
      recommendedContainer.addEventListener('scroll', handleRecommendedScroll);
    }

    return () => {
      if (trendingContainer) {
        trendingContainer.removeEventListener('scroll', handleTrendingScroll);
      }
      if (recommendedContainer) {
        recommendedContainer.removeEventListener('scroll', handleRecommendedScroll);
      }
    };
  }, []);

  return (
    <div className="min-h-screen pb-20 relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 md:bg-gradient-to-br md:from-gray-50 md:via-blue-50 md:to-indigo-50">
      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading internships...</p>
          </div>
        </div>
      )}

      {/* Mobile Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="md:hidden sticky top-0 z-50 bg-gradient-to-r from-orange-400 to-orange-500 shadow-lg"
      >
        <div className="flex items-center justify-between px-4 py-3">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
            title="Menu"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>

          <Link to="/" className="flex items-center">
            <motion.img
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
              src={logo}
              alt="CreateBharat Logo"
              className="h-12 w-auto object-contain"
            />
          </Link>

          <div className="flex items-center gap-2">
            {/* Filter Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 hover:bg-white/30 transition-all duration-200"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span className="text-sm font-medium text-white">Filter</span>
              {getActiveFiltersCount() > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                >
                  {getActiveFiltersCount()}
                </motion.span>
              )}
            </motion.button>

            {/* For Companies Button - Moved to replace message icon */}
            <Link to="/company/login">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="For Companies"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Desktop Header */}
      <div className="hidden md:block bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Internships</h1>
                <p className="text-gray-600 mt-1">Find your perfect internship opportunity</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search internships..."
                  className="w-80 px-4 py-3 pl-10 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Company Login Button */}
              <Link to="/company/login">
                <button className="flex items-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Company Login
                </button>
              </Link>

              {/* Filter Button */}
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filter
                {getActiveFiltersCount() > 0 && (
                  <span className="bg-white text-orange-600 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative px-4 pt-6 pb-4 z-10 md:px-8 md:py-8">
        {/* Desktop Layout */}
        <div className="hidden md:block max-w-7xl mx-auto">
          <div className="space-y-12">
            {/* Desktop Trending Internships Section */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">✨ Trending Internships</h2>
                <button className="text-orange-600 hover:text-orange-700 font-semibold">View All</button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {trendingInternships.slice(0, 6).map((internship, index) => (
                  <motion.div
                    key={internship.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    className={`bg-gradient-to-br ${cardBackgrounds[index % cardBackgrounds.length]} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">{internship.company}</h3>
                        <span className="px-2 py-1 bg-white/20 text-white text-xs font-medium rounded-full">
                          Actively hiring
                        </span>
                      </div>
                      <div className={`w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-xl`}>
                        {internship.icon}
                      </div>
                    </div>

                        <h4 className="font-semibold text-lg mb-4">{internship.title}</h4>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-white/90">
                            <span>📍</span>
                            <span>{internship.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-white/90">
                            <span>💼</span>
                            <span>{internship.duration} experience</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-white/90">
                            <span>💰</span>
                            <span>{internship.stipend}/month</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <span className="px-2 py-1 bg-white/20 text-white text-xs rounded-md">
                            {internship.postedDate}
                          </span>
                          <span className="px-2 py-1 bg-white/20 text-white text-xs font-medium rounded-full">
                            Internship
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <Link to={`/internships/${internship.id}`}>
                            <button className="bg-white text-gray-900 text-center py-2 px-4 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors flex-1">
                              Apply Now
                            </button>
                          </Link>
                          <Link to={`/internships/${internship.id}`}>
                            <button className="bg-white/20 border border-white/30 text-white text-center py-2 px-4 rounded-lg font-semibold text-sm hover:bg-white/30 transition-colors">
                              Know More
                            </button>
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

            {/* Desktop Recommended Internships Section */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Recommended For You</h2>
                <button className="text-orange-600 hover:text-orange-700 font-semibold">View All</button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                {filteredInternships.slice(0, 8).map((internship, index) => (
                  <motion.div
                    key={internship.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg border border-gray-200 transition-all duration-300 relative flex flex-col h-full"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg mb-1">{internship.company}</h3>
                        <span className="px-2 py-1 bg-orange-50 text-orange-600 text-xs font-medium rounded-full">
                          Actively hiring
                        </span>
                      </div>
                      <div className={`w-12 h-12 bg-gradient-to-br ${internship.color} rounded-lg flex items-center justify-center text-xl shadow-sm`}>
                        {internship.icon}
                      </div>
                    </div>

                        <h4 className="font-semibold text-gray-800 text-base mb-4 line-clamp-2">{internship.title}</h4>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>📍</span>
                            <span>{internship.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>💼</span>
                            <span>{internship.duration} experience</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>💰</span>
                            <span>{internship.stipend}/month</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-md">
                            {internship.postedDate}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                            Internship
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4 min-h-[24px]">
                          {internship.popular && (
                            <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                              Popular
                            </span>
                          )}
                          {internship.remote && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                              Remote
                            </span>
                          )}
                          {internship.urgent && (
                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                              Urgent
                            </span>
                          )}
                        </div>

                    <div className="mt-auto">
                      <Link to={`/internships/${internship.id}`}>
                        <button className="w-full bg-orange-600 text-white text-center py-2.5 rounded-lg font-semibold text-sm hover:bg-orange-700 transition-colors">
                          View Details
                        </button>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

              {/* Placement courses removed for internships page */}
            </div>
          </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* Mobile Trending Internships Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="text-2xl font-bold text-gray-900 mb-6 relative"
          >
            <span className="relative z-10">✨ Trending Internship</span>
            <motion.div
              aria-hidden="true"
              animate={{ opacity: [0.15, 0.3, 0.15] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="pointer-events-none absolute -inset-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl blur-sm z-0"
            />
          </motion.h2>
          
          {/* Horizontal Scrollable Banners */}
          <div className="overflow-hidden">
            <div 
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory px-4"
            >
            {trendingInternships.map((internship, index) => (
              <motion.div 
                  key={internship.id}
                initial={{ opacity: 0, x: 50, rotateY: -20 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                viewport={{ amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -8 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-shrink-0 w-80 md:w-64 h-80 md:h-64 bg-gradient-to-br ${cardBackgrounds[index % cardBackgrounds.length]} rounded-2xl p-4 border-2 border-white/20 shadow-2xl hover:shadow-3xl hover:border-white/40 transition-all duration-500 snap-start cursor-pointer backdrop-blur-sm relative overflow-hidden group`}
              >
                {/* Floating Elements */}
                <motion.div
                  animate={{ 
                    y: [-10, 10, -10],
                    rotate: [0, 180, 360],
                    opacity: [0.3, 0.7, 0.3]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full blur-sm"
                />
                <motion.div
                  animate={{ 
                    x: [-5, 5, -5],
                    scale: [1, 1.2, 1],
                    opacity: [0.4, 0.8, 0.4]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: 1
                  }}
                  className="absolute bottom-4 left-4 w-6 h-6 bg-white/30 rounded-lg blur-sm"
                />
                
                {/* Company Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-lg mb-1">
                      {internship.company}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-white/20 text-white text-xs font-medium rounded-full border border-white/30 backdrop-blur-sm">
                        Actively hiring
                      </span>
                    </div>
                  </div>
                  <motion.div 
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className={`w-10 h-10 bg-gradient-to-br ${internship.color} rounded-lg flex items-center justify-center text-lg shadow-sm flex-shrink-0`}
                  >
                    {internship.icon}
                  </motion.div>
                </div>

                {/* Job Title */}
                <h4 className="font-semibold text-white text-base mb-3">
                  {internship.title}
                </h4>

                {/* Details with Icons */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-white/90">
                    <span className="text-lg">📍</span>
                    <span>{internship.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-white/90">
                    <span className="text-lg">💼</span>
                    <span>{internship.duration} experience</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-white/90">
                    <span className="text-lg">💰</span>
                    <span>{internship.stipend}/month</span>
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="px-1.5 py-0.5 bg-white/20 text-white/90 text-xs rounded-md backdrop-blur-sm">
                      {internship.postedDate}
                    </span>
                  </div>
                  <span className="px-2 py-1 bg-white/20 text-white text-xs font-medium rounded-full backdrop-blur-sm">
                    Internship
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Link to={`/internships/${internship.id}`}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-indigo-600 text-white text-center py-1.5 px-3 rounded-lg font-semibold text-xs hover:bg-indigo-700 transition-colors shadow-md"
                    >
                      Apply Now
                    </motion.div>
                  </Link>
                  <Link to={`/internships/${internship.id}`}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white border-2 border-indigo-600 text-indigo-600 text-center py-1.5 px-3 rounded-lg font-semibold text-xs hover:bg-indigo-50 transition-colors"
                    >
                      Know More
                    </motion.div>
                </Link>
                </div>
              </motion.div>
            ))}
            </div>
          </div>
          
          {/* Dots Indicator */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center gap-2 mt-3"
          >
            {trendingInternships.map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.8 }}
                onClick={() => {
                  if (scrollContainerRef.current) {
                    const cardWidth = 336; // w-80 = 320px + 16px gap
                    scrollContainerRef.current.scrollTo({
                      left: cardWidth * index,
                      behavior: 'smooth'
                    });
                  }
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeCardIndex === index 
                    ? 'w-8 bg-indigo-600' 
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Recommended For You Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="bg-white border border-gray-200 rounded-3xl -mx-4 px-4 py-6 mb-8 shadow-sm relative overflow-hidden"
        >
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
            className="text-2xl font-bold text-gray-900 mb-6 relative"
          >
            <span className="relative z-10">Recommended For You</span>
            <motion.div
              aria-hidden="true"
              animate={{ opacity: [0.15, 0.3, 0.15] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="pointer-events-none absolute -inset-2 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-xl blur-sm z-0"
            />
          </motion.h2>
          
          {/* Cards Grid */}
          <div className="overflow-hidden">
            <motion.div
              ref={recommendedScrollRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
              className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory px-4"
            >
            {filteredInternships.map((internship, idx) => (
              <motion.div
              key={internship.id}
                initial={{ 
                    opacity: 0, 
                    y: 50, 
                    scale: 0.8,
                    rotateX: -15
                }}
                animate={{ 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    rotateX: 0
                }}
                viewport={{ 
                    once: false, 
                    amount: 0.3,
                    margin: "-50px"
                }}
                transition={{ 
                    duration: 0.6, 
                    ease: "easeOut",
                    delay: idx * 0.1
                }}
              >
                <Link to={`/internships/${internship.id}`}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -8 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="flex-shrink-0 w-80 md:w-64 bg-gray-50 rounded-xl p-4 border-2 border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer snap-start"
                  >
                    {/* Company Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg mb-1">
                          {internship.company}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-orange-50 text-orange-600 text-xs font-medium rounded-full border border-orange-200">
                            Actively hiring
                          </span>
                        </div>
                      </div>
                      <motion.div 
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        className={`w-10 h-10 bg-gradient-to-br ${internship.color} rounded-lg flex items-center justify-center text-lg shadow-sm flex-shrink-0`}
                      >
                        {internship.icon}
                      </motion.div>
                    </div>

                    {/* Job Title */}
                    <h4 className="font-semibold text-gray-800 text-base mb-3">
                      {internship.title}
                    </h4>

                    {/* Details with Icons */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="text-lg">📍</span>
                        <span>{internship.location}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="text-lg">💼</span>
                        <span>{internship.duration} experience</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="text-lg">💰</span>
                        <span>{internship.stipend}/month</span>
                      </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-md">
                          {internship.postedDate}
                        </span>
                      </div>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                        Internship
                      </span>
                    </div>

              {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                {internship.popular && (
                        <motion.span 
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full"
                        >
                    Popular
                        </motion.span>
                      )}
                      {internship.remote && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                          Remote
                  </span>
                )}
                {internship.urgent && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                    Urgent
                  </span>
                )}
              </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
            </motion.div>
          </div>
          
          {/* Dots Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
            className="flex justify-center gap-2 mt-4"
          >
            {filteredInternships.map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeRecommendedIndex === index
                    ? 'bg-indigo-600 w-6'
                    : 'bg-gray-300'
                }`}
                onClick={() => {
                  if (recommendedScrollRef.current) {
                    const cardWidth = 336;
                    recommendedScrollRef.current.scrollTo({
                      left: index * cardWidth,
                      behavior: 'smooth'
                    });
                  }
                }}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Placement courses removed for internships page (mobile) */}
      </div>
    </div>

      {/* Filter Panel */}
      {isFilterOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl z-50 overflow-hidden flex flex-col"
        >
          {/* Filter Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Filter Internships</h2>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsFilterOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>
            <p className="text-indigo-100 text-sm">Find the perfect internship for you</p>
          </div>

        {/* Filter Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 pb-20 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {/* Location Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Location
            </h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Search location..."
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
              <svg className="absolute right-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {locations.slice(1).map((location) => (
                <motion.button
                  key={location}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleFilterChange('location', location)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                    filters.location === location
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {location}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Domain Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Domain
            </h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Search domain..."
                value={filters.domain}
                onChange={(e) => handleFilterChange('domain', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
              <svg className="absolute right-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {domains.slice(1).map((domain) => (
                <motion.button
                  key={domain}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleFilterChange('domain', domain)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                    filters.domain === domain
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {domain}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Work Type Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Work Type
            </h3>
            <div className="flex flex-wrap gap-2">
              {workTypes.slice(1).map((type) => (
                <motion.button
                  key={type}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleFilterChange('workType', type)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                    filters.workType === type
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </motion.button>
              ))}
              </div>
            </motion.div>

          {/* Stipend Range Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              Stipend Range
            </h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Search stipend range..."
                value={filters.stipendRange}
                onChange={(e) => handleFilterChange('stipendRange', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
              <svg className="absolute right-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {stipendRanges.slice(1).map((range) => (
                <motion.button
                  key={range}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleFilterChange('stipendRange', range)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                    filters.stipendRange === range
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {range}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Duration Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Duration
            </h3>
            <div className="flex flex-wrap gap-2">
              {durations.slice(1).map((duration) => (
                <motion.button
                  key={duration}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleFilterChange('duration', duration)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                    filters.duration === duration
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {duration}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

          {/* Filter Actions */}
          <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0">
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={clearFilters}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Clear All
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={applyFilters}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
              >
                Apply Filters
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-start justify-end"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-80 h-full shadow-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Menu</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-2">
              <Link to="/" className="block px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors">
                <span className="font-medium text-gray-900">Home</span>
              </Link>
              <Link to="/loans" className="block px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors">
                <span className="font-medium text-gray-900">Loans</span>
              </Link>
              <Link to="/mentors" className="block px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors">
                <span className="font-medium text-gray-900">Mentors</span>
              </Link>
              <Link to="/legal" className="block px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors">
                <span className="font-medium text-gray-900">Legal Services</span>
              </Link>
              <Link to="/training" className="block px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors">
                <span className="font-medium text-gray-900">Training</span>
              </Link>
              <Link to="/profile" className="block px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors">
                <span className="font-medium text-gray-900">Profile</span>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Filter Overlay */}
      {isFilterOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsFilterOpen(false)}
          className="fixed inset-0 bg-black/50 z-40"
        />
      )}

      {/* Bottom Navigation - Internships Specific */}
      <BottomNavbar 
        tabs={[
          { name: 'Home', path: '/', icon: <HomeIcon /> },
          { name: 'Search', path: '/internships', icon: <SearchIcon /> },
          { name: 'Applied', path: '/internships/applied', icon: <ClipboardIcon /> },
          { name: 'Profile', path: '/profile', icon: <UserIcon /> }
        ]}
      />

    </div>
  );
};



export default InternshipsPage;

