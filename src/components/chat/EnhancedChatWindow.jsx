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
    r.continuous = false; // Better for command-based input
    r.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';

    // Enhanced language support for Hindi
    if (currentLanguage === 'hi') {
      // Try different Hindi language codes for better compatibility
      const hindiLangCodes = ['hi-IN', 'hi', 'en-IN']; // Fallback to English-India if Hindi not available
      let selectedLang = 'hi-IN';

      // Check if the selected language is supported
      try {
        r.lang = selectedLang;
      } catch (e) {
        console.warn('Hindi language not supported, trying alternatives');
        for (const langCode of hindiLangCodes.slice(1)) {
          try {
            r.lang = langCode;
            selectedLang = langCode;
            console.log('Using fallback language:', langCode);
            break;
          } catch (fallbackError) {
            console.warn('Fallback language', langCode, 'also not supported');
          }
        }
      }

      console.log('Speech recognition initialized with language:', selectedLang);
    }

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
    try {
      const voices = speechSynthesis.getVoices() || [];
      voicesRef.current = voices;
      console.log('TTS: Voices loaded', voices.length, 'voices available');

      if (!voices.length) {
        setTtsStatus('no-voices');
        console.warn('TTS: No voices available - this might be temporary');
        // Don't set error message for no voices, as this is often temporary
        return;
      }

      // Log available voices for debugging
      console.log('TTS: Available voices:');
      voices.forEach((voice, index) => {
        console.log(`  ${index}: ${voice.name} (${voice.lang}) - ${voice.voiceURI}`);
      });

      // Check for Hindi voice support
      const hindiVoices = voices.filter(v =>
        v.lang.startsWith('hi') ||
        v.name.toLowerCase().includes('hindi') ||
        v.name.toLowerCase().includes('india')
      );

      console.log('TTS: Hindi voices found:', hindiVoices.length);
      hindiVoices.forEach(voice => {
        console.log(`  Hindi: ${voice.name} (${voice.lang})`);
      });

      // If we have voices but TTS is not enabled yet, set status to ready
      if (voices.length > 0 && ttsStatus !== 'enabled') {
        setTtsStatus('ready');
      }

      console.log('TTS: Voices ready');
    } catch (e) {
      console.error('TTS: Error loading voices:', e);
      setTtsStatus('error');
      setErrorMessage('Failed to load text-to-speech voices.');
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
      setErrorMessage(currentLanguage === 'hi' ? 
        'इस ब्राउज़र में टेक्स्ट-टू-स्पीच समर्थित नहीं है।' : 
        'Text-to-speech is not supported in this browser.');
      return;
    }

    try {
      console.log('TTS: Attempting to enable via user gesture');

      // More robust cancellation
      const ensureCleanState = () => {
        return new Promise((resolve) => {
          if (!speechSynthesis.speaking && !speechSynthesis.pending) {
            resolve();
            return;
          }

          console.log('TTS: Cancelling any existing speech before enabling');
          speechSynthesis.cancel();
          
          let checks = 0;
          const checkInterval = setInterval(() => {
            checks++;
            if (!speechSynthesis.speaking && !speechSynthesis.pending) {
              clearInterval(checkInterval);
              resolve();
            } else if (checks > 20) { // Max 2 seconds wait
              clearInterval(checkInterval);
              console.warn('TTS: Forced state clear after timeout');
              resolve();
            }
          }, 100);
        });
      };

      // Clean state first, then enable
      ensureCleanState().then(() => {
        try {
          // Create test utterance based on language
          const testTexts = {
            hi: 'टेस्ट',  // Simple test word
            en: 'Test'   // Simple test word
          };
          
          const testText = testTexts[currentLanguage] || testTexts.en;
          const utter = new SpeechSynthesisUtterance(testText);
          
          // Basic settings for test
          utter.volume = 0.01; // Very low volume but not zero
          utter.rate = 1.0;    // Faster to finish quickly
          utter.pitch = 1.0;
          
          // Set language
          if (currentLanguage === 'hi') {
            utter.lang = 'hi-IN';
          } else {
            utter.lang = 'en-US';
          }

          // Try to set an appropriate voice
          const voices = speechSynthesis.getVoices();
          if (voices.length > 0) {
            let testVoice = null;
            
            if (currentLanguage === 'hi') {
              testVoice = voices.find(v => 
                v.lang.startsWith('hi') || 
                v.lang === 'en-IN' ||
                v.name.toLowerCase().includes('hindi')
              );
            } else {
              testVoice = voices.find(v => v.lang.startsWith('en'));
            }
            
            if (testVoice) {
              utter.voice = testVoice;
              console.log('TTS: Using test voice:', testVoice.name, testVoice.lang);
            }
          }

          let enableTimeout = null;
          let hasStarted = false;

          const cleanup = () => {
            if (enableTimeout) {
              clearTimeout(enableTimeout);
              enableTimeout = null;
            }
          };

          utter.onstart = () => {
            cleanup();
            hasStarted = true;
            console.log('TTS: Permission utterance started - TTS enabled successfully');
            setTtsStatus('testing');
          };

          utter.onend = () => {
            cleanup();
            if (hasStarted) {
              console.log('TTS: Permission utterance completed - TTS fully enabled');
              setTtsEnabled(true);
              setTtsStatus('enabled');
              setErrorMessage('');
              
              // Reload voices after successful test
              setTimeout(() => {
                voicesLoad();
              }, 100);
            }
          };

          utter.onerror = (e) => {
            cleanup();
            console.error('TTS: Permission utterance failed:', e.error);

            // Try fallback strategies based on error type
            if (e.error === 'interrupted' && !hasStarted) {
              console.log('TTS: Trying fallback approach for interrupted error');
              
              setTimeout(() => {
                try {
                  const fallbackUtter = new SpeechSynthesisUtterance('test');
                  fallbackUtter.volume = 0.01;
                  fallbackUtter.rate = 3.0; // Very fast
                  fallbackUtter.lang = 'en-US';

                  fallbackUtter.onend = () => {
                    console.log('TTS: Fallback test successful');
                    setTtsEnabled(true);
                    setTtsStatus('enabled');
                    setErrorMessage('');
                  };

                  fallbackUtter.onerror = (fallbackError) => {
                    console.error('TTS: Fallback also failed:', fallbackError.error);
                    setTtsStatus('error');
                    setErrorMessage(currentLanguage === 'hi' ? 
                      `टेक्स्ट-टू-स्पीच सक्षम करने में विफल: ${fallbackError.error || 'अज्ञात त्रुटि'}` :
                      `Failed to enable text-to-speech: ${fallbackError.error || 'Unknown error'}`);
                  };

                  speechSynthesis.speak(fallbackUtter);
                } catch (fallbackException) {
                  console.error('TTS: Fallback exception:', fallbackException);
                  setTtsStatus('error');
                  setErrorMessage(currentLanguage === 'hi' ? 
                    'टेक्स्ट-टू-स्पीच सक्षम करने में विफल। कृपया पुनः प्रयास करें।' :
                    'Failed to enable text-to-speech. Please try again.');
                }
              }, 1000);
              
            } else {
              setTtsStatus('error');
              setErrorMessage(currentLanguage === 'hi' ? 
                `टेक्स्ट-टू-स्पीच सक्षम करने में विफल: ${e.error || 'अज्ञात त्रुटि'}` :
                `Failed to enable text-to-speech: ${e.error || 'Unknown error'}`);
            }
          };

          // Set timeout to detect if TTS never starts
          enableTimeout = setTimeout(() => {
            if (!hasStarted) {
              cleanup();
              console.warn('TTS: Enable attempt timed out - falling back to simple enable');
              
              // Instead of showing error, just enable TTS without the test
              setTtsEnabled(true);
              setTtsStatus('enabled');
              setErrorMessage('');
              console.log('TTS: Enabled via timeout fallback');
            }
          }, 3000); // Shorter timeout

          console.log('TTS: Speaking test utterance to enable TTS');
          setTtsStatus('testing');
          speechSynthesis.speak(utter);

        } catch (innerError) {
          console.error('TTS: Error in enableTTS inner try:', innerError);
          
          // Fallback: just enable TTS without test
          console.log('TTS: Enabling without test due to inner error');
          setTtsEnabled(true);
          setTtsStatus('enabled');
          setErrorMessage('');
        }
      });

    } catch (e) {
      console.error('TTS: enableTTS() exception:', e);
      
      // Ultimate fallback: just enable TTS
      console.log('TTS: Enabling without test due to outer exception');
      setTtsEnabled(true);
      setTtsStatus('enabled');
      setErrorMessage('');
    }
  };

  const speak = (text, retryCount = 0) => {
    console.log('TTS: speak() called', { speakResponses, ttsEnabled, hasText: !!text, retryCount });

    if (!speakResponses || !ttsEnabled || !text?.trim()) {
      console.log('TTS: Skipping speech - conditions not met');
      return;
    }

    // Prevent infinite retries
    if (retryCount > 3) {
      console.error('TTS: Max retries reached, giving up');
      setTtsStatus('error');
      setErrorMessage('Speech failed after multiple attempts. Please try again later.');
      return;
    }

    try {
      // Clean the text for better speech synthesis
      let cleanText = text.trim();
      // Remove excessive whitespace and newlines
      cleanText = cleanText.replace(/\s+/g, ' ');
      // For Hindi, ensure proper sentence endings
      if (currentLanguage === 'hi' && !cleanText.match(/[।\.!?]$/)) {
        cleanText += '।';
      }

      // Split long text into sentences to avoid pausing issues
      const sentences = [];
      if (cleanText.length > 200) {
        // Split on sentence boundaries, supporting Hindi '।' and standard punctuation
        const sentenceRegex = /([^।.!?]+[।.!?])/g;
        let match;
        while ((match = sentenceRegex.exec(cleanText)) !== null) {
          sentences.push(match[1].trim());
        }
        if (sentences.length === 0) {
          sentences.push(cleanText); // Fallback if no matches
        }
      } else {
        sentences.push(cleanText);
      }

      console.log('TTS: Split text into sentences:', sentences.length);

      // More robust cancellation with promise-based approach
      const cancelExistingSpeech = () => {
        return new Promise((resolve) => {
          if (!speechSynthesis.speaking && !speechSynthesis.pending) {
            resolve();
            return;
          }

          console.log('TTS: Cancelling existing speech');
          speechSynthesis.cancel();
          
          // Wait for cancellation with multiple checks
          let checks = 0;
          const checkInterval = setInterval(() => {
            checks++;
            if (!speechSynthesis.speaking && !speechSynthesis.pending) {
              clearInterval(checkInterval);
              resolve();
            } else if (checks > 10) { // Max 1 second wait
              clearInterval(checkInterval);
              console.warn('TTS: Forced cancellation after timeout');
              resolve();
            }
          }, 100);
        });
      };

      // Cancel any existing speech first
      cancelExistingSpeech().then(() => {
        // Function to speak sentences sequentially
        const speakSequential = (index = 0) => {
          if (index >= sentences.length) {
            console.log('TTS: All sentences spoken');
            setTtsStatus('ready');
            return;
          }

          try {
            const sentence = sentences[index];
            const utter = new SpeechSynthesisUtterance(sentence);
            
            // Language-specific settings
            if (currentLanguage === 'hi') {
              utter.lang = 'hi-IN';
              utter.rate = 1.1; // Slightly faster for better flow
              utter.pitch = 1.0;
            } else {
              utter.lang = 'en-US';
              utter.rate = 1.0;
              utter.pitch = 1.0;
            }
            
            utter.volume = 0.8;

            console.log('TTS: Creating utterance for sentence', index + 1, { 
              text: sentence.substring(0, 50) + '...', 
              lang: utter.lang,
              rate: utter.rate,
              retryCount 
            });

            // Enhanced voice selection with better fallbacks
            const voices = speechSynthesis.getVoices() || voicesRef.current;
            console.log('TTS: Available voices count:', voices.length);

            let selectedVoice = null;

            if (currentLanguage === 'hi') {
              // More comprehensive Hindi voice selection
              const hindiVoiceSelectors = [
                // Exact matches first
                (v) => v.lang === 'hi-IN' && v.name.toLowerCase().includes('google'),
                (v) => v.lang === 'hi-IN' && v.name.toLowerCase().includes('microsoft'),
                (v) => v.lang === 'hi-IN',
                // Broader matches
                (v) => v.lang.startsWith('hi-') && !v.name.toLowerCase().includes('en'),
                (v) => v.lang === 'hi',
                (v) => v.name.toLowerCase().includes('hindi'),
                (v) => v.name.toLowerCase().includes('devanagari'),
                // Regional fallbacks
                (v) => v.lang === 'en-IN' && v.name.toLowerCase().includes('india'),
                (v) => v.lang.startsWith('en') && v.name.toLowerCase().includes('indian'),
                // Last resort - any Google/Microsoft voice that might support Hindi
                (v) => (v.name.toLowerCase().includes('google') || v.name.toLowerCase().includes('microsoft')) && !v.lang.includes('zh') && !v.lang.includes('ja')
              ];

              for (const selector of hindiVoiceSelectors) {
                selectedVoice = voices.find(selector);
                if (selectedVoice) {
                  console.log('TTS: Selected Hindi voice:', selectedVoice.name, selectedVoice.lang);
                  break;
                }
              }

              if (!selectedVoice) {
                console.warn('TTS: No suitable Hindi voice found. Falling back to en-IN.');
                utter.lang = 'en-IN';
                setErrorMessage(currentLanguage === 'hi' ? 
                  'हिंदी आवाज उपलब्ध नहीं है। अंग्रेजी-इंडिया का उपयोग कर रहे हैं। कृपया सिस्टम सेटिंग्स में हिंदी TTS इंस्टॉल करें।' :
                  'No Hindi voice available. Falling back to English-India. Please install Hindi TTS in system settings.');
                setTimeout(() => setErrorMessage(''), 5000);
              }
            } else {
              // Enhanced English voice selection
              const englishVoiceSelectors = [
                (v) => v.lang === 'en-US' && v.name.toLowerCase().includes('google'),
                (v) => v.lang === 'en-US' && v.name.toLowerCase().includes('microsoft'),
                (v) => v.lang === 'en-US' && (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('male')),
                (v) => v.lang === 'en-US',
                (v) => v.lang.startsWith('en-') && v.name.toLowerCase().includes('google'),
                (v) => v.lang.startsWith('en-') && v.name.toLowerCase().includes('microsoft'),
                (v) => v.lang.startsWith('en-'),
                (v) => v.lang.toLowerCase().includes('en')
              ];

              for (const selector of englishVoiceSelectors) {
                selectedVoice = voices.find(selector);
                if (selectedVoice) {
                  console.log('TTS: Selected English voice:', selectedVoice.name, selectedVoice.lang);
                  break;
                }
              }
            }

            if (selectedVoice) {
              utter.voice = selectedVoice;
            } else {
              console.warn('TTS: No suitable voice found for', currentLanguage, '- using browser default');
              // For Hindi, try adjusting language as fallback
              if (currentLanguage === 'hi') {
                utter.lang = 'en-IN'; // English-India might pronounce Hindi better than en-US
                console.log('TTS: Falling back to en-IN for Hindi text');
              }
            }

            // Enhanced event handlers with better error recovery
            let utteranceCompleted = false;
            let startTimeout = null;

            const cleanup = () => {
              if (startTimeout) {
                clearTimeout(startTimeout);
                startTimeout = null;
              }
            };

            utter.onstart = () => {
              if (utteranceCompleted) return;
              cleanup();
              console.log('TTS: Sentence', index + 1, 'started');
              setTtsStatus('playing');
              setErrorMessage('');
            };

            utter.onend = () => {
              if (utteranceCompleted) return;
              utteranceCompleted = true;
              cleanup();
              console.log('TTS: Sentence', index + 1, 'completed');
              // Speak next sentence
              speakSequential(index + 1);
            };

            utter.onerror = (e) => {
              if (utteranceCompleted) return;
              utteranceCompleted = true;
              cleanup();
              
              console.error('TTS: Sentence', index + 1, 'error:', e.error, 'at character:', e.charIndex);

              // Enhanced error handling with specific recovery strategies
              if (e.error === 'interrupted') {
                if (retryCount < 2) {
                  console.log('TTS: Sentence interrupted, retrying in 1 second...');
                  setTimeout(() => speakSequential(index), 1000);
                } else {
                  setTtsStatus('error');
                  setErrorMessage('Speech was interrupted multiple times. Please try again.');
                }
                
              } else if (e.error === 'network' || e.error === 'synthesis-unavailable') {
                if (retryCount < 2) {
                  console.log('TTS: Network/synthesis error, trying with fallback...');
                  // Try with simpler text and different voice
                  const fallbackText = sentence.length > 100 ? 
                    sentence.split(/[।\.!?]/)[0] + (currentLanguage === 'hi' ? '।' : '.') : 
                    sentence;
                  setTimeout(() => {
                    speak(fallbackText, retryCount + 1);
                    speakSequential(index + 1);
                  }, 800);
                } else {
                  setTtsStatus('error');
                  setErrorMessage(currentLanguage === 'hi' ? 
                    'नेटवर्क त्रुटि के कारण टेक्स्ट-टू-स्पीच विफल हुआ।' : 
                    'Text-to-speech failed due to network error.');
                }
                
              } else if (e.error === 'synthesis-failed' || e.error === 'language-unavailable') {
                if (retryCount < 2) {
                  console.log('TTS: Synthesis/language error, trying without specific voice...');
                  // Retry without voice selection, let browser choose
                  setTimeout(() => {
                    try {
                      const fallbackUtter = new SpeechSynthesisUtterance(sentence);
                      fallbackUtter.lang = currentLanguage === 'hi' ? 'en-IN' : 'en-US'; // Fallback language
                      fallbackUtter.rate = 1.0;
                      fallbackUtter.volume = 0.8;
                      fallbackUtter.pitch = 1.0;
                      // Don't set voice, let browser choose
                      
                      fallbackUtter.onstart = utter.onstart;
                      fallbackUtter.onend = () => {
                        utter.onend();
                      };
                      fallbackUtter.onerror = (fallbackError) => {
                        console.error('TTS: Fallback also failed:', fallbackError.error);
                        setTtsStatus('error');
                        setErrorMessage(currentLanguage === 'hi' ? 
                          'टेक्स्ट-टू-स्पीच सुविधा उपलब्ध नहीं है। कृपया सिस्टम में हिंदी आवाज इंस्टॉल करें।' : 
                          'Text-to-speech feature is not available. Please install Hindi voices in system.');
                      };
                      
                      speechSynthesis.speak(fallbackUtter);
                    } catch (fallbackException) {
                      console.error('TTS: Fallback exception:', fallbackException);
                      setTtsStatus('error');
                      setErrorMessage('Text-to-speech failed. Please try refreshing the page.');
                    }
                  }, 500);
                } else {
                  setTtsStatus('error');
                  setErrorMessage(currentLanguage === 'hi' ? 
                    'वर्तमान भाषा के लिए टेक्स्ट-टू-स्पीच समर्थित नहीं है। कृपया सिस्टम सेटिंग्स जांचें।' : 
                    'Text-to-speech is not supported for the current language. Please check system settings.');
                }
                
              } else {
                setTtsStatus('error');
                setErrorMessage(`Text-to-speech failed: ${e.error || 'Unknown error'}`);
              }
            };

            // Set a timeout to detect if speech never starts
            startTimeout = setTimeout(() => {
              if (!utteranceCompleted && ttsStatus !== 'playing') {
                console.warn('TTS: Sentence did not start within timeout, treating as failed');
                utteranceCompleted = true;
                setTtsStatus('error');
                setErrorMessage('Speech synthesis timed out. Please try again.');
              }
            }, 5000);

            console.log('TTS: Starting speech for sentence', index + 1, '(attempt', retryCount + 1, ')');
            setTtsStatus('playing');
            speechSynthesis.speak(utter);

          } catch (innerError) {
            console.error('TTS: Inner speak() error for sentence', index + 1, ':', innerError);
            setTtsStatus('error');
            setErrorMessage(`Text-to-speech failed: ${innerError.message}`);
          }
        };

        // Start speaking the first sentence
        speakSequential(0);

      });

    } catch (e) {
      console.error('TTS: speak() failed:', e);
      setTtsStatus('error');
      setErrorMessage(`Text-to-speech failed: ${e.message}`);
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
    console.log('TTS: Checking last message for auto-speak', { 
      lastMessage: !!lastMessage, 
      sender: lastMessage?.sender, 
      role: lastMessage?.role,
      text: lastMessage?.text?.substring(0, 30) + '...'
    });
    
    // Enhanced check for AI messages - handle various possible formats
    const isAIMessage = lastMessage && (
      lastMessage.sender === 'AI' || 
      lastMessage.sender === 'ai' ||
      lastMessage.role === 'ai' || 
      lastMessage.role === 'AI' ||
      lastMessage.role === 'assistant' ||
      (lastMessage.sender === 'bot') ||
      (lastMessage.type === 'ai') ||
      (lastMessage.from === 'ai')
    );
    
    if (isAIMessage && lastMessage.text?.trim()) {
      console.log('TTS: Auto-speaking AI message');
      // Add delay to ensure message is rendered and avoid conflicts
      const speakTimeout = setTimeout(() => {
        // Double-check that we still want to speak (user might have changed settings)
        if (ttsEnabled && speakResponses) {
          speak(lastMessage.text);
        }
      }, 200); // Slightly longer delay for reliability

      // Cleanup function to cancel timeout if component unmounts or effect re-runs
      return () => {
        clearTimeout(speakTimeout);
      };
    }
  }, [messages, speakResponses, ttsEnabled, currentLanguage]); // Added currentLanguage to deps

  const handleSendMessage = () => {
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput('');
    baseBeforeSpeechRef.current = '';
  };

  const handlePlayLastReply = () => {
    console.log('TTS: handlePlayLastReply() called', { ttsEnabled, messagesCount: messages.length });
    
    if (!ttsEnabled) {
      console.log('TTS: TTS not enabled, calling enableTTS()');
      enableTTS();
      return;
    }

    // Find the last AI message (more robust search)
    let lastAIMessage = null;
    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];
      const isAIMessage = message && (
        message.sender === 'AI' || 
        message.sender === 'ai' ||
        message.role === 'ai' || 
        message.role === 'AI' ||
        message.role === 'assistant' ||
        message.sender === 'bot' ||
        message.type === 'ai' ||
        message.from === 'ai'
      );
      
      if (isAIMessage && message.text?.trim()) {
        lastAIMessage = message;
        break;
      }
    }

    console.log('TTS: Last AI message found:', { 
      found: !!lastAIMessage, 
      text: lastAIMessage?.text?.substring(0, 50) + '...'
    });
    
    if (!lastAIMessage) {
      console.log('TTS: No AI message found to speak');
      setErrorMessage(currentLanguage === 'hi' ? 
        'बोलने के लिए कोई AI संदेश नहीं मिला' : 
        'No AI message found to speak');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    // Cancel any ongoing speech first with promise-based approach
    const cancelAndSpeak = async () => {
      if (speechSynthesis.speaking || speechSynthesis.pending) {
        console.log('TTS: Stopping current speech before playing last reply');
        speechSynthesis.cancel();
        
        // Wait for cancellation to complete
        await new Promise(resolve => {
          let checks = 0;
          const checkInterval = setInterval(() => {
            checks++;
            if (!speechSynthesis.speaking && !speechSynthesis.pending) {
              clearInterval(checkInterval);
              resolve();
            } else if (checks > 10) { // Max 1 second wait
              clearInterval(checkInterval);
              console.warn('TTS: Forced cancellation after timeout');
              resolve();
            }
          }, 100);
        });
      }

      // Clear any previous errors and start speaking
      setErrorMessage('');
      setTtsStatus('playing');
      speak(lastAIMessage.text);
    };

    cancelAndSpeak().catch(error => {
      console.error('TTS: Error in cancelAndSpeak:', error);
      setTtsStatus('error');
      setErrorMessage('Failed to play the last reply. Please try again.');
    });
  };

  return (
    <div className="rounded-lg border border-[#1F2A24] bg-[#111C18] p-4 flex flex-col h-[600px]">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#1F2A24]">
        <h3 className="text-sm font-medium text-white">Chat Assistant</h3>
        <div className="flex items-center gap-4">
          {/* Language Toggle */}
          <button
            onClick={() => {
              const newLang = currentLanguage === 'hi' ? 'en' : 'hi';
              console.log('Language switched to:', newLang);
              // Note: This would need to be handled by parent component
              // For now, we'll show the current language
            }}
            className="px-3 py-1 bg-[#1F2A24] text-white rounded-md hover:bg-[#2A3A2F] transition-colors text-sm"
            title={`Current language: ${currentLanguage === 'hi' ? 'Hindi (हिंदी)' : 'English'}`}
          >
            {currentLanguage === 'hi' ? 'हिंदी' : 'English'}
          </button>

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
            <div className="flex items-center gap-2">
              {ttsStatus === 'playing' ? (
                <button
                  className="text-sm text-orange-400 underline hover:text-orange-300"
                  onClick={() => {
                    console.log('TTS: Manually stopping speech');
                    speechSynthesis.cancel();
                    setTtsStatus('ready');
                  }}
                  title="Stop current speech"
                >
                  🔇 Stop Speech
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
              {ttsStatus === 'error' && (
                <button
                  className="text-xs text-orange-400 hover:text-orange-300"
                  onClick={() => {
                    setTtsStatus('ready');
                    setErrorMessage('');
                    console.log('TTS: Manually cleared error state');
                  }}
                  title="Clear TTS error and try again"
                >
                  ↻
                </button>
              )}
            </div>
          )}

          <div className={`text-xs flex items-center gap-1 ${
            ttsStatus === 'playing' ? 'text-green-400' :
            ttsStatus === 'testing' ? 'text-yellow-400' :
            ttsStatus === 'error' ? 'text-red-400' :
            ttsStatus === 'enabled' || ttsStatus === 'ready' ? 'text-green-400' :
            'text-gray-400'
          }`}>
            {ttsStatus === 'playing' && <span className="animate-pulse">🔊</span>}
            {ttsStatus === 'testing' && <span className="animate-spin">⚙️</span>}
            {ttsStatus === 'error' && <span>⚠️</span>}
            {(ttsStatus === 'enabled' || ttsStatus === 'ready') && <span>✅</span>}
          </div>
          
          <HealthIndicator />
        </div>
      </div>

      {errorMessage && (
        <div className="text-sm text-red-400 mb-2 p-3 bg-red-900/20 rounded-md border border-red-800/30">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="font-medium mb-1 flex items-center gap-2">
                <span>⚠️</span>
                <span>{currentLanguage === 'hi' ? 'त्रुटि:' : 'Error:'}</span>
              </div>
              <div className="mb-2">{errorMessage}</div>
              
              {/* Contextual help based on error type */}
              {errorMessage.includes('speech') && (
                <div className="text-xs mt-2 p-2 bg-red-800/20 rounded border border-red-700/30">
                  <div className="font-medium mb-1">
                    {currentLanguage === 'hi' ? '💡 सुझाव:' : '💡 Suggestions:'}
                  </div>
                  {currentLanguage === 'hi' ? (
                    <ul className="space-y-1 text-gray-300">
                      <li>• यदि हिंदी भाषा समर्थित नहीं है, तो अंग्रेजी का प्रयास करें</li>
                      <li>• ब्राउज़र की भाषा सेटिंग्स जांचें</li>
                      <li>• पेज को रिफ्रेश करें या "Enable TTS" बटन को फिर से क्लिक करें</li>
                      <li>• Chrome या Edge ब्राउज़र का उपयोग करें जो बेहतर TTS समर्थन प्रदान करते हैं</li>
                      <li>• Android पर, सेटिंग्स &gt; भाषा &gt; TTS में हिंदी आवाज इंस्टॉल करें</li>
                    </ul>
                  ) : (
                    <ul className="space-y-1 text-gray-300">
                      <li>• Try switching to English if Hindi is not supported</li>
                      <li>• Check your browser's language settings</li>
                      <li>• Refresh the page or click "Enable TTS" button again</li>
                      <li>• Use Chrome or Edge browser for better TTS support</li>
                      <li>• On Android, install Hindi voices in Settings &gt; Language &gt; TTS</li>
                    </ul>
                  )}
                </div>
              )}
              
              {errorMessage.includes('interrupted') && (
                <div className="text-xs mt-2 text-yellow-300 bg-yellow-900/20 p-2 rounded">
                  ⚠️ {currentLanguage === 'hi' ? 
                    'भाषण बाधित हुआ था। सिस्टम स्वचालित रूप से पुनः प्रयास करेगा।' : 
                    'Speech was interrupted. The system will automatically retry.'}
                </div>
              )}
              
              {errorMessage.includes('multiple attempts') && (
                <div className="text-xs mt-2 text-orange-300 bg-orange-900/20 p-2 rounded">
                  🔄 {currentLanguage === 'hi' ? 
                    'यदि TTS समस्या बनी रहे तो पेज रिफ्रेश करें या दूसरे ब्राउज़र का उपयोग करें।' : 
                    'Try refreshing the page or switching to a different browser if TTS continues to fail.'}
                </div>
              )}
              
              {errorMessage.includes('not supported') && (
                <div className="text-xs mt-2 text-blue-300 bg-blue-900/20 p-2 rounded">
                  ℹ️ {currentLanguage === 'hi' ? 
                    'आपका ब्राउज़र TTS का समर्थन नहीं करता। कृपया Chrome, Edge या Firefox का उपयोग करें।' : 
                    'Your browser does not support TTS. Please use Chrome, Edge, or Firefox.'}
                </div>
              )}
            </div>
            <button
              onClick={() => {
                setErrorMessage('');
                console.log('TTS: Error message dismissed by user');
              }}
              className="text-red-300 hover:text-red-200 ml-2 text-xs p-1 hover:bg-red-800/30 rounded"
              title="Dismiss error"
            >
              ✕
            </button>
          </div>
        </div>
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
          onVoiceToggle={SpeechRecognition ? handleListen : null}
          isListening={isListening}
          voiceSupported={!!SpeechRecognition}
          currentLanguage={currentLanguage}
        />
      </div>
    </div>
  );
};

export default EnhancedChatWindow;