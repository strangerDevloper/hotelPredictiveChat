import React, { useState } from 'react';
import { ArrowLeft, Copy, Send, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useBookings } from '../lib/BookingContext';

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
  const { bookings } = useBookings();

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
    <div className="min-h-screen flex flex-col bg-gray-50 safe-area-top safe-area-bottom">
      {/* Status bar */}
      <div className="bg-black text-white text-sm py-2 px-4 flex justify-between items-center flex-none">
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

      {/* Hotel Section - Fixed/Sticky */}
      <div className="flex-none px-4 pt-4 pb-2 bg-gray-50">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">Good Morning!</h1>
            <p className="text-gray-700 text-base font-medium">Esther Howard</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-12 h-12 p-0 rounded-full bg-gray-200 min-w-[48px] min-h-[48px] shadow-md">
                <img src="/lovable-uploads/hotel-image.jpg" alt="Avatar" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow" />
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
        {/* Hotel Image and Info Card */}
        <div className="bg-white rounded-2xl shadow-lg p-4 flex flex-col items-center mb-4">
          <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=120&fit=crop&crop=center" alt="Ohio Hotel" className="w-full h-28 object-cover rounded-xl mb-3" />
          <h2 className="text-lg font-bold text-gray-900 mb-1">Ohio Hotel</h2>
          <p className="text-xs text-gray-500 mb-3 text-center px-2">D-124, Central Avenue, Block G, South City I, Sector 41, Gurugram, Haryana 122003</p>
          <div className="flex w-full justify-between text-xs text-gray-700 mt-2">
            <div>
              <div className="font-semibold">Check-out date</div>
              <div className="font-bold text-base">29/07/24</div>
            </div>
            <div>
              <div className="font-semibold">Room number</div>
              <div className="font-bold text-base">B-6</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-32 scroll-container">
        {/* Wi-Fi Details */}
        <div className="bg-white rounded-2xl shadow-lg p-5 mb-5">
          <h3 className="font-bold text-gray-900 mb-3">Wi-fi details</h3>
          <div className="mb-3">
            <div className="text-xs text-gray-500">Name</div>
            <div className="font-semibold text-gray-900 text-sm">Ohio hotels</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Password</div>
            <div className="flex items-center bg-gray-100 p-3 rounded-lg">
              <div className="font-semibold text-gray-900 text-sm tracking-widest">ABCD1234</div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyToClipboard('ABCD1234')}
                className="h-8 w-8 ml-2 min-w-[32px] min-h-[32px]"
              >
                <Copy size={14} />
              </Button>
            </div>
          </div>
        </div>
        {/* My Bookings Section */}
        {bookings.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-5 mb-5">
            <h3 className="font-bold text-gray-900 mb-3">My Bookings</h3>
            <div className="space-y-4">
              {bookings.map((b) => (
                <div key={b.requestId} className="border-b last:border-b-0 pb-3 last:pb-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-blue-900">{b.service}</span>
                    <span className="text-xs text-gray-500">{b.estimatedTime}</span>
                  </div>
                  <div className="text-sm text-gray-700 mb-1">{b.items.join(', ')}</div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Turnaround: {b.turnaround}</span>
                    <span>Cost: {b.cost}</span>
                  </div>
                  <div className="text-xs font-semibold mt-1">
                    {b.paymentMethod === 'reception' ? (
                      <span className="text-yellow-700">To be paid at reception</span>
                    ) : b.paymentStatus === 'paid' ? (
                      <span className="text-green-700">Paid</span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Services */}
        <div>
          <h3 className="font-bold text-gray-900 mb-3">Services</h3>
          <div className="flex space-x-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
            {serviceCategories.map((category) => (
              <Button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={
                  `text-xs px-5 py-2 h-9 rounded-full whitespace-nowrap min-w-fit font-medium transition-all duration-150 ` +
                  (activeCategory === category.id
                    ? 'bg-blue-900 text-white border-none'
                    : 'bg-white text-gray-800 border border-gray-300')
                }
              >
                {category.name}
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {getCurrentServices().map((service, index) => (
              <div key={index} className="bg-white p-5 rounded-2xl shadow-md active:scale-95 transition-transform duration-150 flex flex-col items-start">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
                  <span className="text-blue-700 text-2xl">{service.icon}</span>
                </div>
                <p className="text-gray-900 text-sm font-medium leading-tight">{service.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Input - Fixed at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg z-20 safe-area-bottom">
        <div className="bg-gray-100 rounded-full shadow flex items-center px-5 py-3">
          <input
            type="text"
            placeholder="Ask me anything"
            className="flex-1 outline-none text-base min-h-[44px] bg-transparent font-medium"
            onFocus={onOpenChat}
            readOnly
          />
          <Button size="icon" className="h-11 w-11 rounded-full bg-blue-600 hover:bg-blue-700 min-w-[44px] min-h-[44px] shadow-md" onClick={onOpenChat}>
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConciergeHome;
