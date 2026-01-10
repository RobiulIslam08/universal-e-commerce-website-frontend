/**
 * Admin All Payments API Route
 *
 * Fetches all payments for admin dashboard
 * Endpoint: GET /api/payment/admin/all?page={page}&limit={limit}&status={status}
 */

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "20";
    const status = searchParams.get("status") || "";

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    // If backend not available, return mock data
    if (!backendUrl) {
      console.warn("⚠️ Backend URL not configured, returning empty data");
      return NextResponse.json({
        payments: [],
        total: 0,
        page: parseInt(page),
        totalPages: 0,
      });
    }

    // Build query string
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...(status && { status }),
    });

  
    // Fetch all payments from backend
    const response = await fetch(
      `${backendUrl}/payment/admin/all?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error("❌ Backend response not OK:", response.status);
      // Return empty data instead of error
      return NextResponse.json({
        payments: [],
        total: 0,
        page: parseInt(page),
        totalPages: 0,
      });
    }

    const data = await response.json();
   

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Error fetching all payments:", error);

    // Return empty data instead of 500 error
    return NextResponse.json({
      payments: [],
      total: 0,
      page: 1,
      totalPages: 0,
    });
  }
}
