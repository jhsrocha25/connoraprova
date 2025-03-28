import React, { useState, useEffect } from 'react';
import { PaymentContext } from './paymentContext';
import { SubscriptionPlan, PaymentMethod, PaymentInvoice } from '@/lib/types';
import { subscriptionPlans } from '@/lib/subscriptionData';
import { useToast } from "@/hooks/use-toast";
import { Subscription } from './paymentContextTypes';
import {
  fetchPaymentMethods,
  addPaymentMethod as addPaymentMethodOperation,
  removePaymentMethod as removePaymentMethodOperation,
  setDefaultPaymentMethod as setDefaultPaymentMethodOperation,
  fetchSubscription,
  createSubscription as createSubscriptionOperation,
  cancelSubscription as cancelSubscriptionOperation,
  fetchInvoices,
  downloadInvoice as downloadInvoiceOperation,
  processCouponCode,
} from './paymentOperations';

export interface PaymentProviderProps {
  children: React.ReactNode;
}

export const PaymentProvider: React.FC<PaymentProviderProps> = ({ children }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPercentage: number } | null>(null);
  const [invoices, setInvoices] = useState<PaymentInvoice[]>([]);

  useEffect(() => {
    const initPaymentData = async () => {
      try {
        setIsLoading(true);
        const methods = await fetchPaymentMethods();
        setPaymentMethods(methods);
        
        const sub = await fetchSubscription();
        setSubscription(sub);
        
        const fetchedInvoices = await fetchInvoices();
        setInvoices(fetchedInvoices);
      } catch (error) {
        console.error('Error initializing payment data:', error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar os dados de pagamento.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    initPaymentData();
  }, [toast]);

  const addPaymentMethod = async (method: Partial<PaymentMethod>) => {
    try {
      setIsLoading(true);
      const newMethod = await addPaymentMethodOperation(method);
      setPaymentMethods(prev => [...prev, newMethod]);
      
      toast({
        title: "Método de pagamento adicionado",
        description: "Seu método de pagamento foi salvo com sucesso.",
      });
    } catch (error) {
      console.error('Error adding payment method:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível adicionar o método de pagamento.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removePaymentMethod = async (id: string) => {
    try {
      setIsLoading(true);
      await removePaymentMethodOperation(id);
      setPaymentMethods(prev => prev.filter(method => method.id !== id));
      
      toast({
        title: "Método de pagamento removido",
        description: "O método de pagamento foi removido com sucesso.",
      });
    } catch (error) {
      console.error('Error removing payment method:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível remover o método de pagamento.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const setDefaultPaymentMethod = async (id: string) => {
    try {
      setIsLoading(true);
      await setDefaultPaymentMethodOperation(id);
      
      setPaymentMethods(prev => prev.map(method => ({
        ...method,
        isDefault: method.id === id
      })));
      
      toast({
        title: "Método padrão atualizado",
        description: "Seu método de pagamento padrão foi atualizado.",
      });
    } catch (error) {
      console.error('Error setting default payment method:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível definir o método de pagamento padrão.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const processCardPayment = async (cardDetails: any) => {
    try {
      setIsLoading(true);
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Processing card payment', cardDetails);
      
      // In a real app, this would process the payment via a payment processor
      toast({
        title: "Pagamento processado",
        description: "Seu pagamento foi processado com sucesso.",
      });
      
      return true;
    } catch (error) {
      console.error('Error processing card payment:', error);
      toast({
        variant: "destructive",
        title: "Erro no pagamento",
        description: "Não foi possível processar o pagamento.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const createSubscription = async (planId: string, paymentMethodId?: string) => {
    try {
      setIsLoading(true);
      await createSubscriptionOperation(planId, paymentMethodId);
      
      // For demo, we'll set a mock subscription
      const plan = subscriptionPlans.find(p => p.id === planId);
      if (plan) {
        const now = new Date();
        const endDate = new Date();
        endDate.setDate(now.getDate() + 30); // 30 days subscription
        
        setSubscription({
          id: `sub_${Date.now()}`,
          planId: plan.id,
          status: plan.trialDays ? 'trialing' : 'active',
          currentPeriodStart: now,
          currentPeriodEnd: endDate,
          cancelAtPeriodEnd: false,
          paymentMethodId: paymentMethodId,
          trialEnd: plan.trialDays ? new Date(now.getTime() + plan.trialDays * 24 * 60 * 60 * 1000) : undefined
        });
      }
      
      toast({
        title: "Assinatura criada",
        description: "Sua assinatura foi criada com sucesso.",
      });
    } catch (error) {
      console.error('Error creating subscription:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível criar a assinatura.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const cancelSubscription = async () => {
    try {
      setIsLoading(true);
      await cancelSubscriptionOperation();
      
      // Update the subscription status
      if (subscription) {
        setSubscription({
          ...subscription,
          cancelAtPeriodEnd: true
        });
      }
      
      toast({
        title: "Assinatura cancelada",
        description: "Sua assinatura foi cancelada e não será renovada automaticamente.",
      });
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível cancelar a assinatura.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyCoupon = async (code: string) => {
    try {
      setIsLoading(true);
      
      const coupon = await processCouponCode(code);
      if (coupon) {
        setAppliedCoupon(coupon);
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Cupom inválido",
          description: "O código do cupom não é válido ou expirou.",
        });
        return false;
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível aplicar o cupom.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getInvoices = async () => {
    try {
      setIsLoading(true);
      const fetchedInvoices = await fetchInvoices();
      setInvoices(fetchedInvoices);
      return fetchedInvoices;
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar as faturas.",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const downloadInvoice = async (invoiceId: string) => {
    try {
      setIsLoading(true);
      const url = await downloadInvoiceOperation(invoiceId);
      return url;
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível baixar a fatura.",
      });
      return '';
    } finally {
      setIsLoading(false);
    }
  };

  const generatePixPayment = async (amount: number, description: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      qrCodeBase64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAYKElEQVR4Xu2d23bbOgxE6///6Pa4TbzqS3Ux4ADgWX02iDUDkKIouYm...",
      qrCode: "00020126580014br.gov.bcb.pix0136b76aa9c5-645a-463a-9875-fd8730ce454f5204000053039865802BR5912TestCompany6009SaoPaulo622905257MGGvMcfNNijl3HXXZ6304DF13",
      expirationDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
    };
  };

  const generateBoletoPayment = async (amount: number, description: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      boletoUrl: "https://www.mercadopago.com.br/payments/123456789/boleto",
      barcodeContent: "23793.38128 60048.741591 84806.801014 2 89550000035000",
      expirationDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    };
  };

  return (
    <PaymentContext.Provider
      value={{
        paymentMethods,
        addPaymentMethod,
        removePaymentMethod,
        setDefaultPaymentMethod,
        processCardPayment,
        
        subscription,
        selectedPlan,
        setSelectedPlan,
        availablePlans: subscriptionPlans,
        createSubscription,
        cancelSubscription,
        
        appliedCoupon,
        setAppliedCoupon,
        applyCoupon,
        
        getInvoices,
        downloadInvoice,
        invoices,
        
        generatePixPayment,
        generateBoletoPayment,
        
        isLoading,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};
