
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, Lock } from 'lucide-react';
import { usePayment } from '@/contexts/PaymentContext';
import { MERCADO_PAGO_PUBLIC_KEY } from '@/lib/mercadoPagoConfig';

const PaymentForm = () => {
  const { addPaymentMethod, isLoading, processCardPayment } = usePayment();

  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [paymentType, setPaymentType] = useState<'credit' | 'debit'>('credit');
  const [processingPayment, setProcessingPayment] = useState(false);

  const formatCardNumber = (value: string) => {
    // Remove any non-digit characters
    const cleaned = value.replace(/\D/g, '');
    
    // Limit to 16 digits
    const limited = cleaned.slice(0, 16);
    
    // Format with spaces every 4 digits
    const formatted = limited.replace(/(\d{4})(?=\d)/g, '$1 ');
    
    return formatted;
  };

  const detectCardBrand = (cardNumber: string): 'visa' | 'mastercard' | 'amex' | 'elo' | 'hipercard' | 'other' => {
    const cleaned = cardNumber.replace(/\D/g, '');
    
    if (cleaned.startsWith('4')) {
      return 'visa';
    } else if (/^5[1-5]/.test(cleaned)) {
      return 'mastercard';
    } else if (/^3[47]/.test(cleaned)) {
      return 'amex';
    } else if (/^(636368|438935|504175|451416|636297|5067|4576|4011)/.test(cleaned)) {
      return 'elo';
    } else if (/^(606282|3841)/.test(cleaned)) {
      return 'hipercard';
    } else {
      return 'other';
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardNumber(formattedValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!cardNumber || !cardName || !expiryMonth || !expiryYear || !cvv) {
      return;
    }
    
    setProcessingPayment(true);
    
    try {
      const cardNumberClean = cardNumber.replace(/\s/g, '');
      const brand = detectCardBrand(cardNumberClean);
      const last4 = cardNumberClean.slice(-4);
      
      // Processar o pagamento com Mercado Pago para validar o cartão
      await addPaymentMethod({
        type: paymentType,
        brand,
        last4,
        holderName: cardName,
        expiryMonth: parseInt(expiryMonth),
        expiryYear: parseInt(expiryYear),
        isDefault: true,
        cardNumber: cardNumberClean,
        securityCode: cvv
      });
      
      // Limpar formulário
      setCardNumber('');
      setCardName('');
      setExpiryMonth('');
      setExpiryYear('');
      setCvv('');
    } catch (error) {
      console.error("Erro ao processar cartão:", error);
    } finally {
      setProcessingPayment(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="paymentType">Tipo de Cartão</Label>
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <input 
              type="radio" 
              id="credit" 
              name="paymentType" 
              value="credit"
              checked={paymentType === 'credit'}
              onChange={() => setPaymentType('credit')}
              className="h-4 w-4"
            />
            <Label htmlFor="credit">Crédito</Label>
          </div>
          <div className="flex items-center space-x-2">
            <input 
              type="radio" 
              id="debit" 
              name="paymentType" 
              value="debit"
              checked={paymentType === 'debit'}
              onChange={() => setPaymentType('debit')}
              className="h-4 w-4"
            />
            <Label htmlFor="debit">Débito</Label>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cardNumber">Número do Cartão</Label>
        <div className="relative">
          <Input
            id="cardNumber"
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            onChange={handleCardNumberChange}
            required
            className="pl-10"
            maxLength={19} // 16 dígitos + 3 espaços
          />
          <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cardName">Nome no Cartão</Label>
        <Input
          id="cardName"
          placeholder="Nome como aparece no cartão"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expiryMonth">Mês</Label>
          <Select value={expiryMonth} onValueChange={setExpiryMonth}>
            <SelectTrigger>
              <SelectValue placeholder="MM" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => {
                const month = (i + 1).toString().padStart(2, '0');
                return (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="expiryYear">Ano</Label>
          <Select value={expiryYear} onValueChange={setExpiryYear}>
            <SelectTrigger>
              <SelectValue placeholder="AA" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 10 }, (_, i) => {
                const year = (new Date().getFullYear() + i).toString();
                return (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="cvv">CVV</Label>
          <div className="relative">
            <Input
              id="cvv"
              placeholder="123"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
              required
              className="pl-10"
              maxLength={4}
            />
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      <Alert className="bg-muted/50 border-muted">
        <AlertDescription className="flex items-center text-sm text-muted-foreground">
          <Lock className="h-4 w-4 mr-2" />
          Seus dados são processados de forma segura pelo Mercado Pago. Nenhuma informação de cartão é armazenada em nossos servidores.
        </AlertDescription>
      </Alert>

      <Button type="submit" className="w-full" disabled={isLoading || processingPayment}>
        {isLoading || processingPayment ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processando...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Adicionar Cartão
          </>
        )}
      </Button>
    </form>
  );
};

export default PaymentForm;
