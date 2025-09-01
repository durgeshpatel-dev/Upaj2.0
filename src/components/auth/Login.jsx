import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import FormInput from '../ui/FormInput'
import Button from '../Button'
import { useAuth } from '../../context/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    // Basic validation
    if (!formData.email || !formData.password) {
      setErrors({ general: 'Please fill in all fields' })
      setIsLoading(false)
      return
    }

    // Simulate login API call
    try {
      setTimeout(() => {
        const userData = {
          name: 'Ethan Carter',
          email: formData.email,
          phone: '+1 (555) 123-4567',
          farmName: 'Green Valley Acres',
          location: 'Central Valley, CA',
          acreage: 500,
          joinedDate: '2022'
        }
        
        login(userData, 'demo-token-12345')
        navigate('/dashboard')
        setIsLoading(false)
      }, 1500)
    } catch (error) {
      setErrors({ general: 'Login failed. Please try again.' })
      setIsLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleDemoLogin = async () => {
    setIsLoading(true)
    setFormData({ email: 'demo@agrivision.com', password: 'demo123' })
    
    setTimeout(() => {
      const userData = {
        name: 'Ethan Carter (Demo)',
        email: 'demo@agrivision.com',
        phone: '+1 (555) 123-4567',
        farmName: 'Green Valley Acres',
        location: 'Central Valley, CA',
        acreage: 500,
        joinedDate: '2022'
      }
      
      login(userData, 'demo-token-12345')
      navigate('/dashboard')
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
            <span className="text-primary text-2xl">🌱</span>
          </div>
          <CardTitle className="text-2xl text-text-primary">Welcome Back</CardTitle>
          <p className="text-text-secondary">Sign in to your AgriVision account</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <div className="text-status-error text-sm text-center bg-status-error/10 border border-status-error/20 rounded-md p-3">
                {errors.general}
              </div>
            )}

            <FormInput
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={errors.email}
              placeholder="Enter your email"
            />

            <FormInput
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              error={errors.password}
              placeholder="Enter your password"
            />

            <div className="flex justify-between items-center text-sm">
              <Link to="/forgot-password" className="text-primary hover:text-primary/80">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>

            {/* Demo Login Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full mt-2"
              onClick={handleDemoLogin}
              disabled={isLoading}
            >
              Demo Login
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-text-secondary">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:text-primary/80 font-medium">
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link to="/" className="text-text-secondary hover:text-text-primary text-sm">
              ← Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login
