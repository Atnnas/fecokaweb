import Google from "next-auth/providers/google"
import type { NextAuthConfig } from "next-auth"

// This configuration only contains parts that are compatible with the Edge runtime
export default {
    debug: true,
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            // Pass the role and ID from the JWT token to the client session object
            // This mapping is Edge-safe and required for middleware to see the role
            if (token && session.user) {
                (session.user as any).id = token.id as string;
                (session.user as any).role = token.role as string;
                (session.user as any).status = token.status as string;
            }
            return session;
        }
    }
} satisfies NextAuthConfig
