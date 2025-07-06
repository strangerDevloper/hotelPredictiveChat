import React from 'react';

interface ServiceCardProps {
  title: string;
  icon: string;
  description?: string;
}

const ServiceCard = ({ title, icon, description }: ServiceCardProps) => {
  return (
    <div className="flex-shrink-0 w-36 h-28 bg-white rounded-2xl shadow-lg p-3 flex flex-col items-center justify-center mx-2 border border-gray-100 active:scale-95 transition-transform duration-150">
      <div className="text-3xl mb-1">{icon}</div>
      <h3 className="text-xs font-medium text-gray-800 text-center leading-tight">{title}</h3>
      {description && (
        <p className="text-xs text-gray-500 text-center mt-1 leading-tight">{description}</p>
      )}
    </div>
  );
};

export default ServiceCard;
