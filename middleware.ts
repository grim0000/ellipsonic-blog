import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;

  const isAuthPage = nextUrl.pathname.startsWith("/auth");
  const isDashboardPage = nextUrl.pathname.startsWith("/dashboard");
  const isNewPostPage = nextUrl.pathname.startsWith("/posts/new");
  const isAdminPage = nextUrl.pathname.startsWith("/admin");

  if (isAuthPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
    return null;
  }

  if (isDashboardPage || isNewPostPage) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/auth/login", nextUrl));
    }
  }

  if (isAdminPage) {
    const role = (req.auth?.user as any)?.role;
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
  }

  return null;
});

export const config = {
  matcher: ["/dashboard/:path*", "/posts/new", "/admin/:path*", "/auth/:path*"],
};
