import { ADMIN_EMAILS, ROLES } from './constants';

/**
 * Checks if a user session has administrative privileges
 */
export function isAdmin(session: any): boolean {
    if (!session?.user) return false;

    // Check by role
    if (session.user.role === ROLES.ADMIN) return true;

    // Check by email (super-admin logic)
    if (session.user.email && ADMIN_EMAILS.includes(session.user.email.toLowerCase())) {
        return true;
    }

    return false;
}

/**
 * Checks if a user session has editor or admin privileges
 */
export function canEdit(session: any): boolean {
    if (!session?.user) return false;

    const role = session.user.role;
    return role === ROLES.ADMIN || role === ROLES.EDIT || isAdmin(session);
}

/**
 * Helper to determine if an email belongs to a super administrator
 */
export function isSuperAdmin(email?: string | null): boolean {
    if (!email) return false;
    return ADMIN_EMAILS.includes(email.toLowerCase());
}
