import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Download, Eye } from 'lucide-react';
import { predictionAPI } from '../../utils/api';
import { Tr } from '../ui/SimpleTranslation';

const PastPredictionsTable = ({ predictions: sharedPredictions = [], loading: sharedLoading = false }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Simplified useEffect to handle props
  useEffect(() => {
    console.log('PastPredictionsTable: auto-fetch check --', {
      sharedCount: Array.isArray(sharedPredictions) ? sharedPredictions.length : 'n/a',
      isAuthenticated,
      
      hasUser: !!user
    });

    // If parent provided predictions, use them
    if (Array.isArray(sharedPredictions) && sharedPredictions.length > 0) {
      console.log('Using shared predictions:', sharedPredictions.length);
      const latestPredictions = sharedPredictions.slice(0, 4);
      setPredictions(latestPredictions);
      setLoading(sharedLoading);
      return;
    }

    // Otherwise fetch predictions when authenticated, backend available and user present
    if (isAuthenticated  && user) {
      fetchUserPredictions();
      return;
    }

    // If conditions not ready, do nothing; the effect depends on `user` so it will re-run when user becomes available
  }, [sharedPredictions, sharedLoading, isAuthenticated, user, fetchUserPredictions]);

  // Function to fetch user predictions
  const fetchUserPredictions = useCallback(async () => {
    setError(null);
    setLoading(true);

    try {
      const userId = user?._id || user?.id || user?.userId;
      if (!userId) {
        setError('User ID not available');
        return;
      }

      const result = await predictionAPI.getUserPredictions(userId);
      if (result.success) {
        const latest = Array.isArray(result.data) ? result.data.slice(0, 4) : [];
        console.log('Fetched predictions:', latest.length);
        setPredictions(latest);
      } else {
        setError(result.error || 'Failed to fetch predictions');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Failed to fetch predictions');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const formatDate = (prediction) => {
    try {
      let dateValue = prediction.createdAt || prediction.plantingDate;
      
      if (dateValue && typeof dateValue === 'object' && dateValue.$date) {
        dateValue = dateValue.$date;
      }
      
      return new Date(dateValue).toLocaleDateString();
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'N/A';
    }
  };

  const getPredictedYield = (prediction) => {
    // First try the main predictedYield field
    let predicted = prediction.predictedYield;
    
    // Fallback to ML response if available
    if (!predicted && prediction.externalData?.mlResponse?.yield_kg_ha) {
      predicted = prediction.externalData.mlResponse.yield_kg_ha;
    }
    
    // Legacy format support
    if (!predicted && prediction.yield && typeof prediction.yield === 'object') {
      predicted = prediction.yield.predicted;
    }
    
    if (!predicted || isNaN(Number(predicted))) {
      return 'N/A';
    }
    
    return Math.round(Number(predicted));
  };

  const getCropDisplay = (prediction) => {
    const crop = prediction.cropType || prediction.crop || 'Unknown';
    return crop.charAt(0).toUpperCase() + crop.slice(1).toLowerCase();
  };

  const getLocationDisplay = (prediction) => {
    if (prediction.location) {
      const { district, state } = prediction.location;
      if (district && state) {
        return `${district}, ${state}`;
      }
    }
    return '';
  };

  const handleDownloadReport = async (prediction) => {
    console.log('Downloading PDF report for prediction:', prediction._id);
    
    try {
      const predictionId = prediction._id?.$oid || prediction._id;
      const result = await predictionAPI.downloadPredictionReport(predictionId);
      
      if (result.success) {
        // Create a blob from the response data
        const blob = new Blob([result.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        
        // Create a temporary anchor element to trigger the download
        const a = document.createElement('a');
        a.href = url;
        a.download = `prediction-report-${predictionId}.pdf`;
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert(`Download failed: ${result.error}`);
      }
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download PDF report. Please try again.');
    }
  };

  const handleViewPrediction = (prediction) => {
    const predictionId = prediction._id?.$oid || prediction._id;
    navigate(`/prediction/${predictionId}`);
  };

  // Fallback dummy data for demo purposes
  const dummyPredictions = [
    { 
      _id: 'demo-1',
      cropType: "wheat", 
      createdAt: { $date: "2024-05-15T00:00:00.000Z" }, 
      predictedYield: 3200,
      location: { district: "Baroda", state: "Gujarat" }
    },
    { 
      _id: 'demo-2',
      cropType: "rice", 
      createdAt: { $date: "2024-04-20T00:00:00.000Z" }, 
      predictedYield: 4500,
      location: { district: "Pune", state: "Maharashtra" }
    },
    { 
      _id: 'demo-3',
      cropType: "groundnut", 
      createdAt: { $date: "2024-03-25T00:00:00.000Z" }, 
      predictedYield: 2800,
      location: { district: "Ahmedabad", state: "Gujarat" }
    }
  ];

  // Determine what to display
  const displayPredictions = predictions.length > 0 
    ? predictions 
    : (!loading && !isAuthenticated ? dummyPredictions : []);

  return (
    <Card className="border-border bg-background-card">
      <CardHeader>
        <CardTitle className="text-text-primary text-base"><Tr>Recent Predictions</Tr></CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <div className="text-center py-4 text-text-secondary"><Tr>Loading...</Tr></div>}
        
        {error && <div className="text-center py-4 text-status-error"><Tr>Error</Tr>: {error}</div>}
        
        {!loading && !error && displayPredictions.length === 0 && (
          <div className="text-center py-4 text-text-secondary"><Tr>No predictions available</Tr></div>
        )}
        
        {!loading && !error && displayPredictions.length > 0 && (
          <div className="overflow-x-auto overflow-y-auto max-h-96">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-2 text-text-secondary font-medium"><Tr>Crop</Tr></th>
                  <th className="pb-2 text-text-secondary font-medium"><Tr>Date</Tr></th>
                  <th className="pb-2 text-text-secondary font-medium"><Tr>Predicted</Tr></th>
                  <th className="pb-2 text-text-secondary font-medium"><Tr>Download</Tr></th>
                  <th className="pb-2 text-text-secondary font-medium"><Tr>View</Tr></th>
                </tr>
              </thead>
              <tbody>
                {displayPredictions.map((prediction, i) => {
                  const predicted = getPredictedYield(prediction);
                  const cropDisplay = getCropDisplay(prediction);
                  const location = getLocationDisplay(prediction);
                  
                  return (
                    <tr key={prediction._id || i} className="border-b border-border last:border-b-0">
                      <td className="py-2 text-text-primary font-medium">
                        <div>
                          {cropDisplay}
                          {location && <div className="text-xs text-text-secondary">{location}</div>}
                        </div>
                      </td>
                      <td className="py-2 text-text-secondary">
                        {formatDate(prediction)}
                      </td>
                      <td className="py-2 text-text-primary">
                        {predicted} {predicted !== 'N/A' ? 'kg/ha' : ''}
                      </td>
                      <td className="py-2">
                        <button
                          onClick={() => handleDownloadReport(prediction)}
                          className="p-1 text-primary hover:text-primary/80 hover:bg-primary/10 rounded transition-colors"
                          title="Download PDF Report"
                        >
                          <Download size={16} />
                        </button>
                      </td>
                      <td className="py-2">
                        <button
                          onClick={() => handleViewPrediction(prediction)}
                          className="p-1 text-primary hover:text-primary/80 hover:bg-primary/10 rounded transition-colors"
                          title="View Prediction"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PastPredictionsTable;