import React from 'react';

function App() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f0f0f0', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#2d3748', marginBottom: '1rem' }}>
          🌱 AgriVision Frontend
        </h1>
        <p style={{ color: '#4a5568', marginBottom: '1rem' }}>
          Frontend deployment successful!
        </p>
        <p style={{ color: '#718096', fontSize: '0.9rem' }}>
          React app is working correctly on Vercel
        </p>
      </div>
    </div>
  );
}

export default App;