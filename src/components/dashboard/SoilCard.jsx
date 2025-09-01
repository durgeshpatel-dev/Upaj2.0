import React from 'react';

const SoilCard = ({ 
  icon = "🌱", 
  label = "Soil Insights", 
  value = "pH: 6.5, Moisture: 15%",
  nitrogen = "High",
  phosphorus = "Medium"
}) => {
  const getNutrientColor = (level) => {
    switch(level.toLowerCase()) {
      case 'high': return 'text-status-success';
      case 'medium': return 'text-status-warning';
      case 'low': return 'text-status-error';
      default: return 'text-text-secondary';
    }
  };

  return (
    <div className="rounded-lg border border-border bg-background-card p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs text-text-secondary">{label}</p>
          <p className="mt-2 text-lg font-medium text-text-primary">{value}</p>
          <div className="mt-1 grid grid-cols-2 gap-2 text-xs">
            <div>
              N: <span className={getNutrientColor(nitrogen)}>{nitrogen}</span>
            </div>
            <div>
              P: <span className={getNutrientColor(phosphorus)}>{phosphorus}</span>
            </div>
          </div>
        </div>
        <div className="h-12 w-12 rounded-lg bg-background ring-1 ring-border flex items-center justify-center text-primary text-xl">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default SoilCard;
