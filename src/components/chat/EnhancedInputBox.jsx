import React, { useState } from 'react'
import Button from '../Button'

const EnhancedInputBox = ({ 
  value, 
  onChange, 
  onSend, 
  placeholder, 
  disabled = false,
  suggestedQuestions = [],
  onVoiceToggle = null,
  isListening = false,
  voiceSupported = false,
  currentLanguage = 'en'
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
        <div className="relative flex-1">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full px-3 py-2 border border-[#1F2A24] bg-[#0E1613] text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent placeholder-gray-500 transition-all ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            } ${isListening ? 'ring-2 ring-red-400 border-red-400' : ''} ${voiceSupported ? 'pr-12' : ''}`}
          />
          
          {/* Language indicator for voice input */}
          {voiceSupported && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
              {currentLanguage === 'hi' ? 'हिं' : 'EN'}
            </div>
          )}
        </div>
        
        {/* Voice Input Button */}
        {voiceSupported && onVoiceToggle && (
          <button
            onClick={onVoiceToggle}
            disabled={disabled}
            className={`p-2.5 rounded-md transition-all duration-200 flex items-center justify-center ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg' 
                : 'bg-[#1F2A24] hover:bg-[#2A3A2F] text-gray-300 hover:text-white'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
            title={isListening 
              ? (currentLanguage === 'hi' ? 'बोलना बंद करें' : 'Stop listening') 
              : (currentLanguage === 'hi' ? 'बोलें' : 'Start voice input')
            }
          >
            {isListening ? (
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"/>
                </svg>
                <div className="flex items-end gap-0.5 h-3">
                  <span className="w-0.5 bg-white animate-[bounce_0.6s_linear_infinite]" style={{ height: '4px' }} />
                  <span className="w-0.5 bg-white animate-[bounce_0.6s_linear_infinite]" style={{ height: '8px', animationDelay: '0.1s' }} />
                  <span className="w-0.5 bg-white animate-[bounce_0.6s_linear_infinite]" style={{ height: '12px', animationDelay: '0.2s' }} />
                  <span className="w-0.5 bg-white animate-[bounce_0.6s_linear_infinite]" style={{ height: '8px', animationDelay: '0.3s' }} />
                  <span className="w-0.5 bg-white animate-[bounce_0.6s_linear_infinite]" style={{ height: '4px', animationDelay: '0.4s' }} />
                </div>
              </div>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd"/>
              </svg>
            )}
          </button>
        )}
        
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
