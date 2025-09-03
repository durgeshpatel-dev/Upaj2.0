// Manual API Test Script
// Copy and paste this into your browser console to test the weather and soil APIs

// Test Weather API
async function testWeatherAPI() {
  console.log('🧪 Testing Weather API...');
  try {
    const result = await window.testWeatherAPI('Gujarat', 'Baroda');
    console.log('Weather API Test Result:', result);
    return result;
  } catch (error) {
    console.error('Weather API Test Failed:', error);
  }
}

// Test Soil API
async function testSoilAPI() {
  console.log('🧪 Testing Soil API...');
  try {
    const result = await window.testSoilAPI('Gujarat', 'Baroda');
    console.log('Soil API Test Result:', result);
    return result;
  } catch (error) {
    console.error('Soil API Test Failed:', error);
  }
}

// Test both APIs
async function testBothAPIs() {
  console.log('🧪 Testing both Weather and Soil APIs...');
  const weatherResult = await testWeatherAPI();
  const soilResult = await testSoilAPI();

  console.log('=== API Test Summary ===');
  console.log('Weather API Success:', weatherResult?.success);
  console.log('Soil API Success:', soilResult?.success);

  return { weather: weatherResult, soil: soilResult };
}

// Make functions available globally
window.testWeatherAPI = testWeatherAPI;
window.testSoilAPI = testSoilAPI;
window.testBothAPIs = testBothAPIs;

console.log('🧪 API Test functions loaded!');
console.log('Available functions:');
console.log('- testWeatherAPI()');
console.log('- testSoilAPI()');
console.log('- testBothAPIs()');
console.log('Or use the component buttons to test manually');
