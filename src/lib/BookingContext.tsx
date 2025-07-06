import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Booking {
  service: string;
  items: string[];
  turnaround: string;
  cost: string;
  estimatedTime: string;
  requestId: string;
  timestamp?: string;
  paymentMethod: 'card' | 'reception';
  paymentStatus: 'paid' | 'pending';
}

interface BookingContextType {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const addBooking = (booking: Booking) => {
    setBookings(prev => [booking, ...prev]);
  };

  return (
    <BookingContext.Provider value={{ bookings, addBooking }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (!context) throw new Error('useBookings must be used within a BookingProvider');
  return context;
}; 