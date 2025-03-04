
import React, { useState, ReactNode, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import PaymentContext from './paymentContext';
import { subscriptionPlans, mockPaymentMethods, mockInvoices } from '@/lib/subscriptionData';
import MercadoPagoService from '@/services/mercadoPagoService';
import { 
  PaymentMethod, 
  PaymentInvoice, 
  Subscription, 
  SubscriptionPlan, 
  Coupon
} from '@/lib/types';
import * as paymentOps from './paymentOperations';

export const PaymentProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
  const [invoices, setInvoices] = useState<PaymentInvoice[]>(mockInvoices);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isMercadoPagoReady, setIsMercadoPagoReady] = useState(false);
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

  useEffect(() => {
    const initMercadoPago = async () => {
      try {
        const isApiReady = await MercadoPagoService.checkApiStatus();
        if (isApiReady) {
          setIsMercadoPagoReady(true);
          console.log('Mercado Pago API iniciada com sucesso');
        } else {
          console.error('Falha ao inicializar API do Mercado Pago');
        }
      } catch (error) {
        console.error('Erro ao inicializar Mercado Pago:', error);
      }
    };

    initMercadoPago();
  }, []);

  // Wrap payment operations with state setters
  const processCardPaymentWrapped = (cardInfo: any, amount: number, description: string) => {
    return paymentOps.processCardPayment(cardInfo, amount, description, setIsLoading, setError);
  };

  const generatePixPaymentWrapped = (amount: number, description: string) => {
    return paymentOps.generatePixPayment(amount, description, setIsLoading, setError);
  };

  const generateBoletoPaymentWrapped = (amount: number, description: string) => {
    return paymentOps.generateBoletoPayment(amount, description, setIsLoading, setError);
  };

  const addPaymentMethodWrapped = (paymentMethodData: Partial<PaymentMethod>) => {
    return paymentOps.addPaymentMethod(
      paymentMethodData, 
      paymentMethods, 
      setPaymentMethods, 
      setIsLoading, 
      setError, 
      processCardPaymentWrapped
    );
  };

  const createSubscriptionWrapped = (planId: string, paymentMethodId?: string) => {
    return paymentOps.createSubscription(
      planId,
      paymentMethodId,
      paymentMethods,
      invoices,
      appliedCoupon,
      user?.id || 'current-user-id',
      setSubscription,
      setInvoices,
      setIsLoading,
      setError
    );
  };

  // These methods need to be implemented fully
  const removePaymentMethod = async (paymentMethodId: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Filter out the payment method
      const updatedMethods = paymentMethods.filter(method => method.id !== paymentMethodId);
      
      // If we removed the default method and there are other methods, make the first one default
      if (paymentMethods.find(m => m.id === paymentMethodId)?.isDefault && updatedMethods.length > 0) {
        updatedMethods[0] = { ...updatedMethods[0], isDefault: true };
      }
      
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      setPaymentMethods(updatedMethods);
      
      // Show success message
      console.log('Payment method removed:', paymentMethodId);
    } catch (error) {
      setError('Failed to remove payment method');
    } finally {
      setIsLoading(false);
    }
  };

  const setDefaultPaymentMethod = async (paymentMethodId: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Update all methods: set isDefault=false for all except the selected one
      const updatedMethods = paymentMethods.map(method => ({
        ...method,
        isDefault: method.id === paymentMethodId
      }));
      
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      setPaymentMethods(updatedMethods);
      
      // Show success message
      console.log('Default payment method set:', paymentMethodId);
    } catch (error) {
      setError('Failed to set default payment method');
    } finally {
      setIsLoading(false);
    }
  };

  const applyCoupon = async (couponCode: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const coupon = activeCoupons.find(
        c => c.code.toLowerCase() === couponCode.toLowerCase() && c.isActive
      );
      
      if (!coupon) {
        setError('Cupom inválido ou expirado');
        return false;
      }
      
      setAppliedCoupon(coupon);
      return true;
    } catch (error) {
      setError('Erro ao aplicar cupom');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getInvoices = async (): Promise<PaymentInvoice[]> => {
    // For now, return the state
    return invoices;
  };

  const downloadInvoice = async (invoiceId: string): Promise<string> => {
    setIsLoading(true);
    try {
      // Simulate generating a download URL
      await new Promise(resolve => setTimeout(resolve, 1000));
      return `https://example.com/invoices/${invoiceId}.pdf`;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelSubscription = async (): Promise<void> => {
    setIsLoading(true);
    try {
      if (!subscription) {
        throw new Error('No active subscription to cancel');
      }
      
      // Update subscription status to canceled
      const updatedSubscription = {
        ...subscription,
        status: 'canceled' as const,
        cancelAtPeriodEnd: true
      };
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setSubscription(updatedSubscription);
    } catch (error) {
      setError('Failed to cancel subscription');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSubscription = async (planId: string): Promise<void> => {
    setIsLoading(true);
    try {
      const newPlan = subscriptionPlans.find(p => p.id === planId);
      if (!newPlan) {
        throw new Error('Plan not found');
      }
      
      if (!subscription) {
        throw new Error('No active subscription to update');
      }
      
      // Update subscription with new plan
      const updatedSubscription = {
        ...subscription,
        planId
      };
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setSubscription(updatedSubscription);
    } catch (error) {
      setError('Failed to update subscription');
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
        addPaymentMethod: addPaymentMethodWrapped,
        removePaymentMethod,
        setDefaultPaymentMethod,
        createSubscription: createSubscriptionWrapped,
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
        setAppliedCoupon,
        generatePixPayment: generatePixPaymentWrapped,
        generateBoletoPayment: generateBoletoPaymentWrapped,
        processCardPayment: processCardPaymentWrapped,
        isMercadoPagoReady
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export default PaymentProvider;
