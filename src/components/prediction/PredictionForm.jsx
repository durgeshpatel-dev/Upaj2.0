import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

const PredictionForm = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    cropType: '',
    location: '',
    soilType: '',
    plantingDate: '',
    landArea: '',
    autoFetch: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-background-card p-6 rounded-lg border border-border">
      <h2 className="text-2xl font-bold text-text-primary mb-6">Crop Yield Prediction</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Crop Type */}
        <div>
          <label className="block text-text-secondary text-sm font-medium mb-2">
            Crop Type
          </label>
          <select
            name="cropType"
            value={formData.cropType}
            onChange={handleInputChange}
            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Select Crop</option>
            <option value="corn">Corn</option>
            <option value="wheat">Wheat</option>
            <option value="soybean">Soybean</option>
            <option value="rice">Rice</option>
            <option value="cotton">Cotton</option>
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block text-text-secondary text-sm font-medium mb-2">
            Location
          </label>
          <select
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Select Location</option>
            <option value="iowa">Iowa</option>
            <option value="illinois">Illinois</option>
            <option value="nebraska">Nebraska</option>
            <option value="kansas">Kansas</option>
            <option value="minnesota">Minnesota</option>
          </select>
        </div>

        {/* Soil Type */}
        <div>
          <label className="block text-text-secondary text-sm font-medium mb-2">
            Soil Type
          </label>
          <select
            name="soilType"
            value={formData.soilType}
            onChange={handleInputChange}
            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Select Soil Type</option>
            <option value="clay">Clay</option>
            <option value="loam">Loam</option>
            <option value="sandy">Sandy</option>
            <option value="silt">Silt</option>
            <option value="peat">Peat</option>
          </select>
        </div>

        {/* Planting Date */}
        <div>
          <label className="block text-text-secondary text-sm font-medium mb-2">
            Planting Date
          </label>
          <input
            type="date"
            name="plantingDate"
            value={formData.plantingDate}
            onChange={handleInputChange}
            placeholder="mm/dd/yyyy"
            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Land Area */}
        <div>
          <label className="block text-text-secondary text-sm font-medium mb-2">
            Land Area (Hectares)
          </label>
          <input
            type="number"
            name="landArea"
            value={formData.landArea}
            onChange={handleInputChange}
            placeholder="Enter area in hectares"
            min="0.1"
            step="0.1"
            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Auto-fetch Toggle */}
        <div className="flex items-center justify-between">
          <label className="text-text-secondary text-sm font-medium">
            Auto-fetch Soil/Weather Data
          </label>
          <div className="relative">
            <input
              type="checkbox"
              name="autoFetch"
              checked={formData.autoFetch}
              onChange={handleInputChange}
              className="sr-only"
            />
            <div
              onClick={() => setFormData(prev => ({ ...prev, autoFetch: !prev.autoFetch }))}
              className={`w-11 h-6 rounded-full cursor-pointer transition-colors ${
                formData.autoFetch ? 'bg-primary' : 'bg-border'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                  formData.autoFetch ? 'translate-x-5' : 'translate-x-0.5'
                } mt-0.5`}
              />
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
          <span>{isLoading ? 'Analyzing...' : 'Predict Yield'}</span>
        </button>
      </form>
    </div>
  );
};

export default PredictionForm;
