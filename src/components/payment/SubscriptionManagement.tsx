
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePayment } from '@/contexts/PaymentContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { subscriptionPlans } from '@/lib/subscriptionData';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { CalendarClock, AlertTriangle, CheckCircle, CreditCard, RefreshCw } from 'lucide-react';

const SubscriptionManagement = () => {
  const { subscription, cancelSubscription, isLoading, paymentMethods } = usePayment();
  const navigate = useNavigate();
  
  // Get the subscription plan details
  const plan = subscription 
    ? subscriptionPlans.find(p => p.id === subscription.planId) 
    : null;
  
  // Get payment method used for subscription
  const paymentMethod = subscription && subscription.paymentMethodId
    ? paymentMethods.find(method => method.id === subscription.paymentMethodId)
    : null;
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };
  
  const getStatusBadge = () => {
    if (!subscription) return null;
    
    switch (subscription.status) {
      case 'active':
        return <Badge className="bg-green-500">Ativa</Badge>;
      case 'trialing':
        return <Badge className="bg-blue-500">Período de teste</Badge>;
      case 'past_due':
        return <Badge className="bg-amber-500">Pagamento pendente</Badge>;
      case 'canceled':
        return <Badge className="bg-gray-500">Cancelada</Badge>;
      case 'pending':
        return <Badge className="bg-orange-500">Aguardando pagamento</Badge>;
      default:
        return null;
    }
  };
  
  const daysRemaining = () => {
    if (!subscription || !subscription.currentPeriodEnd) return 0;
    
    const endDate = new Date(subscription.currentPeriodEnd);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  if (!subscription) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <CalendarClock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-1">Nenhuma assinatura ativa</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Você não possui nenhuma assinatura ativa no momento.
        </p>
        <Button onClick={() => navigate('/subscription/plans')}>
          Ver planos disponíveis
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-semibold">{plan?.name || 'Plano'}</h3>
              {getStatusBadge()}
            </div>
            
            <p className="text-muted-foreground mb-4">{plan?.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Próxima cobrança</h4>
                <p className="flex items-center">
                  <CalendarClock className="h-4 w-4 mr-1 text-primary" />
                  {formatDate(subscription.currentPeriodEnd)}
                  {subscription.cancelAtPeriodEnd && (
                    <span className="ml-2 text-muted-foreground text-xs">(Não será renovado)</span>
                  )}
                </p>
              </div>
              
              {paymentMethod && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Forma de pagamento</h4>
                  <p className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-1 text-primary" />
                    {paymentMethod.type === 'credit' && 'Cartão de Crédito'}
                    {paymentMethod.type === 'debit' && 'Cartão de Débito'}
                    {paymentMethod.type === 'pix' && 'PIX'}
                    {paymentMethod.type === 'boleto' && 'Boleto Bancário'}
                    {(paymentMethod.type === 'credit' || paymentMethod.type === 'debit') && 
                      ` •••• ${paymentMethod.last4}`}
                  </p>
                </div>
              )}
              
              {subscription.trialEnd && new Date(subscription.trialEnd) > new Date() && (
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium mb-1">Período de teste</h4>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                    <p>
                      Seu período de teste termina em {formatDate(subscription.trialEnd)}.
                      <br />
                      <span className="text-sm text-muted-foreground">
                        Após esse período, você será cobrado automaticamente.
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col gap-3 mt-4 md:mt-0 md:text-right">
            <div>
              <div className="text-sm">Valor</div>
              <div className="text-2xl font-semibold">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(plan?.price || 0)}
                <span className="text-sm font-normal text-muted-foreground ml-1">
                  {plan?.interval === 'monthly' && '/mês'}
                  {plan?.interval === 'quarterly' && '/trimestre'}
                  {plan?.interval === 'annual' && '/ano'}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row md:flex-col gap-2 md:items-end">
              <Button variant="outline" size="sm" onClick={() => navigate('/subscription/plans')}>
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                Mudar plano
              </Button>
              
              {!subscription.cancelAtPeriodEnd ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-destructive">
                      Cancelar assinatura
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Cancelar sua assinatura?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Sua assinatura será cancelada, mas você ainda terá acesso até o final 
                        do período atual, que termina em {formatDate(subscription.currentPeriodEnd)}.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Voltar</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={cancelSubscription}
                        disabled={isLoading}
                        className="bg-destructive text-destructive-foreground"
                      >
                        {isLoading ? 'Cancelando...' : 'Confirmar cancelamento'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <div className="text-sm text-amber-600 flex items-center">
                  <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
                  Cancelamento agendado
                </div>
              )}
            </div>
          </div>
        </div>
        
        {subscription.cancelAtPeriodEnd && (
          <div className="mt-6 p-4 rounded-lg bg-amber-50 border border-amber-200">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <h4 className="font-medium mb-1">Assinatura cancelada</h4>
                <p className="text-sm">
                  Sua assinatura foi cancelada e não será renovada automaticamente. 
                  Você ainda tem acesso aos recursos premium por mais {daysRemaining()} dias, 
                  até {formatDate(subscription.currentPeriodEnd)}.
                </p>
                <Button 
                  variant="link" 
                  className="h-auto p-0 mt-1" 
                  onClick={() => navigate('/subscription/plans')}
                >
                  Reativar assinatura
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        {plan?.features.map((feature, index) => (
          <div key={index} className="flex gap-2 p-4 rounded-lg border">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <p>{feature}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionManagement;
