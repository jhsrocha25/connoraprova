
import { Subscription, SubscriptionPlan, PaymentInvoice } from '@/lib/types';

export const SubscriptionService = {
  // Criar assinatura
  async createSubscription(
    planId: string, 
    paymentMethodId: string, 
    userId: string,
    plan: SubscriptionPlan
  ): Promise<Subscription> {
    try {
      // Em uma implementação real, este chamaria a API para criar uma assinatura recorrente
      // Para demonstração, simulamos uma resposta
      
      const subscriptionData: Subscription = {
        id: `sub_mp_${Math.random().toString(36).substring(2, 10)}`,
        userId,
        planId,
        status: plan.trialDays ? 'trialing' : 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
        cancelAtPeriodEnd: false,
        createdAt: new Date(),
        paymentMethodId,
      };
      
      // Definir a data de término com base no intervalo da assinatura
      const endDate = new Date();
      if (plan.interval === 'monthly') {
        endDate.setMonth(endDate.getMonth() + 1);
      } else if (plan.interval === 'quarterly') {
        endDate.setMonth(endDate.getMonth() + 3);
      } else if (plan.interval === 'annual') {
        endDate.setFullYear(endDate.getFullYear() + 1);
      }
      subscriptionData.currentPeriodEnd = endDate;
      
      // Adicionar data de término do teste se aplicável
      if (plan.trialDays) {
        const trialEnd = new Date();
        trialEnd.setDate(trialEnd.getDate() + plan.trialDays);
        subscriptionData.trialEnd = trialEnd;
      }

      return subscriptionData;
    } catch (error) {
      console.error('Erro ao criar assinatura:', error);
      throw error;
    }
  },

  // Gerar fatura para a assinatura
  async generateInvoice(
    subscriptionId: string,
    planPrice: number,
    discountPercentage: number = 0
  ): Promise<PaymentInvoice> {
    try {
      // Em produção, isso chamaria a API para gerar uma fatura real
      const finalAmount = planPrice * (1 - discountPercentage / 100);
      
      return {
        id: `inv_mp_${Math.random().toString(36).substring(2, 10)}`,
        subscriptionId,
        amount: finalAmount,
        status: 'paid',
        paymentMethod: 'credit',
        createdAt: new Date(),
        paidAt: new Date(),
        dueDate: new Date(),
        invoiceUrl: `https://api.mercadopago.com/v1/invoices/sample`, // URL fictícia
        receiptUrl: `https://api.mercadopago.com/v1/payments/receipt/sample`, // URL fictícia
      };
    } catch (error) {
      console.error('Erro ao gerar fatura:', error);
      throw error;
    }
  }
};
