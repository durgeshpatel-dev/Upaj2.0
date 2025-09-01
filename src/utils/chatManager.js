// Chat Management Functions
// Advanced utilities for managing chat functionality

import { 
  generateChatId, 
  saveChatHistory, 
  loadChatHistory 
} from './chatUtils'

/**
 * Chat Manager Class for advanced chat operations
 */
export class ChatManager {
  constructor() {
    this.listeners = []
    this.currentUser = 'user'
  }

  // Subscribe to chat events
  subscribe(callback) {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback)
    }
  }

  // Notify all listeners
  notify(event, data) {
    this.listeners.forEach(listener => listener(event, data))
  }

  // Create a new chat session
  createChatSession(initialMessage = null) {
    const chatId = generateChatId()
    const session = {
      id: chatId,
      messages: initialMessage ? [initialMessage] : [],
      created: Date.now(),
      lastUpdated: Date.now(),
      metadata: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    }

    this.notify('chat_created', session)
    return session
  }

  // Add message to chat
  addMessage(chatId, message) {
    const chatHistory = loadChatHistory()
    if (chatHistory[chatId]) {
      const newMessage = {
        ...message,
        id: message.id || generateChatId(),
        timestamp: message.timestamp || Date.now()
      }

      chatHistory[chatId].messages.push(newMessage)
      chatHistory[chatId].lastUpdated = Date.now()
      
      saveChatHistory(chatId, chatHistory[chatId].messages)
      this.notify('message_added', { chatId, message: newMessage })
      
      return newMessage
    }
    return null
  }

  // Get chat analytics
  getChatAnalytics(chatId = null) {
    const chatHistory = loadChatHistory()
    
    if (chatId && chatHistory[chatId]) {
      const chat = chatHistory[chatId]
      return this.analyzeSingleChat(chat)
    }

    return this.analyzeAllChats(chatHistory)
  }

  analyzeSingleChat(chat) {
    const messages = chat.messages || []
    const userMessages = messages.filter(msg => msg.role === 'user')
    const aiMessages = messages.filter(msg => msg.role === 'ai')
    
    const avgResponseTime = this.calculateAverageResponseTime(messages)
    const wordCount = this.calculateWordCount(messages)
    
    return {
      totalMessages: messages.length,
      userMessages: userMessages.length,
      aiMessages: aiMessages.length,
      avgResponseTime,
      wordCount,
      duration: this.calculateChatDuration(messages),
      topics: this.extractTopics(userMessages)
    }
  }

  analyzeAllChats(chatHistory) {
    const chats = Object.values(chatHistory)
    const totalChats = chats.length
    const totalMessages = chats.reduce((sum, chat) => sum + (chat.messages?.length || 0), 0)
    
    const mostActiveDay = this.findMostActiveDay(chats)
    const avgMessagesPerChat = totalChats > 0 ? totalMessages / totalChats : 0
    
    return {
      totalChats,
      totalMessages,
      avgMessagesPerChat: Math.round(avgMessagesPerChat * 100) / 100,
      mostActiveDay,
      oldestChat: this.findOldestChat(chats),
      newestChat: this.findNewestChat(chats)
    }
  }

  calculateAverageResponseTime(messages) {
    const responseTimes = []
    
    for (let i = 1; i < messages.length; i++) {
      const prevMsg = messages[i - 1]
      const currMsg = messages[i]
      
      if (prevMsg.role === 'user' && currMsg.role === 'ai') {
        responseTimes.push(currMsg.timestamp - prevMsg.timestamp)
      }
    }
    
    if (responseTimes.length === 0) return 0
    
    const avgMs = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
    return Math.round(avgMs / 1000) // Convert to seconds
  }

  calculateWordCount(messages) {
    return messages.reduce((total, msg) => {
      return total + (msg.text?.split(' ').length || 0)
    }, 0)
  }

  calculateChatDuration(messages) {
    if (messages.length < 2) return 0
    
    const firstMsg = messages[0]
    const lastMsg = messages[messages.length - 1]
    
    return lastMsg.timestamp - firstMsg.timestamp
  }

  extractTopics(userMessages) {
    const topicKeywords = {
      'yield': ['yield', 'production', 'harvest', 'output'],
      'weather': ['weather', 'rain', 'temperature', 'climate', 'drought'],
      'soil': ['soil', 'earth', 'ground', 'pH', 'nutrients'],
      'pest': ['pest', 'insect', 'bug', 'disease', 'fungus'],
      'irrigation': ['water', 'irrigation', 'watering', 'moisture'],
      'fertilizer': ['fertilizer', 'nutrients', 'nitrogen', 'phosphorus'],
      'planting': ['plant', 'seed', 'sow', 'grow', 'cultivation']
    }

    const topicCounts = {}
    
    userMessages.forEach(msg => {
      const text = msg.text?.toLowerCase() || ''
      
      Object.entries(topicKeywords).forEach(([topic, keywords]) => {
        const found = keywords.some(keyword => text.includes(keyword))
        if (found) {
          topicCounts[topic] = (topicCounts[topic] || 0) + 1
        }
      })
    })

    return Object.entries(topicCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5) // Top 5 topics
      .map(([topic, count]) => ({ topic, count }))
  }

  findMostActiveDay(chats) {
    const dayCounts = {}
    
    chats.forEach(chat => {
      if (chat.lastUpdated) {
        const day = new Date(chat.lastUpdated).toLocaleDateString()
        dayCounts[day] = (dayCounts[day] || 0) + 1
      }
    })

    return Object.entries(dayCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || null
  }

  findOldestChat(chats) {
    return chats.reduce((oldest, chat) => {
      if (!oldest || (chat.created && chat.created < oldest.created)) {
        return chat
      }
      return oldest
    }, null)
  }

  findNewestChat(chats) {
    return chats.reduce((newest, chat) => {
      if (!newest || (chat.lastUpdated && chat.lastUpdated > newest.lastUpdated)) {
        return chat
      }
      return newest
    }, null)
  }

  // Export chat data in various formats
  exportToJSON(chatId) {
    const chatHistory = loadChatHistory()
    const chat = chatHistory[chatId]
    
    if (!chat) return null

    return {
      id: chatId,
      ...chat,
      exportedAt: new Date().toISOString(),
      analytics: this.analyzeSingleChat(chat)
    }
  }

  exportToMarkdown(chatId) {
    const chatHistory = loadChatHistory()
    const chat = chatHistory[chatId]
    
    if (!chat) return null

    let markdown = `# Chat Export: ${chat.title}\n\n`
    markdown += `**Created:** ${new Date(chat.created || Date.now()).toLocaleString()}\n`
    markdown += `**Last Updated:** ${new Date(chat.lastUpdated).toLocaleString()}\n\n`
    markdown += `---\n\n`

    chat.messages?.forEach((msg, index) => {
      const role = msg.role === 'ai' ? '🤖 **AI Assistant**' : '👤 **User**'
      const timestamp = new Date(msg.timestamp).toLocaleTimeString()
      
      markdown += `### ${role} *(${timestamp})*\n\n`
      markdown += `${msg.text}\n\n`
    })

    return markdown
  }

  // Clean up old chats
  cleanupOldChats(daysOld = 30) {
    const chatHistory = loadChatHistory()
    const cutoffDate = Date.now() - (daysOld * 24 * 60 * 60 * 1000)
    
    let deletedCount = 0
    
    Object.entries(chatHistory).forEach(([chatId, chat]) => {
      if (chat.lastUpdated < cutoffDate) {
        delete chatHistory[chatId]
        deletedCount++
      }
    })

    if (deletedCount > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(chatHistory))
      this.notify('chats_cleaned', { deletedCount })
    }

    return deletedCount
  }
}

// Create singleton instance
export const chatManager = new ChatManager()

// Utility functions for quick access
export const createNewChatSession = (initialMessage) => 
  chatManager.createChatSession(initialMessage)

export const addMessageToChat = (chatId, message) => 
  chatManager.addMessage(chatId, message)

export const getChatAnalytics = (chatId) => 
  chatManager.getChatAnalytics(chatId)

export const exportChatToJSON = (chatId) => 
  chatManager.exportToJSON(chatId)

export const exportChatToMarkdown = (chatId) => 
  chatManager.exportToMarkdown(chatId)

export const cleanupOldChats = (daysOld) => 
  chatManager.cleanupOldChats(daysOld)

export default chatManager
