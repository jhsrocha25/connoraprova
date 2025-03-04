
import { PaymentMethod, Subscription, SubscriptionPlan } from '@/lib/types';

// Tipos específicos do Mercado Pago
export interface MPCardInfo {
  cardholderName: string;
  cardNumber: string;
  expirationMonth: number;
  expirationYear: number;
  securityCode: string;
  identificationType?: string;
  identificationNumber?: string;
}

export interface MPCardToken {
  id: string;
}

export interface MPUserInfo {
  email: string;
  firstName: string;
  lastName: string;
  cpf: string;
  zipCode: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface MPPixResponse {
  qrCode: string;
  qrCodeBase64: string;
  expirationDate: Date;
}

export interface MPBoletoResponse {
  boletoUrl: string;
  barcode: string;
  expirationDate: Date;
}
