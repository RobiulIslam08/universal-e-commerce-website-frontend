/**
 * Payment History API Route
 *
 * Fetches payment history for a specific user
 * Endpoint: GET /api/payment/history?userId={userId}&page={page}&limit={limit}
 */

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!backendUrl) {
      return NextResponse.json(
        { error: "Backend URL not configured" },
        { status: 500 }
      );
    }

    // Fetch payment history from backend
    const response = await fetch(
      `${backendUrl}/payments/user/${userId}?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch payment history");
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching payment history:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch payment history",
        payments: [],
        total: 0,
        page: 1,
        totalPages: 0,
      },
      { status: 500 }
    );
  }
}
