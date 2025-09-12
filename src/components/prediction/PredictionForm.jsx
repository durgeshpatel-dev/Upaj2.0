import React, { useState, useEffect } from 'react';
import { Loader2, MapPin, Thermometer, CloudRain, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Tr } from '../ui/SimpleTranslation';
import { useUnifiedTranslation } from '../../hooks/useUnifiedTranslation';

const PredictionForm = ({ onSubmit, isLoading = false, error = null }) => {
  const { user } = useAuth();
  const { t } = useUnifiedTranslation();
  const [formData, setFormData] = useState({
    cropType: '',
    soilType: '',
    date: '',
    location: {
      state: '',
      district: ''
    },
    weather: {
      temperature: '',
      rainfall: ''
    },
    landInHectares: '',
    fetchedFromAPIs: false,
    autoFetchData: false
  });

  // Pre-populate form with user's farm data
  useEffect(() => {
    if (user) {
      // Parse location from user data - could be in different formats
      let userState = '';
      let userDistrict = '';
      
      // Check if user has separate state and district fields
      if (user.state && user.district) {
        userState = user.state;
        userDistrict = user.district;
      } else if (user.farmDetails?.state && user.farmDetails?.district) {
        userState = user.farmDetails.state;
        userDistrict = user.farmDetails.district;
      } else {
        // Parse from location string (format: "District, State" or "City, District, State")
        const locationString = user.farmDetails?.location || user.location || '';
        if (locationString) {
          const locationParts = locationString.split(',').map(part => part.trim());
            if (locationParts.length >= 2) {
              // Fix: last part is state, second-to-last is district
              userState = locationParts[locationParts.length - 1];
              userDistrict = locationParts[locationParts.length - 2];
            }
        }
      }

      setFormData(prev => ({
        ...prev,
        location: {
          state: userState || prev.location.state,
          district: userDistrict || prev.location.district
        },
        landInHectares: user.farmDetails?.totalArea || user.totalArea || prev.landInHectares
      }));

      console.log('📍 User location data parsed:', {
        original: user.farmDetails?.location || user.location,
        parsed: { state: userState, district: userDistrict }
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "autoFetchData") {
      setFormData(prev => ({
        ...prev,
        autoFetchData: checked,
        fetchedFromAPIs: checked,
        ...(checked && {
          soilType: '',
          weather: {
            temperature: '',
            rainfall: ''
          }
        })
      }));
    } else if (name.includes('.')) {
      // Handle nested object updates (location.state, location.district, weather.temperature, etc.)
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('📝 Form submitted with data:', formData);
    
    // Basic validation
    if (!formData.cropType) {
      alert(t('Please select a crop type'));
      return;
    }
    
    if (!formData.location.state || !formData.location.district) {
      alert(t('Please enter both state and district'));
      return;
    }
    
    if (!formData.date) {
      alert(t('Please select a date'));
      return;
    }
    
    if (!formData.landInHectares || parseFloat(formData.landInHectares) <= 0) {
      alert(t('Please enter a valid land area in hectares'));
      return;
    }

    // Prepare submission data for backend API (matching backend format)
    const submissionData = {
      cropType: formData.cropType,
      farmSize: parseFloat(formData.landInHectares),
      soilType: formData.autoFetchData ? null : formData.soilType || null,
      rainfall: formData.autoFetchData ? null : (formData.weather.rainfall ? parseFloat(formData.weather.rainfall) : null),
      temperature: formData.autoFetchData ? null : (formData.weather.temperature ? parseFloat(formData.weather.temperature) : null),
      humidity: 65, // Default humidity
      season: 'kharif', // Default season
      location: formData.location,
      fetchedFromAPIs: formData.autoFetchData, // Boolean flag for auto-fetch
      fetchFromApis: formData.autoFetchData, // Alternative field name in case backend expects this
      autoFetchData: formData.autoFetchData, // Include original field name too
      date: formData.date,
    };
    
    console.log('🚀 FINAL SUBMISSION DATA:');
    console.log('📋 Raw Form Data:', formData);
    console.log('📤 Processed Submission Data:', submissionData);
    console.log('🔄 Auto Fetch Status:', {
      autoFetchData: formData.autoFetchData,
      fetchedFromAPIs: submissionData.fetchedFromAPIs,
      fetchFromApis: submissionData.fetchFromApis
    });
    
    console.log('✅ Form validation passed, calling onSubmit prop.');
    onSubmit(submissionData);
  };

  return (
    <div className="bg-background-card p-6 rounded-lg border border-border">
      <h2 className="text-2xl font-bold text-text-primary mb-6"><Tr>Crop Yield Prediction</Tr></h2>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
        <p className="text-blue-700 text-sm">
          ℹ️ <Tr>Weather and soil data can be automatically fetched by the system based on your location, or you can provide your own data for more accurate predictions.</Tr>
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
          <div className="flex items-center">
            <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6"> 
        {/* Crop Type */}
        <div>
          <label className="block text-text-secondary text-sm font-medium mb-2">
            <Tr>Crop Type</Tr> *
          </label>
          <select
            name="cropType"
            value={formData.cropType}
            onChange={handleInputChange}
            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value=""><Tr>Select Crop</Tr></option>
            <option value="rice"><Tr>Rice</Tr></option>
            <option value="wheat"><Tr>Wheat</Tr></option>
            <option value="corn"><Tr>Corn</Tr></option>
            <option value="soybean"><Tr>Soybean</Tr></option>
            <option value="cotton"><Tr>Cotton</Tr></option>
            <option value="sugarcane"><Tr>Sugarcane</Tr></option>
            <option value="potato"><Tr>Potato</Tr></option>
            <option value="tomato"><Tr>Tomato</Tr></option>
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block text-text-secondary text-sm font-medium mb-2">
            <Tr>Date</Tr> *
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-text-secondary text-sm font-medium mb-2">
              <MapPin className="inline w-4 h-4 mr-1" />
              <Tr>State</Tr> *
            </label>
            <input
              type="text"
              name="location.state"
              value={formData.location.state}
              onChange={handleInputChange}
              placeholder="e.g., Maharashtra"
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-text-secondary text-sm font-medium mb-2">
              <Tr>District</Tr> *
            </label>
            <input
              type="text"
              name="location.district"
              value={formData.location.district}
              onChange={handleInputChange}
              placeholder="e.g., Pune"
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Land Area */}
        <div>
          <label className="block text-text-secondary text-sm font-medium mb-2">
            <Tr>Land Area (Hectares)</Tr> *
          </label>
          <input
            type="number"
            name="landInHectares"
            value={formData.landInHectares}
            onChange={handleInputChange}
            placeholder={t("Enter area in hectares")}
            min="0.1"
            step="0.1"
            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div className="flex items-center mb-6">
          <label className="inline-flex items-center">
            <input type="checkbox" name="autoFetchData" checked={formData.autoFetchData} onChange={(e) => setFormData(prev => ({ ...prev, autoFetchData: e.target.checked, fetchedFromAPIs: e.target.checked, ...(e.target.checked && { soilType: '', weather: { temperature: '', rainfall: '' } }) }))} className="form-checkbox" />
            <span className="ml-2"><Tr>Auto-fetch Weather and Soil Data</Tr></span>
          </label>
        </div>

        {/* Soil Type */}
        <div>
          <label className="block text-text-secondary text-sm font-medium mb-2">
            <Tr>Soil Type (Optional - can be auto-detected)</Tr>
          </label>
          <select
            name="soilType"
            value={formData.soilType}
            onChange={handleInputChange}
            disabled={formData.autoFetchData}
            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value=""><Tr>Select Soil Type</Tr></option>
            <option value="clay"><Tr>Clay</Tr></option>
            <option value="loam"><Tr>Loam</Tr></option>
            <option value="sandy"><Tr>Sandy</Tr></option>
            <option value="silt"><Tr>Silt</Tr></option>
            <option value="black"><Tr>Black</Tr></option>
            <option value="red"><Tr>Red</Tr></option>
            <option value="alluvial"><Tr>Alluvial</Tr></option>
          </select>
        </div>

        {/* Weather Data */}
        <div>
          <h3 className="text-text-primary font-medium mb-4"><Tr>Weather Information</Tr></h3>
          <div className="space-y-4 xl:space-y-0 xl:grid xl:grid-cols-2 xl:gap-6">
            {/* Temperature */}
            <div className="w-full">
              <label className="block text-text-secondary text-sm font-medium mb-2 leading-relaxed break-words">
                <Thermometer className="inline w-4 h-4 mr-1 flex-shrink-0" />
                <span className="break-words"><Tr>Temperature (°C) (Optional - can be auto-fetched)</Tr></span>
              </label>
              <input
                type="number"
                name="weather.temperature"
                value={formData.weather.temperature}
                onChange={handleInputChange}
                placeholder="e.g., 25"
                min="-10"
                max="50"
                disabled={formData.autoFetchData}
                title="Optional - can be auto-fetched if enabled"
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {!formData.autoFetchData && (
                <p className="text-xs text-text-secondary mt-1 opacity-75">
                  <Tr>Optional - leave empty for auto-fetch</Tr>
                </p>
              )}
            </div>

            {/* Rainfall */}
            <div className="w-full">
              <label className="block text-text-secondary text-sm font-medium mb-2 leading-relaxed break-words">
                <CloudRain className="inline w-4 h-4 mr-1 flex-shrink-0" />
                <span className="break-words"><Tr>Rainfall (mm) (Optional - can be auto-fetched)</Tr></span>
              </label>
              <input
                type="number"
                name="weather.rainfall"
                value={formData.weather.rainfall}
                onChange={handleInputChange}
                placeholder="e.g., 750"
                min="0"
                disabled={formData.autoFetchData}
                title="Optional - can be auto-fetched if enabled"
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {!formData.autoFetchData && (
                <p className="text-xs text-text-secondary mt-1 opacity-75">
                  <Tr>Optional - leave empty for auto-fetch</Tr>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-card flex items-center justify-center space-x-2 ${
            isLoading 
              ? 'bg-border text-text-secondary cursor-not-allowed' 
              : 'bg-primary hover:bg-primary/80 text-primary-foreground'
          }`}
        >
          {isLoading && <Loader2 size={20} className="animate-spin" />}
          <span>{isLoading ? <Tr>Analyzing...</Tr> : <Tr>Predict Yield</Tr>}</span>
        </button>

        {/* Test API Button */}
        {/* <button
          type="button"
          onClick={testPredictionAPI}
          className="w-full font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-background-card flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white mt-4"
        >
          <span>🔧 Test Prediction API (Auto-fetch & Manual)</span>
        </button> */}
      </form>
    </div>
  );
};

export default PredictionForm;
