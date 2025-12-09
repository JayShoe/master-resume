'use client';

import { useState, useRef, useEffect, KeyboardEvent, useCallback } from 'react';
import { Send, Loader2, Mic, MicOff, ChevronDown } from 'lucide-react';

// Extend Window interface for SpeechRecognition
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = 'Type your message...',
}: ChatInputProps) {
  const [value, setValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [showDeviceMenu, setShowDeviceMenu] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const deviceMenuRef = useRef<HTMLDivElement>(null);

  // Check for speech recognition support and enumerate audio devices
  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    setSpeechSupported(!!SpeechRecognitionAPI);

    // Get audio input devices
    const getAudioDevices = async () => {
      try {
        // Request permission first to get device labels
        await navigator.mediaDevices.getUserMedia({ audio: true });
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = devices.filter(device => device.kind === 'audioinput');
        setAudioDevices(audioInputs);

        // Set default device if not already set
        const firstDevice = audioInputs[0];
        if (!selectedDeviceId && firstDevice) {
          setSelectedDeviceId(firstDevice.deviceId);
        }
      } catch (err) {
        console.error('Error accessing audio devices:', err);
      }
    };

    if (SpeechRecognitionAPI) {
      getAudioDevices();
    }

    // Listen for device changes
    const handleDeviceChange = () => {
      getAudioDevices();
    };
    navigator.mediaDevices?.addEventListener('devicechange', handleDeviceChange);

    return () => {
      navigator.mediaDevices?.removeEventListener('devicechange', handleDeviceChange);
    };
  }, [selectedDeviceId]);

  // Close device menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (deviceMenuRef.current && !deviceMenuRef.current.contains(event.target as Node)) {
        setShowDeviceMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Initialize speech recognition
  const initSpeechRecognition = useCallback(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) return null;

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimText = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (!result || !result[0]) continue;
        const transcript = result[0].transcript;
        if (result.isFinal) {
          finalTranscript += transcript;
        } else {
          interimText += transcript;
        }
      }

      if (finalTranscript) {
        setValue((prev) => {
          const newValue = prev + (prev && !prev.endsWith(' ') ? ' ' : '') + finalTranscript;
          return newValue;
        });
        setInterimTranscript('');
      } else {
        setInterimTranscript(interimText);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      // Handle different error types gracefully
      switch (event.error) {
        case 'no-speech':
          // User didn't speak - this is normal, just keep listening
          // The recognition will auto-restart via onend
          console.log('No speech detected, continuing to listen...');
          break;
        case 'audio-capture':
          console.error('No microphone detected');
          setIsListening(false);
          setInterimTranscript('');
          break;
        case 'not-allowed':
          console.error('Microphone permission denied');
          setIsListening(false);
          setInterimTranscript('');
          break;
        case 'network':
          console.error('Network error during speech recognition');
          setIsListening(false);
          setInterimTranscript('');
          break;
        case 'aborted':
          // User or system aborted - this is intentional
          setIsListening(false);
          setInterimTranscript('');
          break;
        default:
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          setInterimTranscript('');
      }
    };

    recognition.onend = () => {
      // Auto-restart if still supposed to be listening (handles no-speech timeout)
      if (recognitionRef.current === recognition) {
        // Check if we should restart (user hasn't stopped it)
        const shouldRestart = document.querySelector('[aria-label="Stop voice input"]') !== null;
        if (shouldRestart) {
          try {
            recognition.start();
            return; // Don't set isListening to false
          } catch {
            // Failed to restart, fall through to stop
          }
        }
      }
      setIsListening(false);
      setInterimTranscript('');
    };

    return recognition;
  }, []);

  // Toggle speech recognition
  const toggleListening = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setInterimTranscript('');
    } else {
      if (!recognitionRef.current) {
        recognitionRef.current = initSpeechRecognition();
      }
      try {
        recognitionRef.current?.start();
      } catch {
        // Recognition might already be started, recreate it
        recognitionRef.current = initSpeechRecognition();
        recognitionRef.current?.start();
      }
    }
  }, [isListening, initSpeechRecognition]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  }, [value, interimTranscript]);

  const handleSubmit = () => {
    if (value.trim() && !disabled) {
      // Stop listening if active
      if (isListening) {
        recognitionRef.current?.stop();
        setIsListening(false);
        setInterimTranscript('');
      }
      onSend(value.trim());
      setValue('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const canSend = value.trim().length > 0 && !disabled;

  // Display value including interim transcript
  const displayValue = interimTranscript ? value + (value && !value.endsWith(' ') ? ' ' : '') + interimTranscript : value;

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '16px 20px',
        marginTop: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        border: '1px solid #e2e8f0',
        flexShrink: 0,
      }}
    >
      <div className="flex items-end gap-2 sm:gap-3">
        {/* Input container */}
        <div className="flex-1 relative">
          <div className={`relative flex items-end bg-slate-100/80 dark:bg-slate-800/80 rounded-2xl border transition-all duration-200
            ${isListening
              ? 'border-red-400 ring-4 ring-red-500/20'
              : 'border-slate-200/50 dark:border-slate-700/50 focus-within:border-blue-400 dark:focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10'
            }`}>
            <textarea
              ref={textareaRef}
              value={displayValue}
              onChange={(e) => {
                setValue(e.target.value);
                setInterimTranscript('');
              }}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? 'Listening... speak now' : placeholder}
              disabled={disabled}
              rows={1}
              className="flex-1 bg-transparent
                         text-slate-900 dark:text-slate-100
                         placeholder-slate-400 dark:placeholder-slate-500
                         focus:outline-none
                         disabled:opacity-50 disabled:cursor-not-allowed
                         resize-none overflow-y-auto
                         text-sm sm:text-[15px] leading-relaxed"
              style={{ minHeight: '52px', maxHeight: '150px', padding: '14px 16px' }}
            />
          </div>
          {/* Listening indicator */}
          {isListening && (
            <div className="absolute -bottom-6 left-4 flex items-center gap-2 text-xs text-red-500">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              Listening...
            </div>
          )}
        </div>

        {/* Mic button with device selector */}
        {speechSupported && (
          <div className="relative" ref={deviceMenuRef}>
            <div className="flex items-center">
              <button
                type="button"
                onClick={toggleListening}
                disabled={disabled}
                className={`flex-shrink-0 w-11 h-11 sm:w-14 sm:h-14 flex items-center justify-center rounded-l-xl sm:rounded-l-2xl
                           transition-all duration-300 shadow-lg
                           ${isListening
                             ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/30 hover:shadow-red-500/50 animate-pulse'
                             : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-600 hover:text-slate-700 dark:hover:text-slate-300'
                           }
                           ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
                aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
                title={isListening ? 'Click to stop listening' : 'Click to speak'}
              >
                {isListening ? <MicOff className="w-5 h-5 sm:w-6 sm:h-6" /> : <Mic className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>
              {audioDevices.length > 1 && (
                <button
                  type="button"
                  onClick={() => setShowDeviceMenu(!showDeviceMenu)}
                  disabled={disabled || isListening}
                  className={`flex-shrink-0 w-6 h-11 sm:h-14 flex items-center justify-center rounded-r-xl sm:rounded-r-2xl
                             transition-all duration-300 border-l
                             ${isListening
                               ? 'bg-red-500 border-red-400 text-white/70 cursor-not-allowed'
                               : 'bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-600 hover:text-slate-700 dark:hover:text-slate-300'
                             }
                             ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  aria-label="Select microphone"
                  title="Select microphone"
                >
                  <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              )}
            </div>

            {/* Device dropdown menu */}
            {showDeviceMenu && audioDevices.length > 1 && (
              <div className="absolute bottom-full mb-2 right-0 min-w-[320px] bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
                <div className="px-3 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700">
                  Select Microphone
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {audioDevices.map((device) => (
                    <button
                      key={device.deviceId}
                      onClick={() => {
                        setSelectedDeviceId(device.deviceId);
                        setShowDeviceMenu(false);
                      }}
                      className={`w-full px-3 py-2.5 text-left text-sm transition-colors flex items-center gap-2
                                 ${selectedDeviceId === device.deviceId
                                   ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                   : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                                 }`}
                    >
                      <Mic className={`w-4 h-4 flex-shrink-0 ${selectedDeviceId === device.deviceId ? 'text-blue-500' : 'text-slate-400'}`} />
                      <span className="truncate">
                        {device.label || `Microphone ${audioDevices.indexOf(device) + 1}`}
                      </span>
                      {selectedDeviceId === device.deviceId && (
                        <span className="ml-auto text-blue-500">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Send button */}
        <button
          onClick={handleSubmit}
          disabled={!canSend}
          className={`flex-shrink-0 w-11 h-11 sm:w-14 sm:h-14 flex items-center justify-center rounded-xl sm:rounded-2xl
                     transition-all duration-300 shadow-lg
                     ${canSend
                       ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 active:scale-95'
                       : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 shadow-none cursor-not-allowed'
                     }`}
          aria-label="Send message"
        >
          {disabled ? (
            <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
          ) : (
            <Send className="w-5 h-5 sm:w-6 sm:h-6" />
          )}
        </button>
      </div>

      {/* Helper text - hidden on mobile */}
      <div className={`hidden sm:flex items-center justify-center gap-3 text-[11px] text-slate-400 dark:text-slate-500 ${isListening ? 'mt-8' : 'mt-2'}`}>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[10px] font-medium">↵</kbd>
          send
        </span>
        <span className="text-slate-300 dark:text-slate-600">•</span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[10px] font-medium">⇧↵</kbd>
          new line
        </span>
        {speechSupported && (
          <>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className="flex items-center gap-1 max-w-[150px]">
              <Mic className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">
                {audioDevices.find(d => d.deviceId === selectedDeviceId)?.label?.replace(/\s*\(.*?\)\s*/g, '').trim() || 'voice'}
              </span>
            </span>
          </>
        )}
      </div>
    </div>
  );
}
