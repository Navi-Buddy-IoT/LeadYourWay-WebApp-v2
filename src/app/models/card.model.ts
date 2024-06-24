export interface Card {
  cardId: number;
  cardNumber: string;
  cardType: string;
  cardCvv: string;
  cardExpirationDate: string;
  cardAmount: number;
  cardHolder: string;
  cardMain: boolean;
}

export interface CardSave {
  cardNumber: string;
  cardType: string;
  cardCvv: string;
  cardExpirationDate: string;
  cardAmount: number;
  cardHolder: string;
  cardMain: boolean;
}
