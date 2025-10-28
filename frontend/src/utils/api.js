const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log('🌐 Making API call to:', url);
  console.log('📝 Request options:', options);
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    console.log('🚀 Sending request...');
    const response = await fetch(url, config);
    console.log('📡 Response received:', response.status, response.statusText);

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Non-JSON response received:', response.status, response.statusText);
      throw new Error('Backend server returned invalid response. Make sure the backend is running at http://localhost:5000');
    }

    const data = await response.json();
    console.log('📄 Response data:', data);

    if (!response.ok) {
      console.error('❌ API Error:', data);
      
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

export default { authAPI };

