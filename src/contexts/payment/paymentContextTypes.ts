
import { SubscriptionPlan, PaymentMethod, PaymentInvoice } from '@/lib/types';

export interface PaymentContextType {
  // Payment methods management
  paymentMethods: PaymentMethod[];
  addPaymentMethod: (method: Partial<PaymentMethod>) => Promise<void>;
  removePaymentMethod: (id: string) => Promise<void>;
  setDefaultPaymentMethod: (id: string) => Promise<void>;
  processCardPayment: (cardDetails: any) => Promise<boolean>;
  
  // Subscription management
  subscription: Subscription | null;
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
  invoices: PaymentInvoice[]; // Add this property for direct access to invoices
  
  // MercadoPago specific functions
  generatePixPayment?: (amount: number, description: string) => Promise<any>;
  generateBoletoPayment?: (amount: number, description: string) => Promise<any>;
  
  // Loading state
  isLoading: boolean;
}

export interface Subscription {
  id: string;
  planId: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'pending';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  paymentMethodId?: string;
  trialEnd?: Date;
}
