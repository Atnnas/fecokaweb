// 1. Import Dependencies
import * as React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// 2. Define Prop Types
export interface NavItem {
    icon: React.ReactNode;
    label: string;
    href: string;
    isSeparator?: boolean; // Optional separator for grouping items
}

export interface UserProfile {
    name: string;
    email: string;
    avatarUrl: string;
    role?: string;
}

interface UserProfileSidebarProps {
    user: UserProfile;
    navItems: NavItem[];
    activeHref?: string;
    logoutItem: {
        icon: React.ReactNode;
        label: string;
        onClick: () => void;
    };
    onMenuItemClick?: () => void;
    className?: string;
}

// 3. Define Animation Variants
const sidebarVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            delayChildren: 0.2, // Small delay so the sidebar background slides in first
            staggerChildren: 0.1, // More noticeable waterfall stagger effect
        },
    },
} as const;

const itemVariants = {
    hidden: {
        opacity: 0,
        y: 40,        // Come from below
        rotate: 5     // Start with a slight angle (like the GSAP example)
    },
    visible: {
        opacity: 1,
        y: 0,
        rotate: 0,
        transition: {
            type: 'spring',
            stiffness: 110,
            damping: 14,
            mass: 0.8
        },
    },
} as const;

// 4. Create the Component
export const UserProfileSidebar = React.forwardRef<HTMLDivElement, UserProfileSidebarProps>(
    ({ user, navItems, activeHref, logoutItem, onMenuItemClick, className }, ref) => {
        return (
            <motion.aside
                ref={ref}
                className={cn(
                    'flex h-full w-full max-w-xs flex-col bg-mist-white shadow-premium border-r border-silver-accent font-sans overflow-hidden',
                    className
                )}
                initial="hidden"
                animate="visible"
                variants={sidebarVariants}
                aria-label="User Profile Menu"
            >
                {/* User Info Header - BRANDED DARK SECTION */}
                <div className="bg-midnight-blue p-8 pt-12 text-white relative overflow-hidden flex-shrink-0">
                    {/* Subtle background pattern/logo */}
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 opacity-10 pointer-events-none">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                    </div>

                    <motion.div variants={itemVariants} className="flex items-center space-x-3 relative z-10">
                        {user.avatarUrl ? (
                            <img
                                src={user.avatarUrl}
                                alt={`${user.name}'s avatar`}
                                className="h-11 w-11 rounded-full object-cover border-2 border-crimson-red shadow-md"
                            />
                        ) : (
                            <div className="h-11 w-11 rounded-full bg-crimson-red flex items-center justify-center text-white font-bold text-lg font-outfit shadow-md">
                                {user.name.charAt(0)}
                            </div>
                        )}
                        <div className="flex flex-col truncate text-left justify-center mt-1">
                            <span className="font-bold text-lg font-outfit tracking-tight leading-none">{user.name}</span>
                            {user.role && (
                                <span className={cn(
                                    "text-[9px] font-black uppercase tracking-[0.2em] w-fit mt-1.5 px-2 py-0.5 rounded-full shadow-sm",
                                    user.role === 'admin' ? "bg-crimson-red text-white" : "bg-white/20 text-white/90"
                                )}>
                                    {user.role === 'admin' ? 'Administrador' : user.role === 'edit' ? 'Editor' : 'Usuario'}
                                </span>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Navigation Links - Scrollable Container */}
                <nav className="flex-1 overflow-y-auto custom-scrollbar pt-8 pb-6 px-0 flex flex-col gap-3" role="navigation">
                    {navItems.map((item, index) => {
                        const isActive = activeHref === item.href;
                        return (
                            <React.Fragment key={index}>
                                {item.isSeparator && <motion.div variants={itemVariants} className="h-px bg-silver-accent/30 my-2 mx-8" />}
                                <motion.div variants={itemVariants}>
                                    <Link
                                        href={item.href}
                                        onClick={onMenuItemClick}
                                        className={cn(
                                            "mx-5 group flex items-center px-6 py-4 rounded-2xl transition-all duration-300 active:scale-95",
                                            isActive
                                                ? "bg-white text-crimson-red shadow-md border border-silver-accent/30"
                                                : "bg-white/40 text-midnight-blue border border-white/50 shadow-sm hover:bg-white/80 hover:text-crimson-red hover:shadow-md"
                                        )}
                                    >
                                        <div className={cn(
                                            "mr-5 h-6 w-6 transition-colors duration-300 flex items-center justify-center",
                                            isActive ? "text-crimson-red" : "text-steel-gray group-hover:text-crimson-red"
                                        )}>
                                            {item.icon}
                                        </div>
                                        <span className={cn(
                                            "font-semibold uppercase tracking-[0.15em] text-[13.5px] transition-colors duration-300",
                                            isActive ? "text-midnight-blue font-black" : "text-midnight-blue/90 group-hover:text-crimson-red"
                                        )}>
                                            {item.label}
                                        </span>
                                        <ChevronRight className={cn(
                                            "ml-auto h-5 w-5 transition-all duration-300",
                                            isActive
                                                ? "text-crimson-red opacity-100 translate-x-0"
                                                : "text-steel-gray/50 opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0"
                                        )} />
                                    </Link>
                                </motion.div>
                            </React.Fragment>
                        );
                    })}
                </nav>

                {/* Logout Button */}
                <motion.div variants={itemVariants} className="mt-auto p-4 border-t border-silver-accent/50 bg-white/50 flex-shrink-0">
                    <button
                        onClick={logoutItem.onClick}
                        className="group flex w-full items-center rounded-xl px-4 py-4 text-[12px] font-black uppercase tracking-[0.2em] text-crimson-red transition-all duration-300 hover:bg-crimson-red hover:text-white shadow-sm active:scale-95 border border-crimson-red/10"
                    >
                        <span className="mr-4 h-5 w-5 transition-transform duration-300 group-hover:rotate-12">{logoutItem.icon}</span>
                        <span>{logoutItem.label}</span>
                    </button>
                </motion.div>

                {/* Branding Watermark */}
                <div className="px-8 pb-4 pt-2 text-center flex-shrink-0">
                    <p className="text-[8px] font-black uppercase tracking-[0.4em] text-silver-accent">
                        FECOKA Costa Rica
                    </p>
                </div>
            </motion.aside>
        );
    }
);

UserProfileSidebar.displayName = 'UserProfileSidebar';
