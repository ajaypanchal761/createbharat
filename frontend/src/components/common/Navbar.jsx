import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { FaBars, FaTimes } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';
import logo from '../../assets/logo.png';

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
          : 'bg-gradient-to-r from-orange-400 to-orange-500 shadow-2xl'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-4">
              <div className="relative">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  scrolled 
                    ? 'bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg' 
                    : 'bg-white/20 backdrop-blur-sm'
                }`}>
                  <img src={logo} alt="CreateBharat Logo" className="w-10 h-10 object-contain" />
                </div>
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
                  ✨
                </div>
              </div>
            <div className="flex flex-col">
                <span className={`font-bold text-2xl leading-tight ${
                  scrolled ? 'text-gray-900' : 'text-white'
                }`}>
                  CreateBharat
                </span>
                <span className={`text-sm font-medium ${
                  scrolled ? 'text-gray-600' : 'text-orange-100'
                }`}>
                  Empowering Entrepreneurs
                </span>
            </div>
          </Link>
          </div>

          {/* Desktop Navigation (webview) - simplified, no active tab styling */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <div key={link.name} className="relative">
                {link.path === '/legal' && location.pathname === '/legal' ? (
                  <button
                    onClick={() => {
                      setActiveLegalTab('services');
                      window.dispatchEvent(new CustomEvent('navbarLegalTabChange', { detail: { tab: 'services' } }));
                    }}
                    className={`group relative px-6 py-3 rounded-2xl text-sm font-semibold ${
                      scrolled ? 'text-gray-700' : 'text-white/90'
                    }`}
                  >
                    <span className="flex items-center space-x-2">
                      <span>{link.name}</span>
                    </span>
                  </button>
                ) : (
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
                )}
              </div>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* CTA Buttons */}
            <div className="flex items-center space-x-3">
              {/* Status Tab - only show on /legal page */}
              {location.pathname === '/legal' && (
                <button
                  onClick={() => {
                    setActiveLegalTab('status');
                    window.dispatchEvent(new CustomEvent('navbarLegalTabChange', { detail: { tab: 'status' } }));
                  }}
                  className={`px-6 py-3 rounded-2xl font-bold text-sm shadow-lg transition-all ${
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
                <div className="flex items-center space-x-3">
                  <Link
                    to="/profile"
                    className={`px-6 py-3 rounded-2xl font-bold text-sm shadow-lg ${
                      scrolled
                        ? 'bg-white text-orange-600 hover:bg-gray-50 hover:shadow-xl border border-orange-200'
                        : 'bg-white text-orange-600 hover:bg-gray-50 hover:shadow-xl'
                    }`}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => { logout(); navigate('/'); }}
                    className={`px-6 py-3 rounded-2xl font-bold text-sm shadow-lg ${
                      scrolled
                        ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:shadow-xl'
                        : 'bg-red-600 text-white hover:bg-red-700 hover:shadow-xl'
                    }`}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div>
                  <Link
                    to="/login"
                    className={`px-6 py-3 rounded-2xl font-bold text-sm shadow-lg ${
                      scrolled
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 hover:shadow-xl'
                        : 'bg-white text-orange-600 hover:bg-gray-50 hover:shadow-xl'
                    }`}
                  >
                    Login
                  </Link>
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
                  : 'text-white hover:bg-white/10'
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
