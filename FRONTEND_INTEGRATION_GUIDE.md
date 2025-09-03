# 🔌 Frontend-Backend Integration Guide for AgriVision

## 📋 Overview

This guide explains how the AgriVision frontend connects to your backend API running on `localhost:5001`.

## 🚀 Quick Start

### 1. Backend Setup (Already Done by You)
- Ensure your backend server is running on `http://localhost:5001`
- Make sure CORS is enabled for `http://localhost:5173` (Vite dev server)

### 2. Frontend Configuration
The frontend is already configured to connect to your backend. Key files:

- **`src/utils/api.js`** - Main API client with axios configuration
- **`src/context/AuthContext.jsx`** - Authentication state management
- **All auth components** - Updated to use real API calls

## 🔗 API Integration Details

### Base Configuration
```javascript
// Base URL for all API calls
const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Authentication Flow
1. **Signup** → `POST /api/auth/signup`
2. **Email Verification** → `POST /api/auth/verify-otp`
3. **Login** → `POST /api/auth/login`
4. **Auto Token Handling** → JWT token automatically added to headers

### Error Handling
- **401 Unauthorized** → Automatically redirects to login
- **Backend Unavailable** → Shows "Demo Mode" with fallback functionality
- **Network Errors** → User-friendly error messages

## 📱 Component Updates

### Authentication Components
All auth components now use real API calls:

#### Login Component (`src/components/auth/Login.jsx`)
```javascript
// Real API call instead of simulation
const result = await authAPI.login(formData.email, formData.password)
if (result.success) {
  const { user, token } = result.data
  login(user, token)
  navigate('/dashboard')
}
```

#### Signup Component (`src/components/auth/Signup.jsx`)
```javascript
// Real API call for registration
const result = await authAPI.signup({
  name: formData.name,
  email: formData.email,
  password: formData.password
})
```

#### Verify Email Component (`src/components/auth/VerifyEmail.jsx`)
```javascript
// Real OTP verification
const result = await authAPI.verifyOTP(email, code, userId)

// Real OTP resend
const result = await authAPI.resendOTP(email, userId)
```

#### Forgot Password Component (`src/components/auth/ForgotPassword.jsx`)
```javascript
// Real password reset request
const result = await authAPI.forgotPassword(email)
```

### Prediction Component (`src/pages/Prediction.jsx`)
- Integrated with backend prediction API
- Falls back to demo mode if backend unavailable
- Loads user's past predictions from database

### Dashboard Component (`src/pages/Dashboard.jsx`)
- Shows backend connection status
- Displays real user data from API

## 🔄 Backend Health Check

The app automatically checks if your backend is available:

```javascript
// Health check function
export const checkBackendHealth = async () => {
  try {
    const response = await axios.get('http://localhost:5001/health');
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: 'Backend not available' };
  }
};
```

## 🎯 Expected API Responses

### Authentication Responses
Your backend should return responses in this format:

#### Successful Login
```json
{
  "message": "Login successful",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "isVerified": true
  },
  "token": "jwt_token_here"
}
```

#### Error Response
```json
{
  "message": "Error description",
  "errors": {
    "field": "Field-specific error"
  }
}
```

### Prediction Response
```json
{
  "predictionId": "pred_123",
  "predictedYield": 4.5,
  "confidence": 0.85,
  "recommendations": ["tip1", "tip2"],
  "createdAt": "2024-01-01T00:00:00Z"
}
```

## 🔧 Environment Variables

Create a `.env` file in the frontend root if you need custom configuration:

```env
VITE_API_BASE_URL=http://localhost:5001/api
VITE_BACKEND_URL=http://localhost:5001
```

## 🛠️ Development Setup

### Starting the Application
```bash
# Start your backend (port 5001)
# Then start the frontend:
npm run dev
```

### Testing Backend Connection
1. Visit `http://localhost:5173` (frontend)
2. Check the dashboard for backend status indicator
3. Try signup/login to test authentication
4. Check browser console for any API errors

## 🚨 Troubleshooting

### Backend Not Available
- **Symptoms**: "Demo Mode" banner appears, API calls fail
- **Solutions**: 
  - Ensure backend is running on port 5001
  - Check CORS configuration in backend
  - Verify no firewall blocking port 5001

### CORS Errors
- **Symptoms**: Browser console shows CORS errors
- **Solution**: Add `http://localhost:5173` to backend CORS origins

### Authentication Issues
- **Symptoms**: Login successful but redirects to login again
- **Solution**: Check JWT token format and expiry in backend response

### API Response Format Issues
- **Symptoms**: Frontend shows "undefined" data
- **Solution**: Ensure backend responses match expected format above

## 📊 API Endpoints Summary

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| POST | `/auth/signup` | User registration | No |
| POST | `/auth/verify-otp` | Email verification | No |
| POST | `/auth/resend-otp` | Resend OTP | No |
| POST | `/auth/login` | User login | No |
| GET | `/auth/profile` | Get user profile | Yes |
| POST | `/auth/forgot-password` | Password reset request | No |
| POST | `/auth/reset-password` | Reset password | No |
| POST | `/predict` | Create prediction | Yes |
| GET | `/predictions/:userId` | Get user predictions | Yes |
| POST | `/chat/send` | Send chat message | Yes |
| GET | `/health` | Backend health check | No |

## ✅ Success Indicators

When everything is working correctly:
- ✅ No "Demo Mode" banner on dashboard
- ✅ Backend status shows "Connected" 
- ✅ Signup/login works with real email verification
- ✅ Predictions are saved and retrievable
- ✅ Browser console shows no API errors

## 🔄 Fallback Features

If backend is unavailable, the frontend gracefully falls back to:
- Demo login credentials
- Simulated prediction results
- Local storage for user data
- Sample data for all components

This ensures the application remains functional for demonstration purposes even without a backend connection.
