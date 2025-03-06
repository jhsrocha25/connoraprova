
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CheckCircle, Copy } from 'lucide-react';

interface PixQRCodeProps {
  qrCodeBase64: string;
  qrCode: string;
  amount?: number;
  expirationDate: Date;
  onCopy: () => void;
  copied: boolean;
  formatCurrency: (value: number) => string;
  formatExpirationDate: (date: Date) => string;
}

const PixQRCode: React.FC<PixQRCodeProps> = ({
  qrCodeBase64,
  qrCode,
  amount,
  expirationDate,
  onCopy,
  copied,
  formatCurrency,
  formatExpirationDate,
}) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="bg-white p-4 rounded-lg mb-3">
        <img 
          src={`data:image/png;base64,${qrCodeBase64}`} 
          alt="QR Code PIX" 
          className="w-48 h-48"
        />
      </div>
      
      <div className="space-y-4 w-full">
        <Alert className="bg-muted/50">
          <AlertDescription className="text-sm">
            Escaneie o QR Code acima com o app do seu banco ou copie o código PIX abaixo
          </AlertDescription>
        </Alert>
        
        <div className="flex flex-col space-y-2">
          <span className="text-xs text-muted-foreground">Código PIX</span>
          <div className="flex items-center">
            <div className="bg-muted p-2 px-3 rounded-l-md flex-1 text-sm truncate">
              {qrCode}
            </div>
            <Button 
              variant="outline" 
              className="rounded-l-none" 
              onClick={onCopy}
            >
              {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        <div className="mt-4 text-center space-y-1">
          {amount && <p className="text-sm font-medium">Valor: {formatCurrency(amount)}</p>}
          <p className="text-xs text-muted-foreground">
            Válido até: {formatExpirationDate(expirationDate)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PixQRCode;
