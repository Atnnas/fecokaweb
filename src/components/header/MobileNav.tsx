"use client"

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { UserProfileSidebar, NavItem, UserProfile } from '../ui/menu';

interface MobileNavProps {
    isMenuOpen: boolean;
    setIsMenuOpen: (open: boolean) => void;
    mounted: boolean;
    userProfile: UserProfile;
    navItems: NavItem[];
    pathname: string;
    logoutItem: any;
}

export default function MobileNav({
    isMenuOpen,
    setIsMenuOpen,
    mounted,
    userProfile,
    navItems,
    pathname,
    logoutItem
}: MobileNavProps) {
    return (
        <>
            {/* Mobile Header Bar */}
            <div className="flex md:hidden items-center justify-between w-full h-full">
                <button
                    onClick={() => setIsMenuOpen(true)}
                    className="p-2 -ml-2 text-midnight-blue focus:outline-none focus:ring-2 focus:ring-crimson-red rounded-lg transition-transform active:scale-95 z-20"
                    aria-label="Abrir Menú"
                >
                    <Menu className="w-8 h-8" strokeWidth={2.5} />
                </button>

                {/* Clean Logo Centered on Mobile */}
                <Link href="/" className="relative block h-10 w-[130px] ml-auto">
                    <Image
                        src="/assets/fecoka-logo-blanco-transparente.png"
                        alt="FECOKA"
                        fill
                        className="object-contain"
                        priority
                    />
                </Link>
            </div>

            {/* Premium Sidebar Overlay */}
            {mounted && (
                <div
                    className={`fixed inset-0 z-[110] md:hidden transition-all duration-500 ${isMenuOpen ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'}`}
                >
                    {/* Backdrop Blur Overlay */}
                    <div
                        className={`absolute inset-0 bg-midnight-blue/60 backdrop-blur-md transition-opacity duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
                        onClick={() => setIsMenuOpen(false)}
                    />

                    {/* Sliding Sidebar */}
                    <div className={`absolute top-0 left-0 h-[100dvh] w-[85%] max-w-xs transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-2xl ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                        <UserProfileSidebar
                            user={userProfile}
                            navItems={navItems}
                            activeHref={pathname}
                            logoutItem={logoutItem}
                            onMenuItemClick={() => setIsMenuOpen(false)}
                            className="h-full rounded-none border-0 shadow-none"
                        />

                        {/* Close Button Inside Sidebar Area */}
                        <button
                            onClick={() => setIsMenuOpen(false)}
                            className="absolute top-10 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 text-white z-[120] active:scale-90"
                            aria-label="Cerrar Menú"
                        >
                            <X className="w-5 h-5" strokeWidth={3} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
