import React, { createContext, useContext, useState, useEffect } from 'react'
import { isTokenExpired, isValidTokenStructure } from '../utils/tokenUtils'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [backendAvailable, setBackendAvailable] = useState(false)

  // Check backend availability
  useEffect(() => {
    const checkBackendAvailability = async () => {
      try {
        console.log('🔍 Checking backend availability...')
        const baseURL = process.env.REACT_APP_API_URL || 'https://upaj-flask-backend-liart.vercel.app/api';
        const healthURL = baseURL.replace('/api', '/health');
        const response = await fetch(healthURL, {
          method: 'GET',
          timeout: 5000 // 5 second timeout
        })
        
        if (response.ok) {
          console.log('✅ Backend is available')
          setBackendAvailable(true)
        } else {
          console.log('❌ Backend responded with error:', response.status)
          setBackendAvailable(false)
        }
      } catch (error) {
        console.log('❌ Backend is not available:', error.message)
        setBackendAvailable(false)
      }
    }

    checkBackendAvailability()
    
    // Check backend availability every 30 seconds
    const interval = setInterval(checkBackendAvailability, 30000)
    
    return () => clearInterval(interval)
  }, [])

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token')
        const storedUser = localStorage.getItem('user')

        console.log('🔄 Initializing auth state...')
        console.log('💾 Stored token:', storedToken ? 'Present' : 'None')
        console.log('💾 Stored user:', storedUser ? 'Present' : 'None')

        if (storedToken && storedUser) {
          try {
            const userData = JSON.parse(storedUser)
            
            // First check token structure and expiration
            if (!isValidTokenStructure(storedToken)) {
              console.log('❌ Token has invalid structure, clearing auth state')
              localStorage.removeItem('token')
              localStorage.removeItem('user')
              setToken(null)
              setUser(null)
              return
            }
            
            if (isTokenExpired(storedToken)) {
              console.log('⏰ Token is expired, clearing auth state')
              localStorage.removeItem('token')
              localStorage.removeItem('user')
              setToken(null)
              setUser(null)
              return
            }
            
            // Verify token is still valid by calling profile endpoint
            console.log('✅ Verifying stored token...')
            const baseURL = process.env.REACT_APP_API_URL || 'https://upaj-flask-backend-liart.vercel.app/api';
            const response = await fetch(`${baseURL}/auth/profile`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${storedToken}`,
                'Content-Type': 'application/json'
              },
              timeout: 10000 // 10 second timeout
            })
            
            if (response.ok) {
              const profileData = await response.json()
              console.log('✅ Token valid, restoring auth state')
              console.log('👤 Profile data:', profileData)
              setToken(storedToken)
              setUser(profileData.user || profileData.data || profileData)
            } else {
              console.log('❌ Token invalid (status:', response.status, '), clearing auth state')
              // Token is invalid, clear storage
              localStorage.removeItem('token')
              localStorage.removeItem('user')
              setToken(null)
              setUser(null)
            }
          } catch (error) {
            console.error('❌ Error during token verification:', error)
            // If it's a network error and token looks valid, keep it but mark as offline
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
              console.log('🌐 Network error during token verification, keeping token for offline use')
              setToken(storedToken)
              setUser(userData)
            } else {
              // For other errors (parsing, etc.), clear auth state
              console.log('❌ Clearing auth state due to error')
              localStorage.removeItem('token')
              localStorage.removeItem('user')
              setToken(null)
              setUser(null)
            }
          }
        } else {
          console.log('💾 No stored auth data found')
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error)
        // Clear potentially corrupted data
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = (newToken, newUser) => {
    console.log('🔐 Logging in user:', newUser)
    console.log('🎫 With token:', newToken ? 'Present' : 'None')
    
    // Validate required parameters
    if (!newToken) {
      console.error('❌ Login failed: No token provided')
      return false
    }
    
    if (!newUser) {
      console.error('❌ Login failed: No user data provided')
      return false
    }
    
    // Validate token structure
    if (!isValidTokenStructure(newToken)) {
      console.error('❌ Login failed: Invalid token structure')
      return false
    }
    
    // Check if token is expired
    if (isTokenExpired(newToken)) {
      console.error('❌ Login failed: Token is expired')
      return false
    }
    
    // Validate user data structure
    if (!newUser.id && !newUser._id) {
      console.error('❌ Login failed: User data missing required ID')
      return false
    }
    
    if (!newUser.email) {
      console.error('❌ Login failed: User data missing required email')
      return false
    }
    
    try {
      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(newUser))
      setToken(newToken)
      setUser(newUser)
      
      console.log('✅ Login complete')
      return true
    } catch (error) {
      console.error('❌ Login failed: Error storing auth data:', error)
      return false
    }
  }

  const logout = async () => {
    console.log('👋 Logging out user...')
    
    try {
      // Call logout API if we have a token
      if (token) {
        const baseURL = process.env.REACT_APP_API_URL || 'https://upaj-flask-backend-liart.vercel.app/api';
        await fetch(`${baseURL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      }
    } catch (error) {
      console.error('❌ Logout API error:', error)
      // Continue with logout even if API call fails
    }
    
    // Clear state and localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    
    console.log('✅ Logout complete')
  }

  const updateUser = (userData) => {
    console.log('📝 Updating user data:', userData)
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const isAuthenticated = () => {
    return !!token && !!user
  }

  return (
    <AuthContext.Provider value={{ 
      token, 
      user, 
      isLoading, 
      backendAvailable,
      login, 
      logout, 
      updateUser, 
      isAuthenticated: isAuthenticated() // Call the function to get boolean value
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
