
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { usePayment } from '@/contexts/PaymentContext';
import { useAuth } from '@/contexts/AuthContext';

const SubscriptionSuccess = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { subscription, availablePlans } = usePayment();
  
  // Redirecionar se não estiver autenticado ou não tiver assinatura
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (!subscription) {
      navigate('/subscription/plans');
    }
  }, [isAuthenticated, subscription, navigate]);

  const plan = availablePlans.find(p => p.id === subscription?.planId);
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container pt-24 pb-16">
        <div className="max-w-lg mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold tracking-tight mb-4">Assinatura Confirmada!</h1>
          <p className="text-muted-foreground mb-8">
            {subscription?.status === 'trialing' 
              ? `Seu período de teste de ${plan?.trialDays} dias começou hoje.` 
              : 'Sua assinatura foi ativada com sucesso!'}
          </p>
          
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="text-center">
                  <h2 className="text-xl font-medium">{plan?.name}</h2>
                  <p className="text-muted-foreground">{plan?.description}</p>
                </div>
                
                <div className="bg-muted/30 rounded p-4">
                  <p className="font-medium">Detalhes da assinatura:</p>
                  <ul className="text-sm space-y-2 mt-2">
                    <li className="flex justify-between">
                      <span>Plano:</span>
                      <span>{plan?.name}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Status:</span>
                      <span>{subscription?.status === 'trialing' ? 'Período de teste' : 'Ativa'}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Próxima cobrança:</span>
                      <span>{new Date(subscription?.currentPeriodEnd || '').toLocaleDateString()}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-4">
            <Button onClick={() => navigate('/courses')} className="w-full">
              Explorar Cursos
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
            
            <Button variant="outline" onClick={() => navigate('/settings')} className="w-full">
              Gerenciar Assinatura
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubscriptionSuccess;
