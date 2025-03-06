
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface CheckoutProgressBarProps {
  currentStep: number;
  totalSteps?: number;
}

const CheckoutProgressBar: React.FC<CheckoutProgressBarProps> = ({ 
  currentStep, 
  totalSteps = 3 
}) => {
  const progressValue = (currentStep / totalSteps) * 100;
  
  return (
    <div className="mb-8">
      <div className="flex justify-between text-sm mb-2">
        <span className={currentStep >= 1 ? "font-medium text-primary" : "text-muted-foreground"}>
          Escolha do Plano
        </span>
        <span className={currentStep >= 2 ? "font-medium text-primary" : "text-muted-foreground"}>
          Pagamento
        </span>
        <span className={currentStep >= 3 ? "font-medium text-primary" : "text-muted-foreground"}>
          Confirmação
        </span>
      </div>
      <Progress value={progressValue} className="h-2" />
    </div>
  );
};

export default CheckoutProgressBar;
