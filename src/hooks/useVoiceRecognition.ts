
import { useState, useRef, useCallback, useEffect } from 'react';
import { VoiceState, VoiceRecognitionHook } from '../types/voice';

export const useVoiceRecognition = (): VoiceRecognitionHook => {
  const [voiceState, setVoiceState] = useState<VoiceState>({
    isListening: false,
    isProcessing: false,
    transcript: '',
    interimTranscript: '',
    error: null,
    isSupported: typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
  });

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!voiceState.isSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setVoiceState(prev => ({ ...prev, isListening: true, error: null }));
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setVoiceState(prev => ({
        ...prev,
        transcript: prev.transcript + finalTranscript,
        interimTranscript: interimTranscript,
        isProcessing: finalTranscript.length > 0
      }));

      // Auto-stop after 3 seconds of silence
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      }, 3000);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      let errorMessage = 'Voice recognition error';
      
      switch (event.error) {
        case 'not-allowed':
          errorMessage = 'Microphone access denied';
          break;
        case 'no-speech':
          errorMessage = 'No speech detected. Try speaking again.';
          break;
        case 'network':
          errorMessage = 'Network error. Check your connection.';
          break;
        default:
          errorMessage = 'Voice recognition failed. Try again.';
      }

      setVoiceState(prev => ({
        ...prev,
        error: errorMessage,
        isListening: false,
        isProcessing: false
      }));
    };

    recognition.onend = () => {
      setVoiceState(prev => ({
        ...prev,
        isListening: false,
        isProcessing: false,
        interimTranscript: ''
      }));
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [voiceState.isSupported]);

  const startListening = useCallback(() => {
    if (!voiceState.isSupported || !recognitionRef.current) {
      setVoiceState(prev => ({ ...prev, error: 'Voice recognition not supported' }));
      return;
    }

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      setVoiceState(prev => ({ ...prev, error: 'Failed to start voice recognition' }));
    }
  }, [voiceState.isSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const clearTranscript = useCallback(() => {
    setVoiceState(prev => ({
      ...prev,
      transcript: '',
      interimTranscript: '',
      error: null
    }));
  }, []);

  const toggleListening = useCallback(() => {
    if (voiceState.isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [voiceState.isListening, startListening, stopListening]);

  return {
    voiceState,
    startListening,
    stopListening,
    clearTranscript,
    toggleListening
  };
};
