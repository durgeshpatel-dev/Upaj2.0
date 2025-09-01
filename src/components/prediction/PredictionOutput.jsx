import React from 'react';
import { TrendingUp, Leaf, AlertCircle } from 'lucide-react';

const PredictionOutput = ({ prediction }) => {
  if (!prediction) {
    return (
      <div className="bg-background-card p-4 rounded-lg border border-border">
        <h3 className="text-lg font-bold text-text-primary mb-3">Prediction Output</h3>
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-border rounded-full flex items-center justify-center mx-auto mb-3">
            <TrendingUp size={24} className="text-text-secondary" />
          </div>
          <p className="text-text-secondary text-base mb-1">No Prediction Yet</p>
          <p className="text-text-secondary text-xs">Fill out the form to see results</p>
        </div>
      </div>
    );
  }

  // Convert hectares to acres for calculation (1 hectare = 2.471 acres)
  const totalYieldBushels = prediction.landArea ? (prediction.yield * prediction.landArea * 2.471).toFixed(1) : null;
  const totalYieldTons = prediction.landArea ? ((prediction.yield * prediction.landArea * 2.471) * 0.0272).toFixed(2) : null;

  return (
    <div className="space-y-4">
      {/* Main Prediction Card */}
      <div className="bg-background-card p-4 rounded-lg border border-border">
        <h3 className="text-lg font-bold text-text-primary mb-4">Prediction Output</h3>
        
        {/* Primary Yield Display */}
        <div className="text-center p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20 mb-4">
          <div className="mb-2">
            <span className="text-text-secondary text-sm font-medium">Estimated Yield</span>
          </div>
          <div className="flex items-baseline justify-center space-x-2 mb-2">
            <span className="text-4xl font-bold text-primary">
              {prediction.yield}
            </span>
            <span className="text-primary text-lg font-semibold">
              bushels/acre
            </span>
          </div>
          {prediction.confidence && (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-status-success rounded-full"></div>
              <span className="text-xs text-text-secondary">Confidence: </span>
              <span className="text-xs font-semibold text-status-success">{prediction.confidence}%</span>
            </div>
          )}
        </div>

        {/* Area and Total Yield */}
        {prediction.landArea && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div className="bg-background p-3 rounded-lg border border-border">
              <div className="flex items-center space-x-2 mb-2">
                <Leaf size={16} className="text-primary" />
                <span className="text-text-secondary text-xs font-medium">Farm Area</span>
              </div>
              <div className="text-lg font-bold text-text-primary">{prediction.landArea}</div>
              <div className="text-text-secondary text-xs">hectares</div>
            </div>
            <div className="bg-background p-3 rounded-lg border border-border">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp size={16} className="text-status-success" />
                <span className="text-text-secondary text-xs font-medium">Total Expected</span>
              </div>
              <div className="text-lg font-bold text-status-success">{totalYieldBushels}</div>
              <div className="text-text-secondary text-xs">bushels ({totalYieldTons} tons)</div>
            </div>
          </div>
        )}
      </div>

     
      {/* Recommendations */}
      <div className="bg-background-card p-4 rounded-lg border border-border">
        <div className="flex items-center space-x-2 mb-3">
          <AlertCircle size={16} className="text-primary" />
          <h4 className="text-base font-semibold text-text-primary">Recommendations</h4>
        </div>
        
        <div className="space-y-2">
          <div className="p-3 bg-primary/5 border border-primary/20 rounded">
            <h5 className="text-xs font-semibold text-text-primary mb-1">🌱 Immediate Actions</h5>
            <ul className="space-y-0.5 text-xs text-text-secondary">
              <li>• Monitor soil moisture levels daily</li>
              <li>• Check for early signs of pest activity</li>
            </ul>
          </div>
          
          <div className="p-3 bg-status-warning/5 border border-status-warning/20 rounded">
            <h5 className="text-xs font-semibold text-text-primary mb-1">⚠️ Watch Points</h5>
            <ul className="space-y-0.5 text-xs text-text-secondary">
              <li>• Consider nitrogen application in weeks 3-4</li>
              <li>• Monitor for fungal diseases in humid conditions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionOutput;
