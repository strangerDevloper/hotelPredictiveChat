
export interface VoiceState {
  isListening: boolean;
  isProcessing: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  isSupported: boolean;
}

export interface VoiceRecognitionHook {
  voiceState: VoiceState;
  startListening: () => void;
  stopListening: () => void;
  clearTranscript: () => void;
  toggleListening: () => void;
}

export interface VoiceIntent {
  service: string;
  items?: string[];
  quantity?: number;
  timing?: string;
  preferences?: string[];
  confidence: number;
}
