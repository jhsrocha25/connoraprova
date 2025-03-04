
export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  progress?: number;
  modules: CourseModule[];
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  content: ModuleContent[];
  isCompleted?: boolean;
}

export interface ModuleContent {
  id: string;
  type: 'pdf' | 'interactive';
  title: string;
  url: string;
  duration?: string;
  isCompleted?: boolean;
}

export interface Question {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  userAnswer?: string;
  isCorrect?: boolean;
}

export interface UserProgress {
  userId: string;
  totalQuestionsAnswered: number;
  correctAnswers: number;
  incorrectAnswers: number;
  questionsHistory: Question[];
  courseProgress: {
    courseId: string;
    progress: number;
    lastAccessed: Date;
  }[];
  performanceByCategory: {
    category: string;
    correctPercentage: number;
    questionsAttempted: number;
  }[];
  streak: number;
  lastActive: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'student' | 'admin';
  joinedDate: Date;
  progress: UserProgress;
  subscription?: Subscription;
}

export interface Concurso {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  organizacao: string;
  dataProva?: string;
  status: 'aberto' | 'encerrado' | 'previsto';
  materias: ConcursoMateria[];
  documentos: ConcursoDocumento[];
}

export interface ConcursoMateria {
  id: string;
  title: string;
  description: string;
  questoes: Question[];
  progress?: number;
}

export interface ConcursoDocumento {
  id: string;
  tipo: 'edital' | 'prova' | 'gabarito' | 'outro';
  titulo: string;
  url: string;
  dataCriacao: Date;
  processado: boolean;
}

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  registerWithGoogle: (googleUserData: { name: string; email: string; imageUrl?: string }) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  twoFactorPending?: boolean;
  verifyLoginCode?: (code: string) => Promise<boolean>;
};

// Novas interfaces para o sistema de pagamento
export interface PaymentMethod {
  id: string;
  type: 'credit' | 'debit' | 'pix' | 'boleto';
  brand?: 'visa' | 'mastercard' | 'amex' | 'elo' | 'hipercard' | 'other';
  last4?: string;
  holderName?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  createdAt: Date;
}

export interface PaymentInvoice {
  id: string;
  subscriptionId: string;
  amount: number;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'credit' | 'debit' | 'pix' | 'boleto';
  createdAt: Date;
  paidAt?: Date;
  dueDate: Date;
  invoiceUrl?: string;
  receiptUrl?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'monthly' | 'quarterly' | 'annual';
  features: string[];
  isMostPopular?: boolean;
  trialDays?: number;
  discountPercentage?: number;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'pending';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  paymentMethodId?: string;
  trialEnd?: Date;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercentage: number;
  validUntil: Date;
  maxUses?: number;
  currentUses: number;
  isActive: boolean;
}

export type PaymentContextType = {
  paymentMethods: PaymentMethod[];
  invoices: PaymentInvoice[];
  subscription: Subscription | null;
  availablePlans: SubscriptionPlan[];
  activeCoupons: Coupon[];
  isLoading: boolean;
  error: string | null;
  addPaymentMethod: (paymentMethodData: Partial<PaymentMethod>) => Promise<void>;
  removePaymentMethod: (paymentMethodId: string) => Promise<void>;
  setDefaultPaymentMethod: (paymentMethodId: string) => Promise<void>;
  createSubscription: (planId: string, paymentMethodId?: string) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  updateSubscription: (planId: string) => Promise<void>;
  applyCoupon: (couponCode: string) => Promise<boolean>;
  getInvoices: () => Promise<PaymentInvoice[]>;
  downloadInvoice: (invoiceId: string) => Promise<string>;
  selectedPlan: SubscriptionPlan | null;
  setSelectedPlan: (plan: SubscriptionPlan | null) => void;
  selectedPaymentMethod: PaymentMethod | null;
  setSelectedPaymentMethod: (method: PaymentMethod | null) => void;
  appliedCoupon: Coupon | null;
  setAppliedCoupon: (coupon: Coupon | null) => void;
};
