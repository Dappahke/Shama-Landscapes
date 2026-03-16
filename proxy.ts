import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Routes to protect
const protectedRoutes = ["/admin", "/admin/projects", "/admin/chat", "/admin/newsletter"];

// This is the required function for Next.js Proxy
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only run for protected routes
  if (!protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Get Supabase session token from cookie
  const token = req.cookies.get("sb-access-token")?.value;

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("error", "unauthorized");
    return NextResponse.redirect(loginUrl);
  }

  // Verify token with Supabase
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("error", "unauthorized");
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated, allow access
  return NextResponse.next();
}

// Configure which paths this Proxy applies to
export const config = {
  matcher: ["/admin/:path*"],
};