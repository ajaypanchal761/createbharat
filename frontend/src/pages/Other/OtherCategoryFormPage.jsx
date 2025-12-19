import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNavbar from '../../components/common/BottomNavbar';
import { OTHER_CATEGORIES } from './OtherServicesPage';
import { otherServiceAPI } from '../../utils/api';

const createInitialFormState = () => ({
  fullName: '',
  email: '',
  phone: '',
  city: '',
  details: '',
});

const OtherCategoryFormPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const categories = useMemo(() => OTHER_CATEGORIES, []);

  const category = categories.find((cat) => cat.id === categoryId);

  const [formData, setFormData] = useState(createInitialFormState);
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setStatus(null);

    if (!formData.fullName || !formData.email || !formData.phone) {
      setStatus({
        type: 'error',
        message: 'Please fill your name, email, and phone number.',
      });
      return;
    }

    if (!category) {
      setStatus({
        type: 'error',
        message: 'Invalid category selected.',
      });
      return;
    }

    const payload = {
      categoryId: category.id,
      categoryName: category.name,
      ...formData,
    };

    const submit = async () => {
      try {
        setSubmitting(true);
        const response = await otherServiceAPI.submit(payload);

        if (response?.success) {
          setStatus({
            type: 'success',
            message: `Request submitted for ${category.name}. We will reach out soon.`,
          });
          setFormData(createInitialFormState());
        } else {
          setStatus({
            type: 'error',
            message: response?.message || 'Failed to submit. Please try again.',
          });
        }
      } catch (error) {
        console.error('Submit Other Service error:', error);
        setStatus({
          type: 'error',
          message: error?.message || 'Failed to submit. Please try again.',
        });
      } finally {
        setSubmitting(false);
      }
    };

    submit();
  };

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 px-4">
        <div className="bg-white/90 border border-slate-100 shadow-xl rounded-2xl p-8 text-center space-y-4">
          <h1 className="text-2xl font-bold text-slate-900">Category not found</h1>
          <p className="text-slate-600 text-sm">
            The category you selected is unavailable. Please go back and choose another one.
          </p>
          <button
            onClick={() => navigate('/other')}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold px-5 py-3 rounded-xl shadow-md"
          >
            Go back
          </button>
        </div>
        <BottomNavbar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 pb-28">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-orange-50 text-orange-600 font-bold text-lg">
              {category.name?.charAt(0)}
            </div>
            <div>
              <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide">
                Other Services
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                {category.name}
              </h1>
            </div>
          </div>
          <button
            onClick={() => navigate('/other')}
            className="text-sm text-orange-600 font-semibold hover:underline"
          >
            Change category
          </button>
        </div>

        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 p-5 md:p-6 space-y-4">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-slate-900">Request form</h2>
            <p className="text-sm text-slate-600">
              Share your details for {category.name}. We will contact you soon.
            </p>
          </div>

          {status && (
            <div
              className={`rounded-lg px-4 py-3 text-sm ${
                status.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-100'
                  : 'bg-red-50 text-red-700 border border-red-100'
              }`}
            >
              {status.message}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">
                  Full Name *
                </label>
                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-slate-50 focus:outline-none focus:border-orange-400 focus:bg-white transition"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-slate-50 focus:outline-none focus:border-orange-400 focus:bg-white transition"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="10-digit mobile number"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-slate-50 focus:outline-none focus:border-orange-400 focus:bg-white transition"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">
                  City
                </label>
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="City / State"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-slate-50 focus:outline-none focus:border-orange-400 focus:bg-white transition"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                What do you need?
              </label>
              <textarea
                name="details"
                value={formData.details}
                onChange={handleInputChange}
                placeholder="Tell us a bit about your requirement"
                rows="4"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-slate-50 focus:outline-none focus:border-orange-400 focus:bg-white transition"
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: submitting ? 1 : 1.01, y: submitting ? 0 : -1 }}
              whileTap={{ scale: submitting ? 1 : 0.98 }}
              disabled={submitting}
              className={`w-full md:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-orange-200 ${
                submitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {submitting ? 'Submitting...' : 'Submit request'}
            </motion.button>
          </form>
        </div>
      </div>

      <BottomNavbar />
    </div>
  );
};

export default OtherCategoryFormPage;

