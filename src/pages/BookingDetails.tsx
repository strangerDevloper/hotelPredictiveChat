import React, { useEffect, useState } from 'react';
import { ArrowLeft, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BookingDetailsProps {
  onBack: () => void;
  onContinue: () => void;
}

const BookingDetails = ({ onBack, onContinue }: BookingDetailsProps) => {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Hide confetti after 3 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][Math.floor(Math.random() * 5)],
                }}
              />
            </div>
          ))}
        </div>
      )}

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

      {/* Header & Main Content */}
      <div className="flex-1 flex flex-col bg-white px-4 py-4 shadow-sm overflow-auto min-h-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeft size={24} />
        </Button>
        
        <div className="text-center mb-4">
          <h1 className="text-xl font-semibold text-gray-800 mb-1">
            Welcome to Ohio Hotel
          </h1>
          <p className="text-gray-600 text-sm">
            We are thrilled to have you Ester Howard
          </p>
        </div>

        {/* Hotel Image */}
        <div className="mb-4 flex-none w-full rounded-lg overflow-hidden" style={{height: '22vh', minHeight: '100px', maxHeight: '180px'}}>
          <svg viewBox="0 0 800 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-cover">
            <rect width="800" height="200" rx="24" fill="#e0e7ef"/>
            <rect x="60" y="80" width="680" height="80" rx="12" fill="#b6c6e3"/>
            <rect x="120" y="60" width="120" height="60" rx="8" fill="#f7c873"/>
            <rect x="560" y="60" width="120" height="60" rx="8" fill="#f7c873"/>
            <rect x="320" y="40" width="160" height="100" rx="10" fill="#fff" stroke="#b6c6e3" strokeWidth="4"/>
            <rect x="370" y="100" width="60" height="60" rx="6" fill="#b6c6e3"/>
            <rect x="390" y="120" width="20" height="40" rx="4" fill="#f7c873"/>
            <rect x="430" y="120" width="20" height="40" rx="4" fill="#f7c873"/>
            <circle cx="400" cy="80" r="8" fill="#b6c6e3"/>
            <circle cx="440" cy="80" r="8" fill="#b6c6e3"/>
          </svg>
        </div>

        {/* Hotel Details */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Ohio Hotel</h2>
          <p className="text-gray-600 text-sm">
            D-124, Central Avenue, Block G, South City I, Sector 41, Gurugram, Haryana 122003
          </p>
        </div>
      </div>

      {/* Booking Information */}
      <div className="bg-white mx-4 mt-4 rounded-lg p-4 shadow-sm">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-gray-500 text-sm mb-1">Check-in date</p>
            <p className="font-semibold text-gray-800">16/07/24</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">Check-out date</p>
            <p className="font-semibold text-gray-800">29/07/24</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-gray-500 text-sm mb-1">No. of people</p>
            <p className="font-semibold text-gray-800">02</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">Room number</p>
            <p className="font-semibold text-gray-800">B-6</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500 text-sm mb-1">Booking ID</p>
            <p className="font-semibold text-gray-800">ABC123</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">Payment</p>
            <p className="font-semibold text-orange-500">Paid</p>
          </div>
        </div>
      </div>

      {/* Wi-Fi Details */}
      <div className="bg-white mx-4 mt-4 rounded-lg p-4 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">Wi-fi details</h3>
        
        <div className="mb-4">
          <p className="text-gray-500 text-sm mb-2">Name</p>
          <div className="flex items-center justify-between">
            <p className="font-medium text-gray-800">Name Ohio hotels</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-500 text-sm mb-2">Password</p>
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
            <p className="font-medium text-gray-800">ABCD1234</p>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard('ABCD1234')}
              className="h-8 w-8"
            >
              <Copy size={16} />
            </Button>
          </div>
        </div>

        <Button 
          className="w-full bg-blue-900 hover:bg-blue-800 text-white py-3 rounded-lg"
          onClick={onContinue}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default BookingDetails;
