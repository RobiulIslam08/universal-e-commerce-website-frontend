/* eslint-disable @typescript-eslint/no-explicit-any */
import { Mail, Phone, BadgeCheck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { FormField } from "./FormField"

interface ContactInfoStepProps {
  register: any
  errors: any
  watch: any
}

export const ContactInfoStep = ({ register, errors, watch }: ContactInfoStepProps) => (
  <Card className="border-rose-100 dark:border-rose-900 shadow-xl">
    <CardHeader className="bg-linear-to-br from-rose-50 to-white dark:from-slate-800 dark:to-slate-900">
      <CardTitle className="flex items-center gap-3 text-slate-900 dark:text-white">
        <div className="w-10 h-10 rounded-full bg-rose-600 flex items-center justify-center text-white font-bold shadow-lg">
          1
        </div>
        Contact Information
      </CardTitle>
      <CardDescription>We&apos;ll use this to send order updates</CardDescription>
    </CardHeader>
    <CardContent className="pt-6 space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <FormField
          label="Email Address"
          name="email"
          type="email"
          placeholder="your@email.com"
          icon={Mail}
          validation={{
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          }}
          register={register}
          errors={errors}
          watch={watch}
        />
        <FormField
          label="Phone Number"
          name="phone"
          type="tel"
          placeholder="+880 1XXX-XXXXXX"
          icon={Phone}
          validation={{
            required: "Phone number is required",
            pattern: {
              value: /^[+]?[0-9\s-()]+$/,
              message: "Invalid phone number",
            },
          }}
          register={register}
          errors={errors}
          watch={watch}
        />
      </div>

      <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
        <BadgeCheck className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
        <div className="text-sm text-blue-700 dark:text-blue-300">
          <p className="font-semibold">Stay Updated</p>
          <p className="text-xs">Get real-time order tracking and delivery notifications</p>
        </div>
      </div>
    </CardContent>
  </Card>
)
