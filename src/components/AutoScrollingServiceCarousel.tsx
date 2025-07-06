import React from 'react';
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

const AutoScrollingServiceCarousel = () => {
  return (
    <div className="w-full overflow-hidden">
      <div className="flex w-max animate-scroll-left gap-4" style={{ animationDuration: '18s' }}>
        {/* First set of cards */}
        {services.map((service, idx) => (
          <div key={`first-${idx}`} className="flex-shrink-0 w-40">
            <ServiceCard {...service} />
          </div>
        ))}
        {/* Duplicate set for seamless loop */}
        {services.map((service, idx) => (
          <div key={`second-${idx}`} className="flex-shrink-0 w-40">
            <ServiceCard {...service} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AutoScrollingServiceCarousel; 