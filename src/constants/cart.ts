// Cart related constants
// These values are used across cart components for consistency

export const CART_CONSTANTS = {
  // Currency
  CURRENCY: "$",

  // Shipping
  FREE_SHIPPING_THRESHOLD: 500,
  SHIPPING_COST: 25,

  // Tax
  TAX_RATE: 0.08,
  TAX_RATE_PERCENT: 8,

  // Coupon
  COUPON_DISCOUNT_RATE: 0.1,
  VALID_COUPON: "SAVE10",

  // Animation
  REMOVE_ANIMATION_DELAY: 300,

  // Toast durations (in milliseconds)
  TOAST_DURATION: {
    SHORT: 2000,
    MEDIUM: 3000,
    LONG: 5000,
  },
} as const;

// Type for the constants
export type CartConstants = typeof CART_CONSTANTS;
