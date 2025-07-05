
import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QRScannerProps {
  onBack: () => void;
  onScanResult?: (result: string) => void;
  onGoToBookingDetails?: () => void;
}

const QRScanner = ({ onBack, onScanResult, onGoToBookingDetails }: QRScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasPermission(true);
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        setError('Unable to access camera. Please check permissions.');
        setHasPermission(false);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleUploadFromGallery = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        console.log('Image selected from gallery:', file.name);
        if (onScanResult) {
          onScanResult('QR_CODE_FROM_GALLERY');
        }
      }
    };
    input.click();
  };

  const handleTooltipClick = () => {
    console.log('Tooltip clicked - navigating to booking details');
    if (onGoToBookingDetails) {
      onGoToBookingDetails();
    }
  };

  if (hasPermission === false) {
    return (
      <div className="min-h-screen bg-gray-500 flex flex-col">
        {/* Header */}
        <div className="bg-black text-white text-sm py-2 px-4 flex justify-between items-center">
          <span>9:41</span>
          <div className="flex items-center space-x-1">
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
            </div>
            <span>📶</span>
            <span>📶</span>
            <span>🔋</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between p-4 bg-gray-500">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-white hover:bg-gray-600"
          >
            <ArrowLeft size={24} />
          </Button>
          <div className="flex items-center space-x-4">
            <button className="text-white">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 17v2h4v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/>
              </svg>
            </button>
            <button className="text-white" onClick={handleTooltipClick}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Error message */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center text-white">
            <p className="text-lg mb-4">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-500 flex flex-col">
      {/* Status bar */}
      <div className="bg-black text-white text-sm py-2 px-4 flex justify-between items-center">
        <span>9:41</span>
        <div className="flex items-center space-x-1">
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
          </div>
          <span>📶</span>
          <span>📶</span>
          <span>🔋</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between p-4 bg-gray-500">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-white hover:bg-gray-600"
        >
          <ArrowLeft size={24} />
        </Button>
        <div className="flex items-center space-x-4">
          <button className="text-white">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 17v2h4v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/>
            </svg>
          </button>
          <button className="text-white" onClick={handleTooltipClick}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Camera View */}
      <div className="flex-1 relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        
        {/* Scanning overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-80 h-80">
            <div className="absolute top-0 left-0 w-12 h-12 border-l-4 border-t-4 border-blue-500 rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-12 h-12 border-r-4 border-t-4 border-blue-500 rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-12 h-12 border-l-4 border-b-4 border-blue-500 rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-12 h-12 border-r-4 border-b-4 border-blue-500 rounded-br-lg"></div>
            <div className="absolute inset-4 bg-white bg-opacity-10 rounded-lg"></div>
          </div>
        </div>
      </div>

      {/* Upload from gallery button */}
      <div className="p-6">
        <Button
          onClick={handleUploadFromGallery}
          className="w-full bg-white text-blue-600 hover:bg-gray-100 py-3 rounded-full font-medium flex items-center justify-center space-x-2"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
          </svg>
          <span>Upload from gallery</span>
        </Button>
      </div>
    </div>
  );
};

export default QRScanner;
