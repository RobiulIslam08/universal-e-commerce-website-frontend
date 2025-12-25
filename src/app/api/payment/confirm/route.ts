/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // চেক করুন ফ্রন্টএন্ড থেকে কি ডাটা আসছে
    console.log("📥 Next.js API Received Body:", JSON.stringify(body, null, 2));

    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    const backendUrl = `${baseUrl}/payment`;
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // ⚠️ এখানে কোনো কাস্টম অবজেক্ট বানাবেন না, ফ্রন্টএন্ডের বডিটাই ফরোয়ার্ড করুন
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("❌ Express Backend Error:", result);
      return NextResponse.json(
        {
          success: false,
          error: result.message || result.error || "Backend Validation Failed",
        },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("🔥 Next.js Proxy Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
