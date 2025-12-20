"use server";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoginFormValues, RegisterFormValues } from "@/types/user";

import { jwtDecode } from "jwt-decode";
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
    console.log(result);
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

export const getCurrentUser = async () => {
  const accessToken = (await cookies()).get("accessToken")?.value;
  let decodedData = null;
  if (accessToken) {
    decodedData = await jwtDecode(accessToken);
    return decodedData;
  } else {
    return null;
  }
};
