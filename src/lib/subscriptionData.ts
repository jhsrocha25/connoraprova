
import { SubscriptionPlan, PaymentMethod, PaymentInvoice, Subscription, Coupon } from './types';

export const mockSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'plan-1',
    name: 'Plano Básico',
    description: 'Acesso a material básico e simulados limitados',
    price: 49.90,
    interval: 'monthly',
    features: [
      'Acesso a todos os materiais básicos',
      'Simulados limitados por mês',
      'Suporte por email'
    ],
    trialDays: 7
  },
  {
    id: 'plan-2',
    name: 'Plano Premium',
    description: 'Acesso ilimitado a todo conteúdo e recursos',
    price: 89.90,
    interval: 'monthly',
    features: [
      'Acesso a todo o conteúdo da plataforma',
      'Simulados ilimitados',
      'Suporte prioritário',
      'Acesso ao chat de IA',
      'Análise de desempenho avançada'
    ],
    isMostPopular: true,
    trialDays: 7
  },
  {
    id: 'plan-3',
    name: 'Plano Anual',
    description: 'Economia de 20% com pagamento anual',
    price: 863.04, // 12 x 71.92 (20% de desconto no mensal Premium)
    interval: 'annual',
    features: [
      'Todos os benefícios do Plano Premium',
      'Economia de 20% em relação ao pagamento mensal',
      'Acesso a treinamentos exclusivos',
      'Mentoria mensal',
      'Garantia de satisfação de 30 dias'
    ],
    discountPercentage: 20,
    trialDays: 7
  }
];

export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'pm-1',
    type: 'credit',
    brand: 'visa',
    last4: '4242',
    holderName: 'Usuário Teste',
    expiryMonth: 12,
    expiryYear: 2024,
    isDefault: true,
    createdAt: new Date('2023-05-10')
  },
  {
    id: 'pm-2',
    type: 'pix',
    isDefault: false,
    createdAt: new Date('2023-06-15')
  }
];

export const mockInvoices: PaymentInvoice[] = [
  {
    id: 'inv-1',
    subscriptionId: 'sub-1',
    amount: 89.90,
    status: 'paid',
    paymentMethod: 'credit',
    createdAt: new Date('2023-06-01'),
    paidAt: new Date('2023-06-01'),
    dueDate: new Date('2023-06-05'),
    receiptUrl: '#'
  },
  {
    id: 'inv-2',
    subscriptionId: 'sub-1',
    amount: 89.90,
    status: 'paid',
    paymentMethod: 'credit',
    createdAt: new Date('2023-07-01'),
    paidAt: new Date('2023-07-01'),
    dueDate: new Date('2023-07-05'),
    receiptUrl: '#'
  },
  {
    id: 'inv-3',
    subscriptionId: 'sub-1',
    amount: 89.90,
    status: 'pending',
    paymentMethod: 'credit',
    createdAt: new Date('2023-08-01'),
    dueDate: new Date('2023-08-05')
  }
];

export const mockSubscription: Subscription = {
  id: 'sub-1',
  userId: 'user-1',
  planId: 'plan-2',
  status: 'active',
  currentPeriodStart: new Date('2023-07-01'),
  currentPeriodEnd: new Date('2023-08-01'),
  cancelAtPeriodEnd: false,
  createdAt: new Date('2023-06-01'),
  paymentMethodId: 'pm-1'
};

export const mockCoupons: Coupon[] = [
  {
    id: 'coupon-1',
    code: 'BEMVINDO10',
    discountPercentage: 10,
    validUntil: new Date('2023-12-31'),
    maxUses: 1000,
    currentUses: 456,
    isActive: true
  },
  {
    id: 'coupon-2',
    code: 'FERIAS20',
    discountPercentage: 20,
    validUntil: new Date('2023-09-30'),
    maxUses: 500,
    currentUses: 123,
    isActive: true
  }
];
