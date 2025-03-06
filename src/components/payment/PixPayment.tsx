
import React, { useState, useEffect } from 'react';
import { usePayment } from '@/contexts/PaymentContext';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QrCode, Copy, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

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
  const { generatePixPayment, isLoading } = usePayment();
  const [pixData, setPixData] = useState<{
    qrCode: string;
    qrCodeBase64: string;
    expirationDate: Date;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // If props are provided directly, use them to initialize the component
  useEffect(() => {
    if (qrCodeBase64 && (qrCodeText || qrCode) && expirationDate) {
      setPixData({
        qrCode: qrCodeText || qrCode || "",
        qrCodeBase64,
        expirationDate: new Date(expirationDate)
      });
    }
  }, [qrCodeBase64, qrCodeText, qrCode, expirationDate]);

  const generatePix = async () => {
    if (!amount || !description) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const data = await generatePixPayment(amount, description);
      if (data.qrCode && data.qrCodeBase64 && data.expirationDate) {
        setPixData({
          qrCode: data.qrCode,
          qrCodeBase64: data.qrCodeBase64,
          expirationDate: data.expirationDate
        });
      } else {
        throw new Error('Dados PIX incompletos');
      }
    } catch (err) {
      setError('Não foi possível gerar o QR Code PIX. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (pixData?.qrCode) {
      navigator.clipboard.writeText(pixData.qrCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  // Formatar valor
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Formatar data de expiração
  const formatExpirationDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const renderQrCode = () => {
    if (!pixData) return null;
    
    return (
      <div className="flex flex-col items-center text-center">
        <div className="bg-white p-4 rounded-lg mb-3">
          <img 
            src={`data:image/png;base64,${pixData.qrCodeBase64}`} 
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
                {pixData.qrCode}
              </div>
              <Button 
                variant="outline" 
                className="rounded-l-none" 
                onClick={copyToClipboard}
              >
                {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div className="mt-4 text-center space-y-1">
            {amount && <p className="text-sm font-medium">Valor: {formatCurrency(amount)}</p>}
            <p className="text-xs text-muted-foreground">
              Válido até: {formatExpirationDate(pixData.expirationDate)}
            </p>
          </div>
        </div>
      </div>
    );
  };

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
          renderQrCode()
        ) : (
          <div className="text-center py-6">
            <QrCode className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">
              Clique no botão abaixo para gerar um QR Code PIX
            </p>
          </div>
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
