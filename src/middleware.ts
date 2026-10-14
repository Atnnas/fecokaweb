import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { ADMIN_EMAILS } from "./lib/constants"
import { checkRateLimit } from "./lib/rate-limiter"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const { nextUrl } = req
    const pathname = nextUrl.pathname

    // 1. Rate Limiting Protection for API routes
    if (pathname.startsWith('/api/')) {
        const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
                         req.headers.get('x-real-ip') ||
                         'anonymous';

        let limit = 120; // Default: 120 requests per minute
        if (pathname.startsWith('/api/upload')) {
            limit = 15; // 15 uploads per minute
        } else if (pathname.startsWith('/api/auth')) {
            limit = 40; // 40 auth attempts per minute
        }

        const rateCheck = checkRateLimit(`${clientIp}:${pathname.split('/')[2] || 'api'}`, limit, 60000);
        if (!rateCheck.success) {
            return Response.json(
                { error: 'Demasiadas solicitudes. Por favor intente más tarde.' },
                {
                    status: 429,
                    headers: {
                        'Retry-After': '60',
                        'X-RateLimit-Limit': String(limit),
                        'X-RateLimit-Remaining': '0',
                    },
                }
            );
        }
    }

    // 2. Strict Role-based access control for /admin and /api/admin
    const isAdminPage = pathname.startsWith('/admin')
    const isAdminApi = pathname.startsWith('/api/admin')

    if (isAdminPage || isAdminApi) {
        const user = req.auth?.user as any
        const userEmail = user?.email?.toLowerCase()
        const userRole = user?.role
        const userStatus = user?.status

        const isSuperAdmin = Boolean(userEmail && ADMIN_EMAILS.includes(userEmail))
        const isAuthorized = isLoggedIn && (isSuperAdmin || (userRole === 'admin' && userStatus === 'active'))

        if (!isAuthorized) {
            if (isAdminApi) {
                return Response.json({ error: 'Unauthorized: Admin access required' }, { status: 403 })
            }
            return Response.redirect(new URL('/', nextUrl))
        }
    }
})

export const config = {
    matcher: ["/admin/:path*", "/api/:path*"],
}
