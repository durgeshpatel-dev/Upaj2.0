import React from 'react'
import Button from '../Button'

const InputBox = ({ value, onChange, onSend, placeholder, disabled = false }) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !disabled) {
      e.preventDefault()
      onSend()
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        disabled={disabled}
        className={`flex-1 px-3 py-2 border border-[#1F2A24] bg-[#0E1613] text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent placeholder-gray-500 transition-opacity ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      />
      <Button 
        onClick={onSend} 
        disabled={disabled || !value.trim()}
        className={`bg-[#22C55E] text-black hover:bg-[#1FB454] transition-colors ${
          disabled || !value.trim() ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        Send
      </Button>
    </div>
  )
}

export default InputBox
