
import { MercadoPago } from './sdk';
import { CardService } from './cardService';
import { PaymentService } from './paymentService';
import { SubscriptionService } from './subscriptionService';
import { MPCardInfo, MPUserInfo } from './types';

export const MercadoPagoService = {
  // Card related operations
  createCardToken: CardService.createCardToken,
  addCardPaymentMethod: CardService.addCardPaymentMethod,
  
  // Payment related operations
  processCardPayment: PaymentService.processCardPayment,
  generatePixPayment: PaymentService.generatePixPayment,
  generateBoletoPayment: PaymentService.generateBoletoPayment,
  getPaymentStatus: PaymentService.getPaymentStatus,
  
  // Subscription related operations
  createSubscription: SubscriptionService.createSubscription,
  generateInvoice: SubscriptionService.generateInvoice,
  
  // Check API status
  async checkApiStatus(): Promise<boolean> {
    try {
      // Fazer uma chamada simples para verificar se a API está respondendo
      await MercadoPago.getAllPaymentMethods();
      return true;
    } catch (error) {
      console.error('Erro ao verificar status da API:', error);
      return false;
    }
  }
};

export type { MPCardInfo, MPUserInfo };
export default MercadoPagoService;
