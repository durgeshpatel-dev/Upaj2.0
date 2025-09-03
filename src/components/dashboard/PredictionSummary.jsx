import React, { useEffect, useState } from 'react';

const PredictionSummary = ({ predictions = [], loading = false }) => {
  const [summary, setSummary] = useState({ label: 'Recent Prediction', value: '—', trend: null });

  useEffect(() => {
    // const prediction = get
    console.log('🌾 PredictionSummary: received predictions:', predictions);
    
    if (loading) {
      return;
    }
    
    if (!Array.isArray(predictions) || predictions.length === 0) {
      console.log('🌾 PredictionSummary: no predictions available');
      setSummary({ label: 'Recent Prediction', value: 'No predictions yet', trend: null });
      return;
    }

    console.log('🌾 PredictionSummary: processing predictions:', predictions.length, 'items');
    
    const latest = predictions[0];
    const next = predictions[1];
    
    console.log('🌾 PredictionSummary: latest prediction data:', latest);
    console.log('🌾 PredictionSummary: next prediction data:', next);
    
    // Extract crop type (handle capitalization)
    const crop = latest.cropType || latest.crop || 'Crop';
    const cropDisplay = crop.charAt(0).toUpperCase() + crop.slice(1).toLowerCase();
    console.log('🌾 PredictionSummary: extracted crop:', { raw: crop, display: cropDisplay });
    
    // Extract predicted yield - handle both ML response and fallback
    let predicted = latest.predictedYield;
    console.log('🌾 PredictionSummary: predictedYield from main field:', predicted);
    
    if (!predicted && latest.externalData?.mlResponse?.yield_kg_ha) {
      predicted = latest.externalData.mlResponse.yield_kg_ha;
      console.log('🌾 PredictionSummary: using ML response yield:', predicted);
    }
    
    // Remove conversion logic
    let displayYield = 'N/A';
    if (predicted && !isNaN(Number(predicted))) {
      displayYield = Math.round(Number(predicted)); // Keep as kg/ha
    }
    const unit = 'kg/ha'; // Always use kg/ha
    const value = `${cropDisplay}: ${displayYield} ${unit}`;
    console.log('🌾 PredictionSummary: final display value:', value);
    
    // Calculate trend vs previous prediction
    let trend = null;
    if (next) {
      let nextPred = next.predictedYield;
      if (!nextPred && next.externalData?.mlResponse?.yield_kg_ha) {
        nextPred = next.externalData.mlResponse.yield_kg_ha;
      }
      console.log('🌾 PredictionSummary: trend calculation:', { current: predicted, previous: nextPred });
      if (nextPred && predicted && !isNaN(Number(predicted)) && !isNaN(Number(nextPred))) {
        const change = ((Number(predicted) - Number(nextPred)) / Math.max(1, Number(nextPred))) * 100;
        trend = `${change >= 0 ? '+' : ''}${Math.round(change)}%`;
        console.log('🌾 PredictionSummary: calculated trend:', trend);
      }
    }
    
    const finalSummary = { label: 'Recent Prediction', value, trend };
    console.log('🌾 PredictionSummary: setting final summary:', finalSummary);
    setSummary(finalSummary);
  }, [predictions, loading]);

  return (
    <div className="rounded-lg border border-border bg-background-card p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs text-text-secondary">{summary.label}</p>
          <p className="mt-2 text-lg font-medium text-text-primary">{loading ? 'Loading...' : summary.value}</p>
          {summary.trend && (
            <div className="mt-1 flex items-center gap-1">
              {/* <span className="text-primary text-sm font-medium">{summary.trend}</span>
              <span className="text-text-secondary text-xs">vs previous</span> */}
            </div>
          )}
        </div>
        <div className="h-12 w-12 rounded-lg bg-background ring-1 ring-border flex items-center justify-center text-primary text-xl">
          🌾
        </div>
      </div>
    </div>
  );
};

export default PredictionSummary;
