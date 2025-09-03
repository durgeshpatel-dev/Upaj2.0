# Complete Backend API for AgriVision Platform

## 📋 API Endpoints Overview

### Base URL: `http://localhost:5001/api`

## 🔐 Authentication APIs

### 1. User Registration
**POST** `/auth/signup`
```json
{
  "name": "John Doe",
  "email": "john@example.com", 
  "password": "password123"
}
```
**Response:**
```json
{
  "message": "User registered successfully. Please verify your email.",
  "userId": "user_id_here"
}
```

### 2. Verify OTP
**POST** `/auth/verify-otp`
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```
**Response:**
```json
{
  "message": "Email verified successfully",
  "user": {...},
  "token": "jwt_token_here"
}
```

### 3. Resend OTP
**POST** `/auth/resend-otp`
```json
{
  "email": "john@example.com"
}
```
**Response:**
```json
{
  "message": "OTP resent successfully"
}
```

### 4. User Login
**POST** `/auth/login`
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
**Response:**
```json
{
  "message": "Login successful",
  "user": {...},
  "token": "jwt_token_here"
}
```

### 5. Get User Profile
**GET** `/auth/profile`
**Headers:** `Authorization: Bearer <token>`
**Response:**
```json
{
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "isVerified": true,
    "createdAt": "..."
  }
}
```

### 6. Forgot Password
**POST** `/auth/forgot-password`
```json
{
  "email": "john@example.com"
}
```
**Response:**
```json
{
  "message": "Password reset link sent to your email"
}
```

### 7. Reset Password
**POST** `/auth/reset-password`
```json
{
  "token": "reset_token_here",
  "newPassword": "newpassword123"
}
```
**Response:**
```json
{
  "message": "Password reset successfully"
}
```

## 🌾 Prediction APIs

### 8. Create Prediction
**POST** `/predict`
**Headers:** `Authorization: Bearer <token>`
```json
{
  "cropType": "wheat",
  "farmSize": 100,
  "soilType": "loamy",
  "rainfall": 750,
  "temperature": 25,
  "humidity": 65,
  "season": "kharif"
}
```
**Response:**
```json
{
  "predictionId": "...",
  "predictedYield": 4.5,
  "confidence": 0.85,
  "recommendations": ["..."],
  "createdAt": "..."
}
```

### 9. Get User Predictions
**GET** `/predictions/:userId`
**Headers:** `Authorization: Bearer <token>`
**Response:**
```json
{
  "predictions": [
    {
      "id": "...",
      "cropType": "wheat",
      "predictedYield": 4.5,
      "confidence": 0.85,
      "createdAt": "..."
    }
  ]
}
```

## 💬 Chat APIs (Placeholder)

### 10. Send Message
**POST** `/chat/send`
**Headers:** `Authorization: Bearer <token>`
```json
{
  "message": "How can I improve my crop yield?"
}
```
**Response:**
```json
{
  "response": "AI generated response...",
  "suggestions": ["..."]
}
```

## 🔒 Authentication Flow

1. **Signup** → User registers with email/password
2. **Email Verification** → User receives OTP via email  
3. **OTP Verification** → User verifies email with 6-digit code
4. **Login** → User logs in after email verification
5. **Access Protected Routes** → JWT token required for protected endpoints

## 📊 Error Responses

### 400 - Bad Request
```json
{
  "message": "Validation error message",
  "errors": {
    "email": "Email is required",
    "password": "Password too short"
  }
}
```

### 401 - Unauthorized
```json
{
  "message": "Invalid or expired token"
}
```

### 403 - Forbidden  
```json
{
  "message": "Email verification required"
}
```

### 404 - Not Found
```json
{
  "message": "User not found"
}
```

### 500 - Server Error
```json
{
  "message": "Internal server error"
}
```

## 🛡️ Security Features

- JWT tokens with 30-day expiry
- Password hashing with bcrypt
- OTP expiry (10 minutes)
- Rate limiting on sensitive endpoints
- Input validation and sanitization
- CORS enabled for frontend domain

## 📧 Email Features

- Welcome emails on signup
- OTP verification emails
- Password reset emails
- Professional email templates

## 🔧 Environment Variables Required

- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`  
- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_USER`
- `EMAIL_PASS`
- `FRONTEND_URL`
- `PORT`

This backend provides a complete authentication system with email verification, password reset, and yield prediction capabilities ready for frontend integration.
