import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import FormInput from '../ui/FormInput'
import Button from '../Button'
import { useAuth } from '../../context/AuthContext'
import { authAPI } from '../../utils/api'
import { initiateOAuth } from '../../utils/oauth'
import {Tr} from '../ui/SimpleTranslation';


const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  // Test function to check API connectivity
  const testAPI = async () => {
    try {
      console.log('🔧 Testing direct API call...');
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'test123'
        })
      });
      
      console.log('📡 Direct API Response Status:', response.status);
      console.log('📡 Direct API Response Headers:', response.headers);
      
      const data = await response.json();
      console.log('📦 Direct API Response Data:', data);
    } catch (error) {
      console.error('❌ Direct API Test Error:', error);
    }
  };

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

    // Call backend API
    try {
      console.log('🚀 Attempting login for:', formData.email);
      const result = await authAPI.login(formData.email, formData.password)
      console.log('📥 Login result:', result);
      
      if (result.success) {
        console.log('✅ Login successful');
        const { user, token } = result.data
        login(token, user)
        
        // Redirect to intended page or dashboard
        const from = location.state?.from?.pathname || '/dashboard'
        navigate(from, { replace: true })
      } else {
        console.log('❌ Login failed:', result.error);
        console.log('🔍 Login result data:', result.data);
        
        if (result.error.includes('verify')) {
          // User needs to verify email
          console.log('📧 Email verification required, extracting userId...');
          const userId = result.data?.user?.id || result.data?.user?._id || result.data?.userId;
          console.log('👤 Extracted userId for verification:', userId);
          
          navigate('/verify-email', { 
            state: { 
              email: formData.email,
              userId: userId,
              message: result.error 
            } 
          })
        } else {
          setErrors({ general: result.error })
        }
      }
    } catch (error) {
      setErrors({ general: 'Login failed. Please try again.' })
    } finally {
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
    
    try {
      const result = await authAPI.login('demo@agrivision.com', 'demo123')
      
      if (result.success) {
        const { user, token } = result.data
        login(token, user)
        navigate('/dashboard')
      } else {
        setErrors({ general: result.error })
      }
    } catch (error) {
      setErrors({ general: 'Demo login failed. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5001/api/auth/google'
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
          {/* OAuth Button */}
          <div className="mb-6">
            <Button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full bg-white hover:bg-gray-100 text-gray-900 font-semibold border border-gray-300 flex items-center justify-center gap-3"
              disabled={isLoading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <Tr>Sign in with Google</Tr>
            </Button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-text-secondary">or</span>
            </div>
          </div>

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
               <Tr>Forgot password?</Tr>
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>

            {/* Demo Login Button For Debugging  */}
            {/* <Button
              type="button"
              variant="outline"
              className="w-full mt-2"
              onClick={handleDemoLogin}
              disabled={isLoading}
            >
              Demo Login
            </Button> */}

            {/* Test API Button */}
            {/* <Button
              type="button"
              variant="outline"
              className="w-full mt-2 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
              onClick={testAPI}
            >
              🔧 Test API Connection
            </Button> */}
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
