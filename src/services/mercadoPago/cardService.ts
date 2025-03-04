
import { MercadoPago } from './sdk';
import { MPCardInfo } from './types';
import { PaymentMethod } from '@/lib/types';

export const CardService = {
  // Gerar token para cartão
  async createCardToken(cardInfo: MPCardInfo): Promise<string> {
    try {
      const response = await MercadoPago.createCardToken({
        cardNumber: cardInfo.cardNumber.replace(/\s/g, ''),
        cardholderName: cardInfo.cardholderName,
        cardExpirationMonth: String(cardInfo.expirationMonth).padStart(2, '0'),
        cardExpirationYear: String(cardInfo.expirationYear),
        securityCode: cardInfo.securityCode,
        identificationType: cardInfo.identificationType || '',
        identificationNumber: cardInfo.identificationNumber || '',
      });

      if (response && response.id) {
        return response.id;
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
      const cardInfo = await MercadoPago.getCardInfo(cardToken);
      
      return {
        id: `mp_${cardToken.substring(0, 8)}`,
        type: 'credit',
        brand: 'visa', // Em um ambiente real, isso viria da resposta da API
        last4: cardInfo.last_four_digits,
        holderName: cardInfo.cardholder.name,
        expiryMonth: cardInfo.expiration_month,
        expiryYear: cardInfo.expiration_year,
        isDefault: true,
        createdAt: new Date(),
        mpToken: cardToken
      };
    } catch (error) {
      console.error('Erro ao adicionar método de pagamento:', error);
      throw error;
    }
  }
};
