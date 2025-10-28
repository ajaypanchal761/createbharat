const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: {
      // Only set JSON header if not uploading files
      ...(!options.skipJsonHeaders && { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
    ...options,
  };

  // Don't stringify body if it's FormData (file upload)
  if (options.body instanceof FormData) {
    delete config.headers['Content-Type']; // Let browser set boundary
  }

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
    console.error('❌ API call failed:', error);
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

export default { authAPI, adminAPI, loansAPI, adminLoansAPI };

