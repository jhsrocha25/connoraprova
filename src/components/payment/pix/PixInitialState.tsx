
import React from 'react';
import { QrCode } from 'lucide-react';

const PixInitialState: React.FC = () => {
  return (
    <div className="text-center py-6">
      <QrCode className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
      <p className="text-muted-foreground mb-4">
        Clique no botão abaixo para gerar um QR Code PIX
      </p>
    </div>
  );
};

export default PixInitialState;
