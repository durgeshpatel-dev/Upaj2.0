import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicRoute, GuestRoute } from './components/RouteGuard';
import { GlobalRouteProtection } from './hooks/useGlobalRouteProtection';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Prediction from './pages/Prediction';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ViewPrediction from './pages/ViewPrediction';
import ChatSupport from './pages/ChatSupport';
import EnhancedChatSupport from './pages/EnhancedChatSupport';
import AdvancedChatSupport from './pages/AdvancedChatSupport';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import VerifyEmail from './components/auth/VerifyEmail';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import OAuthCallback from './components/auth/OAuthCallback';
import OAuthSuccess from './components/auth/OAuthSuccess';
import Community from './pages/Community';
// Keep the old ProtectedRoute for backward compatibility if needed
// import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background text-text-primary">
        <Router>
          <GlobalRouteProtection>
            <Routes>
              {/* Public routes - accessible to everyone */}
              <Route path="/" element={<GuestRoute><Landing /></GuestRoute>} />
              
              {/* Auth routes - redirect authenticated users to dashboard */}
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
              <Route path="/verify-email" element={<PublicRoute><VerifyEmail /></PublicRoute>} />
              <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
              <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
              
              {/* OAuth routes - accessible to everyone during auth flow */}
              <Route path="/auth/callback" element={<GuestRoute><OAuthCallback /></GuestRoute>} />
              <Route path="/auth/success" element={<GuestRoute><OAuthSuccess /></GuestRoute>} />
              
              {/* Protected routes - require authentication */}
              <Route path="/predict" element={<ProtectedRoute><Navbar /><Prediction /></ProtectedRoute>} />
              <Route path="/prediction" element={<ProtectedRoute><Navbar /><Prediction /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Navbar /><Dashboard /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Navbar /><Profile /></ProtectedRoute>} />
              <Route path="/prediction/:predictionId" element={<ProtectedRoute><Navbar /><ViewPrediction /></ProtectedRoute>} />
              <Route path="/community" element={<ProtectedRoute><Navbar /><Community /></ProtectedRoute>} />
              {/* <Route path="/chat" element={<ProtectedRoute><Navbar /><ChatSupport /></ProtectedRoute>} /> */}
              <Route path="/chat/enhanced" element={<ProtectedRoute><Navbar /><EnhancedChatSupport /></ProtectedRoute>} />
              <Route path="/chat" element={<ProtectedRoute><Navbar /><AdvancedChatSupport /></ProtectedRoute>} />
              
              {/* Catch-all route for unmatched paths */}
              <Route path="*" element={<ProtectedRoute><Navigate to="/dashboard" replace /></ProtectedRoute>} />
            </Routes>
          </GlobalRouteProtection>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
