import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import FormInput from '../ui/FormInput'
import Button from '../Button'
import { authAPI } from '../../utils/api'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    // Basic validation
    if (!email.trim()) {
      setErrors({ email: 'Email is required' })
      setIsLoading(false)
      return
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setErrors({ email: 'Please enter a valid email address' })
      setIsLoading(false)
      return
    }

    try {
      const result = await authAPI.forgotPassword(email)
      
      if (result.success) {
        setIsSubmitted(true)
      } else {
        setErrors({ general: result.error })
      }
    } catch (error) {
      setErrors({ general: 'Failed to send reset email. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (value) => {
    setEmail(value)
    if (errors.email) {
      setErrors({})
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-status-success/20 rounded-full flex items-center justify-center">
              <span className="text-status-success text-2xl">✓</span>
            </div>
            <CardTitle className="text-2xl text-text-primary">Check Your Email</CardTitle>
            <p className="text-text-secondary text-sm">
              We've sent a password reset link to<br />
              <span className="text-primary font-medium">{email}</span>
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-primary/10 border border-primary/20 rounded-md p-4">
              <p className="text-text-primary text-sm">
                <strong>Next steps:</strong>
              </p>
              <ul className="text-text-secondary text-sm mt-2 space-y-1">
                <li>• Check your email inbox</li>
                <li>• Click the reset link in the email</li>
                <li>• Create a new password</li>
                <li>• Sign in with your new password</li>
              </ul>
            </div>

            <Button
              onClick={() => navigate('/login')}
              className="w-full"
            >
              Back to Sign In
            </Button>

            <div className="text-center">
              <p className="text-text-secondary text-sm">
                Didn't receive the email?{' '}
                <button 
                  onClick={() => {
                    setIsSubmitted(false)
                    setEmail('')
                  }}
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  Try again
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
            <span className="text-primary text-2xl">🔑</span>
          </div>
          <CardTitle className="text-2xl text-text-primary">Reset Password</CardTitle>
          <p className="text-text-secondary">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <div className="text-status-error text-sm text-center bg-status-error/10 border border-status-error/20 rounded-md p-3">
                {errors.general}
              </div>
            )}

            <FormInput
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => handleInputChange(e.target.value)}
              error={errors.email}
              placeholder="Enter your email address"
              autoFocus
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Sending reset link...' : 'Send Reset Link'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-text-secondary">
              Remember your password?{' '}
              <Link to="/login" className="text-primary hover:text-primary/80 font-medium">
                Sign in
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

export default ForgotPassword
