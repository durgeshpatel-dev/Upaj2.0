import React, { useState } from 'react'
import Button from '../Button'

const EnhancedInputBox = ({ 
  value, 
  onChange, 
  onSend, 
  placeholder, 
  disabled = false,
  suggestedQuestions = []
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false)

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !disabled) {
      e.preventDefault()
      onSend()
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion)
    setShowSuggestions(false)
  }

  const handleInputFocus = () => {
    if (suggestedQuestions.length > 0 && !value.trim()) {
      setShowSuggestions(true)
    }
  }

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicks
    setTimeout(() => setShowSuggestions(false), 200)
  }

  const handleSend = () => {
    onSend()
    setShowSuggestions(false)
  }

  return (
    <div className="relative">
      {/* Input field */}
      <div className="flex items-center gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`flex-1 px-3 py-2 border border-[#1F2A24] bg-[#0E1613] text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent placeholder-gray-500 transition-opacity ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        />
        <Button 
          onClick={handleSend} 
          disabled={disabled || !value.trim()}
          className={`bg-[#22C55E] text-black hover:bg-[#1FB454] transition-colors ${
            disabled || !value.trim() ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Send
        </Button>
      </div>

      {/* Suggested questions */}
      {showSuggestions && suggestedQuestions.length > 0 && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-[#111C18] border border-[#1F2A24] rounded-lg shadow-lg max-h-40 overflow-y-auto z-10">
          <div className="p-2">
            <p className="text-xs text-gray-400 mb-2">Suggested questions:</p>
            <div className="space-y-1">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(question)}
                  className="w-full text-left px-2 py-1 text-sm text-gray-300 hover:bg-[#1F2A24] rounded transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EnhancedInputBox
