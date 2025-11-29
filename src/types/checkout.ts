/* eslint-disable @typescript-eslint/no-explicit-any */
import { User, MapPin, CreditCard} from 'lucide-react';
import { JSX } from 'react';


// ============================================
// Types & Interfaces
// ============================================

export type CheckoutFormData = {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCVV?: string;
  mobileNumber?: string;
  saveInfo: boolean;
  agreeTerms: boolean;
};

export type CartItem = {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  quantity: number;
  image: string; // Emoji
  discount: number; // Percentage
};

export type PaymentMethodType = 'card' | 'mobile' | 'cod';

export interface Step {
  id: number;
  title: string;
  icon: typeof User | typeof MapPin | typeof CreditCard;
  fields: (keyof CheckoutFormData)[];
  component: (props: any) => JSX.Element;
}

// ============================================
// Constants
// ============================================


