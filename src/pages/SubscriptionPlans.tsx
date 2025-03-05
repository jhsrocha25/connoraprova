
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import { usePayment } from '@/contexts/PaymentContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import PlanSelector from '@/components/payment/PlanSelector';
import CouponInput from '@/components/payment/CouponInput';
import { SubscriptionPlan } from '@/lib/types';

const SubscriptionPlans = () => {
  const { user, isAuthenticated } = useAuth();
  const { selectedPlan, setSelectedPlan, appliedCoupon, subscription } = usePayment();
  const [isFromRegistration, setIsFromRegistration] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Verifica se o usuário veio do processo de registro
    if (location.state?.fromRegistration) {
      setIsFromRegistration(true);
    }
    
    // Se o usuário já tem uma assinatura ativa, redireciona para a página de gerenciamento
    if (subscription && subscription.status !== 'canceled') {
      navigate('/settings');
    }
  }, [subscription, navigate, location.state]);

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

    // Passar o estado de registro para a próxima página
    navigate('/subscription/checkout', { 
      state: { 
        fromRegistration: isFromRegistration 
      } 
    });
  };

  // Calcular preço com desconto se houver cupom
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
                
                <Button 
                  onClick={handleContinue} 
                  className="w-full mt-4" 
                  disabled={!selectedPlan}
                >
                  Continuar para pagamento
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubscriptionPlans;
