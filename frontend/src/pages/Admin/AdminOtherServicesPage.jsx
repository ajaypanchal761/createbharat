import React, { useEffect, useMemo, useState, useCallback } from 'react';
import AdminBreadcrumb from '../../components/admin/AdminBreadcrumb';
import { OTHER_CATEGORIES } from '../Other/OtherServicesPage';
import { adminOtherServiceAPI } from '../../utils/api';

const formatDate = (iso) => {
  if (!iso) return '';
  const date = new Date(iso);
  return date.toLocaleString();
};

const AdminOtherServicesPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categoryLookup = useMemo(() => {
    const map = {};
    OTHER_CATEGORIES.forEach((c) => {
      map[c.id] = c.name;
    });
    return map;
  }, []);

  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('adminToken');
      const response = await adminOtherServiceAPI.getAll(token, filter ? { search: filter } : {});
      if (response?.success) {
        setSubmissions(response.data || []);
      } else {
        setError(response?.message || 'Failed to load submissions');
      }
    } catch (err) {
      console.error('Fetch Other Service submissions error:', err);
      setError(err?.message || 'Failed to load submissions');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  return (
    <div className="p-6 space-y-6">
      <AdminBreadcrumb
        items={[
          { label: 'Admin', href: '/admin' },
          { label: 'Other Service', href: '/admin/other-services' },
        ]}
        title="Other Service Requests"
        subtitle="Submissions from Other Service forms"
      />

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Submissions</h2>
            <p className="text-sm text-gray-600">
              User details and category of their Other Service requests.
            </p>
          </div>
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search by name, email, phone, city, or category"
            className="w-full md:w-80 rounded-xl border border-gray-200 px-4 py-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
          />
        </div>

        <div className="mt-4 overflow-x-auto">
          {loading ? (
            <div className="py-10 text-center text-sm text-gray-500">Loading submissions...</div>
          ) : error ? (
            <div className="py-10 text-center text-sm text-red-600">{error}</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    City
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Submitted At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {submissions.length === 0 ? (
                  <tr>
                    <td
                      className="px-4 py-6 text-center text-sm text-gray-500"
                      colSpan={6}
                    >
                      No submissions yet.
                    </td>
                  </tr>
                ) : (
                  submissions.map((item) => (
                    <tr key={item._id || item.id}>
                      <td className="px-4 py-3 text-sm text-gray-900 font-semibold">
                        {categoryLookup[item.categoryId] || item.categoryName || '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {item.fullName || '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        <div className="flex flex-col">
                          <span>{item.email || '—'}</span>
                          <span className="text-gray-500 text-xs">
                            {item.phone || ''}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {item.city || '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800 max-w-xs">
                        <div className="whitespace-pre-wrap break-words">
                          {item.details || '—'}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatDate(item.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOtherServicesPage;

