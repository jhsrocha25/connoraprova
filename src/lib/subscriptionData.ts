
import { SubscriptionPlan, PaymentMethod, PaymentInvoice } from './types';

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'plano-mensal',
    name: 'Plano Mensal',
    description: 'Acesso a todos os recursos premium por um mês',
    price: 29.90,
    interval: 'monthly',
    features: [
      'Acesso a todos os cursos',
      'Material exclusivo para concursos',
      'Simulados ilimitados',
      'Suporte prioritário'
    ],
    trialDays: 7
  },
  {
    id: 'plano-trimestral',
    name: 'Plano Trimestral',
    description: 'Economize 15% com o plano trimestral',
    price: 79.90,
    interval: 'quarterly',
    features: [
      'Todos os benefícios do plano mensal',
      'Economize 15% comparado ao plano mensal',
      'Acesso a webinars exclusivos',
      'Simulados personalizados'
    ],
    isMostPopular: true,
    trialDays: 7
  },
  {
    id: 'plano-anual',
    name: 'Plano Anual',
    description: 'Melhor valor: economize 30% com o plano anual',
    price: 349.90,
    interval: 'annual',
    features: [
      'Todos os benefícios dos planos anteriores',
      'Economize 30% comparado ao plano mensal',
      'Acesso a conteúdo adicional exclusivo',
      'Mentorias trimestrais',
      'Certificados de conclusão'
    ],
    discountPercentage: 30
  }
];

export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'pm_1',
    type: 'credit',
    brand: 'visa',
    last4: '4242',
    holderName: 'João Silva',
    expiryMonth: 12,
    expiryYear: 2025,
    isDefault: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    mpToken: 'mp_8765432'
  },
  {
    id: 'pm_2',
    type: 'credit',
    brand: 'mastercard',
    last4: '5555',
    holderName: 'João Silva',
    expiryMonth: 10,
    expiryYear: 2024,
    isDefault: false,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    mpToken: 'mp_1234567'
  }
];

export const mockInvoices: PaymentInvoice[] = [
  {
    id: 'inv_1',
    subscriptionId: 'sub_1',
    amount: 49.90,
    status: 'paid',
    paymentMethod: 'credit',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    paidAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    invoiceUrl: 'https://api.mercadopago.com/v1/invoices/sample',
    receiptUrl: 'https://api.mercadopago.com/v1/payments/receipt/sample',
    mpPaymentId: 'mp_pay_123456'
  },
  {
    id: 'inv_2',
    subscriptionId: 'sub_1',
    amount: 49.90,
    status: 'paid',
    paymentMethod: 'credit',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
    paidAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    invoiceUrl: 'https://api.mercadopago.com/v1/invoices/sample2',
    receiptUrl: 'https://api.mercadopago.com/v1/payments/receipt/sample2',
    mpPaymentId: 'mp_pay_234567'
  },
  {
    id: 'inv_3',
    subscriptionId: 'sub_1',
    amount: 49.90,
    status: 'pending',
    paymentMethod: 'boleto',
    createdAt: new Date(), // Today
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    invoiceUrl: 'https://api.mercadopago.com/v1/invoices/sample3',
    receiptUrl: 'https://api.mercadopago.com/v1/payments/receipt/sample3',
    mpPaymentId: 'mp_pay_345678'
  }
];
