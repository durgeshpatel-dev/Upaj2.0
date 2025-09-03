import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const OAuthSuccess = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [isProcessing, setIsProcessing] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Extract token and user data from URL parameters
        const urlParams = new URLSearchParams(location.search)
        const token = urlParams.get('token')
        const userParam = urlParams.get('user')

        console.log('🔍 OAuth callback - Token:', token ? 'Present' : 'Missing')
        console.log('🔍 OAuth callback - User param:', userParam ? 'Present' : 'Missing')

        if (!token) {
          throw new Error('No authentication token received')
        }

        // Parse user data
        let userData = null
        if (userParam) {
          try {
            // Decode the user data (it might be URL encoded)
            const decodedUserData = decodeURIComponent(userParam)
            userData = JSON.parse(decodedUserData)
            console.log('👤 Parsed user data:', userData)
          } catch (parseError) {
            console.error('❌ Failed to parse user data:', parseError)
            // If user data parsing fails, we can still proceed with just the token
            // and fetch user data from the API
          }
        }

        // If we don't have user data from URL, fetch it using the token
        if (!userData && token) {
          console.log('📡 Fetching user profile with token...')
          try {
            const response = await fetch('http://localhost:5001/api/auth/profile', {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            })

            if (response.ok) {
              const profileData = await response.json()
              userData = profileData.user || profileData
              console.log('✅ Fetched user profile:', userData)
            } else {
              console.error('❌ Failed to fetch user profile:', response.status)
            }
          } catch (fetchError) {
            console.error('❌ Error fetching user profile:', fetchError)
          }
        }

        // Store authentication data using your existing AuthContext structure
        if (token && userData) {
          console.log('💾 Storing authentication data...')
          
          // Use your existing login function (token first, then user)
          login(token, userData)
          
          console.log('✅ OAuth authentication successful')
          
          // Redirect to dashboard after successful authentication
          setTimeout(() => {
            navigate('/dashboard', { replace: true })
          }, 1000)
          
        } else {
          throw new Error('Missing authentication data')
        }

      } catch (error) {
        console.error('❌ OAuth callback error:', error)
        setError(error.message)
        
        // Redirect to login page with error after 3 seconds
        setTimeout(() => {
          navigate('/login?error=oauth_failed', { replace: true })
        }, 3000)
      } finally {
        setIsProcessing(false)
      }
    }

    handleOAuthCallback()
  }, [location, navigate, login])

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-red-500 text-2xl">❌</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Failed</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Redirecting to login page...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {isProcessing ? 'Completing Sign In...' : 'Success!'}
        </h1>
        <p className="text-gray-600">
          {isProcessing 
            ? 'Please wait while we set up your account...' 
            : 'Redirecting to dashboard...'
          }
        </p>
      </div>
    </div>
  )
}

export default OAuthSuccess
