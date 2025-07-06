import React from 'react';
import { Carousel, CarouselContent, CarouselItem } from './ui/carousel';
import ServiceCard from './ServiceCard';

const services = [
  { title: "Dental Kit", icon: "🦷", description: "Complete oral care" },
  { title: "Fresh Towels", icon: "🏨", description: "Clean & soft" },
  { title: "Room Service", icon: "🍽️", description: "24/7 dining" },
  { title: "Laundry", icon: "👔", description: "Same day service" },
  { title: "Spa Services", icon: "💆", description: "Relaxation & wellness" },
  { title: "Concierge", icon: "🛎️", description: "Personal assistance" },
  { title: "Gym Access", icon: "💪", description: "Fitness center" },
  { title: "Pool Towels", icon: "🏊", description: "Poolside comfort" }
];

const ServiceCarousel = () => {
  return (
    <Carousel className="w-full max-w-full">
      <CarouselContent className="-ml-0">
        {services.map((service, idx) => (
          <CarouselItem key={service.title} className="pl-0 flex justify-center">
            <ServiceCard {...service} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default ServiceCarousel; 