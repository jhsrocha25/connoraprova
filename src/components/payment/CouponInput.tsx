
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePayment } from '@/contexts/PaymentContext';
import { Check, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const CouponInput = () => {
  const [couponCode, setCouponCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const { applyCoupon, appliedCoupon, setAppliedCoupon } = usePayment();

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    
    setIsApplying(true);
    try {
      const success = await applyCoupon(couponCode);
      if (success) {
        toast({
          title: "Cupom aplicado",
          description: "O desconto foi aplicado ao seu pedido.",
        });
      }
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast({
      title: "Cupom removido",
      description: "O cupom foi removido do seu pedido.",
    });
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Cupom de desconto</p>
      
      {appliedCoupon ? (
        <div className="flex items-center justify-between p-2 bg-green-50 border border-green-100 rounded-md">
          <div className="flex items-center space-x-2">
            <Check className="h-4 w-4 text-green-600" />
            <div>
              <p className="text-sm font-medium">{appliedCoupon.code}</p>
              <p className="text-xs text-muted-foreground">
                {appliedCoupon.discountPercentage}% de desconto aplicado
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemoveCoupon}
            className="h-8 px-2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex space-x-2">
          <Input
            placeholder="Código do cupom"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="flex-1"
          />
          <Button 
            onClick={handleApplyCoupon} 
            disabled={!couponCode || isApplying}
            variant="secondary"
          >
            {isApplying ? 'Aplicando...' : 'Aplicar'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CouponInput;
