import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { 
  PaymentMethod, 
  PaymentInvoice, 
  Subscription, 
  SubscriptionPlan,
  Coupon, 
  PaymentContextType 
} from '@/lib/types';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';
import { 
  mockPaymentMethods, 
  mockInvoices, 
  mockSubscription, 
  mockSubscriptionPlans,
  mockCoupons
} from '@/lib/subscriptionData';

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

export const PaymentProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [invoices, setInvoices] = useState<PaymentInvoice[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [availablePlans, setAvailablePlans] = useState<SubscriptionPlan[]>([]);
  const [activeCoupons, setActiveCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    if (user) {
      loadUserPaymentData();
    } else {
      setPaymentMethods([]);
      setInvoices([]);
      setSubscription(null);
    }
  }, [user]);

  useEffect(() => {
    loadPlansAndCoupons();
  }, []);

  const loadPlansAndCoupons = async () => {
    try {
      setAvailablePlans(mockSubscriptionPlans);
      setActiveCoupons(mockCoupons);
    } catch (err) {
      setError('Erro ao carregar planos de assinatura');
      console.error('Erro ao carregar planos:', err);
    }
  };

  const loadUserPaymentData = async () => {
    setIsLoading(true);
    try {
      setPaymentMethods(mockPaymentMethods);
      setInvoices(mockInvoices);
      
      if (user?.id === 'user-1') {
        setSubscription(mockSubscription);
      } else {
        setSubscription(null);
      }
      
      setError(null);
    } catch (err) {
      setError('Erro ao carregar dados de pagamento');
      console.error('Erro ao carregar dados de pagamento:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addPaymentMethod = async (paymentMethodData: Partial<PaymentMethod>): Promise<void> => {
    setIsLoading(true);
    try {
      const newPaymentMethod: PaymentMethod = {
        id: `pm_${Math.random().toString(36).substring(2, 9)}`,
        type: paymentMethodData.type || 'credit',
        brand: paymentMethodData.brand,
        last4: paymentMethodData.last4,
        holderName: paymentMethodData.holderName,
        expiryMonth: paymentMethodData.expiryMonth,
        expiryYear: paymentMethodData.expiryYear,
        isDefault: paymentMethods.length === 0 ? true : !!paymentMethodData.isDefault,
        createdAt: new Date(),
      };
      
      const updatedPaymentMethods = [...paymentMethods];
      if (newPaymentMethod.isDefault) {
        updatedPaymentMethods.forEach(method => {
          method.isDefault = false;
        });
      }
      
      setPaymentMethods([...updatedPaymentMethods, newPaymentMethod]);
      
      toast({
        title: "Método de pagamento adicionado",
        description: "Seu método de pagamento foi adicionado com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao adicionar método de pagamento:', error);
      setError('Não foi possível adicionar o método de pagamento. Tente novamente.');
      toast({
        variant: 'destructive',
        title: "Erro ao adicionar método de pagamento",
        description: "Ocorreu um erro ao adicionar seu método de pagamento. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removePaymentMethod = async (paymentMethodId: string) => {
    setIsLoading(true);
    try {
      const method = paymentMethods.find(m => m.id === paymentMethodId);
      if (method?.isDefault && paymentMethods.length > 1) {
        throw new Error("Não é possível remover o método de pagamento padrão. Defina outro como padrão primeiro.");
      }
      
      if (subscription && subscription.paymentMethodId === paymentMethodId) {
        throw new Error("Este método de pagamento está sendo usado em uma assinatura ativa.");
      }
      
      setPaymentMethods(paymentMethods.filter(method => method.id !== paymentMethodId));
      
      toast({
        title: "Método de pagamento removido",
        description: "Seu método de pagamento foi removido com sucesso",
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        toast({
          variant: 'destructive',
          title: "Erro ao remover método de pagamento",
          description: err.message
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const setDefaultPaymentMethod = async (paymentMethodId: string) => {
    setIsLoading(true);
    try {
      const updatedMethods = paymentMethods.map(method => ({
        ...method,
        isDefault: method.id === paymentMethodId
      }));
      
      setPaymentMethods(updatedMethods);
      
      toast({
        title: "Método de pagamento atualizado",
        description: "Seu método de pagamento padrão foi atualizado com sucesso",
      });
    } catch (err) {
      setError('Erro ao atualizar método de pagamento padrão');
      toast({
        variant: 'destructive',
        title: "Erro ao atualizar método de pagamento",
        description: "Não foi possível atualizar o método de pagamento padrão. Tente novamente."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createSubscription = async (planId: string, paymentMethodId?: string): Promise<void> => {
    setIsLoading(true);
    try {
      const plan = availablePlans.find(p => p.id === planId);
      if (!plan) {
        throw new Error('Plano não encontrado');
      }
      
      let paymentMethod;
      if (paymentMethodId) {
        paymentMethod = paymentMethods.find(m => m.id === paymentMethodId);
      } else if (selectedPaymentMethod) {
        paymentMethod = selectedPaymentMethod;
      } else {
        paymentMethod = paymentMethods.find(m => m.isDefault);
      }
      
      if (!paymentMethod) {
        throw new Error('Método de pagamento não encontrado');
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newSubscription: Subscription = {
        id: `sub_${Math.random().toString(36).substring(2, 9)}`,
        userId: 'current_user_id',
        planId: plan.id,
        status: plan.trialDays ? 'trialing' : 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + (plan.interval === 'monthly' ? 30 : plan.interval === 'quarterly' ? 90 : 365) * 24 * 60 * 60 * 1000),
        cancelAtPeriodEnd: false,
        createdAt: new Date(),
        paymentMethodId: paymentMethod.id,
        trialEnd: plan.trialDays ? new Date(Date.now() + plan.trialDays * 24 * 60 * 60 * 1000) : undefined,
      };
      
      setSubscription(newSubscription);
      
      const newInvoice: PaymentInvoice = {
        id: `inv_${Math.random().toString(36).substring(2, 9)}`,
        subscriptionId: newSubscription.id,
        amount: plan.price - (appliedCoupon ? (plan.price * appliedCoupon.discountPercentage / 100) : 0),
        status: plan.trialDays ? 'pending' : 'paid',
        paymentMethod: paymentMethod.type,
        createdAt: new Date(),
        paidAt: plan.trialDays ? undefined : new Date(),
        dueDate: plan.trialDays ? new Date(Date.now() + plan.trialDays * 24 * 60 * 60 * 1000) : new Date(),
        invoiceUrl: `https://example.com/invoice/${Math.random().toString(36).substring(2, 9)}`,
        receiptUrl: plan.trialDays ? undefined : `https://example.com/receipt/${Math.random().toString(36).substring(2, 9)}`,
      };
      
      setInvoices([...invoices, newInvoice]);
      
      toast({
        title: "Assinatura criada com sucesso",
        description: plan.trialDays 
          ? `Seu período de teste de ${plan.trialDays} dias começou. Aproveite!` 
          : "Sua assinatura foi ativada com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao criar assinatura:', error);
      setError('Não foi possível criar a assinatura. Tente novamente.');
      toast({
        variant: 'destructive',
        title: "Erro ao criar assinatura",
        description: "Ocorreu um erro ao processar sua assinatura. Tente novamente ou entre em contato com o suporte.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const cancelSubscription = async () => {
    setIsLoading(true);
    try {
      if (!subscription) {
        throw new Error("Você não possui uma assinatura ativa.");
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedSubscription = {
        ...subscription,
        cancelAtPeriodEnd: true
      };
      
      setSubscription(updatedSubscription);
      
      toast({
        title: "Assinatura cancelada",
        description: `Sua assinatura será encerrada em ${new Date(updatedSubscription.currentPeriodEnd).toLocaleDateString()}`,
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        toast({
          variant: 'destructive',
          title: "Erro ao cancelar assinatura",
          description: err.message
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateSubscription = async (planId: string) => {
    setIsLoading(true);
    try {
      if (!subscription) {
        throw new Error("Você não possui uma assinatura ativa para atualizar.");
      }
      
      const plan = availablePlans.find(p => p.id === planId);
      if (!plan) {
        throw new Error("Plano não encontrado.");
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedSubscription = {
        ...subscription,
        planId: planId,
        cancelAtPeriodEnd: false
      };
      
      setSubscription(updatedSubscription);
      
      toast({
        title: "Assinatura atualizada",
        description: `Sua assinatura foi atualizada para o plano ${plan.name}`,
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        toast({
          variant: 'destructive',
          title: "Erro ao atualizar assinatura",
          description: err.message
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const applyCoupon = async (couponCode: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const coupon = activeCoupons.find(
        c => c.code === couponCode && c.isActive && new Date(c.validUntil) > new Date()
      );
      
      if (!coupon) {
        throw new Error("Cupom inválido ou expirado.");
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
        throw new Error("Este cupom já atingiu o limite máximo de uso.");
      }
      
      setAppliedCoupon(coupon);
      
      toast({
        title: "Cupom aplicado",
        description: `Desconto de ${coupon.discountPercentage}% aplicado com sucesso!`,
      });
      
      return true;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        toast({
          variant: 'destructive',
          title: "Erro ao aplicar cupom",
          description: err.message
        });
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getInvoices = async (): Promise<PaymentInvoice[]> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return invoices;
    } catch (err) {
      setError('Erro ao obter faturas');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const downloadInvoice = async (invoiceId: string): Promise<string> => {
    setIsLoading(true);
    try {
      const invoice = invoices.find(inv => inv.id === invoiceId);
      if (!invoice) {
        throw new Error("Fatura não encontrada.");
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Download iniciado",
        description: "O download da sua fatura foi iniciado",
      });
      
      return "#fatura-exemplo.pdf";
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        toast({
          variant: 'destructive',
          title: "Erro ao baixar fatura",
          description: err.message
        });
      }
      return "";
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
        availablePlans,
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
