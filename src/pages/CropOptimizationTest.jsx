import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { getCropOptimization, getSuitableCropsForSoil, getCurrentSeason } from '../utils/cropOptimizationUtils';
import { locationAPI } from '../utils/api';
import cropOptimizationData from '../data/cropOptimizationData.json';


const CropOptimizationTest = () => {
  const [selectedCrop, setSelectedCrop] = useState('wheat');
  const [selectedSoil, setSelectedSoil] = useState('Loamy');
  const [optimizationData, setOptimizationData] = useState(null);
  const [availableSoils, setAvailableSoils] = React.useState(Object.keys(cropOptimizationData.soilSpecificRecommendations || {}));



  // Fetch soil list from backend API (by state/district) with fallback to local JSON
  const [stateInput, setStateInput] = useState('');
  const [districtInput, setDistrictInput] = useState('');

  useEffect(() => {
    let mounted = true;
    const fetchSoils = async (stateParam, districtParam) => {
      try {
        const resp = await locationAPI.getSoilData(stateParam, districtParam);
        if (!mounted) return;
        if (resp?.success) {
          const data = resp.data || [];
          if (Array.isArray(data) && data.length > 0) {
            const names = data.map(item => (typeof item === 'string' ? item : item.name || 'Unknown'));
            setAvailableSoils(names);
            if (!names.includes(selectedSoil)) setSelectedSoil(names[0] || selectedSoil);
            return;
          }
          if (typeof data === 'object' && Object.keys(data).length > 0) {
            // If backend returns object keyed by soil type
            const names = Object.keys(data);
            setAvailableSoils(names);
            if (!names.includes(selectedSoil)) setSelectedSoil(names[0] || selectedSoil);
            return;
          }
        }
      } catch (e) {
        // ignore and fallback
      }

      // Fallback to local JSON
      const fallback = Object.keys(cropOptimizationData.soilSpecificRecommendations || {});
      setAvailableSoils(fallback);
      if (!fallback.includes(selectedSoil)) setSelectedSoil(fallback[0] || selectedSoil);
    };

    // initial fetch without location to let backend decide or fallback
    fetchSoils();
    return () => { mounted = false; };
  }, []);

  const handleFetchByLocation = async () => {
    try {
      const resp = await locationAPI.getSoilData(stateInput, districtInput);
      if (resp?.success) {
        const data = resp.data || [];
        if (Array.isArray(data) && data.length > 0) {
          const names = data.map(item => (typeof item === 'string' ? item : item.name || 'Unknown'));
          setAvailableSoils(names);
          if (!names.includes(selectedSoil)) setSelectedSoil(names[0] || selectedSoil);
          return;
        }
        if (typeof data === 'object' && Object.keys(data).length > 0) {
          const names = Object.keys(data);
          setAvailableSoils(names);
          if (!names.includes(selectedSoil)) setSelectedSoil(names[0] || selectedSoil);
          return;
        }
      }
    } catch (e) {
      // ignore
    }
    // fallback
    const fallback = Object.keys(cropOptimizationData.soilSpecificRecommendations || {});
    setAvailableSoils(fallback);
  };

  const availableCrops = Object.keys(cropOptimizationData.cropOptimization);

  return (
    <div className="min-h-screen bg-background text-text-primary p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Crop Optimization Data Test</h1>
        
        {/* Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select Crop and Soil Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Crop Type</label>
                <select 
                  value={selectedCrop} 
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full p-2 border border-border rounded bg-background-card text-text-primary"
                >
                  {availableCrops.map(crop => (
                    <option key={crop} value={crop}>{crop.charAt(0).toUpperCase() + crop.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Soil Type</label>
                <select 
                  value={selectedSoil} 
                  onChange={(e) => setSelectedSoil(e.target.value)}
                  className="w-full p-2 border border-border rounded bg-background-card text-text-primary"
                >
                  {availableSoils.map(soil => (
                    <option key={soil} value={soil}>{soil}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium mb-2">State (optional)</label>
                <input value={stateInput} onChange={(e) => setStateInput(e.target.value)} className="w-full p-2 border border-border rounded bg-background-card text-text-primary" placeholder="e.g. Karnataka" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">District (optional)</label>
                <input value={districtInput} onChange={(e) => setDistrictInput(e.target.value)} className="w-full p-2 border border-border rounded bg-background-card text-text-primary" placeholder="e.g. Bengaluru Urban" />
              </div>
              <div>
                <button onClick={handleFetchByLocation} className="w-full py-2 px-3 bg-primary text-white rounded">Fetch Soil</button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Optimization Results */}
        {optimizationData && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Basic Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Recommended Fertilizer</span>
                    <span className="text-text-primary font-medium">{optimizationData.recommendedFertilizer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Best Planting Time</span>
                    <span className="text-text-primary font-medium">{optimizationData.bestPlantingTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Irrigation Schedule</span>
                    <span className="text-text-primary font-medium">{optimizationData.irrigationSchedule}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Expected Harvest</span>
                    <span className="text-text-primary font-medium">{optimizationData.expectedHarvestTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Growth Period</span>
                    <span className="text-text-primary font-medium">{optimizationData.avgGrowthPeriod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Optimal Temperature</span>
                    <span className="text-text-primary font-medium">{optimizationData.optimalTemperature}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Water Requirement</span>
                    <span className="text-text-primary font-medium">{optimizationData.waterRequirement}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fertilization Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Fertilization Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {optimizationData.fertilizationStages?.map((stage, index) => (
                    <div key={index} className="p-3 bg-background-card rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{stage.stage}</p>
                          <p className="text-sm text-text-secondary">{stage.fertilizer}</p>
                        </div>
                        <p className="font-medium">{stage.quantity}</p>
                      </div>
                    </div>
                  ))}
                  {optimizationData.fertilizerAdjustment && (
                    <div className="mt-3 p-2 bg-status-warning/10 rounded">
                      <p className="text-status-warning text-sm">
                        <strong>Soil Adjustment:</strong> {optimizationData.fertilizerAdjustment}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Irrigation Stages */}
            <Card>
              <CardHeader>
                <CardTitle>Irrigation Stages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {optimizationData.irrigationStages?.map((stage, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <p className="text-sm">{stage}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Soil & Seasonal Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                {optimizationData.soilRecommendations && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Soil Recommendations:</h4>
                    <ul className="space-y-1">
                      {optimizationData.soilRecommendations.map((rec, index) => (
                        <li key={index} className="text-sm">• {rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {optimizationData.seasonalRecommendations && (
                  <div>
                    <h4 className="font-medium mb-2">Seasonal Recommendations:</h4>
                    <ul className="space-y-1">
                      {optimizationData.seasonalRecommendations.map((rec, index) => (
                        <li key={index} className="text-sm">• {rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {optimizationData.seasonalIrrigationNote && (
                  <div className="mt-3 p-2 bg-blue-50 rounded">
                    <p className="text-blue-800 text-sm">
                      <strong>Seasonal Note:</strong> {optimizationData.seasonalIrrigationNote}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropOptimizationTest;
