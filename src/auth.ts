import NextAuth from "next-auth"
import authConfig from "./auth.config"
import dbConnect from "@/lib/db"
import User from "@/models/User"
import { isSuperAdmin } from "@/lib/auth-utils"

export const { handlers, auth, signIn, signOut } = NextAuth({
    trustHost: true,
    ...authConfig,
    secret: process.env.AUTH_SECRET,
    callbacks: {
        ...authConfig.callbacks,
        async signIn({ user, profile }) {
            // We only use the Google provider, so the user is guaranteed to have a Google account.
            try {
                await dbConnect();

                // Find existing user or create a new one with 'user' role by default
                let dbUser = await User.findOne({ email: user.email });
                const isSystemAdmin = isSuperAdmin(user.email);

                if (!dbUser) {
                    dbUser = await User.create({
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        role: isSystemAdmin ? 'admin' : 'user',
                        status: isSystemAdmin ? 'active' : 'pending',
                    });
                } else {
                    // Update last login
                    dbUser.lastLoginAt = new Date();
                    dbUser.name = user.name;
                    dbUser.image = user.image;

                    // Auto-admin for the main account
                    if (isSystemAdmin) {
                        dbUser.role = 'admin';
                        dbUser.status = 'active';
                    }

                    await dbUser.save();
                }

                return true;
            } catch (error: any) {
                console.error("====== VERIFICATION ERROR IN SIGN-IN ======");
                console.error("Error connecting to DB or creating user:", error?.message || error);
                console.error("Full error object:", error);
                console.error("===========================================");
                return false; // Prevent login if DB fails
            }
        },
        async jwt({ token, user, trigger }) {
            // When the user logs in, fetch their role from the DB and attach to token
            if (user) {
                await dbConnect();
                const dbUser = await User.findOne({ email: user.email });
                if (dbUser) {
                    token.id = dbUser._id.toString();
                    token.role = dbUser.role;
                    token.status = dbUser.status;
                }
            }
            return token;
        },
    },
    pages: {
        signIn: "/auth/signin", // Custom sign-in page/modal
    },
})
