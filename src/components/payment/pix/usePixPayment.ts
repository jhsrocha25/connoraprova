
import { useState, useEffect } from 'react';
import { usePayment } from '@/contexts/PaymentContext';

interface PixData {
  qrCode: string;
  qrCodeBase64: string;
  expirationDate: Date;
}

export const usePixPayment = (
  amount?: number,
  description?: string,
  qrCodeBase64?: string,
  qrCodeText?: string,
  qrCode?: string,
  expirationDate?: Date
) => {
  const { generatePixPayment } = usePayment();
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatExpirationDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  return {
    pixData,
    copied,
    error,
    isGenerating,
    generatePix,
    copyToClipboard,
    formatCurrency,
    formatExpirationDate
  };
};
