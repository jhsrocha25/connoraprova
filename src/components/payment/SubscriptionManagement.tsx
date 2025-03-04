
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CheckCircle, AlertCircle, Calendar, CreditCard, Clock, AlertTriangle } from 'lucide-react';
import { usePayment } from '@/contexts/PaymentContext';
import PlanSelector from './PlanSelector';

const SubscriptionManagement = () => {
  const { subscription, availablePlans, cancelSubscription, updateSubscription, isLoading } = usePayment();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Assinatura</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Nenhuma assinatura ativa</AlertTitle>
            <AlertDescription>
              Você não possui uma assinatura ativa no momento.
            </AlertDescription>
          </Alert>
          <Button onClick={() => window.location.href = '/subscription/plans'}>
            Ver Planos Disponíveis
          </Button>
        </CardContent>
      </Card>
    );
  }

  const currentPlan = availablePlans.find(plan => plan.id === subscription.planId);
  const statusColor = {
    active: 'text-green-600',
    trialing: 'text-amber-600',
    canceled: 'text-red-600',
    past_due: 'text-red-600',
    pending: 'text-amber-600'
  };

  const statusIcon = {
    active: <CheckCircle className="h-5 w-5 text-green-600" />,
    trialing: <Clock className="h-5 w-5 text-amber-600" />,
    canceled: <AlertCircle className="h-5 w-5 text-red-600" />,
    past_due: <AlertTriangle className="h-5 w-5 text-red-600" />,
    pending: <Clock className="h-5 w-5 text-amber-600" />
  };

  const statusText = {
    active: 'Ativa',
    trialing: 'Período de teste',
    canceled: 'Cancelada',
    past_due: 'Pagamento pendente',
    pending: 'Aguardando pagamento'
  };

  const handleCancel = async () => {
    await cancelSubscription();
    setShowCancelDialog(false);
  };

  const handleUpgrade = async () => {
    if (usePayment().selectedPlan) {
      await updateSubscription(usePayment().selectedPlan.id);
      setShowUpgradeDialog(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Status da Assinatura</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b">
              <div className="flex items-center space-x-2">
                <span>Status:</span>
                <div className="flex items-center">
                  {statusIcon[subscription.status]}
                  <span className={`ml-1 font-medium ${statusColor[subscription.status]}`}>
                    {statusText[subscription.status]}
                  </span>
                </div>
              </div>
              <div>
                <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline"
                      size="sm"
                      disabled={subscription.status === 'canceled'}
                    >
                      {subscription.cancelAtPeriodEnd ? 'Cancelamento Agendado' : 'Cancelar Assinatura'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Cancelar Assinatura</DialogTitle>
                      <DialogDescription>
                        Tem certeza que deseja cancelar sua assinatura? Você continuará tendo acesso até o final do período atual.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <Alert variant="destructive">
                        <AlertTitle>Importante</AlertTitle>
                        <AlertDescription>
                          Após o cancelamento, sua assinatura permanecerá ativa até {new Date(subscription.currentPeriodEnd).toLocaleDateString()}.
                        </AlertDescription>
                      </Alert>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowCancelDialog(false)}>Voltar</Button>
                      <Button variant="destructive" onClick={handleCancel} disabled={isLoading}>
                        {isLoading ? 'Processando...' : 'Confirmar Cancelamento'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <span>Plano:</span>
                </div>
                <span className="font-medium">{currentPlan?.name || 'Plano não encontrado'}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span>Próxima cobrança:</span>
                </div>
                <span className="font-medium">
                  {subscription.cancelAtPeriodEnd 
                    ? 'Não haverá próxima cobrança' 
                    : new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span>Assinante desde:</span>
                </div>
                <span className="font-medium">
                  {new Date(subscription.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            {subscription.cancelAtPeriodEnd && (
              <Alert className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Assinatura com cancelamento agendado</AlertTitle>
                <AlertDescription>
                  Sua assinatura será encerrada em {new Date(subscription.currentPeriodEnd).toLocaleDateString()}.
                  {' '}
                  <Button 
                    variant="link" 
                    className="p-0 h-auto" 
                    onClick={async () => {
                      await updateSubscription(subscription.planId);
                    }}
                  >
                    Reativar assinatura
                  </Button>
                </AlertDescription>
              </Alert>
            )}
            
            {subscription.status === 'trialing' && (
              <Alert className="mt-4">
                <Clock className="h-4 w-4" />
                <AlertTitle>Período de teste</AlertTitle>
                <AlertDescription>
                  Seu período de teste termina em {
                    subscription.trialEnd 
                      ? new Date(subscription.trialEnd).toLocaleDateString() 
                      : new Date(subscription.currentPeriodEnd).toLocaleDateString()
                  }.
                </AlertDescription>
              </Alert>
            )}
            
            {subscription.status === 'past_due' && (
              <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Pagamento pendente</AlertTitle>
                <AlertDescription>
                  Há um problema com seu pagamento. Por favor, atualize suas informações de pagamento para evitar a suspensão do serviço.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
      
      {subscription.status !== 'canceled' && !subscription.cancelAtPeriodEnd && (
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Alterar Plano</CardTitle>
            </CardHeader>
            <CardContent>
              <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline">Ver Opções de Planos</Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Escolha um Plano</DialogTitle>
                    <DialogDescription>
                      Selecione o plano que melhor atende às suas necessidades
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4 max-h-[60vh] overflow-auto">
                    <PlanSelector />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowUpgradeDialog(false)}>Cancelar</Button>
                    <Button onClick={handleUpgrade} disabled={isLoading || !usePayment().selectedPlan}>
                      {isLoading ? 'Processando...' : 'Confirmar Mudança'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManagement;
