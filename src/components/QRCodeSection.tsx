
import React from 'react';
import { QrCode } from 'lucide-react';

const QRCodeSection = () => {
  return (
    <div className="bg-blue-50 rounded-3xl p-8 mx-6 mb-8">
      <div className="flex justify-center mb-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <QrCode size={120} className="text-gray-800" />
        </div>
      </div>
      <p className="text-gray-700 text-center leading-relaxed">
        Scan the code provided in your room<br />
        to access all hotel services.
      </p>
    </div>
  );
};

export default QRCodeSection;
