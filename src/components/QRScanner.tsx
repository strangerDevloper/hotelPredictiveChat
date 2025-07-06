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

  // Helper to stop the camera stream
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

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
      stopCamera();
    };
  }, []);

  const handleBack = () => {
    stopCamera();
    onBack();
  };

  const handleScanResult = (result: string) => {
    stopCamera();
    if (onScanResult) onScanResult(result);
  };

  const handleGoToBookingDetails = () => {
    stopCamera();
    if (onGoToBookingDetails) onGoToBookingDetails();
  };

  const handleUploadFromGallery = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        console.log('Image selected from gallery:', file.name);
        if (onScanResult) handleScanResult('QR_CODE_FROM_GALLERY');
      }
    };
    input.click();
  };

  const handleTooltipClick = () => {
    console.log('Tooltip clicked - navigating to booking details');
    handleGoToBookingDetails();
  };

  if (hasPermission === false) {
    return (
      <div className="min-h-screen bg-gray-500 flex flex-col safe-area-top safe-area-bottom">
        {/* Header */}
        <div className="bg-black text-white text-sm py-2 px-4 flex justify-between items-center">
          <span className="font-medium">9:41</span>
          <div className="flex items-center space-x-1">
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
            </div>
            <span className="text-xs">📶</span>
            <span className="text-xs">📶</span>
            <span className="text-xs">🔋</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between p-4 bg-gray-500">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="text-white hover:bg-gray-600 min-w-[44px] min-h-[44px]"
          >
            <ArrowLeft size={24} />
          </Button>
          <div className="flex items-center space-x-4">
            <button className="text-white min-w-[44px] min-h-[44px] flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 17v2h4v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/>
              </svg>
            </button>
            <button className="text-white min-w-[44px] min-h-[44px] flex items-center justify-center" onClick={handleTooltipClick}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Error message */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center text-white">
            <p className="text-lg mb-6">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 py-3 px-6 min-h-[44px]"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-500 flex flex-col safe-area-top safe-area-bottom">
      {/* Status bar */}
      <div className="bg-black text-white text-sm py-2 px-4 flex justify-between items-center">
        <span className="font-medium">9:41</span>
        <div className="flex items-center space-x-1">
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
          </div>
          <span className="text-xs">📶</span>
          <span className="text-xs">📶</span>
          <span className="text-xs">🔋</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between p-4 bg-gray-500">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="text-white hover:bg-gray-600 min-w-[44px] min-h-[44px]"
        >
          <ArrowLeft size={24} />
        </Button>
        <div className="flex items-center space-x-4">
          <button className="text-white min-w-[44px] min-h-[44px] flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 17v2h4v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/>
            </svg>
          </button>
          <button className="text-white min-w-[44px] min-h-[44px] flex items-center justify-center" onClick={handleTooltipClick}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Camera View */}
      <div className="flex-1 flex flex-col items-center justify-start bg-gray-500">
        <div className="relative w-full flex justify-center items-start pt-4" style={{height: 360}}>
          {/* Video and overlay are the same size and centered */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl object-cover bg-black"
            style={{ width: 288, height: 288, maxWidth: '90vw', maxHeight: 320 }}
          />
          {/* Scanning overlay */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: 288, height: 288 }}>
            <div className="absolute top-0 left-0 w-12 h-12 border-l-4 border-t-4 border-blue-500 rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-12 h-12 border-r-4 border-t-4 border-blue-500 rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-12 h-12 border-l-4 border-b-4 border-blue-500 rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-12 h-12 border-r-4 border-b-4 border-blue-500 rounded-br-lg"></div>
            <div className="absolute inset-0 bg-black bg-opacity-30 rounded-xl pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Upload from gallery button */}
      <div className="p-4 safe-area-bottom">
        <Button
          onClick={handleUploadFromGallery}
          className="w-full bg-white text-blue-600 hover:bg-gray-100 py-4 rounded-full font-medium flex items-center justify-center space-x-2 min-h-[44px]"
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
