
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  PaymentMethod, 
  PaymentInvoice, 
  Subscription, 
  SubscriptionPlan, 
  Coupon, 
  PaymentContextType 
} from '@/lib/types';
import { subscriptionPlans, mockPaymentMethods, mockInvoices } from '@/lib/subscriptionData';
import { toast } from '@/components/ui/use-toast';

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

export const PaymentProvider = ({ children }: { children: ReactNode }) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
  const [invoices, setInvoices] = useState<PaymentInvoice[]>(mockInvoices);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [activeCoupons, setActiveCoupons] = useState<Coupon[]>([
    {
      id: 'coupon-1',
      code: 'BEMVINDO10',
      discountPercentage: 10,
      validUntil: new Date('2023-12-31'),
      currentUses: 0,
      isActive: true
    },
    {
      id: 'coupon-2',
      code: 'ANUAL20',
      discountPercentage: 20,
      validUntil: new Date('2023-12-31'),
      currentUses: 0,
      isActive: true
    }
  ]);

  // Add a payment method (card, pix, etc)
  const addPaymentMethod = async (paymentMethodData: Partial<PaymentMethod>): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPaymentMethod: PaymentMethod = {
        id: `pm_${Math.random().toString(36).substr(2, 9)}`,
        type: paymentMethodData.type || 'credit',
        brand: paymentMethodData.brand || 'visa',
        last4: paymentMethodData.last4 || '4242',
        holderName: paymentMethodData.holderName || '',
        expiryMonth: paymentMethodData.expiryMonth || 12,
        expiryYear: paymentMethodData.expiryYear || 2025,
        isDefault: paymentMethods.length === 0 ? true : !!paymentMethodData.isDefault,
        createdAt: new Date()
      };
      
      // If this is set as default, update other methods
      let updatedMethods = [...paymentMethods];
      if (newPaymentMethod.isDefault) {
        updatedMethods = updatedMethods.map(method => ({
          ...method,
          isDefault: false
        }));
      }
      
      setPaymentMethods([...updatedMethods, newPaymentMethod]);
      
      toast({
        title: "Método de pagamento adicionado",
        description: "Seu novo método de pagamento foi salvo com sucesso.",
      });
    } catch (err) {
      setError("Erro ao adicionar método de pagamento");
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível adicionar o método de pagamento.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Remove payment method
  const removePaymentMethod = async (paymentMethodId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const methodToRemove = paymentMethods.find(method => method.id === paymentMethodId);
      
      // Don't allow removing the default payment method if it's the only one
      if (methodToRemove?.isDefault && paymentMethods.length === 1) {
        throw new Error("Não é possível remover o único método de pagamento padrão.");
      }
      
      // Filter out the method
      let updatedMethods = paymentMethods.filter(method => method.id !== paymentMethodId);
      
      // If we removed the default method and others exist, make another one default
      if (methodToRemove?.isDefault && updatedMethods.length > 0) {
        updatedMethods[0].isDefault = true;
      }
      
      setPaymentMethods(updatedMethods);
      
      toast({
        title: "Método de pagamento removido",
        description: "Seu método de pagamento foi removido com sucesso.",
      });
    } catch (err) {
      let message = "Erro ao remover método de pagamento";
      if (err instanceof Error) {
        message = err.message;
      }
      
      setError(message);
      toast({
        variant: "destructive",
        title: "Erro",
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Set default payment method
  const setDefaultPaymentMethod = async (paymentMethodId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update all methods, setting isDefault to true only for the selected method
      const updatedMethods = paymentMethods.map(method => ({
        ...method,
        isDefault: method.id === paymentMethodId
      }));
      
      setPaymentMethods(updatedMethods);
      
      toast({
        title: "Método de pagamento atualizado",
        description: "Seu método de pagamento padrão foi atualizado com sucesso.",
      });
    } catch (err) {
      setError("Erro ao atualizar método de pagamento padrão");
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar o método de pagamento padrão.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new subscription
  const createSubscription = async (planId: string, paymentMethodId?: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get the selected plan
      const plan = subscriptionPlans.find(plan => plan.id === planId);
      if (!plan) {
        throw new Error("Plano não encontrado");
      }
      
      // Get the payment method to use (either provided or default)
      let methodId = paymentMethodId;
      if (!methodId) {
        const defaultMethod = paymentMethods.find(method => method.isDefault);
        if (!defaultMethod) {
          throw new Error("Nenhum método de pagamento encontrado");
        }
        methodId = defaultMethod.id;
      }
      
      // Create subscription object
      const newSubscription: Subscription = {
        id: `sub_${Math.random().toString(36).substr(2, 9)}`,
        userId: 'current-user-id', // Would be the actual user ID in a real implementation
        planId: plan.id,
        status: plan.trialDays ? 'trialing' : 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
        cancelAtPeriodEnd: false,
        createdAt: new Date(),
        paymentMethodId: methodId,
      };
      
      // Set the end date based on the interval
      const end = new Date();
      if (plan.interval === 'monthly') {
        end.setMonth(end.getMonth() + 1);
      } else if (plan.interval === 'quarterly') {
        end.setMonth(end.getMonth() + 3);
      } else if (plan.interval === 'annual') {
        end.setFullYear(end.getFullYear() + 1);
      }
      newSubscription.currentPeriodEnd = end;
      
      // Add trial end date if applicable
      if (plan.trialDays) {
        const trialEnd = new Date();
        trialEnd.setDate(trialEnd.getDate() + plan.trialDays);
        newSubscription.trialEnd = trialEnd;
      }
      
      // Create an invoice for this subscription
      const invoice: PaymentInvoice = {
        id: `inv_${Math.random().toString(36).substr(2, 9)}`,
        subscriptionId: newSubscription.id,
        amount: plan.price * (1 - (appliedCoupon?.discountPercentage || 0) / 100),
        status: 'paid',
        paymentMethod: 'credit',
        createdAt: new Date(),
        paidAt: new Date(),
        dueDate: new Date(),
        invoiceUrl: '#',
        receiptUrl: '#',
      };
      
      setSubscription(newSubscription);
      setInvoices([...invoices, invoice]);
      
      toast({
        title: "Assinatura criada",
        description: `Sua assinatura do plano ${plan.name} foi criada com sucesso!`,
      });
    } catch (err) {
      let message = "Erro ao criar assinatura";
      if (err instanceof Error) {
        message = err.message;
      }
      
      setError(message);
      toast({
        variant: "destructive",
        title: "Erro",
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel subscription
  const cancelSubscription = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!subscription) {
        throw new Error("Nenhuma assinatura ativa encontrada");
      }
      
      // Update subscription to be cancelled at the end of the period
      const updatedSubscription = {
        ...subscription,
        cancelAtPeriodEnd: true
      };
      
      setSubscription(updatedSubscription);
      
      toast({
        title: "Assinatura cancelada",
        description: "Sua assinatura será cancelada ao final do período atual.",
      });
    } catch (err) {
      let message = "Erro ao cancelar assinatura";
      if (err instanceof Error) {
        message = err.message;
      }
      
      setError(message);
      toast({
        variant: "destructive",
        title: "Erro",
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update subscription (change plan)
  const updateSubscription = async (planId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!subscription) {
        throw new Error("Nenhuma assinatura encontrada para atualizar");
      }
      
      // Get the new plan
      const newPlan = subscriptionPlans.find(plan => plan.id === planId);
      if (!newPlan) {
        throw new Error("Plano não encontrado");
      }
      
      // Update subscription with new plan
      const updatedSubscription = {
        ...subscription,
        planId: newPlan.id,
        cancelAtPeriodEnd: false // Reset cancellation if changing plan
      };
      
      setSubscription(updatedSubscription);
      
      toast({
        title: "Assinatura atualizada",
        description: `Seu plano foi atualizado para ${newPlan.name}`,
      });
    } catch (err) {
      let message = "Erro ao atualizar assinatura";
      if (err instanceof Error) {
        message = err.message;
      }
      
      setError(message);
      toast({
        variant: "destructive",
        title: "Erro",
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Apply a coupon code
  const applyCoupon = async (couponCode: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find the coupon
      const coupon = activeCoupons.find(
        c => c.code.toUpperCase() === couponCode.toUpperCase() && c.isActive
      );
      
      if (!coupon) {
        throw new Error("Cupom inválido ou expirado");
      }
      
      // Check if coupon is expired
      if (new Date() > coupon.validUntil) {
        throw new Error("Este cupom já expirou");
      }
      
      // Check if coupon reached max uses
      if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
        throw new Error("Este cupom atingiu o limite máximo de usos");
      }
      
      // Apply the coupon
      setAppliedCoupon(coupon);
      
      // Update coupon uses
      const updatedCoupons = activeCoupons.map(c => 
        c.id === coupon.id 
          ? { ...c, currentUses: c.currentUses + 1 }
          : c
      );
      setActiveCoupons(updatedCoupons);
      
      toast({
        title: "Cupom aplicado",
        description: `Desconto de ${coupon.discountPercentage}% aplicado com sucesso!`,
      });
      
      return true;
    } catch (err) {
      let message = "Erro ao aplicar cupom";
      if (err instanceof Error) {
        message = err.message;
      }
      
      setError(message);
      toast({
        variant: "destructive",
        title: "Erro",
        description: message,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Get invoices
  const getInvoices = async (): Promise<PaymentInvoice[]> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return invoices;
    } catch (err) {
      setError("Erro ao buscar faturas");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Download invoice
  const downloadInvoice = async (invoiceId: string): Promise<string> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const invoice = invoices.find(inv => inv.id === invoiceId);
      if (!invoice) {
        throw new Error("Fatura não encontrada");
      }
      
      // In a real implementation, this would generate and return a PDF URL
      // For demo, just return a mock URL
      return invoice.invoiceUrl || '#';
    } catch (err) {
      setError("Erro ao baixar fatura");
      return '#';
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PaymentContext.Provider
      value={{
        paymentMethods,
        invoices,
        subscription,
        availablePlans: subscriptionPlans,
        activeCoupons,
        isLoading,
        error,
        addPaymentMethod,
        removePaymentMethod,
        setDefaultPaymentMethod,
        createSubscription,
        cancelSubscription,
        updateSubscription,
        applyCoupon,
        getInvoices,
        downloadInvoice,
        selectedPlan,
        setSelectedPlan,
        selectedPaymentMethod,
        setSelectedPaymentMethod,
        appliedCoupon,
        setAppliedCoupon
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};
