
import { 
  PaymentMethod, 
  PaymentInvoice, 
  Subscription, 
  SubscriptionPlan, 
  Coupon, 
  MercadoPagoCheckout
} from '@/lib/types';

export interface PaymentContextState {
  paymentMethods: PaymentMethod[];
  invoices: PaymentInvoice[];
  subscription: Subscription | null;
  availablePlans: SubscriptionPlan[];
  activeCoupons: Coupon[];
  isLoading: boolean;
  error: string | null;
  selectedPlan: SubscriptionPlan | null;
  selectedPaymentMethod: PaymentMethod | null;
  appliedCoupon: Coupon | null;
  isMercadoPagoReady: boolean;
}

export interface PaymentContextActions {
  addPaymentMethod: (paymentMethodData: Partial<PaymentMethod>) => Promise<void>;
  removePaymentMethod: (paymentMethodId: string) => Promise<void>;
  setDefaultPaymentMethod: (paymentMethodId: string) => Promise<void>;
  createSubscription: (planId: string, paymentMethodId?: string) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  updateSubscription: (planId: string) => Promise<void>;
  applyCoupon: (couponCode: string) => Promise<boolean>;
  getInvoices: () => Promise<PaymentInvoice[]>;
  downloadInvoice: (invoiceId: string) => Promise<string>;
  setSelectedPlan: (plan: SubscriptionPlan | null) => void;
  setSelectedPaymentMethod: (method: PaymentMethod | null) => void;
  setAppliedCoupon: (coupon: Coupon | null) => void;
  generatePixPayment: (amount: number, description: string) => Promise<MercadoPagoCheckout>;
  generateBoletoPayment: (amount: number, description: string) => Promise<MercadoPagoCheckout>;
  processCardPayment: (cardInfo: any, amount: number, description: string) => Promise<string>;
}

export type PaymentContextType = PaymentContextState & PaymentContextActions;
