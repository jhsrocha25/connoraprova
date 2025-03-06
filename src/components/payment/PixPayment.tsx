
import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, AlertCircle, Loader2 } from 'lucide-react';
import { usePixPayment } from './pix/usePixPayment';
import PixQRCode from './pix/PixQRCode';
import PixInitialState from './pix/PixInitialState';

interface PixPaymentProps {
  amount?: number;
  description?: string;
  onSuccess?: () => void;
  qrCodeBase64?: string;
  qrCodeText?: string;
  qrCode?: string;
  expirationDate?: Date;
}

const PixPayment: React.FC<PixPaymentProps> = ({ 
  amount, 
  description, 
  onSuccess,
  qrCodeBase64,
  qrCodeText,
  qrCode,
  expirationDate
}) => {
  const {
    pixData,
    copied,
    error,
    isGenerating,
    generatePix,
    copyToClipboard,
    formatCurrency,
    formatExpirationDate
  } = usePixPayment(amount, description, qrCodeBase64, qrCodeText, qrCode, expirationDate);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5 text-primary" />
          Pagamento via PIX
        </CardTitle>
        <CardDescription>
          Pague instantaneamente usando o QR Code ou código PIX
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {pixData ? (
          <PixQRCode 
            qrCodeBase64={pixData.qrCodeBase64}
            qrCode={pixData.qrCode}
            amount={amount}
            expirationDate={pixData.expirationDate}
            onCopy={copyToClipboard}
            copied={copied}
            formatCurrency={formatCurrency}
            formatExpirationDate={formatExpirationDate}
          />
        ) : (
          <PixInitialState />
        )}
      </CardContent>
      
      <CardFooter className="flex justify-center">
        {!pixData ? (
          <Button 
            onClick={generatePix} 
            disabled={isGenerating || !amount || !description}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando PIX...
              </>
            ) : (
              <>
                <QrCode className="mr-2 h-4 w-4" />
                Gerar QR Code PIX
              </>
            )}
          </Button>
        ) : (
          <Button 
            variant="outline" 
            onClick={generatePix} 
            disabled={isGenerating || !amount || !description}
          >
            Gerar novo código
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PixPayment;
