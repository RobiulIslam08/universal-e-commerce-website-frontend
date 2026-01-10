/**
 * Payment History Page
 *
 * Displays all payment history for the logged-in user
 * Shows list of all transactions with details
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Calendar,
  Package,
  DollarSign,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PaymentRecord, PaymentStatus } from "@/types/payment";
import { getCurrentUser } from "@/services/auth";

export default function PaymentHistoryPage() {
  const router = useRouter();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock user ID - Replace with actual user ID from auth context
  // ✅ নতুন কোড: ইউজারের আইডি ডাইনামিকালি সেট করুন
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const user = await getCurrentUser();
      if (user?.userId) {
        setUserId(user.userId);
      }
    };
    loadUser();
  }, []);
  
useEffect(() => {
    if (userId) { // ইউজার আইডি পাওয়ার পরেই কেবল ফেচ করবে
      fetchPaymentHistory();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, currentPage, filterStatus]);

const fetchPaymentHistory = async () => {
  try {
    setLoading(true);
    
    if (!userId) {
      console.log("⚠️ No userId available yet");
      setPayments([]);
      return;
    }
    

    
    const url = `/api/payment/history?userId=${userId}&page=${currentPage}&limit=10`;
 
    
    const response = await fetch(url, { cache: "no-store" });
    
  

    const contentType = response.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      const text = await response.text();
      console.error("❌ Not JSON. Received:", text.substring(0, 500));
      setPayments([]);
      return;
    }

    const data = await response.json();
   

    if (data.success) {
      if (data.payments && Array.isArray(data.payments)) {
        
        setPayments(data.payments);
        setTotalPages(data.totalPages || 1);
      } else {
        console.error("❌ No payments array in response");
        console.error("Available keys:", Object.keys(data));
        console.error("Full data:", data);
        setPayments([]);
      }
    } else {
      console.error("❌ Response success is false");
      console.error("Error:", data.error);
      console.error("Debug info:", data.debug);
      setPayments([]);
    }
    
  } catch (error) {
    console.error("💥 Fetch error:");
    console.error(error);
    setPayments([]);
  } finally {
    setLoading(false);
  }
};

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case "succeeded":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.paymentIntentId
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      payment.userEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "" || payment.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading payment history...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-rose-50 via-white to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-rose-950/20 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Payment History
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View all your past transactions and payment details
          </p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6 bg-white dark:bg-slate-800">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search by order ID or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
              >
                <option value="">All Status</option>
                <option value="succeeded">Succeeded</option>
                <option value="processing">Processing</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Payment List */}
        {filteredPayments.length === 0 ? (
          <Card className="p-12 text-center bg-white dark:bg-slate-800">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No payments found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You haven&apos;t made any payments yet
            </p>
            <Button
              onClick={() => router.push("/")}
              className="bg-rose-600 hover:bg-rose-700"
            >
              Start Shopping
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredPayments.map((payment) => (
              <Card
                key={payment._id}
                className="p-6 bg-white dark:bg-slate-800 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() =>
                  router.push(`/payment/details/${payment.paymentIntentId}`)
                }
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Left Side - Main Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
                        <CreditCard className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          Order #{payment.paymentIntentId.slice(-8)}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(payment.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Package className="w-4 h-4" />
                            {payment.items?.length || 0} items
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Amount & Status */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-2xl font-bold text-gray-900 dark:text-white">
                        <DollarSign className="w-5 h-5" />
                        {payment.amount.toFixed(2)}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                        {payment.currency}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        payment.status
                      )}`}
                    >
                      {payment.status}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="flex items-center px-4 text-gray-700 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Button variant="outline" onClick={() => router.back()}>
            ← Back
          </Button>
        </div>
      </div>
    </div>
  );
}
