# 🚀 Quick API Reference - AgriVision Backend

## Base URL: `http://localhost:5001/api`

## 🔐 Authentication Endpoints

### 1. User Registration
```http
POST /auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### 2. Verify Email OTP
```http
POST /auth/verify-otp
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456"
}
```

### 3. Resend OTP
```http
POST /auth/resend-otp
Content-Type: application/json

{
  "email": "john@example.com"
}
```

### 4. User Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### 5. Get Profile (Protected)
```http
GET /auth/profile
Authorization: Bearer <jwt_token>
```

### 6. Forgot Password
```http
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

### 7. Reset Password
```http
POST /auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_from_email",
  "newPassword": "newpassword123"
}
```

## 🌾 Prediction Endpoints

### 8. Create Prediction (Protected)
```http
POST /predict
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "cropType": "wheat",
  "farmSize": 100,
  "soilType": "loamy",
  "location": "punjab",
  "rainfall": 750,
  "temperature": 25,
  "humidity": 65,
  "season": "kharif"
}
```

### 9. Get User Predictions (Protected)
```http
GET /predictions/:userId
Authorization: Bearer <jwt_token>
```

## 💬 Chat Endpoints

### 10. Send Message (Protected)
```http
POST /chat/send
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "message": "How can I improve crop yield?"
}
```

## 🏥 Health Check

### Backend Health
```http
GET /health
```

## 📋 Frontend Usage Examples

### Axios Configuration
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  timeout: 10000,
});

// Auto-add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Login Example
```javascript
import { authAPI } from './utils/api';

const handleLogin = async (email, password) => {
  const result = await authAPI.login(email, password);
  if (result.success) {
    const { user, token } = result.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }
};
```

### Prediction Example
```javascript
import { predictionAPI } from './utils/api';

const createPrediction = async (formData) => {
  const result = await predictionAPI.createPrediction(formData);
  if (result.success) {
    console.log('Prediction:', result.data);
  }
};
```

## 🔧 Environment Setup

### Required Environment Variables (.env)
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/agrivision
JWT_SECRET=your_jwt_secret_here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=http://localhost:5173
```

### CORS Configuration
```javascript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

## 🎯 Expected Response Formats

### Success Response
```json
{
  "message": "Operation successful",
  "data": {
    "user": {...},
    "token": "jwt_token"
  }
}
```

### Error Response
```json
{
  "message": "Error description",
  "errors": {
    "field": "Field-specific error"
  }
}
```

## ⚡ Testing Commands

### Test Backend Health
```bash
curl http://localhost:5001/health
```

### Test Signup
```bash
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### Test Login
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 🚀 Quick Start Checklist

- [ ] Backend running on port 5001
- [ ] MongoDB connected
- [ ] CORS configured for localhost:5173
- [ ] Email service configured (for OTP)
- [ ] JWT secret set in environment
- [ ] Frontend can reach /health endpoint
- [ ] Test signup/login flow works
- [ ] Check browser console for errors

## 🆘 Common Issues

1. **CORS Error**: Add frontend URL to CORS origins
2. **Token Invalid**: Check JWT secret and token format
3. **Email Not Sending**: Verify SMTP credentials
4. **Database Error**: Ensure MongoDB is running
5. **Port Conflict**: Ensure port 5001 is available

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify backend logs
3. Test API endpoints directly with curl/Postman
4. Ensure environment variables are set correctly
