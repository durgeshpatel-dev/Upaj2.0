import React, { useState, useRef, useEffect } from 'react';
import Button from '../Button';

const InputBox = ({ value, onChange, onSend, placeholder, disabled = false }) => {
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState('en-US'); // 'en-US' for English, 'hi-IN' for Hindi
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      console.error('Web Speech API is not supported in this browser.');
      return;
    }

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onChange(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, [onChange]);

  const startVoiceRecognition = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.lang = language;
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const toggleLanguage = () => {
    setLanguage(prevLang => prevLang === 'en-US' ? 'hi-IN' : 'en-US');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !disabled) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button 
        onClick={toggleLanguage} 
        disabled={disabled || isListening}
        className="bg-gray-600 text-white hover:bg-gray-500 transition-colors px-3 py-2 rounded-md"
      >
        {language === 'en-US' ? 'EN' : 'HI'}
      </Button>
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
        onClick={startVoiceRecognition} 
        disabled={disabled || isListening}
        className={`bg-[#22C55E] text-black hover:bg-[#1FB454] transition-colors ${
          disabled || isListening ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isListening ? '...' : '🎤'}
      </Button>
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
  );
};

export default InputBox;