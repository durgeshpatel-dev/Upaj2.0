import React from 'react';
import { TrendingUp, Leaf, Calendar, Droplets, Sun, AlertCircle } from 'lucide-react';

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

      {/* Analysis Details */}
      <div className="bg-background-card p-4 rounded-lg border border-border">
        <h4 className="text-base font-semibold text-text-primary mb-3">Analysis Details</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">{/* Weather Conditions */}
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-background rounded border border-border">
              <div className="flex items-center space-x-2">
                <Sun size={14} className="text-status-warning" />
                <span className="text-xs text-text-secondary">Weather Impact</span>
              </div>
              <span className="text-xs font-semibold text-status-success px-2 py-1 bg-status-success/10 rounded">Favorable</span>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-background rounded border border-border">
              <div className="flex items-center space-x-2">
                <Droplets size={14} className="text-primary" />
                <span className="text-xs text-text-secondary">Soil Moisture</span>
              </div>
              <span className="text-xs font-semibold text-status-success px-2 py-1 bg-status-success/10 rounded">Optimal</span>
            </div>
          </div>

          {/* Growing Conditions */}
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-background rounded border border-border">
              <div className="flex items-center space-x-2">
                <Calendar size={14} className="text-text-secondary" />
                <span className="text-xs text-text-secondary">Growing Season</span>
              </div>
              <span className="text-xs font-semibold text-status-warning px-2 py-1 bg-status-warning/10 rounded">Good</span>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-background rounded border border-border">
              <div className="flex items-center space-x-2">
                <Leaf size={14} className="text-status-success" />
                <span className="text-xs text-text-secondary">Crop Health</span>
              </div>
              <span className="text-xs font-semibold text-status-success px-2 py-1 bg-status-success/10 rounded">Excellent</span>
            </div>
          </div>
        </div>

        {/* Yield Breakdown */}
        <div className="border-t border-border pt-3">
          <h5 className="text-xs font-medium text-text-primary mb-2">Yield Breakdown</h5>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-text-primary">{(prediction.yield * 0.7).toFixed(0)}</div>
              <div className="text-xs text-text-secondary">Conservative</div>
            </div>
            <div>
              <div className="text-lg font-bold text-primary">{prediction.yield}</div>
              <div className="text-xs text-text-secondary">Expected</div>
            </div>
            <div>
              <div className="text-lg font-bold text-text-primary">{(prediction.yield * 1.2).toFixed(0)}</div>
              <div className="text-xs text-text-secondary">Optimistic</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-background-card p-6 rounded-lg border border-border">
        <div className="flex items-center space-x-2 mb-4">
          <AlertCircle size={18} className="text-primary" />
          <h4 className="text-lg font-semibold text-text-primary">Recommendations</h4>
        </div>
        
        <div className="space-y-3">
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <h5 className="text-sm font-semibold text-text-primary mb-2">🌱 Immediate Actions</h5>
            <ul className="space-y-1 text-sm text-text-secondary">
              <li>• Monitor soil moisture levels daily</li>
              <li>• Check for early signs of pest activity</li>
              <li>• Ensure adequate drainage in low-lying areas</li>
            </ul>
          </div>
          
          <div className="p-4 bg-status-warning/5 border border-status-warning/20 rounded-lg">
            <h5 className="text-sm font-semibold text-text-primary mb-2">⚠️ Watch Points</h5>
            <ul className="space-y-1 text-sm text-text-secondary">
              <li>• Weather forecast shows possible dry spell next week</li>
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
