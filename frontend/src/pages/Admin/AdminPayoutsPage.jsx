import React, { useEffect, useState, useCallback } from 'react';
import AdminBreadcrumb from '../../components/admin/AdminBreadcrumb';
import { adminPayoutAPI } from '../../utils/api';

const AdminPayoutsPage = () => {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('');
  const [ownerType, setOwnerType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('adminToken');
      const params = {};
      if (filter) params.search = filter;
      if (ownerType) params.ownerType = ownerType;
      const response = await adminPayoutAPI.list(token, params);
      if (response?.success) {
        setItems(response.data || []);
      } else {
        setError(response?.message || 'Failed to load payout details');
      }
    } catch (err) {
      setError(err?.message || 'Failed to load payout details');
    } finally {
      setLoading(false);
    }
  }, [filter, ownerType]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="p-6 space-y-6">
      <AdminBreadcrumb
        items={[
          { label: 'Admin', href: '/admin' },
          { label: 'Payouts', href: '/admin/payouts' },
        ]}
        title="Payout Details"
        subtitle="Bank details submitted by mentors and CA"
      />

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex flex-wrap gap-3 items-center">
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search by name, bank, account, IFSC, UPI"
              className="w-full md:w-72 rounded-xl border border-gray-200 px-4 py-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
            />
            <select
              value={ownerType}
              onChange={(e) => setOwnerType(e.target.value)}
              className="w-full md:w-48 rounded-xl border border-gray-200 px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-sm"
            >
              <option value="">All Types</option>
              <option value="mentor">Mentor</option>
              <option value="ca">CA</option>
            </select>
            <button
              onClick={fetchData}
              className="px-3 py-2 bg-orange-600 text-white text-sm rounded-lg font-semibold shadow hover:bg-orange-700"
            >
              Refresh
            </button>
          </div>
          <div className="text-sm text-gray-500">
            Total: {items.length}
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          {loading ? (
            <div className="py-10 text-center text-sm text-gray-500">Loading payout details...</div>
          ) : error ? (
            <div className="py-10 text-center text-sm text-red-600">{error}</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Account Holder</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Bank</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Account</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">IFSC</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">UPI</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Updated</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {items.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-center text-sm text-gray-500" colSpan={7}>
                      No payout details found.
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item._id}>
                      <td className="px-4 py-3 text-sm text-gray-900 font-semibold capitalize">{item.ownerType}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{item.accountHolderName}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{item.bankName}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{item.accountNumber}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{item.ifsc}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{item.upiId || '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.updatedAt ? new Date(item.updatedAt).toLocaleString() : ''}</td>
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

export default AdminPayoutsPage;



