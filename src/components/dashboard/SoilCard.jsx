import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { RefreshCw } from 'lucide-react';
import axios from 'axios';
import { locationAPI } from '../../utils/api';
import { Tr } from '../ui/SimpleTranslation';

const SoilCard = () => {
  const { user, isAuthenticated } = useAuth();
  const [soil, setSoil] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Normalize various backend soil response shapes into the keys this component expects
  const normalizeSoilData = (raw) => {
    if (!raw) return null;

    // Unwrap common container shapes
    let s = raw;
    if (raw.data) s = raw.data;
    if (s.soilData) s = s.soilData;
    if (s.soil) s = s.soil;
    if (raw.externalData && raw.externalData.soilData) s = raw.externalData.soilData;

    // Helper to pick first non-null value
    const pick = (...keys) => {
      for (const k of keys) {
        if (k == null) continue;
        // support nested path arrays
        if (Array.isArray(k)) {
          let cur = s;
          for (const part of k) {
            if (!cur) { cur = null; break; }
            cur = cur[part];
          }
          if (cur !== undefined && cur !== null) return cur;
        } else if (s[k] !== undefined && s[k] !== null) {
          return s[k];
        }
      }
      return null;
    };

    const pH = pick(['properties','pH'], ['properties','ph'], 'pH', 'ph', ['analysis','pH']);
    const moisture = pick(['properties','moisture'], ['properties','waterHolding'], 'moisture', 'waterHolding', ['analysis','waterHolding'], 'humidity');
    const nitrogen = pick(['properties','nitrogen'], 'nitrogen', 'N');
    const phosphorus = pick(['properties','phosphorus'], 'phosphorus', 'P');
    const potassium = pick(['properties','potassium'], 'potassium', 'K');
    const organicMatter = pick(['properties','organicCarbon'], ['properties','organicMatter'], 'organicMatter', 'om');
    const temperature = pick('temperature', ['properties','temperature'], ['weather','temperature']);

    const normalized = {
      ph: pH ?? '--',
      pH: pH ?? '--',
      moisture: moisture ?? '--',
      nitrogen: nitrogen ?? '--',
      phosphorus: phosphorus ?? '--',
      potassium: potassium ?? '--',
      organicMatter: organicMatter ?? '--',
      temperature: temperature ?? '--',
      // keep original for debugging
      _raw: s
    };

    return normalized;
  };
  
  // Function to safely get soil data with fallbacks
  const getSoilValue = (key, fallback = '--') => {
    if (!soil) return fallback;
    
    // Handle different possible key variations
    const variations = {
      ph: ['ph', 'pH', 'Ph'],
      moisture: ['moisture', 'waterContent', 'soilMoisture', 'humidity', 'waterHolding'],
      nitrogen: ['nitrogen', 'N', 'n', 'nitrate'],
      phosphorus: ['phosphorus', 'P', 'p', 'phosphate'],
      potassium: ['potassium', 'K', 'k', 'potash'],
      organicMatter: ['organicMatter', 'organic_matter', 'om', 'humus'],
      temperature: ['temperature', 'temp', 'soilTemp']
    };
    
    const possibleKeys = variations[key] || [key];
    
    for (const possibleKey of possibleKeys) {
      if (soil[possibleKey] !== undefined && soil[possibleKey] !== null) {
        return soil[possibleKey];
      }
    }
    
    return fallback;
  };
  
  const show = {
    ph: getSoilValue('ph'),
    moisture: getSoilValue('moisture'),
    nitrogen: getSoilValue('nitrogen'),
    phosphorus: getSoilValue('phosphorus'),
    potassium: getSoilValue('potassium'),
    organicMatter: getSoilValue('organicMatter'),
    temperature: getSoilValue('temperature')
  };

  // Function to manually fetch soil data
  const fetchSoil = async () => {
    console.log('🔄 Manual soil fetch triggered');
    setIsRefreshing(true);
    setError(null);

    // Extract location from multiple possible sources in user object
    let state = null;
    let district = null;

    // Try to get location from user's farm details
    if (user?.farmDetails) {
      state = user.farmDetails.state || user.farmDetails.region;
      district = user.farmDetails.district;
      
      // If no district but we have a location string, try to parse it
      if (!district && user.farmDetails.location) {
        const locationParts = user.farmDetails.location.split(',').map(p => p.trim());
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
          district = user.farmDetails.location;
        }
      }
      
      district = district || user.farmDetails.city;
      console.debug('SoilCard: Manual fetch - Location from farmDetails:', { state, district });
    }

    // Try to get location from user's farm object
    if (!state && user?.farm) {
      state = user.farm.state || user.farm.region;
      district = user.farm.district;
      
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
      console.debug('SoilCard: Manual fetch - Location from farm object:', { state, district });
    }

    // Try to get location from user's direct properties
    if (!state && user?.state) {
      state = user.state;
      district = user.district || user.city;
      
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
      
      console.debug('SoilCard: Manual fetch - Location from user properties:', { state, district });
    }

    // Try to get location from user's address/location object
    if (!state && user?.address) {
      state = user.address.state || user.address.region;
      district = user.address.district || user.address.city;
      console.debug('SoilCard: Manual fetch - Location from address:', { state, district });
    }

    if (!state && user?.location) {
      state = user.location.state || user.location.region;
      district = user.location.district || user.location.city;
      console.debug('SoilCard: Manual fetch - Location from location object:', { state, district });
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
    
    console.log('🔄 Manual soil fetch: Calling API with:', { state: finalState, district: finalDistrict });

    try {
      // Use the locationAPI which has proper validation and normalization
      const result = await locationAPI.getSoilData(finalState, finalDistrict);
      
      if (result.success) {
        console.log('🔄 Manual soil fetch: API response:', result.data);
        
        // Handle different response formats
        let soilData = result.data;
        if (result.data.data) soilData = result.data.data;
        if (soilData.soil) soilData = soilData.soil;
        // If returned object is wrapping soilData
        if (soilData.soilData) soilData = soilData.soilData;

        const normalized = normalizeSoilData(soilData) || normalizeSoilData(result.data) || null;
        setSoil(normalized);
        console.log('✅ Manual soil fetch: Success - Normalized soil data:', normalized, 'raw:', soilData);
        setError(null);
      } else {
        console.error('❌ Manual soil fetch: API error:', result.error);
        setError(result.error || 'No soil data received');
      }
    } catch (err) {
      console.error('❌ Manual soil fetch: API call failed:', err);
            
      // Handle different types of errors
      if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
        setError('Backend server is not running. Please start the server.');
      } else {
        setError(`Failed to load soil data: ${err.response?.data?.message || err.message}`);
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      setError(null);
      
      console.debug('SoilCard: Complete user data from AuthContext:', user);
      console.debug('SoilCard: Auth state:', { isAuthenticated });

      // if (!backendAvailable) {
      //   console.debug('SoilCard: backend not available, skipping soil fetch');
      //   return;
      // }

      // Extract location from multiple possible sources in user object
      let state = null;
      let district = null;

      // Try to get location from user's farm details
      if (user?.farmDetails) {
        state = user.farmDetails.state || user.farmDetails.region;
        district = user.farmDetails.district;
        
        if (!district && user.farmDetails.location) {
          const locationParts = user.farmDetails.location.split(',').map(p => p.trim());
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
            district = user.farmDetails.location;
          }
        }
        
        district = district || user.farmDetails.city;
        console.debug('SoilCard: Location from farmDetails:', { state, district });
      }

      // Try to get location from user's farm object
      if (!state && user?.farm) {
        state = user.farm.state || user.farm.region;
        district = user.farm.district;
        
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
        console.debug('SoilCard: Location from farm object:', { state, district });
      }

      // Try to get location from user's direct properties
      if (!state && user?.state) {
        state = user.state;
        district = user.district || user.city;
        
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
        
        console.debug('SoilCard: Location from user properties:', { state, district });
      }

      // Try to get location from user's address/location object
      if (!state && user?.address) {
        state = user.address.state || user.address.region;
        district = user.address.district || user.address.city;
        console.debug('SoilCard: Location from address:', { state, district });
      }

      if (!state && user?.location) {
        state = user.location.state || user.location.region;
        district = user.location.district || user.location.city;
        console.debug('SoilCard: Location from location object:', { state, district });
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
      
      console.debug('SoilCard: Final location for API call:', { 
        originalState: state, 
        originalDistrict: district,
        finalState, 
        finalDistrict 
      });

      console.debug('SoilCard: Calling soil API with:', { state: finalState, district: finalDistrict });
      setLoading(true);
      try {
        // Use the locationAPI which has proper validation and normalization
        const result = await locationAPI.getSoilData(finalState, finalDistrict);
        
        if (result.success) {
          console.debug('SoilCard: API response:', result.data);
          
          // Handle different response formats
          let soilData = result.data;
          if (result.data.data) soilData = result.data.data;
          if (soilData.soil) soilData = soilData.soil;
          // If returned object is wrapping soilData
          if (soilData.soilData) soilData = soilData.soilData;

          const normalized = normalizeSoilData(soilData) || normalizeSoilData(result.data) || null;
          setSoil(normalized);
          console.debug('✅ SoilCard: Success - Normalized soil data:', normalized);
          setError(null);
        } else {
          console.error('❌ SoilCard: API error:', result.error);
          setError(result.error || 'No soil data received');
        }
      } catch (err) {
        console.error('SoilCard: API call failed:', err);
        
        // Handle different types of errors
        if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
          setError('Backend server is not running. Please start the server.');
        } else {
          setError(`Failed to load soil data: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, isAuthenticated]);

  // Manual test function for console testing
  // You can call this from browser console: window.testSoilAPI()
  React.useEffect(() => {
    window.testSoilAPI = async (state = 'Gujarat', district = 'Baroda') => {
      console.log('🧪 Manual soil API test called with:', { state, district });
      try {
        const result = await locationAPI.getSoilData(state, district);
        console.log('🧪 Test result:', result);
        return result;
      } catch (err) {
        console.error('🧪 Test failed:', err);
        return { success: false, error: err.message };
      }
    };
    console.log('🧪 Soil API test function available: window.testSoilAPI(state, district)');
  }, []);

  const getNutrientColor = (level) => {
    if (!level || level === '--') return 'text-text-secondary';
    
    const levelStr = String(level).toLowerCase();
    
    // Handle numeric values (for pH, percentages, etc.)
    if (!isNaN(level)) {
      const numLevel = parseFloat(level);
      
      // pH specific coloring (6.0-7.0 is optimal)
      if (levelStr.includes('ph') || levelStr.includes('acidity')) {
        if (numLevel >= 6.0 && numLevel <= 7.0) return 'text-status-success';
        if (numLevel >= 5.5 && numLevel < 6.0 || numLevel > 7.0 && numLevel <= 7.5) return 'text-status-warning';
        return 'text-status-error';
      }
      
      // For percentage values (moisture, organic matter)
      if (numLevel >= 70) return 'text-status-success';
      if (numLevel >= 40) return 'text-status-warning';
      return 'text-status-error';
    }
    
    // Handle text-based levels
    switch (levelStr) {
      case 'high': 
      case 'good': 
      case 'optimal': 
      case 'excellent':
        return 'text-status-success';
      case 'medium': 
      case 'moderate': 
      case 'average':
        return 'text-status-warning';
      case 'low': 
      case 'poor': 
      case 'deficient':
        return 'text-status-error';
      default: 
        return 'text-text-secondary';
    }
  };

  const formatSoilValue = (value, unit = '') => {
    if (!value || value === '--') return '--';
    
    // Convert to string for easier checking
    const valueStr = String(value);
    
    // If it's a number, format it appropriately
    if (!isNaN(value)) {
      const num = parseFloat(value);
      return `${num.toFixed(1)}${unit}`;
    }
    
    // If the value already contains the unit, don't add it again
    if (unit && valueStr.includes(unit.replace('°', ''))) {
      return valueStr;
    }
    
    return `${valueStr}${unit}`;
  };

  return (
    <div className="rounded-lg border border-border bg-background-card p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs text-text-secondary"><Tr>Soil Health</Tr></p>
          <p className="mt-2 text-lg font-medium text-text-primary">
            {loading ? <Tr>Loading...</Tr> : (
              <>
                pH: {formatSoilValue(show.ph)}, <Tr>Moisture</Tr>: {formatSoilValue(show.moisture, '%')}
              </>
            )}
          </p>
          <div className="mt-1 grid grid-cols-3 gap-2 text-xs">
            <div>
              N: <span className={getNutrientColor(show.nitrogen)}>{formatSoilValue(show.nitrogen)}</span>
            </div>
            <div>
              P: <span className={getNutrientColor(show.phosphorus)}>{formatSoilValue(show.phosphorus)}</span>
            </div>
            <div>
              K: <span className={getNutrientColor(show.potassium)}>{formatSoilValue(show.potassium)}</span>
            </div>
          </div>
          {show.organicMatter && show.organicMatter !== '--' && (
            <div className="mt-1 text-xs">
              <span className="text-text-secondary"><Tr>Organic Matter</Tr>: </span>
              <span className={getNutrientColor(show.organicMatter)}>{formatSoilValue(show.organicMatter, '%')}</span>
            </div>
          )}
          {show.temperature && show.temperature !== '--' && (
            <div className="mt-1 text-xs">
              <span className="text-text-secondary"><Tr>Soil Temp</Tr>: </span>
              <span className="text-text-primary">{formatSoilValue(show.temperature, '°C')}</span>
            </div>
          )}
          {error && <div className="text-status-error text-xs mt-1">{error}</div>}
          {soil && (
            <div className="mt-1 text-xs text-text-secondary">
              <Tr>Last updated</Tr>: {new Date().toLocaleTimeString()}
            </div>
          )}
        </div>
        <div className="h-12 w-12 rounded-lg bg-background ring-1 ring-border flex items-center justify-center text-primary text-xl">
          🌱
        </div>
        <button
          onClick={fetchSoil}
          disabled={isRefreshing}
          className="h-8 w-8 rounded-lg bg-primary/10 hover:bg-primary/20 ring-1 ring-border flex items-center justify-center text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Refresh soil data"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  );
};

export default SoilCard;
