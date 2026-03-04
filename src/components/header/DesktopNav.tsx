"use client"

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Shield } from 'lucide-react';

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
        <div className="hidden md:flex items-center justify-between w-full h-full">
            {/* Left spacer for alignment */}
            <div className="flex-1 hidden md:block"></div>

            {/* Desktop Menu container */}
            <div className="flex items-center justify-center">
                <ul className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 lg:gap-8 w-full">
                    {/* Official FECOKA White Logo */}
                    <li className="list-none flex items-center justify-center md:mr-2 lg:mr-6">
                        <Link href="/" className="relative block w-[160px] h-[75px] md:w-[200px] md:h-[95px] lg:w-[240px] lg:h-[115px] transition-transform duration-300 hover:scale-105">
                            <Image
                                src="/assets/fecoka-logo-blanco-transparente.png"
                                alt="FECOKA"
                                fill
                                className="object-contain"
                                priority
                            />
                        </Link>
                    </li>
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <li key={item.label} className="list-none md:w-auto text-center">
                                <Link
                                    href={item.href}
                                    className="relative inline-block group w-full md:w-auto mx-1"
                                >
                                    <span className={
                                        "relative z-10 block uppercase font-sans font-black transition-colors duration-300 group-hover:text-white " +
                                        "text-xl md:text-sm lg:text-[15px] xl:text-[17px] " +
                                        "pt-8 pb-3 px-3 md:pt-10 md:pb-4 md:px-4 lg:pt-14 lg:px-5 " +
                                        "whitespace-nowrap tracking-[0.2em] " +
                                        (isActive ? "text-crimson-red" : "text-midnight-blue")
                                    }>
                                        <span className="whitespace-pre-line leading-none">
                                            {item.label}
                                        </span>
                                    </span>
                                    <span className="absolute inset-0 border-y-2 border-midnight-blue transform scale-y-[2] opacity-0 transition-all duration-300 origin-center group-hover:scale-y-100 group-hover:opacity-100 rounded-xl" />
                                    <span className="absolute top-[2px] left-0 w-full h-[calc(100%-4px)] bg-midnight-blue transform scale-0 opacity-0 transition-all duration-300 origin-top group-hover:scale-100 group-hover:opacity-100 rounded-lg" />
                                </Link>
                            </li>
                        )
                    })}

                    {/* Login Action / User Profile */}
                    {session ? (
                        <li className="list-none md:w-auto text-center mt-4 md:mt-0 flex items-center justify-center group/profile">
                            <div className="flex items-center gap-4 md:ml-4">
                                <div className="flex items-center gap-3" title={session.user?.email || ""}>
                                    {session.user?.image ? (
                                        <Image
                                            src={session.user.image}
                                            alt={session.user.name || "Usuario"}
                                            width={40} height={40}
                                            className="rounded-full border-2 border-transparent group-hover/profile:border-crimson-red transition-colors duration-300 shadow-sm"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-midnight-blue flex items-center justify-center text-white font-bold border-2 border-transparent group-hover/profile:border-crimson-red transition-colors duration-300 shadow-sm">
                                            {session.user?.name?.charAt(0) || "U"}
                                        </div>
                                    )}
                                    <div className="hidden lg:flex flex-col items-start justify-center">
                                        <span className="font-bold text-midnight-blue text-sm tracking-wide leading-tight">
                                            {session.user?.name?.split(' ')[0]}
                                        </span>
                                        {(session.user?.role === 'admin' || session.user?.role === 'edit') && (
                                            <Link
                                                href="/admin"
                                                className="mt-0.5 text-[9px] font-black uppercase text-white bg-crimson-red hover:bg-midnight-blue px-2 py-[2px] rounded transition-colors tracking-widest shadow-sm flex items-center gap-1"
                                                title="Panel de Administración"
                                            >
                                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                                </svg>
                                                Admin
                                            </Link>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={onSignOut}
                                    className="relative inline-block group/btn w-full md:w-auto mx-1"
                                >
                                    <span className={
                                        "relative z-10 block uppercase font-sans font-black transition-colors duration-300 group-hover/btn:text-white " +
                                        "text-sm md:text-sm lg:text-[14px] " +
                                        "py-2 px-4 md:py-2 md:px-4 " +
                                        "whitespace-nowrap tracking-[0.1em] text-crimson-red"
                                    }>
                                        Salir
                                    </span>
                                    <span className="absolute inset-0 border-y-2 border-crimson-red transform scale-y-[2] opacity-0 transition-all duration-300 origin-center group-hover/btn:scale-y-100 group-hover/btn:opacity-100 rounded-xl" />
                                    <span className="absolute top-[2px] left-0 w-full h-[calc(100%-4px)] bg-crimson-red transform scale-0 opacity-0 transition-all duration-300 origin-top group-hover/btn:scale-100 group-hover/btn:opacity-100 rounded-lg" />
                                </button>
                            </div>
                        </li>
                    ) : (
                        onLoginClick && (
                            <li className="list-none md:w-auto text-center mt-4 md:mt-0">
                                <button
                                    onClick={onLoginClick}
                                    className="relative inline-block group w-full md:w-auto mx-1"
                                >
                                    <span className={
                                        "relative z-10 block uppercase font-sans font-black transition-colors duration-300 group-hover:text-white " +
                                        "text-xl md:text-sm lg:text-[15px] xl:text-[17px] " +
                                        "pt-8 pb-3 px-3 md:pt-10 md:pb-4 md:px-4 lg:pt-14 lg:px-5 " +
                                        "whitespace-nowrap tracking-[0.2em] text-midnight-blue"
                                    }>
                                        Ingresar
                                    </span>
                                    <span className="absolute inset-0 border-y-2 border-midnight-blue transform scale-y-[2] opacity-0 transition-all duration-300 origin-center group-hover:scale-y-100 group-hover:opacity-100 rounded-xl" />
                                    <span className="absolute top-[2px] left-0 w-full h-[calc(100%-4px)] bg-midnight-blue transform scale-0 opacity-0 transition-all duration-300 origin-top group-hover:scale-100 group-hover:opacity-100 rounded-lg" />
                                </button>
                            </li>
                        )
                    )}
                </ul>
            </div>
            <div className="flex-1 hidden md:block"></div>
        </div>
    );
}
