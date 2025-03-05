
import { PaymentMethod, PaymentInvoice, SubscriptionPlan } from '@/lib/types';
import { subscriptionPlans } from '@/lib/subscriptionData';
import { Subscription } from './paymentContextTypes';

// Mock data for development
const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'pm_1',
    type: 'credit',
    brand: 'visa',
    last4: '4242',
    holderName: 'User Test',
    expiryMonth: 12,
    expiryYear: 2025,
    isDefault: true,
    createdAt: new Date()
  }
];

const mockInvoices: PaymentInvoice[] = [
  {
    id: 'in_1',
    subscriptionId: 'sub_1',
    amount: 49.90,
    status: 'paid',
    paymentMethod: 'credit',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    paidAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  }
];

// Payment operations
export const fetchPaymentMethods = async (): Promise<PaymentMethod[]> => {
  // In a real app, this would be an API call
  return mockPaymentMethods;
};

export const addPaymentMethod = async (method: Partial<PaymentMethod>): Promise<PaymentMethod> => {
  // In a real app, this would be an API call
  const newMethod: PaymentMethod = {
    id: `pm_${Date.now()}`,
    type: method.type || 'credit',
    brand: method.brand || 'visa',
    last4: method.last4 || '0000',
    holderName: method.holderName || '',
    expiryMonth: method.expiryMonth || 12,
    expiryYear: method.expiryYear || 2025,
    isDefault: method.isDefault || false,
    createdAt: new Date()
  };
  
  // Add to mock data
  mockPaymentMethods.push(newMethod);
  
  return newMethod;
};

export const removePaymentMethod = async (id: string): Promise<void> => {
  // In a real app, this would be an API call
  const index = mockPaymentMethods.findIndex(method => method.id === id);
  if (index !== -1) {
    mockPaymentMethods.splice(index, 1);
  }
};

export const setDefaultPaymentMethod = async (id: string): Promise<void> => {
  // In a real app, this would be an API call
  mockPaymentMethods.forEach(method => {
    method.isDefault = method.id === id;
  });
};

// Subscription operations
export const fetchSubscription = async (): Promise<Subscription | null> => {
  // In a real app, this would be an API call
  return null;
};

export const createSubscription = async (planId: string, paymentMethodId?: string): Promise<void> => {
  // In a real app, this would be an API call
  console.log(`Creating subscription for plan ${planId} with payment method ${paymentMethodId || 'default'}`);
};

export const cancelSubscription = async (): Promise<void> => {
  // In a real app, this would be an API call
  console.log('Cancelling subscription');
};

// Invoice operations
export const fetchInvoices = async (): Promise<PaymentInvoice[]> => {
  // In a real app, this would be an API call
  return mockInvoices;
};

export const downloadInvoice = async (invoiceId: string): Promise<string> => {
  // In a real app, this would be an API call
  return `https://example.com/invoices/${invoiceId}`;
};

export const processCouponCode = async (code: string): Promise<{ code: string; discountPercentage: number } | null> => {
  // In a real app, this would be an API call to validate the coupon
  if (code.toUpperCase() === 'WELCOME10') {
    return { code: 'WELCOME10', discountPercentage: 10 };
  }
  if (code.toUpperCase() === 'SAVE20') {
    return { code: 'SAVE20', discountPercentage: 20 };
  }
  return null;
};
