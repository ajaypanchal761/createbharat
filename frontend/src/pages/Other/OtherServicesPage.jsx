import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import BottomNavbar from '../../components/common/BottomNavbar';

export const OTHER_CATEGORIES = [
  { id: 'marketing-growth', name: 'Marketing and Growth Services' },
  { id: 'paid-advertising', name: 'Paid Advertising' },
  { id: 'social-media-management', name: 'Social Media Management' },
  { id: 'creative-branding', name: 'Creative and Branding' },
  { id: 'content-media', name: 'Content and Media' },
  { id: 'business-consultancy', name: 'Business and Consultancy' },
  { id: 'custom-requirements', name: 'Custom Requirements' },
];

const OtherServicesPage = () => {
  const navigate = useNavigate();
  const categories = useMemo(() => OTHER_CATEGORIES, []);

  const goToCategory = (categoryId) => {
    navigate(`/other/${categoryId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 pb-28">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-3">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
            Other Services
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            Choose a category, then fill the form
          </h1>
          <p className="text-slate-600">
            Tap any category to open its detail page and submit your request.
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 p-5 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Categories</h2>
            <span className="text-xs text-slate-500">Tap to open form</span>
          </div>

          {categories.length === 0 ? (
            <p className="text-sm text-slate-600">
              No categories available right now.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  type="button"
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => goToCategory(category.id)}
                  className="w-full text-left rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-orange-300 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="h-9 w-9 flex items-center justify-center rounded-lg bg-orange-50 text-orange-600 font-semibold">
                      {category.name?.charAt(0)}
                    </div>
                    <span className="text-[11px] text-orange-600 font-semibold">
                      Open
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-slate-900 mt-3">
                    {category.name}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    See details and fill form
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNavbar />
    </div>
  );
};

export default OtherServicesPage;

