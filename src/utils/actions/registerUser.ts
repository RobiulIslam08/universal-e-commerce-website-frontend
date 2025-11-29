import { RegisterFormValues } from "@/app/(main)/register/page"

export const registerUser = async (data:RegisterFormValues) => {
	const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`, {
		method:"POST",
		headers:{
			"Content-Type": "application/json",
		},
		body:JSON.stringify(data),
		cache:"no-store",
	})
	const userInfo = await res.json()
	return userInfo
}