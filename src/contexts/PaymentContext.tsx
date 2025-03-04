import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { 
  PaymentMethod, 
  PaymentInvoice, 
  Subscription, 
  SubscriptionPlan, 
  Coupon, 
  PaymentContextType,
  MercadoPagoCheckout
} from '@/lib/types';
import { subscriptionPlans, mockPaymentMethods, mockInvoices } from '@/lib/subscriptionData';
import { toast } from '@/components/ui/use-toast';
import MercadoPagoService from '@/services/mercadoPagoService';
import { MERCADO_PAGO_PUBLIC_KEY } from '@/lib/mercadoPagoConfig';
import { useAuth } from './AuthContext';

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

  const processCardPayment = async (cardInfo: any, amount: number, description: string): Promise<string> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const cardToken = await MercadoPagoService.createCardToken({
        cardholderName: cardInfo.holderName,
        cardNumber: cardInfo.cardNumber,
        expirationMonth: cardInfo.expiryMonth,
        expirationYear: cardInfo.expiryYear,
        securityCode: cardInfo.securityCode
      });
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Pagamento processado",
        description: "Seu pagamento foi processado com sucesso.",
      });
      
      return cardToken;
    } catch (err) {
      setError("Erro ao processar pagamento com cartão");
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível processar seu pagamento. Verifique os dados do cartão.",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const generatePixPayment = async (amount: number, description: string): Promise<MercadoPagoCheckout> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const pixData = await MercadoPagoService.generatePixPayment(amount, description);
      
      toast({
        title: "PIX gerado",
        description: "Seu código PIX foi gerado com sucesso. Escaneie o QR code para pagar.",
      });
      
      return {
        preferenceId: `pix_${Math.random().toString(36).substring(2, 10)}`,
        qrCode: pixData.qrCode,
        qrCodeBase64: pixData.qrCodeBase64,
        expirationDate: pixData.expirationDate
      };
    } catch (err) {
      setError("Erro ao gerar pagamento PIX");
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível gerar o pagamento PIX. Tente novamente mais tarde.",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const generateBoletoPayment = async (amount: number, description: string): Promise<MercadoPagoCheckout> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const userInfo = {
        email: 'usuario@exemplo.com',
        firstName: 'Nome',
        lastName: 'Sobrenome',
        cpf: '12345678900',
        zipCode: '01234567',
        street: 'Rua Exemplo',
        number: '123',
        neighborhood: 'Bairro',
        city: 'Cidade',
        state: 'SP'
      };
      
      const boletoData = await MercadoPagoService.generateBoletoPayment(amount, description, userInfo);
      
      toast({
        title: "Boleto gerado",
        description: "Seu boleto foi gerado com sucesso. Acesse o link para visualizar.",
      });
      
      return {
        preferenceId: `boleto_${Math.random().toString(36).substring(2, 10)}`,
        boletoUrl: boletoData.boletoUrl,
        barcodeContent: boletoData.barcode,
        expirationDate: boletoData.expirationDate
      };
    } catch (err) {
      setError("Erro ao gerar boleto");
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível gerar o boleto. Tente novamente mais tarde.",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const addPaymentMethod = async (paymentMethodData: Partial<PaymentMethod>): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      if ((paymentMethodData.type === 'credit' || paymentMethodData.type === 'debit') && 
          paymentMethodData.holderName && 
          paymentMethodData.cardNumber && 
          paymentMethodData.securityCode) {
        
        const cardToken = await processCardPayment(
          paymentMethodData,
          1,
          'Validação de cartão'
        );
        
        paymentMethodData.mpToken = cardToken;
      }
      
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
        createdAt: new Date(),
        mpToken: paymentMethodData.mpToken
      };
      
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

  const createSubscription = async (planId: string, paymentMethodId?: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const plan = subscriptionPlans.find(plan => plan.id === planId);
      if (!plan) {
        throw new Error("Plano não encontrado");
      }
      
      let methodId = paymentMethodId;
      if (!methodId) {
        const defaultMethod = paymentMethods.find(method => method.isDefault);
        if (!defaultMethod) {
          throw new Error("Nenhum método de pagamento encontrado");
        }
        methodId = defaultMethod.id;
      }
      
      const finalAmount = plan.price * (1 - (appliedCoupon?.discountPercentage || 0) / 100);
      
      const userId = user?.id || 'current-user-id';
      
      const newSubscription = await MercadoPagoService.createSubscription(
        plan.id,
        methodId,
        userId,
        plan
      );
      
      const invoice = await MercadoPagoService.generateInvoice(
        newSubscription.id,
        plan.price,
        appliedCoupon?.discountPercentage
      );
      
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
        removePaymentMethod: () => {},
        setDefaultPaymentMethod: () => {},
        createSubscription,
        cancelSubscription: () => Promise.resolve(),
        updateSubscription: () => Promise.resolve(),
        applyCoupon: () => Promise.resolve(false),
        getInvoices: () => Promise.resolve([]),
        downloadInvoice: () => Promise.resolve(''),
        selectedPlan,
        setSelectedPlan,
        selectedPaymentMethod,
        setSelectedPaymentMethod,
        appliedCoupon,
        setAppliedCoupon,
        generatePixPayment,
        generateBoletoPayment,
        processCardPayment
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};
