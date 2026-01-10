/**
 * Admin Payment Dashboard Page
 *
 * Displays all payment statistics and recent payments for admin
 */

"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  DollarSign,
  CreditCard,
  TrendingUp,
  ShoppingBag,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { PaymentStats, PaymentRecord } from "@/types/payment";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminPaymentsPage() {
  const [stats, setStats] = useState<PaymentStats>({
    totalRevenue: 0,
    totalOrders: 0,
    successfulPayments: 0,
    failedPayments: 0,
    pendingPayments: 0,
    averageOrderValue: 0,
  });
  const [recentPayments, setRecentPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaymentData();
  }, []);

  const fetchPaymentData = async () => {
    try {
      setLoading(true);

      // Fetch statistics
      const statsResponse = await fetch("/api/payment/admin/stats", {
        cache: "no-store",
      });
      const statsJson = await statsResponse.json();
  
      if (statsJson.success && statsJson.data) {
        setStats(statsJson.data);
      }

      // Fetch recent payments
      const paymentsResponse = await fetch(
        "/api/payment/admin/all?page=1&limit=10",
        {
          cache: "no-store",
        }
      );
      const paymentsJson = await paymentsResponse.json(); // নামটা paymentsJson দিলাম বোঝার সুবিধার্থে


      if (
        paymentsJson.success &&
        paymentsJson.data &&
        paymentsJson.data.payments
      ) {
        setRecentPayments(paymentsJson.data.payments);
      }
    } catch (error) {
      console.error("Error fetching payment data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Revenue",
      value: `$${(stats?.totalRevenue ?? 0).toFixed(2)}`,
      icon: DollarSign,
      color: "bg-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      textColor: "text-green-600 dark:text-green-400",
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders ?? 0,
      icon: ShoppingBag,
      color: "bg-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Successful Payments",
      value: stats?.successfulPayments ?? 0,
      icon: CheckCircle,
      color: "bg-emerald-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
      textColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Failed Payments",
      value: stats?.failedPayments ?? 0,
      icon: XCircle,
      color: "bg-red-500",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      textColor: "text-red-600 dark:text-red-400",
    },
    {
      title: "Pending Payments",
      value: stats?.pendingPayments ?? 0,
      icon: Clock,
      color: "bg-yellow-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      textColor: "text-yellow-600 dark:text-yellow-400",
    },
    {
      title: "Average Order Value",
      value: `$${(stats?.averageOrderValue ?? 0).toFixed(2)}`,
      icon: TrendingUp,
      color: "bg-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      textColor: "text-purple-600 dark:text-purple-400",
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      succeeded:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      processing:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      failed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    };
    return (
      statusStyles[status as keyof typeof statusStyles] || statusStyles.pending
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading payment data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground">
            Payment Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor and manage all payment transactions
          </p>
        </div>
        <Link href="/admin/payments/all">
          <Button className="bg-rose-600 hover:bg-rose-700 text-white">
            View All Payments →
          </Button>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className={`p-6 ${stat.bgColor} border-none`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {stat.title}
                </p>
                <p className={`text-3xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`p-4 ${stat.color} rounded-lg`}>
                <stat.icon className="w-8 h-8 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Payments */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <CreditCard className="w-6 h-6" />
            Recent Payments
          </h2>
          <Link href="/admin/payments/all">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </div>

        {recentPayments.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No payments yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 dark:text-gray-400">
                    Order ID
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 dark:text-gray-400">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 dark:text-gray-400">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 dark:text-gray-400">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 dark:text-gray-400">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.map((payment) => (
                  <tr
                    key={payment._id}
                    className="border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <code className="text-sm bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded">
                        {payment?.paymentIntentId?.slice(-10) ?? "N/A"}
                      </code>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {payment?.userName ?? "Unknown"}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {payment?.userEmail ?? "N/A"}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        ${(payment?.amount ?? 0).toFixed(2)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                          payment?.status ?? "pending"
                        )}`}
                      >
                        {payment?.status ?? "pending"}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                      {payment?.createdAt
                        ? new Date(payment.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
