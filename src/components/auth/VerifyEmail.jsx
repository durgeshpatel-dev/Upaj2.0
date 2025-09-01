import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import Button from '../Button'
import { useAuth } from '../../context/AuthContext'

const VerifyEmail = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  
  const email = location.state?.email || 'user@example.com'
  const name = location.state?.name || 'User'
  
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
    if (code.length !== 6) {
      setErrors({ verification: 'Please enter the complete 6-digit code' })
      setIsLoading(false)
      return
    }

    // Simulate verification
    setTimeout(() => {
      const userData = {
        name: name,
        email: email,
        phone: '+1 (555) 123-4567',
        farmName: 'New Farm',
        location: 'Your Location',
        acreage: 100,
        joinedDate: new Date().getFullYear().toString()
      }
      
      login(userData, 'new-user-token-12345')
      navigate('/dashboard', { 
        state: { 
          message: 'Welcome to AgriVision! Your account has been verified successfully.' 
        } 
      })
      setIsLoading(false)
    }, 1500)
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

  const handleResendCode = () => {
    if (resendCooldown === 0) {
      setResendCooldown(60)
      // Simulate resending code
      alert('Verification code resent to your email!')
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
