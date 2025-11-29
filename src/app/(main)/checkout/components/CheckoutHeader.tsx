"use client"

import { ArrowLeft, Lock } from "lucide-react"
import Link from "next/link"

interface CheckoutHeaderProps {
  onBack: () => void
}

export const CheckoutHeader = ({ onBack }: CheckoutHeaderProps) => (
  <header className="border-b bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
    <div className="container mx-auto px-4 py-4">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-rose-600 hover:text-rose-700 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
         <Link href="/cart">
		  <span className="font-semibold">Back to Cart</span>
		 </Link>
        </button>

        <h1 className="text-2xl font-bold bg-linear-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
          Secure Checkout
        </h1>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-950/30 rounded-full border border-green-200 dark:border-green-800">
          <Lock className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-green-700 dark:text-green-400">Secured</span>
        </div>
      </div>
    </div>
  </header>
)
