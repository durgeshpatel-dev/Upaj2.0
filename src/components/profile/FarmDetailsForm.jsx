import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import FormInput from '../ui/FormInput'
import Button from '../Button'
import useAuth from '../../hooks/useAuth'

const FarmDetailsForm = () => {
  const { user, updateUser } = useAuth()
  const [formData, setFormData] = useState({
    farmName: user?.farmName || 'Green Valley Acres',
    location: user?.location || 'Central Valley, CA',
    acreage: user?.acreage || 500
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    updateUser(formData)
    console.log('Farm details updated:', formData)
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
              label="Total Acreage"
              type="number"
              value={formData.acreage}
              onChange={(e) => handleInputChange('acreage', parseInt(e.target.value))}
            />
          </div>
          
          <div className="flex justify-end pt-4">
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default FarmDetailsForm
