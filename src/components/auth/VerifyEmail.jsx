import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import Button from '../Button'
import { useAuth } from '../../context/AuthContext'
import { authAPI } from '../../utils/api'

const VerifyEmail = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  
  // Debug: Log the entire location state
  console.log('🔍 VerifyEmail component loaded');
  console.log('📍 Location state:', location.state);
  console.log('📍 Full location object:', location);
  
  const email = location.state?.email || 'user@example.com'
  const name = location.state?.name || 'User'
  // Accept multiple possible keys for user id coming from the signup response
  const userId = location.state?.userId || location.state?.id || location.state?._id || location.state?.user?.id || location.state?.user?._id
  const message = location.state?.message || 'Please verify your email to continue.'
  
  console.log('📧 Email extracted:', email);
  console.log('👤 Name extracted:', name);
  console.log('🆔 User ID extracted:', userId);
  console.log('💬 Message extracted:', message);
  console.log('🔍 Checking all possible userId locations:');
  console.log('   - location.state?.userId:', location.state?.userId);
  console.log('   - location.state?.id:', location.state?.id);
  console.log('   - location.state?._id:', location.state?._id);
  console.log('   - location.state?.user?.id:', location.state?.user?.id);
  console.log('   - location.state?.user?._id:', location.state?.user?._id);
  
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', ''])
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const handleVerificationSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})
    
    const code = verificationCode.join('')
    console.log('🔍 Starting verification submit...');
    console.log('📧 Email from state:', email);
    console.log('👤 User ID from state:', userId);
    console.log('🔢 Verification code:', code);
    
    if (code.length !== 6) {
      console.log('❌ Code length invalid:', code.length);
      setErrors({ verification: 'Please enter the complete 6-digit code' })
      setIsLoading(false)
      return
    }

    try {
      // Check if we have userId, if not show error
      if (!userId) {
        console.log('❌ No userId found in state');
        setErrors({ verification: 'Unable to verify OTP. Please try signing up again.' })
        setIsLoading(false)
        return
      }

      console.log('📤 Calling authAPI.verifyOTP...');
      const result = await authAPI.verifyOTP(email, code, userId)
      console.log('📥 API result:', result);
      
      if (result.success) {
        console.log('✅ Verification successful');
        const data = result.data || {}
        const user = data.user || data
        const token = data.token || data.authToken || data.accessToken || null
        console.log('👤 User data:', user);
        console.log('🔑 Token present:', !!token);
        
        login(token, user)
        navigate('/dashboard', { 
          state: { 
            message: 'Welcome to AgriVision! Your account has been verified successfully.' 
          } 
        })
      } else {
        console.log('❌ Verification failed:', result.error);
        setErrors({ verification: result.error })
      }
    } catch (error) {
      console.error('❌ Unexpected error in verification:', error);
      setErrors({ verification: 'Verification failed. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerificationCodeChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...verificationCode]
      newCode[index] = value
      setVerificationCode(newCode)
      
      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`)
        if (nextInput) nextInput.focus()
      }
      
      // Clear errors when user starts typing
      if (errors.verification) {
        setErrors({})
      }
    }
  }

  const handleVerificationKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`)
      if (prevInput) prevInput.focus()
    }
  }

  const handleResendCode = async () => {
    if (resendCooldown === 0) {
      setResendCooldown(60)
      
      try {
        // Check if we have userId, if not show error
        if (!userId) {
          setErrors({ verification: 'Unable to resend OTP. Please try signing up again.' })
          setResendCooldown(0)
          return
        }

        const result = await authAPI.resendOTP(email, userId)
        if (result.success) {
          // Show success message (you can add a toast notification here)
          console.log('OTP resent successfully')
          setErrors({}) // Clear any previous errors
        } else {
          setErrors({ verification: result.error })
          setResendCooldown(0)
        }
      } catch (error) {
        setErrors({ verification: 'Failed to resend OTP. Please try again.' })
        setResendCooldown(0)
      }
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const paste = (e.clipboardData || window.clipboardData).getData('text')
    const digits = paste.replace(/\D/g, '').slice(0, 6).split('')
    
    const newCode = Array(6).fill('').map((_, i) => digits[i] || '')
    setVerificationCode(newCode)
    
    // Focus the last filled input or the first empty one
    const lastFilledIndex = Math.min(digits.length - 1, 5)
    setTimeout(() => {
      const targetInput = document.getElementById(`code-${lastFilledIndex}`)
      if (targetInput) targetInput.focus()
    }, 10)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
            <span className="text-primary text-2xl">📧</span>
          </div>
          <CardTitle className="text-2xl text-text-primary">Verify Your Email</CardTitle>
          <p className="text-text-secondary text-sm">
            We've sent a 6-digit verification code to<br />
            <span className="text-primary font-medium">{email}</span>
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerificationSubmit} className="space-y-6">
            {errors.verification && (
              <div className="text-status-error text-sm text-center bg-status-error/10 border border-status-error/20 rounded-md p-3">
                {errors.verification}
              </div>
            )}

            <div className="flex justify-center space-x-3" onPaste={handlePaste}>
              {verificationCode.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleVerificationCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleVerificationKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl font-semibold bg-background-card border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  autoComplete="off"
                />
              ))}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </Button>

            <div className="text-center space-y-2">
              <p className="text-text-secondary text-sm">
                Didn't receive the code?
              </p>
              <button 
                type="button" 
                className={`text-sm font-medium ${
                  resendCooldown === 0 
                    ? 'text-primary hover:text-primary/80 cursor-pointer' 
                    : 'text-text-secondary cursor-not-allowed'
                }`}
                onClick={handleResendCode}
                disabled={resendCooldown > 0}
              >
                {resendCooldown > 0 
                  ? `Resend in ${resendCooldown}s` 
                  : 'Resend Code'
                }
              </button>
            </div>

            <div className="text-center pt-4 border-t border-border">
              <p className="text-text-secondary text-sm mb-2">
                Want to use a different email?
              </p>
              <Link 
                to="/signup" 
                className="text-primary hover:text-primary/80 text-sm font-medium"
              >
                ← Back to Sign Up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default VerifyEmail
