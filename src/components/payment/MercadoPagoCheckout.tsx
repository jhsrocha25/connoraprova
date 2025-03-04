
import React, { useState } from 'react';
import { usePayment } from '@/contexts/PaymentContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, Landmark, QrCode, ShieldCheck, AlertCircle } from 'lucide-react';
import PaymentForm from './PaymentForm';
import PixPayment from './PixPayment';
import BoletoPayment from './BoletoPayment';

interface MercadoPagoCheckoutProps {
  amount: number;
  description: string;
  onSuccess?: () => void;
}

const MercadoPagoCheckout: React.FC<MercadoPagoCheckoutProps> = ({ 
  amount, 
  description,
  onSuccess 
}) => {
  const { isLoading } = usePayment();
  const [paymentTab, setPaymentTab] = useState('card');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Escolha a forma de pagamento</CardTitle>
          <CardDescription>
            Pague de forma rápida e segura utilizando o Mercado Pago
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={paymentTab} onValueChange={setPaymentTab}>
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="card">
                <CreditCard className="h-4 w-4 mr-2" />
                Cartão
              </TabsTrigger>
              <TabsTrigger value="pix">
                <QrCode className="h-4 w-4 mr-2" />
                PIX
              </TabsTrigger>
              <TabsTrigger value="boleto">
                <Landmark className="h-4 w-4 mr-2" />
                Boleto
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="card">
              <PaymentForm />
            </TabsContent>
            
            <TabsContent value="pix">
              <PixPayment 
                amount={amount} 
                description={description}
                onSuccess={onSuccess}
              />
            </TabsContent>
            
            <TabsContent value="boleto">
              <BoletoPayment 
                amount={amount} 
                description={description}
                onSuccess={onSuccess}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Alert className="bg-muted/50 border-muted">
        <ShieldCheck className="h-4 w-4 text-green-500" />
        <AlertDescription className="text-sm text-muted-foreground">
          As transações são processadas de forma segura pelo Mercado Pago.
          Seus dados são criptografados e protegidos conforme os padrões PCI DSS.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default MercadoPagoCheckout;
