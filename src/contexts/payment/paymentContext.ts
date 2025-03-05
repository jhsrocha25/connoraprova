
import { createContext, useContext } from 'react';
import { PaymentContextType } from './paymentContextTypes';

const defaultContext: PaymentContextType = {
  paymentMethods: [],
  addPaymentMethod: async () => {},
  removePaymentMethod: async () => {},
  setDefaultPaymentMethod: async () => {},
  processCardPayment: async () => false,
  
  subscription: null,
  selectedPlan: null,
  setSelectedPlan: () => {},
  availablePlans: [],
  createSubscription: async () => {},
  cancelSubscription: async () => {},
  
  appliedCoupon: null,
  setAppliedCoupon: () => {},
  applyCoupon: async () => false,
  
  getInvoices: async () => [],
  downloadInvoice: async () => '',
  
  isLoading: false,
};

export const PaymentContext = createContext<PaymentContextType>(defaultContext);

export const usePayment = () => useContext(PaymentContext);
