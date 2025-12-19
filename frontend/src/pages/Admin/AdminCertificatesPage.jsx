import React, { useEffect, useState } from 'react';
import { adminAPI, adminTrainingAPI } from '../../utils/api';

const AdminCertificatesPage = () => {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [assigned, setAssigned] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
    loadCourses();
    loadAssigned();
  }, []);

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await adminAPI.getAllUsers(token);
      if (response.success) {
        setUsers(response.data || []);
      }
    } catch (err) {
      console.error('Load users error:', err);
      setError(err.message || 'Failed to load users');
    }
  };

  const loadCourses = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await adminTrainingAPI.getAllCourses(token);
      if (response.success) {
        setCourses(response.data || []);
      }
    } catch (err) {
      console.error('Load courses error:', err);
      setError(err.message || 'Failed to load courses');
    }
  };

  const loadAssigned = async (filters = {}) => {
    try {
      setLoadingList(true);
      const token = localStorage.getItem('adminToken');
      const response = await adminTrainingAPI.listCertificates(token, filters);
      if (response.success) {
        setAssigned(response.data || []);
      }
    } catch (err) {
      console.error('Load certificates error:', err);
      setError(err.message || 'Failed to load certificates');
    } finally {
      setLoadingList(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!selectedUser || !selectedCourse) {
      setError('Select user and course');
      return;
    }
    if (!file) {
      setError('Upload a certificate file');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const payload = {
        userId: selectedUser,
        courseId: selectedCourse,
        certificateFile: file,
        notes,
      };
      const response = await adminTrainingAPI.assignCertificate(token, payload);
      if (response.success) {
        setMessage('Certificate assigned successfully.');
        setFile(null);
        setNotes('');
        loadAssigned();
      } else {
        setError(response.message || 'Failed to assign certificate');
      }
    } catch (err) {
      console.error('Assign certificate error:', err);
      setError(err.message || 'Failed to assign certificate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Certificates</h1>
        <p className="text-sm text-gray-600 mb-6">Upload and assign certificates to users for specific courses.</p>

        {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">{error}</div>}
        {message && <div className="mb-4 text-sm text-green-600 bg-green-50 border border-green-200 rounded p-3">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Select User</label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              required
            >
              <option value="">Choose user</option>
              {users.map((u) => (
                <option key={u._id || u.id} value={u._id || u.id}>
                  {u.firstName || u.name || u.email} {u.email ? `(${u.email})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Select Course</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              required
            >
              <option value="">Choose course</option>
              {courses.map((c) => (
                <option key={c._id || c.id} value={c._id || c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Certificate File (PDF/Image)</label>
            <input
              type="file"
              accept=".pdf,image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              rows={3}
              placeholder="Notes or remarks"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
          >
            {loading ? 'Assigning...' : 'Assign Certificate'}
          </button>
        </form>
      </div>

      {/* Assigned certificates list */}
      <div className="max-w-5xl mx-auto mt-6 bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Assigned Certificates</h2>
            <p className="text-sm text-gray-600">Only admin-uploaded certificates, most recent first.</p>
          </div>
          <div className="flex gap-2">
            <select
              onChange={(e) => loadAssigned({ courseId: e.target.value || undefined })}
              className="border rounded-lg px-3 py-2 text-sm"
              defaultValue=""
            >
              <option value="">All courses</option>
              {courses.map((c) => (
                <option key={c._id || c.id} value={c._id || c.id}>{c.title}</option>
              ))}
            </select>
            <select
              onChange={(e) => loadAssigned({ completedOnly: e.target.value === 'completed' ? 'true' : undefined })}
              className="border rounded-lg px-3 py-2 text-sm"
              defaultValue="all"
            >
              <option value="all">All users</option>
              <option value="completed">Completed only</option>
            </select>
          </div>
        </div>

        {loadingList ? (
          <div className="text-center text-gray-600 py-6">Loading...</div>
        ) : assigned.length === 0 ? (
          <div className="text-center text-gray-500 py-6">No certificates assigned yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">User</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">Course</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">Uploaded</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {assigned.map((row) => (
                  <tr key={row._id}>
                    <td className="px-3 py-2">
                      <div className="font-semibold text-gray-900">
                        {row.user?.firstName || row.user?.name || row.user?.email || 'User'}
                      </div>
                      <div className="text-xs text-gray-500">{row.user?.email}</div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="font-semibold text-gray-900">{row.course?.title || 'Course'}</div>
                      <div className="text-xs text-gray-500">{row.course?.provider}</div>
                    </td>
                    <td className="px-3 py-2 text-gray-700">
                      {row.certificateAdminUploadedAt
                        ? new Date(row.certificateAdminUploadedAt).toLocaleDateString()
                        : '—'}
                    </td>
                    <td className="px-3 py-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        Assigned
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCertificatesPage;

