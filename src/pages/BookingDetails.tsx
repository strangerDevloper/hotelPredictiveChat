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
      <div className="bg-black text-white text-sm py-2 px-4 flex justify-between items-center flex-none">
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

      {/* Welcome & Hotel Section - Fixed/Sticky */}
      <div className="flex-none px-4 pt-4 pb-2 bg-gray-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="mb-2"
        >
          <ArrowLeft size={24} />
        </Button>
        <div className="text-center mb-2">
          <h1 className="text-xl font-semibold text-gray-800 mb-1">
            Welcome to Ohio Hotel
          </h1>
          <p className="text-gray-600 text-sm">
            We are thrilled to have you Ester Howard
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-2 flex flex-col items-center mb-2">
          <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=120&fit=crop&crop=center" alt="Ohio Hotel" className="w-full h-24 object-cover rounded-lg mb-2" />
          <h2 className="text-base font-semibold text-gray-800 mb-1">Ohio Hotel</h2>
          <p className="text-xs text-gray-500 mb-2 text-center">D-124, Central Avenue, Block G, South City I, Sector 41, Gurugram, Haryana 122003</p>
          <div className="grid grid-cols-2 gap-4 w-full text-xs text-gray-700 mt-2">
            <div>
              <div className="font-medium">Check-in date</div>
              <div className="font-bold">16/07/24</div>
            </div>
            <div>
              <div className="font-medium">Check-out date</div>
              <div className="font-bold">29/07/24</div>
            </div>
            <div>
              <div className="font-medium">No. of people</div>
              <div className="font-bold">02</div>
            </div>
            <div>
              <div className="font-medium">Room number</div>
              <div className="font-bold">B-6</div>
            </div>
            <div>
              <div className="font-medium">Booking ID</div>
              <div className="font-bold">ABC123</div>
            </div>
            <div>
              <div className="font-medium">Payment</div>
              <div className="font-bold text-orange-500">Paid</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {/* Wi-Fi Details */}
        <div className="bg-white rounded-xl shadow p-4 mb-4">
          <h3 className="font-semibold text-gray-800 mb-2">Wi-fi details</h3>
          <div className="mb-2">
            <div className="text-xs text-gray-500">Name</div>
            <div className="font-medium text-gray-800 text-sm">Name Ohio hotels</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Password</div>
            <div className="flex items-center bg-gray-50 p-2 rounded-lg">
              <div className="font-medium text-gray-800 text-sm">ABCD1234</div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyToClipboard('ABCD1234')}
                className="h-6 w-6 ml-2"
              >
                <Copy size={16} />
              </Button>
            </div>
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
