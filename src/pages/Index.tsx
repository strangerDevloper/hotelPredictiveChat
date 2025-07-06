import React, { useState } from 'react';
import QRCodeSection from '../components/QRCodeSection';
import AutoScrollingServiceCarousel from '../components/AutoScrollingServiceCarousel';
import QRScanner from '../components/QRScanner';
import BookingDetails from './BookingDetails';
import ConciergeHome from './ConciergeHome';
import ChatScreen from './ChatScreen';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState('home'); // 'home', 'scanner', 'booking', 'concierge', 'chat'

  const handleScanQRCode = () => {
    setCurrentScreen('scanner');
  };

  const handleBackFromScanner = () => {
    setCurrentScreen('home');
  };

  const handleBackFromBooking = () => {
    setCurrentScreen('home');
  };

  const handleBackFromConcierge = () => {
    setCurrentScreen('home');
  };

  const handleBackFromChat = () => {
    setCurrentScreen('concierge');
  };

  const handleScanResult = (result: string) => {
    setCurrentScreen('home');
  };

  const handleGoToBookingDetails = () => {
    setCurrentScreen('booking');
  };

  const handleGoToConcierge = () => {
    setCurrentScreen('concierge');
  };

  const handleGoToChat = () => {
    setCurrentScreen('chat');
  };

  if (currentScreen === 'scanner') {
    return (
      <QRScanner 
        onBack={handleBackFromScanner}
        onScanResult={handleScanResult}
        onGoToBookingDetails={handleGoToBookingDetails}
      />
    );
  }

  if (currentScreen === 'booking') {
    return (
      <BookingDetails 
        onBack={handleBackFromBooking}
        onContinue={handleGoToConcierge}
      />
    );
  }

  if (currentScreen === 'concierge') {
    return (
      <ConciergeHome 
        onBack={handleBackFromConcierge}
        onOpenChat={handleGoToChat}
      />
    );
  }

  if (currentScreen === 'chat') {
    return (
      <ChatScreen onBack={handleBackFromChat} />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white safe-area-top safe-area-bottom">
      {/* Status bar simulation */}
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

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-start px-0 pt-6 pb-4 w-full">
        {/* Header */}
        <div className="text-center mb-4 px-4">
          <h1 className="text-xl font-medium text-gray-900 mb-1 leading-tight">
            Welcome to Hotel<br />concierge services.
          </h1>
        </div>

        {/* QR Code Section */}
        <div className="mb-4 w-full flex justify-center">
          <QRCodeSection />
        </div>

        {/* Description */}
        <div className="mb-4 px-6 w-full">
          <p className="text-center text-gray-800 text-base font-normal leading-snug">
            Scan the code provided in your room<br />to access all hotel services.
          </p>
        </div>

        {/* Auto-scrolling Service Carousel */}
        <div className="w-full flex justify-center mb-4">
          <AutoScrollingServiceCarousel />
        </div>

        {/* Spacer to push button to bottom */}
        <div className="flex-1" />

        {/* Scan QR Code Button */}
        <div className="w-full px-4 pb-2">
          <Button 
            className="w-full bg-blue-900 hover:bg-blue-800 active:bg-blue-700 text-white py-3 rounded-xl text-base font-semibold transition-all duration-200 transform active:scale-95 shadow-md"
            onClick={handleScanQRCode}
          >
            Scan QR code
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
