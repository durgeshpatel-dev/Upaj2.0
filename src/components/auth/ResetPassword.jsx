import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import FormInput from '../ui/FormInput'
import Button from '../Button'
import { authAPI } from '../../utils/api'

const ResetPassword = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [isTokenValid, setIsTokenValid] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    // Check if token exists
    if (!token) {
      setIsTokenValid(false)
      setErrors({ general: 'Invalid or missing reset token. Please request a new password reset.' })
    } else {
      console.log('🔑 Reset token found:', token)
    }
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    console.log('🔍 Form data on submit:', formData);
    console.log('🔍 Password type:', typeof formData.password);
    console.log('🔍 Confirm password type:', typeof formData.confirmPassword);

    // Ensure we have strings and basic validation
    const password = String(formData.password || '').trim();
    const confirmPassword = String(formData.confirmPassword || '').trim();

    if (!password) {
      setErrors({ password: 'Password is required' })
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setErrors({ password: 'Password must be at least 6 characters long' })
      setIsLoading(false)
      return
    }

    if (!confirmPassword) {
      setErrors({ confirmPassword: 'Please confirm your password' })
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' })
      setIsLoading(false)
      return
    }

    try {
      console.log('🚀 Attempting password reset with token:', token)
      console.log('🔒 Using password:', password);
      const result = await authAPI.resetPassword(token, password)
      console.log('📥 Reset password result:', result)
      
      if (result.success) {
        console.log('✅ Password reset successful')
        setIsSuccess(true)
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              message: 'Password reset successful! Please login with your new password.' 
            } 
          })
        }, 3000)
      } else {
        console.log('❌ Password reset failed:', result.error)
        if (result.error.includes('expired') || result.error.includes('invalid')) {
          setIsTokenValid(false)
        }
        setErrors({ general: result.error })
      }
    } catch (error) {
      console.error('❌ Unexpected reset password error:', error)
      setErrors({ general: 'Failed to reset password. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    console.log(`🔄 Input change - Field: ${field}, Value:`, value, typeof value);
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };
      console.log('🔄 New form data:', newData);
      return newData;
    })
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  // Helper function to handle event objects from FormInput
  const handlePasswordChange = (e) => {
    handleInputChange('password', e.target.value);
  }

  const handleConfirmPasswordChange = (e) => {
    handleInputChange('confirmPassword', e.target.value);
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Password Reset Successful!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">
              Your password has been successfully reset. You will be redirected to the login page in a few seconds.
            </p>
            <Link 
              to="/login" 
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Go to Login Now
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isTokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Invalid Reset Link
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">
              This password reset link is invalid or has expired. Please request a new password reset.
            </p>
            <div className="space-y-3">
              <Link 
                to="/forgot-password" 
                className="block w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Request New Reset Link
              </Link>
              <Link 
                to="/login" 
                className="block text-green-600 hover:text-green-700 font-medium"
              >
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-3a1 1 0 011-1h2.586l6.414-6.414a6 6 0 019 0z" />
            </svg>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Reset Your Password
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Enter your new password below
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {errors.general}
              </div>
            )}
            
            <FormInput
              label="New Password"
              type="password"
              value={formData.password}
              onChange={handlePasswordChange}
              error={errors.password}
              placeholder="Enter your new password"
              required
            />
            
            <FormInput
              label="Confirm New Password"
              type="password"
              value={formData.confirmPassword}
              onChange={handleConfirmPasswordChange}
              error={errors.confirmPassword}
              placeholder="Confirm your new password"
              required
            />
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <Link 
              to="/login" 
              className="text-green-600 hover:text-green-700 text-sm font-medium"
            >
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ResetPassword
