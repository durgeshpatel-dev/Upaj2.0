# Crop Optimization Data System

This document explains how to use the crop optimization data system that provides comprehensive agricultural recommendations based on crop type, soil type, and seasonal conditions.

## Files Added

1. **`src/data/cropOptimizationData.json`** - Contains optimization data for 12 major crops
2. **`src/utils/cropOptimizationUtils.js`** - Utility functions to retrieve and process optimization data
3. **`src/utils/cropOptimizationDemo.js`** - Demo script for testing the system
4. **`src/pages/CropOptimizationTest.jsx`** - Test component to view optimization data

## Features

### Crop Data Available
- **12 Major Crops**: wheat, rice, maize, sugarcane, cotton, potato, onion, tomato, cabbage, soybean, mustard
- **Complete Growth Information**: fertilization schedules, irrigation stages, planting times, harvest periods
- **Environmental Requirements**: optimal temperature, water requirements, suitable soil types

### Soil Type Adjustments
- **6 Soil Types**: Loamy, Clay, Sandy, Black Cotton, Alluvial, Red
- **Soil-specific Recommendations**: drainage, fertility, fertilizer adjustments
- **Automatic Fertilizer Corrections**: based on soil type characteristics

### Seasonal Adjustments
- **4 Seasons**: summer, winter, monsoon, postMonsoon
- **Automatic Season Detection**: based on current month
- **Irrigation Adjustments**: seasonal multipliers for water requirements

## Usage in ViewPrediction Component

The `ViewPrediction` component now automatically displays optimization data:

```jsx
import { getCropOptimization, getCurrentSeason } from '../utils/cropOptimizationUtils'

// Get optimization data
const currentSeason = getCurrentSeason();
const optimizationInfo = getCropOptimization(
  predictionData.cropType, 
  predictionData.soilType, 
  currentSeason
);
```

### New Sections Added
1. **Enhanced Optimization Recommendations** - Shows fertilizer, planting time, irrigation, harvest time
2. **Detailed Fertilization Schedule** - Stage-wise fertilizer application with quantities
3. **Detailed Irrigation Schedule** - Growth stage-specific irrigation guidelines
4. **Seasonal Recommendations** - Current season-specific advice

## API Functions

### `getCropOptimization(cropType, soilType, season)`
Returns comprehensive optimization data for a crop.

**Parameters:**
- `cropType` (string): e.g., 'wheat', 'rice', 'maize'
- `soilType` (string): e.g., 'Loamy', 'Clay', 'Sandy'
- `season` (string): 'summer', 'winter', 'monsoon', 'postMonsoon'

**Returns:**
```javascript
{
  recommendedFertilizer: "NPK 12-32-16",
  bestPlantingTime: "October - November",
  irrigationSchedule: "Every 7-10 days",
  expectedHarvestTime: "March - April",
  avgGrowthPeriod: "120-150 days",
  optimalTemperature: "15-25°C",
  waterRequirement: "450-650 mm",
  fertilizationStages: [...],
  irrigationStages: [...],
  soilRecommendations: [...],
  seasonalRecommendations: [...]
}
```

### `getSuitableCropsForSoil(soilType)`
Returns crops suitable for a specific soil type.

### `getCurrentSeason(month)`
Returns current season based on month (1-12).

### `getFertilizerForStage(cropType, daysAfterPlanting)`
Returns fertilizer recommendation for specific growth stage.

### `getIrrigationForStage(cropType, daysAfterPlanting)`
Returns irrigation recommendation for specific growth stage.

## Testing

### Browser Console Testing
```javascript
// Load the demo functions
// Open browser console and run:
window.cropOptimizationDemo.testCropOptimization();
```

### Test Component
Navigate to `/crop-optimization-test` to view the interactive test component.

## Data Structure Examples

### Fertilization Stages
```json
{
  "stage": "Pre-sowing",
  "fertilizer": "DAP",
  "quantity": "125-150 kg/ha"
}
```

### Irrigation Stages
```json
[
  "Crown root initiation (20-25 days)",
  "Tillering (40-45 days)",
  "Jointing (60-65 days)"
]
```

### Soil Recommendations
```json
{
  "advantages": ["Good drainage", "High fertility"],
  "recommendations": ["Regular organic matter addition"],
  "fertilizerAdjustment": "Standard NPK ratios work well"
}
```

## Integration with Backend

The optimization data is now integrated into the frontend prediction display. When a prediction is loaded:

1. **Automatic Data Retrieval**: Based on crop type and soil type from prediction
2. **Season Detection**: Automatically detects current season
3. **Enhanced Display**: Shows detailed fertilization and irrigation schedules
4. **Soil-specific Adjustments**: Applies corrections based on soil type

## Benefits

1. **No API Dependency**: All data is local JSON, no external API calls needed
2. **Comprehensive Coverage**: 12 major crops with complete growth cycle data
3. **Intelligent Recommendations**: Adjusts based on soil type and season
4. **Easy Maintenance**: JSON format allows easy updates and additions
5. **Performance**: Fast access to optimization data without network delays

## Future Enhancements

1. **More Crops**: Add data for additional crops and varieties
2. **Regional Variations**: State/district-specific recommendations
3. **Weather Integration**: Real-time weather-based adjustments
4. **Machine Learning**: Predictive optimization based on historical data
5. **Mobile Alerts**: Push notifications for fertilization and irrigation timing

## Data Sources

The optimization data is compiled from:
- Agricultural extension guidelines
- Research institution recommendations
- Best farming practices
- Regional agricultural patterns
- Expert farmer knowledge

This system ensures farmers get accurate, timely, and locally relevant agricultural guidance for optimal crop production.
