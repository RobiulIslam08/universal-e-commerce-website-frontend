
import React, { JSX } from 'react';
import { CartItem } from '@/types/checkout';
import { User, MapPin, CreditCard } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { ContactInfoStep } from '@/app/(main)/checkout/components/form/ContactInfoStep';
import { DeliveryAddressStep } from '@/app/(main)/checkout/components/form/DeliveryAddressStep';
import { PaymentMethodStep } from '@/app/(main)/checkout/components/form/PaymentMethodStep';


// Constants
// ============================================

export interface Step {
  id: number;
  title: string;
  icon: LucideIcon;
  fields: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: (props: any) => JSX.Element;
}

export const CHECKOUT_STEPS: Step[] = [
  { id: 1, title: 'Contact', icon: User, fields: ['email', 'phone'], component: (props) => <ContactInfoStep {...props} /> },
  { id: 2, title: 'Delivery', icon: MapPin, fields: ['firstName', 'lastName', 'address', 'city', 'state', 'zipCode'], component: (props) => <DeliveryAddressStep {...props} /> },
  { id: 3, title: 'Payment', icon: CreditCard, fields: ['agreeTerms'], component: (props) => <PaymentMethodStep {...props} /> }
];

export const INITIAL_CART_ITEMS: CartItem[] = [
  { id: 1, name: 'Premium Wireless Headphones', price: 299, originalPrice: 399, quantity: 1, image: '🎧', discount: 25 },
  { id: 2, name: 'Smart Watch Pro', price: 499, originalPrice: 599, quantity: 1, image: '⌚', discount: 17 },
  { id: 3, name: 'USB-C Fast Charger', price: 49, originalPrice: 79, quantity: 2, image: '🔌', discount: 38 }
];
