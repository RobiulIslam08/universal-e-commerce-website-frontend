import React from "react";

export default function OrderConfirmationPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-3xl font-bold text-green-600 mb-4">Order Confirmed!</h1>
      <p className="text-lg text-gray-700 mb-2">Thank you for your order.</p>
      <p className="text-gray-500">You will receive a confirmation email soon.</p>
    </div>
  );
}
