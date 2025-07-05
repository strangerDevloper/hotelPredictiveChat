
import React from 'react';

interface VoiceAnimationsProps {
  isListening: boolean;
  isProcessing: boolean;
}

export const VoiceAnimations: React.FC<VoiceAnimationsProps> = ({ isListening, isProcessing }) => {
  if (!isListening && !isProcessing) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {/* Outer ripple waves */}
      <div className={`absolute rounded-full border-2 border-blue-400/30 ${isListening ? 'animate-ping' : ''}`} 
           style={{ width: '60px', height: '60px' }} />
      <div className={`absolute rounded-full border-2 border-blue-400/20 ${isListening ? 'animate-ping animation-delay-75' : ''}`} 
           style={{ width: '80px', height: '80px' }} />
      <div className={`absolute rounded-full border-2 border-blue-400/10 ${isListening ? 'animate-ping animation-delay-150' : ''}`} 
           style={{ width: '100px', height: '100px' }} />
      
      {/* Processing spinner */}
      {isProcessing && (
        <div className="absolute w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      )}
    </div>
  );
};
