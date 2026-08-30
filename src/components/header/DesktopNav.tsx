"use client"

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface MenuItem {
    label: string;
    href: string;
}

interface DesktopNavProps {
    menuItems: MenuItem[];
    pathname: string;
    session: any;
    onSignOut: () => void;
    onLoginClick?: () => void;
}

export default function DesktopNav({ menuItems, pathname, session, onSignOut, onLoginClick }: DesktopNavProps) {
    return (
        <div className="hidden xl:flex items-center justify-between w-full max-w-7xl mx-auto h-full gap-4">
            {/* Official FECOKA Logo */}
            <div className="flex items-center shrink-0">
                <Link href="/" className="relative block w-36 h-11 2xl:w-44 2xl:h-12 transition-transform duration-300 hover:scale-105">
                    <Image
                        src="/assets/fecoka-logo.jpg"
                        alt="FECOKA"
                        fill
                        className="object-contain rounded-lg"
                        priority
                    />
                </Link>
            </div>

            {/* Desktop Menu links */}
            <nav className="flex items-center justify-center">
                <ul className="flex items-center gap-1 2xl:gap-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <li key={item.label} className="list-none">
                                <Link
                                    href={item.href}
                                    className={`relative inline-flex items-center justify-center px-3 2xl:px-4 py-2 rounded-xl text-xs 2xl:text-[13px] font-black uppercase tracking-wider transition-all duration-300 ${
                                        isActive
                                            ? "text-crimson-red bg-crimson-red/5 font-extrabold"
                                            : "text-midnight-blue hover:text-crimson-red hover:bg-midnight-blue/5"
                                    }`}
                                >
                                    <span className="whitespace-nowrap">{item.label}</span>
                                    {isActive && (
                                        <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-crimson-red rounded-full" />
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Right side: Login Action / User Profile */}
            <div className="flex items-center shrink-0 gap-3">
                {session ? (
                    <div className="flex items-center gap-3 group/profile">
                        <div className="flex items-center gap-2.5" title={session.user?.email || ""}>
                            {session.user?.image ? (
                                <Image
                                    src={session.user.image}
                                    alt={session.user.name || "Usuario"}
                                    width={36}
                                    height={36}
                                    className="rounded-full border-2 border-crimson-red shadow-sm"
                                />
                            ) : (
                                <div className="w-9 h-9 rounded-full bg-midnight-blue flex items-center justify-center text-white font-bold text-sm border-2 border-crimson-red shadow-sm">
                                    {session.user?.name?.charAt(0) || "U"}
                                </div>
                            )}
                            <div className="flex flex-col items-start justify-center">
                                <span className="font-bold text-midnight-blue text-xs tracking-wide leading-tight">
                                    {session.user?.name?.split(' ')[0]}
                                </span>
                                {(session.user?.role === 'admin' || session.user?.role === 'edit') && (
                                    <Link
                                        href="/admin"
                                        className="mt-0.5 text-[9px] font-black uppercase text-white bg-crimson-red hover:bg-midnight-blue px-1.5 py-[1px] rounded transition-colors tracking-wider shadow-sm flex items-center gap-1"
                                        title="Panel de Administración"
                                    >
                                        Admin
                                    </Link>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={onSignOut}
                            className="px-3 py-1.5 text-xs font-black uppercase tracking-wider text-crimson-red border border-crimson-red/30 rounded-lg hover:bg-crimson-red hover:text-white transition-all duration-200"
                        >
                            Salir
                        </button>
                    </div>
                ) : (
                    onLoginClick && (
                        <button
                            onClick={onLoginClick}
                            className="px-5 py-2 text-xs font-black uppercase tracking-wider text-white bg-midnight-blue hover:bg-crimson-red rounded-full transition-all duration-300 shadow-sm hover:shadow-md active:scale-95"
                        >
                            Ingresar
                        </button>
                    )
                )}
            </div>
        </div>
    );
}
