import { useState, useEffect, useCallback } from 'react'
import { 
  generateChatId, 
  getAIResponse, 
  saveChatHistory, 
  loadChatHistory,
  generateChatTitle 
} from '../utils/chatUtils'

const useChat = (initialChatId = null) => {
  const [currentChatId, setCurrentChatId] = useState(initialChatId || generateChatId())
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [chatHistory, setChatHistory] = useState({})

  // Load chat history on mount
  useEffect(() => {
    const history = loadChatHistory()
    setChatHistory(history)
    
    if (initialChatId && history[initialChatId]) {
      setMessages(history[initialChatId].messages)
    } else {
      // Initialize with welcome message
      setMessages([
        { 
          id: generateChatId(), 
          role: "ai", 
          text: "Hi there! I'm your AI farming assistant. How can I help you today?",
          timestamp: Date.now()
        }
      ])
    }
  }, [initialChatId])

  // Save messages to history whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      saveChatHistory(currentChatId, messages)
      
      // Update local chat history state
      const updatedHistory = loadChatHistory()
      setChatHistory(updatedHistory)
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
      const aiResponseText = await getAIResponse(text)
      const aiMessage = {
        id: generateChatId(),
        role: "ai",
        text: aiResponseText,
        timestamp: Date.now()
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      const errorMessage = {
        id: generateChatId(),
        role: "ai",
        text: "I apologize, but I'm experiencing some technical difficulties. Please try again in a moment.",
        timestamp: Date.now()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }, [isLoading])

  const startNewChat = useCallback(() => {
    const newChatId = generateChatId()
    setCurrentChatId(newChatId)
    setMessages([
      { 
        id: generateChatId(), 
        role: "ai", 
        text: "Hi there! I'm your AI farming assistant. How can I help you today?",
        timestamp: Date.now()
      }
    ])
  }, [])

  const loadChat = useCallback((chatId) => {
    const history = loadChatHistory()
    if (history[chatId]) {
      setCurrentChatId(chatId)
      setMessages(history[chatId].messages)
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

  const clearAllChats = useCallback(() => {
    localStorage.removeItem('chatHistory')
    setChatHistory({})
    startNewChat()
  }, [startNewChat])

  return {
    currentChatId,
    messages,
    isLoading,
    chatHistory,
    sendMessage,
    startNewChat,
    loadChat,
    deleteChat,
    clearAllChats
  }
}

export default useChat
