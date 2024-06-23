import { Bicycle } from './bicycle.model';
import { Card } from './card.model';

export interface SaveUser {
  id: string;
  name: string;
  email: string;
  photoUrl: string;
}

export interface User {
  name: string;
  email: string;
  photoUrl: string;
  bicycles: Bicycle[];
  cards: Card[];
}
