import React, { useState, useEffect } from 'react'
import { chatbotAPI } from '../../utils/api'

const HealthIndicator = () => {
  const [health, setHealth] = useState({
    status: 'checking',
    message: 'Checking connection...',
    timestamp: null
  })

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await chatbotAPI.checkHealth()
        if (response.success) {
          setHealth({
            status: 'online',
            message: 'Connected to AI Assistant',
            timestamp: response.data.timestamp
          })
        } else {
          throw new Error(response.error)
        }
      } catch (error) {
        setHealth({
          status: 'offline',
          message: 'Using offline mode',
          timestamp: new Date().toISOString()
        })
      }
    }

    // Check health immediately
    checkHealth()

    // Check health every 30 seconds
    const interval = setInterval(checkHealth, 30000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = () => {
    switch (health.status) {
      case 'online': return 'bg-green-500'
      case 'offline': return 'bg-red-500'
      default: return 'bg-yellow-500'
    }
  }

  const getStatusText = () => {
    switch (health.status) {
      case 'online': return 'Online'
      case 'offline': return 'Offline'
      default: return 'Checking'
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${getStatusColor()} ${
        health.status === 'checking' ? 'animate-pulse' : 'animate-pulse'
      }`}></div>
      <span className="text-xs text-gray-400" title={health.message}>
        {getStatusText()}
      </span>
    </div>
  )
}

export default HealthIndicator
