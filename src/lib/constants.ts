/**
 * Global constants for the application
 */

// List of super administrator emails
export const ADMIN_EMAILS = [
    'david.artavia.rodriguez@gmail.com',
    // Add more admin emails here
];

// User roles
export const ROLES = {
    ADMIN: 'admin',
    EDIT: 'edit',
    USER: 'user',
} as const;

// User statuses
export const STATUSES = {
    ACTIVE: 'active',
    PENDING: 'pending',
    INACTIVE: 'inactive',
} as const;
