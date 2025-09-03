import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import FormInput from '../ui/FormInput'
import Button from '../Button'
import { useAuth } from '../../context/AuthContext'
import { userProfileAPI } from '../../utils/api'
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react'

const FarmDetailsForm = () => {
  const { user, updateUser } = useAuth()
  const [formData, setFormData] = useState({
    farmName: '',
    location: '',
    totalArea: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        farmName: user.farmDetails?.farmName || user.farmName || '',
        location: user.farmDetails?.location || user.location || '',
        totalArea: user.farmDetails?.totalArea || user.totalArea || user.acreage || ''
      })
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)
    
    const farmData = {
      farmName: formData.farmName,
      location: formData.location,
      totalArea: parseFloat(formData.totalArea) || 0
    }
    
    console.log('🚜 Updating farm details:', farmData)
    
    try {
      // Call the backend API to update farm details
      const result = await userProfileAPI.updateFarmDetails(farmData)
      
      if (result.success) {
        console.log('✅ Farm details updated successfully:', result.data)
        
        // Update the local user context with the new data
        const updatedData = {
          farmDetails: farmData
        }
        updateUser(updatedData)
        
        setSuccess(true)
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000)
      } else {
        console.error('❌ Farm details update failed:', result.error)
        setError(result.error)
      }
    } catch (error) {
      console.error('❌ Unexpected error during farm details update:', error)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Card className="border-border bg-background-card">
      <CardHeader>
        <CardTitle className="text-text-primary text-lg">Farm Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center">
              <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
              <p className="text-green-700 text-sm">Farm details updated successfully!</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <FormInput
              label="Farm Name"
              value={formData.farmName}
              onChange={(e) => handleInputChange('farmName', e.target.value)}
            />
            <FormInput
              label="Location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
            />
          </div>
          <div className="grid gap-2 md:max-w-xs">
            <FormInput
              label="Total Area (acres)"
              type="number"
              value={formData.totalArea}
              onChange={(e) => handleInputChange('totalArea', e.target.value)}
            />
          </div>
          
          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              variant="primary" 
              disabled={isLoading}
              className="flex items-center space-x-2"
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default FarmDetailsForm
