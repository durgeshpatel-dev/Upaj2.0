import React, { useState, useRef, useEffect } from 'react'
import MessageBubble from './MessageBubble'
import EnhancedInputBox from './EnhancedInputBox'
import HealthIndicator from './HealthIndicator'

const EnhancedChatWindow = ({ 
  messages = [], 
  isLoading = false, 
  onSendMessage,
  currentLanguage = 'hi',
  suggestedQuestions = []
}) => {
  const [input, setInput] = useState("")
  const messagesEndRef = useRef(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (!input.trim() || isLoading) return
  console.debug('[UI] handleSendMessage called with:', input)
  onSendMessage(input)
    setInput("")
  }

  return (
    <div className="rounded-lg border border-[#1F2A24] bg-[#111C18] p-4 flex flex-col h-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#1F2A24]">
        <h3 className="text-sm font-medium text-white">Chat Assistant</h3>
        <HealthIndicator />
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-auto pr-2">
        {messages.map((message) => (
          <MessageBubble key={message.id} {...message} />
        ))}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-center gap-2 text-gray-400">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
            <span className="text-xs">AI is typing...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <div className="mt-3 pt-3 border-t border-[#1F2A24]">
        <EnhancedInputBox
          value={input}
          onChange={setInput}
          onSend={handleSendMessage}
          placeholder={currentLanguage === 'hi' 
            ? "अपना कृषि प्रश्न यहां टाइप करें..." 
            : "Type your farming question here..."
          }
          disabled={isLoading}
          suggestedQuestions={suggestedQuestions}
        />
      </div>
    </div>
  )
}

export default EnhancedChatWindow
