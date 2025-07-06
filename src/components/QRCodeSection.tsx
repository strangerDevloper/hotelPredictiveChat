import React from 'react';
import { QrCode } from 'lucide-react';

const QRCodeSection = () => {
  return (
    <div className="flex justify-center w-full">
      <div className="bg-blue-50 rounded-2xl p-4 border-4 border-blue-200 flex items-center justify-center" style={{ width: 200, height: 200 }}>
        {/* Replace with actual QR code if available */}
        <QrCode size={140} className="text-gray-800" />
      </div>
    </div>
  );
};

export default QRCodeSection;
