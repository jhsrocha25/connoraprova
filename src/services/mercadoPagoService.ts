
import MercadoPago from 'mercadopago';
import { MERCADO_PAGO_ACCESS_TOKEN, MERCADO_PAGO_PUBLIC_KEY, mapPaymentStatus } from '@/lib/mercadoPagoConfig';
import { PaymentMethod, Subscription, SubscriptionPlan, PaymentInvoice } from '@/lib/types';

// Inicializar o SDK do Mercado Pago
MercadoPago.configure({
  access_token: MERCADO_PAGO_ACCESS_TOKEN,
});

// Tipos específicos do Mercado Pago
interface MPCardToken {
  id: string;
  status: string;
  card_number_length: number;
  date_created: string;
  date_last_updated: string;
  date_due: string;
  luhn_validation: boolean;
  live_mode: boolean;
  card_id: string | null;
  security_code_length: number;
  expiration_month: number;
  expiration_year: number;
  last_four_digits: string;
}

interface MPCardInfo {
  token: string;
  cardholderName: string;
  cardNumber: string;
  expirationMonth: number;
  expirationYear: number;
  securityCode: string;
  identificationType?: string;
  identificationNumber?: string;
}

export const MercadoPagoService = {
  // Gerar token para cartão
  async createCardToken(cardInfo: MPCardInfo): Promise<string> {
    try {
      const response = await MercadoPago.card.create({
        cardNumber: cardInfo.cardNumber.replace(/\s/g, ''),
        cardholderName: cardInfo.cardholderName,
        cardExpirationMonth: String(cardInfo.expirationMonth).padStart(2, '0'),
        cardExpirationYear: String(cardInfo.expirationYear),
        securityCode: cardInfo.securityCode,
        identificationType: cardInfo.identificationType || '',
        identificationNumber: cardInfo.identificationNumber || '',
      });

      if (response.status === 201 && response.data && response.data.id) {
        return response.data.id;
      }

      throw new Error('Falha ao gerar token do cartão');
    } catch (error) {
      console.error('Erro ao criar token de cartão:', error);
      throw error;
    }
  },

  // Adicionar um cartão como método de pagamento
  async addCardPaymentMethod(cardToken: string, userId: string): Promise<PaymentMethod> {
    try {
      // Em uma implementação real, este chamaria a API para associar o cartão ao usuário
      // Para demonstração, vamos simular uma resposta
      
      // Obter informações do cartão a partir do token (em produção seria em backend)
      const cardInfo = await MercadoPago.card.get(cardToken);
      
      return {
        id: `mp_${cardToken.substring(0, 8)}`,
        type: 'credit',
        brand: 'visa', // Em um ambiente real, isso viria da resposta da API
        last4: cardInfo.data.last_four_digits,
        holderName: cardInfo.data.cardholder.name,
        expiryMonth: cardInfo.data.expiration_month,
        expiryYear: cardInfo.data.expiration_year,
        isDefault: true,
        createdAt: new Date()
      };
    } catch (error) {
      console.error('Erro ao adicionar método de pagamento:', error);
      throw error;
    }
  },

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
      
      const subscriptionData = {
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
  },

  // Obter status do pagamento
  async getPaymentStatus(paymentId: string): Promise<string> {
    try {
      // Em produção, isso chamaria a API para verificar o status real
      const response = await MercadoPago.payment.get(paymentId);
      return mapPaymentStatus(response.data.status);
    } catch (error) {
      console.error('Erro ao obter status do pagamento:', error);
      throw error;
    }
  },

  // Gerar link de pagamento PIX
  async generatePixPayment(amount: number, description: string): Promise<{qrCode: string, qrCodeBase64: string, expirationDate: Date}> {
    try {
      const payment = await MercadoPago.payment.create({
        transaction_amount: amount,
        description,
        payment_method_id: 'pix',
        payer: {
          email: 'test@test.com', // Em produção, seria o email do usuário
        }
      });

      // Em ambiente real, estes dados viriam da resposta da API
      return {
        qrCode: payment.data.point_of_interaction.transaction_data.qr_code,
        qrCodeBase64: payment.data.point_of_interaction.transaction_data.qr_code_base64,
        expirationDate: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas de validade
      };
    } catch (error) {
      console.error('Erro ao gerar pagamento PIX:', error);
      throw error;
    }
  },

  // Gerar boleto
  async generateBoletoPayment(amount: number, description: string, userInfo: any): Promise<{boletoUrl: string, barcode: string, expirationDate: Date}> {
    try {
      const payment = await MercadoPago.payment.create({
        transaction_amount: amount,
        description,
        payment_method_id: 'bolbradesco',
        payer: {
          email: userInfo.email,
          first_name: userInfo.firstName,
          last_name: userInfo.lastName,
          identification: {
            type: 'CPF',
            number: userInfo.cpf
          },
          address: {
            zip_code: userInfo.zipCode,
            street_name: userInfo.street,
            street_number: userInfo.number,
            neighborhood: userInfo.neighborhood,
            city: userInfo.city,
            federal_unit: userInfo.state
          }
        }
      });

      // Em ambiente real, estes dados viriam da resposta da API
      return {
        boletoUrl: payment.data.transaction_details.external_resource_url,
        barcode: payment.data.barcode.content,
        expirationDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 dias de validade
      };
    } catch (error) {
      console.error('Erro ao gerar boleto:', error);
      throw error;
    }
  },

  // Verificar se a API está disponível e configurada corretamente
  async checkApiStatus(): Promise<boolean> {
    try {
      // Fazer uma chamada simples para verificar se a API está respondendo
      await MercadoPago.payment_methods.listAll();
      return true;
    } catch (error) {
      console.error('Erro ao verificar status da API:', error);
      return false;
    }
  }
};

export default MercadoPagoService;
