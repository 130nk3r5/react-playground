import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isSeed = nextUrl.pathname.startsWith('/seed');
      if (isOnDashboard || isSeed) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard/challenge/1', nextUrl));
      }
      return true;
    },
    async session({ session, token, user }) {
      // If using JWT, you may need to get id from token.sub or token.id
      if (session.user && user?.id) {
        session.user.id = user.id;
      } else if (session.user && token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  providers: [
    Credentials({
      // The authorize logic is provided in auth.ts
    }),
  ], // Add providers with an empty array for now
} satisfies NextAuthConfig;