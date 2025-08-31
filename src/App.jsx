import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AgriVisionLanding from './components/AgriVisionLanding';
import Prediction from './pages/Prediction';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<AgriVisionLanding />} />
          <Route path="/predict" element={<Prediction />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
