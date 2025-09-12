import React, { useState, useEffect } from 'react';
import { checkBackendHealth } from '../../utils/api';

const BackendStatusIndicator = () => {
  const [status, setStatus] = useState({ available: false, checking: true, error: null });

  useEffect(() => {
    const checkStatus = async () => {
      setStatus(prev => ({ ...prev, checking: true }));
      
      try {
        const result = await checkBackendHealth();
        if (result.success) {
          setStatus({ available: true, checking: false, error: null });
        } else {
          setStatus({ available: false, checking: false, error: result.error });
        }
      } catch (error) {
        setStatus({ available: false, checking: false, error: error.message });
      }
    };

    checkStatus();
    
    // Check status every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (status.checking) {
    return (
      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="animate-spin h-4 w-4 border-2 border-yellow-500 border-t-transparent rounded-full"></div>
          <span className="text-yellow-800 text-sm">Checking backend status...</span>
        </div>
      </div>
    );
  }

  if (!status.available) {
    return (
      <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-red-800 font-medium text-sm">Backend Server Not Available</h3>
            <p className="text-red-600 text-xs mt-1">
              {status.error || 'Please start the backend server to access full features.'}
            </p>
            <p className="text-red-600 text-xs mt-1">
              <strong>To start the server:</strong> Open terminal, run <code className="bg-red-100 px-1 rounded">cd AgriVision-backend && npm run dev</code>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 bg-red-500 rounded-full"></div>
            <span className="text-red-700 text-xs">Offline</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 bg-green-500 rounded-full"></div>
          <span className="text-green-800 text-sm">Backend server is running</span>
        </div>
        <span className="text-green-600 text-xs">Online</span>
      </div>
    </div>
  );
};

export default BackendStatusIndicator;