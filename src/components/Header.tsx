"use client"

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
    Home,
    Newspaper,
    School,
    Trophy,
    Info,
    Calendar,
    LogOut,
    Shield,
    Tags,
} from 'lucide-react';
import { NavItem, UserProfile } from './ui/menu';
import { canEdit } from '@/lib/auth-utils';
import DesktopNav from './header/DesktopNav';
import MobileNav from './header/MobileNav';

const menuItems = [
    { label: "Inicio", href: "/", icon: <Home className="h-full w-full" /> },
    { label: "Noticias", href: "/news", icon: <Newspaper className="h-full w-full" /> },
    { label: "Eventos", href: "/events", icon: <Calendar className="h-full w-full" /> },
    { label: "Rankings", href: "/rankings", icon: <Trophy className="h-full w-full" /> },
    { label: "Academias", href: "/academies", icon: <School className="h-full w-full" /> },
    { label: "Categorías", href: "/categories", icon: <Tags className="h-full w-full" /> },
    { label: "Federación", href: "/about", icon: <Info className="h-full w-full" /> },
];

export default function Header({ onLoginClick }: { onLoginClick?: () => void }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const pathname = usePathname();
    const { data: session } = useSession();

    // Handle hydration symmetry
    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent scroll when mobile menu is open
    useEffect(() => {
        if (mounted) {
            document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
        }
    }, [isMenuOpen, mounted]);

    // Smart scroll hide/show
    useEffect(() => {
        const controlNavbar = () => {
            if (typeof window !== 'undefined') {
                // If scrolling down and past the header height, hide it
                if (window.scrollY > lastScrollY && window.scrollY > 100) {
                    setIsVisible(false);
                } else if (window.scrollY < lastScrollY) {
                    // If scrolling up, show it
                    setIsVisible(true);
                }
                setLastScrollY(window.scrollY);
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', controlNavbar);
            return () => window.removeEventListener('scroll', controlNavbar);
        }
    }, [lastScrollY]);

    const userProfile: UserProfile = {
        name: session?.user?.name || 'Invitado',
        email: session?.user?.email || 'Inicia sesión para más funciones',
        avatarUrl: session?.user?.image || '',
        role: session?.user?.role as string | undefined,
    };

    const navItems: NavItem[] = menuItems.map(item => ({
        label: item.label.replace('\n', ' '),
        href: item.href,
        icon: item.icon
    }));

    if (canEdit(session)) {
        navItems.push({
            label: 'Administración',
            href: '/admin',
            icon: <Shield className="h-full w-full" />,
            isSeparator: true
        });
    }

    const logoutItem = {
        label: session ? 'Cerrar Sesión' : 'Iniciar Sesión',
        icon: session ? <LogOut className="h-full w-full" /> : <Shield className="h-full w-full" />,
        onClick: () => {
            setIsMenuOpen(false);
            if (session) {
                signOut({ callbackUrl: '/' });
            } else if (onLoginClick) {
                onLoginClick();
            }
        }
    };

    const handleSignOut = () => {
        signOut({ callbackUrl: '/' });
    };

    const isHome = pathname === '/';

    return (
        <>
            {/* Automatic Dynamic Spacer for Non-Home Pages */}
            {!isHome && (
                <div
                    className="w-full h-20 lg:h-24 invisible pointer-events-none shrink-0"
                    aria-hidden="true"
                />
            )}

            <nav className={`fixed top-0 left-0 w-full z-[100] bg-white/95 backdrop-blur-2xl shadow-[0_4px_25px_rgba(0,27,72,0.06)] border-b border-slate-200/80 px-4 sm:px-6 2xl:px-8 h-20 lg:h-24 flex items-center transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
                {/* Official National Top Ribbon Accent */}
                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-midnight-blue via-crimson-red to-midnight-blue z-20" />

                <DesktopNav
                    menuItems={menuItems}
                    pathname={pathname}
                    session={session}
                    onSignOut={handleSignOut}
                    onLoginClick={onLoginClick}
                />

                <MobileNav
                    isMenuOpen={isMenuOpen}
                    setIsMenuOpen={setIsMenuOpen}
                    mounted={mounted}
                    userProfile={userProfile}
                    navItems={navItems}
                    pathname={pathname}
                    logoutItem={logoutItem}
                />
            </nav>
        </>
    );
}
