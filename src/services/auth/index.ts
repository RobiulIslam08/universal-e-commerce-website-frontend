/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoginFormValues, RegisterFormValues } from "@/types/user";
import { authOptions } from "@/utils/authOptions";

import { jwtDecode } from "jwt-decode";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";

export const registerUser = async (userData: RegisterFormValues) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }
    );

    if (!res.ok) {
      console.error(`Registration failed: ${res.status} ${res.statusText}`);
      return { success: false, message: "Registration failed" };
    }

    const result = await res.json();
    const storeCookies = await cookies();
 
    if (result.success) {
      storeCookies.set("accessToken", result.data.accessToken);
    }
    return result;
  } catch (error: any) {
    return Error(error);
  }
};
export const loginUser = async (userData: LoginFormValues) => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  if (!backendUrl) {
    throw new Error("Backend URL is not defined in environment variables");
  }
  try {
    const res = await fetch(`${backendUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      console.error(`Login failed: ${res.status} ${res.statusText}`);
      return { success: false, message: "Login failed" };
    }

    const result = await res.json();
    const storeCookies = await cookies();
    console.log(result);
    if (result.success) {
      storeCookies.set("accessToken", result.data.accessToken);
    }
    return result;
  } catch (error: any) {
    return Error(error);
  }
};

// export const getCurrentUser = async () => {
//   const accessToken = (await cookies()).get("accessToken")?.value;
//   let decodedData = null;
//   if (accessToken) {
//     decodedData = await jwtDecode(accessToken);
//     console.log(decodedData)
//     return decodedData;
//   } else {
//     return null;
//   }
// };




 // ⚠️ আপনার authOptions এর পাথ ঠিক করুন

// টাইপ ডেফিনিশন (আপনার প্রয়োজন অনুযায়ী বাড়াতে পারেন)
interface DecodedUser {
  userId: string;
  email: string;
  name: string;
  role: string;
  image?: string;
}

// export const getCurrentUser = async (): Promise<DecodedUser | null> => {
//   // ✅ ১. প্রথমে NextAuth (Google) সেশন চেক করা
//   const session = await getServerSession(authOptions);

//   if (session?.user) {
//     // NextAuth সেশন থেকে ডাটা রিটার্ন করা
//     // (আমরা আগের ধাপে callbacks এ userId সেট করেছিলাম, সেটা এখানে পাবো)
//     return {
//       userId: (session.user as any).id || (session.user as any).userId || (session.user as any)._id,
//       email: session.user.email!,
//       name: session.user.name!,
//       role: (session.user as any).role || "user", // ডিফল্ট রোল
//       image: session.user.image || "",
//     };
//   }

//   // ✅ ২. যদি NextAuth সেশন না থাকে, তাহলে Manual Login (accessToken) চেক করা
//   const cookieStore = await cookies();
//   const accessToken = cookieStore.get("accessToken")?.value;

//   if (accessToken) {
//     const decodedData: any = jwtDecode(accessToken);
    
//     return {
//       userId: decodedData.userId || decodedData._id || decodedData.id,
//       email: decodedData.email,
//       name: decodedData.name || decodedData.userName, // টোকেনে যে নামে সেভ করেছেন
//       role: decodedData.role,
//       image: decodedData.image || "",
//     };
//   }

//   // ৩. কোনো লগইন পাওয়া না গেলে null
//   return null;
// };


export const getCurrentUser = async (): Promise<DecodedUser | null> => {
  // ১. Google NextAuth সেশন চেক করা
  const session = await getServerSession(authOptions);

  if (session?.user) {
    return {
      // এখানে এখন MongoDB এর আসল _id আসবে যা আমরা authOptions এ সেট করেছি
      userId: (session.user as any).userId, 
      email: session.user.email!,
      name: session.user.name!,
      role: (session.user as any).role || "user",
      image: session.user.image || "",
    };
  }

  // ২. Manual Login কুকি চেক করা
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (accessToken) {
    try {
      const decodedData: any = jwtDecode(accessToken);
      return {
        userId: decodedData.userId || decodedData._id,
        email: decodedData.email,
        name: decodedData.name,
        role: decodedData.role,
        image: "",
      };
    } catch (error) {
      return null;
    }
  }

  return null;
};
export const logoutUser = async () => {
  // কুকি স্টোর অ্যাক্সেস করা
  const cookieStore = await cookies();
  
  // 'accessToken' নামের কুকি ডিলিট করা
  cookieStore.delete("accessToken");
  
  return { success: true, message: "Logged out successfully" };
};