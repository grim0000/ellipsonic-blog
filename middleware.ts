import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;

  const isAuthPage = nextUrl.pathname.startsWith("/auth");
  const isAdminPage = nextUrl.pathname.startsWith("/admin");

  if (isAuthPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
    return undefined;
  }

  if (isAdminPage) {
    const role = (req.auth?.user as any)?.role;
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
  }

  return undefined;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
