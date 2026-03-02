import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            /** The user's database ID. */
            id: string
            /** The user's role. */
            role: 'user' | 'edit' | 'admin'
        } & DefaultSession["user"]
    }

    interface User {
        role?: 'user' | 'edit' | 'admin'
    }
}

declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT {
        /** OpenID ID Token */
        id?: string
        role?: 'user' | 'edit' | 'admin'
    }
}
