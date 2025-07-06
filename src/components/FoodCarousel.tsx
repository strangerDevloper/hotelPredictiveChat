import React from 'react';
import { Carousel, CarouselContent, CarouselItem } from './ui/carousel';

const foodItems = [
  {
    label: 'Pasta',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
  },
  {
    label: 'Sandwich',
    image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80',
  },
];

const FoodCarousel = () => {
  return (
    <Carousel className="w-full max-w-full">
      <CarouselContent className="-ml-0">
        {foodItems.map((item, idx) => (
          <CarouselItem key={item.label} className="pl-0 flex justify-center">
            <div className="w-[160px] h-[180px] bg-white rounded-2xl border border-gray-200 flex flex-col items-center justify-center shadow-md">
              <img
                src={item.image}
                alt={item.label}
                className="w-24 h-24 object-cover rounded-full mb-2 border-4 border-white shadow"
                draggable={false}
              />
              <div className="text-base font-medium text-gray-800 mt-1">{item.label}</div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default FoodCarousel; 