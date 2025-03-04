
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, CreditCard, CheckCircle, Lock, QrCode, Landmark, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { usePayment } from '@/contexts/PaymentContext';
import { useAuth } from '@/contexts/AuthContext';
import PaymentForm from '@/components/payment/PaymentForm';

const SubscriptionCheckout = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { 
    selectedPlan, 
    paymentMethods, 
    createSubscription, 
    isLoading, 
    appliedCoupon,
    applyCoupon,
    setAppliedCoupon
  } = usePayment();
  
  const [couponCode, setCouponCode] = useState('');
  const [paymentTab, setPaymentTab] = useState('card');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Redirecionar se não houver plano selecionado
  React.useEffect(() => {
    if (!selectedPlan) {
      navigate('/subscription/plans');
    }
  }, [selectedPlan, navigate]);

  // Redirecionar se não estiver autenticado
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

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

  const handleComplete = async () => {
    let paymentMethodId;
    
    if (paymentTab === 'card' && paymentMethods.length > 0) {
      paymentMethodId = selectedPaymentMethod || paymentMethods.find(m => m.isDefault)?.id;
    }
    
    if (!paymentMethodId && paymentTab !== 'new-card') {
      return;
    }
    
    await createSubscription(selectedPlan.id, paymentMethodId);
    navigate('/subscription/success');
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
                    <TabsList className="grid grid-cols-3 mb-6">
                      <TabsTrigger value="card">Cartão Salvo</TabsTrigger>
                      <TabsTrigger value="new-card">Novo Cartão</TabsTrigger>
                      <TabsTrigger value="other">Outros Métodos</TabsTrigger>
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
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="new-card">
                      <PaymentForm />
                    </TabsContent>
                    
                    <TabsContent value="other">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div 
                          className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => {
                            usePayment().addPaymentMethod({
                              type: 'pix',
                              isDefault: false
                            });
                            setPaymentTab('card');
                          }}
                        >
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                              <QrCode className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">PIX</p>
                              <p className="text-sm text-muted-foreground">
                                Pagamento instantâneo
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div 
                          className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => {
                            usePayment().addPaymentMethod({
                              type: 'boleto',
                              isDefault: false
                            });
                            setPaymentTab('card');
                          }}
                        >
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                              <Landmark className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">Boleto Bancário</p>
                              <p className="text-sm text-muted-foreground">
                                Vencimento em 3 dias úteis
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
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
                        <span>-{formatCurrency(selectedPlan.price * (appliedCoupon.discountPercentage / 100))}</span>
                      </div>
                    )}
                    
                    <Separator />
                    
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>{formatCurrency(calculateTotal())}</span>
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
                        disabled={isApplyingCoupon || !couponCode.trim()}
                      >
                        {isApplyingCoupon ? 'Aplicando...' : 'Aplicar'}
                      </Button>
                    </div>
                  )}
                  
                  <Button 
                    className="w-full" 
                    onClick={handleComplete}
                    disabled={isLoading || (paymentTab === 'card' && !selectedPaymentMethod && !paymentMethods.find(m => m.isDefault))}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Finalizar Assinatura
                      </>
                    )}
                  </Button>
                  
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
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubscriptionCheckout;
