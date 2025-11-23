// components/cart/TrustBadges.tsx
import { ShieldCheck, Truck, Package, Gift } from "lucide-react";

const badges = [
  { icon: ShieldCheck, label: "Secure Payment", color: "text-blue-500" },
  { icon: Truck, label: "Free Shipping", color: "text-green-500" },
  { icon: Package, label: "Easy Returns", color: "text-rose-500" },
  { icon: Gift, label: "Gift Wrapping", color: "text-orange-500" }
];

export default function TrustBadges() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-2">
      {badges.map((badge, i) => (
        <div key={i} className="flex items-center gap-3 p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-transform hover:scale-[1.02]">
          <badge.icon className={`w-6 h-6 ${badge.color}`} />
          <span className="text-xs font-semibold text-slate-900 dark:text-white">
            {badge.label}
          </span>
        </div>
      ))}
    </div>
  );
}