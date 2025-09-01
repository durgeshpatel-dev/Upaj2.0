import React from 'react';

const WeatherCard = ({ 
  icon = "☀️", 
  label = "Weather Update", 
  value = "Sunny, 25°C",
  humidity = "65%",
  windSpeed = "12 km/h"
}) => {
  return (
    <div className="rounded-lg border border-border bg-background-card p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs text-text-secondary">{label}</p>
          <p className="mt-2 text-lg font-medium text-text-primary">{value}</p>
          <div className="mt-1 grid grid-cols-2 gap-2 text-xs text-text-secondary">
            <div>Humidity: {humidity}</div>
            <div>Wind: {windSpeed}</div>
          </div>
        </div>
        <div className="h-12 w-12 rounded-lg bg-background ring-1 ring-border flex items-center justify-center text-primary text-xl">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
