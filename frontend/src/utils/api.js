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
        const errorMessages = data.errors.map(err => err.msg || err.message).join(', ');
        throw new Error(errorMessages || data.message || 'Validation failed');
      }

      throw new Error(data.message || data.error || 'Something went wrong');
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
  updateProfile: async (token, profileData) => {
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
    if(date) body.date = date;
    if(time) body.time = time;
    if(sessionLink) body.sessionLink = sessionLink;
    if(status === 'rejected' && rejectReason) body.reason = rejectReason;
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
    const cleanToken = token.trim().replace(/^(["'])|\1$/g, '');
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
    const cleanToken = token.trim().replace(/^(["'])|\1$/g, '');
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
    const cleanToken = token.trim().replace(/^(["'])|\1$/g, '');
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
    const cleanToken = token.trim().replace(/^(["'])|\1$/g, '');
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
    const cleanToken = token.trim().replace(/^(["'])|\1$/g, '');
    return apiCall(`/mentors/bookings/${bookingId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
    });
  },
};

export default { authAPI, adminAPI, companyAPI, internshipAPI, applicationAPI, loansAPI, adminLoansAPI, mentorAPI, mentorBookingAPI };

