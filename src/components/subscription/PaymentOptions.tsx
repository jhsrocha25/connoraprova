
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, CheckCircle, QrCode, Landmark, Loader2 } from 'lucide-react';
import PixPayment from '@/components/payment/PixPayment';
import BoletoPayment from '@/components/payment/BoletoPayment';
import PaymentForm from '@/components/payment/PaymentForm';
import { PaymentMethod, SubscriptionPlan } from '@/lib/types';

interface PaymentOptionsProps {
  paymentTab: string;
  setPaymentTab: (tab: string) => void;
  paymentMethods: PaymentMethod[];
  selectedPaymentMethod: string | null;
  setSelectedPaymentMethod: (id: string) => void;
  isProcessing: boolean;
  sessionExpired: boolean;
  handleComplete: () => Promise<void>;
  handleResetSession: () => void;
  handlePixPayment: () => Promise<void>;
  handleBoletoPayment: () => Promise<void>;
  pixData: any;
  boletoData: any;
  selectedPlan: SubscriptionPlan;
  priceDetails: {
    originalPrice: number;
    discount: number;
    finalPrice: number;
  };
}

const PaymentOptions: React.FC<PaymentOptionsProps> = ({
  paymentTab,
  setPaymentTab,
  paymentMethods,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  isProcessing,
  sessionExpired,
  handleComplete,
  handleResetSession,
  handlePixPayment,
  handleBoletoPayment,
  pixData,
  boletoData,
  selectedPlan,
  priceDetails
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Forma de Pagamento</CardTitle>
          <CardDescription>
            Escolha como deseja pagar sua assinatura
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={paymentTab} onValueChange={setPaymentTab}>
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="card">Cartão Salvo</TabsTrigger>
              <TabsTrigger value="new-card">Novo Cartão</TabsTrigger>
              <TabsTrigger value="pix">PIX</TabsTrigger>
              <TabsTrigger value="boleto">Boleto</TabsTrigger>
            </TabsList>
            
            <TabsContent value="card">
              {paymentMethods.filter(m => m.type === 'credit' || m.type === 'debit').length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">Você não tem cartões salvos</p>
                  <Button onClick={() => setPaymentTab('new-card')}>
                    Adicionar Novo Cartão
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {paymentMethods
                    .filter(m => m.type === 'credit' || m.type === 'debit')
                    .map((method) => (
                      <div 
                        key={method.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors
                          ${selectedPaymentMethod === method.id || (!selectedPaymentMethod && method.isDefault) 
                            ? 'border-primary bg-primary/5' 
                            : 'hover:bg-muted/50'
                          }`}
                        onClick={() => setSelectedPaymentMethod(method.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                              <CreditCard className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">
                                {method.type === 'credit' ? 'Cartão de Crédito' : 'Cartão de Débito'}
                                {method.brand && ` • ${method.brand.toUpperCase()}`}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                •••• {method.last4} • Expira em {method.expiryMonth}/{method.expiryYear}
                              </p>
                            </div>
                          </div>
                          
                          {(selectedPaymentMethod === method.id || (!selectedPaymentMethod && method.isDefault)) && (
                            <CheckCircle className="h-5 w-5 text-primary" />
                          )}
                        </div>
                      </div>
                    ))}

                  <div className="mt-6">
                    <Button 
                      onClick={handleComplete} 
                      className="w-full"
                      disabled={isProcessing || sessionExpired || (!selectedPaymentMethod && !paymentMethods.find(m => m.isDefault))}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        <>
                          Finalizar Pagamento
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="new-card">
              <PaymentForm />
              <div className="mt-6">
                <Button 
                  onClick={handleComplete} 
                  className="w-full"
                  disabled={isProcessing || sessionExpired}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      Finalizar Pagamento
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="pix">
              {pixData ? (
                <PixPayment 
                  qrCodeBase64={pixData.qrCodeBase64}
                  qrCodeText={pixData.qrCode}
                  expirationDate={pixData.expirationDate}
                  amount={priceDetails?.finalPrice}
                  description={`Assinatura ${selectedPlan?.name || ''}`}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                    <QrCode className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium">Pagamento via PIX</h3>
                  <p className="text-center text-muted-foreground max-w-md">
                    Pague instantaneamente usando o QR Code PIX. O pagamento é processado em segundos.
                  </p>
                  <Button 
                    onClick={handlePixPayment}
                    disabled={isProcessing || sessionExpired}
                    className="mt-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Gerando PIX...
                      </>
                    ) : (
                      <>
                        Gerar QR Code PIX
                      </>
                    )}
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="boleto">
              {boletoData ? (
                <BoletoPayment 
                  barcodeContent={boletoData.barcodeContent}
                  boletoUrl={boletoData.boletoUrl}
                  expirationDate={boletoData.expirationDate}
                  amount={priceDetails?.finalPrice}
                  description={`Assinatura ${selectedPlan?.name || ''}`}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                    <Landmark className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium">Pagamento via Boleto</h3>
                  <p className="text-center text-muted-foreground max-w-md">
                    Gere um boleto bancário para pagar em qualquer agência bancária, lotérica ou internet banking.
                    O prazo de compensação é de até 3 dias úteis.
                  </p>
                  <Button 
                    onClick={handleBoletoPayment}
                    disabled={isProcessing || sessionExpired}
                    className="mt-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Gerando Boleto...
                      </>
                    ) : (
                      <>
                        Gerar Boleto
                      </>
                    )}
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {sessionExpired && (
        <Alert variant="destructive">
          <AlertDescription className="flex flex-col space-y-2">
            <span>Sua sessão de pagamento expirou. Por favor, reinicie o processo.</span>
            <Button size="sm" onClick={handleResetSession} variant="outline">
              Reiniciar Sessão
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default PaymentOptions;
