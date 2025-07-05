import React, { useState } from 'react';
import QRCodeSection from '../components/QRCodeSection';
import AutoScrollingServices from '../components/AutoScrollingServices';
import QRScanner from '../components/QRScanner';
import BookingDetails from './BookingDetails';
import ConciergeHome from './ConciergeHome';
import ChatScreen from './ChatScreen';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState('home'); // 'home', 'scanner', 'booking', 'concierge', 'chat'

  const handleScanQRCode = () => {
    console.log('Opening QR Scanner');
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
    console.log('QR Code scanned:', result);
    setCurrentScreen('home');
  };

  const handleGoToBookingDetails = () => {
    console.log('Navigating to booking details');
    setCurrentScreen('booking');
  };

  const handleGoToConcierge = () => {
    console.log('Navigating to concierge home');
    setCurrentScreen('concierge');
  };

  const handleGoToChat = () => {
    console.log('Navigating to chat');
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Status bar simulation */}
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

      {/* Main content */}
      <div className="pt-8 pb-6">
        {/* Header */}
        <div className="text-center mb-8 px-6">
          <h1 className="text-2xl font-light text-gray-800 mb-2">
            Welcome to Hotel
          </h1>
          <h2 className="text-2xl font-light text-gray-800">
            concierge services.
          </h2>
        </div>

        {/* QR Code Section */}
        <QRCodeSection />

        {/* Auto-scrolling Services */}
        <AutoScrollingServices />

        {/* Scan QR Code Button */}
        <div className="px-6">
          <Button 
            className="w-full bg-blue-900 hover:bg-blue-800 text-white py-4 rounded-2xl text-lg font-medium"
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
