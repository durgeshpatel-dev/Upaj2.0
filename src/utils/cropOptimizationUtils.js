import cropOptimizationData from '../data/cropOptimizationData.json';

/**
 * Get optimization recommendations for a specific crop
 * @param {string} cropType - The type of crop (e.g., 'wheat', 'rice', 'maize')
 * @param {string} soilType - The type of soil (e.g., 'Loamy', 'Clay', 'Sandy')
 * @param {string} season - Current season ('summer', 'winter', 'monsoon', 'postMonsoon')
 * @returns {object} Optimization recommendations for the crop
 */
export const getCropOptimization = (cropType, soilType = null, season = null) => {
  if (!cropType) {
    return {
      recommendedFertilizer: 'N/A',
      bestPlantingTime: 'N/A',
      irrigationSchedule: 'N/A',
      expectedHarvestTime: 'N/A'
    };
  }

  // Normalize crop type to lowercase
  const normalizedCropType = cropType.toLowerCase().trim();
  
  // Get base crop data
  const cropData = cropOptimizationData.cropOptimization[normalizedCropType];
  
  if (!cropData) {
    console.warn(`No optimization data found for crop: ${cropType}`);
    return {
      recommendedFertilizer: 'N/A',
      bestPlantingTime: 'N/A',
      irrigationSchedule: 'N/A',
      expectedHarvestTime: 'N/A'
    };
  }

  // Create base optimization object
  let optimization = {
    recommendedFertilizer: cropData.recommendedFertilizer,
    bestPlantingTime: cropData.bestPlantingTime,
    irrigationSchedule: cropData.irrigationSchedule,
    expectedHarvestTime: cropData.expectedHarvestTime,
    avgGrowthPeriod: cropData.avgGrowthPeriod,
    optimalTemperature: cropData.optimalTemperature,
    waterRequirement: cropData.waterRequirement,
    fertilizationStages: cropData.fertilizationStages,
    irrigationStages: cropData.irrigationStages
  };

  // Apply soil-specific adjustments
  if (soilType && cropOptimizationData.soilSpecificRecommendations[soilType]) {
    const soilRec = cropOptimizationData.soilSpecificRecommendations[soilType];
    optimization.soilRecommendations = soilRec.recommendations;
    optimization.fertilizerAdjustment = soilRec.fertilizerAdjustment;
  }

  // Apply seasonal adjustments
  if (season && cropOptimizationData.climateAdjustments[season]) {
    const seasonalAdj = cropOptimizationData.climateAdjustments[season];
    optimization.seasonalRecommendations = seasonalAdj.recommendations;
    
    // Adjust irrigation schedule based on season
    if (seasonalAdj.irrigationMultiplier !== 1.0) {
      optimization.seasonalIrrigationNote = `Adjust irrigation frequency by ${Math.round((seasonalAdj.irrigationMultiplier - 1) * 100)}%`;
    }
  }

  return optimization;
};

/**
 * Get suitable crops for a specific soil type
 * @param {string} soilType - The type of soil
 * @returns {array} List of suitable crops for the soil type
 */
export const getSuitableCropsForSoil = (soilType) => {
  if (!soilType) return [];

  const suitableCrops = [];
  
  Object.entries(cropOptimizationData.cropOptimization).forEach(([crop, data]) => {
    if (data.soilType.includes(soilType)) {
      suitableCrops.push({
        name: crop,
        suitability: 'High',
        ...data
      });
    }
  });

  return suitableCrops;
};

/**
 * Get current season based on month
 * @param {number} month - Month number (1-12)
 * @returns {string} Season name
 */
export const getCurrentSeason = (month = new Date().getMonth() + 1) => {
  if (month >= 3 && month <= 5) return 'summer';
  if (month >= 6 && month <= 9) return 'monsoon';
  if (month >= 10 && month <= 11) return 'postMonsoon';
  return 'winter'; // December, January, February
};

/**
 * Get fertilizer recommendations for a specific growth stage
 * @param {string} cropType - The type of crop
 * @param {number} daysAfterPlanting - Days since planting
 * @returns {object} Fertilizer recommendation for current stage
 */
export const getFertilizerForStage = (cropType, daysAfterPlanting) => {
  const cropData = cropOptimizationData.cropOptimization[cropType.toLowerCase()];
  
  if (!cropData || !cropData.fertilizationStages) {
    return null;
  }

  // Find appropriate fertilization stage based on days after planting
  // This is a simplified logic - in practice, you'd want more sophisticated stage detection
  if (daysAfterPlanting <= 0) {
    return cropData.fertilizationStages.find(stage => stage.stage.includes('sowing') || stage.stage.includes('Planting'));
  } else if (daysAfterPlanting <= 30) {
    return cropData.fertilizationStages.find(stage => stage.stage.includes('30') || stage.stage.includes('Tillering'));
  } else if (daysAfterPlanting <= 60) {
    return cropData.fertilizationStages.find(stage => stage.stage.includes('60') || stage.stage.includes('45'));
  } else {
    return cropData.fertilizationStages[cropData.fertilizationStages.length - 1];
  }
};

/**
 * Get irrigation recommendations for current stage
 * @param {string} cropType - The type of crop
 * @param {number} daysAfterPlanting - Days since planting
 * @returns {string} Irrigation recommendation for current stage
 */
export const getIrrigationForStage = (cropType, daysAfterPlanting) => {
  const cropData = cropOptimizationData.cropOptimization[cropType.toLowerCase()];
  
  if (!cropData || !cropData.irrigationStages) {
    return cropData?.irrigationSchedule || 'N/A';
  }

  // Simple stage-based irrigation recommendation
  const totalGrowthPeriod = parseInt(cropData.avgGrowthPeriod.split('-')[1]) || 120;
  const stageIndex = Math.floor((daysAfterPlanting / totalGrowthPeriod) * cropData.irrigationStages.length);
  
  return cropData.irrigationStages[Math.min(stageIndex, cropData.irrigationStages.length - 1)] || cropData.irrigationSchedule;
};

export default {
  getCropOptimization,
  getSuitableCropsForSoil,
  getCurrentSeason,
  getFertilizerForStage,
  getIrrigationForStage
};
