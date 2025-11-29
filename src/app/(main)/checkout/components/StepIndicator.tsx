import type React from "react"
import { CheckCircle2 } from "lucide-react"

interface Step {
  id: number
  title: string
  icon: React.ComponentType<{ className?: string }>
  fields: string[]
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
}

export const StepIndicator = ({ steps, currentStep }: StepIndicatorProps) => (
  <div className="mb-8">
    <div className="flex items-center justify-between max-w-2xl mx-auto">
      {steps.map((step, index) => {
        const Icon = step.icon
        const isActive = currentStep === step.id
        const isCompleted = currentStep > step.id

        return (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`
                w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300
                ${isActive ? "bg-rose-600 text-white shadow-lg shadow-rose-300 scale-110" : ""}
                ${isCompleted ? "bg-green-500 text-white" : ""}
                ${!isActive && !isCompleted ? "bg-slate-200 dark:bg-slate-700 text-slate-500" : ""}
              `}
              >
                {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
              </div>
              <span
                className={`
                mt-2 text-sm font-semibold transition-colors
                ${isActive ? "text-rose-600" : "text-slate-500 dark:text-slate-400"}
              `}
              >
                {step.title}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div
                className={`
                h-1 flex-1 mx-2 transition-all duration-300
                ${isCompleted ? "bg-green-500" : "bg-slate-200 dark:bg-slate-700"}
              `}
              />
            )}
          </div>
        )
      })}
    </div>
  </div>
)
