import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import Button from '../components/Button'
import { ArrowLeft, Download, Calendar, MapPin, Wheat } from 'lucide-react'
import { predictionAPI } from '../utils/api'
import { getCropOptimization, getCurrentSeason } from '../utils/cropOptimizationUtils'

const ViewPrediction = () => {
  const { predictionId } = useParams()
  const navigate = useNavigate()
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [optimizationData, setOptimizationData] = useState(null)

  useEffect(() => {
    const fetchPredictionDetails = async () => {
      if (!predictionId) {
        setError('No prediction ID provided')
        setLoading(false)
        return
      }

      console.log('🔍 Loading prediction:', predictionId)
      
      try {
        const result = await predictionAPI.getPredictionById(predictionId)
        
        if (result.success) {
          // Handle different API response structures
          const predictionData = result.data?.prediction || result.data?.data || result.data
          console.log('📊 Parsed prediction data:', predictionData)
          
          // Debug: Log specific data fields to verify structure
          console.log('🔍 Data verification:');
          console.log('- soilData:', predictionData?.soilData);
          console.log('- weather:', predictionData?.weather);
          console.log('- location:', predictionData?.location);
          console.log('- predictedYield:', predictionData?.predictedYield);
          console.log('- confidence:', predictionData?.confidence);
          
          setPrediction(predictionData)
          
          // Get optimization data based on crop type and soil type
          if (predictionData?.cropType) {
            const currentSeason = getCurrentSeason();
            const optimizationInfo = getCropOptimization(
              predictionData.cropType, 
              predictionData.soilType, 
              currentSeason
            );
            setOptimizationData(optimizationInfo);
            console.log('🌱 Optimization data loaded:', optimizationInfo);
          }
          
          setError(null)
        } else {
          console.error('❌ Failed to load prediction:', result.error)
          setError(result.error)
        }
      } catch (err) {
        console.error('❌ Unexpected error loading prediction:', err)
        setError('Failed to load prediction details')
      } finally {
        setLoading(false)
      }
    }

    // For dummy IDs (like dummy-timestamp), show mock data
    if (predictionId?.startsWith('dummy-')) {
      console.log('🎭 Using mock data for dummy prediction ID')
      setTimeout(() => {
        setPrediction({
          _id: predictionId,
          userId: "68b599c77545aadbfaff22b6",
          cropType: 'wheat',
          soilType: 'Loamy',
          landArea: 12,
          plantingDate: "2020-06-02T00:00:00.000Z",
          predictedYield: 36503.04,
          yieldPerHectare: 3041.92,
          confidence: 0.65,
          fetchedFromAPIs: true,
          mlModelUsed: false,
          createdAt: "2025-09-02T11:17:47.533Z",
          updatedAt: "2025-09-02T11:17:47.533Z",
          soilData: {
            composition: {
              sand: 40,
              clay: 20,
              silt: 40
            },
            properties: {
              pH: 6.8,
              nitrogen: 18,
              organicCarbon: 22,
              cationExchangeCapacity: 18,
              fertility: "Medium"
            },
            analysis: {
              drainage: "Good",
              waterHolding: "Medium",
              nutrientRetention: "Good"
            },
            searchMetadata: {
              requestedLocation: "Amritsar, Punjab",
              actualSoilType: "Loamy",
              dataAccuracy: "high",
              timestamp: "2025-09-02T11:17:47.496Z"
            },
            type: "Loamy",
            detailedType: "Loamy",
            recommendations: [
              "Ideal soil for most crops",
              "Maintain current soil management practices",
              "Regular organic matter addition",
              "Balanced fertilization program"
            ],
            suitableCrops: [
              "Rice",
              "Wheat",
              "Maize",
              "Sugarcane",
              "Cotton"
            ],
            dataSource: "local_database"
          },
          location: {
            coordinates: {
              latitude: 31.6331,
              longitude: 74.8656
            },
            state: "Punjab",
            district: "Amritsar"
          },
          weather: {
            metadata: {
              requestedLocation: "Amritsar, Punjab",
              requestedDate: "2020-06-02T00:00:00.000Z",
              dataTimestamp: "2025-09-02T11:17:47.496Z",
              apiCallSuccess: true
            },
            temperature: 22.53,
            rainfall: 0,
            humidity: 94,
            dataSource: "api"
          },
          insights: [
            'Soil conditions are optimal for wheat cultivation with good drainage',
            'Weather patterns suggest above-average yield potential',
            'Current nitrogen levels support healthy crop growth',
            'Monitor irrigation based on rainfall patterns'
          ]
        })
        
        // Set optimization data for mock data too
        const currentSeason = getCurrentSeason();
        const optimizationInfo = getCropOptimization('wheat', 'Loamy', currentSeason);
        setOptimizationData(optimizationInfo);
        console.log('🌱 Mock optimization data loaded:', optimizationInfo);
        
        setLoading(false)
      }, 1000)
    } else {
      fetchPredictionDetails()
    }
  }, [predictionId])

  const handleDownloadReport = async () => {
    if (!prediction?._id) {
      alert('No prediction data available for download');
      return;
    }
    
    console.log('📥 Downloading PDF report for:', prediction._id)
    
    try {
      const result = await predictionAPI.downloadPredictionReport(prediction._id)
      
      if (result.success) {
        console.log('✅ Report downloaded successfully')
        // The download should have started automatically
      } else {
        console.error('❌ Download failed:', result.error)
        alert(`Download failed: ${result.error}`)
      }
    } catch (err) {
      console.error('❌ Unexpected download error:', err)
      alert('Failed to download report. Please try again.')
    }
  }

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return 'N/A'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-text-primary">
        <main className="mx-auto max-w-4xl px-6 py-8">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-text-secondary">Loading prediction details...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error || !prediction) {
    return (
      <div className="min-h-screen bg-background text-text-primary">
        <main className="mx-auto max-w-4xl px-6 py-8">
          <div className="text-center py-8">
            <p className="text-status-error">{error || 'Prediction not found'}</p>
            <Button onClick={() => navigate('/dashboard')} className="mt-4">
              Back to Dashboard
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <main className="mx-auto max-w-4xl px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </Button>
            <h1 className="text-2xl font-bold text-text-primary">Prediction Details</h1>
          </div>
          <Button 
            onClick={handleDownloadReport} 
            className="flex items-center space-x-2"
            disabled={!prediction || loading}
          >
            <Download size={16} />
            <span>Download Report</span>
          </Button>
        </div>

        {/* Prediction Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wheat className="text-primary" size={20} />
              <span>Prediction Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-primary/20 p-4 rounded-lg border border-primary/30">
                <p className="text-text-secondary text-sm">Crop Type</p>
                <p className="text-text-primary font-semibold text-lg capitalize">
                  {prediction?.cropType || 'N/A'}
                </p>
              </div>
              <div className="bg-status-success/20 p-4 rounded-lg border border-status-success/30">
                <p className="text-text-secondary text-sm">Predicted Yield</p>
                <p className="text-text-primary font-semibold text-lg">
                  {prediction?.yieldPerHectare ? `${Math.round(prediction.yieldPerHectare)} kg/ha` : 
                   prediction?.predictedYield ? `${Math.round(prediction.predictedYield)} kg total` : 'N/A'}
                </p>
                {prediction?.confidence && (
                  <p className="text-text-secondary text-xs mt-1">
                    Confidence: {Math.round(prediction.confidence * 100)}%
                  </p>
                )}
              </div>
              <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                <p className="text-text-secondary text-sm flex items-center">
                  <Calendar size={14} className="mr-1" />
                  Planting Date
                </p>
                <p className="text-text-primary font-semibold">
                  {formatDate(prediction?.plantingDate)}
                </p>
                {prediction?.landArea && (
                  <p className="text-text-secondary text-xs mt-1">
                    Area: {prediction.landArea} hectares
                  </p>
                )}
              </div>
              <div className="bg-status-warning/10 p-4 rounded-lg border border-status-warning/20">
                <p className="text-text-secondary text-sm flex items-center">
                  <MapPin size={14} className="mr-1" />
                  Location
                </p>
                <p className="text-text-primary font-semibold">
                  {prediction?.location?.district && prediction?.location?.state 
                    ? `${prediction.location.district}, ${prediction.location.state}` 
                    : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Information */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Basic Info & Soil */}
          <Card>
            <CardHeader>
              <CardTitle>Environmental Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-text-secondary mb-2">Soil Type</h4>
                  <p className="text-text-primary font-medium capitalize">
                    {prediction?.soilType || 'N/A'}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-text-secondary mb-2">Weather Conditions</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-2 bg-background-card rounded">
                      <p className="text-xs text-text-secondary">Temperature</p>
                      <p className="text-sm font-medium">{prediction?.weather?.temperature ? `${Math.round(prediction.weather.temperature)}°C` : 'N/A'}</p>
                    </div>
                    <div className="text-center p-2 bg-background-card rounded">
                      <p className="text-xs text-text-secondary">Humidity</p>
                      <p className="text-sm font-medium">{prediction?.weather?.humidity ? `${prediction.weather.humidity}%` : 'N/A'}</p>
                    </div>
                    <div className="text-center p-2 bg-background-card rounded">
                      <p className="text-xs text-text-secondary">Rainfall</p>
                      <p className="text-sm font-medium">{prediction?.weather?.rainfall !== undefined ? `${prediction.weather.rainfall}mm` : 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Soil Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Soil Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Soil Composition */}
                <div>
                  <h4 className="text-sm font-medium text-text-secondary mb-2">Soil Composition</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center p-2 bg-background-card rounded">
                      <p className="text-xs text-text-secondary">Sand</p>
                      <p className="text-sm font-medium">{prediction?.soilData?.composition?.sand ? `${prediction.soilData.composition.sand}%` : 'N/A'}</p>
                    </div>
                    <div className="text-center p-2 bg-background-card rounded">
                      <p className="text-xs text-text-secondary">Clay</p>
                      <p className="text-sm font-medium">{prediction?.soilData?.composition?.clay ? `${prediction.soilData.composition.clay}%` : 'N/A'}</p>
                    </div>
                    <div className="text-center p-2 bg-background-card rounded">
                      <p className="text-xs text-text-secondary">Silt</p>
                      <p className="text-sm font-medium">{prediction?.soilData?.composition?.silt ? `${prediction.soilData.composition.silt}%` : 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Soil Properties */}
                <div>
                  <h4 className="text-sm font-medium text-text-secondary mb-2">Soil Properties</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-text-secondary text-sm">pH Level</span>
                      <span className="text-text-primary font-medium">{prediction?.soilData?.properties?.pH || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-text-secondary text-sm">Nitrogen</span>
                      <span className="text-text-primary font-medium">{prediction?.soilData?.properties?.nitrogen ? `${prediction.soilData.properties.nitrogen}%` : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-text-secondary text-sm">Organic Carbon</span>
                      <span className="text-text-primary font-medium">{prediction?.soilData?.properties?.organicCarbon ? `${prediction.soilData.properties.organicCarbon}%` : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-text-secondary text-sm">Fertility</span>
                      <span className={`font-medium text-sm px-2 py-1 rounded ${
                        prediction?.soilData?.properties?.fertility === 'High' ? 'bg-status-success/20 text-status-success' :
                        prediction?.soilData?.properties?.fertility === 'Medium' ? 'bg-status-warning/20 text-status-warning' :
                        prediction?.soilData?.properties?.fertility === 'Low' ? 'bg-status-error/20 text-status-error' :
                        'bg-background-card text-text-secondary'
                      }`}>
                        {prediction?.soilData?.properties?.fertility || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Optimization Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Optimization Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Recommended Fertilizer</span>
                  <span className="text-text-primary font-medium">
                    {optimizationData?.recommendedFertilizer || prediction?.optimization?.recommendedFertilizer || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Best Planting Time</span>
                  <span className="text-text-primary font-medium">
                    {optimizationData?.bestPlantingTime || prediction?.optimization?.bestPlantingTime || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Irrigation Schedule</span>
                  <span className="text-text-primary font-medium">
                    {optimizationData?.irrigationSchedule || prediction?.optimization?.irrigationSchedule || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Expected Harvest</span>
                  <span className="text-text-primary font-medium">
                    {optimizationData?.expectedHarvestTime || prediction?.optimization?.expectedHarvestTime || 'N/A'}
                  </span>
                </div>
                
                {/* Additional optimization info */}
                {optimizationData && (
                  <>
                    <div className="border-t pt-3 mt-3">
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
                    
                    {/* Seasonal recommendations */}
                    {optimizationData.seasonalRecommendations && (
                      <div className="mt-3 p-2 bg-primary/10 rounded">
                        <p className="text-primary text-xs font-medium mb-1">Seasonal Recommendations:</p>
                        {optimizationData.seasonalRecommendations.map((rec, index) => (
                          <p key={index} className="text-text-secondary text-xs">• {rec}</p>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Soil Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Soil Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Soil Analysis */}
                <div>
                  <h4 className="text-sm font-medium text-text-secondary mb-2">Soil Analysis</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-2 bg-background-card rounded">
                      <p className="text-xs text-text-secondary">Drainage</p>
                      <p className="text-sm font-medium">{prediction?.soilData?.analysis?.drainage || 'N/A'}</p>
                    </div>
                    <div className="text-center p-2 bg-background-card rounded">
                      <p className="text-xs text-text-secondary">Water Holding</p>
                      <p className="text-sm font-medium">{prediction?.soilData?.analysis?.waterHolding || 'N/A'}</p>
                    </div>
                    <div className="text-center p-2 bg-background-card rounded">
                      <p className="text-xs text-text-secondary">Nutrient Retention</p>
                      <p className="text-sm font-medium">{prediction?.soilData?.analysis?.nutrientRetention || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h4 className="text-sm font-medium text-text-secondary mb-2">Management Recommendations</h4>
                  <div className="space-y-2">
                    {prediction?.soilData?.recommendations?.length > 0 ? (
                      prediction.soilData.recommendations.map((recommendation, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-text-primary text-sm">{recommendation}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-text-secondary text-sm">No recommendations available</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Suitable Crops */}
          <Card>
            <CardHeader>
              <CardTitle>Suitable Crops for This Soil</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {prediction?.soilData?.suitableCrops?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {prediction.soilData.suitableCrops.map((crop, index) => (
                      <span 
                        key={index} 
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          crop.toLowerCase() === prediction?.cropType?.toLowerCase() 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-background-card text-text-secondary'
                        }`}
                      >
                        {crop}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-text-secondary">No suitable crops data available</p>
                )}
                {prediction?.soilData?.suitableCrops?.includes(prediction?.cropType?.charAt(0).toUpperCase() + prediction?.cropType?.slice(1)) && (
                  <div className="mt-3 p-3 bg-status-success/10 border border-status-success/20 rounded-lg">
                    <p className="text-status-success text-sm">
                      ✅ Your selected crop ({prediction?.cropType}) is well-suited for this soil type!
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Detailed Fertilization Schedule */}
          {optimizationData?.fertilizationStages && (
            <Card>
              <CardHeader>
                <CardTitle>Fertilization Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {optimizationData.fertilizationStages.map((stage, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-background-card rounded-lg">
                      <div>
                        <p className="text-text-primary font-medium">{stage.stage}</p>
                        <p className="text-text-secondary text-sm">{stage.fertilizer}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-text-primary font-medium">{stage.quantity}</p>
                      </div>
                    </div>
                  ))}
                  
                  {optimizationData.fertilizerAdjustment && (
                    <div className="mt-3 p-2 bg-status-warning/10 rounded">
                      <p className="text-status-warning text-xs">
                        <strong>Soil Adjustment:</strong> {optimizationData.fertilizerAdjustment}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Detailed Irrigation Schedule */}
          {optimizationData?.irrigationStages && (
            <Card>
              <CardHeader>
                <CardTitle>Irrigation Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {optimizationData.irrigationStages.map((stage, index) => (
                    <div key={index} className="flex items-start space-x-2 p-2 bg-primary/10 rounded">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <p className="text-text-primary text-sm">{stage}</p>
                    </div>
                  ))}
                  
                  {optimizationData.seasonalIrrigationNote && (
                    <div className="mt-3 p-2 bg-primary/10 rounded">
                      <p className="text-primary text-xs">
                        <strong>Seasonal Note:</strong> {optimizationData.seasonalIrrigationNote}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Insights */}
          <Card>
            <CardHeader>
              <CardTitle>AI Insights & Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {prediction?.insights?.length > 0 ? (
                  prediction.insights.map((insight, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-text-primary text-sm">{insight}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-text-secondary">No insights available</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Prediction Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Prediction Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-text-secondary text-sm">Data Sources</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {prediction?.fetchedFromAPIs && (
                        <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded">API Data</span>
                      )}
                      {prediction?.soilData?.dataSource && (
                        <span className="px-2 py-1 bg-status-success/20 text-status-success text-xs rounded">
                          Soil: {prediction.soilData.dataSource}
                        </span>
                      )}
                      {prediction?.weather?.dataSource && (
                        <span className="px-2 py-1 bg-status-warning/20 text-status-warning text-xs rounded">
                          Weather: {prediction.weather.dataSource}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-text-secondary text-sm">ML Model Used</p>
                    <p className="text-text-primary font-medium">
                      {prediction?.mlModelUsed ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-text-secondary text-sm">Created Date</p>
                    <p className="text-text-primary font-medium">
                      {formatDate(prediction?.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-text-secondary text-sm">Last Updated</p>
                    <p className="text-text-primary font-medium">
                      {formatDate(prediction?.updatedAt)}
                    </p>
                  </div>
                </div>

                {prediction?.soilData?.searchMetadata?.dataAccuracy && (
                  <div className="mt-3 p-2 bg-background-card rounded">
                    <p className="text-text-secondary text-xs">
                      Data Accuracy: <span className="font-medium text-text-primary">
                        {prediction.soilData.searchMetadata.dataAccuracy}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default ViewPrediction
