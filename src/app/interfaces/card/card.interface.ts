export interface CardI {
  idRegisterCard: number;
  userId: number;
  cardId: string;
  lastFourDigits: string;
  brand: string;
  expirationMonth: string;
  expirationYear: string;
  createdAt: string;
}

export interface CardDataI {
  cardNumber: string;
  cardholderName: string;
  cardExpirationMonth: string;
  cardExpirationYear: string;
  securityCode: string;
  identificationType: string;
  identificationNumber: string;
}
