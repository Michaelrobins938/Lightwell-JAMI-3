import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const PROTECTED_ROUTES = [
  "/chat",
  "/dashboard", 
  "/profile",
  "/settings",
  "/journal",
  "/meditation",
  "/goals",
  "/progress",
  "/assessments",
  "/community"
];

// Routes that should redirect authenticated users away
const PUBLIC_ONLY_ROUTES = [
  "/public",
  "/login",
  "/signup"
];

// Pro-only features (require PRO or ENTERPRISE plan)
const PRO_ROUTES = [
  "/api/chat/gpt4",
  "/api/chat/custom-instructions",
  "/api/chat/long-context",
  "/api/chat/priority"
];

// Enterprise-only features
const ENTERPRISE_ROUTES = [
  "/api/admin",
  "/api/team",
  "/api/sso",
  "/api/compliance"
];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  const { pathname } = req.nextUrl;

  // Check if user is authenticated
  const isAuthenticated = !!token;

  // If trying to access protected routes without auth, redirect to public
  if (!isAuthenticated && PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/public", req.url));
  }

  // If authenticated user tries to access public-only routes, redirect based on plan
  if (isAuthenticated && PUBLIC_ONLY_ROUTES.some(route => pathname.startsWith(route))) {
    // We'll redirect to chat for now, the plan-based redirect will happen in the component
    return NextResponse.redirect(new URL("/chat", req.url));
  }

  // Root route is now the new Lightwell homepage - accessible to all users
  // if (!isAuthenticated && pathname === "/") {
  //   return NextResponse.redirect(new URL("/public", req.url));
  // }

  // For API routes, we'll let the API handlers check plan requirements
  // This allows for more granular control and better error messages
  if (pathname.startsWith("/api/")) {
    // Let the API route handle plan checking
    return NextResponse.next();
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
