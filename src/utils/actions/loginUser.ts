// import { LoginFormValues } from "@/app/(main)/login/page"

import { LoginFormValues } from "@/app/(main)/login/page";


// export const loginUser = async (data:LoginFormValues) => {
// 	const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
// 		method:"POST",
// 		headers:{
// 			"Content-Type": "application/json",
// 		},
// 		body:JSON.stringify(data),
// 		cache:"no-store",
// 	})
// 	const userInfo = await res.json()
// 	return userInfo
// }
// utils/actions/loginUser.ts



export const loginUser = async (data: LoginFormValues) => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  if (!backendUrl) {
    throw new Error("Backend URL is not defined in environment variables");
  }

  const res = await fetch(`${backendUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    cache: "no-store",
  });

  const userInfo = await res.json();
  return userInfo;
};