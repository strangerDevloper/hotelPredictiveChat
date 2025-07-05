
import React from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from './button';
import { VoiceAnimations } from '../voice/VoiceAnimations';

interface VoiceButtonProps {
  isListening: boolean;
  isProcessing: boolean;
  isSupported: boolean;
  error: string | null;
  onClick: () => void;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  isListening,
  isProcessing,
  isSupported,
  error,
  onClick
}) => {
  if (!isSupported) return null;

  return (
    <div className="relative">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onClick}
        disabled={isProcessing}
        className={`relative transition-all duration-200 ${
          isListening 
            ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
            : error 
              ? 'bg-red-100 text-red-600 hover:bg-red-200'
              : 'hover:bg-gray-100'
        } ${isListening ? 'animate-pulse' : ''}`}
      >
        {isListening ? (
          <MicOff className="w-4 h-4" />
        ) : (
          <Mic className="w-4 h-4" />
        )}
        
        <VoiceAnimations isListening={isListening} isProcessing={isProcessing} />
      </Button>
      
      {error && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 bg-red-100 text-red-700 text-xs rounded whitespace-nowrap z-10">
          {error}
        </div>
      )}
    </div>
  );
};
