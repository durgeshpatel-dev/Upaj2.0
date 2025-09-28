import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './App.css';

// Simple loading component
const LoadingScreen = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-text-secondary">Loading AgriVision...</p>
    </div>
  </div>
);

// Simple landing page component
const SimpleLanding = () => (
  <div className="min-h-screen bg-background text-text-primary">
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">
          🌱 AgriVision
        </h1>
        <p className="text-xl text-text-secondary mb-8">
          Smart Farming with AI-Powered Crop Intelligence
        </p>
        <div className="bg-surface rounded-lg p-6 shadow-lg max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Welcome to AgriVision</h2>
          <p className="text-text-secondary mb-4">
            Your intelligent farming companion for better crop management and yield optimization.
          </p>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="bg-background p-4 rounded">
              <h3 className="font-semibold text-primary">🌾 Crop Prediction</h3>
              <p className="text-sm text-text-secondary">AI-powered crop yield forecasting</p>
            </div>
            <div className="bg-background p-4 rounded">
              <h3 className="font-semibold text-primary">🔬 Disease Detection</h3>
              <p className="text-sm text-text-secondary">Early detection of plant diseases</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      console.log('✅ App initialization complete');
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-background text-text-primary">
        <Router>
          <Routes>
            <Route path="/" element={<SimpleLanding />} />
            <Route path="*" element={<SimpleLanding />} />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;