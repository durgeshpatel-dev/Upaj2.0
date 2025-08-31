import React, { useState } from 'react';
import PredictionForm from '../components/prediction/PredictionForm';
import PredictionOutput from '../components/prediction/PredictionOutput';
import YieldTrendChart from '../components/prediction/YieldTrendChart';

const Prediction = () => {
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePredictionSubmit = (formData) => {
    setIsLoading(true);
    
    // Simulate API call with sample data
    setTimeout(() => {
      setPrediction({
        yield: Math.floor(Math.random() * (150 - 90) + 90), // Random yield between 90-150
        confidence: Math.floor(Math.random() * (95 - 75) + 75), // Random confidence 75-95%
        landArea: formData.landArea ? parseFloat(formData.landArea) : null,
        cropType: formData.cropType,
        location: formData.location,
        soilType: formData.soilType,
        plantingDate: formData.plantingDate
      });
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="xl:col-span-1 space-y-6">
            <PredictionForm onSubmit={handlePredictionSubmit} isLoading={isLoading} />
            
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
