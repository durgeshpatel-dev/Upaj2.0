import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Don't set Content-Type for FormData - let browser handle it
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    // Enhanced debug logging
    console.log('🚀 API Request Starting...');
    console.log('📡 Method:', config.method?.toUpperCase());
    console.log('🔗 URL:', config.url);
    console.log('🏠 Base URL:', config.baseURL);
    console.log('🔗 Full URL:', config.baseURL + config.url);
    console.log('📋 Headers:', config.headers);
    console.log('📦 Data:', config.data);
    console.log('📦 Is FormData:', config.data instanceof FormData);
    console.log('🔑 Has Auth Token:', !!token);
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect if not already on login/signup pages
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  // User registration
  signup: async (userData) => {
    try {
      console.log('🚀 Starting signup...');
      console.log('📤 Signup data:', userData);
      
      const response = await api.post('/auth/signup', userData);
      
      console.log('📥 Signup response:', response);
      console.log('📥 Signup response data:', response.data);
      console.log('📥 Signup response status:', response.status);
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Signup error:', error);
      console.error('❌ Error response:', error.response);
      console.error('❌ Error status:', error.response?.status);
      console.error('❌ Error data:', error.response?.data);
      
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Signup failed' 
      };
    }
  },

  // Verify OTP
  verifyOTP: async (email, otp, userId) => {
    try {
      console.log('🔍 Starting OTP verification...');
      console.log('📧 Email:', email);
      console.log('🔢 OTP:', otp);
      console.log('👤 User ID:', userId);
      
      // Backend expects only userId and otp according to documentation
      const requestData = { userId, otp };
      console.log('📤 Sending request data:', requestData);
      
      const response = await api.post('/auth/verify-otp', requestData);
      console.log('📥 Raw response:', response);
      console.log('📥 Response status:', response.status);
      console.log('📥 Response data:', response.data);
      
      const resp = response.data || {}
      const user = resp.user || resp.data || resp
      const token = resp.token || resp.data?.token || resp.authToken || resp.accessToken || null
      
      console.log('✅ Parsed user:', user);
      console.log('🔑 Parsed token:', token ? 'Present' : 'Not found');
      
      return { success: true, data: { user, token } };
    } catch (error) {
      console.error('❌ OTP verification error:', error);
      console.error('❌ Error response:', error.response);
      console.error('❌ Error status:', error.response?.status);
      console.error('❌ Error data:', error.response?.data);
      console.error('❌ Error message:', error.message);
      
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'OTP verification failed' 
      };
    }
  },

  // Resend OTP
  resendOTP: async (email, userId) => {
    try {
      console.log('Resending OTP for user:', userId);
      // Backend expects only userId according to documentation
      const response = await api.post('/auth/resend-otp', { userId });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Resend OTP error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Failed to resend OTP' 
      };
    }
  },

  // User login
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      // Normalize different backend response shapes
      // Backend may return { user, token } or { data: { user, token } }
      const resp = response.data || {}
      const user = resp.user || resp.data?.user || resp
      // token may come in body or response headers
      const tokenFromBody = resp.token || resp.data?.token || resp.authToken || resp.accessToken
      const headerAuth = response.headers?.authorization || response.headers?.Authorization || response.headers?.['x-auth-token']
      const token = tokenFromBody || (headerAuth ? headerAuth.replace(/^Bearer\s+/i, '') : null)
      return { success: true, data: { user, token } };
    } catch (error) {
      console.error('❌ Login error:', error);
      console.error('❌ Error response:', error.response);
      console.error('❌ Error status:', error.response?.status);
      console.error('❌ Error data:', error.response?.data);
      
      // Check if this is an email verification error
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      let userData = null;
      
      // If backend returns user data even on verification errors, extract it
      if (error.response?.data) {
        const errorData = error.response.data;
        userData = errorData.user || errorData.data?.user || errorData;
        console.log('🔍 Extracted user data from error response:', userData);
      }
      
      return { 
        success: false, 
        error: errorMessage,
        data: userData ? { user: userData } : undefined
      };
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Get profile error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Failed to get profile' 
      };
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Forgot password error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Failed to send reset email' 
      };
    }
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    try {
      console.log('🚀 Starting password reset...');
      console.log('🔑 Reset token:', token);
      console.log('🔒 New password length:', newPassword?.length);
      
      const response = await api.post('/auth/reset-password', { token, newPassword });
      
      console.log('📥 Reset password response:', response);
      console.log('📥 Reset password response data:', response.data);
      console.log('📥 Reset password response status:', response.status);
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Reset password error:', error);
      console.error('❌ Error response:', error.response);
      console.error('❌ Error status:', error.response?.status);
      console.error('❌ Error data:', error.response?.data);
      
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Password reset failed' 
      };
    }
  }
};

// Prediction API functions
export const predictionAPI = {
  // Create prediction
  createPrediction: async (predictionData) => {
    try {
      console.log('🌾 Starting crop prediction...');
      console.log('📤 Prediction data:', predictionData);
      
      const response = await api.post('http://localhost:5001/api/predict', predictionData);
      
      console.log('📥 Prediction response:', response);
      console.log('📥 Prediction response data:', response.data);
      console.log('📥 Prediction response status:', response.status);
      
      // Extract disease name from status field
      const responseData = response.data;
      if (responseData && responseData.status) {
        responseData.diseaseName = responseData.status;
        console.log('🦠 Disease name extracted from status:', responseData.diseaseName);
      }
      
      return { success: true, data: responseData };
    } catch (error) {
      console.error('❌ Prediction error:', error);
      console.error('❌ Error response:', error.response);
      console.error('❌ Error status:', error.response?.status);
      console.error('❌ Error data:', error.response?.data);
      
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Prediction failed' 
      };
    }
  },

  // Get user predictions
  getUserPredictions: async (userId) => {
    try {
      console.log('📊 predictionAPI: Starting getUserPredictions...');
      console.log('📊 predictionAPI: userId parameter:', userId);
      console.log('📊 predictionAPI: typeof userId:', typeof userId);
      console.log('📊 predictionAPI: userId is truthy:', !!userId);
      
      if (!userId) {
        console.log('❌ predictionAPI: No userId provided, aborting request');
        return { 
          success: false, 
          error: 'User ID is required' 
        };
      }
      
      console.log('📤 predictionAPI: Making GET request to /predictions/' + userId);
      
      const response = await api.get(`/predictions/${userId}`);

      console.log('📥 predictionAPI: Response received');
      console.log('📥 predictionAPI: Response status:', response.status);
      console.log('📥 predictionAPI: Response headers:', response.headers);
      console.log('📥 predictionAPI: Raw response data:', response.data);

      // Normalize common response shapes to a single array
      // Backend may return:
      // - an array directly: [ {...}, ... ]
      // - { data: [ ... ] }
      // - { predictions: [ ... ] }
      // - { results: [ ... ] }
      const raw = response.data;
      let normalized = [];

      if (Array.isArray(raw)) {
        normalized = raw;
      } else if (raw && Array.isArray(raw.data)) {
        normalized = raw.data;
      } else if (raw && Array.isArray(raw.predictions)) {
        normalized = raw.predictions;
      } else if (raw && Array.isArray(raw.results)) {
        normalized = raw.results;
      } else if (raw && typeof raw === 'object') {
        // Try to find the first array-valued property
        for (const key of Object.keys(raw)) {
          if (Array.isArray(raw[key])) {
            normalized = raw[key];
            break;
          }
        }
      }

      // Extract disease names from status fields for each prediction
      if (Array.isArray(normalized)) {
        normalized = normalized.map(prediction => {
          if (prediction && prediction.status && !prediction.diseaseName) {
            prediction.diseaseName = prediction.status;
            console.log('🦠 Disease name extracted from status for prediction:', prediction.diseaseName);
          }
          return prediction;
        });
      }

      console.log('📥 predictionAPI: Normalized predictions array length:', normalized.length);
      return { success: true, data: normalized };
    } catch (error) {
      console.error('❌ predictionAPI: getUserPredictions error occurred');
      console.error('❌ predictionAPI: Error object:', error);
      console.error('❌ predictionAPI: Error name:', error.name);
      console.error('❌ predictionAPI: Error message:', error.message);
      console.error('❌ predictionAPI: Error response:', error.response);
      console.error('❌ predictionAPI: Error response status:', error.response?.status);
      console.error('❌ predictionAPI: Error response data:', error.response?.data);
      console.error('❌ predictionAPI: Error code:', error.code);
      
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Failed to get predictions' 
      };
    }
  },

  // Get single prediction by ID
  getPredictionById: async (predictionId) => {
    try {
      console.log('📊 Fetching prediction details for ID:', predictionId);
      
      const response = await api.get(`/prediction/${predictionId}`);
      
      console.log('📥 Prediction details response:', response.data);
      
      // Extract disease name from status field
      const responseData = response.data;
      if (responseData && responseData.status && !responseData.diseaseName) {
        responseData.diseaseName = responseData.status;
        console.log('🦠 Disease name extracted from status for single prediction:', responseData.diseaseName);
      }
      
      return { success: true, data: responseData };
    } catch (error) {
      console.error('❌ Get prediction details error:', error);
      console.error('❌ Error response:', error.response);
      
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Failed to get prediction details' 
      };
    }
  },

  // Download prediction report as PDF
  downloadPredictionReport: async (predictionId) => {
    try {
      console.log('📥 Downloading prediction report for ID:', predictionId);
      
      const response = await api.get(`/prediction/${predictionId}/report`, {
        responseType: 'blob' // Important for file downloads
      });
      
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `prediction-report-${predictionId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return { success: true, message: 'Report downloaded successfully' };
    } catch (error) {
      console.error('❌ Download report error:', error);
      console.error('❌ Error response:', error.response);
      
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Failed to download report' 
      };
    }
  },

  // Disease prediction API functions
  // Predict disease from uploaded image
  predictDisease: async (imageFile) => {
    try {
      console.log('🦠 Starting disease prediction...');
      console.log('📤 Image file:', imageFile);
      console.log('📤 Image file name:', imageFile?.name);
      console.log('📤 Image file type:', imageFile?.type);
      console.log('📤 Image file size:', imageFile?.size);
      
      // Validate file
      if (!imageFile) {
        throw new Error('No image file provided');
      }
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(imageFile.type)) {
        throw new Error('Invalid file format. Please upload JPG, JPEG, or PNG images only.');
      }
      
      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (imageFile.size > maxSize) {
        throw new Error('File size too large. Please upload an image smaller than 10MB.');
      }
      
      // Create FormData
      const formData = new FormData();
      formData.append('image', imageFile);
      
      console.log('📤 FormData created, making request...');
      console.log('📤 FormData entries:');
      for (let pair of formData.entries()) {
        console.log('📤 FormData key:', pair[0], 'value:', pair[1]);
      }
      
      // Make request with multipart/form-data
      const response = await api.post('/disease/predict', formData, {
        headers: {
          // Don't set Content-Type - let the browser set it automatically for FormData
          // This ensures the correct boundary is set for multipart/form-data
        },
        timeout: 60000, // 60 second timeout for image processing
      });
      
      console.log('📥 Disease prediction response:', response.data);
      
      // Extract disease name from status field
      const responseData = response.data;
      if (responseData && responseData.status && !responseData.diseaseName) {
        responseData.diseaseName = responseData.status;
        console.log('🦠 Disease name extracted from status:', responseData.diseaseName);
      }
      
      return { success: true, data: responseData };
    } catch (error) {
      console.error('❌ Disease prediction error:', error);
      console.error('❌ Error response:', error.response);
      
      // Handle specific error cases
      let errorMessage = 'Disease prediction failed';
      
      if (error.response) {
        // Server responded with error
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        // Request was made but no response
        if (error.code === 'ECONNREFUSED') {
          errorMessage = 'Disease prediction service is currently unavailable. Please try again later.';
        } else if (error.code === 'TIMEOUT') {
          errorMessage = 'Disease prediction request timed out. Please try again with a smaller image.';
        } else {
          errorMessage = 'Network error. Please check your connection and try again.';
        }
      } else {
        // Something else happened
        errorMessage = error.message || errorMessage;
      }
      
      return { 
        success: false, 
        error: errorMessage
      };
    }
  },

  // Check disease prediction service health
  checkDiseaseServiceHealth: async () => {
    try {
      console.log('🏥 Checking disease prediction service health...');
      
      const response = await api.get('/disease/health', {
        timeout: 10000, // 10 second timeout
      });
      
      console.log('📥 Health check response:', response.data);
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Health check error:', error);
      console.error('❌ Error response:', error.response);
      
      let errorMessage = 'Health check failed';
      
      if (error.response) {
        errorMessage = error.response.data?.message || 'Disease prediction service is unhealthy';
      } else if (error.request) {
        if (error.code === 'ECONNREFUSED') {
          errorMessage = 'Disease prediction service is not responding';
        } else if (error.code === 'TIMEOUT') {
          errorMessage = 'Health check timed out';
        } else {
          errorMessage = 'Network error during health check';
        }
      } else {
        errorMessage = error.message || errorMessage;
      }
      
      return { 
        success: false, 
        error: errorMessage
      };
    }
  }
};

// User Profile API functions
export const userProfileAPI = {
  // Update user profile
  updateProfile: async (profileData) => {
    try {
      console.log('👤 Starting profile update...');
      console.log('📤 Profile data:', profileData);
      
      const response = await api.put('/user/profile', profileData);
      
      console.log('📥 Profile update response:', response);
      console.log('📥 Profile update response data:', response.data);
      console.log('📥 Profile update response status:', response.status);
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Profile update error:', error);
      console.error('❌ Error response:', error.response);
      console.error('❌ Error status:', error.response?.status);
      console.error('❌ Error data:', error.response?.data);
      
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Profile update failed' 
      };
    }
  },

  // Update farm details
  updateFarmDetails: async (farmData) => {
    try {
      console.log('🚜 Starting farm details update...');
      console.log('📤 Farm data:', farmData);
  // Some backends expect the payload to include a `farmDetails` object.
  // Wrap flat farmData to maximize compatibility.
  const payload = { farmDetails: farmData };
  console.log('📤 Sending payload:', payload);
      
  const response = await api.put('/user/farm-details', payload);
      
      console.log('📥 Farm details update response:', response);
      console.log('📥 Farm details update response data:', response.data);
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Farm details update error:', error);
      console.error('❌ Error response:', error.response);
      
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Farm details update failed' 
      };
    }
  },

  // Get user profile
  getProfile: async (userId) => {
    try {
      console.log('📊 Fetching user profile for userId:', userId);
      
      const response = await api.get(`/user/profile/${userId}`);
      
      console.log('📥 User profile response:', response.data);
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Get profile error:', error);
      console.error('❌ Error response:', error.response);
      
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Failed to get profile' 
      };
    }
  }
};

// Chatbot API functions
export const chatbotAPI = {
  // Ask a question to the AI chatbot
  askQuestion: async (question, context = {}) => {
    try {
      const response = await api.post('/chatbot/ask', { 
        question,
        context 
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Chatbot ask error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Failed to ask question' 
      };
    }
  },

  // Get chat history for the user
  getChatHistory: async () => {
    try {
      const response = await api.get('/chatbot/history');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Get chat history error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Failed to get chat history' 
      };
    }
  },

  // Clear chat history for the user
  clearChatHistory: async () => {
    try {
      const response = await api.delete('/chatbot/history');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Clear chat history error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Failed to clear chat history' 
      };
    }
  },

  // Get suggested questions based on user profile
  getSuggestedQuestions: async () => {
    try {
      const response = await api.get('/chatbot/suggestions');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Get suggestions error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Failed to get suggestions' 
      };
    }
  },

  // Check chatbot service health
  checkHealth: async () => {
    try {
      const response = await api.get('/chatbot/health');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Chatbot health check error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Failed to check health' 
      };
    }
  }
};

// Location and Weather API functions
export const locationAPI = {
  // Get weather data by location
  getWeatherData: async (state, district) => {
    try {
      // Normalize incoming location values to avoid malformed district strings
      const normalizeLocation = (s, d) => {
        let ns = s || '';
        let nd = d || '';

        // If district looks like "State,District" or contains multiple commas, pick the most specific part
        if (typeof nd === 'string' && nd.includes(',')) {
          const parts = nd.split(',').map(p => p.trim()).filter(Boolean);
          if (parts.length > 1 && ns && parts[0].toLowerCase() === ns.toLowerCase()) {
            // district was prefixed with the state, drop the matching state part
            nd = parts.slice(1).join(', ');
          } else {
            // fallback: take the last segment which is usually the district
            nd = parts[parts.length - 1];
          }
        }

        // Handle other separators like "/" or " - "
        if (typeof nd === 'string' && (nd.includes('/') || nd.includes(' - '))) {
          nd = nd.split(/\/| - /).map(p => p.trim()).filter(Boolean).pop();
        }

        // If district accidentally contains the state name as prefix without comma, strip it
        if (ns && typeof nd === 'string' && nd.toLowerCase().startsWith(ns.toLowerCase())) {
          const maybe = nd.slice(ns.length).replace(/^[,\s:-]+/, '').trim();
          if (maybe) nd = maybe;
        }

        return { state: ns, district: nd };
      };

      const { state: finalState, district: finalDistrict } = normalizeLocation(state, district);

      console.log('🌦️ Fetching weather data for:', { state: finalState, district: finalDistrict });

      const response = await api.post('/location/weather', {
        state: finalState,
        district: finalDistrict
      });
      
      console.log('📥 Weather data response:', response.data);
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Weather data fetch error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Failed to fetch weather data' 
      };
    }
  },

  // Get soil data by location
  getSoilData: async (state, district) => {
    try {
      // Normalize inputs to avoid malformed district values
      const normalizeLocation = (s, d) => {
        let ns = s || '';
        let nd = d || '';
        if (typeof nd === 'string' && nd.includes(',')) {
          const parts = nd.split(',').map(p => p.trim()).filter(Boolean);
          if (parts.length > 1 && ns && parts[0].toLowerCase() === ns.toLowerCase()) nd = parts.slice(1).join(', ');
          else nd = parts[parts.length - 1];
        }
        if (typeof nd === 'string' && (nd.includes('/') || nd.includes(' - '))) nd = nd.split(/\/| - /).map(p => p.trim()).filter(Boolean).pop();
        if (ns && typeof nd === 'string' && nd.toLowerCase().startsWith(ns.toLowerCase())) {
          const maybe = nd.slice(ns.length).replace(/^[,\s:-]+/, '').trim(); if (maybe) nd = maybe;
        }
        return { state: ns, district: nd };
      };

      const { state: finalState, district: finalDistrict } = normalizeLocation(state, district);

      console.log('🌱 Fetching soil data for:', { state: finalState, district: finalDistrict });

      const response = await api.post('/soil-data', {
        state: finalState,
        district: finalDistrict
      });
      
      console.log('📥 Soil data response:', response.data);
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Soil data fetch error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Failed to fetch soil data' 
      };
    }
  },

  // Get combined location data (weather + soil)
  getLocationData: async (state, district) => {
    try {
      // Normalize inputs to avoid malformed district values
      const normalizeLocation = (s, d) => {
        let ns = s || '';
        let nd = d || '';
        if (typeof nd === 'string' && nd.includes(',')) {
          const parts = nd.split(',').map(p => p.trim()).filter(Boolean);
          if (parts.length > 1 && ns && parts[0].toLowerCase() === ns.toLowerCase()) nd = parts.slice(1).join(', ');
          else nd = parts[parts.length - 1];
        }
        if (typeof nd === 'string' && (nd.includes('/') || nd.includes(' - '))) nd = nd.split(/\/| - /).map(p => p.trim()).filter(Boolean).pop();
        if (ns && typeof nd === 'string' && nd.toLowerCase().startsWith(ns.toLowerCase())) {
          const maybe = nd.slice(ns.length).replace(/^[,\s:-]+/, '').trim(); if (maybe) nd = maybe;
        }
        return { state: ns, district: nd };
      };

      const { state: finalState, district: finalDistrict } = normalizeLocation(state, district);

      console.log('📍 Fetching combined location data for:', { state: finalState, district: finalDistrict });

      const response = await api.post('/location/data', {
        state: finalState,
        district: finalDistrict
      });
      
      console.log('📥 Location data response:', response.data);
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Location data fetch error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Failed to fetch location data' 
      };
    }
  },

  getSoilData: async (state, district) => {
    try {
      const response = await api.post('/soil-data', { state, district });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Soil data fetch error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch soil data'
      };
    }
  },

  getSoilData: async (state, district) => {
    try {
      const response = await api.post('/soil-data', { state, district });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Soil data fetch error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch soil data'
      };
    }
  }
};

// Utility function to check if backend is available
export const checkBackendHealth = async () => {
  try {
    // First try the health endpoint
    const response = await axios.get('http://localhost:5001/health', { timeout: 5000 });
    return { success: true, data: response.data };
  } catch (error) {
    // If health endpoint fails, try a basic auth endpoint to check if backend is running
    try {
      console.log('Health endpoint failed, trying auth endpoint...');
      const authResponse = await axios.get('http://localhost:5001/api/auth/profile', { 
        timeout: 3000,
        validateStatus: (status) => status < 500 // Accept 4xx but not 5xx errors
      });
      console.log('Auth endpoint responded, backend is available');
      return { success: true, data: { status: 'ok', note: 'backend responding via auth endpoint' } };
    } catch (authError) {
      const status = error.response?.status;
      const msg = error.response?.data?.message || error.message;
      console.warn('Backend health check failed:', { status, message: msg });
      
      // If we get a 404 on health but backend seems to be running (based on other evidence), 
      // consider it available
      if (status === 404) {
        console.log('Health endpoint not found but backend may be running');
        return { success: true, data: { status: 'ok', note: 'backend responding without health endpoint' } };
      }
      
      return { 
        success: false, 
        error: 'Backend server is not available. Please make sure the server is running on port 5001.',
        detail: { status, message: msg }
      };
    }
  }
};

const getYieldUnit = (prediction) => {
    return 'kg/ha'; // Always return kg/ha
};

export default api;
