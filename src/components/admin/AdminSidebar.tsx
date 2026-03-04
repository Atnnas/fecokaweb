'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
    Menu,
    X,
    LayoutDashboard,
    Newspaper,
    Calendar,
    Users,
    School,
    Trophy,
    ArrowLeft,
    LogOut,
    Shield
} from 'lucide-react';
import { UserProfileSidebar, NavItem, UserProfile } from '@/components/ui/menu';

const AdminSidebar = () => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { data: session } = useSession();

    // Handle hydration symmetry
    useEffect(() => {
        setMounted(true);
    }, []);

    // Close sidebar on path change in mobile
    useEffect(() => {
        if (mounted) {
            setIsOpen(false);
        }
    }, [pathname, mounted]);

    const adminLinks = [
        { name: 'Dashboard', href: '/admin', icon: <LayoutDashboard className="h-full w-full" /> },
        { name: 'Noticias', href: '/admin/news', icon: <Newspaper className="h-full w-full" /> },
        { name: 'Eventos', href: '/admin/events', icon: <Calendar className="h-full w-full" /> },
        { name: 'Usuarios', href: '/admin/users', icon: <Users className="h-full w-full" /> },
        { name: 'Academias Afiliadas', href: '/admin/academies', icon: <School className="h-full w-full" /> },
        { name: 'Rankings', href: '/admin/rankings', icon: <Trophy className="h-full w-full" /> },
        { name: 'Patrocinadores', href: '/admin/sponsors', icon: <Shield className="h-full w-full" /> },
    ];

    const userProfile: UserProfile = {
        name: session?.user?.name || 'Administrador',
        email: session?.user?.email || '',
        avatarUrl: session?.user?.image || '',
        role: session?.user?.role as string || 'admin',
    };

    const navItems: NavItem[] = [
        ...adminLinks.map(link => ({
            label: link.name,
            href: link.href,
            icon: link.icon
        })),
        {
            label: 'Volver al Sitio',
            href: '/',
            icon: <ArrowLeft className="h-full w-full" />,
            isSeparator: true
        }
    ];

    const logoutItem = {
        label: 'Cerrar Sesión',
        icon: <LogOut className="h-full w-full" />,
        onClick: () => {
            setIsOpen(false);
            signOut({ callbackUrl: '/' });
        }
    };

    return (
        <>
            {/* Mobile Header (Only visible on small screens) */}
            <div className="md:hidden flex-none w-full h-16 bg-deep-black z-[90] flex items-center justify-between px-6 border-b border-white/5 shadow-md">
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 -ml-2 text-white focus:outline-none focus:ring-2 focus:ring-crimson-red rounded-lg transition-transform active:scale-95"
                    aria-label="Abrir Menú"
                >
                    <Menu className="w-8 h-8" strokeWidth={2.5} />
                </button>

                <Link href="/admin" className="relative block h-10 w-[130px] ml-auto">
                    <Image
                        src="/assets/fecoka-logo-blanco.jpg"
                        alt="FECOKA"
                        fill
                        className="object-contain"
                        priority
                    />
                </Link>
            </div>

            {/* Mobile Premium Sidebar Interface */}
            {mounted && (
                <div
                    className={`fixed inset-0 z-[110] md:hidden transition-all duration-500 ${isOpen ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'}`}
                >
                    {/* Backdrop Blur Overlay */}
                    <div
                        className={`absolute inset-0 bg-midnight-blue/60 backdrop-blur-md transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Sliding Sidebar */}
                    <div className={`absolute top-0 left-0 h-[100dvh] w-[85%] max-w-xs transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                        <UserProfileSidebar
                            user={userProfile}
                            navItems={navItems}
                            activeHref={pathname}
                            logoutItem={logoutItem}
                            onMenuItemClick={() => setIsOpen(false)}
                            className="h-full rounded-none border-0 shadow-none"
                        />

                        {/* Close Button Inside Sidebar Area */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-10 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 text-white z-[120] active:scale-90"
                            aria-label="Cerrar Menú"
                        >
                            <X className="w-5 h-5" strokeWidth={3} />
                        </button>
                    </div>
                </div>
            )}

            {/* Desktop Sidebar (Remains consistent with current admin design) */}
            <aside className="hidden md:flex w-72 bg-deep-black border-r border-white/5 flex-col h-full overflow-y-auto pt-8 px-5 group">
                {/* Logo Section */}
                <div className="mb-12 flex flex-col items-center text-center">
                    <Link href="/" className="relative block w-[160px] h-[75px] transition-transform duration-300 hover:scale-105 mb-4">
                        <Image
                            src="/assets/fecoka-logo-blanco.jpg"
                            alt="FECOKA"
                            fill
                            className="object-contain"
                            priority
                        />
                    </Link>
                    <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4"></div>
                    <p className="text-[10px] font-black uppercase text-silver-accent/40 tracking-[0.3em]">Centro de Operaciones</p>
                </div>

                {/* Navigation Section */}
                <nav className="flex-1 flex flex-col gap-2 mt-4">
                    {adminLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                style={{ perspective: '800px' }}
                                className="block group/link"
                            >
                                <div className={`flex items-center gap-4 px-5 py-4 rounded-[24px] transition-all duration-500 font-bold text-[13px] tracking-wide transform-gpu active:scale-[0.92] active:rotate-x-12 active:-translate-y-1 ${isActive
                                    ? 'bg-gradient-to-br from-crimson-red to-[#9e0c1a] text-white shadow-2xl shadow-crimson-red/30 scale-[1.02]'
                                    : 'text-silver-accent/70 hover:text-white hover:bg-white/5 shadow-sm'
                                    }`}>
                                    <span className={`w-10 h-10 rounded-xl transition-all duration-300 flex items-center justify-center ${isActive ? 'bg-white/20' : 'bg-[#1a2b3c] group-hover/link:bg-[#253950] group-hover/link:rotate-6'}`}>
                                        <div className="w-5 h-5">
                                            {link.icon}
                                        </div>
                                    </span>
                                    <span className="max-w-[140px] leading-tight uppercase tracking-widest text-[11px] font-black">{link.name}</span>
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Section */}
                <div className="mt-auto mb-8 pt-6 border-t border-white/5 space-y-2">
                    <Link
                        href="/"
                        className="flex items-center gap-4 px-4 py-3 rounded-2xl text-silver-accent/40 hover:text-white hover:bg-white/5 transition-all text-[10px] font-black uppercase tracking-widest"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Ver Sitio
                    </Link>
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-crimson-red/70 hover:text-white hover:bg-crimson-red transition-all text-[10px] font-black uppercase tracking-widest group/logout"
                    >
                        <LogOut className="w-4 h-4 transition-transform group-hover/logout:-translate-x-1" />
                        Salir
                    </button>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;
