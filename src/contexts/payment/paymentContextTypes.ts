
import { SubscriptionPlan, PaymentMethod, PaymentInvoice } from '@/lib/types';

export interface PaymentContextType {
  // Payment methods management
  paymentMethods: PaymentMethod[];
  addPaymentMethod: (method: Partial<PaymentMethod>) => Promise<void>;
  removePaymentMethod: (id: string) => Promise<void>;
  setDefaultPaymentMethod: (id: string) => Promise<void>;
  processCardPayment: (cardDetails: any) => Promise<boolean>;
  
  // Subscription management
  subscription: SubscriptionPlan | null;
  selectedPlan: SubscriptionPlan | null;
  setSelectedPlan: (plan: SubscriptionPlan | null) => void;
  availablePlans: SubscriptionPlan[];
  createSubscription: (planId: string, paymentMethodId?: string) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  
  // Coupon management
  appliedCoupon: { code: string; discountPercentage: number } | null;
  setAppliedCoupon: (coupon: { code: string; discountPercentage: number } | null) => void;
  applyCoupon: (code: string) => Promise<boolean>;
  
  // Invoice management
  getInvoices: () => Promise<PaymentInvoice[]>;
  downloadInvoice: (invoiceId: string) => Promise<string>;
  
  // Loading state
  isLoading: boolean;
}
