import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Prediction from './pages/Prediction';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ChatSupport from './pages/ChatSupport';
import EnhancedChatSupport from './pages/EnhancedChatSupport';
import AdvancedChatSupport from './pages/AdvancedChatSupport';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import VerifyEmail from './components/auth/VerifyEmail';
import ForgotPassword from './components/auth/ForgotPassword';
import Community from './pages/Community';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<><Navbar /><Landing /></>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Protected routes */}
          <Route path="/predict" element={<ProtectedRoute><Navbar /><Prediction /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Navbar /><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Navbar /><Profile /></ProtectedRoute>} />
          <Route path="/community" element={<ProtectedRoute><Navbar /><Community /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Navbar /><ChatSupport /></ProtectedRoute>} />
          <Route path="/chat/enhanced" element={<ProtectedRoute><Navbar /><EnhancedChatSupport /></ProtectedRoute>} />
          <Route path="/chat/advanced" element={<ProtectedRoute><Navbar /><AdvancedChatSupport /></ProtectedRoute>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
