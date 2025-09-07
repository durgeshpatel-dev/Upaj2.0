import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { RefreshCw } from 'lucide-react';
import axios from 'axios';
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

    const pH = pick(['properties','pH'], 'pH', 'ph', ['analysis','pH']);
    const moisture = pick(['properties','moisture'], 'moisture', 'waterHolding', ['analysis','waterHolding'], 'humidity');
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
      moisture: ['moisture', 'waterContent', 'soilMoisture', 'humidity'],
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
      district = user.farmDetails.district || user.farmDetails.location || user.farmDetails.city;
      console.debug('SoilCard: Manual fetch - Location from farmDetails:', { state, district });
    }

    // Try to get location from user's farm object
    if (!state && user?.farm) {
      state = user.farm.state || user.farm.region;
      district = user.farm.district || user.farm.location || user.farm.city;
      console.debug('SoilCard: Manual fetch - Location from farm object:', { state, district });
    }

    // Try to get location from user's direct properties
    if (!state && user?.state) {
      state = user.state;
      district = user.district || user.city || user.location;
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
    const finalState = state || 'Gujarat';
    const finalDistrict = district || 'Baroda';
    
    console.log('🔄 Manual soil fetch: Calling API with:', { state: finalState, district: finalDistrict });

    try {
      const response = await axios.post('http://localhost:5001/api/soil-data', {
        state: finalState,
        district: finalDistrict
      });
      
      console.log('🔄 Manual soil fetch: API response:', response.data);
      
      if (response.data) {
        console.log('🔄 Manual soil fetch: Raw API response:', response.data);
        
        // Handle different response formats
  let soilData = response.data;
  if (response.data.data) soilData = response.data.data;
  if (soilData.soil) soilData = soilData.soil;
  // If returned object is wrapping soilData
  if (soilData.soilData) soilData = soilData.soilData;

  const normalized = normalizeSoilData(soilData) || normalizeSoilData(response.data) || null;
  setSoil(normalized);
  console.log('✅ Manual soil fetch: Success - Normalized soil data:', normalized, 'raw:', soilData);
        setError(null);
      } else {
        console.error('❌ Manual soil fetch: No data received');
        setError('No soil data received');
      }
    } catch (err) {
      console.error('❌ Manual soil fetch: API call failed:', err);
      setError(`Failed to load soil data: ${err.response?.data?.message || err.message}`);
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
        district = user.farmDetails.district || user.farmDetails.location || user.farmDetails.city;
        console.debug('SoilCard: Location from farmDetails:', { state, district });
      }

      // Try to get location from user's farm object
      if (!state && user?.farm) {
        state = user.farm.state || user.farm.region;
        district = user.farm.district || user.farm.location || user.farm.city;
        console.debug('SoilCard: Location from farm object:', { state, district });
      }

      // Try to get location from user's direct properties
      if (!state && user?.state) {
        state = user.state;
        district = user.district || user.city || user.location;
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
      const finalState = state || 'Gujarat';
      const finalDistrict = district || 'Baroda';
      
      console.debug('SoilCard: Final location for API call:', { 
        originalState: state, 
        originalDistrict: district,
        finalState, 
        finalDistrict 
      });

      console.debug('SoilCard: Calling soil API with:', { state: finalState, district: finalDistrict });
      setLoading(true);
      try {
        const response = await axios.post('http://localhost:5001/api/soil-data', {
          state: finalState,
          district: finalDistrict
        });
        
        console.debug('SoilCard: API response:', response.data);
        
        if (response.data) {
          console.debug('SoilCard: Raw API response:', response.data);
          
          // Handle different response formats
          let soilData = response.data;
          if (response.data.data) soilData = response.data.data;
          if (soilData.soil) soilData = soilData.soil;
          if (soilData.soilData) soilData = soilData.soilData;

          const normalized = normalizeSoilData(soilData) || normalizeSoilData(response.data) || null;
          setSoil(normalized);
          console.log('Soil data received and normalized:', normalized, 'raw:', soilData);
          setError(null);
        } else {
          console.error('SoilCard: No data received');
          setError('No soil data received');
        }
      } catch (err) {
        console.error('SoilCard: API call failed:', err);
        setError(`Failed to load soil data: ${err.response?.data?.message || err.message}`);
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
        const response = await axios.post('http://localhost:5001/api/soil-data', {
          state,
          district
        });
        console.log('🧪 Test result:', response.data);
        return response.data;
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
    
    // If it's a number, format it appropriately
    if (!isNaN(value)) {
      const num = parseFloat(value);
      return `${num.toFixed(1)}${unit}`;
    }
    
    return `${value}${unit}`;
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
