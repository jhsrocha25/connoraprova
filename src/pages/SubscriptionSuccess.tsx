
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import { usePayment } from '@/contexts/PaymentContext';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, ArrowRight, Home } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const SubscriptionSuccess = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { selectedPlan, subscription } = usePayment();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
    if (!selectedPlan && !subscription) {
      navigate('/subscription/plans');
    }
  }, [isAuthenticated, selectedPlan, subscription, navigate]);

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(date));
  };

  // Determine which plan info to show (selected plan or current subscription)
  const planToShow = subscription?.planId 
    ? { id: subscription.planId, name: subscription.planId.includes('mensal') ? 'Plano Mensal' : 
        subscription.planId.includes('trimestral') ? 'Plano Trimestral' : 'Plano Anual' }
    : selectedPlan;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container pt-24 pb-16">
        <div className="max-w-2xl mx-auto">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Escolha do Plano</span>
              <span className="text-muted-foreground">Pagamento</span>
              <span className="font-medium text-primary">Confirmação</span>
            </div>
            <Progress value={100} className="h-2" />
          </div>
          
          <Card className="border-green-200 bg-green-50">
            <CardHeader className="text-center border-b border-green-100 pb-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-2xl text-green-800">Pagamento Confirmado!</CardTitle>
              <CardDescription className="text-green-700">
                Sua assinatura foi ativada com sucesso
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg">
                  <h3 className="font-medium text-lg mb-2">Detalhes da Assinatura</h3>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Plano:</span>
                      <span className="font-medium">{planToShow?.name}</span>
                    </div>
                    
                    {subscription && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <span className="font-medium capitalize">
                            {subscription.status === 'active' ? 'Ativa' : 
                             subscription.status === 'trialing' ? 'Em período de teste' : 
                             subscription.status === 'canceled' ? 'Cancelada' : 
                             subscription.status === 'past_due' ? 'Pagamento atrasado' : 
                             subscription.status}
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Início do período:</span>
                          <span>{formatDate(subscription.currentPeriodStart)}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Próxima cobrança:</span>
                          <span>{formatDate(subscription.currentPeriodEnd)}</span>
                        </div>
                        
                        {subscription.trialEnd && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Fim do período de teste:</span>
                            <span>{formatDate(subscription.trialEnd)}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
                
                <div className="p-4 bg-white rounded-lg">
                  <h3 className="font-medium text-lg mb-2">O que você pode fazer agora?</h3>
                  
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 shrink-0 mt-0.5" />
                      <span>Explorar cursos e materiais de estudo exclusivos</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 shrink-0 mt-0.5" />
                      <span>Realizar simulados ilimitados para testar seu conhecimento</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 shrink-0 mt-0.5" />
                      <span>Acessar conteúdos premium e atualizações de concursos</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 shrink-0 mt-0.5" />
                      <span>Conferir seu histórico de pagamentos e gerenciar sua assinatura</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col space-y-4 pt-2">
              <Button 
                className="w-full"
                onClick={() => navigate('/courses')}
              >
                Explorar cursos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/settings')}
              >
                Gerenciar assinatura
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={() => navigate('/')}
              >
                <Home className="mr-2 h-4 w-4" />
                Ir para a página inicial
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SubscriptionSuccess;
