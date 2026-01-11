/* eslint-disable @typescript-eslint/no-explicit-any */
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, name, email, subject, message, amount, items, paymentIntentId } = body;

    // --- পেমেন্ট সফল হওয়ার ইমেইল (কাস্টমারের জন্য) ---
    if (type === "payment_success") {
      const { data, error } = await resend.emails.send({
        from: 'Your Store <onboarding@resend.dev>', // ডোমেইন ভেরিফাই করলে support@yourdomain.com দিন
        to: [email],
        subject: `Order Confirmed! Payment ID: ${paymentIntentId}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
            <h2 style="color: #2ecc71;">Payment Successful!</h2>
            <p>Hi ${name},</p>
            <p>Thank you for your purchase. Your payment has been processed successfully.</p>
            <hr />
            <h4>Order Summary:</h4>
            <ul>
              ${items?.map((item: any) => `
                <li>${item.productName} x ${item.quantity} - ${item.price} BDT</li>
              `).join('')}
            </ul>
            <p><strong>Total Paid: ${amount} BDT</strong></p>
            <p>We will ship your items soon. Stay tuned!</p>
            <br />
            <p>Best Regards,<br/><strong>Your Store Team</strong></p>
          </div>
        `,
      });

      if (error) return NextResponse.json({ error }, { status: 400 });
      return NextResponse.json({ success: true, data });
    }

    // --- কন্টাক্ট ফর্ম ইমেইল (আপনার নিজের জন্য) ---
    if (type === "contact_form") {
      const { data, error } = await resend.emails.send({
        from: 'Contact Form <onboarding@resend.dev>',
        to: ['robiulislamrobi0874@gmail.com'], // আপনার নিজের ইমেইল যেখানে কন্টাক্ট মেসেজ পাবেন
        replyTo: email,
        subject: `[Inquiry] ${subject}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; background-color: #f9f9f9;">
            <h3>New Message from Website</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <hr />
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
        `,
      });

      if (error) return NextResponse.json({ error }, { status: 400 });
      return NextResponse.json({ success: true, data });
    }

    return NextResponse.json({ error: "Invalid request type" }, { status: 400 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}