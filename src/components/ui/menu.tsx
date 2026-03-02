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
    className?: string;
}

// 3. Define Animation Variants
const sidebarVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
        },
    },
} as const;

const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            type: 'spring',
            stiffness: 100,
            damping: 15,
        },
    },
} as const;

// 4. Create the Component
export const UserProfileSidebar = React.forwardRef<HTMLDivElement, UserProfileSidebarProps>(
    ({ user, navItems, activeHref, logoutItem, className }, ref) => {
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

                    <motion.div variants={itemVariants} className="flex items-center space-x-4 relative z-10">
                        {user.avatarUrl ? (
                            <img
                                src={user.avatarUrl}
                                alt={`${user.name}'s avatar`}
                                className="h-16 w-16 rounded-full object-cover border-2 border-crimson-red shadow-lg"
                            />
                        ) : (
                            <div className="h-16 w-16 rounded-full bg-crimson-red flex items-center justify-center text-white font-black text-2xl font-outfit shadow-lg">
                                {user.name.charAt(0)}
                            </div>
                        )}
                        <div className="flex flex-col truncate text-left">
                            <span className="font-black text-xl font-outfit tracking-tight leading-tight">{user.name}</span>
                            <span className="text-[10px] text-white/60 font-bold uppercase tracking-widest truncate mt-1">{user.email}</span>
                        </div>
                    </motion.div>
                </div>

                {/* Navigation Links - Scrollable Container */}
                <nav className="flex-1 overflow-y-auto custom-scrollbar pt-6 pb-4 px-4 space-y-1.5" role="navigation">
                    {navItems.map((item, index) => {
                        const isActive = activeHref === item.href;
                        return (
                            <React.Fragment key={index}>
                                {item.isSeparator && <motion.div variants={itemVariants} className="h-px bg-silver-accent/50 my-4 mx-4" />}
                                <motion.div variants={itemVariants}>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "group flex items-center rounded-xl px-4 py-3.5 transition-all duration-300 active:scale-95",
                                            isActive
                                                ? "bg-white text-crimson-red shadow-sm border border-silver-accent/50"
                                                : "text-midnight-blue hover:bg-white/60 hover:text-crimson-red"
                                        )}
                                    >
                                        <div className={cn(
                                            "mr-4 h-5.5 w-5.5 transition-colors duration-300",
                                            isActive ? "text-crimson-red" : "text-steel-gray group-hover:text-crimson-red"
                                        )}>
                                            {item.icon}
                                        </div>
                                        <span className={cn(
                                            "font-extrabold uppercase tracking-wider text-[14px] transition-colors duration-300",
                                            isActive ? "text-midnight-blue" : "text-midnight-blue group-hover:text-crimson-red"
                                        )}>
                                            {item.label}
                                        </span>
                                        <ChevronRight className={cn(
                                            "ml-auto h-4 w-4 transition-all duration-300",
                                            isActive
                                                ? "opacity-100 translate-x-0"
                                                : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
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
