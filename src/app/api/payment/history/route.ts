/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";



    if (!userId) {
      console.log("❌ No userId provided");
      return NextResponse.json(
        { success: false, error: "Valid User ID Required", payments: [] },
        { status: 400 }
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api/v1";
    const backendUrl = `${baseUrl}/payment/user/${userId}?page=${page}&limit=${limit}`;

    

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    

    // Check if backend is reachable
    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Backend error response:", errorText);
      return NextResponse.json(
        {
          success: false,
          error: `Backend error: ${response.status}`,
          payments: [],
          debug: { status: response.status, response: errorText },
        },
        { status: 500 }
      );
    }

    // Check content type
    const contentType = response.headers.get("content-type");
   

    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("❌ Non-JSON response:", text.substring(0, 500));
      return NextResponse.json(
        {
          success: false,
          error: "Backend returned non-JSON",
          payments: [],
          debug: { contentType, response: text.substring(0, 200) },
        },
        { status: 500 }
      );
    }

    const result = await response.json();
  

    // Check if response has success property
    if (!result.success) {
      console.error("❌ Backend returned success: false");
      return NextResponse.json(
        {
          success: false,
          error: result.message || "Backend request failed",
          payments: [],
          debug: result,
        },
        { status: 500 }
      );
    }

    // Extract payments from nested structure
    let paymentsData = [];
    let totalPages = 1;

    

    if (result.data && result.data.data) {
      // Structure: { success: true, data: { data: [...], meta: {...} } }
      paymentsData = result.data.data;
      totalPages = result.data.meta?.totalPage || 1;
  
    } else if (result.data && Array.isArray(result.data)) {
      // Structure: { success: true, data: [...] }
      paymentsData = result.data;
      totalPages = result.meta?.totalPage || 1;
      console.log("✅ Found structure: data (array)");
    } else if (result.payments) {
      // Structure: { success: true, payments: [...] }
      paymentsData = result.payments;
      totalPages = result.totalPages || 1;
      console.log("✅ Found structure: payments");
    } else {
      console.error("❌ Unknown response structure:", Object.keys(result));
    }

    console.log("✅ Extracted payments count:", paymentsData.length);
    console.log("✅ Total pages:", totalPages);

    const finalResponse = {
      success: true,
      payments: paymentsData,
      totalPages: totalPages,
      currentPage: Number(page),
      debug: {
        receivedKeys: Object.keys(result),
        paymentsCount: paymentsData.length,
      },
    };

    console.log(
      "📤 Sending to frontend:",
      JSON.stringify(finalResponse, null, 2)
    );

    return NextResponse.json(finalResponse);
  } catch (error: any) {
    console.error("🔥 Next.js API Error:");
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error",
        payments: [],
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}
