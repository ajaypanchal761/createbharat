import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaDownload, FaFile, FaUser, FaEnvelope, FaPhone, FaCalendar, FaTag } from 'react-icons/fa';

const UserSubmissionDetailsModal = ({ submission, isOpen, onClose }) => {
  if (!isOpen || !submission) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">User Submission Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto overscroll-contain">
            {/* User Information */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaUser className="text-blue-600" />
                User Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Full Name</p>
                  <p className="font-medium text-gray-900">{submission.userName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="font-medium text-gray-900 flex items-center gap-2">
                    <FaEnvelope className="text-gray-400" />
                    {submission.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Phone</p>
                  <p className="font-medium text-gray-900 flex items-center gap-2">
                    <FaPhone className="text-gray-400" />
                    {submission.phone}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Submitted Date</p>
                  <p className="font-medium text-gray-900 flex items-center gap-2">
                    <FaCalendar className="text-gray-400" />
                    {submission.submittedDate}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Service</p>
                  <p className="font-medium text-gray-900">{submission.serviceName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    submission.status === 'pending'
                      ? 'bg-orange-100 text-orange-600'
                      : submission.status === 'in-progress'
                      ? 'bg-blue-100 text-blue-600'
                      : submission.status === 'completed'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {submission.status}
                  </span>
                </div>
                {submission.address && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600 mb-1">Address</p>
                    <p className="font-medium text-gray-900">{submission.address}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Additional User Details */}
            {(submission.additionalDetails || submission.companyName || submission.panNumber) && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4">
                  {submission.companyName && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Company Name</p>
                      <p className="font-medium text-gray-900">{submission.companyName}</p>
                    </div>
                  )}
                  {submission.panNumber && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">PAN Number</p>
                      <p className="font-medium text-gray-900">{submission.panNumber}</p>
                    </div>
                  )}
                  {submission.gstType && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">GST Type</p>
                      <p className="font-medium text-gray-900">{submission.gstType}</p>
                    </div>
                  )}
                  {submission.additionalDetails && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600 mb-1">Additional Details</p>
                      <p className="font-medium text-gray-900">{submission.additionalDetails}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Uploaded Documents */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaFile className="text-blue-600" />
                Uploaded Documents ({submission.documents?.length || 0})
              </h3>
              
              {submission.documents && submission.documents.length > 0 ? (
                <div className="space-y-3">
                  {submission.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all bg-white"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FaFile className="text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{doc.name || doc.documentName || `Document ${index + 1}`}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                              {doc.type && <span>Type: {doc.type}</span>}
                              {doc.size && <span>Size: {doc.size}</span>}
                              {doc.uploadDate && <span>Uploaded: {doc.uploadDate}</span>}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {doc.file && (
                            <button
                              onClick={() => {
                                // Handle download
                                if (doc.file instanceof File) {
                                  const url = URL.createObjectURL(doc.file);
                                  const a = document.createElement('a');
                                  a.href = url;
                                  a.download = doc.file.name;
                                  a.click();
                                  URL.revokeObjectURL(url);
                                } else if (doc.url) {
                                  window.open(doc.url, '_blank');
                                }
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Download"
                            >
                              <FaDownload />
                            </button>
                          )}
                          {doc.url && (
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View"
                            >
                              <FaFile />
                            </a>
                          )}
                        </div>
                      </div>
                      {doc.preview && (
                        <div className="mt-3">
                          <img
                            src={doc.preview}
                            alt={doc.name}
                            className="max-w-full h-auto rounded-lg border border-gray-200"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50">
                  <FaFile className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No documents uploaded yet</p>
                </div>
              )}
            </div>

            {/* Payment Information */}
            {submission.paymentStatus && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaTag className="text-blue-600" />
                  Payment Information
                </h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Payment Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        submission.paymentStatus === 'paid'
                          ? 'bg-green-100 text-green-600'
                          : submission.paymentStatus === 'pending'
                          ? 'bg-orange-100 text-orange-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {submission.paymentStatus}
                      </span>
                    </div>
                    {submission.paymentAmount && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Amount Paid</p>
                        <p className="font-medium text-gray-900">{submission.paymentAmount}</p>
                      </div>
                    )}
                    {submission.paymentDate && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Payment Date</p>
                        <p className="font-medium text-gray-900">{submission.paymentDate}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Notes/Comments */}
            {submission.notes && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes/Comments</h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{submission.notes}</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
            {submission.status === 'pending' && (
              <button
                onClick={() => {
                  // Handle status update
                  alert('Status update functionality will be implemented');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update Status
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default UserSubmissionDetailsModal;

