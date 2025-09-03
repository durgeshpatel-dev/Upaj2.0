/**
 * Demo script showing how to use the crop optimization utilities
 * Run this in the browser console to test the functions
 */

// Import the utilities (this would be done at the top of your component)
// import { getCropOptimization, getSuitableCropsForSoil, getCurrentSeason } from '../utils/cropOptimizationUtils';

// Demo function to test crop optimization
function testCropOptimization() {
  console.log('🌾 Testing Crop Optimization Utilities');
  console.log('=====================================');

  // Test different crops
  const testCrops = ['wheat', 'rice', 'maize', 'cotton', 'potato'];
  const testSoils = ['Loamy', 'Clay', 'Sandy'];

  testCrops.forEach(crop => {
    console.log(`\n📊 Testing ${crop.toUpperCase()}:`);
    
    testSoils.forEach(soil => {
      const optimization = getCropOptimization(crop, soil, 'summer');
      console.log(`  ${soil} soil:`, {
        fertilizer: optimization.recommendedFertilizer,
        planting: optimization.bestPlantingTime,
        irrigation: optimization.irrigationSchedule,
        harvest: optimization.expectedHarvestTime
      });
    });
  });

  // Test suitable crops for soil
  console.log('\n🏞️ SUITABLE CROPS BY SOIL TYPE:');
  testSoils.forEach(soil => {
    const suitableCrops = getSuitableCropsForSoil(soil);
    console.log(`${soil} soil:`, suitableCrops.map(c => c.name).join(', '));
  });

  // Test current season
  console.log('\n🌤️ CURRENT SEASON:', getCurrentSeason());

  // Test fertilizer timing
  console.log('\n💡 FERTILIZER TIMING FOR WHEAT:');
  [0, 30, 60, 90].forEach(days => {
    const fertStage = getFertilizerForStage('wheat', days);
    console.log(`Day ${days}:`, fertStage);
  });
}

// Usage examples for different crops
const usageExamples = {
  wheat: {
    description: "Example for wheat farming in Punjab",
    code: `
const wheatOptimization = getCropOptimization('wheat', 'Loamy', 'winter');
console.log('Wheat recommendations:', {
  fertilizer: wheatOptimization.recommendedFertilizer,
  planting: wheatOptimization.bestPlantingTime,
  irrigation: wheatOptimization.irrigationSchedule,
  harvest: wheatOptimization.expectedHarvestTime,
  growthPeriod: wheatOptimization.avgGrowthPeriod
});`
  },
  rice: {
    description: "Example for rice farming with clay soil",
    code: `
const riceOptimization = getCropOptimization('rice', 'Clay', 'monsoon');
console.log('Rice irrigation stages:', riceOptimization.irrigationStages);
console.log('Rice fertilization:', riceOptimization.fertilizationStages);`
  },
  cotton: {
    description: "Example for cotton in black cotton soil",
    code: `
const cottonOptimization = getCropOptimization('cotton', 'Black Cotton', 'summer');
console.log('Cotton optimization:', cottonOptimization);
console.log('Soil recommendations:', cottonOptimization.soilRecommendations);`
  }
};

// Function to get optimization data for prediction component
function getOptimizationForPrediction(prediction) {
  if (!prediction?.cropType) {
    return null;
  }

  const currentSeason = getCurrentSeason();
  const soilType = prediction.soilType || prediction.soilData?.type;
  
  return getCropOptimization(prediction.cropType, soilType, currentSeason);
}

// Test with sample prediction data
const samplePrediction = {
  cropType: 'wheat',
  soilType: 'Loamy',
  location: { state: 'Punjab', district: 'Amritsar' }
};

console.log('Sample optimization for prediction:', getOptimizationForPrediction(samplePrediction));

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testCropOptimization,
    usageExamples,
    getOptimizationForPrediction
  };
}

// Make available globally for browser testing
if (typeof window !== 'undefined') {
  window.cropOptimizationDemo = {
    testCropOptimization,
    usageExamples,
    getOptimizationForPrediction
  };
  
  console.log('🚀 Crop Optimization Demo loaded!');
  console.log('Available functions:');
  console.log('- window.cropOptimizationDemo.testCropOptimization()');
  console.log('- window.cropOptimizationDemo.getOptimizationForPrediction(prediction)');
}
