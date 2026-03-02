'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

const AdminSidebar = () => {
    const pathname = usePathname();

    const links = [
        { name: 'Dashboard', href: '/admin', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { name: 'Noticias', href: '/admin/news', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
        { name: 'Eventos', href: '/admin/events', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { name: 'Usuarios', href: '/admin/users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
        { name: 'Academias Afiliadas', href: '/admin/academies', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
        { name: 'Rankings', href: '/admin/rankings', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    ];

    return (
        <aside className="w-72 bg-deep-black border-r border-white/5 flex flex-col h-full overflow-y-auto pt-8 px-5 group">
            {/* Logo Section */}
            <div className="mb-12 flex flex-col items-center">
                <Link href="/" className="relative block w-[160px] h-[75px] transition-transform duration-300 hover:scale-105 mb-4">
                    <Image
                        src="/assets/fecoka-logo-blanco.jpg"
                        alt="FECOKA"
                        fill
                        className="object-contain"
                        priority
                    />
                </Link>
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            </div>

            {/* Navigation Section */}
            <nav className="flex-1 flex flex-col gap-2 mt-4">
                <p className="text-[11px] font-black uppercase text-silver-accent/40 tracking-[0.25em] mb-4 ml-4">Administración</p>
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`flex items-center gap-4 px-5 py-4 rounded-[24px] transition-all duration-500 font-bold text-[13px] tracking-wide group/link ${isActive
                                ? 'bg-gradient-to-br from-crimson-red to-[#9e0c1a] text-white shadow-2xl shadow-crimson-red/30 scale-[1.02]'
                                : 'text-silver-accent/70 hover:text-white hover:bg-white/5 active:scale-95'
                                }`}
                        >
                            <span className={`p-2.5 rounded-xl transition-all duration-300 ${isActive ? 'bg-white/20' : 'bg-[#1a2b3c] group-hover/link:bg-[#253950] group-hover/link:rotate-6'}`}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={link.icon} />
                                </svg>
                            </span>
                            <span className="max-w-[140px] leading-tight">{link.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer Section */}
            <div className="mt-auto mb-8 pt-6 border-t border-white/5 space-y-2">
                <Link
                    href="/"
                    className="flex items-center gap-4 px-4 py-3 rounded-2xl text-silver-accent/40 hover:text-white hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-widest"
                >
                    <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Ver Sitio
                </Link>
                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-crimson-red/70 hover:text-white hover:bg-crimson-red transition-all text-xs font-black uppercase tracking-widest group/logout"
                >
                    <svg className="w-4 h-4 transition-transform group-hover/logout:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Salir
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
