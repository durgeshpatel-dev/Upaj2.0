import React from 'react';

const PredictionSummary = ({ 
  icon = "🌾", 
  label = "Recent Prediction", 
  value = "Corn: 120 bushels/acre",
  trend = "+12%",
  subtitle = "vs last season"
}) => {
  return (
    <div className="rounded-lg border border-border bg-background-card p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs text-text-secondary">{label}</p>
          <p className="mt-2 text-lg font-medium text-text-primary">{value}</p>
          {trend && (
            <div className="mt-1 flex items-center gap-1">
              <span className="text-primary text-sm font-medium">{trend}</span>
              <span className="text-text-secondary text-xs">{subtitle}</span>
            </div>
          )}
        </div>
        <div className="h-12 w-12 rounded-lg bg-background ring-1 ring-border flex items-center justify-center text-primary text-xl">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default PredictionSummary;
