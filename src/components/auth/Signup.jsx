import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import FormInput from '../ui/FormInput'
import Button from '../Button'
import { authAPI } from '../../utils/api'
import { Eye, EyeOff, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react'
import { Tr } from '../ui/SimpleTranslation'
import { useUnifiedTranslation } from '../../hooks/useUnifiedTranslation'

const Signup = () => {
  const navigate = useNavigate()
  const { t } = useUnifiedTranslation()
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    farmName: '',
    location: '',
    totalArea: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  // Password strength validation
  const validatePassword = (password) => {
    const requirements = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    }
    return requirements
  }

  const passwordRequirements = validatePassword(formData.password)
  const isPasswordStrong = Object.values(passwordRequirements).every(req => req)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    // Comprehensive validation
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (!isPasswordStrong) {
      newErrors.password = 'Password does not meet security requirements'
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    if (!formData.farmName.trim()) {
      newErrors.farmName = 'Farm name is required'
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required'
    }
    
    if (!formData.totalArea || parseFloat(formData.totalArea) <= 0) {
      newErrors.totalArea = 'Please enter a valid total area'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsLoading(false)
      return
    }

    // Call backend API
    try {
      console.log('🚀 Calling signup API...');
      const result = await authAPI.signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        farmDetails: {
          farmName: formData.farmName,
          location: formData.location,
          totalArea: parseFloat(formData.totalArea)
        }
      })

      console.log('📥 Signup API result:', result);

      if (result.success) {
        // Extract userId robustly from possible backend shapes
        const data = result.data || {}
        console.log('🔍 Signup response data:', data);
        
        const nestedUser = data.user || data.data || {}
        console.log('🔍 Nested user object:', nestedUser);
        
        const userId = nestedUser.id || nestedUser._id || data.userId || data.id || data._id || null
        console.log('👤 Extracted userId:', userId);
        console.log('👤 userId type:', typeof userId);

        // Redirect to verification page
        console.log('🔄 Navigating to verify-email with state:', {
          email: formData.email,
          name: formData.name,
          userId,
          message: 'Please verify your email to complete registration.'
        });
        
        navigate('/verify-email', { 
          state: { 
            email: formData.email,
            name: formData.name,
            userId,
            message: 'Please verify your email to complete registration.'
          } 
        })
      } else {
        console.log('❌ Signup failed:', result.error);
        setErrors({ general: result.error })
      }
    } catch (error) {
      console.error('❌ Unexpected signup error:', error);
      setErrors({ general: 'Signup failed. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignup = () => {
    window.location.href = 'http://localhost:5001/api/auth/google'
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background-card flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <Card className="shadow-xl border-border/30 backdrop-blur-sm bg-background-card/95">
          <CardHeader className="text-center pb-6 px-8 pt-8">
            <div className="mx-auto mb-4 w-20 h-20 bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-primary text-3xl filter drop-shadow-lg">🌱</span>
            </div>
            <CardTitle className="text-3xl font-bold text-text-primary mb-2 tracking-tight"><Tr>Create Your Account</Tr></CardTitle>
            <p className="text-text-secondary"><Tr>Join thousands of farmers optimizing their yields with AI</Tr></p>
            
            {/* Progress Steps */}
            <div className="flex items-center justify-center mt-6 p-4 bg-background rounded-xl border border-border/50">
              <div className={`flex items-center space-x-2 transition-all duration-300 ${currentStep >= 1 ? 'text-primary' : 'text-text-secondary'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${currentStep >= 1 ? 'border-primary bg-primary text-white shadow-lg shadow-primary/30' : 'border-border bg-background'}`}>
                  {currentStep > 1 ? <CheckCircle size={16} /> : '1'}
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold"><Tr>Personal Info</Tr></div>
                  <div className="text-xs opacity-70"><Tr>Basic details</Tr></div>
                </div>
              </div>
              <div className={`w-8 h-1 mx-2 rounded-full transition-all duration-500 ${currentStep > 1 ? 'bg-gradient-to-r from-primary to-primary/70' : 'bg-border'}`}></div>
              <div className={`flex items-center space-x-2 transition-all duration-300 ${currentStep >= 2 ? 'text-primary' : 'text-text-secondary'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${currentStep >= 2 ? 'border-primary bg-primary text-white shadow-lg shadow-primary/30' : 'border-border bg-background'}`}>
                  {currentStep > 2 ? <CheckCircle size={16} /> : '2'}
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold"><Tr>Farm Details</Tr></div>
                  <div className="text-xs opacity-70"><Tr>Location & size</Tr></div>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="px-6 pb-6 sm:px-8 sm:pb-8">
            {/* Google Sign Up Button */}
            <div className="mb-6">
              <Button
                type="button"
                onClick={handleGoogleSignup}
                className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg flex items-center justify-center gap-3 h-12 text-sm transition-all duration-200 rounded-xl"
                disabled={isLoading}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <Tr>Continue with Google</Tr>
              </Button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-background-card text-text-secondary font-medium"><Tr>or continue with email</Tr></span>
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.general && (
                <div className="flex items-start space-x-2 text-status-error text-sm bg-status-error/10 border border-status-error/20 rounded-lg p-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Registration Failed</div>
                    <div className="opacity-90">{errors.general}</div>
                  </div>
                </div>
              )}

              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-text-primary mb-1"><Tr>Personal Information</Tr></h3>
                    <p className="text-text-secondary text-sm"><Tr>Let's start with your basic details</Tr></p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <FormInput
                      label={t("Full Name")}
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      error={errors.name}
                      placeholder={t("Enter your full name")}
                      className="h-12 text-sm rounded-lg border-2 focus:border-primary/50 transition-all duration-200"
                    />

                    <FormInput
                      label={t("Email Address")}
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      error={errors.email}
                      placeholder={t("Enter your email address")}
                      className="h-12 text-sm rounded-lg border-2 focus:border-primary/50 transition-all duration-200"
                    />

                    <div className="space-y-3">
                      <div className="relative">
                        <FormInput
                          label={t("Password")}
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          error={errors.password}
                          placeholder={t("Create a strong password")}
                          className="h-12 text-sm rounded-lg border-2 focus:border-primary/50 transition-all duration-200 pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-[2.2rem] text-text-secondary hover:text-text-primary transition-colors duration-200 p-1 rounded-md hover:bg-background"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      
                      {/* Password Requirements */}
                      {formData.password && (
                        <div className="space-y-2 p-3 bg-gradient-to-br from-background to-background/50 rounded-lg border border-border/50 animate-in fade-in slide-in-from-top-2 duration-300">
                          <p className="text-xs font-semibold text-text-primary flex items-center space-x-2">
                            <span><Tr>Password Strength</Tr></span>
                            <div className={`w-2 h-2 rounded-full ${isPasswordStrong ? 'bg-status-success' : 'bg-status-warning'} animate-pulse`}></div>
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {Object.entries({
                              [t('At least 8 characters')]: passwordRequirements.length,
                              [t('Lowercase letter')]: passwordRequirements.lowercase,
                              [t('Uppercase letter')]: passwordRequirements.uppercase,
                              [t('Number')]: passwordRequirements.number,
                              [t('Special character')]: passwordRequirements.special
                            }).map(([req, met]) => (
                              <div key={req} className={`flex items-center space-x-2 transition-all duration-300 ${met ? 'text-status-success' : 'text-text-secondary'}`}>
                                <CheckCircle size={12} className={`transition-all duration-300 ${met ? 'text-status-success' : 'text-text-secondary opacity-50'}`} />
                                <span className={met ? 'font-medium' : ''}>{req}</span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-2">
                            <div className="flex items-center space-x-2 text-xs text-text-secondary">
                              <span>Strength:</span>
                              <div className="flex-1 bg-border h-1.5 rounded-full overflow-hidden">
                                <div className={`h-full transition-all duration-500 ${
                                  Object.values(passwordRequirements).filter(Boolean).length === 0 ? 'w-0' :
                                  Object.values(passwordRequirements).filter(Boolean).length <= 2 ? 'w-1/3 bg-status-error' :
                                  Object.values(passwordRequirements).filter(Boolean).length <= 4 ? 'w-2/3 bg-status-warning' :
                                  'w-full bg-status-success'
                                }`}></div>
                              </div>
                              <span className="font-medium text-xs">
                                {Object.values(passwordRequirements).filter(Boolean).length <= 2 ? 'Weak' :
                                 Object.values(passwordRequirements).filter(Boolean).length <= 4 ? 'Medium' : 'Strong'}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="relative">
                      <FormInput
                        label={t("Confirm Password")}
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        error={errors.confirmPassword}
                        placeholder={t("Confirm your password")}
                        className="h-12 text-sm rounded-lg border-2 focus:border-primary/50 transition-all duration-200 pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-[2.2rem] text-text-secondary hover:text-text-primary transition-colors duration-200 p-1 rounded-md hover:bg-background"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                      {formData.confirmPassword && formData.password === formData.confirmPassword && (
                        <div className="absolute right-10 top-[2.2rem] text-status-success">
                          <CheckCircle size={18} />
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={() => {
                      // Validate step 1 before proceeding
                      const step1Errors = {}
                      if (!formData.name.trim()) step1Errors.name = 'Name is required'
                      if (!formData.email.trim()) step1Errors.email = 'Email is required'
                      if (!isPasswordStrong) step1Errors.password = 'Password requirements not met'
                      if (formData.password !== formData.confirmPassword) step1Errors.confirmPassword = 'Passwords do not match'
                      
                      if (Object.keys(step1Errors).length === 0) {
                        setCurrentStep(2)
                        setErrors({})
                      } else {
                        setErrors(step1Errors)
                      }
                    }}
                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    disabled={!formData.name || !formData.email || !isPasswordStrong || formData.password !== formData.confirmPassword}
                  >
                    <Tr>Continue to Farm Information →</Tr>
                  </Button>
                </div>
              )}

            {/* Step 2: Farm Information */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-center flex-1">
                    <h3 className="text-xl font-bold text-text-primary mb-1"><Tr>Farm Information</Tr></h3>
                    <p className="text-text-secondary text-sm"><Tr>Tell us about your farming operation</Tr></p>
                  </div>
                </div>

                <div className="flex justify-center mb-4">
                  <Button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-xs bg-background border border-border text-text-secondary hover:text-text-primary hover:border-primary transition-all duration-200 px-4 py-1.5 rounded-md flex items-center"
                  >
                    <ArrowLeft size={14} className="mr-1" />
                    <Tr>Back to Personal Info</Tr>
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <FormInput
                    label={t("Farm Name")}
                    value={formData.farmName}
                    onChange={(e) => handleInputChange('farmName', e.target.value)}
                    error={errors.farmName}
                    placeholder={t("Enter your farm name")}
                    className="h-12 text-sm rounded-lg border-2 focus:border-primary/50 transition-all duration-200"
                  />

                  <FormInput
                    label={t("Location")}
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    error={errors.location}
                    placeholder={t("District, State (e.g., Pune, Maharashtra)")}
                    className="h-12 text-sm rounded-lg border-2 focus:border-primary/50 transition-all duration-200"
                  />

                  <FormInput
                    label={t("Total Area (acres)")}
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.totalArea}
                    onChange={(e) => handleInputChange('totalArea', e.target.value)}
                    error={errors.totalArea}
                    placeholder={t("Enter total farm area in acres")}
                    className="h-12 text-sm rounded-lg border-2 focus:border-primary/50 transition-all duration-200"
                  />
                </div>

                {/* Farm Size Helper */}
                {formData.totalArea && (
                  <div className="p-3 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center space-x-2 text-primary mb-1">
                      <CheckCircle size={14} />
                      <span className="text-xs font-semibold">Farm Size Classification</span>
                    </div>
                    <p className="text-xs text-text-secondary">
                      {parseFloat(formData.totalArea) <= 2.5 ? 'Small farm - Perfect for intensive crop monitoring' :
                       parseFloat(formData.totalArea) <= 25 ? 'Medium farm - Ideal for diversified agriculture' :
                       'Large farm - Great for commercial farming operations'}
                    </p>
                  </div>
                )}

                <div className="p-3 bg-gradient-to-br from-background to-background/50 rounded-lg border border-border/50">
                  <div className="text-xs text-text-secondary leading-relaxed">
                    <div className="flex items-start space-x-2">
                      <CheckCircle size={14} className="text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-semibold text-text-primary">Privacy & Terms:</span> By creating an account, you agree to our{' '}
                        <Link to="/terms" className="text-primary hover:text-primary/80 font-semibold underline underline-offset-2">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link to="/privacy" className="text-primary hover:text-primary/80 font-semibold underline underline-offset-2">
                          Privacy Policy
                        </Link>. Your farm data is secure and never shared without permission.
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-bold bg-gradient-to-r from-primary via-primary to-primary/80 hover:from-primary/90 hover:via-primary/90 hover:to-primary/70 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                  disabled={isLoading || !formData.farmName || !formData.location || !formData.totalArea}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span className="text-sm"><Tr>Creating your account...</Tr></span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-sm"><Tr>Create My AgriVision Account</Tr></span>
                      <CheckCircle size={16} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full transition-transform duration-700 group-hover:translate-x-full"></div>
                </Button>
              </div>
            )}
          </form>

          {/* Footer Links */}
          <div className="space-y-3 pt-4 border-t border-border/50 mt-6">
            <div className="text-center">
              <p className="text-text-secondary text-sm">
                <Tr>Already have an account?</Tr>{' '}
                <Link to="/login" className="text-primary hover:text-primary/80 font-semibold underline underline-offset-2 transition-colors duration-200">
                  <Tr>Sign in here</Tr>
                </Link>
              </p>
            </div>

            <div className="text-center">
              <Link to="/" className="inline-flex items-center space-x-1 text-text-secondary hover:text-text-primary text-xs transition-colors duration-200 group">
                <ArrowLeft size={14} />
                <span className="group-hover:underline underline-offset-2"><Tr>Back to Home</Tr></span>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}

export default Signup