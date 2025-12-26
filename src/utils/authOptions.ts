/* eslint-disable @typescript-eslint/no-explicit-any */
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    // ১. সাইন ইন করার সময় ব্যাকএন্ডে ডাটা পাঠানো
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const { name, email, image } = user;

          // আপনার ব্যাকএন্ড API কল করুন
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/social-login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name,
              email,
              image,
            }),
          });

          const data = await res.json();

          if (data.success) {
            // ব্যাকএন্ড থেকে আসা accessToken বা userId ইউজারের অবজেক্টে সেট করে দিন
            // যাতে পরবর্তী callback এ পাওয়া যায়
            (user as any).accessToken = data.data.accessToken;
            (user as any).userId = data.data.user._id;
            (user as any).role = data.data.user.role;
            return true;
          } else {
            return false; // লগইন ফেইল হবে
          }
        } catch (error) {
          console.error("Social login sync error:", error);
          return false;
        }
      }
      return true;
    },

    // ২. JWT টোকেনে ব্যাকএন্ডের ডাটা সেট করা
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async jwt({ token, user, account }) {
      if (user) {
        // signIn কলব্যাক থেকে আসা ডাটা টোকেনে সেট করুন
        token.userId = (user as any).userId; 
        token.accessToken = (user as any).accessToken;
        token.role = (user as any).role;
      }
      return token;
    },

    // ৩. সেশনে ডাটা পাঠানো (যাতে ক্লায়েন্ট সাইডে পাওয়া যায়)
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).userId = token.userId;
        (session.user as any).role = token.role;
        // আপনি চাইলে ব্যাকএন্ডের accessToken ও সেশনে রাখতে পারেন
        // (session as any).accessToken = token.accessToken;
      }
      return session;
    },
  },
};