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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { grandTotalSelector } from "@/redux/features/cartSlice";
import { toast } from "sonner";

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

export default function PremiumCheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [paymentIntentId, setPaymentIntentId] = useState<string>("");
  const router = useRouter();

  // Get cart data from Redux
  const cartItems = useAppSelector((state) => state.cart.products);
  const subtotal = useAppSelector((state) => {
    return state.cart.products.reduce((acc, product) => {
      const price = product.offerPrice || product.price;
      return acc + price * product.orderQuantity;
    }, 0);
  });
  const shipping = useAppSelector((state) => {
    if (
      state.cart.city &&
      state.cart.city === "Dhaka" &&
      state.cart.products.length > 0
    ) {
      return 50;
    } else if (
      state.cart.city &&
      state.cart.city !== "Dhaka" &&
      state.cart.products.length > 0
    ) {
      return 150;
    }
    return 0;
  });
  const tax = 0; // Tax calculation can be added here
  const grandTotal = subtotal + shipping + tax;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm<CheckoutFormData>({
    mode: "onChange",
  });

  // Clear clientSecret when leaving step 3
  useEffect(() => {
    console.log("📍 Current Step:", currentStep);
    console.log("💳 Payment Method:", paymentMethod);
    console.log("🔑 Client Secret:", clientSecret ? "EXISTS" : "EMPTY");

    // If not on step 3 and clientSecret exists, clear it
    if (currentStep !== 3 && clientSecret) {
      console.log("⚠️ Not on step 3, clearing clientSecret");
      setClientSecret("");
      setPaymentIntentId("");
    }
  }, [currentStep, clientSecret, paymentMethod]);

  // Auto-create payment intent when card is selected on step 3
  useEffect(() => {
    const createPaymentIntent = async () => {
      // Only create if on step 3, card selected, and no existing clientSecret
      if (
        currentStep === 3 &&
        paymentMethod === "card" &&
        !clientSecret &&
        !processing
      ) {
        const formData = watch();

        // Check if required fields are filled
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
              shippingAddress: {
                line1: formData.address,
                city: formData.city,
                state: formData.state,
                postal_code: formData.zipCode,
                country: "US",
              },
              items: cartItems.map((item) => ({
                productId: item._id,
                productName: item.name,
                quantity: item.orderQuantity,
                price: item.offerPrice || item.price,
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
  }, [currentStep, paymentMethod, clientSecret, processing]);

  const steps: Step[] = [
    { id: 1, title: "Contact", icon: User, fields: ["email", "phone"] },
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
      fields: [],
    },
  ];

  const validateStep = async (step: number) => {
    const fieldsToValidate = steps[step - 1].fields;
    console.log("Validating step", step, "fields:", fieldsToValidate);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      // Clear any existing payment intent when moving to next step
      console.log("🔄 Moving to next step, clearing payment intent");
      console.log("Current clientSecret:", clientSecret ? "EXISTS" : "EMPTY");
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
      // Clear payment intent when going back
      console.log("⬅️ Going back, clearing payment intent");
      if (clientSecret) {
        setClientSecret("");
        setPaymentIntentId("");
      }
      setCurrentStep(currentStep - 1);
      console.log("✅ Moved back to step", currentStep - 1);
    }
  };

  const onSubmit = async (data: CheckoutFormData) => {
    console.log("Form submitted with data:", data);
    console.log("Payment method:", paymentMethod);
    console.log("Grand Total:", grandTotal);

    if (paymentMethod === "card") {
      // For card payment, create payment intent
      setProcessing(true);
      toast.info("Initializing payment...");

      try {
        const response = await fetch("/api/payment/create-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: grandTotal,
            currency: "usd",
            customerEmail: data.email,
            customerName: `${data.firstName} ${data.lastName}`,
            shippingAddress: {
              line1: data.address,
              city: data.city,
              state: data.state,
              postal_code: data.zipCode,
              country: "US",
            },
            items: cartItems.map((item) => ({
              productId: item._id,
              productName: item.name,
              quantity: item.orderQuantity,
              price: item.offerPrice || item.price,
            })),
            subtotal: subtotal,
            shipping: shipping,
            tax: tax,
            total: grandTotal,
          }),
        });

        const result = await response.json();

        if (response.ok && result.clientSecret) {
          setClientSecret(result.clientSecret);
          setPaymentIntentId(result.paymentIntentId);
          setProcessing(false);
          toast.success("Please complete the payment below");
        } else {
          toast.error(result.error || "Failed to initialize payment");
          setProcessing(false);
        }
      } catch (error) {
        console.error("Payment initialization error:", error);
        toast.error("Failed to initialize payment");
        setProcessing(false);
      }
    } else {
      // For COD or other payment methods
      setProcessing(true);
      console.log("Order submitted:", data);

      setTimeout(() => {
        setProcessing(false);
        toast.success("Order placed successfully! 🎉");
        router.push("/order-confirmation");
      }, 2000);
    }
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    try {
      // Confirm payment on backend
      const response = await fetch("/api/payment/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentIntentId }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Payment successful! 🎉");
        // Redirect to payment success page
        router.push(`/payment/success?payment_intent=${paymentIntentId}`);
      } else {
        toast.error("Payment verification failed");
      }
    } catch (error) {
      console.error("Payment confirmation error:", error);
      toast.error("Failed to confirm payment");
    }
  };

  const handlePaymentError = (error: string) => {
    console.error("Payment error:", error);
    setProcessing(false);
    setClientSecret("");
  };

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
            <p>
              Show Payment Form:{" "}
              {paymentMethod === "card" && currentStep === 3
                ? "Should show when card selected"
                : "NO"}
            </p>
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
