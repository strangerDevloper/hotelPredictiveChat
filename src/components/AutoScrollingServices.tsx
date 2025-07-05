
import React from 'react';
import ServiceCard from './ServiceCard';

const AutoScrollingServices = () => {
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

  return (
    <div className="mb-8">
      <div className="overflow-hidden">
        <div className="flex animate-scroll-left">
          {/* First set of cards */}
          {services.map((service, index) => (
            <ServiceCard
              key={`first-${index}`}
              title={service.title}
              icon={service.icon}
              description={service.description}
            />
          ))}
          {/* Duplicate set for seamless loop */}
          {services.map((service, index) => (
            <ServiceCard
              key={`second-${index}`}
              title={service.title}
              icon={service.icon}
              description={service.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AutoScrollingServices;
