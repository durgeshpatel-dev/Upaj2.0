import { useState, useEffect, useCallback } from 'react'
import { 
  generateChatId, 
  getAIResponse, 
  saveChatHistory, 
  loadChatHistory,
  generateChatTitle 
} from '../utils/chatUtils'
import { chatbotAPI } from '../utils/api'

const useChat = (initialChatId = null) => {
  const [currentChatId, setCurrentChatId] = useState(initialChatId || generateChatId())
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [chatHistory, setChatHistory] = useState({})
  const [currentLanguage, setCurrentLanguage] = useState('hi') // Default to Hindi
  const [suggestedQuestions, setSuggestedQuestions] = useState([])

  // Load chat history from backend on mount
  useEffect(() => {
    const loadBackendChatHistory = async () => {
      try {
        const response = await chatbotAPI.getChatHistory()
        if (response.success && response.data) {
          // Transform backend data to match local format
          const backendHistory = {}
          if (response.data.chats && Array.isArray(response.data.chats)) {
            response.data.chats.forEach(chat => {
              backendHistory[chat.id || generateChatId()] = {
                messages: chat.messages || [],
                created: new Date(chat.createdAt).getTime(),
                lastUpdated: new Date(chat.updatedAt).getTime(),
                title: chat.title || generateChatTitle(chat.messages)
              }
            })
          }
          setChatHistory(backendHistory)
        }
      } catch (error) {
        console.error('Failed to load backend chat history:', error)
        // Fallback to local storage
        const localHistory = loadChatHistory()
        setChatHistory(localHistory)
      }
    }

    // Only load once on mount
    loadBackendChatHistory()
  }, []) // Empty dependency array to run only once

  // Load suggested questions
  useEffect(() => {
    const loadSuggestedQuestions = async () => {
      try {
        const response = await chatbotAPI.getSuggestedQuestions()
        if (response.success && response.data?.suggestions) {
          setSuggestedQuestions(response.data.suggestions)
        }
      } catch (error) {
        console.error('Failed to load suggested questions:', error)
        // Set default suggestions based on language
        const defaultSuggestions = currentLanguage === 'hi' ? [
          "मेरी फसल की कैसे देखभाल करूं?",
          "मिट्टी की जांच कैसे करें?",
          "कीटनाशक का उपयोग कब करें?",
          "बारिश के मौसम में क्या सावधानी बरतें?"
        ] : [
          "How to care for my crops?",
          "How to test soil quality?",
          "When to use pesticides?",
          "What precautions during rainy season?"
        ]
        setSuggestedQuestions(defaultSuggestions)
      }
    }

    loadSuggestedQuestions()
  }, [currentLanguage])

  // Initialize chat with welcome message if no initial chat
  useEffect(() => {
    if (initialChatId) {
      // Load specific chat
      const history = loadChatHistory()
      if (history[initialChatId]) {
        setMessages(history[initialChatId].messages)
        return
      }
    }
    
    // Initialize with welcome message in selected language
    const welcomeMessage = currentLanguage === 'hi' 
      ? "नमस्ते! मैं आपका कृषि सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं? 🌾"
      : "Hello! I'm your AI farming assistant. How can I help you today? 🌾"
      
    setMessages([
      { 
        id: generateChatId(), 
        role: "ai", 
        text: welcomeMessage,
        timestamp: Date.now()
      }
    ])
  }, [initialChatId, currentLanguage])

  // Save messages to history whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      saveChatHistory(currentChatId, messages)
      // Don't update chatHistory state here to avoid loops
      // The chatHistory will be updated when needed elsewhere
    }
  }, [messages, currentChatId])

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || isLoading) return

    const userMessage = {
      id: generateChatId(),
      role: "user",
      text: text.trim(),
      timestamp: Date.now()
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Use backend API to ask question
      console.debug('[chat] Sending askQuestion request', { text: text.trim(), currentChatId, currentLanguage })
      const response = await chatbotAPI.askQuestion(text.trim(), {
        language: currentLanguage,
        chatId: currentChatId,
        timestamp: Date.now()
      })

      // Log raw response for debugging
      console.debug('[chat] askQuestion raw response:', response)

      if (response && response.success) {
        const respData = response.data || {}

        // Helper to find a string value in nested objects
        const findStringInObject = (obj, seen = new Set()) => {
          if (!obj || seen.has(obj)) return null
          if (typeof obj === 'string') return obj
          if (typeof obj !== 'object') return null
          seen.add(obj)

          // Common keys to try first
          const candidates = ['answer', 'response', 'message', 'text', 'data', 'reply', 'result']
          for (const k of candidates) {
            if (Object.prototype.hasOwnProperty.call(obj, k)) {
              const v = obj[k]
              if (typeof v === 'string') return v
              const nested = findStringInObject(v, seen)
              if (nested) return nested
            }
          }

          // Fallback: iterate object properties
          for (const key of Object.keys(obj)) {
            const v = obj[key]
            if (typeof v === 'string') return v
            const nested = findStringInObject(v, seen)
            if (nested) return nested
          }

          return null
        }

        const detected = findStringInObject(respData)
        console.debug('[chat] Detected string in response:', detected)

        let aiText = detected

        if (!aiText) {
          // If response contains no simple string, safely stringify it for display
          try {
            aiText = JSON.stringify(respData, null, 2)
            console.warn('[chat] Response had no string fields; using JSON stringified fallback')
          } catch (stringifyError) {
            aiText = String(respData)
            console.warn('[chat] Failed to JSON.stringify response; using String() fallback')
          }
        }

        const aiMessage = {
          id: generateChatId(),
          role: "ai",
          text: aiText,
          timestamp: Date.now()
        }

        console.debug('[chat] Appending AI message to messages state:', aiMessage)
        setMessages(prev => [...prev, aiMessage])
      } else {
        console.error('[chat] askQuestion returned unsuccessful result', response)
        throw new Error(response?.error || 'Failed to get AI response')
      }
    } catch (error) {
      console.error('Chat error:', error)
      
      // Fallback to local AI response if backend fails
      try {
        const aiResponseText = await getAIResponse(text.trim(), currentLanguage)
        const aiMessage = {
          id: generateChatId(),
          role: "ai",
          text: aiResponseText,
          timestamp: Date.now()
        }
        console.debug('[chat] Fallback AI message appended:', aiMessage)
        setMessages(prev => [...prev, aiMessage])
      } catch (fallbackError) {
        const errorMessage = currentLanguage === 'hi' 
          ? "माफ करें, मुझे तकनीकी समस्या का सामना करना पड़ रहा है। कृपया फिर से कोशिश करें।"
          : "I apologize, but I'm experiencing some technical difficulties. Please try again in a moment."
          
        const errorMessageObj = {
          id: generateChatId(),
          role: "ai",
          text: errorMessage,
          timestamp: Date.now()
        }
        console.debug('[chat] Error message appended to messages:', errorMessageObj)
        setMessages(prev => [...prev, errorMessageObj])
      }
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, currentLanguage, currentChatId])

  const startNewChat = useCallback(() => {
    const newChatId = generateChatId()
    setCurrentChatId(newChatId)
    
    const welcomeMessage = currentLanguage === 'hi' 
      ? "नमस्ते! मैं आपका कृषि सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं? 🌾"
      : "Hello! I'm your AI farming assistant. How can I help you today? 🌾"
    
    setMessages([
      { 
        id: generateChatId(), 
        role: "ai", 
        text: welcomeMessage,
        timestamp: Date.now()
      }
    ])
    
    // Update chat history state
    const history = loadChatHistory()
    setChatHistory(history)
  }, [currentLanguage])

  const loadChat = useCallback((chatId) => {
    const history = loadChatHistory()
    if (history[chatId]) {
      setCurrentChatId(chatId)
      setMessages(history[chatId].messages)
      setChatHistory(history) // Update chat history state
    }
  }, [])

  const deleteChat = useCallback((chatId) => {
    const history = loadChatHistory()
    delete history[chatId]
    localStorage.setItem('chatHistory', JSON.stringify(history))
    setChatHistory(history)
    
    if (chatId === currentChatId) {
      startNewChat()
    }
  }, [currentChatId, startNewChat])

  const clearAllChats = useCallback(async () => {
    try {
      const response = await chatbotAPI.clearChatHistory()
      if (response.success) {
        // Clear local storage as well
        localStorage.removeItem('chatHistory')
        setChatHistory({})
        startNewChat()
      } else {
        throw new Error(response.error)
      }
    } catch (error) {
      console.error('Failed to clear chat history:', error)
      // Fallback to local clear
      localStorage.removeItem('chatHistory')
      setChatHistory({})
      startNewChat()
    }
  }, [startNewChat])

  return {
    currentChatId,
    messages,
    isLoading,
    chatHistory,
    currentLanguage,
    setCurrentLanguage,
    suggestedQuestions,
    sendMessage,
    startNewChat,
    loadChat,
    deleteChat,
    clearAllChats
  }
}

export default useChat
