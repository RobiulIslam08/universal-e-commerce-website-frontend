/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
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

// ✅ User interface define করা
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [paymentIntentId, setPaymentIntentId] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<DecodedUser | null>(null); // ✅ User state
  const router = useRouter();

  // Get cart data from Redux
  // ⚠️ নিশ্চিত হোন এখানে item এর মধ্যে _id বা id ফিল্ড আছে
  const cartItems = useAppSelector((state) => state.cart.products);
  
  const subtotal = useAppSelector((state) => {
    return state.cart.products.reduce((acc, product) => {
      const price = product.offerPrice || product.price;
      return acc + price * product.orderQuantity;
    }, 0);
  });
  const shipping = CART_CONSTANTS.SHIPPING_COST;
  const tax = CART_CONSTANTS.TAX_RATE;
  const grandTotal = subtotal + shipping + tax;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
    getValues, // ✅ getValues যোগ করা হলো ডাটা পাওয়ার সুবিধার্থে
  } = useForm<CheckoutFormData>({
    mode: "onChange",
  });

  // ✅ Get current user on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = (await getCurrentUser()) as DecodedUser | null;
        console.log(user);

        if (!user || !user.userId) {
          toast.error("Please login to continue checkout");
          router.push("/login");
          return;
        }

        setCurrentUser(user);
        console.log("✅ Current User loaded:", user);
      } catch (error) {
        console.error("❌ Error loading user:", error);
        toast.error("Authentication error. Please login again.");
        router.push("/login");
      }
    };

    fetchUser();
  }, [router]);

  // Clear clientSecret when leaving step 3
  useEffect(() => {
    if (currentStep !== 3 && clientSecret) {
      console.log("⚠️ Not on step 3, clearing clientSecret");
      setClientSecret("");
      setPaymentIntentId("");
    }
  }, [currentStep, clientSecret, paymentMethod]);

  // Auto-create payment intent when card is selected on step 3
  useEffect(() => {
    const createPaymentIntent = async () => {
      // ✅ Check if user is loaded
      if (!currentUser) {
        console.log("⚠️ User not loaded yet");
        return;
      }

      if (
        currentStep === 3 &&
        paymentMethod === "card" &&
        !clientSecret &&
        !processing
      ) {
        const formData = watch();

        if (!formData.email || !formData.firstName || !formData.address) {
          console.log("⚠️ Required fields not filled yet");
          return;
        }

        console.log("🔄 Auto-creating payment intent for card payment");
        setProcessing(true);

        try {
          const response = await fetch("/api/payment/create-intent", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              amount: grandTotal,
              currency: "usd",
              customerEmail: formData.email,
              customerName: `${formData.firstName} ${formData.lastName}`,
              userId: currentUser.userId, // ✅ User ID পাঠানো হচ্ছে
              shippingAddress: {
                line1: formData.address,
                city: formData.city,
                state: formData.state,
                postal_code: formData.zipCode,
                country: "US",
              },
              // 🔥 FIX: Product ID Mapping Here Too (for completeness)
              items: cartItems.map((item: any) => ({
                productId: item._id || item.id || item.productId, 
                productName: item.name,
                quantity: item.orderQuantity,
                price: item.offerPrice || item.price,
                image: item.image || "",
              })),
              subtotal: subtotal,
              shipping: shipping,
              tax: tax,
              total: grandTotal,
            }),
          });

          const result = await response.json();

          if (response.ok && result.clientSecret) {
            console.log("✅ Payment intent created successfully");
            setClientSecret(result.clientSecret);
            setPaymentIntentId(result.paymentIntentId);
            toast.success("Payment form ready!");
          } else {
            toast.error(result.error || "Failed to initialize payment");
          }
        } catch (error) {
          console.error("Payment initialization error:", error);
          toast.error("Failed to initialize payment");
        } finally {
          setProcessing(false);
        }
      }
    };

    createPaymentIntent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentStep,
    paymentMethod,
    clientSecret,
    processing,
    currentUser,
    grandTotal,
    cartItems,
  ]);

  const steps: Step[] = [
    { id: 1, title: "Contact", icon: User, fields: ["email", "phone"] },
    {
      id: 2,
      title: "Delivery",
      icon: MapPin,
      fields: [
        "firstName",
        "lastName",
        "address",
        "city",
        "state",
        "zipCode",
      ],
    },
    {
      id: 3,
      title: "Payment",
      icon: CreditCard,
      fields: [],
    },
  ];

  const validateStep = async (step: number) => {
    const fieldsToValidate = steps[step - 1].fields;
    console.log("Validating step", step, "fields:", fieldsToValidate);
    const result = await trigger(fieldsToValidate as any);
    console.log("Validation result:", result);
    if (!result) {
      toast.error("Please fill in all required fields correctly");
    }
    return result;
  };

  const handleNextStep = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < 3) {
      console.log("🔄 Moving to next step, clearing payment intent");
      if (clientSecret) {
        setClientSecret("");
        setPaymentIntentId("");
      }
      setCurrentStep(currentStep + 1);
      console.log("✅ Moved to step", currentStep + 1);
    } else if (!isValid) {
      return false;
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      console.log("⬅️ Going back, clearing payment intent");
      if (clientSecret) {
        setClientSecret("");
        setPaymentIntentId("");
      }
      setCurrentStep(currentStep - 1);
      console.log("✅ Moved back to step", currentStep - 1);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmit = async (data: CheckoutFormData) => {
    // ✅ Check if user exists
    if (!currentUser) {
      toast.error("User session expired. Please login again.");
      router.push("/login");
      return;
    }

    // Submit logic is handled by handlePaymentSuccess for cards
    // This is mainly for COD or manual submission
    if (paymentMethod !== "card") {
        setProcessing(true);
        // ... COD Logic ...
        setTimeout(() => {
            setProcessing(false);
            toast.success("Order placed successfully! 🎉");
            router.push("/order-confirmation");
        }, 2000);
    }
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    // ✅ Check if user exists
    if (!currentUser) {
      toast.error("User session expired. Please login again.");
      router.push("/login");
      return;
    }

    try {
      console.log("✅ Payment successful, confirming with backend...");
      
      // ✅ ১. ফর্মের লেটেস্ট ডাটা নেওয়া
      const formData = getValues(); 

      // ✅ ২. ব্যাকএন্ডের Zod Schema অনুযায়ী ডাটা সাজানো
      const paymentPayload = {
        userId: currentUser.userId,
        userEmail: currentUser.email || formData.email,
        userName: currentUser.name || `${formData.firstName} ${formData.lastName}`,
        paymentIntentId: paymentIntentId,
        amount: grandTotal,
        currency: "USD",
        status: "succeeded", // ✅ FIX: ব্যাকএন্ড Enum অনুযায়ী ছোট হাতের 'succeeded'
        paymentMethod: "Card",
        
        // 🔥 FIX: Product ID Mapping
        // আপনার কার্ট অবজেক্টে প্রোডাক্টের আইডি সাধারণত _id বা id তে থাকে।
        // item.userId সচরাচর ভেন্ডর আইডি হয়, তাই এটি ব্যবহার করা ভুল হতে পারে।
        items: cartItems.map((item: any) => ({
          productId: item._id || item.id || item.productId, // ✅ নিরাপদ ম্যাপিং
          productName: item.title,
          quantity: item.orderQuantity,
          price: item.offerPrice || item.price,
          image: item.image || "",
        })),

        // Shipping Address Mapping
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: "US",
          // Zod Schema অনুযায়ী phone required
          phone: formData.phone || formData.mobileNumber || "N/A", 
        },
      };

      console.log("🚀 Sending Payload to Confirm:", paymentPayload);

      // ✅ ৩. Next.js API Route এ ডাটা পাঠানো
      const response = await fetch("/api/payment/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentPayload), // সম্পূর্ণ ডাটা পাঠানো হচ্ছে
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Payment successful! 🎉");
        router.push(`/payment/success?payment_intent=${paymentIntentId}`);
      } else {
        // Zod Validation Error বা অন্য এরর হ্যান্ডলিং
        console.error("❌ Payment verification failed:", result);
        
        // Zod এরর ডিটেইলস দেখানোর চেষ্টা
        const errorMsg = result.error?.issues?.[0]?.message || 
                         result.error || 
                         "Payment verification failed";
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("❌ Payment confirmation error:", error);
      toast.error("Failed to confirm payment");
    }
  };

  const handlePaymentError = (error: string) => {
    console.error("Payment error:", error);
    setProcessing(false);
    setClientSecret("");
  };

  // ✅ Show loading if user not loaded yet
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-rose-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-rose-50 via-white to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-rose-950/20">
      <CheckoutHeader onBack={() => router.back()} />

      <div className="container mx-auto px-4 py-8">
        <StepIndicator steps={steps} currentStep={currentStep} />

        {/* Debug Info */}
        {process.env.NODE_ENV === "development" && (
          <div className="max-w-2xl mx-auto mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-xs">
            <p>
              🐛 Debug: Step={currentStep}, Method={paymentMethod}, Secret=
              {clientSecret ? "✓" : "✗"}, Processing={processing ? "YES" : "NO"}
            </p>
            <p>✅ User: {currentUser.name} ({currentUser.userId})</p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Only wrap non-payment sections in form */}
            {(currentStep === 1 ||
              currentStep === 2 ||
              (currentStep === 3 && paymentMethod !== "card")) && (
              <form onSubmit={handleSubmit(onSubmit)}>
                {currentStep === 1 && (
                  <ContactInfoStep
                    register={register}
                    errors={errors}
                    watch={watch}
                  />
                )}

                {currentStep === 2 && (
                  <DeliveryAddressStep
                    register={register}
                    errors={errors}
                    watch={watch}
                  />
                )}

                {currentStep === 3 && paymentMethod !== "card" && (
                  <PaymentMethodStep
                    register={register}
                    errors={errors}
                    watch={watch}
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                  />
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-3 justify-between pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePreviousStep}
                    disabled={currentStep === 1}
                    className="disabled:opacity-50 disabled:cursor-not-allowed bg-transparent"
                  >
                    ← Previous
                  </Button>

                  {currentStep === 3 ? (
                    <Button
                      type="submit"
                      disabled={processing}
                      className="bg-rose-600 hover:bg-rose-700 text-white px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processing ? "Processing..." : "Place Order"}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleNextStep}
                      className="bg-rose-600 hover:bg-rose-700 text-white px-8"
                    >
                      Next →
                    </Button>
                  )}
                </div>
              </form>
            )}

            {/* Card payment section - no outer form */}
            {currentStep === 3 && paymentMethod === "card" && (
              <>
                <PaymentMethodStep
                  register={register}
                  errors={errors}
                  watch={watch}
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                />

                {/* Show Stripe Payment Form below when card is selected */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 border-2 border-rose-200 dark:border-rose-800 mt-6">
                  <h2 className="text-2xl font-bold mb-6 text-center text-rose-600">
                    💳 Complete Your Payment
                  </h2>
                  {clientSecret ? (
                    <>
                      <StripePaymentWrapper
                        clientSecret={clientSecret}
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                        amount={grandTotal}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setClientSecret("");
                          setPaymentIntentId("");
                          setProcessing(false);
                        }}
                        className="w-full mt-4"
                      >
                        ← Change Payment Method
                      </Button>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto"></div>
                      <p className="mt-4 text-gray-600 dark:text-gray-400">
                        Initializing payment...
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <OrderSummaryCard />
          </div>
        </div>
      </div>
    </div>
  );
}