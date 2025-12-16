/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  CreditCard,
  Wallet,
  Package,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FormField } from "./FormField";

interface PaymentMethodStepProps {
  register: any;
  errors: any;
  watch: any;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
}

export const PaymentMethodStep = ({
  register,
  errors,
  watch,
  paymentMethod,
  setPaymentMethod,
}: PaymentMethodStepProps) => (
  <Card className="border-rose-100 dark:border-rose-900 shadow-xl">
    <CardHeader className="bg-linear-to-br from-rose-50 to-white dark:from-slate-800 dark:to-slate-900">
      <CardTitle className="flex items-center gap-3 text-slate-900 dark:text-white">
        <div className="w-10 h-10 rounded-full bg-rose-600 flex items-center justify-center text-white font-bold shadow-lg">
          3
        </div>
        Payment Method
      </CardTitle>
      <CardDescription>Choose your preferred payment option</CardDescription>
    </CardHeader>
    <CardContent className="pt-6 space-y-6">
      <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
        <div
          className={`
          flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all
          ${
            paymentMethod === "card"
              ? "border-rose-500 bg-rose-50 dark:bg-rose-950/30 shadow-md"
              : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
          }
        `}
        >
          <RadioGroupItem value="card" id="card" className="text-rose-600" />
          <Label
            htmlFor="card"
            className="flex-1 cursor-pointer flex items-center gap-3 ml-3"
          >
            <CreditCard className="w-6 h-6 text-rose-600" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">
                Credit/Debit Card
              </p>
              <p className="text-xs text-slate-500">Visa, Mastercard, Amex</p>
            </div>
          </Label>
          {paymentMethod === "card" && (
            <CheckCircle2 className="w-5 h-5 text-rose-600" />
          )}
        </div>

        <div
          className={`
          flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all
          ${
            paymentMethod === "paypal"
              ? "border-rose-500 bg-rose-50 dark:bg-rose-950/30 shadow-md"
              : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
          }
        `}
        >
          <RadioGroupItem
            value="paypal"
            id="paypal"
            className="text-rose-600"
          />
          <Label
            htmlFor="paypal"
            className="flex-1 cursor-pointer flex items-center gap-3 ml-3"
          >
            <Wallet className="w-6 h-6 text-rose-600" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">
                PayPal
              </p>
              <p className="text-xs text-slate-500">Fast & secure payment</p>
            </div>
          </Label>
          {paymentMethod === "paypal" && (
            <CheckCircle2 className="w-5 h-5 text-rose-600" />
          )}
        </div>

        <div
          className={`
          flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all
          ${
            paymentMethod === "cod"
              ? "border-rose-500 bg-rose-50 dark:bg-rose-950/30 shadow-md"
              : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
          }
        `}
        >
          <RadioGroupItem value="cod" id="cod" className="text-rose-600" />
          <Label
            htmlFor="cod"
            className="flex-1 cursor-pointer flex items-center gap-3 ml-3"
          >
            <Package className="w-6 h-6 text-rose-600" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">
                Cash on Delivery
              </p>
              <p className="text-xs text-slate-500">Pay when you receive</p>
            </div>
          </Label>
          {paymentMethod === "cod" && (
            <CheckCircle2 className="w-5 h-5 text-rose-600" />
          )}
        </div>
      </RadioGroup>

      {paymentMethod === "card" && (
        <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
          <FormField
            label="Card Number"
            name="cardNumber"
            placeholder="1234 5678 9012 3456"
            icon={CreditCard}
            validation={{
              required: "Card number is required",
              pattern: {
                value: /^[0-9\s]{13,19}$/,
                message: "Invalid card number",
              },
            }}
            register={register}
            errors={errors}
            watch={watch}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Expiry Date"
              name="cardExpiry"
              placeholder="MM/YY"
              validation={{
                required: "Expiry date is required",
                pattern: {
                  value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                  message: "Invalid format (MM/YY)",
                },
              }}
              register={register}
              errors={errors}
              watch={watch}
            />
            <FormField
              label="CVV"
              name="cardCVV"
              type="password"
              placeholder="123"
              validation={{
                required: "CVV is required",
                pattern: {
                  value: /^[0-9]{3,4}$/,
                  message: "Invalid CVV",
                },
              }}
              register={register}
              errors={errors}
              watch={watch}
            />
          </div>
        </div>
      )}

      {paymentMethod === "paypal" && (
        <div className="animate-in slide-in-from-top-4 duration-300">
          <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#003087] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PP</span>
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  Pay with PayPal
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Safe & secure payment
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              After clicking &quot;Place Order&quot;, you will be redirected to
              PayPal to complete your purchase securely.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              <span>Protected by PayPal Buyer Protection</span>
            </div>
          </div>
        </div>
      )}

      <Separator />

      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <Checkbox
            id="saveInfo"
            {...register("saveInfo")}
            className="mt-1 data-[state=checked]:bg-rose-600"
          />
          <Label
            htmlFor="saveInfo"
            className="text-sm text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            Save payment information for faster checkout next time
          </Label>
        </div>

        <div className="flex items-start gap-3">
          <Checkbox
            id="agreeTerms"
            {...register("agreeTerms", { required: true })}
            className={`mt-1 data-[state=checked]:bg-rose-600 ${
              errors.agreeTerms ? "border-red-500" : ""
            }`}
          />
          <Label
            htmlFor="agreeTerms"
            className="text-sm text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            I agree to the{" "}
            <span className="text-rose-600 underline font-semibold">
              Terms & Conditions
            </span>{" "}
            and{" "}
            <span className="text-rose-600 underline font-semibold">
              Privacy Policy
            </span>
            <span className="text-rose-500 ml-1">*</span>
          </Label>
        </div>
        {errors.agreeTerms && (
          <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            You must agree to the terms and conditions
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
        <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
        <div className="text-sm text-amber-700 dark:text-amber-300">
          <p className="font-semibold">100% Secure Payment</p>
          <p className="text-xs">
            Your data is encrypted with 256-bit SSL security
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);
