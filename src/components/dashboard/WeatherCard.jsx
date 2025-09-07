import React, { useEffect, useState } from 'react';
import { locationAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Tr } from '../ui/SimpleTranslation';

const WeatherCard = () => {
  const { user, isAuthenticated, backendAvailable } = useAuth();
  
  // Local state needed by the component
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  // Demo/fallback values used when real data is not available yet
  const demo = { tempC: '--', temp: '--', humidity: '--', wind: '--', summary: 'N/A', description: '' };
  const show = weather || demo;

  useEffect(() => {
    const fetchWeatherData = async () => {
      console.log('🌦️ WeatherCard useEffect triggered');
      console.log('👤 User:', user);
      console.log('🔒 isAuthenticated:', isAuthenticated);
      console.log('🌐 backendAvailable:', backendAvailable);
      
      // Temporarily skip backend check for debugging
      // if (!backendAvailable) {
      //   console.debug('WeatherCard: backend not available, skipping weather fetch');
      //   return;
      // }

      setLoading(true);
      setError(null);
      
      try {
        // Extract location from user data
        let state = null;
        let district = null;

        // Try to get location from user's farm details
        if (user?.farmDetails) {
          state = user.farmDetails.state || user.farmDetails.region;
          district = user.farmDetails.district || user.farmDetails.location || user.farmDetails.city;
        }

        // Try to get location from user's farm object
        if (!state && user?.farm) {
          state = user.farm.state || user.farm.region;
          district = user.farm.district || user.farm.location || user.farm.city;
        }

        // Try to get location from user's direct properties
        if (!state && user?.state) {
          state = user.state;
          district = user.district || user.city || user.location;
        }

        // Try to get location from user's address/location object
        if (!state && user?.address) {
          state = user.address.state || user.address.region;
          district = user.address.district || user.address.city;
        }

        if (!state && user?.location) {
          state = user.location.state || user.location.region;
          district = user.location.district || user.location.city;
        }

        // Fallback to defaults if no location found
        const finalState = state || 'Gujarat';
        const finalDistrict = district || 'Baroda';

        console.log('WeatherCard: Fetching weather for:', { finalState, finalDistrict });

        // Call the API using the proper locationAPI function
        const result = await locationAPI.getWeatherData(finalState, finalDistrict);
        
        if (result.success) {
          setWeather(result.data);
        } else {
          throw new Error(result.error || 'Failed to fetch weather data');
        }
      } catch (err) {
        console.error('WeatherCard: Error fetching weather data:', err);
        setError(err.message || 'Failed to load weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [user, backendAvailable, isAuthenticated]);

  return (
    <div className="rounded-lg border border-border bg-background-card p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs text-text-secondary"><Tr>Weather Information</Tr></p>
          <p className="mt-2 text-lg font-medium text-text-primary">
            {loading ? <Tr>Loading...</Tr> : show ? `${show.summary || show.description || ''}, ${((show.tempC ?? show.temp) || '')}°C` : 'N/A'}
          </p>
          <div className="mt-1 grid grid-cols-2 gap-2 text-xs text-text-secondary">
            <div><Tr>Humidity</Tr>: {loading ? '...' : (show?.humidity ?? demo.humidity)}</div>
            <div><Tr>Wind</Tr>: {loading ? '...' : ((show?.windSpeed ?? show?.wind) ?? demo.wind)}</div>
          </div>
          {error && <div className="text-status-error text-xs mt-1">{error}</div>}
        </div>
        <div className="h-12 w-12 rounded-lg bg-background ring-1 ring-border flex items-center justify-center text-primary text-xl">
          ☀️
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;