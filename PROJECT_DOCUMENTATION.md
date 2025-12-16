# 🛒 Universal E-Commerce Website Frontend - সম্পূর্ণ ডকুমেন্টেশন

## 📋 সূচিপত্র (Table of Contents)

1. [প্রজেক্ট ওভারভিউ](#প্রজেক্ট-ওভারভিউ)
2. [প্রযুক্তি স্ট্যাক](#প্রযুক্তি-স্ট্যাক)
3. [ফোল্ডার স্ট্রাকচার](#ফোল্ডার-স্ট্রাকচার)
4. [Redux State Management](#redux-state-management)
5. [Types এবং Interfaces](#types-এবং-interfaces)
6. [Constants (ধ্রুবক)](#constants-ধ্রুবক)
7. [Custom Hooks](#custom-hooks)
8. [Pages (পেজসমূহ)](#pages-পেজসমূহ)
9. [Components (কম্পোনেন্টসমূহ)](#components-কম্পোনেন্টসমূহ)
10. [ফিচার ফ্লো](#ফিচার-ফ্লো)
11. [গুরুত্বপূর্ণ ফাংশন](#গুরুত্বপূর্ণ-ফাংশন)

---

## প্রজেক্ট ওভারভিউ

এটি একটি **Modern E-Commerce Frontend** যেখানে ব্যবহারকারীরা:

- প্রডাক্ট দেখতে পারে
- কার্টে প্রডাক্ট যোগ করতে পারে
- "Buy Now" দিয়ে সরাসরি একটি প্রডাক্ট কিনতে পারে
- Checkout প্রক্রিয়া সম্পন্ন করতে পারে

---

## প্রযুক্তি স্ট্যাক

| প্রযুক্তি           | ব্যবহার                              |
| ------------------- | ------------------------------------ |
| **Next.js 14+**     | React Framework (App Router)         |
| **TypeScript**      | Type Safety                          |
| **Redux Toolkit**   | State Management (Cart)              |
| **redux-persist**   | Cart Data Persistence (LocalStorage) |
| **Tailwind CSS**    | Styling                              |
| **Shadcn/UI**       | UI Component Library                 |
| **react-hook-form** | Form Handling                        |
| **Sonner**          | Toast Notifications                  |
| **Lucide React**    | Icons                                |
| **Framer Motion**   | Animations                           |

---

## ফোল্ডার স্ট্রাকচার

```
src/
├── app/                      # Next.js App Router
│   ├── (main)/               # মূল পাবলিক পেজ
│   │   ├── cart/             # কার্ট পেজ
│   │   ├── checkout/         # চেকআউট পেজ
│   │   ├── products/         # প্রডাক্ট পেজ
│   │   └── page.tsx          # হোম পেজ
│   └── (dashboard)/          # অ্যাডমিন ড্যাশবোর্ড
│
├── components/               # রিইউজেবল কম্পোনেন্ট
│   ├── common/               # সাধারণ কম্পোনেন্ট
│   ├── ui/                   # Shadcn UI কম্পোনেন্ট
│   └── layout/               # লেআউট কম্পোনেন্ট
│
├── redux/                    # Redux Store
│   ├── features/             # Redux Slices
│   ├── hooks.ts              # Custom Redux Hooks
│   └── store.ts              # Store Configuration
│
├── hooks/                    # Custom React Hooks
├── constants/                # ধ্রুবক মান
├── types/                    # TypeScript Types
└── services/                 # API Services
```

---

## Redux State Management

### 📁 ফাইল: `src/redux/features/cartSlice.ts`

এই ফাইলটি সম্পূর্ণ **Cart System** পরিচালনা করে।

### State Structure (স্টেট কাঠামো)

```typescript
interface InitialState {
  products: CartProduct[]; // কার্টে থাকা প্রডাক্টের তালিকা
  city: string; // শিপিং সিটি
  shippingAddress: string; // শিপিং ঠিকানা
}
```

### CartProduct Type

```typescript
interface CartProduct extends IProduct {
  orderQuantity: number; // কার্টে কতগুলো প্রডাক্ট আছে
}
```

### Actions (কার্যক্রম)

| Action                   | কাজ                     | ব্যবহার             |
| ------------------------ | ----------------------- | ------------------- |
| `addProduct`             | কার্টে প্রডাক্ট যোগ করে | "Add to Cart" বাটনে |
| `incrementOrderQuantity` | quantity বাড়ায়        | + বাটনে             |
| `decrementOrderQuantity` | quantity কমায়          | - বাটনে             |
| `removeProduct`          | প্রডাক্ট মুছে দেয়      | Delete বাটনে        |
| `updateCity`             | শহর আপডেট করে           | Shipping ফর্মে      |
| `updateShipingAddress`   | ঠিকানা আপডেট করে        | Shipping ফর্মে      |
| `clearCart`              | সব প্রডাক্ট মুছে দেয়   | Order সম্পন্ন হলে   |

### Selectors (ডেটা পড়ার ফাংশন)

| Selector                  | কাজ                                    |
| ------------------------- | -------------------------------------- |
| `orderedProductsSelector` | কার্টের সব প্রডাক্ট রিটার্ন করে        |
| `subTotalSelector`        | মোট দাম হিসাব করে (Tax/Shipping ছাড়া) |
| `shippingCostSelector`    | শিপিং খরচ হিসাব করে                    |
| `grandTotalSelector`      | সর্বমোট হিসাব করে                      |
| `citySelector`            | শহরের নাম রিটার্ন করে                  |
| `getProductByIdSelector`  | ID দিয়ে নির্দিষ্ট প্রডাক্ট খুঁজে      |

### 📝 বিস্তারিত ব্যাখ্যা: `addProduct`

```typescript
addProduct: (state, action) => {
  // প্রথমে চেক করে প্রডাক্ট আগে থেকে কার্টে আছে কিনা
  const productToAdd = state.products.find(
    (product) => product._id === action.payload._id
  );

  // যদি থাকে, শুধু quantity বাড়াও
  if (productToAdd) {
    productToAdd.orderQuantity += 1;
    return;
  }

  // না থাকলে নতুন করে যোগ করো quantity 1 দিয়ে
  state.products.push({ ...action.payload, orderQuantity: 1 });
};
```

### 📝 বিস্তারিত ব্যাখ্যা: `subTotalSelector`

```typescript
export const subTotalSelector = (state: RootState) => {
  return state.cart.products.reduce((acc, product) => {
    // যদি offerPrice থাকে সেটা ব্যবহার করো, না থাকলে price
    if (product.offerPrice) {
      return acc + product.offerPrice * product.orderQuantity;
    } else {
      return acc + product.price * product.orderQuantity;
    }
  }, 0);
};
```

---

## Types এবং Interfaces

### 📁 ফাইল: `src/types/product.ts`

### IProduct (মূল প্রডাক্ট টাইপ)

```typescript
export interface IProduct {
  // --- মূল ফিল্ড ---
  id: string; // ইউনিক আইডি
  _id?: string; // MongoDB আইডি
  slug: string; // URL-friendly নাম
  title: string; // প্রডাক্টের নাম
  price: number; // দাম
  strikePrice?: number; // আগের দাম (কাটা দাম)
  offerPrice?: number; // অফার দাম
  discount?: string; // ডিসকাউন্ট শতাংশ
  category: string; // ক্যাটাগরি
  image: string; // মূল ছবি
  images?: string[]; // একাধিক ছবি
  badge?: string; // "New", "Sale" ইত্যাদি
  rating?: number; // রেটিং (1-5)
  inStock?: boolean; // স্টকে আছে কিনা
  stockQuantity: number; // কতগুলো স্টকে আছে

  // --- বিস্তারিত ---
  shortDescription: string; // সংক্ষিপ্ত বর্ণনা
  longDescription: string; // পূর্ণ বর্ণনা
  sku: string; // Stock Keeping Unit

  // --- স্পেসিফিকেশন ---
  specifications: Specification[];

  // --- শিপিং তথ্য ---
  shippingAndReturns: ShippingAndReturns;

  // --- ওয়ারেন্টি ---
  warranty: Warranty;
}
```

### Specification

```typescript
export interface Specification {
  key: string; // যেমন: "Material", "Weight"
  value: string; // যেমন: "100% Cotton", "500g"
}
```

### ShippingAndReturns

```typescript
export interface ShippingAndReturns {
  shippingWeight: string; // "0.45 kg"
  deliveryTime: string; // "2-4 Business Days"
  returnPolicy: string; // "30-Day Money-Back Guarantee"
}
```

---

## Constants (ধ্রুবক)

### 📁 ফাইল: `src/constants/cart.ts`

এই ফাইলে কার্ট সম্পর্কিত সব ধ্রুবক মান রাখা হয়েছে। এতে কোড পরিষ্কার থাকে এবং সহজে পরিবর্তন করা যায়।

```typescript
export const CART_CONSTANTS = {
  // মুদ্রা চিহ্ন
  CURRENCY: "$",

  // শিপিং সংক্রান্ত
  FREE_SHIPPING_THRESHOLD: 500, // $500+ এ ফ্রি শিপিং
  SHIPPING_COST: 25, // সাধারণ শিপিং খরচ

  // ট্যাক্স
  TAX_RATE: 0.08, // 8% ট্যাক্স
  TAX_RATE_PERCENT: 8, // শতাংশে

  // কুপন
  COUPON_DISCOUNT_RATE: 0.1, // 10% ডিসকাউন্ট
  VALID_COUPON: "SAVE10", // বৈধ কুপন কোড

  // অ্যানিমেশন
  REMOVE_ANIMATION_DELAY: 300, // মিলিসেকেন্ড

  // টোস্ট সময়
  TOAST_DURATION: {
    SHORT: 2000, // 2 সেকেন্ড
    MEDIUM: 3000, // 3 সেকেন্ড
    LONG: 5000, // 5 সেকেন্ড
  },
} as const;
```

### ব্যবহার উদাহরণ

```typescript
import { CART_CONSTANTS } from "@/constants/cart";

const { CURRENCY, TAX_RATE } = CART_CONSTANTS;

// দাম দেখানোর সময়
<span>
  {CURRENCY}
  {price}
</span>; // $100

// ট্যাক্স হিসাব
const tax = subtotal * TAX_RATE; // 100 * 0.08 = 8
```

---

## Custom Hooks

### 📁 ফাইল: `src/hooks/useCheckout.ts`

এই হুকটি **Checkout পেজের সব ডেটা** সরবরাহ করে। এটি "Buy Now" এবং সাধারণ Cart checkout দুটোই হ্যান্ডেল করে।

### কীভাবে কাজ করে

```typescript
export function useCheckout(): CheckoutData {
  const searchParams = useSearchParams();
  const cartProducts = useAppSelector(orderedProductsSelector);

  // URL থেকে "buyNow" প্যারামিটার চেক করো
  // /checkout?buyNow=productId হলে শুধু সেই প্রডাক্ট দেখাবে
  const buyNowProductId = searchParams.get("buyNow");
  const isBuyNowMode = !!buyNowProductId;

  // কোন প্রডাক্ট দেখাবে সেটা নির্ধারণ করো
  const products = useMemo(() => {
    if (buyNowProductId) {
      // Buy Now মোডে শুধু সেই প্রডাক্ট দেখাও
      const buyNowProduct = cartProducts.find((p) => p._id === buyNowProductId);
      if (buyNowProduct) {
        return [{ ...buyNowProduct, orderQuantity: 1 }];
      }
      return [];
    }
    // সাধারণ checkout এ সব প্রডাক্ট দেখাও
    return cartProducts;
  }, [buyNowProductId, cartProducts]);

  // টোটাল হিসাব
  const { subtotal, totalSavings } = useMemo(() => {
    let sub = 0;
    let savings = 0;

    products.forEach((item) => {
      const currentPrice = item.offerPrice || item.price;
      const originalPrice = item.strikePrice || item.price;
      sub += currentPrice * item.orderQuantity;
      savings += (originalPrice - currentPrice) * item.orderQuantity;
    });

    return { subtotal: sub, totalSavings: savings };
  }, [products]);

  const tax = Math.round(subtotal * TAX_RATE);
  const shipping = subtotal > 500 ? 0 : subtotal > 0 ? 50 : 0;
  const total = subtotal + shipping + tax;

  return {
    products, // যে প্রডাক্টগুলো দেখাবে
    isBuyNowMode, // Buy Now মোডে আছে কিনা
    subtotal, // সাবটোটাল
    totalSavings, // মোট সেভিংস
    tax, // ট্যাক্স
    shipping, // শিপিং
    total, // সর্বমোট
  };
}
```

### কম্পোনেন্টে ব্যবহার

```typescript
const { products, isBuyNowMode, subtotal, total } = useCheckout();

return (
  <div>
    <h1>{isBuyNowMode ? "Buy Now" : "Your Cart"}</h1>
    {products.map((product) => (
      <ProductItem key={product._id} product={product} />
    ))}
    <p>Total: ${total}</p>
  </div>
);
```

---

## Pages (পেজসমূহ)

### 1️⃣ Cart Page (`/cart`)

📁 **ফাইল:** `src/app/(main)/cart/page.tsx`

#### কাজ

- কার্টে থাকা সব প্রডাক্ট দেখায়
- প্রডাক্ট সিলেক্ট/ডিসিলেক্ট করা যায়
- Quantity বাড়ানো/কমানো যায়
- প্রডাক্ট ডিলিট করা যায়
- কুপন কোড প্রয়োগ করা যায়
- অর্ডার সামারি দেখায়
- "Proceed to Checkout" বাটন

#### State ব্যবস্থাপনা

```typescript
// Redux থেকে কার্ট ডেটা
const cartItems = useAppSelector(orderedProductsSelector);

// যে প্রডাক্ট মুছে ফেলা হচ্ছে তার ID
const [removingItem, setRemovingItem] = useState<string | null>(null);

// Clear Cart কনফার্মেশন মডাল
const [showClearConfirm, setShowClearConfirm] = useState(false);

// কুপন কোড
const [couponCode, setCouponCode] = useState("");
const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

// ডিসিলেক্টেড আইটেম (যেগুলো চেকআউটে যাবে না)
const [deselectedItems, setDeselectedItems] = useState<string[]>([]);
```

#### মূল ফাংশনসমূহ

```typescript
// Quantity আপডেট
const updateQuantity = (id: string, action: "increment" | "decrement") => {
  if (action === "increment") {
    dispatch(incrementOrderQuantity(id));
  } else {
    dispatch(decrementOrderQuantity(id));
  }
};

// প্রডাক্ট রিমুভ (অ্যানিমেশন সহ)
const removeItem = (id: string) => {
  setRemovingItem(id);
  setTimeout(() => {
    dispatch(removeProduct(id));
    setRemovingItem(null);
    toast.success("Item removed");
  }, REMOVE_ANIMATION_DELAY);
};

// কুপন প্রয়োগ
const applyCoupon = () => {
  if (couponCode === VALID_COUPON) {
    setAppliedCoupon(couponCode);
    toast.success("Coupon applied!");
  } else {
    toast.error("Invalid coupon");
  }
};
```

#### হিসাব নিকাশ

```typescript
// সাবটোটাল (শুধু সিলেক্টেড আইটেম)
const subtotal = selectedCartItems.reduce(
  (sum, item) => sum + (item.offerPrice || item.price) * item.orderQuantity,
  0
);

// সেভিংস
const savings = selectedCartItems.reduce((sum, item) => {
  const original = item.strikePrice || item.price;
  const current = item.offerPrice || item.price;
  return sum + (original - current) * item.orderQuantity;
}, 0);

// ডিসকাউন্ট (কুপন থাকলে)
const discount = appliedCoupon ? subtotal * COUPON_DISCOUNT_RATE : 0;

// শিপিং
const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;

// ট্যাক্স
const tax = (subtotal - discount) * TAX_RATE;

// মোট
const total = subtotal - discount + shipping + tax;
```

---

### 2️⃣ Checkout Page (`/checkout`)

📁 **ফাইল:** `src/app/(main)/checkout/page.tsx`

#### কাজ

- 3 স্টেপে অর্ডার প্রসেস
- Step 1: Contact Info (ইমেইল, ফোন)
- Step 2: Delivery Address (ঠিকানা)
- Step 3: Payment Method (পেমেন্ট)
- অর্ডার সামারি দেখায়

#### URL Modes

| URL                    | Mode         | দেখাবে               |
| ---------------------- | ------------ | -------------------- |
| `/checkout`            | Cart Mode    | কার্টের সব প্রডাক্ট  |
| `/checkout?buyNow=123` | Buy Now Mode | শুধু ID 123 প্রডাক্ট |

#### State ব্যবস্থাপনা

```typescript
const [currentStep, setCurrentStep] = useState(1); // বর্তমান স্টেপ
const [paymentMethod, setPaymentMethod] = useState("card"); // পেমেন্ট মেথড
const [processing, setProcessing] = useState(false); // অর্ডার প্রসেসিং
```

#### Form Handling (react-hook-form)

```typescript
const {
  register, // ইনপুট রেজিস্টার
  handleSubmit, // ফর্ম সাবমিট হ্যান্ডলার
  formState: { errors }, // ভ্যালিডেশন এরর
  watch, // ফিল্ড ভ্যালু দেখা
  trigger, // ম্যানুয়াল ভ্যালিডেশন
} = useForm<CheckoutFormData>({
  mode: "onChange", // প্রতি পরিবর্তনে ভ্যালিডেট
  defaultValues: {
    saveInfo: true,
    agreeTerms: false,
  },
});
```

#### Steps Configuration

```typescript
const steps: Step[] = [
  {
    id: 1,
    title: "Contact",
    icon: User,
    fields: ["email", "phone"],
  },
  {
    id: 2,
    title: "Delivery",
    icon: MapPin,
    fields: ["firstName", "lastName", "address", "city", "state", "zipCode"],
  },
  {
    id: 3,
    title: "Payment",
    icon: CreditCard,
    fields: ["agreeTerms"],
  },
];
```

#### Navigation Functions

```typescript
// পরবর্তী স্টেপে যাও (ভ্যালিডেশন সহ)
const handleNextStep = async () => {
  const isValid = await validateStep(currentStep);
  if (isValid && currentStep < 3) {
    setCurrentStep(currentStep + 1);
  }
};

// আগের স্টেপে যাও
const handlePreviousStep = () => {
  if (currentStep > 1) {
    setCurrentStep(currentStep - 1);
  }
};

// অর্ডার সাবমিট
const onSubmit = async (data: CheckoutFormData) => {
  setProcessing(true);
  // API কল করো
  setTimeout(() => {
    setProcessing(false);
    alert("Order placed successfully!");
    router.push("/");
  }, 2000);
};
```

---

### 3️⃣ Product Details Page (`/products/[_id]`)

📁 **ফাইল:** `src/app/(main)/products/[_id]/page.tsx`

#### কাজ

- প্রডাক্টের বিস্তারিত দেখায়
- Image Gallery
- Price, Rating, Stock Status
- "Add to Cart" বাটন
- "Buy" বাটন (সরাসরি checkout)
- Specifications
- Shipping Info
- Warranty Info

#### Dynamic Route

```typescript
// params থেকে product ID নেওয়া
type Props = {
  params: Promise<{ _id: string }>;
};

export default async function ProductPage({ params }: Props) {
  const { _id } = await params;

  // API থেকে product fetch
  const res = await getSingleProduct(_id);
  const product = res?.data;

  if (!product) {
    notFound();
  }

  return (
    // Product Details UI
  );
}
```

---

## Components (কম্পোনেন্টসমূহ)

### 1️⃣ ProductCard

📁 **ফাইল:** `src/components/common/ProductCard.tsx`

#### কাজ

- প্রডাক্ট কার্ড দেখায়
- "Add to Cart" বাটন
- "Buy" বাটন
- ক্লিক করলে Details পেজে যায়

#### Props

```typescript
type Props = {
  slug?: string; // URL slug
  _id?: string; // প্রডাক্ট ID
  image?: ReactNode; // ছবি
  title: string; // নাম
  price?: string; // দাম
  strike?: string; // আগের দাম
  badge?: string; // "New", "Sale"
  product?: IProduct; // পূর্ণ প্রডাক্ট ডেটা
};
```

#### মূল ফাংশন

```typescript
// কার্টে যোগ
const handleAddToCart = (e: React.MouseEvent) => {
  e.preventDefault(); // Link navigation বন্ধ
  e.stopPropagation(); // Event bubbling বন্ধ

  if (!product) {
    toast.error("Product information is missing");
    return;
  }
  dispatch(addProduct(product));
  toast.success(`${product.title} added to cart!`);
};

// সরাসরি কেনা
const handleBuyNow = (e: React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();

  if (!product?._id) {
    toast.error("Product information is missing");
    return;
  }

  // প্রথমে কার্টে যোগ করো
  dispatch(addProduct(product));

  // তারপর checkout এ যাও buyNow param সহ
  router.push(`/checkout?buyNow=${product._id}`);
};
```

#### UI Structure

```tsx
<Link href={`/products/${productId}`}>
  <Card>
    {/* Image Section */}
    <div className="aspect-square">
      {image}
      {badge && <Badge>{badge}</Badge>}
    </div>

    {/* Content Section */}
    <div>
      <h3>{title}</h3>
      <div>
        <span>{price}</span>
        {strike && <span className="line-through">{strike}</span>}
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <Button onClick={handleAddToCart}>
          <ShoppingCart /> Add to Cart
        </Button>
        <Button onClick={handleBuyNow}>Buy</Button>
      </div>
    </div>
  </Card>
</Link>
```

---

### 2️⃣ CartItemCard

📁 **ফাইল:** `src/app/(main)/cart/components/CartItemCard.tsx`

#### কাজ

- কার্টে একটি প্রডাক্ট দেখায়
- Checkbox দিয়ে সিলেক্ট করা যায়
- Quantity +/- করা যায়
- Delete করা যায়
- Wishlist এ সরানো যায়
- Savings দেখায়

#### Props

```typescript
interface CartItemCardProps {
  item: CartProduct; // প্রডাক্ট ডেটা
  updateQuantity: Function; // Quantity আপডেট ফাংশন
  removeItem: Function; // রিমুভ ফাংশন
  moveToWishlist: Function; // Wishlist ফাংশন
  isRemoving: boolean; // রিমুভ অ্যানিমেশন চলছে কিনা
  isSelected: boolean; // সিলেক্টেড কিনা
  onToggleSelection: Function; // সিলেকশন টগল
}
```

#### Price Calculation

```typescript
const currentPrice = item.offerPrice || item.price;
const originalPrice = item.strikePrice || item.price;
const itemTotal = currentPrice * item.orderQuantity;
const itemSavings = (originalPrice - currentPrice) * item.orderQuantity;
```

#### Image Handling

```typescript
// images array থাকলে সেটা ব্যবহার করো, না থাকলে image field
const imageUrl =
  item.images && item.images.length > 0 ? item.images[0] : item.image;
```

---

### 3️⃣ CartSummary

📁 **ফাইল:** `src/app/(main)/cart/components/CartSummary.tsx`

#### কাজ

- অর্ডার সামারি দেখায়
- Subtotal, Savings, Shipping, Tax, Total
- কুপন কোড ইনপুট
- Free Shipping Progress Bar
- "Proceed to Checkout" বাটন

#### Props

```typescript
interface CartSummaryProps {
  subtotal: number;
  savings: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  couponCode: string;
  appliedCoupon: string | null;
  setCouponCode: (code: string) => void;
  applyCoupon: () => void;
  handleCheckout: () => void;
  isCheckoutDisabled: boolean;
}
```

#### Free Shipping Progress

```typescript
const shippingProgress = Math.min(
  100,
  (subtotal / FREE_SHIPPING_THRESHOLD) * 100
);
const amountForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

// UI
{
  shipping > 0 && (
    <div>
      <span>Add ${amountForFreeShipping} more for FREE shipping!</span>
      <div className="progress-bar">
        <div style={{ width: `${shippingProgress}%` }} />
      </div>
    </div>
  );
}
```

---

### 4️⃣ OrderSummaryCard

📁 **ফাইল:** `src/app/(main)/checkout/components/OrderSummaryCard.tsx`

#### কাজ

- Checkout পেজে অর্ডার সামারি দেখায়
- প্রডাক্ট লিস্ট (Image, Name, Qty, Price)
- Subtotal, Savings, Shipping, Tax, Total
- Trust Badges

#### useCheckout Hook ব্যবহার

```typescript
export const OrderSummaryCard = () => {
  const {
    products, // প্রডাক্ট লিস্ট
    isBuyNowMode, // Buy Now মোড কিনা
    subtotal,
    totalSavings,
    tax,
    shipping,
    total,
  } = useCheckout();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isBuyNowMode ? "Buy Now" : "Order Summary"}</CardTitle>
        <p>{products.length} items in your order</p>
      </CardHeader>

      <CardContent>
        {/* Product List */}
        {products.map((item) => (
          <div key={item._id}>
            <Image src={imageUrl} alt={item.title} />
            <p>{item.title}</p>
            <p>Qty: {item.orderQuantity}</p>
            <p>${currentPrice * item.orderQuantity}</p>
          </div>
        ))}

        {/* Pricing */}
        <div>Subtotal: ${subtotal}</div>
        {totalSavings > 0 && <div>Savings: -${totalSavings}</div>}
        <div>Shipping: {shipping === 0 ? "FREE" : `$${shipping}`}</div>
        <div>Tax: ${tax}</div>
        <div>Total: ${total}</div>
      </CardContent>
    </Card>
  );
};
```

---

### 5️⃣ DetailsSection

📁 **ফাইল:** `src/app/(main)/products/component/details-section.tsx`

#### কাজ

- প্রডাক্ট ডিটেইলস পেজের মূল তথ্য দেখায়
- Title, Rating, Stock Status
- Price (Current & Strike)
- Short Description
- Quantity Selector
- "Add to Cart" বাটন
- "Buy" বাটন

#### State

```typescript
const [quantity, setQuantity] = useState(1); // সিলেক্টেড quantity
const [isAdding, setIsAdding] = useState(false); // অ্যানিমেশন স্টেট
```

#### Functions

```typescript
// কার্টে যোগ (quantity সহ)
const handleAddToCart = () => {
  setIsAdding(true);

  // Loop করে quantity বার যোগ করো
  for (let i = 0; i < quantity; i++) {
    dispatch(addProduct(product));
  }

  toast.success(`${quantity} ${product.title} added to cart!`);
  setTimeout(() => setIsAdding(false), 2000);
};

// সরাসরি কেনা
const handleBuy = () => {
  dispatch(addProduct(product));
  router.push(`/checkout?buyNow=${product._id}`);
};
```

---

## ফিচার ফ্লো

### 🛒 Add to Cart Flow

```
User clicks "Add to Cart"
        ↓
handleAddToCart() called
        ↓
e.preventDefault() - Link এ যাওয়া বন্ধ
e.stopPropagation() - Event bubbling বন্ধ
        ↓
dispatch(addProduct(product))
        ↓
Redux cartSlice.addProduct():
  - Product আগে থাকলে → orderQuantity++
  - না থাকলে → নতুন করে যোগ (orderQuantity: 1)
        ↓
redux-persist → LocalStorage এ সেভ
        ↓
toast.success("Added to cart!")
        ↓
UI আপডেট (Cart icon badge)
```

### 💰 Buy Now Flow

```
User clicks "Buy" button
        ↓
handleBuyNow() called
        ↓
dispatch(addProduct(product))
  - কার্টে প্রডাক্ট যোগ হলো
        ↓
router.push(`/checkout?buyNow=${product._id}`)
  - URL: /checkout?buyNow=abc123
        ↓
Checkout Page লোড হলো
        ↓
useCheckout() hook:
  - URL থেকে buyNow param পড়ে
  - Cart থেকে শুধু সেই product filter করে
  - isBuyNowMode = true সেট করে
        ↓
OrderSummaryCard:
  - শুধু 1টি প্রডাক্ট দেখায়
  - Title: "Buy Now"
        ↓
User completes checkout
        ↓
Order placed!
```

### 🛍️ Cart to Checkout Flow

```
User at Cart Page
        ↓
Selects items (Checkbox)
        ↓
Clicks "Proceed to Checkout"
        ↓
router.push("/checkout")
  - URL: /checkout (কোন param নেই)
        ↓
Checkout Page লোড হলো
        ↓
useCheckout() hook:
  - buyNow param নেই
  - Cart এর সব product নেয়
  - isBuyNowMode = false
        ↓
OrderSummaryCard:
  - সব প্রডাক্ট দেখায়
  - Title: "Order Summary"
        ↓
User completes 3 steps
        ↓
Order placed!
```

---

## গুরুত্বপূর্ণ ফাংশন

### 1. `addProduct` (Redux Action)

```typescript
addProduct: (state, action) => {
  // 1. প্রডাক্ট আগে থেকে আছে কিনা চেক
  const productToAdd = state.products.find(
    (product) => product._id === action.payload._id
  );

  // 2. থাকলে শুধু quantity বাড়াও
  if (productToAdd) {
    productToAdd.orderQuantity += 1;
    return; // ফাংশন শেষ
  }

  // 3. না থাকলে নতুন করে যোগ করো
  state.products.push({
    ...action.payload, // পুরো product object
    orderQuantity: 1, // quantity 1 দিয়ে শুরু
  });
};
```

### 2. `subTotalSelector` (Redux Selector)

```typescript
export const subTotalSelector = (state: RootState) => {
  // reduce দিয়ে সব প্রডাক্টের দাম যোগ করো
  return state.cart.products.reduce((acc, product) => {
    // offerPrice থাকলে সেটা ব্যবহার করো
    if (product.offerPrice) {
      return acc + product.offerPrice * product.orderQuantity;
    }
    // না থাকলে regular price
    else {
      return acc + product.price * product.orderQuantity;
    }
  }, 0); // শুরুতে acc = 0
};
```

### 3. `useCheckout` Hook

```typescript
export function useCheckout(): CheckoutData {
  // URL params পড়ো
  const searchParams = useSearchParams();

  // Cart products নাও Redux থেকে
  const cartProducts = useAppSelector(orderedProductsSelector);

  // Buy Now mode চেক
  const buyNowProductId = searchParams.get("buyNow");
  const isBuyNowMode = !!buyNowProductId;

  // কোন products দেখাবে
  const products = useMemo(() => {
    if (buyNowProductId) {
      // Buy Now: শুধু ঐ product
      const buyNowProduct = cartProducts.find((p) => p._id === buyNowProductId);
      return buyNowProduct ? [{ ...buyNowProduct, orderQuantity: 1 }] : [];
    }
    // Normal: সব products
    return cartProducts;
  }, [buyNowProductId, cartProducts]);

  // Totals calculate
  const { subtotal, totalSavings } = useMemo(() => {
    let sub = 0;
    let savings = 0;

    products.forEach((item) => {
      const currentPrice = item.offerPrice || item.price;
      const originalPrice = item.strikePrice || item.price;
      sub += currentPrice * item.orderQuantity;
      savings += (originalPrice - currentPrice) * item.orderQuantity;
    });

    return { subtotal: sub, totalSavings: savings };
  }, [products]);

  const tax = Math.round(subtotal * TAX_RATE);
  const shipping = subtotal > 500 ? 0 : subtotal > 0 ? 50 : 0;
  const total = subtotal + shipping + tax;

  return {
    products,
    isBuyNowMode,
    subtotal,
    totalSavings,
    tax,
    shipping,
    total,
  };
}
```

### 4. Event Handler Pattern

```typescript
// কেন e.preventDefault() এবং e.stopPropagation() ব্যবহার করি?

const handleAddToCart = (e: React.MouseEvent) => {
  e.preventDefault(); // Link এর default behavior বন্ধ
  e.stopPropagation(); // Parent elements এ event পৌঁছাবে না

  // এখন button এর কাজ করো
  dispatch(addProduct(product));
};

// ব্যাখ্যা:
// ProductCard টি একটি <Link> এর ভিতরে
// Button click করলে Link activate হয়ে product details এ চলে যাবে
// আমরা চাই button click করলে শুধু cart এ যোগ হোক, navigate না করুক
// তাই preventDefault() এবং stopPropagation() দরকার
```

---

## 📌 সারসংক্ষেপ

| বিষয়            | ফাইল/ফোল্ডার                             |
| ---------------- | ---------------------------------------- |
| Cart State       | `src/redux/features/cartSlice.ts`        |
| Cart Page        | `src/app/(main)/cart/page.tsx`           |
| Checkout Page    | `src/app/(main)/checkout/page.tsx`       |
| Product Details  | `src/app/(main)/products/[_id]/page.tsx` |
| Product Card     | `src/components/common/ProductCard.tsx`  |
| useCheckout Hook | `src/hooks/useCheckout.ts`               |
| Constants        | `src/constants/cart.ts`                  |
| Types            | `src/types/product.ts`                   |

---

## 🔧 ভবিষ্যত উন্নতি

1. **API Integration** - বর্তমানে কিছু ডেটা হার্ডকোডেড, API connect করতে হবে
2. **Payment Gateway** - Real payment integration (Stripe, PayPal)
3. **Order Tracking** - অর্ডার ট্র্যাকিং সিস্টেম
4. **User Authentication** - লগইন/রেজিস্ট্রেশন সিস্টেম
5. **Wishlist** - Wishlist feature সম্পূর্ণ করা
6. **Reviews** - প্রডাক্ট রিভিউ সিস্টেম

---


