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

// Get user data for personalization
const getUserContext = () => {
  try {
    const userData = JSON.parse(localStorage.getItem('user') || '{}')
    const farmDetails = userData.farmDetails || {}
    return {
      name: userData.name || 'किसान',
      region: farmDetails.region || farmDetails.location || 'अज्ञात',
      crops: farmDetails.crops || farmDetails.cropList || [],
      soilType: farmDetails.soilType || 'N/A',
      irrigation: farmDetails.irrigation || 'N/A'
    }
  } catch {
    return {
      name: 'किसान',
      region: 'अज्ञात',
      crops: [],
      soilType: 'N/A', 
      irrigation: 'N/A'
    }
  }
}

// Build personalized prompt for Gemini
const buildPersonalizedPrompt = (userMessage, lang = 'hi') => {
  const userContext = getUserContext()
  
  const contextInfo = `
किसान प्रोफाइल / Farmer Profile:
नाम / Name: ${userContext.name}
क्षेत्र / Region: ${userContext.region}
फसलें / Crops: ${userContext.crops.join(', ') || 'N/A'}
मिट्टी / Soil: ${userContext.soilType}
सिंचाई / Irrigation: ${userContext.irrigation}
`

  const languageInstruction = lang === 'hi'
    ? `कृपया हिंदी में जवाब दें। सरल, किसान-अनुकूल शब्दों का उपयोग करें।
    तकनीकी शब्दों के साथ उनका अर्थ भी बताएं।
    हमेशा व्यावहारिक सुझाव दें।`
    : 'Answer in clear English. Use simple, farmer-friendly language. Provide practical advice.'

  return `
आप एक कुशल कृषि सलाहकार हैं / You are a skilled agricultural advisor.
${languageInstruction}

${contextInfo}

किसान का प्रश्न / Farmer's Question:
${userMessage}

कृपया इस प्रारूप में उत्तर दें / Please answer in this format:
${lang === 'hi' 
  ? `1. मुख्य उत्तर
2. करने योग्य कार्य (बुलेट पॉइंट्स में)
3. सावधानियां
4. अगला सुझाव`
  : `1. Main Answer
2. Action Steps (bullet points)  
3. Precautions
4. Next Suggestion`
}
`
}

// Call Gemini API directly
export const getAIResponse = async (userMessage, language = 'hi') => {
  // Check if Gemini API key is available
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
  
  if (!GEMINI_API_KEY) {
    console.warn('Gemini API key not found, using fallback response')
    return getFallbackResponse(userMessage, language)
  }

  try {
    const prompt = buildPersonalizedPrompt(userMessage, language)
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 800,
            topP: 0.8,
            topK: 40
          }
        })
      }
    )

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    const aiResponse = data?.candidates?.[0]?.content?.parts
      ?.map(p => p.text)
      .join('\n')
      ?.trim()

    return aiResponse || getFallbackResponse(userMessage, language)

  } catch (error) {
    console.error('Gemini API error:', error)
    return getFallbackResponse(userMessage, language)
  }
}

// Fallback response when API is unavailable
const getFallbackResponse = (userMessage, language) => {
  const userContext = getUserContext()
  
  const responses = {
    'yield': language === 'hi' 
      ? `${userContext.name} जी, फसल की पैदावार मौसम, मिट्टी और बीज की गुणवत्ता पर निर्भर करती है। आपके ${userContext.region} क्षेत्र के लिए स्थानीय कृषि विभाग से सलाह लें।`
      : `Hello ${userContext.name}, crop yield depends on weather, soil quality, and seed variety. For your ${userContext.region} region, consult local agricultural department.`,
    'weather': language === 'hi'
      ? `मौसम की जानकारी के लिए IMD app या स्थानीय मौसम केंद्र से संपर्क करें। ${userContext.region} क्षेत्र में ${userContext.crops.join(', ')} के लिए मौसम की निगरानी जरूरी है।`
      : `Check IMD app or local weather station for updates. Weather monitoring is crucial for ${userContext.crops.join(', ')} in ${userContext.region}.`,
    'soil': language === 'hi'
      ? `मिट्टी की जांच हर साल कराएं। ${userContext.soilType} मिट्टी के लिए उचित खाद और सिंचाई की व्यवस्था करें।`
      : `Get soil tested annually. For ${userContext.soilType} soil, ensure proper fertilization and irrigation.`,
    'pest': language === 'hi'
      ? `कीट-पतंगों से बचाव के लिए नीम का तेल, जैविक कीटनाशक का उपयोग करें। नियमित फसल निरीक्षण जरूरी है।`
      : `Use neem oil and organic pesticides for pest control. Regular crop inspection is essential.`,
    'irrigation': language === 'hi'
      ? `${userContext.irrigation} सिंचाई प्रणाली के लिए पानी की बचत करें। ड्रिप सिंचाई सबसे अच्छी है।`
      : `Save water with your ${userContext.irrigation} irrigation system. Drip irrigation is most efficient.`,
    'default': language === 'hi'
      ? `नमस्ते ${userContext.name} जी! मैं आपका कृषि सहायक हूं। ${userContext.region} में ${userContext.crops.join(', ')} की खेती के बारे में कोई भी सवाल पूछ सकते हैं।`
      : `Hello ${userContext.name}! I'm your farming assistant. Ask me anything about ${userContext.crops.join(', ')} cultivation in ${userContext.region}.`
  }

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
