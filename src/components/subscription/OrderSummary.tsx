
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SubscriptionPlan } from '@/lib/types';
import { useNavigate } from 'react-router-dom';

interface OrderSummaryProps {
  selectedPlan: SubscriptionPlan;
  appliedCoupon: { code: string; discountPercentage: number } | null;
  couponCode: string;
  setCouponCode: (code: string) => void;
  handleApplyCoupon: () => Promise<void>;
  isApplyingCoupon: boolean;
  sessionExpired: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  selectedPlan,
  appliedCoupon,
  couponCode,
  setCouponCode,
  handleApplyCoupon,
  isApplyingCoupon,
  sessionExpired
}) => {
  const navigate = useNavigate();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
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

  const priceDetails = {
    originalPrice: selectedPlan.price,
    discount: appliedCoupon ? selectedPlan.price * (appliedCoupon.discountPercentage / 100) : 0,
    finalPrice: calculateTotal()
  };

  return (
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
  );
};

export default OrderSummary;
