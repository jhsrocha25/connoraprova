
import { MercadoPago } from './sdk';
import { MPUserInfo, MPPixResponse, MPBoletoResponse } from './types';
import { PaymentInvoice } from '@/lib/types';
import { mapPaymentStatus } from '@/lib/mercadoPagoConfig';

export const PaymentService = {
  // Processar pagamento com cartão
  async processCardPayment(token: string, amount: number, description: string): Promise<string> {
    try {
      const payment = await MercadoPago.createPayment({
        token,
        transaction_amount: amount,
        description,
        installments: 1,
        payment_method_id: 'visa',
        payer: {
          email: 'test@test.com'
        }
      });

      return payment.id;
    } catch (error) {
      console.error('Erro ao processar pagamento com cartão:', error);
      throw error;
    }
  },

  // Gerar link de pagamento PIX
  async generatePixPayment(amount: number, description: string): Promise<MPPixResponse> {
    try {
      const payment = await MercadoPago.createPayment({
        transaction_amount: amount,
        description,
        payment_method_id: 'pix',
        payer: {
          email: 'test@test.com', // Em produção, seria o email do usuário
        }
      });

      return {
        qrCode: payment.point_of_interaction.transaction_data.qr_code,
        qrCodeBase64: payment.point_of_interaction.transaction_data.qr_code_base64,
        expirationDate: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas de validade
      };
    } catch (error) {
      console.error('Erro ao gerar pagamento PIX:', error);
      throw error;
    }
  },

  // Gerar boleto
  async generateBoletoPayment(amount: number, description: string, userInfo: MPUserInfo): Promise<MPBoletoResponse> {
    try {
      const payment = await MercadoPago.createPayment({
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

      return {
        boletoUrl: payment.point_of_interaction.transaction_data.ticket_url,
        barcode: "34191.79001 01043.510047 91020.150008 9 87770026000",
        expirationDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 dias de validade
      };
    } catch (error) {
      console.error('Erro ao gerar boleto:', error);
      throw error;
    }
  },

  // Obter status do pagamento
  async getPaymentStatus(paymentId: string): Promise<string> {
    try {
      // Em produção, isso chamaria a API para verificar o status real
      const response = await MercadoPago.getPaymentStatus(paymentId);
      return mapPaymentStatus(response.status);
    } catch (error) {
      console.error('Erro ao obter status do pagamento:', error);
      throw error;
    }
  }
};
