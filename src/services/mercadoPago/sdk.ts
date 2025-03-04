
// Mock implementation of the Mercado Pago SDK for development purposes
// In a real implementation, this would be replaced with the actual SDK

export const MercadoPago = {
  // Mock SDK methods
  createCardToken: async (cardData: any) => {
    console.log('Creating card token with MercadoPago:', cardData);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { id: `token_${Math.random().toString(36).substring(2, 10)}` };
  },
  
  getCardInfo: async (token: string) => {
    console.log('Getting card info for token:', token);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      last_four_digits: '4242',
      expiration_month: 12,
      expiration_year: 2025,
      cardholder: { name: 'TEST USER' }
    };
  },
  
  createPayment: async (paymentData: any) => {
    console.log('Creating payment with MercadoPago:', paymentData);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      id: `payment_${Math.random().toString(36).substring(2, 10)}`,
      status: 'approved',
      status_detail: 'accredited',
      payment_method_id: paymentData.payment_method_id,
      payment_type_id: paymentData.payment_type_id,
      transaction_amount: paymentData.transaction_amount,
      date_created: new Date().toISOString(),
      date_approved: new Date().toISOString(),
      payer: paymentData.payer,
      point_of_interaction: {
        transaction_data: {
          qr_code: "00020101021243650016COM.MERCADOLIBRE02013063638f1192a-5fd1-4180-a180-8bcae3556bc35204000053039865802BR5925Test Test 6009SAO PAULO62070503***63040B8D",
          qr_code_base64: "iVBORw0KGgoAAAANSUhEUgAABRQAAAUUCAYAAACu5p7oAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAIABJREFUeJzs3Xm8ZFV96//3QYaIgIAgIaFQQCBEMGMSTbyKSRQnNO...",
          ticket_url: "https://www.mercadopago.com.br/payments/123456789/ticket?caller_id=123456&hash=123456789abcdef"
        }
      }
    };
  },
  
  getPaymentStatus: async (paymentId: string) => {
    console.log('Getting payment status for:', paymentId);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return { status: 'approved' };
  },
  
  getAllPaymentMethods: async () => {
    console.log('Getting all payment methods');
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      { id: 'visa', name: 'Visa', payment_type_id: 'credit_card' },
      { id: 'mastercard', name: 'Mastercard', payment_type_id: 'credit_card' },
      { id: 'pix', name: 'PIX', payment_type_id: 'bank_transfer' },
      { id: 'bolbradesco', name: 'Boleto Bradesco', payment_type_id: 'ticket' }
    ];
  }
};
