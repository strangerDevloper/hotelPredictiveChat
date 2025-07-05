import React, { useState } from 'react';
import { ArrowLeft, Copy, Send, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ConciergeHomeProps {
  onBack: () => void;
  onOpenChat: () => void;
}

const ConciergeHome = ({ onBack, onOpenChat }: ConciergeHomeProps) => {
  const serviceCategories = [
    {
      id: 'most-popular',
      name: 'Most popular',
      active: true,
      services: [
        { icon: '🍽️', text: "What's available for breakfast?" },
        { icon: '🍽️', text: "Could I get today's lunch/dinner menu?" },
        { icon: '🦷', text: "Can you send a dental kit to my room?" },
        { icon: '🧹', text: "Could I get my room cleaned, please?" },
        { icon: '📶', text: "What are the Wi-Fi login details?" },
        { icon: '🗺️', text: "Can I get directions to [specific location]?" },
      ]
    },
    {
      id: 'room-service',
      name: 'Room Service',
      active: false,
      services: [
        { icon: '🍕', text: "I'd like to order room service for dinner" },
        { icon: '☕', text: "Can I get coffee and pastries delivered?" },
        { icon: '🍾', text: "Please send champagne to celebrate" },
        { icon: '🥗', text: "I need a healthy meal option" },
        { icon: '🍰', text: "Can you arrange a birthday cake?" },
        { icon: '🍹', text: "I'd like to order cocktails for my room" },
      ]
    },
    {
      id: 'housekeeping',
      name: 'Housekeeping & Amenities',
      active: false,
      services: [
        { icon: '🧹', text: "Please clean my room now" },
        { icon: '🛏️', text: "I need fresh towels and bed sheets" },
        { icon: '🧴', text: "Can you refill the bathroom amenities?" },
        { icon: '🗑️', text: "Please empty the trash bins" },
        { icon: '🌡️', text: "The air conditioning needs adjustment" },
        { icon: '💡', text: "There's a burnt bulb that needs replacing" },
      ]
    },
    {
      id: 'dining',
      name: 'Dining & Reservations',
      active: false,
      services: [
        { icon: '🍽️', text: "I'd like to make a dinner reservation" },
        { icon: '🥂', text: "Can you book a table at the rooftop bar?" },
        { icon: '👥', text: "I need a table for 6 people tonight" },
        { icon: '🎂', text: "Can you arrange a special anniversary dinner?" },
        { icon: '🍷', text: "What wine pairings do you recommend?" },
        { icon: '📅', text: "I want to book breakfast for tomorrow" },
      ]
    },
    {
      id: 'special-requests',
      name: 'Special Requests',
      active: false,
      services: [
        { icon: '🚗', text: "Can you arrange airport transportation?" },
        { icon: '💆', text: "I'd like to book a spa appointment" },
        { icon: '🎭', text: "What local attractions do you recommend?" },
        { icon: '👔', text: "I need laundry and pressing service" },
        { icon: '💐', text: "Can you arrange flowers for my room?" },
        { icon: '🎵', text: "I need help with event planning" },
      ]
    }
  ];

  const [activeCategory, setActiveCategory] = useState('most-popular');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getCurrentServices = () => {
    return serviceCategories.find(cat => cat.id === activeCategory)?.services || [];
  };

  const handleLogout = () => {
    console.log('User logged out');
    onBack();
  };

  return (
    <div className="min-h-screen bg-gray-50">
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

      {/* Header */}
      <div className="bg-white px-4 py-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-lg font-semibold text-gray-800">Good Morning!</h1>
            <p className="text-gray-600 text-sm">Esther Howard</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-10 h-10 p-0 rounded-full bg-gray-300">
                <User className="w-4 h-4" />
                <span className="sr-only">Profile menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Hotel Image */}
        <div className="mb-4">
          <img 
            src="/lovable-uploads/c60c5ef5-713e-4b37-aa84-a93ae4229a1a.png"
            alt="Ohio Hotel"
            className="w-full h-40 object-cover rounded-lg"
          />
        </div>

        {/* Hotel Info */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">Ohio Hotel</h2>
          <p className="text-gray-600 text-xs mb-3">
            D-124, Central Avenue, Block G, South City I, Sector 41, Gurugram, Haryana 122003
          </p>
          
          <div className="flex space-x-8">
            <div>
              <p className="text-gray-500 text-xs">Check-out date</p>
              <p className="font-semibold text-gray-800 text-sm">29/07/24</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Room number</p>
              <p className="font-semibold text-gray-800 text-sm">B-6</p>
            </div>
          </div>
        </div>
      </div>

      {/* Wi-Fi Details */}
      <div className="bg-white mx-4 mt-4 rounded-lg p-4 shadow-sm">
        <h3 className="font-medium text-gray-800 mb-3">Wi-fi details</h3>
        
        <div className="mb-3">
          <p className="text-gray-500 text-xs mb-1">Name</p>
          <p className="font-medium text-gray-800 text-sm">Name Ohio hotels</p>
        </div>

        <div className="mb-3">
          <p className="text-gray-500 text-xs mb-1">Password</p>
          <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
            <p className="font-medium text-gray-800 text-sm">ABCD1234</p>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard('ABCD1234')}
              className="h-6 w-6"
            >
              <Copy size={12} />
            </Button>
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="mx-4 mt-4 pb-20">
        <h3 className="font-medium text-gray-800 mb-3">Services</h3>

        <div className="flex space-x-2 mb-4 overflow-x-auto">
          {serviceCategories.map((category) => (
            <Button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`${
                activeCategory === category.id
                  ? 'bg-blue-900 hover:bg-blue-800 text-white'
                  : 'bg-white hover:bg-gray-50 text-gray-600 border border-gray-200'
              } text-xs px-3 py-1 h-8 rounded-full whitespace-nowrap`}
            >
              {category.name}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {getCurrentServices().map((service, index) => (
            <div key={index} className="bg-white p-3 rounded-lg shadow-sm">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                <span className="text-blue-600">{service.icon}</span>
              </div>
              <p className="text-gray-800 text-xs">{service.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Ask me anything input - Fixed at bottom */}
      <div className="fixed bottom-4 left-4 right-4">
        <div className="bg-white rounded-full shadow-lg flex items-center px-4 py-2">
          <input
            type="text"
            placeholder="Ask me anything"
            className="flex-1 outline-none text-sm"
            onFocus={onOpenChat}
            readOnly
          />
          <Button size="icon" className="h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700" onClick={onOpenChat}>
            <Send size={12} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConciergeHome;
