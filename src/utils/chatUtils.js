// Chat utility functions
// Helper functions for chat functionality

export const generateChatId = () => {
  return `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInMs = now - date
  const diffInHours = diffInMs / (1000 * 60 * 60)
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24)

  if (diffInHours < 1) {
    return 'Just now'
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h ago`
  } else if (diffInDays < 7) {
    return `${Math.floor(diffInDays)}d ago`
  } else {
    return date.toLocaleDateString()
  }
}

export const getAIResponse = async (userMessage) => {
  // Simulate AI response based on user input
  const responses = {
    'yield': 'Yield predictions are based on multiple factors including weather patterns, soil conditions, and historical data. The system analyzes these variables to provide accurate forecasts.',
    'weather': 'Weather conditions significantly impact crop growth. Our system monitors temperature, rainfall, humidity, and other meteorological factors to provide farming recommendations.',
    'soil': 'Soil health is crucial for crop success. Key indicators include pH levels, nutrient content, organic matter, and soil structure. Regular testing helps optimize growing conditions.',
    'pest': 'Integrated pest management combines biological, cultural, and chemical control methods. Early detection and prevention are key to maintaining healthy crops.',
    'irrigation': 'Proper irrigation timing and amounts are essential. Our system considers soil moisture, weather forecasts, and crop growth stages to optimize water usage.',
    'default': 'Thank you for your question. I\'m here to help with all your farming and CropWise related queries. Could you provide more details about what you\'d like to know?'
  }

  // Simple keyword matching for demo purposes
  const message = userMessage.toLowerCase()
  let response = responses.default

  for (const [keyword, reply] of Object.entries(responses)) {
    if (keyword !== 'default' && message.includes(keyword)) {
      response = reply
      break
    }
  }

  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(response)
    }, 1000 + Math.random() * 2000) // 1-3 second delay
  })
}

export const saveChatHistory = (chatId, messages) => {
  try {
    const chatHistory = JSON.parse(localStorage.getItem('chatHistory') || '{}')
    chatHistory[chatId] = {
      messages,
      lastUpdated: Date.now(),
      title: generateChatTitle(messages)
    }
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory))
  } catch (error) {
    console.error('Failed to save chat history:', error)
  }
}

export const loadChatHistory = () => {
  try {
    return JSON.parse(localStorage.getItem('chatHistory') || '{}')
  } catch (error) {
    console.error('Failed to load chat history:', error)
    return {}
  }
}

export const generateChatTitle = (messages) => {
  if (messages.length === 0) return 'New Chat'
  
  // Get the first user message to generate title
  const firstUserMessage = messages.find(msg => msg.role === 'user')
  if (!firstUserMessage) return 'New Chat'
  
  const text = firstUserMessage.text
  if (text.length <= 30) return text
  
  return text.substring(0, 30) + '...'
}

export const exportChatHistory = (chatId) => {
  const chatHistory = loadChatHistory()
  const chat = chatHistory[chatId]
  
  if (!chat) return null
  
  const exportData = {
    title: chat.title,
    date: new Date(chat.lastUpdated).toLocaleDateString(),
    messages: chat.messages
  }
  
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const a = document.createElement('a')
  a.href = url
  a.download = `chat_${chat.title.replace(/[^a-z0-9]/gi, '_')}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export default {
  generateChatId,
  formatTimestamp,
  getAIResponse,
  saveChatHistory,
  loadChatHistory,
  generateChatTitle,
  exportChatHistory
}
