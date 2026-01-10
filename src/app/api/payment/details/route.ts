/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { paymentIntentId } = await req.json();

    if (!paymentIntentId) {
      return NextResponse.json(
        { success: false, error: "Payment Intent ID required" },
        { status: 400 }
      );
    }

    // আপনার ব্যাকএন্ড (Express) এর সঠিক URL
    // আপনার Express রাউট ছিল: router.get('/intent/:paymentIntentId')
    // const backendUrl = `http://localhost:5000/api/v1/payment/intent/${paymentIntentId}`;
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    const backendUrl = `${baseUrl}/payment/intent/${paymentIntentId}`;
   

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // ক্যাশিং এড়াতে
      cache: "no-store", 
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("❌ Backend Error:", result);
      return NextResponse.json(
        { success: false, error: result.message || "Failed to fetch payment details" },
        { status: response.status }
      );
    }

    // আপনার ব্যাকএন্ড সম্ভবত { success: true, data: { ... } } রিটার্ন করে
    // তাই result.data কে payment হিসেবে পাঠাচ্ছি
    return NextResponse.json({ 
      success: true, 
      payment: result.data || result // ব্যাকএন্ড রেসপন্স স্ট্রাকচার অনুযায়ী এডজাস্ট হতে পারে
    }); 

  } catch (error: any) {
    console.error("🔥 Next.js Proxy Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}