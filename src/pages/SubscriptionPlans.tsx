import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import { usePayment } from '@/contexts/PaymentContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import PlanSelector from '@/components/payment/PlanSelector';
import CouponInput from '@/components/payment/CouponInput';
import { SubscriptionPlan } from '@/lib/types';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import GoogleAuthButton from '@/components/auth/GoogleAuthButton';

const SubscriptionPlans = () => {
  const { user, isAuthenticated } = useAuth();
  const { selectedPlan, setSelectedPlan, appliedCoupon, subscription } = usePayment();
  const [isFromRegistration, setIsFromRegistration] = useState(false);
  const [sessionTimeLeft, setSessionTimeLeft] = useState(900); // 15 minutes in seconds
  const [sessionExpired, setSessionExpired] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.fromRegistration) {
      setIsFromRegistration(true);
    }
    
    if (subscription && subscription.status !== 'canceled') {
      navigate('/settings');
    }
  }, [subscription, navigate, location.state]);

  useEffect(() => {
    if (sessionTimeLeft <= 0) {
      setSessionExpired(true);
      toast({
        title: "Sessão expirada",
        description: "Sua sessão expirou. Por favor, atualize a página para continuar.",
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

  const handlePlanSelect = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
  };

  const handleContinue = () => {
    if (!selectedPlan) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, selecione um plano para continuar.",
      });
      return;
    }

    if (!isAuthenticated) {
      toast({
        title: "Login necessário",
        description: "Por favor, faça login para continuar com a assinatura.",
      });
      navigate('/login', { 
        state: { 
          redirectAfterLogin: '/subscription/checkout',
          selectedPlanId: selectedPlan.id
        } 
      });
      return;
    }

    navigate('/subscription/checkout', { 
      state: { 
        fromRegistration: isFromRegistration 
      } 
    });
  };

  const handleResetSession = () => {
    setSessionTimeLeft(900);
    setSessionExpired(false);
  };

  const calculateFinalPrice = () => {
    if (!selectedPlan) return null;
    
    const discountPercentage = appliedCoupon?.discountPercentage || 0;
    const discount = selectedPlan.price * (discountPercentage / 100);
    
    return {
      originalPrice: selectedPlan.price,
      discount,
      finalPrice: selectedPlan.price - discount
    };
  };

  const priceDetails = calculateFinalPrice();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-primary">Escolha do Plano</span>
              <span className="text-muted-foreground">Pagamento</span>
              <span className="text-muted-foreground">Confirmação</span>
            </div>
            <Progress value={33} className="h-2" />
          </div>

          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              {isFromRegistration 
                ? 'Escolha seu plano para ativar sua conta' 
                : 'Escolha seu plano'}
            </h1>
            <p className="text-muted-foreground">
              {isFromRegistration 
                ? 'Para finalizar o cadastro e ativar sua conta, escolha um dos planos abaixo' 
                : 'Assine e tenha acesso a todos os conteúdos e recursos exclusivos'}
            </p>
            
            {isFromRegistration && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800">
                <p className="text-sm font-medium">
                  É necessário concluir o pagamento para ativar sua conta e ter acesso completo à plataforma.
                </p>
              </div>
            )}

            {sessionTimeLeft < 300 && !sessionExpired && (
              <div className="mt-4 flex items-center justify-center">
                <Alert variant="destructive" className="bg-red-50 border-red-200 max-w-md">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <AlertDescription>
                    Sua sessão expira em {formatTime(sessionTimeLeft)}. Por favor, finalize a escolha do plano.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {sessionExpired && (
              <div className="mt-4 flex items-center justify-center">
                <Alert variant="destructive" className="max-w-md">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <AlertDescription className="flex flex-col space-y-2">
                    <span>Sua sessão expirou. Por favor, reinicie o processo.</span>
                    <Button size="sm" onClick={handleResetSession}>
                      Reiniciar Sessão
                    </Button>
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>
          
          <PlanSelector onSelect={handlePlanSelect} />
          
          <div className="mt-12 max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Resumo</CardTitle>
                <CardDescription>Detalhes do plano selecionado</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedPlan ? (
                  <>
                    <div className="flex justify-between text-sm">
                      <span>Plano:</span>
                      <span className="font-medium">{selectedPlan.name}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>Valor:</span>
                      <span>
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(selectedPlan.price)}
                        /{selectedPlan.interval === 'monthly' ? 'mês' : 
                          selectedPlan.interval === 'quarterly' ? 'trimestre' : 'ano'}
                      </span>
                    </div>
                    
                    {priceDetails && appliedCoupon && (
                      <div className="flex justify-between text-sm">
                        <span>Desconto ({appliedCoupon.discountPercentage}%):</span>
                        <span className="text-green-600">
                          -{new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(priceDetails.discount)}
                        </span>
                      </div>
                    )}
                    
                    {selectedPlan.trialDays && (
                      <div className="flex justify-between text-sm">
                        <span>Período de teste:</span>
                        <span>{selectedPlan.trialDays} dias</span>
                      </div>
                    )}
                    
                    <div className="border-t pt-4 flex justify-between font-medium">
                      <span>Total:</span>
                      <span className="text-primary">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(priceDetails?.finalPrice || selectedPlan.price)}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-center text-muted-foreground italic">
                    Selecione um plano para ver o resumo
                  </p>
                )}
                
                <CouponInput />
              </CardContent>
              <CardFooter className="flex-col space-y-4">
                <Button 
                  onClick={handleContinue} 
                  className="w-full" 
                  disabled={!selectedPlan || sessionExpired}
                >
                  Continuar para pagamento
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                {!isAuthenticated && (
                  <div className="w-full space-y-2">
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        ou faça login para continuar
                      </span>
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t"></span>
                      </div>
                    </div>
                    <GoogleAuthButton label="Continuar com Google" />
                  </div>
                )}
                
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/')}
                  className="w-full"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar para a página inicial
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubscriptionPlans;
