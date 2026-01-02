import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { jwtDecode } from "jwt-decode";

// Protected routes যেখানে login প্রয়োজন
const protectedRoutes = [
  "/checkout",
  "/order",
  "/payment",
  "/order-confirmation",
];

// Admin only routes
const adminRoutes = ["/admin"];

// Auth routes (login/register) - logged in user এদের দেখতে পাবে না
const authRoutes = ["/login", "/register"];

interface DecodedToken {
  userId?: string;
  email?: string;
  role?: string;
  exp?: number;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Static files এবং API routes skip করা
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check NextAuth session token
  const nextAuthToken = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Check manual login cookie (accessToken)
  const accessToken = request.cookies.get("accessToken")?.value;

  let isLoggedIn = false;
  let userRole: string | undefined;

  // NextAuth session check
  if (nextAuthToken) {
    isLoggedIn = true;
    userRole = (nextAuthToken as { role?: string }).role;
  }

  // Manual login cookie check
  if (accessToken) {
    try {
      const decoded: DecodedToken = jwtDecode(accessToken);
      // Check if token is expired
      if (decoded.exp && decoded.exp * 1000 > Date.now()) {
        isLoggedIn = true;
        userRole = decoded.role;
      }
    } catch (error) {
      console.error("Token decode error:", error);
    }
  }

  // ============ Admin Route Protection ============
  // Admin routes শুধুমাত্র admin role এর জন্য accessible
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  if (isAdminRoute) {
    if (!isLoggedIn) {
      // Not logged in - redirect to login with callback URL
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (userRole !== "admin") {
      // Logged in but not admin - redirect to home
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // ============ Protected Route Handling ============
  // Login প্রয়োজন এমন routes
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !isLoggedIn) {
    // Save the current URL as callback URL
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ============ Auth Routes Handling ============
  // Logged in users shouldn't access login/register pages
  const isAuthRoute = authRoutes.some((route) => pathname === route);

  if (isAuthRoute && isLoggedIn) {
    // If there's a callback URL in query params, redirect there
    const callbackUrl = request.nextUrl.searchParams.get("callbackUrl");
    if (callbackUrl) {
      return NextResponse.redirect(new URL(callbackUrl, request.url));
    }
    // Otherwise redirect to home
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
