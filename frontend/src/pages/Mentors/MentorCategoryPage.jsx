import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const MentorCategoryPage = () => {
  const navigate = useNavigate();

  const categories = [
    { id: 'business', name: 'Business & Entrepreneurship', icon: '💼', mentors: 45 },
    { id: 'tech', name: 'Technology & Software', icon: '💻', mentors: 38 },
    { id: 'finance', name: 'Finance & Investment', icon: '💰', mentors: 32 },
    { id: 'marketing', name: 'Marketing & Growth', icon: '📢', mentors: 28 },
    { id: 'legal', name: 'Legal & Compliance', icon: '⚖️', mentors: 22 },
    { id: 'career', name: 'Career Development', icon: '🎯', mentors: 35 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Header */}
      <div className="hidden md:block bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <img src="/logo.png" alt="CreateBharat Logo" className="h-14 w-auto object-contain" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Mentors</h1>
                <p className="text-gray-600 mt-1">Find the right mentor for you</p>
              </div>
            </div>
            {/* Admin Button - Desktop */}
            <button
              onClick={() => navigate('/mentors/login')}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-purple-600 text-white rounded-lg hover:from-orange-600 hover:to-purple-700 transition-colors font-medium shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Mentor Admin
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Hero */}
      <div className="hidden md:block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Find Your Perfect Mentor</h2>
          <p className="text-lg text-white/90">Connect with experienced mentors and accelerate your growth</p>
        </div>
      </div>

      {/* Desktop Categories Grid */}
      <div className="hidden md:block max-w-7xl mx-auto px-8 py-12">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Browse by Category</h3>
          <p className="text-gray-600">Select a category to view available mentors</p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              onClick={() => navigate(`/mentors/category/${category.id}`)}
              className="bg-white rounded-xl shadow-md border border-gray-200 p-6 cursor-pointer hover:shadow-lg transition-all text-center"
            >
              <div className="text-5xl mb-4">{category.icon}</div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h4>
              <p className="text-gray-600 text-sm">{category.mentors} mentors</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile View - Simple List */}
      <div className="md:hidden bg-gray-50 min-h-screen pb-20">
        {/* Mobile Header */}
        <div className="bg-gradient-to-r from-orange-400 to-orange-500 shadow-lg sticky top-0 z-50">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex-1" />
            
            {/* Admin Button - Mobile */}
            <button
              onClick={() => navigate('/mentors/login')}
              className="px-3 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm font-medium hover:bg-white/30 transition-colors"
            >
              Mentor Admin
            </button>
          </div>
        </div>

        {/* Mobile Title */}
        <div className="bg-gray-100 py-4 px-4">
          <h1 className="text-xl font-bold text-gray-900">Mentors</h1>
          <p className="text-sm text-gray-600">Browse mentors by category</p>
        </div>

        {/* Mobile Categories List */}
        <div className="px-4 py-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="divide-y divide-gray-200">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => navigate(`/mentors/category/${category.id}`)}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer transition-colors group"
                >
                  {/* Left: Icon and Title */}
                  <div className="flex items-center gap-3 flex-1">
                    {/* Category Icon */}
                    <div className="text-2xl">{category.icon}</div>
                    
                    {/* Category Name */}
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-xs text-gray-600">{category.mentors} mentors</p>
                    </div>
                  </div>

                  {/* Right: Arrow Icon */}
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorCategoryPage;
