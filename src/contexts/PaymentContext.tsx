
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

  // Carregar dados do usuário quando autenticado
  useEffect(() => {
    if (user) {
      loadUserPaymentData();
    } else {
      // Limpar dados quando o usuário faz logout
      setPaymentMethods([]);
      setInvoices([]);
      setSubscription(null);
    }
  }, [user]);

  // Carregar todos os planos e cupons disponíveis (dados que não dependem do usuário estar logado)
  useEffect(() => {
    loadPlansAndCoupons();
  }, []);

  const loadPlansAndCoupons = async () => {
    try {
      // Em uma aplicação real, isso seria uma chamada API
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
      // Em uma aplicação real, essas seriam chamadas API
      // Simulação de chamadas assíncronas para o servidor
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setPaymentMethods(mockPaymentMethods);
      setInvoices(mockInvoices);
      
      // Verificar se o usuário já tem uma assinatura
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

  const addPaymentMethod = async (paymentMethodData: Partial<PaymentMethod>) => {
    setIsLoading(true);
    try {
      // Simulação de criação de método de pagamento via API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPaymentMethod: PaymentMethod = {
        id: `pm-${Date.now()}`,
        type: paymentMethodData.type || 'credit',
        brand: paymentMethodData.brand,
        last4: paymentMethodData.last4,
        holderName: paymentMethodData.holderName,
        expiryMonth: paymentMethodData.expiryMonth,
        expiryYear: paymentMethodData.expiryYear,
        isDefault: paymentMethods.length === 0 ? true : (paymentMethodData.isDefault || false),
        createdAt: new Date()
      };
      
      // Se o novo método for definido como padrão, atualizar os outros
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
        description: "Seu método de pagamento foi cadastrado com sucesso",
      });
      
      return newPaymentMethod;
    } catch (err) {
      setError('Erro ao adicionar método de pagamento');
      toast({
        variant: 'destructive',
        title: "Erro ao adicionar método de pagamento",
        description: "Não foi possível adicionar o método de pagamento. Tente novamente."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removePaymentMethod = async (paymentMethodId: string) => {
    setIsLoading(true);
    try {
      // Verificar se é o método padrão e se há outros métodos disponíveis
      const method = paymentMethods.find(m => m.id === paymentMethodId);
      if (method?.isDefault && paymentMethods.length > 1) {
        throw new Error("Não é possível remover o método de pagamento padrão. Defina outro como padrão primeiro.");
      }
      
      // Verificar se está em uso por uma assinatura ativa
      if (subscription && subscription.paymentMethodId === paymentMethodId) {
        throw new Error("Este método de pagamento está sendo usado em uma assinatura ativa.");
      }
      
      // Simulação de remoção via API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
      // Simulação de atualização via API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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

  const createSubscription = async (planId: string, paymentMethodId?: string) => {
    setIsLoading(true);
    try {
      // Verificar se o usuário está autenticado
      if (!user) {
        throw new Error("Você precisa estar logado para assinar um plano.");
      }
      
      // Verificar se há um método de pagamento disponível
      let selectedMethodId = paymentMethodId;
      if (!selectedMethodId) {
        const defaultMethod = paymentMethods.find(method => method.isDefault);
        if (!defaultMethod) {
          throw new Error("Você precisa adicionar um método de pagamento.");
        }
        selectedMethodId = defaultMethod.id;
      }
      
      // Buscar plano selecionado
      const plan = availablePlans.find(p => p.id === planId);
      if (!plan) {
        throw new Error("Plano não encontrado.");
      }
      
      // Simulação de criação de assinatura via API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Calcular datas
      const now = new Date();
      let periodEnd = new Date();
      
      switch (plan.interval) {
        case 'monthly':
          periodEnd.setMonth(periodEnd.getMonth() + 1);
          break;
        case 'quarterly':
          periodEnd.setMonth(periodEnd.getMonth() + 3);
          break;
        case 'annual':
          periodEnd.setFullYear(periodEnd.getFullYear() + 1);
          break;
      }
      
      // Verificar período de teste
      let trialEnd = undefined;
      if (plan.trialDays) {
        trialEnd = new Date();
        trialEnd.setDate(trialEnd.getDate() + plan.trialDays);
      }
      
      const newSubscription: Subscription = {
        id: `sub-${Date.now()}`,
        userId: user.id,
        planId: plan.id,
        status: trialEnd ? 'trialing' : 'active',
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        cancelAtPeriodEnd: false,
        createdAt: now,
        paymentMethodId: selectedMethodId,
        trialEnd
      };
      
      setSubscription(newSubscription);
      
      // Criar a primeira fatura (pendente se em período de teste, paga se não houver teste)
      const newInvoice: PaymentInvoice = {
        id: `inv-${Date.now()}`,
        subscriptionId: newSubscription.id,
        amount: trialEnd ? 0 : plan.price,
        status: trialEnd ? 'pending' : 'paid',
        paymentMethod: 'credit', // Assumindo que é cartão de crédito por padrão
        createdAt: now,
        paidAt: trialEnd ? undefined : now,
        dueDate: trialEnd || now,
        receiptUrl: trialEnd ? undefined : '#'
      };
      
      setInvoices([...invoices, newInvoice]);
      
      toast({
        title: "Assinatura criada com sucesso",
        description: trialEnd 
          ? `Seu período de teste de ${plan.trialDays} dias começou hoje` 
          : `Você está inscrito no plano ${plan.name}`,
      });
      
      return newSubscription;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        toast({
          variant: 'destructive',
          title: "Erro ao criar assinatura",
          description: err.message
        });
      }
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
      
      // Simulação de cancelamento via API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Atualizar a assinatura para cancelar no final do período
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
      
      // Buscar plano selecionado
      const plan = availablePlans.find(p => p.id === planId);
      if (!plan) {
        throw new Error("Plano não encontrado.");
      }
      
      // Simulação de atualização via API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Atualizar a assinatura
      const updatedSubscription = {
        ...subscription,
        planId: planId,
        cancelAtPeriodEnd: false // Se estava cancelada, reativar
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
      // Verificar se o cupom existe e é válido
      const coupon = activeCoupons.find(
        c => c.code === couponCode && c.isActive && new Date(c.validUntil) > new Date()
      );
      
      if (!coupon) {
        throw new Error("Cupom inválido ou expirado.");
      }
      
      // Simulação de validação via API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verificar se o cupom atingiu o limite de uso
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
      // Simulação de obtenção de faturas via API
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
      // Verificar se a fatura existe
      const invoice = invoices.find(inv => inv.id === invoiceId);
      if (!invoice) {
        throw new Error("Fatura não encontrada.");
      }
      
      // Simulação de download via API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Download iniciado",
        description: "O download da sua fatura foi iniciado",
      });
      
      // Retornar uma URL fictícia para o arquivo
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
