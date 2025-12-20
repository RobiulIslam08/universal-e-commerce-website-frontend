/**
 * Payment Related Types and Interfaces
 *
 * Defines all TypeScript types for payment processing,
 * payment history, and Stripe integration.
 */

import { CartProduct } from "@/redux/features/cartSlice";

// ============================================
// Payment Method Types
// ============================================

export type PaymentStatus =
  | "pending"
  | "processing"
  | "succeeded"
  | "failed"
  | "cancelled"
  | "refunded";

export type PaymentMethodType = "card" | "mobile" | "cod";

// ============================================
// Stripe Payment Intent
// ============================================

export interface CreatePaymentIntentRequest {
  amount: number;
  currency?: string;
  customerEmail: string;
  customerName: string;
  shippingAddress: {
    line1: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  items: CartProduct[];
}

export interface CreatePaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

// ============================================
// Payment Record (for Database)
// ============================================

export interface PaymentRecord {
  orderId: string | null;
  _id: string;
  userId: string;
  userEmail: string;
  userName: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: string;
  items: PaymentItem[];
  shippingAddress: ShippingAddress;
  billingAddress?: ShippingAddress;
  createdAt: string;
  updatedAt: string;
  stripeCustomerId?: string;
  receiptUrl?: string;
  metadata?: Record<string, string>;
}

export interface PaymentItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

// ============================================
// Payment History & Analytics
// ============================================

export interface PaymentHistory {
  payments: PaymentRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaymentStats {
  totalRevenue: number;
  totalOrders: number;
  successfulPayments: number;
  failedPayments: number;
  pendingPayments: number;
  averageOrderValue: number;
}

// ============================================
// Checkout & Order Types
// ============================================

export interface CheckoutFormData {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
  saveInfo: boolean;
  agreeTerms: boolean;
}

export interface OrderSummary {
  subtotal: number;
  shipping: number;
  tax?: number;
  discount?: number;
  total: number;
  items: CartProduct[];
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaymentWebhookEvent {
  id: string;
  type: string;
  data: {
    object: {
      id: string;
      amount: number;
      currency: string;
      status: string;
      customer: string;
      payment_method: string;
      metadata: Record<string, string>;
    };
  };
}
