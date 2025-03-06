
import React, { useState, useEffect } from 'react';
import { usePayment } from '@/contexts/PaymentContext';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Landmark, Copy, CheckCircle, AlertCircle, Loader2, ExternalLink } from 'lucide-react';

interface BoletoPaymentProps {
  amount?: number;
  description?: string;
  onSuccess?: () => void;
  boletoUrl?: string;
  barcodeContent?: string;
  barcode?: string;
  expirationDate?: Date;
}

const BoletoPayment: React.FC<BoletoPaymentProps> = ({ 
  amount, 
  description, 
  onSuccess,
  boletoUrl,
  barcodeContent,
  barcode,
  expirationDate
}) => {
  const { generateBoletoPayment, isLoading } = usePayment();
  const [boletoData, setBoletoData] = useState<{
    boletoUrl: string;
    barcode: string;
    expirationDate: Date;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // If props are provided directly, use them to initialize the component
  useEffect(() => {
    if (boletoUrl && (barcodeContent || barcode) && expirationDate) {
      setBoletoData({
        boletoUrl,
        barcode: barcodeContent || barcode || "",
        expirationDate: new Date(expirationDate)
      });
    }
  }, [boletoUrl, barcodeContent, barcode, expirationDate]);

  const generateBoleto = async () => {
    if (!amount || !description) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const data = await generateBoletoPayment(amount, description);
      if (data.boletoUrl && data.barcodeContent && data.expirationDate) {
        setBoletoData({
          boletoUrl: data.boletoUrl,
          barcode: data.barcodeContent,
          expirationDate: data.expirationDate
        });
      } else {
        throw new Error('Dados do boleto incompletos');
      }
    } catch (err) {
      setError('Não foi possível gerar o boleto. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (boletoData?.barcode) {
      navigator.clipboard.writeText(boletoData.barcode);
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

  // Formatar data de vencimento
  const formatExpirationDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(date));
  };

  const renderBoletoInfo = () => {
    if (!boletoData) return null;
    
    return (
      <div className="space-y-4">
        <Alert className="bg-muted/50">
          <AlertDescription className="text-sm">
            Boleto gerado com sucesso. Você pode pagar online ou em qualquer agência bancária, casa lotérica ou internet banking.
          </AlertDescription>
        </Alert>
        
        <div className="p-4 border rounded-lg text-center">
          {amount && <div className="font-bold text-lg mb-2">{formatCurrency(amount)}</div>}
          <div className="text-sm text-muted-foreground">
            Vencimento: {formatExpirationDate(boletoData.expirationDate)}
          </div>
        </div>
        
        <div className="flex flex-col space-y-2">
          <span className="text-xs text-muted-foreground">Linha Digitável</span>
          <div className="flex items-center">
            <div className="bg-muted p-2 px-3 rounded-l-md flex-1 text-sm truncate">
              {boletoData.barcode}
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
        
        <Button 
          className="w-full" 
          variant="outline"
          onClick={() => window.open(boletoData.boletoUrl, '_blank')}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Visualizar Boleto
        </Button>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Landmark className="h-5 w-5 text-primary" />
          Pagamento via Boleto
        </CardTitle>
        <CardDescription>
          Gere um boleto bancário para pagamento
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {boletoData ? (
          renderBoletoInfo()
        ) : (
          <div className="text-center py-6">
            <Landmark className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">
              Clique no botão abaixo para gerar um boleto bancário
            </p>
            <p className="text-xs text-muted-foreground">
              O boleto pode levar até 3 dias úteis para ser compensado
            </p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-center">
        {!boletoData ? (
          <Button 
            onClick={generateBoleto} 
            disabled={isGenerating || !amount || !description}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando Boleto...
              </>
            ) : (
              <>
                <Landmark className="mr-2 h-4 w-4" />
                Gerar Boleto
              </>
            )}
          </Button>
        ) : (
          <Button 
            variant="outline" 
            onClick={generateBoleto} 
            disabled={isGenerating || !amount || !description}
          >
            Gerar novo boleto
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default BoletoPayment;
