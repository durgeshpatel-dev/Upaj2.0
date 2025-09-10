import React, { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import EnhancedInputBox from './EnhancedInputBox';
import HealthIndicator from './HealthIndicator';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const EnhancedChatWindow = ({
  messages = [],
  isLoading = false,
  onSendMessage,
  currentLanguage = 'hi',
  suggestedQuestions = [],
}) => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speakResponses, setSpeakResponses] = useState(true);
  const [ttsStatus, setTtsStatus] = useState('idle');
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const recognitionRef = useRef(null);
  const recognitionActiveRef = useRef(false);
  const baseBeforeSpeechRef = useRef('');
  const voicesRef = useRef([]);
  const messagesEndRef = useRef(null);

  // Scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize SpeechRecognition
  useEffect(() => {
    if (!SpeechRecognition) {
      setErrorMessage('Speech recognition is not supported in this browser.');
      return;
    }

    const r = new SpeechRecognition();
    r.interimResults = true;
    r.maxAlternatives = 1;
    r.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';

    r.onstart = () => {
      recognitionActiveRef.current = true;
      setIsListening(true);
      setErrorMessage('');
      console.log('Voice-to-text: Recognition started (lang=', r.lang, ')');
    };

    r.onresult = (event) => {
      try {
        let final = '';
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) {
            final = res[0].transcript.trim();
          } else {
            interim = res[0].transcript.trim();
          }
        }

        const base = baseBeforeSpeechRef.current || '';
        const newInput = final || interim;
        const combined = base && base.trim() ? `${base} ${newInput}` : newInput;
        setInput(combined);

        if (final) {
          baseBeforeSpeechRef.current = combined;
          console.log('Voice-to-text: Final:', final);
        } else if (interim) {
          console.log('Voice-to-text: Interim:', interim);
        }
      } catch (e) {
        console.error('Error handling recognition result:', e);
        setErrorMessage('Error processing speech input.');
      }
    };

    r.onend = () => {
      recognitionActiveRef.current = false;
      setIsListening(false);
      console.log('Voice-to-text: Recognition ended');
    };

    r.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      recognitionActiveRef.current = false;
      setIsListening(false);
      setErrorMessage(`Speech recognition error: ${event.error}`);
    };

    recognitionRef.current = r;

    return () => {
      try {
        r.stop();
        r.onresult = null;
        r.onend = null;
        r.onerror = null;
        r.onstart = null;
      } catch (e) {}
      recognitionRef.current = null;
      recognitionActiveRef.current = false;
    };
  }, [currentLanguage]);

  // Start/stop speech recognition
  const handleListen = () => {
    const r = recognitionRef.current;
    if (!r) {
      setErrorMessage('Speech recognition is not supported.');
      return;
    }

    if (recognitionActiveRef.current) {
      try {
        r.stop();
      } catch (e) {
        console.warn('Failed to stop recognition:', e);
        setErrorMessage('Failed to stop speech recognition.');
      }
      return;
    }

    baseBeforeSpeechRef.current = input || '';
    try {
      r.start();
    } catch (err) {
      console.error('Voice-to-text: Failed to start recognition:', err);
      setErrorMessage('Failed to start speech recognition.');
    }
  };

  // TTS initialization
  const voicesLoad = () => {
    const voices = speechSynthesis.getVoices() || [];
    voicesRef.current = voices;
    console.log('TTS: Voices loaded', voices.length, 'voices available');
    
    if (!voices.length) {
      setTtsStatus('no-voices');
      console.warn('TTS: No voices available');
    } else {
      setTtsStatus('ready');
      console.log('TTS: Voices ready', voices.map(v => `${v.name} (${v.lang})`));
    }
  };

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      console.error('TTS: speechSynthesis not supported');
      setTtsStatus('unsupported');
      setErrorMessage('Text-to-speech is not supported in this browser.');
      return;
    }

    console.log('TTS: Initializing speechSynthesis');
    
    // Load voices immediately
    voicesLoad();
    
    // Also listen for voices changed event (some browsers need this)
    const handleVoicesChanged = () => {
      console.log('TTS: Voices changed event triggered');
      voicesLoad();
    };
    
    window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
    
    // Retry voice loading after a delay (Chrome sometimes needs this)
    setTimeout(voicesLoad, 100);
    
    return () => {
      try {
        window.speechSynthesis.onvoiceschanged = null;
      } catch (e) {
        console.warn('TTS: Error clearing voices changed handler', e);
      }
    };
  }, []);

  const enableTTS = () => {
    console.log('TTS: enableTTS() called');
    
    if (!('speechSynthesis' in window)) {
      console.error('TTS: speechSynthesis not supported');
      setTtsStatus('unsupported');
      setErrorMessage('Text-to-speech is not supported.');
      return;
    }

    try {
      console.log('TTS: Attempting to enable via user gesture');
      
      // Cancel any existing speech first
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
      
      // Create a silent utterance to trigger permission
      const utter = new SpeechSynthesisUtterance(' '); // Single space instead of empty string
      utter.volume = 0.01; // Very low volume instead of 0
      utter.rate = 10; // Fast rate to complete quickly
      
      utter.onstart = () => {
        console.log('TTS: Permission utterance started');
      };
      
      utter.onend = () => {
        console.log('TTS: Permission utterance ended - TTS should now be enabled');
        setTtsEnabled(true);
        setTtsStatus('enabled');
        voicesLoad(); // Reload voices after enabling
        setErrorMessage(''); // Clear any previous errors
      };
      
      utter.onerror = (e) => {
        console.error('TTS: Failed to enable:', e);
        setTtsStatus('error');
        setErrorMessage(`Failed to enable text-to-speech: ${e.error}`);
      };
      
      console.log('TTS: Speaking permission utterance');
      speechSynthesis.speak(utter);
      
    } catch (e) {
      console.error('TTS: enableTTS() exception:', e);
      setTtsStatus('error');
      setErrorMessage(`Failed to enable text-to-speech: ${e.message}`);
    }
  };

  const speak = (text) => {
    console.log('TTS: speak() called', { speakResponses, ttsEnabled, hasText: !!text });
    
    if (!speakResponses || !ttsEnabled || !text) {
      console.log('TTS: Skipping speech - conditions not met');
      return;
    }

    try {
      // Cancel any ongoing speech
      if (speechSynthesis.speaking) {
        console.log('TTS: Cancelling ongoing speech');
        speechSynthesis.cancel();
      }

      // Wait a bit for cancellation to complete
      setTimeout(() => {
        try {
          const utter = new SpeechSynthesisUtterance(text);
          utter.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
          utter.rate = 0.9;
          utter.volume = 0.8;

          console.log('TTS: Creating utterance', { text: text.substring(0, 50) + '...', lang: utter.lang });

          // Get fresh voices list
          const voices = speechSynthesis.getVoices() || voicesRef.current;
          console.log('TTS: Available voices count:', voices.length);
          
          const matchingVoices = voices.filter((v) =>
            v.lang.toLowerCase().includes(utter.lang.toLowerCase())
          );

          console.log('TTS: Matching voices for', utter.lang, ':', matchingVoices.length);

          if (matchingVoices.length > 0) {
            const preferredVoice = matchingVoices.find((v) =>
              v.name.toLowerCase().includes('google') || 
              v.name.toLowerCase().includes('native') ||
              v.name.toLowerCase().includes('microsoft')
            ) || matchingVoices[0];

            utter.voice = preferredVoice;
            console.log('TTS: Using voice:', preferredVoice.name, preferredVoice.lang);
          } else {
            console.warn('TTS: No matching voices found, using default');
          }

          utter.onstart = () => {
            console.log('TTS: Speech started');
            setTtsStatus('playing');
          };
          
          utter.onend = () => {
            console.log('TTS: Speech ended');
            setTtsStatus('ready');
          };
          
          utter.onerror = (e) => {
            console.error('TTS: Speech error:', e);
            setTtsStatus('error');
            setErrorMessage(`Text-to-speech failed: ${e.error}`);
          };

          console.log('TTS: Starting speech synthesis');
          speechSynthesis.speak(utter);
          
        } catch (innerError) {
          console.error('TTS: Error creating/starting utterance:', innerError);
          setTtsStatus('error');
          setErrorMessage('Text-to-speech failed to start.');
        }
      }, 100);

    } catch (e) {
      console.error('TTS: speak() failed:', e);
      setTtsStatus('error');
      setErrorMessage('Text-to-speech failed.');
    }
  };

  // Auto-speak last AI message when added
  useEffect(() => {
    if (messages.length === 0 || !ttsEnabled || !speakResponses) {
      console.log('TTS: Skipping auto-speak', { 
        messagesLength: messages.length, 
        ttsEnabled, 
        speakResponses 
      });
      return;
    }

    const lastMessage = messages[messages.length - 1];
    console.log('TTS: Checking last message', { lastMessage, sender: lastMessage?.role });
    
    // Fix: Check for both 'AI' and 'ai' role values
    if (lastMessage && (lastMessage.sender === 'AI' || lastMessage.role === 'ai')) {
      console.log('TTS: Auto-speaking AI message:', lastMessage.text);
      // Add a small delay to ensure the message is rendered
      setTimeout(() => speak(lastMessage.text), 100);
    }
  }, [messages, speakResponses, ttsEnabled]);

  const handleSendMessage = () => {
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput('');
    baseBeforeSpeechRef.current = '';
  };

  const handlePlayLastReply = () => {
    console.log('TTS: handlePlayLastReply() called', { ttsEnabled });
    
    if (!ttsEnabled) {
      console.log('TTS: TTS not enabled, calling enableTTS()');
      enableTTS();
      return;
    }

    const last = messages[messages.length - 1];
    console.log('TTS: Last message:', { 
      exists: !!last, 
      sender: last?.sender, 
      role: last?.role,
      text: last?.text?.substring(0, 50) + '...'
    });
    
    // Fix: Check for both 'AI' and 'ai' role values
    if (last && (last.sender === 'AI' || last.role === 'ai')) {
      console.log('TTS: Speaking last AI message');
      speak(last.text);
    } else {
      console.log('TTS: No AI message to speak');
      setErrorMessage('No AI message found to speak');
    }
  };

  return (
    <div className="rounded-lg border border-[#1F2A24] bg-[#111C18] p-4 flex flex-col h-[600px]">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#1F2A24]">
        <h3 className="text-sm font-medium text-white">Chat Assistant</h3>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={speakResponses}
              onChange={(e) => setSpeakResponses(e.target.checked)}
            />
            Auto-speak
          </label>

          {!ttsEnabled ? (
            <button
              className="text-sm text-blue-400 underline hover:text-blue-300"
              onClick={enableTTS}
              title="Click to enable text-to-speech functionality"
            >
              Enable TTS
            </button>
          ) : (
            <button
              className="text-sm text-green-400 underline hover:text-green-300"
              onClick={handlePlayLastReply}
              title="Play the last AI response"
            >
              🔊 Play last reply
            </button>
          )}

          <div className={`text-xs ${
            ttsStatus === 'playing' ? 'text-green-400' :
            ttsStatus === 'error' ? 'text-red-400' :
            ttsStatus === 'enabled' ? 'text-green-400' :
            'text-gray-400'
          }`}>
            TTS: {ttsStatus}
            {ttsStatus === 'playing' && ' 🔊'}
          </div>
          
          {/* Debug button */}
          <button
            className="text-xs text-purple-400 underline"
            onClick={() => {
              console.log('=== TTS DEBUG INFO ===');
              console.log('speechSynthesis support:', 'speechSynthesis' in window);
              console.log('speechSynthesis.speaking:', speechSynthesis?.speaking);
              console.log('ttsEnabled:', ttsEnabled);
              console.log('speakResponses:', speakResponses);
              console.log('ttsStatus:', ttsStatus);
              console.log('voices count:', speechSynthesis?.getVoices?.()?.length || 0);
              console.log('messages count:', messages.length);
              console.log('last message:', messages[messages.length - 1]);
              console.log('=====================');
            }}
            title="Log TTS debug info to console"
          >
            Debug TTS
          </button>
          <HealthIndicator />
        </div>
      </div>

      {errorMessage && (
        <div className="text-sm text-red-400 mb-2">{errorMessage}</div>
      )}

      <div className="flex-1 space-y-3 overflow-auto pr-2">
        {messages.map((message) => (
          <MessageBubble key={message.id} {...message} />
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-gray-400">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-xs">AI is typing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="mt-3 pt-3 border-t border-[#1F2A24]">
        <EnhancedInputBox
          value={input}
          onChange={setInput}
          onSend={handleSendMessage}
          placeholder={
            currentLanguage === 'hi'
              ? 'अपना कृषि प्रश्न यहां टाइप करें...'
              : 'Type your farming question here...'
          }
          disabled={isLoading}
          suggestedQuestions={suggestedQuestions}
        />

        {SpeechRecognition && (
          <div className="mt-2 flex items-center gap-3">
            <button
              onClick={handleListen}
              className="px-4 py-2 bg-[#22C55E] text-black rounded-md hover:bg-[#1FB454] transition-colors"
            >
              {isListening ? 'Stop Listening' : 'Start Listening'}
            </button>

            {isListening && (
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                <div className="flex items-end gap-1 h-4">
                  <span className="w-1 bg-green-400 animate-[bounce_0.6s_linear_infinite]" style={{ height: '6px' }} />
                  <span className="w-1 bg-green-400 animate-[bounce_0.6s_linear_infinite]" style={{ height: '10px', animationDelay: '0.1s' }} />
                  <span className="w-1 bg-green-400 animate-[bounce_0.6s_linear_infinite]" style={{ height: '14px', animationDelay: '0.2s' }} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedChatWindow;
