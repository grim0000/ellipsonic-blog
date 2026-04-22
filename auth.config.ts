import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [], // We'll add providers in auth.ts to avoid bloat
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      
      if (isOnDashboard || isOnAdmin) {
        if (isLoggedIn) return true;
        return false; // Redirect to login
      }
      return true;
    },
    async session({ session, token }: any) {
      if (token?.role) {
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
  },
} satisfies NextAuthConfig;
