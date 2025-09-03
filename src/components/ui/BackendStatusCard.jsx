import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import Button from '../Button';

const BackendStatusCard = () => {
  const { backendAvailable } = useAuth();

  const handleRefresh = () => {
    window.location.reload();
  };

  if (backendAvailable) {
    return (
      <div className="bg-status-success/10 border border-status-success/20 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <CheckCircle className="text-status-success" size={20} />
          <div>
            <h3 className="text-status-success font-medium">Backend Connected</h3>
            <p className="text-text-secondary text-sm">All features are available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-status-warning/10 border border-status-warning/20 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="text-status-warning" size={20} />
          <div>
            <h3 className="text-status-warning font-medium">Backend Disconnected</h3>
            <p className="text-text-secondary text-sm">
              Running in demo mode. Start backend server on port 5001.
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          className="flex items-center gap-2"
        >
          <RefreshCw size={14} />
          Retry
        </Button>
      </div>
    </div>
  );
};

export default BackendStatusCard;
