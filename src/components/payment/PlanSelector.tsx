
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { usePayment } from '@/contexts/PaymentContext';
import { SubscriptionPlan } from '@/lib/types';

interface PlanSelectorProps {
  onSelect?: (plan: SubscriptionPlan) => void;
}

const PlanSelector = ({ onSelect }: PlanSelectorProps) => {
  const { availablePlans, subscription, selectedPlan, setSelectedPlan, appliedCoupon } = usePayment();

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    if (onSelect) {
      onSelect(plan);
    }
  };

  const calculateDiscountedPrice = (plan: SubscriptionPlan) => {
    if (!appliedCoupon) return plan.price;
    
    const discount = plan.price * (appliedCoupon.discountPercentage / 100);
    return Math.max(0, plan.price - discount);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {availablePlans.map((plan) => {
        const isCurrentPlan = subscription?.planId === plan.id;
        const isSelected = selectedPlan?.id === plan.id;
        const discountedPrice = calculateDiscountedPrice(plan);
        const hasDiscount = discountedPrice < plan.price;
        
        return (
          <Card 
            key={plan.id}
            className={`relative overflow-hidden transition-shadow 
              ${isSelected ? 'ring-2 ring-primary shadow-lg' : 'shadow'}
              ${plan.isMostPopular ? 'border-primary' : ''}
            `}
          >
            {plan.isMostPopular && (
              <Badge 
                className="absolute right-0 top-6 -mr-8 rotate-45 bg-primary text-primary-foreground px-10"
              >
                Mais Popular
              </Badge>
            )}
            
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">
                    {formatPrice(discountedPrice)}
                  </span>
                  <span className="text-sm text-muted-foreground ml-1">
                    /{plan.interval === 'monthly' ? 'mês' : 
                      plan.interval === 'quarterly' ? 'trimestre' : 'ano'}
                  </span>
                </div>
                
                {hasDiscount && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(plan.price)}
                    </span>
                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                      {appliedCoupon?.discountPercentage}% OFF
                    </Badge>
                  </div>
                )}
                
                {plan.trialDays && (
                  <p className="text-sm text-muted-foreground">
                    Inclui {plan.trialDays} dias grátis
                  </p>
                )}
              </div>
              
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 mr-2 mt-1 shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleSelectPlan(plan)}
                variant={isSelected ? "default" : "outline"}
                className="w-full"
                disabled={isCurrentPlan}
              >
                {isCurrentPlan ? 'Plano Atual' : isSelected ? 'Selecionado' : 'Selecionar Plano'}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default PlanSelector;
