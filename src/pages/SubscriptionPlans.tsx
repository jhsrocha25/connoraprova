
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Info, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { usePayment } from '@/contexts/PaymentContext';
import { useAuth } from '@/contexts/AuthContext';
import PlanSelector from '@/components/payment/PlanSelector';

const SubscriptionPlans = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { 
    selectedPlan, 
    setSelectedPlan, 
    appliedCoupon, 
    setAppliedCoupon,
    applyCoupon, 
    isLoading,
    subscription 
  } = usePayment();
  
  const [couponCode, setCouponCode] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const handleContinue = () => {
    if (selectedPlan) {
      navigate('/subscription/checkout');
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setIsApplyingCoupon(true);
    const success = await applyCoupon(couponCode);
    setIsApplyingCoupon(false);
    
    if (success) {
      setCouponCode('');
    }
  };

  const calculateDiscountedPrice = () => {
    if (!selectedPlan || !appliedCoupon) return null;
    
    const discount = selectedPlan.price * (appliedCoupon.discountPercentage / 100);
    return Math.max(0, selectedPlan.price - discount);
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
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Planos de Assinatura</h1>
          <p className="text-muted-foreground mb-8 md:text-lg">
            Escolha o plano ideal para sua preparação e acesse conteúdo exclusivo
          </p>
          
          {subscription && (
            <Alert className="mb-8">
              <Info className="h-4 w-4" />
              <AlertDescription>
                Você já possui uma assinatura ativa. Acesse{' '}
                <Button 
                  variant="link" 
                  className="p-0 h-auto" 
                  onClick={() => navigate('/settings')}
                >
                  Configurações de Conta
                </Button>
                {' '}para gerenciar sua assinatura atual.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-10">
            <PlanSelector />
            
            {selectedPlan && (
              <div className="bg-muted/30 rounded-lg p-6 border">
                <h3 className="text-xl font-medium mb-4">Resumo do Plano Selecionado</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{selectedPlan.name}</span>
                      <p className="text-sm text-muted-foreground">{selectedPlan.description}</p>
                    </div>
                    <span className="font-medium">{formatCurrency(selectedPlan.price)}</span>
                  </div>
                  
                  {appliedCoupon && (
                    <div className="flex justify-between items-center text-green-600">
                      <div>
                        <span className="font-medium">Cupom: {appliedCoupon.code}</span>
                        <p className="text-sm">Desconto de {appliedCoupon.discountPercentage}%</p>
                      </div>
                      <Button 
                        variant="link" 
                        className="text-red-500 p-0 h-auto" 
                        onClick={() => setAppliedCoupon(null)}
                      >
                        Remover
                      </Button>
                    </div>
                  )}
                  
                  {appliedCoupon && (
                    <>
                      <Separator />
                      <div className="flex justify-between items-center font-bold">
                        <span>Total:</span>
                        <span>{formatCurrency(calculateDiscountedPrice() || selectedPlan.price)}</span>
                      </div>
                    </>
                  )}
                  
                  <div className="flex space-x-4">
                    {!appliedCoupon && (
                      <div className="flex-1 flex space-x-2">
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
                      onClick={handleContinue} 
                      disabled={isLoading || !selectedPlan || (!!subscription)}
                      className="min-w-32"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processando...
                        </>
                      ) : !isAuthenticated ? (
                        'Faça Login para Continuar'
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Continuar
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-16 space-y-8">
            <h2 className="text-2xl font-bold tracking-tight">Perguntas Frequentes</h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-medium">Como funciona o período de teste?</h3>
                <p className="text-muted-foreground">
                  Você tem acesso completo ao plano escolhido durante o período de teste. Caso decida cancelar antes do término, não será cobrado.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Posso cancelar a qualquer momento?</h3>
                <p className="text-muted-foreground">
                  Sim, você pode cancelar sua assinatura a qualquer momento. Caso cancele, continuará com acesso até o final do período pago.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Quais formas de pagamento são aceitas?</h3>
                <p className="text-muted-foreground">
                  Aceitamos cartões de crédito, débito, PIX e boleto bancário para o pagamento das assinaturas.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Como trocar de plano?</h3>
                <p className="text-muted-foreground">
                  Você pode trocar de plano a qualquer momento através da área de assinatura em sua conta.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubscriptionPlans;
