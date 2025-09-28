import React, { createContext, useContext, useState, useEffect } from 'react'
import { isTokenExpired, isValidTokenStructure } from '../utils/tokenUtils'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [backendAvailable, setBackendAvailable] = useState(false)

  // Set backend as unavailable for frontend-only deployment
  useEffect(() => {
    console.log('⚠️ Running in frontend-only mode - backend disabled')
    setBackendAvailable(false)
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
            
            // Skip backend verification in frontend-only mode
            console.log('✅ Using stored token without backend verification (frontend-only mode)')
            setToken(storedToken)
            setUser(userData)
          } catch (error) {
            console.error('❌ Error parsing stored user data:', error)
            // Clear corrupted data
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            setToken(null)
            setUser(null)
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
    
    // Frontend-only logout - no backend call needed
    
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
