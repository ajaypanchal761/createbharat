import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaBell, FaUser, FaSearch } from 'react-icons/fa';
import { AnimatePresence } from 'framer-motion';
import logo from '../../assets/logo.png';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

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
  ];

  // Don't render navbar on homepage, admin routes, company routes, internship login, or mentor category/profile pages
  if (
    location.pathname === '/' || 
    location.pathname.startsWith('/admin') || 
    location.pathname === '/company/internships' ||
    location.pathname === '/company/login' ||
    location.pathname === '/internships/login' ||
    location.pathname === '/mentors' ||
    location.pathname === '/mentors/profile'
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link, index) => (
              <div
                key={link.name}
                className="relative"
              >
              <Link
                to={link.path}
                  className={`group relative px-6 py-3 rounded-2xl text-sm font-semibold ${
                    location.pathname === link.path
                      ? scrolled
                        ? 'text-orange-600 bg-orange-50 shadow-lg border border-orange-200'
                        : 'text-white bg-white/20 shadow-lg backdrop-blur-sm'
                      : scrolled
                      ? 'text-gray-700 hover:text-orange-600 hover:bg-gray-50 hover:shadow-md'
                      : 'text-white/90 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <span>{link.name}</span>
                  </span>
                  
                  {/* Active indicator */}
                  <div
                    className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 rounded-full ${
                      location.pathname === link.path
                        ? scrolled
                          ? 'bg-orange-600'
                          : 'bg-white'
                        : 'bg-transparent'
                    }`}
                  />
              </Link>
              </div>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Button */}
            <button
              className={`p-3 rounded-2xl ${
                scrolled
                  ? 'text-gray-600 hover:text-orange-600 hover:bg-gray-50 hover:shadow-md'
                  : 'text-white/90 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm'
              }`}
            >
              <FaSearch className="h-5 w-5" />
            </button>


            {/* User Profile */}
            <div
              className={`relative p-3 rounded-2xl ${
                scrolled
                  ? 'text-gray-600 hover:text-orange-600 hover:bg-gray-50 hover:shadow-md'
                  : 'text-white/90 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm'
              }`}
            >
              <FaUser className="h-5 w-5" />
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-3 ml-6 pl-6 border-l border-gray-200/50">
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
              <div>
            <Link
              to="/signup"
                  className={`px-6 py-3 rounded-2xl font-bold text-sm shadow-lg ${
                    scrolled
                      ? 'bg-transparent text-orange-600 border-2 border-orange-600 hover:bg-orange-50 hover:shadow-xl'
                      : 'bg-transparent text-white border-2 border-white hover:bg-white/10 hover:shadow-xl backdrop-blur-sm'
                  }`}
            >
              Sign Up
            </Link>
              </div>
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
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
              <Link
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium ${
                      location.pathname === link.path
                        ? 'text-orange-600 bg-orange-50 shadow-lg'
                        : 'text-gray-700 hover:text-orange-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{link.name}</span>
              </Link>
                </motion.div>
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
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center px-5 py-3 bg-transparent text-orange-600 border-2 border-orange-600 rounded-xl font-semibold hover:bg-orange-50"
              >
                Sign Up
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

