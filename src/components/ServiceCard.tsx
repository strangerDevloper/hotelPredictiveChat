
import React from 'react';

interface ServiceCardProps {
  title: string;
  icon: string;
  description?: string;
}

const ServiceCard = ({ title, icon, description }: ServiceCardProps) => {
  return (
    <div className="flex-shrink-0 w-40 h-32 bg-white rounded-2xl shadow-lg p-4 flex flex-col items-center justify-center mx-3 border border-gray-100">
      <div className="text-4xl mb-2">{icon}</div>
      <h3 className="text-sm font-medium text-gray-800 text-center leading-tight">{title}</h3>
      {description && (
        <p className="text-xs text-gray-500 text-center mt-1">{description}</p>
      )}
    </div>
  );
};

export default ServiceCard;
