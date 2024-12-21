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
    const redirectUrl = new URL("/auth/login", req.url);
    redirectUrl.searchParams.set("redirectTo", req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Instructor routes protection
  if (req.nextUrl.pathname.startsWith("/instructor")) {
    // Get user role from database
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", session?.user?.id)
      .single();

    if (!userData || userData.role !== "instructor") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return res;
}

// Specify which routes should trigger this middleware
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};
