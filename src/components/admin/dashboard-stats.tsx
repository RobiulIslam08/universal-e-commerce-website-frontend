"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface DashboardStatsProps {
  stats: {
    totalProducts: number
    inStock: number
    outOfStock: number
    totalValue: number
  }
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const statItems = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: "📦",
      gradient: "from-blue-500/10 to-cyan-500/10 dark:from-blue-900/20 dark:to-cyan-900/20",
      iconBg: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
      accent: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "In Stock",
      value: stats.inStock,
      icon: "✅",
      gradient: "from-green-500/10 to-emerald-500/10 dark:from-green-900/20 dark:to-emerald-900/20",
      iconBg: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
      accent: "text-green-600 dark:text-green-400",
    },
    {
      title: "Out of Stock",
      value: stats.outOfStock,
      icon: "⚠️",
      gradient: "from-red-500/10 to-orange-500/10 dark:from-red-900/20 dark:to-orange-900/20",
      iconBg: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
      accent: "text-red-600 dark:text-red-400",
    },
    {
      title: "Inventory Value",
      value: `$${(stats.totalValue / 1000).toFixed(1)}k`,
      icon: "💰",
      gradient: "from-primary/10 to-rose-500/10 dark:from-primary/20 dark:to-rose-900/20",
      iconBg: "bg-primary/20 text-primary dark:bg-primary/30",
      accent: "text-primary",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {statItems.map((item, index) => (
        <Card
          key={index}
          className={cn(
            "group border-0 overflow-hidden shadow-lg shadow-rose-500/10 dark:shadow-rose-500/5 transition-all duration-300 hover:shadow-xl hover:border-primary/30 hover:shadow-primary/10 hover:-translate-y-1",
            `bg-linear-to-br ${item.gradient}`,
          )}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
            <div className="flex-1">
              <CardTitle className="text-sm font-medium text-muted-foreground">{item.title}</CardTitle>
            </div>
            <div
              className={`p-3 rounded-xl ${item.iconBg} transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg text-xl`}
            >
              {item.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${item.accent} transition-all duration-300`}>{item.value}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {index === 0 && "Total items"}
              {index === 1 && "Available now"}
              {index === 2 && "Needs restock"}
              {index === 3 && "Total worth"}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
