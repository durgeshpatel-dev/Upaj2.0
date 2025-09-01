import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

const FarmMap = () => {
  const [selectedLocation, setSelectedLocation] = useState('farm1');
  const [mapLoaded, setMapLoaded] = useState(false);

  // Sample farm locations with coordinates
  const farmLocations = {
    farm1: { 
      name: 'Main Farm', 
      lat: 40.7128, 
      lng: -74.0060, 
      acres: '250 acres',
      location: 'Iowa, USA'
    },
    farm2: { 
      name: 'North Field', 
      lat: 39.7391, 
      lng: -104.9847, 
      acres: '180 acres',
      location: 'Colorado, USA'
    },
    farm3: { 
      name: 'South Valley', 
      lat: 36.1627, 
      lng: -86.7816, 
      acres: '320 acres',
      location: 'Tennessee, USA'
    }
  };

  const currentFarm = farmLocations[selectedLocation];

  useEffect(() => {
    setMapLoaded(false);
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 800);
    return () => clearTimeout(timer);
  }, [selectedLocation]);

  const FarmMapView = () => (
    <div className="relative w-full h-full bg-gray-700 rounded-lg overflow-hidden">
      {/* Base map background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/40 via-green-700/30 to-yellow-600/20"></div>
      
      {/* Field patterns */}
      <div 
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(34, 139, 34, 0.4) 0%, transparent 50%),
            radial-gradient(circle at 80% 40%, rgba(107, 142, 35, 0.4) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(154, 205, 50, 0.4) 0%, transparent 50%),
            linear-gradient(45deg, rgba(34, 139, 34, 0.2) 25%, transparent 25%),
            linear-gradient(-45deg, rgba(107, 142, 35, 0.2) 25%, transparent 25%)
          `,
          backgroundSize: '200px 200px, 300px 300px, 250px 250px, 50px 50px, 50px 50px'
        }}
      ></div>

      {/* Farm boundary */}
      <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-primary bg-primary/10 rounded-lg">
        <div className="absolute -top-6 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded font-semibold">
          {currentFarm.name}
        </div>
      </div>

      {/* Center marker */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="relative">
          <div className="w-6 h-6 bg-primary rounded-full border-2 border-white shadow-lg"></div>
          <div className="absolute top-0 left-0 w-6 h-6 bg-primary rounded-full animate-ping opacity-30"></div>
        </div>
      </div>

      {/* Crop sections */}
      <div className="absolute top-1/3 left-1/3 w-16 h-12 border border-status-warning bg-status-warning/20 rounded">
        <div className="text-xs text-status-warning font-semibold p-1">Corn</div>
      </div>
      <div className="absolute top-2/3 left-1/2 w-12 h-16 border border-status-success bg-status-success/20 rounded">
        <div className="text-xs text-status-success font-semibold p-1">Wheat</div>
      </div>
      <div className="absolute top-1/2 left-2/3 w-20 h-10 border border-blue-400 bg-blue-400/20 rounded">
        <div className="text-xs text-blue-400 font-semibold p-1">Irrigation</div>
      </div>

      {/* Grid lines */}
      <div className="absolute top-0 left-1/2 w-1 h-full bg-gray-600 opacity-30 transform -translate-x-1/2"></div>
      <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-600 opacity-30 transform -translate-y-1/2"></div>

      {/* Map controls */}
      <div className="absolute top-4 right-4 bg-white rounded shadow-lg">
        <button className="w-8 h-8 text-gray-700 hover:bg-gray-100 flex items-center justify-center font-bold">+</button>
        <div className="border-t border-gray-200"></div>
        <button className="w-8 h-8 text-gray-700 hover:bg-gray-100 flex items-center justify-center font-bold">−</button>
      </div>

      {/* Scale */}
      <div className="absolute bottom-4 left-4 bg-white/90 px-2 py-1 rounded text-xs text-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-12 h-1 bg-gray-700"></div>
          <span>1 km</span>
        </div>
      </div>

      {/* Coordinates */}
      <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-xs">
        {currentFarm.lat.toFixed(4)}°, {currentFarm.lng.toFixed(4)}°
      </div>

      {/* Map type */}
      <div className="absolute top-4 left-4 bg-white/90 px-2 py-1 rounded text-xs text-gray-700 font-medium">
        Satellite View
      </div>
    </div>
  );

  const LoadingMap = () => (
    <div className="w-full h-full bg-background rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-2"></div>
        <div className="text-text-secondary text-sm">Loading satellite view...</div>
      </div>
    </div>
  );

  return (
    <Card className="border-border bg-background-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-text-primary text-base flex items-center gap-2">
            <span className="text-primary">📍</span>
            Farm Location
          </CardTitle>
          <select 
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="bg-background border border-border rounded px-2 py-1 text-xs text-text-primary"
          >
            {Object.entries(farmLocations).map(([key, farm]) => (
              <option key={key} value={key}>{farm.name}</option>
            ))}
          </select>
        </div>
        <div className="text-sm text-text-secondary mt-1">
          {currentFarm.location} • {currentFarm.acres}
        </div>
      </CardHeader>
      <CardContent>
        <div className="aspect-[4/3] w-full overflow-hidden rounded-lg ring-1 ring-border">
          {mapLoaded ? <FarmMapView /> : <LoadingMap />}
        </div>
        
        {/* Map Information */}
        <div className="mt-3 grid grid-cols-2 gap-4 text-xs">
          <div>
            <div className="text-text-secondary mb-1">Crop Distribution</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-2 bg-status-warning rounded"></div>
                <span className="text-text-primary">Corn (60%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-2 bg-status-success rounded"></div>
                <span className="text-text-primary">Wheat (35%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-2 bg-blue-400 rounded"></div>
                <span className="text-text-primary">Other (5%)</span>
              </div>
            </div>
          </div>
          <div>
            <div className="text-text-secondary mb-1">Farm Details</div>
            <div className="space-y-1 text-text-primary">
              <div>Total Area: {currentFarm.acres}</div>
              <div>Soil Type: Loamy</div>
              <div>Elevation: 1,200 ft</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FarmMap;
