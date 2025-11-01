const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  // Prepare headers object
  const headers = {};

  // Set Content-Type based on body type (unless skipJsonHeaders is true or FormData)
  if (!options.skipJsonHeaders && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  // Merge custom headers (should override defaults)
  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  // Handle body
  let body;
  if (options.body instanceof FormData) {
    // FormData - browser will set Content-Type with boundary automatically
    body = options.body;
    // Remove Content-Type header for FormData so browser can set it with boundary
    delete headers['Content-Type'];
  } else if (options.body && typeof options.body === 'string') {
    // Body already stringified - ensure Content-Type is set
    if (!headers['Content-Type'] && !options.skipJsonHeaders) {
      headers['Content-Type'] = 'application/json';
    }
    body = options.body;
  } else if (options.body && typeof options.body === 'object') {
    // Object body - stringify and ensure Content-Type is set
    if (!options.skipJsonHeaders) {
      headers['Content-Type'] = 'application/json';
    }
    body = JSON.stringify(options.body);
  } else {
    // No body or other types
    body = options.body;
  }

  const config = {
    method: options.method || 'GET',
    headers,
    body,
  };

  // Copy other options (except what we've already processed)
  Object.keys(options).forEach(key => {
    if (!['method', 'headers', 'body', 'skipJsonHeaders'].includes(key)) {
      config[key] = options[key];
    }
  });

  console.log('🔗 API Call:', {
    url,
    method: config.method || 'GET',
    headers: config.headers,
    body: config.body,
    timestamp: new Date().toISOString()
  });

  try {
    const response = await fetch(url, config);

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Backend server returned invalid response. Make sure the backend is running at http://localhost:5000');
    }

    const data = await response.json();

    if (!response.ok) {

      // Handle validation errors specifically
      if (data.errors && Array.isArray(data.errors)) {
        const errorMessages = data.errors.map(err => err.msg || err.message || err).join(', ');
        const error = new Error(errorMessages || data.message || 'Validation failed');
        error.errors = data.errors.map(err => err.msg || err.message || err);
        throw error;
      }

      const error = new Error(data.message || data.error || 'Something went wrong');
      if (data.error) error.error = data.error;
      throw error;
    }

    return data;
  } catch (error) {
    console.error('❌ API call failed:', {
      error: error.message,
      url,
      method: config.method || 'GET',
      body: config.body,
      timestamp: new Date().toISOString()
    });
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to backend server. Please make sure the server is running at http://localhost:5000');
    }
    throw error;
  }
};

// Auth API calls
export const authAPI = {
  // Register user
  register: async (userData) => {
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Login user
  login: async (credentials) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Verify OTP
  verifyOTP: async (otpData) => {
    return apiCall('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify(otpData),
    });
  },

  // Resend OTP
  resendOTP: async (phone, purpose) => {
    return apiCall('/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, purpose }),
    });
  },
  sendLoginOTP: async (phone) => {
    return apiCall('/auth/login-otp', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  },

  // Get current user
  getMe: async (token) => {
    return apiCall('/auth/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Upload profile image
  uploadProfileImage: async (token, file) => {
    const formData = new FormData();
    formData.append('image', file);
    return apiCall('/auth/profile/image', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
  },
};

// Admin API calls
export const adminAPI = {
  // Login admin
  login: async (credentials) => {
    return apiCall('/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Get current admin
  getMe: async (token) => {
    return apiCall('/admin/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Change admin password
  changePassword: async (token, passwordData) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    return apiCall('/admin/change-password', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
      body: JSON.stringify(passwordData),
    });
  },

  // Get dashboard statistics
  getDashboardStats: async (token) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    return apiCall('/admin/dashboard/stats', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
    });
  },

  // Get all mentor bookings (admin)
  getAllMentorBookings: async (token, params = {}) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/admin/mentor-bookings${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
    });
  },

  // Get all users (Admin management)
  getAllUsers: async (token, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/admin/users${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Get user by ID (Admin management)
  getUserById: async (token, userId) => {
    return apiCall(`/admin/users/${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Update user (Admin management)
  updateUser: async (token, userId, updateData) => {
    return apiCall(`/admin/users/${userId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });
  },

  // Delete user (Admin management)
  deleteUser: async (token, userId) => {
    return apiCall(`/admin/users/${userId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Deactivate/activate user (Admin management)
  deactivateUser: async (token, userId) => {
    return apiCall(`/admin/users/${userId}/deactivate`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Get all mentors (Admin management)
  getAllMentors: async (token, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/admin/mentors${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Get all companies (Admin management)
  getAllCompanies: async (token, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/admin/companies${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Get all CAs (Admin management)
  getAllCAs: async (token) => {
    return apiCall('/admin/cas', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Deactivate company (Admin management)
  deactivateCompany: async (token, companyId) => {
    return apiCall(`/admin/companies/${companyId}/deactivate`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Delete company (Admin management)
  deleteCompany: async (token, companyId) => {
    return apiCall(`/admin/companies/${companyId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Deactivate mentor (Admin management)
  deactivateMentor: async (token, mentorId) => {
    return apiCall(`/admin/mentors/${mentorId}/deactivate`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Delete mentor (Admin management)
  deleteMentor: async (token, mentorId) => {
    return apiCall(`/admin/mentors/${mentorId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Deactivate CA (Admin management)
  deactivateCA: async (token, caId) => {
    return apiCall(`/admin/cas/${caId}/deactivate`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Delete CA (Admin management)
  deleteCA: async (token, caId) => {
    return apiCall(`/admin/cas/${caId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Mark legal payment as settled
  markLegalSettlement: async (token, paymentId) => {
    return apiCall(`/admin/legal-payments/${paymentId}/settle`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Mark mentor payment as settled
  markMentorSettlement: async (token, paymentId) => {
    return apiCall(`/admin/mentor-payments/${paymentId}/settle`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

// Loans (Public) API calls
export const loansAPI = {
  // Get schemes list (public)
  getSchemes: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const qs = query ? `?${query}` : '';
    return apiCall(`/loans/schemes${qs}`, {
      method: 'GET',
    });
  },

  // Get single scheme by id (public)
  getSchemeById: async (id) => {
    return apiCall(`/loans/schemes/${id}`, {
      method: 'GET',
    });
  },
};

// Admin Loans API calls
export const adminLoansAPI = {
  // Create loan scheme (admin) - supports file upload
  createScheme: async (token, payload, imageFile = null) => {
    // If image file is provided, use FormData
    if (imageFile) {
      const formData = new FormData();

      // Append all fields to formData
      Object.keys(payload).forEach(key => {
        if (key === 'benefits' || key === 'eligibility' || key === 'documents') {
          // Handle arrays
          if (Array.isArray(payload[key])) {
            formData.append(key, JSON.stringify(payload[key]));
          }
        } else if (key === 'featured' || key === 'popular') {
          // Handle booleans
          formData.append(key, payload[key]);
        } else {
          // Always append value, even if empty string
          formData.append(key, payload[key] ?? '');
        }
      });

      // Append the image file
      formData.append('image', imageFile);

      return apiCall(`/admin/loans/schemes`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type for FormData - browser will set it with boundary
        },
        body: formData,
        skipJsonHeaders: true, // Don't set JSON headers
      });
    }

    // Otherwise, use JSON
    return apiCall(`/admin/loans/schemes`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  },

  // Update loan scheme (admin) - supports file upload
  updateScheme: async (token, id, payload, imageFile = null) => {
    // If image file is provided, use FormData
    if (imageFile) {
      const formData = new FormData();

      // Append all fields to formData
      Object.keys(payload).forEach(key => {
        if (key === 'benefits' || key === 'eligibility' || key === 'documents') {
          // Handle arrays
          if (Array.isArray(payload[key])) {
            formData.append(key, JSON.stringify(payload[key]));
          }
        } else if (key === 'featured' || key === 'popular') {
          // Handle booleans
          formData.append(key, payload[key]);
        } else {
          // Always append value, even if empty string
          formData.append(key, payload[key] ?? '');
        }
      });

      // Append the image file
      formData.append('image', imageFile);

      return apiCall(`/admin/loans/schemes/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
        skipJsonHeaders: true,
      });
    }

    // Otherwise, use JSON
    return apiCall(`/admin/loans/schemes/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  },

  // Delete loan scheme (admin)
  deleteScheme: async (token, id) => {
    return apiCall(`/admin/loans/schemes/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Toggle active status (admin)
  toggleStatus: async (token, id) => {
    return apiCall(`/admin/loans/schemes/${id}/status`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Stats (admin)
  getStats: async (token) => {
    return apiCall(`/admin/loans/schemes/stats`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

// Company API calls
export const companyAPI = {
  // Register company
  register: async (companyData) => {
    return apiCall('/company/register', {
      method: 'POST',
      body: JSON.stringify(companyData),
    });
  },

  // Login company
  login: async (credentials) => {
    return apiCall('/company/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Get current company
  getMe: async (token) => {
    return apiCall('/company/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Update company profile
  updateProfile: async (token, profileData, registrationFile = null, gstFile = null) => {
    // If files are provided, use FormData
    if (registrationFile || gstFile) {
      const formData = new FormData();

      // Append all profile fields to formData
      Object.keys(profileData).forEach(key => {
        if (profileData[key] !== null && profileData[key] !== undefined) {
          // Handle address or other objects
          if (typeof profileData[key] === 'object') {
            formData.append(key, JSON.stringify(profileData[key]));
          } else {
            formData.append(key, profileData[key]);
          }
        }
      });

      // Append files if provided
      if (registrationFile) {
        formData.append('registrationCertificate', registrationFile);
      }

      if (gstFile) {
        formData.append('gstCertificate', gstFile);
      }

      return apiCall('/company/profile', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
        skipJsonHeaders: true,
      });
    }

    // Otherwise, use JSON
    return apiCall('/company/profile', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });
  },
};

// Internship API calls
export const internshipAPI = {
  // Get all internships
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/internships${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    });
  },

  // Get single internship
  getById: async (id) => {
    return apiCall(`/internships/${id}`, {
      method: 'GET',
    });
  },

  // Company: Create internship
  create: async (token, internshipData) => {
    return apiCall('/internships', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: internshipData, // Pass object, let apiCall handle stringification
    });
  },

  // Company: Get my internships
  getMyInternships: async (token) => {
    return apiCall('/internships/company/my-internships', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Company: Update internship
  update: async (token, id, updateData) => {
    return apiCall(`/internships/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: updateData, // Pass object, let apiCall handle stringification
    });
  },

  // Company: Delete internship
  delete: async (token, id) => {
    return apiCall(`/internships/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

// Application API calls
export const applicationAPI = {
  // Apply to internship
  apply: async (token, applicationData) => {
    // Ensure token is valid and clean
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }

    // Clean token (remove any quotes or whitespace)
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');

    // If applicationData is FormData, don't set Content-Type (browser will set it with boundary)
    const isFormData = applicationData instanceof FormData;

    return apiCall('/applications', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
        // Don't set Content-Type for FormData - browser will set it with boundary
      },
      body: applicationData,
      skipJsonHeaders: isFormData, // Skip JSON headers for FormData
    });
  },

  // Get single application
  getById: async (token, id) => {
    return apiCall(`/applications/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Company: Get my applications
  getCompanyApplications: async (token, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/applications/company/my-applications${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // User: Get my applications
  getMyApplications: async (token, params = {}) => {
    // Ensure token is valid and clean
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }

    // Clean token (remove any quotes or whitespace)
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');

    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/applications/user/my-applications${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
    });
  },

  // Company: Update application status
  updateStatus: async (token, id, status, notes = '') => {
    return apiCall(`/applications/${id}/status`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status, notes }),
    });
  },

  // Company: View application
  view: async (token, id) => {
    return apiCall(`/applications/${id}/view`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Download resume (Company only)
  downloadResume: async (applicationId, token) => {
    try {
      const baseURL = API_BASE_URL;
      // Get the download URL
      const response = await fetch(`${baseURL}/applications/${applicationId}/resume`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to download resume: ${response.status}`);
      }

      // Get the blob
      const blob = await response.blob();

      // Create blob URL and trigger download
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;

      // Get filename from Content-Disposition header or use default
      const contentDisposition = response.headers.get('Content-Disposition');
      let fileName = 'resume.pdf';
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch) {
          fileName = fileNameMatch[1];
        }
      }

      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      window.URL.revokeObjectURL(blobUrl);

      return { success: true };
    } catch (error) {
      console.error('Download resume error:', error);
      throw error;
    }
  },
};

// Mentor API calls
export const mentorAPI = {
  // Register mentor
  register: async (mentorData) => {
    return apiCall('/mentors/register', {
      method: 'POST',
      body: JSON.stringify(mentorData),
    });
  },

  // Login mentor
  login: async (credentials) => {
    return apiCall('/mentors/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Get current mentor
  getMe: async (token) => {
    return apiCall('/mentors/me/profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Update mentor profile
  updateProfile: async (token, profileData) => {
    return apiCall('/mentors/profile', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });
  },

  // Upload mentor profile image
  uploadProfileImage: async (token, file) => {
    const formData = new FormData();
    formData.append('image', file);
    return apiCall('/mentors/profile/image', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
  },

  // Get all mentors (public)
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/mentors${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    });
  },

  // Get mentor by ID (public)
  getById: async (id) => {
    return apiCall(`/mentors/${id}`, {
      method: 'GET',
    });
  },

  // Mentor: Get dashboard bookings
  getMentorBookings: async (token, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/mentors/dashboard/bookings${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Mentor: Update booking status
  updateBookingStatus: async (token, bookingId, status, date, time, sessionLink, rejectReason) => {
    const body = { status };
    if (date) body.date = date;
    if (time) body.time = time;
    if (sessionLink) body.sessionLink = sessionLink;
    if (status === 'rejected' && rejectReason) body.reason = rejectReason;
    return apiCall(`/mentors/bookings/${bookingId}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
  },
};

// Mentor Booking API calls (for users)
export const mentorBookingAPI = {
  // Create booking
  create: async (token, mentorId, bookingData) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    return apiCall(`/mentors/${mentorId}/book`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
      body: JSON.stringify(bookingData),
    });
  },

  // Create Razorpay order
  createOrder: async (token, bookingId) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    return apiCall(`/mentors/bookings/${bookingId}/create-order`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
    });
  },

  // Update payment status
  updatePayment: async (token, bookingId, paymentData) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    return apiCall(`/mentors/bookings/${bookingId}/payment`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
      body: JSON.stringify(paymentData),
    });
  },

  // Get user bookings
  getMyBookings: async (token, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    return apiCall(`/mentors/my-bookings${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
    });
  },

  getById: async (token, bookingId) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    return apiCall(`/mentors/bookings/${bookingId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
    });
  },
};

// Training API calls (for users)
export const trainingAPI = {
  // Get all published courses (public)
  getCourses: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/training/courses${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    });
  },

  // Get course by ID (public)
  getCourseById: async (courseId) => {
    return apiCall(`/training/courses/${courseId}`, {
      method: 'GET',
    });
  },

  // Enroll in course (user)
  enroll: async (token, courseId) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    return apiCall(`/training/courses/${courseId}/enroll`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
    });
  },

  // Get user's progress (user)
  getMyProgress: async (token, params = {}) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/training/my-progress${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
    });
  },

  // Complete topic (user)
  completeTopic: async (token, courseId, topicId) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    return apiCall(`/training/progress/${courseId}/complete-topic/${topicId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
    });
  },

  // Submit quiz (user)
  submitQuiz: async (token, quizId, answers) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    return apiCall(`/training/quizzes/${quizId}/submit`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
      body: JSON.stringify({ answers }),
    });
  },

  // Create certificate order (user)
  createCertificateOrder: async (token, courseId) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    return apiCall(`/training/certificate/${courseId}/create-order`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
    });
  },

  // Update certificate payment (user)
  updateCertificatePayment: async (token, courseId, paymentData) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    return apiCall(`/training/certificate/${courseId}/payment`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
      body: JSON.stringify(paymentData),
    });
  },
};

// Legal Service API calls (for users)
export const legalServiceAPI = {
  // Get all legal services
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/legal/services${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    });
  },

  // Get legal service by ID
  getById: async (serviceId) => {
    return apiCall(`/legal/services/${serviceId}`, {
      method: 'GET',
    });
  }
};

// CA API calls
export const caAPI = {
  // CA Login
  login: async (credentials) => {
    return apiCall('/ca/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Get CA Profile
  getProfile: async (token) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    return apiCall('/ca/profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
    });
  },

  // Update CA Profile
  updateProfile: async (token, profileData) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    return apiCall('/ca/profile', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
      body: JSON.stringify(profileData),
    });
  }
};

// Admin CA API calls
export const adminCAAPI = {
  // Register CA (Admin only - only one CA can exist)
  register: async (token, caData) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    return apiCall('/ca/admin/register', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
      body: JSON.stringify(caData),
    });
  },

  // Get payment history for legal services (Admin only - completed submissions)
  getPaymentHistory: async (token) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    return apiCall('/admin/legal-payments', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
    });
  },

  // Get CA (Admin)
  getCA: async (token) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    return apiCall('/ca/admin', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
    });
  },

  // Update CA (Admin)
  updateCA: async (token, caData) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    return apiCall('/ca/admin', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
      body: JSON.stringify(caData),
    });
  },

  // Delete CA (Admin)
  deleteCA: async (token) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    return apiCall('/ca/admin', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
    });
  }
};

// CA Legal Service API calls
export const caLegalServiceAPI = {
  // Get all services (CA)
  getAll: async (token) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    return apiCall('/ca/legal-services', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
    });
  },

  // Create service
  create: async (token, serviceData) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    return apiCall('/ca/legal-services', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
      body: JSON.stringify(serviceData),
    });
  },

  // Update service
  update: async (token, serviceId, serviceData) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    return apiCall(`/ca/legal-services/${serviceId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
      body: JSON.stringify(serviceData),
    });
  },

  // Delete service
  delete: async (token, serviceId) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    return apiCall(`/ca/legal-services/${serviceId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
    });
  }
};

// Legal Submission API calls (for users)
export const legalSubmissionAPI = {
  // Create submission with documents
  create: async (token, serviceId, category, files) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');

    const formData = new FormData();
    formData.append('serviceId', serviceId);
    if (category) {
      formData.append('category', category);
    }
    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append('documents', file);
      });
    }

    return apiCall('/legal/submissions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
      body: formData,
      skipJsonHeaders: true,
    });
  },

  // Create Razorpay order
  createOrder: async (token, submissionId) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    return apiCall(`/legal/submissions/${submissionId}/create-order`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
    });
  },

  // Update payment
  updatePayment: async (token, submissionId, paymentData) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    return apiCall(`/legal/submissions/${submissionId}/payment`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
      body: JSON.stringify(paymentData),
    });
  },

  // Get user's submissions
  getUserSubmissions: async (token) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    return apiCall('/legal/submissions', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
    });
  },

  // Get submission by ID
  getById: async (token, submissionId) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    return apiCall(`/legal/submissions/${submissionId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
    });
  }
};

// CA Legal Submission API calls
export const caLegalSubmissionAPI = {
  // Get all submissions (CA)
  getAll: async (token, status = null) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    const url = status ? `/ca/submissions?status=${status}` : '/ca/submissions';
    return apiCall(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
    });
  },

  // Get submission by ID (CA)
  getById: async (token, submissionId) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    return apiCall(`/ca/submissions/${submissionId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
    });
  },

  // Update submission status (CA)
  updateStatus: async (token, submissionId, statusData) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    return apiCall(`/ca/submissions/${submissionId}/status`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
      body: JSON.stringify(statusData),
    });
  }
};

// Admin Training API calls
export const adminTrainingAPI = {
  // Get all courses (admin)
  getAllCourses: async (token) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    return apiCall('/admin/training/courses', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
    });
  },

  // Get course by ID (admin)
  getCourseById: async (token, courseId) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    return apiCall(`/admin/training/courses/${courseId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
    });
  },

  // Create course (admin) - supports file upload
  createCourse: async (token, courseData, imageFile = null) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');

    // If image file is provided, use FormData
    if (imageFile) {
      const formData = new FormData();

      // Append all fields to formData
      Object.keys(courseData).forEach(key => {
        if (key === 'certificate' || key === 'autoGenerateCert' || key === 'isActive' || key === 'isPublished') {
          // Handle booleans
          formData.append(key, courseData[key]);
        } else {
          // Always append value, even if empty string
          formData.append(key, courseData[key] ?? '');
        }
      });

      // Append the image file
      formData.append('image', imageFile);

      return apiCall('/admin/training/courses', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${cleanToken}`,
          // Don't set Content-Type for FormData - browser will set it with boundary
        },
        body: formData,
      });
    } else {
      // No image file, send as JSON
      return apiCall('/admin/training/courses', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${cleanToken}`,
        },
        body: JSON.stringify(courseData),
      });
    }
  },

  // Update course (admin) - supports file upload
  updateCourse: async (token, courseId, courseData, imageFile = null) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');

    // If image file is provided, use FormData
    if (imageFile) {
      const formData = new FormData();

      // Append all fields to formData
      Object.keys(courseData).forEach(key => {
        if (key === 'certificate' || key === 'autoGenerateCert' || key === 'isActive' || key === 'isPublished') {
          // Handle booleans
          formData.append(key, courseData[key]);
        } else {
          // Always append value, even if empty string
          formData.append(key, courseData[key] ?? '');
        }
      });

      // Append the image file
      formData.append('image', imageFile);

      return apiCall(`/admin/training/courses/${courseId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${cleanToken}`,
          // Don't set Content-Type for FormData - browser will set it with boundary
        },
        body: formData,
      });
    } else {
      // No image file, send as JSON
      return apiCall(`/admin/training/courses/${courseId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${cleanToken}`,
        },
        body: JSON.stringify(courseData),
      });
    }
  },

  // Delete course (admin)
  deleteCourse: async (token, courseId) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    return apiCall(`/admin/training/courses/${courseId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
    });
  },

  // Toggle course publish status (admin)
  toggleCoursePublish: async (token, courseId) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    return apiCall(`/admin/training/courses/${courseId}/publish`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
    });
  },

  // Get all user progress with certificates and quiz completion (admin)
  getUserProgress: async (token, params = {}) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/admin/training/user-progress${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
    });
  },

  // Create module (admin)
  createModule: async (token, courseId, moduleData) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    return apiCall(`/admin/training/courses/${courseId}/modules`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
      body: JSON.stringify(moduleData),
    });
  },

  // Update module (admin)
  updateModule: async (token, moduleId, moduleData) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    return apiCall(`/admin/training/modules/${moduleId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
      body: JSON.stringify(moduleData),
    });
  },

  // Delete module (admin)
  deleteModule: async (token, moduleId) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    return apiCall(`/admin/training/modules/${moduleId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
    });
  },

  // Create topic (admin)
  createTopic: async (token, moduleId, topicData) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    return apiCall(`/admin/training/modules/${moduleId}/topics`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
      body: JSON.stringify(topicData),
    });
  },

  // Update topic (admin)
  updateTopic: async (token, topicId, topicData) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    return apiCall(`/admin/training/topics/${topicId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
      body: JSON.stringify(topicData),
    });
  },

  // Delete topic (admin)
  deleteTopic: async (token, topicId) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    return apiCall(`/admin/training/topics/${topicId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
    });
  },

  // Create quiz (admin)
  createQuiz: async (token, topicId, quizData) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    return apiCall(`/admin/training/topics/${topicId}/quizzes`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
      body: JSON.stringify(quizData),
    });
  },

  // Update quiz (admin)
  updateQuiz: async (token, quizId, quizData) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    return apiCall(`/admin/training/quizzes/${quizId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
      body: JSON.stringify(quizData),
    });
  },

  // Delete quiz (admin)
  deleteQuiz: async (token, quizId) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    return apiCall(`/admin/training/quizzes/${quizId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
    });
  },
};

// Admin Payments API calls
export const adminPaymentsAPI = {
  // Get all payments (admin)
  getAllPayments: async (token, params = {}) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/admin/payments${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
    });
  },
};

// Banner API calls (public)
export const bannerAPI = {
  // Get all banners
  getAllBanners: async () => {
    return apiCall('/banners', {
      method: 'GET',
    });
  },
};

// Admin Banner API calls
export const adminBannerAPI = {
  // Get all banners (admin)
  getAllBanners: async (token) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    return apiCall('/admin/banners', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
    });
  },

  // Create banner (admin)
  createBanner: async (token, formData) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    return apiCall('/admin/banners', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
      body: formData,
      skipJsonHeaders: true,
    });
  },

  // Update banner (admin)
  updateBanner: async (token, bannerId, formData) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    return apiCall(`/admin/banners/${bannerId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
      body: formData,
      skipJsonHeaders: true,
    });
  },

  // Delete banner (admin)
  deleteBanner: async (token, bannerId) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    return apiCall(`/admin/banners/${bannerId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
    });
  },
};

// Web Development API calls (public)
export const webDevelopmentAPI = {
  // Submit project request
  submitProject: async (projectData) => {
    return apiCall('/web-development/submit', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  },
};

// Bank Account API calls (public)
export const bankAccountAPI = {
  // Submit bank account opening form
  submitForm: async (formData) => {
    return apiCall('/bank-account/submit', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  },
};

// Admin Web Development API calls
export const adminWebDevelopmentAPI = {
  // Get all leads (admin)
  getAllLeads: async (token, params = {}) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/admin/web-development/leads${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
    });
  },

  // Get lead by ID (admin)
  getLeadById: async (token, leadId) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    return apiCall(`/admin/web-development/leads/${leadId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
    });
  },

  // Update lead status (admin)
  updateLeadStatus: async (token, leadId, statusData) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    return apiCall(`/admin/web-development/leads/${leadId}/status`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
      body: JSON.stringify(statusData),
    });
  },

  // Delete lead (admin)
  deleteLead: async (token, leadId) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    return apiCall(`/admin/web-development/leads/${leadId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
    });
  },
};

// Admin Bank Account API calls (Master Admin only)
export const adminBankAccountAPI = {
  // Get all bank leads (master admin only)
  getAllLeads: async (token, params = {}) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/admin/bank-account/leads${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
    });
  },

  // Get bank lead by ID (master admin only)
  getLeadById: async (token, leadId) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    return apiCall(`/admin/bank-account/leads/${leadId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
    });
  },

  // Update bank lead status (master admin only)
  updateLeadStatus: async (token, leadId, statusData) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    return apiCall(`/admin/bank-account/leads/${leadId}/status`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
      body: JSON.stringify(statusData),
    });
  },

  // Delete bank lead (master admin only)
  deleteLead: async (token, leadId) => {
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Authentication token is missing. Please login again.');
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    return apiCall(`/admin/bank-account/leads/${leadId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
    });
  },
};

export default { authAPI, adminAPI, companyAPI, internshipAPI, applicationAPI, loansAPI, adminLoansAPI, mentorAPI, mentorBookingAPI, caAPI, adminCAAPI, legalServiceAPI, caLegalServiceAPI, legalSubmissionAPI, caLegalSubmissionAPI, trainingAPI, adminTrainingAPI, adminPaymentsAPI, bannerAPI, adminBannerAPI, webDevelopmentAPI, adminWebDevelopmentAPI, bankAccountAPI, adminBankAccountAPI };

