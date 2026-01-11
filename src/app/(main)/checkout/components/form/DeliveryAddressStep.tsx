/* eslint-disable @typescript-eslint/no-explicit-any */
import { User, Home, Building2, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { FormField } from "./FormField"

interface DeliveryAddressStepProps {
  register: any
  errors: any
  watch: any
}

export const DeliveryAddressStep = ({ register, errors, watch }: DeliveryAddressStepProps) => (
  <Card className="border-rose-100 dark:border-rose-900 shadow-xl pt-4">
    <CardHeader className="">
      <CardTitle className="flex items-center gap-3 text-slate-900 dark:text-white">
        <div className="w-10 h-10 rounded-full bg-rose-600 flex items-center justify-center text-white font-bold shadow-lg">
          2
        </div>
        Delivery Address
      </CardTitle>
      <CardDescription>Where should we deliver your order?</CardDescription>
    </CardHeader>
    <CardContent className="pt-6 space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <FormField
          label="First Name"
          name="firstName"
          placeholder="John"
          icon={User}
          validation={{ required: "First name is required" }}
          register={register}
          errors={errors}
          watch={watch}
        />
        <FormField
          label="Last Name"
          name="lastName"
          placeholder="Doe"
          icon={User}
          validation={{ required: "Last name is required" }}
          register={register}
          errors={errors}
          watch={watch}
        />
      </div>

      <FormField
        label="Street Address"
        name="address"
        placeholder="House/Road/Area"
        icon={Home}
        validation={{ required: "Address is required" }}
        register={register}
        errors={errors}
        watch={watch}
      />

      <div className="grid md:grid-cols-3 gap-4">
        <FormField
          label="City"
          name="city"
          placeholder="Dhaka"
          icon={Building2}
          validation={{ required: "City is required" }}
          register={register}
          errors={errors}
          watch={watch}
        />
        <FormField
          label="State/Division"
          name="state"
          placeholder="Dhaka Division"
          icon={MapPin}
          validation={{ required: "State is required" }}
          register={register}
          errors={errors}
          watch={watch}
        />
        <FormField
          label="Zip/Postal Code"
          name="zipCode"
          placeholder="1200"
          validation={{
            required: "Zip code is required",
            pattern: {
              value: /^[0-9]{4,6}$/,
              message: "Invalid zip code",
            },
          }}
          register={register}
          errors={errors}
          watch={watch}
        />
      </div>

    </CardContent>
  </Card>
)
