import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, CreditCard, CheckCircle, Lock, QrCode, Landmark, Loader2, Timer } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { usePayment } from '@/contexts/PaymentContext';
import { useAuth } from '@/contexts/AuthContext';
import PaymentForm from '@/components/payment/PaymentForm';
import { Progress } from '@/components/ui/progress';
import PixPayment from '@/components/payment/PixPayment';
import BoletoPayment from '@/components/payment/BoletoPayment';
import { toast } from '@/hooks/use-toast';

const SubscriptionCheckout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { 
    selectedPlan, 
    paymentMethods, 
    createSubscription, 
    isLoading, 
    appliedCoupon,
    applyCoupon,
    generatePixPayment,
    generateBoletoPayment
  } = usePayment();
  
  const [couponCode, setCouponCode] = useState('');
  const [paymentTab, setPaymentTab] = useState('card');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [sessionTimeLeft, setSessionTimeLeft] = useState(900); // 15 minutes in seconds
  const [sessionExpired, setSessionExpired] = useState(false);
  const [pixData, setPixData] = useState<any>(null);
  const [boletoData, setBoletoData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!selectedPlan) {
      navigate('/subscription/plans');
    }
  }, [selectedPlan, navigate]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { 
        state: { 
          redirectAfterLogin: '/subscription/plans'
        } 
      });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (sessionTimeLeft <= 0) {
      setSessionExpired(true);
      toast({
        title: "Sessão expirada",
        description: "Sua sessão de pagamento expirou. Por favor, tente novamente.",
        variant: "destructive"
      });
      return;
    }

    const timer = setInterval(() => {
      setSessionTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionTimeLeft, toast]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleResetSession = () => {
    setSessionTimeLeft(900);
    setSessionExpired(false);
    setPixData(null);
    setBoletoData(null);
  };

  if (!selectedPlan) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container pt-24 pb-16">
          <div className="flex items-center justify-center h-[60vh]">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </main>
      </div>
    );
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setIsApplyingCoupon(true);
    const success = await applyCoupon(couponCode);
    setIsApplyingCoupon(false);
    
    if (success) {
      setCouponCode('');
    }
  };

  const handlePixPayment = async () => {
    if (!selectedPlan) return;
    
    setIsProcessing(true);
    try {
      const pixResponse = await generatePixPayment?.(priceDetails?.finalPrice || selectedPlan.price, `Assinatura ${selectedPlan.name}`);
      setPixData(pixResponse);
      setPaymentTab('pix');
    } catch (error) {
      console.error('Error generating PIX payment:', error);
      toast({
        variant: "destructive",
        title: "Erro ao gerar pagamento PIX",
        description: "Não foi possível gerar o pagamento. Tente novamente ou use outro método.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBoletoPayment = async () => {
    if (!selectedPlan) return;
    
    setIsProcessing(true);
    try {
      const boletoResponse = await generateBoletoPayment?.(priceDetails?.finalPrice || selectedPlan.price, `Assinatura ${selectedPlan.name}`);
      setBoletoData(boletoResponse);
      setPaymentTab('boleto');
    } catch (error) {
      console.error('Error generating boleto payment:', error);
      toast({
        variant: "destructive",
        title: "Erro ao gerar boleto",
        description: "Não foi possível gerar o boleto. Tente novamente ou use outro método.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleComplete = async () => {
    if (sessionExpired) {
      toast({
        variant: "destructive",
        title: "Sessão expirada",
        description: "Sua sessão expirou. Por favor, reinicie o processo.",
      });
      return;
    }

    let paymentMethodId;
    
    if (paymentTab === 'card' && paymentMethods.length > 0) {
      paymentMethodId = selectedPaymentMethod || paymentMethods.find(m => m.isDefault)?.id;
    }
    
    if (!paymentMethodId && paymentTab === 'card' && paymentMethods.length > 0) {
      toast({
        variant: "destructive",
        title: "Método de pagamento necessário",
        description: "Por favor, selecione um cartão ou adicione um novo.",
      });
      return;
    }
    
    setIsProcessing(true);
    try {
      await createSubscription(selectedPlan.id, paymentMethodId);
      navigate('/subscription/success');
    } catch (error) {
      console.error('Error creating subscription:', error);
      toast({
        variant: "destructive",
        title: "Erro ao processar assinatura",
        description: "Não foi possível criar sua assinatura. Tente novamente.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateTotal = () => {
    if (!selectedPlan) return 0;
    
    let total = selectedPlan.price;
    
    if (appliedCoupon) {
      const discount = total * (appliedCoupon.discountPercentage / 100);
      total -= discount;
    }
    
    return total;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const priceDetails = {
    originalPrice: selectedPlan.price,
    discount: appliedCoupon ? selectedPlan.price * (appliedCoupon.discountPercentage / 100) : 0,
    finalPrice: calculateTotal()
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            className="mb-6"
            onClick={() => navigate('/subscription/plans')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para planos
          </Button>
          
          <div className="mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Escolha do Plano</span>
              <span className="font-medium text-primary">Pagamento</span>
              <span className="text-muted-foreground">Confirmação</span>
            </div>
            <Progress value={66} className="h-2" />
          </div>

          <div className="mb-4 flex justify-center">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              sessionTimeLeft < 300 ? 'bg-red-100 text-red-800' : 'bg-primary/10 text-primary'
            }`}>
              <Timer className="h-4 w-4" />
              <span className="text-sm font-medium">
                Tempo restante: {formatTime(sessionTimeLeft)}
              </span>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold tracking-tight mb-8">Finalizar Assinatura</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
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
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>{selectedPlan.name}</span>
                      <span>{formatCurrency(selectedPlan.price)}</span>
                    </div>
                    
                    {appliedCoupon && (
                      <div className="flex justify-between text-green-600">
                        <span>Desconto ({appliedCoupon.code})</span>
                        <span>-{formatCurrency(priceDetails.discount)}</span>
                      </div>
                    )}
                    
                    <Separator />
                    
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>{formatCurrency(priceDetails.finalPrice)}</span>
                    </div>
                    
                    {selectedPlan.trialDays && (
                      <Alert className="bg-muted/50 border-muted mt-4">
                        <AlertDescription className="text-sm">
                          Inclui período de teste gratuito de {selectedPlan.trialDays} dias.
                          {' '}
                          {selectedPlan.trialDays === 7 ? 'A cobrança será feita após 7 dias.' : ''}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex-col space-y-4">
                  {!appliedCoupon && (
                    <div className="flex w-full space-x-2">
                      <Input
                        placeholder="Cupom de desconto"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                      />
                      <Button 
                        variant="outline" 
                        onClick={handleApplyCoupon}
                        disabled={isApplyingCoupon || !couponCode.trim() || sessionExpired}
                      >
                        {isApplyingCoupon ? 'Aplicando...' : 'Aplicar'}
                      </Button>
                    </div>
                  )}
                  
                  <div className="text-center text-xs text-muted-foreground">
                    Ao continuar, você concorda com os{' '}
                    <a href="/terms" className="underline hover:text-foreground">
                      Termos de Serviço
                    </a>
                    {' '}e{' '}
                    <a href="/privacy" className="underline hover:text-foreground">
                      Política de Privacidade
                    </a>
                  </div>
                </CardFooter>
              </Card>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/subscription/plans')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Alterar plano selecionado
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubscriptionCheckout;
