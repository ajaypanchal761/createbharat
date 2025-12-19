import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { mentorCategories } from '../../data/mentorCategories';

const MentorCategoryPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="relative bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 py-4 md:py-5 text-slate-900">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors text-xs font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <h1 className="flex-1 text-center text-base md:text-xl font-bold">
              <span className="md:hidden">Categories</span>
              <span className="hidden md:inline">Choose a mentor category</span>
            </h1>
            <div>
              <button
                onClick={() => navigate('/mentors/login')}
                className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
              >
                Mentor Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-8">
        <div className="hidden md:grid grid-cols-4 gap-10 py-12">
          {mentorCategories.map((category, index) => (
            <motion.button
              key={category.id}
              type="button"
              onClick={() => navigate(`/mentors/category/${category.id}`)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              whileHover={{ scale: 1.03, y: -4 }}
              className="flex flex-col items-center gap-4 rounded-3xl bg-white shadow-md hover:shadow-lg transition-all px-6 py-8"
            >
              <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden">
                <img src={category.image} alt={category.name} className="h-12 w-12 object-contain" />
              </div>
              <p className="text-center text-sm font-semibold text-slate-800 leading-snug">
                {category.name}
              </p>
            </motion.button>
          ))}
        </div>

        <div className="md:hidden py-8">
          <div className="grid grid-cols-3 gap-4">
            {mentorCategories.map((category, index) => (
              <motion.button
                key={category.id}
                type="button"
                onClick={() => navigate(`/mentors/category/${category.id}`)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="flex flex-col items-center gap-2 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all p-3"
              >
                <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden">
                  <img src={category.image} alt={category.name} className="h-10 w-10 object-contain" />
                </div>
                <p className="text-[11px] font-medium text-center text-slate-700 leading-tight">
                  {category.name}
                </p>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorCategoryPage;
