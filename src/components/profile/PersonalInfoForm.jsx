import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import FormInput from '../ui/FormInput'
import Button from '../Button'
import useAuth from '../../hooks/useAuth'

const PersonalInfoForm = () => {
  const { user, updateUser } = useAuth()
  const [formData, setFormData] = useState({
    name: user?.name || 'Ethan Carter',
    email: user?.email || 'ethan.carter@example.com',
    phone: user?.phone || '+1 (555) 123-4567'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    updateUser(formData)
    console.log('Personal info updated:', formData)
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
        <CardTitle className="text-text-primary text-lg">Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <FormInput
              label="Name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
            <FormInput
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <FormInput
              label="Phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
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

export default PersonalInfoForm
