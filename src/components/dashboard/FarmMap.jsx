import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

// Custom marker icon
const markerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const LocationMarker = ({ setFarmLocation }) => {
  const [position, setPosition] = useState(null);
  const map = useMap();

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      const newPos = [lat, lng];
      setPosition(newPos);
      setFarmLocation({ lat, lng });
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={markerIcon} />
  );
};

// Component to handle map instance and zoom controls
const MapHandler = ({ setMapInstance }) => {
  const map = useMap();
  
  useEffect(() => {
    setMapInstance(map);
  }, [map, setMapInstance]);
  
  return null;
};

const FarmMap = () => {
  const [farmLocation, setFarmLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [map, setMap] = useState(null);
  const [mapType, setMapType] = useState('standard');
  
  const defaultLocation = React.useMemo(() => ({
    lat: 41.8781,
    lng: -93.0977
  }), []);

  const toggleMapType = () => {
    setMapType(prev => prev === 'standard' ? 'satellite' : 'standard');
  };

  const getTileLayerUrl = () => {
    if (mapType === 'satellite') {
      // Using Esri World Imagery for satellite view
      return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
    }
    // Standard OpenStreetMap
    return "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  };

  const getTileLayerAttribution = () => {
    if (mapType === 'satellite') {
      return "&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community";
    }
    return "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors";
  };

  const getCurrentLocation = useCallback(() => {
    if (isLocating) return; // Prevent multiple calls
    
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setFarmLocation(location);
          if (map) {
            map.flyTo([location.lat, location.lng], 15);
          }
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setFarmLocation(defaultLocation);
          if (map) {
            map.flyTo([defaultLocation.lat, defaultLocation.lng], 15);
          }
          setIsLocating(false);
        }
      );
    } else {
      setFarmLocation(defaultLocation);
      if (map) {
        map.flyTo([defaultLocation.lat, defaultLocation.lng], 15);
      }
      setIsLocating(false);
    }
  }, [map, defaultLocation, isLocating]);

  // Only call getCurrentLocation once when the component mounts
  useEffect(() => {
    if (!farmLocation && !isLocating) {
      getCurrentLocation();
    }
  }, [farmLocation, isLocating, getCurrentLocation]);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-800">Farm Location</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative h-80 w-full rounded-xl overflow-hidden shadow-lg border border-gray-200">
          <MapContainer
            center={[defaultLocation.lat, defaultLocation.lng]}
            zoom={15}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false} // Disable default zoom control
            key={mapType} // Force re-render when map type changes
          >
            <TileLayer
              url={getTileLayerUrl()}
              attribution={getTileLayerAttribution()}
            />
            <MapHandler setMapInstance={setMap} />
            <LocationMarker setFarmLocation={setFarmLocation} />
            {farmLocation && <Marker position={[farmLocation.lat, farmLocation.lng]} icon={markerIcon} />}
          </MapContainer>
          
          {/* Custom Location Button (Google Maps style) */}
          <button
            onClick={getCurrentLocation}
            disabled={isLocating}
            className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-300 flex items-center justify-center hover:shadow-xl transition-all duration-200 disabled:opacity-50 z-[1000]"
            title="Get current location"
          >
            {isLocating ? (
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            )}
          </button>
          
          {/* Map Type Toggle Button */}
          <button
            onClick={toggleMapType}
            className="absolute top-4 left-4 w-12 h-10 bg-white rounded shadow-lg border border-gray-300 flex items-center justify-center hover:shadow-xl transition-all duration-200 z-[1000]"
            title={`Switch to ${mapType === 'standard' ? 'satellite' : 'standard'} view`}
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mapType === 'standard' ? (
                // Satellite icon
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              ) : (
                // Map icon
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              )}
            </svg>
          </button>

          {/* Custom Zoom Controls (Google Maps style) */}
          <div className="absolute top-16 right-4 flex flex-col bg-white rounded-lg shadow-lg border border-gray-300 overflow-hidden z-[1000]">
            <button
              onClick={() => map && map.setZoom(map.getZoom() + 1)}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors border-b border-gray-200"
              title="Zoom in"
            >
              <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            <button
              onClick={() => map && map.setZoom(map.getZoom() - 1)}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
              title="Zoom out"
            >
              <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
              </svg>
            </button>
          </div>

          {farmLocation && (
            <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-gray-200 z-[1000]">
              <div className="font-mono text-xs text-gray-900">
                {farmLocation.lat.toFixed(6)}, {farmLocation.lng.toFixed(6)}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FarmMap;
