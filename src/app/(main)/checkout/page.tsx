/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { User, MapPin, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CheckoutHeader } from "./components/CheckoutHeader";
import { StepIndicator } from "./components/StepIndicator";
import { ContactInfoStep } from "./components/form/ContactInfoStep";
import { DeliveryAddressStep } from "./components/form/DeliveryAddressStep";
import { PaymentMethodStep } from "./components/form/PaymentMethodStep";
import { OrderSummaryCard } from "./components/OrderSummaryCard";
import { StripePaymentWrapper } from "@/components/payment/StripePaymentWrapper";
import { useAppSelector } from "@/redux/hooks";
import { toast } from "sonner";
import { CART_CONSTANTS } from "@/constants/cart";
import { getCurrentUser } from "@/services/auth";

type CheckoutFormData = {
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

type Step = {
  id: number;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  fields: string[];
};

interface DecodedUser {
  userId: string;
  email: string;
  name: string;
  role: string;
}

export default function PremiumCheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>("");
  const [paymentIntentId, setPaymentIntentId] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<DecodedUser | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  // ১. URL প্যারামিটার ধরা
  const buyNowProductId = searchParams.get("buyNow");
  const buyNowQuantity = searchParams.get("quantity");

  // ২. Redux থেকে কার্ট ডাটা আনা
  const allCartItems = useAppSelector((state) => state.cart.products);

  // ৩. কার্ট আইটেম ফিল্টার এবং কোয়ান্টিটি ওভাররাইড লজিক
  const checkoutItems = useMemo(() => {
    if (buyNowProductId && buyNowQuantity) {
      // Buy Now মোড: নির্দিষ্ট প্রোডাক্ট খুঁজে বের করা
      const product = allCartItems.find((item) => item._id === buyNowProductId);
      
      if (product) {
        // শুধু এই প্রোডাক্টটি নতুন কোয়ান্টিটি সহ রিটার্ন করা
        return [{
          ...product,
          orderQuantity: parseInt(buyNowQuantity,10) // URL এর কোয়ান্টিটি প্রাধান্য পাবে
        }];
      }
    }
    // নরমাল মোড: পুরো কার্ট রিটার্ন করা
    return allCartItems;
  }, [allCartItems, buyNowProductId, buyNowQuantity]);

  // ৪. সাবটোটাল ক্যালকুলেশন (শুধুমাত্র checkoutItems ব্যবহার করে)
  const subtotal = useMemo(() => {
    return checkoutItems.reduce((acc, product) => {
      const price = product.offerPrice || product.price;
      return acc + price * product.orderQuantity;
    }, 0);
  }, [checkoutItems]);

  const shipping = CART_CONSTANTS.SHIPPING_COST;
  const tax = CART_CONSTANTS.TAX_RATE;
  const grandTotal = subtotal + shipping + tax;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
    getValues,
  } = useForm<CheckoutFormData>({
    mode: "onChange",
  });

  // User Loading
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = (await getCurrentUser()) as DecodedUser | null;
        if (!user || !user.userId) {
          toast.error("Please login to continue checkout");
          router.push("/login?callbackUrl=/checkout");
          return;
        }
        setCurrentUser(user);
      } catch (error) {
        console.error("Error loading user:", error);
        router.push("/login");
      }
    };
    fetchUser();
  }, [router]);

  // Payment Intent Reset
  useEffect(() => {
    if (currentStep !== 3 && clientSecret) {
      setClientSecret("");
      setPaymentIntentId("");
    }
  }, [currentStep, clientSecret, paymentMethod]);

  // Create Payment Intent
  useEffect(() => {
    const createPaymentIntent = async () => {
      if (!currentUser || currentStep !== 3 || paymentMethod !== "card" || clientSecret || processing) return;

      const formData = watch();
      if (!formData.email || !formData.firstName || !formData.address) return;

      setProcessing(true);
      try {
        const response = await fetch("/api/payment/create-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: grandTotal,
            currency: "usd",
            customerEmail: formData.email,
            customerName: `${formData.firstName} ${formData.lastName}`,
            userId: currentUser.userId,
            shippingAddress: {
              line1: formData.address,
              city: formData.city,
              state: formData.state,
              postal_code: formData.zipCode,
              country: "US",
            },
            // ✅ checkoutItems ব্যবহার করা হচ্ছে
            items: checkoutItems.map((item: any) => ({
              productId: item._id,
              productName: item.title,
              quantity: item.orderQuantity,
              price: item.offerPrice || item.price,
              image: item.image || "",
            })),
            subtotal, shipping, tax, total: grandTotal,
          }),
        });

        const result = await response.json();
        if (response.ok && result.clientSecret) {
          setClientSecret(result.clientSecret);
          setPaymentIntentId(result.paymentIntentId);
          toast.success("Payment initialized");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to initialize payment");
      } finally {
        setProcessing(false);
      }
    };
    createPaymentIntent();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, paymentMethod, clientSecret, processing, currentUser, grandTotal, checkoutItems]);

  const steps: Step[] = [
    { id: 1, title: "Contact", icon: User, fields: ["email", "phone"] },
    { id: 2, title: "Delivery", icon: MapPin, fields: ["firstName", "lastName", "address", "city", "state", "zipCode"] },
    { id: 3, title: "Payment", icon: CreditCard, fields: [] },
  ];

  const validateStep = async (step: number) => {
    const fieldsToValidate = steps[step - 1].fields;
    const result = await trigger(fieldsToValidate as any);
    if (!result) toast.error("Please fill in required fields");
    return result;
  };

  const handleNextStep = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };


  const onSubmit = async (data: CheckoutFormData) => {
    if (paymentMethod !== "card") {
      setProcessing(true);
      setTimeout(() => {
        setProcessing(false);
        toast.success("Order placed successfully!");
        router.push("/order-confirmation");
      }, 2000);
    }
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    if (!currentUser) return;
    try {
      const formData = getValues();
      const paymentPayload = {
        userId: currentUser.userId,
        userEmail: currentUser.email || formData.email,
        userName: currentUser.name || `${formData.firstName} ${formData.lastName}`,
        paymentIntentId,
        amount: grandTotal,
        currency: "USD",
        status: "succeeded",
        paymentMethod: "Card",
        // ✅ checkoutItems ব্যবহার করা হচ্ছে
        items: checkoutItems.map((item: any) => ({
          productId: item._id,
          productName: item.title,
          quantity: item.orderQuantity,
          price: item.offerPrice || item.price,
          image: item.image || "",
        })),
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: "US",
          phone: formData.phone || "N/A",
        },
      };

      const response = await fetch("/api/payment/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentPayload),
      });
      
      const result = await response.json();
      if (result.success) {
        toast.success("Payment successful!");
        router.push(`/payment/success?payment_intent=${paymentIntentId}`);
      } else {
        toast.error("Payment verification failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePaymentError = () => {
    setProcessing(false);
    setClientSecret("");
  };

  if (!currentUser) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <CheckoutHeader onBack={() => router.back()} />
      <div className="container mx-auto px-4 py-8">
        <StepIndicator steps={steps} currentStep={currentStep} />
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Forms Section */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit(onSubmit)}>
               {currentStep === 1 && <ContactInfoStep register={register} errors={errors} watch={watch} />}
               {currentStep === 2 && <DeliveryAddressStep register={register} errors={errors} watch={watch} />}
               {currentStep === 3 && paymentMethod !== "card" && <PaymentMethodStep register={register} errors={errors} watch={watch} paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />}
               
               <div className="flex justify-between pt-6">
                 <Button type="button" variant="outline" onClick={handlePreviousStep} disabled={currentStep === 1}>Previous</Button>
                 {currentStep === 3 ? (
                   <Button type="submit" disabled={processing} className="bg-rose-600 text-white">{processing ? "Processing..." : "Place Order"}</Button>
                 ) : (
                   <Button type="button" onClick={handleNextStep} className="bg-rose-600 text-white">Next</Button>
                 )}
               </div>
            </form>

            {currentStep === 3 && paymentMethod === "card" && (
              <>
                <PaymentMethodStep register={register} errors={errors} watch={watch} paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />
                <div className="bg-white p-6 rounded-lg shadow mt-6">
                  {clientSecret && <StripePaymentWrapper clientSecret={clientSecret} onSuccess={handlePaymentSuccess} onError={handlePaymentError} amount={grandTotal} />}
                </div>
              </>
            )}
          </div>

          {/* Right Column: Order Summary */}
          <div>
            <OrderSummaryCard 
              products={checkoutItems} // ✅ ফিল্টার করা আইটেম পাঠানো হচ্ছে
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              total={grandTotal}
              isBuyNowMode={!!buyNowProductId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}