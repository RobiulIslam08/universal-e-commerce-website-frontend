import { Tag, Award, Clock, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CartItem {
  id: number
  name: string
  price: number
  originalPrice: number
  quantity: number
  image: string
  discount: number
}

interface OrderSummaryCardProps {
  cartItems: CartItem[]
  subtotal: number
  totalSavings: number
  shipping: number
  tax: number
  total: number
}

export const OrderSummaryCard = ({
  cartItems,
  subtotal,
  totalSavings,
  shipping,
  tax,
  total,
}: OrderSummaryCardProps) => (
  <Card className="border-rose-200 dark:border-rose-800 shadow-2xl sticky top-24">
    <CardHeader className="bg-linear-to-br from-rose-50 to-white dark:from-slate-800 dark:to-slate-900">
      <CardTitle className="text-slate-900 dark:text-white">Order Summary</CardTitle>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{cartItems.length} items in your order</p>
    </CardHeader>
    <CardContent className="pt-6 space-y-4">
      {/* Items */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="text-3xl">{item.image}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{item.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Qty: {item.quantity}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                ${(item.price * item.quantity).toLocaleString()}
              </p>
              <p className="text-xs text-red-600 dark:text-red-400">-${(item.discount * item.quantity).toFixed(0)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-200 dark:bg-slate-700" />

      {/* Pricing Details */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Subtotal</span>
          <span>${subtotal.toLocaleString()}</span>
        </div>

        {totalSavings > 0 && (
          <div className="flex justify-between text-green-600 dark:text-green-400 font-semibold">
            <span className="flex items-center gap-1">
              <Tag className="w-4 h-4" />
              Total Savings
            </span>
            <span>-${totalSavings.toLocaleString()}</span>
          </div>
        )}

        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Shipping</span>
          <span className={shipping === 0 ? "text-green-600 dark:text-green-400 font-semibold" : ""}>
            {shipping === 0 ? "FREE" : `$${shipping}`}
          </span>
        </div>

        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Tax</span>
          <span>${tax}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-200 dark:bg-slate-700" />

      {/* Total */}
      <div className="flex justify-between items-center pt-2">
        <span className="text-lg font-bold text-slate-900 dark:text-white">Total Amount</span>
        <span className="text-2xl font-bold bg-linear-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
          ${total.toLocaleString()}
        </span>
      </div>

      {/* Trust Badges */}
      <div className="space-y-2 pt-4">
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
          <Award className="w-4 h-4 text-rose-600" />
          <span>Trusted by 50,000+ customers</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
          <Clock className="w-4 h-4 text-rose-600" />
          <span>Order processing takes 30 minutes</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
          <ChevronRight className="w-4 h-4 text-rose-600" />
          <span>24/7 customer support available</span>
        </div>
      </div>
    </CardContent>
  </Card>
)
