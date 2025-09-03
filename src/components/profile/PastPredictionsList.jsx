import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { predictionAPI } from '../../utils/api'
import { useAuth } from '../../context/AuthContext'

const PastPredictionsList = () => {
  const { user, isAuthenticated } = useAuth()
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPredictions = async () => {
      if (!isAuthenticated || !user?._id) return
      
      setLoading(true)
      setError(null)
      
      try {
        const result = await predictionAPI.getUserPredictions(user._id)
        if (result.success) {
          setPredictions(result.data)
        } else {
          setError(result.error)
        }
      } catch (err) {
        setError('Failed to fetch predictions')
        console.error('Error fetching predictions:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPredictions()
  }, [user, isAuthenticated])

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return dateString
    }
  }

  const formatYield = (yield_, cropType) => {
    // Handle different yield data structures
    if (typeof yield_ === 'object') {
      if (yield_.predicted) {
        // Check if unit is stored with the yield data
        const unit = yield_.unit || getUnitForCrop(cropType);
        return `${yield_.predicted} ${unit}`;
      }
      // Handle other object structures
      if (yield_.value !== undefined) {
        const unit = yield_.unit || getUnitForCrop(cropType);
        return `${yield_.value} ${unit}`;
      }
    }
    
    // Handle numeric values
    if (typeof yield_ === 'number') {
      const unit = getUnitForCrop(cropType);
      return `${yield_} ${unit}`;
    }
    
    // Handle string values that might include units
    if (typeof yield_ === 'string' && yield_.includes(' ')) {
      return yield_; // Already has unit
    }
    
    // Fallback for string numbers
    if (typeof yield_ === 'string' && !isNaN(yield_)) {
      const unit = getUnitForCrop(cropType);
      return `${yield_} ${unit}`;
    }
    
    return yield_ || 'N/A';
  }

  // Helper function to determine appropriate unit based on crop type
  const getUnitForCrop = (cropType) => {
    if (!cropType) return 'kg/ha';
    
    const crop = cropType.toLowerCase();
    
    // Crops typically measured in bushels/acre in some regions
    if (crop.includes('wheat') || crop.includes('corn') || crop.includes('maize')) {
      return 'bu/acre';
    }
    
    // Rice and most other crops typically in kg/ha or tons/ha
    if (crop.includes('rice') || crop.includes('barley') || crop.includes('cotton')) {
      return 'kg/ha';
    }
    
    // Default to metric system
    return 'kg/ha';
  }

  return (
    <Card className="border-border bg-background-card">
      <CardHeader>
        <CardTitle className="text-text-primary text-lg">Past Predictions</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4 text-text-secondary">Loading predictions...</div>
        ) : error ? (
          <div className="text-center py-4 text-status-error">Error: {error}</div>
        ) : predictions.length === 0 ? (
          <div className="text-center py-4 text-text-secondary">No predictions found</div>
        ) : (
          <div className="overflow-hidden rounded-lg ring-1 ring-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-background text-text-secondary">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Crop</th>
                  <th className="px-4 py-3 font-medium">Area</th>
                  <th className="px-4 py-3 font-medium">Predicted Yield</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map((prediction, i) => (
                  <tr key={prediction._id || i} className="border-t border-border">
                    <td className="px-4 py-3 text-text-primary">
                      {formatDate(prediction.plantingDate || prediction.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-text-primary">
                      {prediction.cropType}
                    </td>
                    <td className="px-4 py-3 text-text-primary">
                      {prediction.area} acres
                    </td>
                    <td className="px-4 py-3 text-text-primary">
                      {formatYield(prediction.yield, prediction.cropType)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default PastPredictionsList
