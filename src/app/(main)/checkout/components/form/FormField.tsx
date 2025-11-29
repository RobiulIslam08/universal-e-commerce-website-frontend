/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react"
import { CheckCircle2, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FormFieldProps {
  label: string
  name: string
  type?: string
  placeholder?: string
  icon?: React.ComponentType<{ className?: string }>
  validation?: any
  register?: any
  errors?: any
  watch?: any
}

export const FormField = ({
  label,
  name,
  type = "text",
  placeholder,
  icon: Icon,
  validation,
  register,
  errors,
  watch,
}: FormFieldProps) => (
  <div className="space-y-2">
    <Label htmlFor={name} className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
      {Icon && <Icon className="w-4 h-4 text-rose-600" />}
      {label}
      {validation?.required && <span className="text-rose-500">*</span>}
    </Label>
    <div className="relative">
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register(name, validation)}
        className={`
          transition-all duration-200
          ${
            errors[name]
              ? "border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-950/20"
              : "border-slate-200 focus:border-rose-400 focus:ring-rose-400 dark:border-slate-700"
          }
          ${watch(name) && !errors[name] ? "border-green-500 bg-green-50/50 dark:bg-green-950/10" : ""}
        `}
      />
      {watch(name) && !errors[name] && (
        <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
      )}
      {errors[name] && <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />}
    </div>
    {errors[name] && (
      <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 animate-in slide-in-from-top-1">
        <AlertCircle className="w-3 h-3" />
        {errors[name]?.message as string}
      </p>
    )}
  </div>
)
