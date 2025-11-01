import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { FaBars, FaTimes } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLegalTab, setActiveLegalTab] = useState(() => {
    // Get saved tab from localStorage, default to 'services'
    return localStorage.getItem('legalActiveTab') || 'services';
  });
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useUser();

  // Listen for tab changes from Legal page
  useEffect(() => {
    const handleLegalTabChange = (event) => {
      setActiveLegalTab(event.detail.tab);
    };
    window.addEventListener('legalTabChange', handleLegalTabChange);
    return () => window.removeEventListener('legalTabChange', handleLegalTabChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Loans', path: '/loans' },
    { name: 'Internships', path: '/internships' },
    { name: 'Legal', path: '/legal' },
    { name: 'Mentors', path: '/mentors' },
    { name: 'Training', path: '/training' },
    { name: 'Web Development', path: '/app-development' },
  ];

  // Don't render navbar on homepage, admin routes, company routes, internship login, mentor category/profile pages, or dashboard pages
  if (
    location.pathname === '/' || 
    location.pathname.startsWith('/admin') || 
    location.pathname === '/company/internships' ||
    location.pathname === '/mentors' ||
    location.pathname === '/mentors/profile' ||
    location.pathname.startsWith('/mentors/dashboard') ||
    location.pathname.startsWith('/ca/dashboard')
  ) {
    return null;
  }

  return (
    <nav
      className={`hidden md:block sticky top-0 z-50 ${
        scrolled
          ? 'bg-white/98 backdrop-blur-2xl shadow-2xl border-b border-gray-200/60'
          : 'bg-white shadow-2xl border-b border-gray-200/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Brand with public logo */}
          <div className="flex items-center space-x-2 md:space-x-4 flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2 md:space-x-3 lg:space-x-5">
              <img src="/logo.png" alt="CreateBharat Logo" className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain flex-shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className={`font-bold text-lg md:text-xl lg:text-2xl leading-tight truncate ${
                  scrolled ? 'text-gray-900' : 'text-gray-900'
                }`}>
                  CreateBharat
                </span>
                <span className={`text-xs md:text-sm font-medium truncate hidden md:block ${
                  scrolled ? 'text-gray-600' : 'text-gray-600'
                }`}>
                  Empowering Entrepreneurs
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation (webview) - simplified, no active tab styling */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2 2xl:space-x-4 flex-wrap justify-center flex-1 mx-2 md:mx-4">
            {navLinks.map((link) => (
              <div key={link.name} className="relative">
                {link.path === '/legal' && location.pathname === '/legal' ? (
                  <button
                    onClick={() => {
                      setActiveLegalTab('services');
                      window.dispatchEvent(new CustomEvent('navbarLegalTabChange', { detail: { tab: 'services' } }));
                    }}
                    className={`group relative px-2 xl:px-4 2xl:px-6 py-2 xl:py-3 rounded-xl 2xl:rounded-2xl text-xs xl:text-sm font-semibold whitespace-nowrap transition-colors hover:text-orange-600 ${
                      scrolled ? 'text-gray-700' : 'text-gray-700'
                    }`}
                  >
                    <span className="flex items-center space-x-1 xl:space-x-2">
                      <span>{link.name}</span>
                    </span>
                  </button>
                ) : (
                  <Link
                    to={link.path}
                    className={`group relative px-2 xl:px-4 2xl:px-6 py-2 xl:py-3 rounded-xl 2xl:rounded-2xl text-xs xl:text-sm font-semibold whitespace-nowrap transition-colors hover:text-orange-600 ${
                      scrolled ? 'text-gray-700' : 'text-gray-700'
                    }`}
                  >
                    <span className="flex items-center space-x-1 xl:space-x-2">
                      <span>{link.name}</span>
                    </span>
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-4 flex-shrink-0">
            {/* CTA Buttons */}
            <div className="flex items-center space-x-1.5 xl:space-x-3">
              {/* Status Tab - only show on /legal page */}
              {location.pathname === '/legal' && (
                <button
                  onClick={() => {
                    setActiveLegalTab('status');
                    window.dispatchEvent(new CustomEvent('navbarLegalTabChange', { detail: { tab: 'status' } }));
                  }}
                  className={`px-3 xl:px-6 py-2 xl:py-3 rounded-xl xl:rounded-2xl font-bold text-xs xl:text-sm shadow-lg transition-all whitespace-nowrap ${
                    activeLegalTab === 'status'
                      ? scrolled
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 hover:shadow-xl'
                        : 'bg-white text-orange-600 hover:bg-gray-50 hover:shadow-xl'
                      : scrolled
                        ? 'bg-white text-orange-600 hover:bg-gray-50 hover:shadow-xl border border-orange-200'
                        : 'bg-white text-orange-600 hover:bg-gray-50 hover:shadow-xl'
                  }`}
                >
                  Status
                </button>
              )}
              {isAuthenticated() ? (
                <div className="flex items-center space-x-1.5 xl:space-x-3">
                  <Link
                    to="/profile"
                    className={`px-3 xl:px-6 py-2 xl:py-3 rounded-xl xl:rounded-2xl font-bold text-xs xl:text-sm shadow-lg whitespace-nowrap transition-colors ${
                      scrolled
                        ? 'bg-white text-orange-600 hover:bg-gray-50 hover:shadow-xl border border-orange-200'
                        : 'bg-white text-orange-600 hover:bg-gray-50 hover:shadow-xl'
                    }`}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => { logout(); navigate('/'); }}
                    className={`px-3 xl:px-6 py-2 xl:py-3 rounded-xl xl:rounded-2xl font-bold text-xs xl:text-sm shadow-lg whitespace-nowrap transition-colors ${
                      scrolled
                        ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:shadow-xl'
                        : 'bg-red-600 text-white hover:bg-red-700 hover:shadow-xl'
                    }`}
                  >
                    Logout
                  </button>
                  {/* Login as CA Button - only show on /legal page, after logout */}
                  {location.pathname === '/legal' && (
                    <Link
                      to="/ca/login"
                      className={`px-4 py-2 rounded-xl font-semibold text-xs shadow-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
                        scrolled
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg'
                      }`}
                    >
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span>Login as CA</span>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-1.5 xl:space-x-3">
                  <Link
                    to="/login"
                    className={`px-3 xl:px-6 py-2 xl:py-3 rounded-xl xl:rounded-2xl font-bold text-xs xl:text-sm shadow-lg whitespace-nowrap transition-colors ${
                      scrolled
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 hover:shadow-xl'
                        : 'bg-white text-orange-600 hover:bg-gray-50 hover:shadow-xl'
                    }`}
                  >
                    Login
                  </Link>
                  {/* Login as CA Button - only show on /legal page, after login button */}
                  {location.pathname === '/legal' && (
                    <Link
                      to="/ca/login"
                      className={`px-4 py-2 rounded-xl font-semibold text-xs shadow-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
                        scrolled
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg'
                      }`}
                    >
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span>Login as CA</span>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-3 rounded-xl ${
                scrolled
                  ? 'text-gray-600 hover:text-orange-600 hover:bg-gray-50'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {mobileMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
      {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/95 backdrop-blur-xl shadow-2xl border-t border-gray-200/50"
          >
            <div className="max-w-7xl mx-auto px-4 py-4">
              {navLinks.map((link) => (
                <div key={link.name} className="relative">
                  <Link
                    to={link.path}
                    className={`group relative px-6 py-3 rounded-2xl text-sm font-semibold ${
                      scrolled ? 'text-gray-700' : 'text-white/90'
                    }`}
                  >
                    <span className="flex items-center space-x-2">
                      <span>{link.name}</span>
                    </span>
                  </Link>
                </div>
              ))}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  className="mt-6 pt-6 border-t border-gray-200"
                >
                  <div className="space-y-3">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full text-center px-5 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 shadow-lg"
                    >
                      Login
                    </Link>
                  </div>
                </motion.div>
            </div>
          </motion.div>
      )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
