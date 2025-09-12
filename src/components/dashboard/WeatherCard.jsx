import React, { useEffect, useState } from 'react';
import { locationAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Tr } from '../ui/SimpleTranslation';
import AlertBanner from './AlertBanner';
import { getAlertsForWeather } from '../../utils/weatherAlerts';

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
    // Test function for debugging - you can call this from console
    window.testWeatherDisplay = () => {
      const testData = {
        "success": true,
        "data": {
          "success": true,
          "weather": {
            "location": "Amritsar",
            "temperature": 30,
            "feelsLike": 37,
            "humidity": 79,
            "precipitation": 0,
            "windSpeed": 4,
            "windDirection": 0,
            "pressure": 1005,
            "visibility": 4,
            "condition": "Mist",
            "description": "mist",
            "icon": "50n",
            "cloudiness": 40,
            "sunrise": "6:12:43 am",
            "sunset": "6:41:15 pm"
          }
        }
      };
      
      console.log('🧪 Testing weather display with:', testData);
      
      // Simulate the same processing as the API call
      let weatherData = testData.data;
      if (weatherData.weather) {
        weatherData = weatherData.weather;
      }
      
      const normalizedWeather = {
        ...weatherData,
        temp: weatherData.temperature || weatherData.temp,
        tempC: weatherData.temperature || weatherData.tempC || weatherData.temp,
        summary: weatherData.condition || weatherData.summary,
        description: weatherData.description || weatherData.summary,
        wind: weatherData.windSpeed || weatherData.wind,
        windSpeed: weatherData.windSpeed || weatherData.wind,
      };
      
      console.log('🧪 Normalized test weather:', normalizedWeather);
      setWeather(normalizedWeather);
    };
    
    console.log('🧪 Weather test function available: window.testWeatherDisplay()');
  }, []);

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

        console.log('🌦️ WeatherCard: Starting location extraction from user:', user);

        // Try to get location from user's farm details
        if (user?.farmDetails) {
          state = user.farmDetails.state || user.farmDetails.region;
          district = user.farmDetails.district;
          
          // If no district but we have a location string, try to parse it
          if (!district && user.farmDetails.location) {
            const locationParts = user.farmDetails.location.split(',').map(p => p.trim());
            if (locationParts.length >= 2) {
              // Check if first part is a state
              const firstPartLower = locationParts[0].toLowerCase();
              const knownStates = ['punjab', 'gujarat', 'maharashtra', 'karnataka', 'tamil nadu', 'rajasthan', 'uttar pradesh'];
              
              if (knownStates.includes(firstPartLower)) {
                state = state || locationParts[0];
                district = locationParts.slice(1).join(', ');
              } else {
                // Assume last part is state, second-to-last is district
                state = state || locationParts[locationParts.length - 1];
                district = locationParts[locationParts.length - 2];
              }
            } else {
              district = user.farmDetails.location;
            }
          }
          
          // Fallback to city if still no district
          district = district || user.farmDetails.city;
          
          console.log('🌦️ WeatherCard: Location from farmDetails:', { state, district });
        }

        // Try to get location from user's farm object
        if (!state && user?.farm) {
          state = user.farm.state || user.farm.region;
          district = user.farm.district;
          
          // If no district but we have a location string, try to parse it
          if (!district && user.farm.location) {
            const locationParts = user.farm.location.split(',').map(p => p.trim());
            if (locationParts.length >= 2) {
              const firstPartLower = locationParts[0].toLowerCase();
              const knownStates = ['punjab', 'gujarat', 'maharashtra', 'karnataka', 'tamil nadu', 'rajasthan', 'uttar pradesh'];
              
              if (knownStates.includes(firstPartLower)) {
                state = state || locationParts[0];
                district = locationParts.slice(1).join(', ');
              } else {
                state = state || locationParts[locationParts.length - 1];
                district = locationParts[locationParts.length - 2];
              }
            } else {
              district = user.farm.location;
            }
          }
          
          district = district || user.farm.city;
          console.log('🌦️ WeatherCard: Location from farm object:', { state, district });
        }

        // Try to get location from user's direct properties
        if (!state && user?.state) {
          state = user.state;
          district = user.district || user.city;
          
          // If no district but we have a location string, try to parse it
          if (!district && user.location) {
            const locationParts = user.location.split(',').map(p => p.trim());
            if (locationParts.length >= 2) {
              const firstPartLower = locationParts[0].toLowerCase();
              const knownStates = ['punjab', 'gujarat', 'maharashtra', 'karnataka', 'tamil nadu', 'rajasthan', 'uttar pradesh'];
              
              if (knownStates.includes(firstPartLower)) {
                state = state || locationParts[0];
                district = locationParts.slice(1).join(', ');
              } else {
                state = state || locationParts[locationParts.length - 1];
                district = locationParts[locationParts.length - 2];
              }
            } else {
              district = user.location;
            }
          }
          
          console.log('🌦️ WeatherCard: Location from user properties:', { state, district });
        }

        // Try to get location from user's address/location object
        if (!state && user?.address) {
          state = user.address.state || user.address.region;
          district = user.address.district || user.address.city;
          console.log('🌦️ WeatherCard: Location from address:', { state, district });
        }

        if (!state && user?.location) {
          state = user.location.state || user.location.region;
          district = user.location.district || user.location.city;
          console.log('🌦️ WeatherCard: Location from location object:', { state, district });
        }

        // Fallback to defaults if no location found
        // Use smart defaults based on district if available
        let finalState = state;
        let finalDistrict = district;
        
        if (!finalState && finalDistrict) {
          // Try to determine state from district
          const districtLower = finalDistrict.toLowerCase();
          if (['amritsar', 'ludhiana', 'chandigarh', 'jalandhar', 'patiala', 'bathinda', 'mohali'].includes(districtLower)) {
            finalState = 'Punjab';
          } else if (['ahmedabad', 'surat', 'vadodara', 'baroda', 'rajkot', 'bhavnagar', 'jamnagar'].includes(districtLower)) {
            finalState = 'Gujarat';
          }
        }
        
        // Final fallbacks
        finalState = finalState || 'Gujarat';
        finalDistrict = finalDistrict || 'Baroda';

        console.log('🌦️ WeatherCard: Final location before API call:', { 
          originalState: state, 
          originalDistrict: district,
          finalState, 
          finalDistrict 
        });

        console.log('WeatherCard: Fetching weather for:', { finalState, finalDistrict });

        // Call the API using the proper locationAPI function
        const result = await locationAPI.getWeatherData(finalState, finalDistrict);
        
        console.log('🌦️ WeatherCard: API result received:', result);
        
        if (result.success) {
          console.log('🌦️ WeatherCard: Setting weather data:', result.data);
          
          // Extract and normalize weather data from the API response
          let weatherData = result.data;
          
          // If the response has nested weather object, extract it
          if (weatherData.weather) {
            weatherData = weatherData.weather;
          }
          
          // Normalize property names to match what the component expects
          const normalizedWeather = {
            ...weatherData,
            temp: weatherData.temperature || weatherData.temp,
            tempC: weatherData.temperature || weatherData.tempC || weatherData.temp,
            summary: weatherData.condition || weatherData.summary,
            description: weatherData.description || weatherData.summary,
            wind: weatherData.windSpeed || weatherData.wind,
            windSpeed: weatherData.windSpeed || weatherData.wind,
          };
          
          console.log('🌦️ WeatherCard: Normalized weather data:', normalizedWeather);
          setWeather(normalizedWeather);
        } else {
          console.error('🌦️ WeatherCard: API error:', result.error);
          throw new Error(result.error || 'Failed to fetch weather data');
        }
      } catch (err) {
        console.error('WeatherCard: Error fetching weather data:', err);
        
        // Handle different types of errors
        if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
          setError('Backend server is not running');
        } else {
          setError(err.message || 'Failed to load weather data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [user, backendAvailable, isAuthenticated]);

  return (
    <div className="rounded-lg border border-border bg-background-card p-4">
      {/* Dynamic weather alerts */}
      {weather && (() => {
        const lang = (user?.preferredLanguage || user?.language || 'en').startsWith('hi') ? 'hi' : 'en'
        const alerts = getAlertsForWeather(weather, lang)
        if (alerts && alerts.length > 0) {
          // Render the first alert prominently
          const a = alerts[0]
          return (
            <div className="mb-3">
              <AlertBanner variant="warning">
                <div className="font-semibold">{a.title || (lang === 'hi' ? 'चेतावनी' : 'Alert')}</div>
                <ul className="mt-1 list-disc pl-5 text-sm">
                  {a.messages.map((m, idx) => (
                    <li key={idx}>{m}</li>
                  ))}
                </ul>
              </AlertBanner>
            </div>
          )
        }
        return null
      })()}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs text-text-secondary">
            <Tr>Weather Information</Tr>
            {show?.location && ` - ${show.location}`}
          </p>
          <p className="mt-2 text-lg font-medium text-text-primary">
            {loading ? (
              <Tr>Loading...</Tr>
            ) : show ? (
              `${show.condition || show.summary || show.description || 'Clear'}, ${show.temperature || show.tempC || show.temp || 'N/A'}°C`
            ) : (
              'N/A'
            )}
          </p>
          <div className="mt-1 grid grid-cols-2 gap-2 text-xs text-text-secondary">
            <div><Tr>Humidity</Tr>: {loading ? '...' : (show?.humidity || demo.humidity)}%</div>
            <div><Tr>Wind</Tr>: {loading ? '...' : (show?.windSpeed || show?.wind || demo.wind)} km/h</div>
          </div>
          {error && <div className="text-status-error text-xs mt-1">{error}</div>}
        </div>
        <div className="h-12 w-12 rounded-lg bg-background ring-1 ring-border flex items-center justify-center text-primary text-xl">
          {loading ? (
            '⏳'
          ) : show?.condition ? (
            // Map weather conditions to appropriate icons
            (() => {
              const condition = (show.condition || '').toLowerCase();
              if (condition.includes('rain')) return '🌧️';
              if (condition.includes('cloud')) return '☁️';
              if (condition.includes('clear')) return '☀️';
              if (condition.includes('mist') || condition.includes('fog')) return '🌫️';
              if (condition.includes('snow')) return '❄️';
              if (condition.includes('storm') || condition.includes('thunder')) return '⛈️';
              return '☀️'; // default
            })()
          ) : (
            '☀️'
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;