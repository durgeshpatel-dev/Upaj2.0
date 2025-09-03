import React, { useState, useEffect } from 'react';
import { Brain } from 'lucide-react';
import PredictionForm from '../components/prediction/PredictionForm';
import PredictionOutput from '../components/prediction/PredictionOutput';
import YieldTrendChart from '../components/prediction/YieldTrendChart';
import { useAuth } from '../context/AuthContext';
import { predictionAPI } from '../utils/api';

const Prediction = () => {
  const { user, backendAvailable } = useAuth();

  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pastPredictions, setPastPredictions] = useState([]);

  // Load user's past predictions on component mount
  useEffect(() => {
    if (user && backendAvailable) {
      loadPastPredictions();
    }
  }, [user, backendAvailable]);

  const loadPastPredictions = async () => {
    try {
      const result = await predictionAPI.getUserPredictions(user.id || user._id);
      if (result.success) {
        setPastPredictions(result.data.predictions || []);
      }
    } catch (error) {
      console.error('Failed to load past predictions:', error);
    }
  };

  const handlePredictionSubmit = async (formData) => {
    setIsLoading(true);
    setError(null); // Clear any previous errors
    setPrediction(null); // Clear any previous predictions
    
    console.log('🌾 Starting prediction submission...');
    console.log('📋 Form data received:', formData);
    
    try {
      // Prepare prediction data for backend API - matching exact backend format
      const predictionData = {
        cropType: formData.cropType,
        farmSize: formData.farmSize,
        soilType: formData.soilType,
        rainfall: formData.rainfall,
        temperature: formData.temperature,
        humidity: formData.humidity,
        season: formData.season,
        location: formData.location,
        fetchedFromAPIs: formData.fetchedFromAPIs,
        plantingDate: formData.date,
      };

      console.log('📤 Sending prediction data to backend (matching API format):', predictionData);

      const result = await predictionAPI.createPrediction(predictionData);
      
      console.log('📥 Prediction API result:', result);
      
      if (result.success) {
        console.log('✅ Prediction successful');
        setPrediction(result);
        
        // Reload past predictions to include the new one
        loadPastPredictions();
      } else {
        console.log('❌ Prediction failed:', result.error);
        setError(result.error);
      }
    } catch (error) {
      console.error('❌ Unexpected prediction error:', error);
      setError('Failed to generate prediction. Please try again.');
    }
    
    setIsLoading(false);
  };

  const clearPrediction = () => {
    setPrediction(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Backend Status Banner */}
      {!backendAvailable && (
        <div className="bg-status-warning/10 border-b border-status-warning/20 px-6 py-3">
          <div className="max-w-7xl mx-auto">
            <p className="text-status-warning text-sm text-center">
              ⚠️ Backend server is not available. Running in demo mode. 
              Please ensure your backend server is running on port 5001.
            </p>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="bg-status-error/10 border-b border-status-error/20 px-6 py-3">
          <div className="max-w-7xl mx-auto">
            <p className="text-status-error text-sm text-center">
              ❌ {error}
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="xl:col-span-1 space-y-6">
            <PredictionForm 
              onSubmit={handlePredictionSubmit} 
              isLoading={isLoading} 
              error={error}
            />
            
            {/* Clear Prediction Button */}
            <div className="bg-background-card p-4 rounded-lg border border-border">
              <button
                onClick={clearPrediction}
                className="w-full bg-border hover:bg-text-secondary text-text-primary text-sm font-medium px-3 py-2 rounded transition-colors"
              >
                Clear Prediction
              </button>
            </div>
            
            {/* How it Works Section */}
            <div className="bg-background-card p-6 rounded-lg border border-border">
              <h3 className="text-lg font-semibold text-text-primary mb-4">How It Works</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">1</div>
                  <div>
                    <div className="text-sm font-medium text-text-primary">Enter Farm Details</div>
                    <div className="text-xs text-text-secondary">Provide crop type, location, and soil information</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">2</div>
                  <div>
                    <div className="text-sm font-medium text-text-primary">AI Analysis</div>
                    <div className="text-xs text-text-secondary">Our AI analyzes weather, soil, and historical data</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">3</div>
                  <div>
                    <div className="text-sm font-medium text-text-primary">Get Predictions</div>
                    <div className="text-xs text-text-secondary">Receive detailed yield forecasts and recommendations</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Output and Chart */}
          <div className="xl:col-span-2 space-y-6">
            {/* Loading State */}
            {isLoading && (
              <div className="bg-background-card p-8 rounded-lg border border-border">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <Brain size={32} className="text-primary animate-pulse" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">Analyzing Your Data...</h3>
                  <p className="text-text-secondary text-sm">Our AI is processing weather patterns, soil conditions, and historical data to generate your prediction.</p>
                  <div className="mt-4 w-64 mx-auto bg-border rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
            )}

            {/* Prediction Output */}
            {!isLoading && <PredictionOutput prediction={prediction} />}
            
            {/* Yield Trend Chart */}
            <YieldTrendChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prediction;
