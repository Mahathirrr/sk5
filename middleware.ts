import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Refresh session if expired
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protected routes that require authentication
  const protectedRoutes = [
    "/instructor",
    "/courses/enrolled",
    "/profile",
    "/certificates",
  ];

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route),
  );

  if (isProtectedRoute && !session) {
    const redirectUrl = new URL("/auth/signin", req.url);
    redirectUrl.searchParams.set("redirectTo", req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Instructor routes protection
  if (
    req.nextUrl.pathname.startsWith("/instructor") &&
    session?.user?.user_metadata?.role !== "instructor"
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return res;
}
