import NextAuth from "next-auth"
import authConfig from "./auth.config"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const { nextUrl } = req

    if (nextUrl.pathname.startsWith('/admin')) {
        if (!isLoggedIn) {
            return Response.redirect(new URL('/', nextUrl))
        }

        const user = req.auth?.user as any
        const userEmail = user?.email?.toLowerCase()
        const userRole = user?.role
        const userStatus = user?.status

        // Super-admin bypass for david's email to avoid lockout during transition
        const isSuperAdmin = userEmail === 'david.artavia.rodriguez@gmail.com'

        if (isLoggedIn && isSuperAdmin) {
            return // Allow super admin
        }

        if (!isLoggedIn || userRole !== 'admin' || userStatus !== 'active') {
            return Response.redirect(new URL('/', nextUrl))
        }
    }
})

export const config = {
    matcher: ["/admin/:path*"],
}
