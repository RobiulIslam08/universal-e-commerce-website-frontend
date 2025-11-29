
"use client"

import type React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { User, MapPin, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CheckoutHeader } from "./components/CheckoutHeader"
import { StepIndicator } from "./components/StepIndicator"
import { ContactInfoStep } from "./components/form/ContactInfoStep"
import { DeliveryAddressStep } from "./components/form/DeliveryAddressStep"
import { PaymentMethodStep } from "./components/form/PaymentMethodStep"
import { OrderSummaryCard } from "./components/OrderSummaryCard"

type CheckoutFormData = {
  email: string
  phone: string
  firstName: string
  lastName: string
  address: string
  city: string
  state: string
  zipCode: string
  cardNumber?: string
  cardExpiry?: string
  cardCVV?: string
  mobileNumber?: string
  saveInfo: boolean
  agreeTerms: boolean
}

type CartItem = {
  id: number
  name: string
  price: number
  originalPrice: number
  quantity: number
  image: string
  discount: number
}

type Step = {
  id: number
  title: string
  icon: React.ComponentType<{ className?: string }>
  fields: string[]
}

export default function PremiumCheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [processing, setProcessing] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm<CheckoutFormData>({
    mode: "onChange",
    defaultValues: {
      saveInfo: true,
      agreeTerms: false,
    },
  })

  const cartItems: CartItem[] = [
    {
      id: 1,
      name: "Premium Wireless Headphones",
      price: 299,
      originalPrice: 399,
      quantity: 1,
      image: "🎧",
      discount: 25,
    },
    {
      id: 2,
      name: "Smart Watch Pro",
      price: 499,
      originalPrice: 599,
      quantity: 1,
      image: "⌚",
      discount: 17,
    },
    {
      id: 3,
      name: "USB-C Fast Charger",
      price: 49,
      originalPrice: 79,
      quantity: 2,
      image: "🔌",
      discount: 38,
    },
  ]

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalSavings = cartItems.reduce((sum, item) => sum + (item.originalPrice - item.price) * item.quantity, 0)
  const shipping = subtotal > 500 ? 0 : 25
  const tax = Math.round(subtotal * 0.08)
  const total = subtotal + shipping + tax

  const steps: Step[] = [
    { id: 1, title: "Contact", icon: User, fields: ["email", "phone"] },
    {
      id: 2,
      title: "Delivery",
      icon: MapPin,
      fields: ["firstName", "lastName", "address", "city", "state", "zipCode"],
    },
    { id: 3, title: "Payment", icon: CreditCard, fields: ["agreeTerms"] },
  ]

  const validateStep = async (step: number) => {
    const fieldsToValidate = steps[step - 1].fields
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await trigger(fieldsToValidate as any)
    return result
  }

  const handleNextStep = async () => {
    const isValid = await validateStep(currentStep)
    if (isValid && currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = async (data: CheckoutFormData) => {
    setProcessing(true)
    console.log("Order submitted:", data)

    // TODO: Replace with actual API call
    setTimeout(() => {
      setProcessing(false)
      alert("Order placed successfully! 🎉")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-rose-50 via-white to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-rose-950/20">
      <CheckoutHeader onBack={() => console.log("Back to cart")} />

      <div className="container mx-auto px-4 py-8">
        <StepIndicator steps={steps} currentStep={currentStep} />

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {currentStep === 1 && <ContactInfoStep register={register} errors={errors} watch={watch} />}

              {currentStep === 2 && <DeliveryAddressStep register={register} errors={errors} watch={watch} />}

              {currentStep === 3 && (
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
                    className="bg-rose-600 hover:bg-rose-700 text-white px-8 disabled:opacity-50"
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
            </div>

            {/* Right Column - Order Summary */}
            <div>
              <OrderSummaryCard
                cartItems={cartItems}
                subtotal={subtotal}
                totalSavings={totalSavings}
                shipping={shipping}
                tax={tax}
                total={total}
              />
            </div>
          </div>
        </form>
      </div>
      
    </div>
  )
}
