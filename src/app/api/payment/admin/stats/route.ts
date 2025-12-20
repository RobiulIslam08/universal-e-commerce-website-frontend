/**
 * Admin Payment Statistics API Route
 *
 * Fetches all payment statistics for admin dashboard
 * Endpoint: GET /api/payment/admin/stats
 */

import { NextRequest, NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    // If backend not available, return mock data
    if (!backendUrl) {
      console.warn("⚠️ Backend URL not configured, returning default stats");
      return NextResponse.json({
        totalRevenue: 0,
        totalOrders: 0,
        successfulPayments: 0,
        failedPayments: 0,
        pendingPayments: 0,
        averageOrderValue: 0,
      });
    }

    console.log(
      "🔍 Fetching stats from:",
      `${backendUrl}/payments/admin/stats`
    );

    // Fetch payment statistics from backend
    const response = await fetch(`${backendUrl}/payments/admin/stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("❌ Backend response not OK:", response.status);
      // Return default stats instead of error
      return NextResponse.json({
        totalRevenue: 0,
        totalOrders: 0,
        successfulPayments: 0,
        failedPayments: 0,
        pendingPayments: 0,
        averageOrderValue: 0,
      });
    }

    const data = await response.json();
    console.log("✅ Stats fetched successfully");

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Error fetching payment stats:", error);

    // Return default stats instead of 500 error
    return NextResponse.json({
      totalRevenue: 0,
      totalOrders: 0,
      successfulPayments: 0,
      failedPayments: 0,
      pendingPayments: 0,
      averageOrderValue: 0,
    });
  }
}
