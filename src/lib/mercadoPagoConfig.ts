
// Configuração de API do Mercado Pago

// Nota: Em produção, estas chaves deveriam estar em variáveis de ambiente do servidor
// Esta implementação é para fins de demonstração e desenvolvimento
export const MERCADO_PAGO_PUBLIC_KEY = "TEST-12345678-9012-3456-7890-123456789012";
export const MERCADO_PAGO_ACCESS_TOKEN = "TEST-1234567890123456789012345678901234-012345-678901234567890123456789012345678";

// Configuração
export const mercadoPagoConfig = {
  locale: 'pt-BR',
  advancedOptions: {
    checkoutPro: {
      redirectUrl: window.location.origin + '/subscription/success'
    }
  }
};

// Status de pagamento
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  AUTHORIZED: 'authorized',
  IN_PROCESS: 'in_process',
  IN_MEDIATION: 'in_mediation',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
  CHARGED_BACK: 'charged_back'
};

// Mapear os status do Mercado Pago para nossos status internos
export const mapPaymentStatus = (mpStatus: string): 'pending' | 'paid' | 'failed' | 'refunded' => {
  switch (mpStatus) {
    case PAYMENT_STATUS.APPROVED:
    case PAYMENT_STATUS.AUTHORIZED:
      return 'paid';
    case PAYMENT_STATUS.PENDING:
    case PAYMENT_STATUS.IN_PROCESS:
      return 'pending';
    case PAYMENT_STATUS.REFUNDED:
      return 'refunded';
    default:
      return 'failed';
  }
};

// Método de pagamento
export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  PIX: 'pix',
  BOLETO: 'ticket',
  ACCOUNT_MONEY: 'account_money'
};

// Mapeamento de métodos de pagamento
export const mapPaymentMethod = (
  mpMethod: string
): 'credit' | 'debit' | 'pix' | 'boleto' | 'account' => {
  switch (mpMethod) {
    case PAYMENT_METHODS.CREDIT_CARD:
      return 'credit';
    case PAYMENT_METHODS.DEBIT_CARD:
      return 'debit';
    case PAYMENT_METHODS.PIX:
      return 'pix';
    case PAYMENT_METHODS.BOLETO:
      return 'boleto';
    case PAYMENT_METHODS.ACCOUNT_MONEY:
      return 'account';
    default:
      return 'credit';
  }
};
