/**
 * Admin All Payments Page
 *
 * Displays all payments with filtering and sorting options
 */

"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, Calendar, CreditCard, Eye } from "lucide-react";
import { PaymentRecord, PaymentStatus } from "@/types/payment";
import { useRouter } from "next/navigation";

export default function AdminAllPaymentsPage() {
  const router = useRouter();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPayments, setTotalPayments] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, statusFilter]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/payment/admin/all?page=${currentPage}&limit=20&status=${statusFilter}`,
        { cache: "no-store" }
      );

     const result = await response.json();

      // ✅ সংশোধন: result.data এর ভিতর থেকে payments বের করতে হবে
      if (result.success && result.data && result.data.payments) {
        setPayments(result.data.payments);
        setTotalPages(result.data.totalPages || 1);
        setTotalPayments(result.data.total || 0);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter((payment) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    return (
      payment.paymentIntentId.toLowerCase().includes(query) ||
      payment.userEmail.toLowerCase().includes(query) ||
      payment.userName.toLowerCase().includes(query)
    );
  });

  const getStatusBadge = (status: PaymentStatus) => {
    const statusStyles = {
      succeeded:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      processing:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      failed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      cancelled:
        "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
      refunded:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    };
    return statusStyles[status] || statusStyles.pending;
  };

  const exportToCSV = () => {
    const headers = [
      "Order ID",
      "Customer Name",
      "Email",
      "Amount",
      "Currency",
      "Status",
      "Date",
    ];
    const csvData = filteredPayments.map((payment) => [
      payment.paymentIntentId,
      payment.userName,
      payment.userEmail,
      payment.amount,
      payment.currency,
      payment.status,
      new Date(payment.createdAt).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payments_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading payments...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground">All Payments</h1>
          <p className="text-muted-foreground mt-2">
            Total: {totalPayments} payments
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportToCSV} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <Button onClick={() => router.back()} variant="outline">
            ← Back
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by order ID, email, or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
          >
            <option value="">All Status</option>
            <option value="succeeded">Succeeded</option>
            <option value="processing">Processing</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </Card>

      {/* Payments Table */}
      <Card className="p-6">
        {filteredPayments.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No payments found
            </p>
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
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 dark:text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr
                    key={payment._id}
                    className="border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <code className="text-sm bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded">
                        {payment.paymentIntentId.slice(-12)}
                      </code>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {payment.userName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {payment.userEmail}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          ${payment.amount.toFixed(2)}
                        </span>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                          {payment.currency}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                          payment.status
                        )}`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(payment.createdAt).toLocaleTimeString()}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="gap-1"
                        onClick={() => {
                          // Show payment details in modal or navigate to details page
                          alert(`View details for ${payment.paymentIntentId}`);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {(currentPage - 1) * 20 + 1} to{" "}
            {Math.min(currentPage * 20, totalPayments)} of {totalPayments}{" "}
            payments
          </p>
          <div className="flex gap-2">
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
        </div>
      )}
    </div>
  );
}
