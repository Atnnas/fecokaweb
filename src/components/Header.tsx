'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface HeaderProps {
    onLoginClick: () => void;
}

const NAV_ITEMS = [
    { name: 'Inicio', href: '/' },
    { name: 'Noticias', href: '/news' },
    { name: 'Academias\nAfiliadas', href: '/academies' },
    { name: 'Rankings', href: '/rankings' },
    { name: 'Federación', href: '/about' },
];

const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Prevent scroll when mobile menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMenuOpen]);

    return (
        <>
            <header
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-premium border-b border-white border-opacity-20 py-2' : 'bg-transparent py-4 md:py-6'
                    }`}
            >
                <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex justify-between items-center gap-8">



                    {/* Logo */}
                    <Link href="/" className="relative z-50 shrink-0">
                        <div className="relative h-10 w-28 md:h-12 md:w-36 transition-transform hover:scale-105">
                            <Image
                                src="/assets/fecoka-logo.jpg"
                                alt="FECOKA Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </Link>

                    {/* Desktop Navigation (Center/Right) */}
                    <nav className="hidden lg:flex flex-1 items-center justify-center gap-x-1 xl:gap-x-2">
                        {NAV_ITEMS.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`relative px-3 py-2 text-[13px] xl:text-[14px] font-bold tracking-wide transition-colors ${scrolled
                                        ? isActive ? 'text-crimson-red' : 'text-midnight-blue hover:text-crimson-red'
                                        : isActive ? 'text-crimson-red' : 'text-midnight-blue lg:text-midnight-blue hover:text-crimson-red'
                                        }`}
                                >
                                    <span className="whitespace-pre-line leading-tight block text-center">
                                        {item.name}
                                    </span>
                                    {isActive && (
                                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-crimson-red rounded-full" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3 shrink-0 relative z-50">
                        <button
                            onClick={onLoginClick}
                            className={`hidden md:flex text-sm font-bold transition-colors px-4 py-2 ${scrolled ? 'text-midnight-blue hover:text-crimson-red' : 'text-midnight-blue hover:text-crimson-red'
                                }`}
                        >
                            Acceso
                        </button>
                        <button
                            onClick={onLoginClick}
                            className="bg-midnight-blue text-white text-xs font-bold tracking-widest uppercase px-5 py-2.5 rounded-full hover:bg-crimson-red transition-all duration-300 shadow-xl hover:-translate-y-0.5"
                        >
                            Sign In
                        </button>

                        {/* Mobile Hamburger (Right - Top) */}
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="flex lg:hidden flex-col gap-1.5 p-2 focus:outline-none group relative z-50 ml-1"
                            aria-label="Abrir Menú"
                        >
                            <span className={`block h-[3px] w-6 rounded-full transition-all duration-300 ${scrolled ? 'bg-midnight-blue' : 'bg-midnight-blue'}`} />
                            <span className={`block h-[3px] w-4 rounded-full transition-all duration-300 ${scrolled ? 'bg-midnight-blue' : 'bg-midnight-blue'}`} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 z-[100] lg:hidden transition-all duration-500 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
            >
                <div
                    className={`absolute inset-0 bg-midnight-blue/40 backdrop-blur-sm transition-opacity duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0'
                        }`}
                    onClick={() => setIsMenuOpen(false)}
                />

                <nav
                    className={`absolute top-0 left-0 h-full w-full max-w-[85%] sm:max-w-sm bg-white shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] p-8 flex flex-col overflow-y-auto ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'
                        }`}
                >
                    <div className="flex justify-between items-center mb-12">
                        <span className="text-midnight-blue font-black text-2xl tracking-tighter uppercase">Navegación</span>
                        <button
                            onClick={() => setIsMenuOpen(false)}
                            className="p-2 bg-silver-accent/50 hover:bg-silver-accent rounded-full transition-colors text-midnight-blue"
                            aria-label="Cerrar Menú"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    <div className="flex flex-col gap-6 flex-1">
                        {NAV_ITEMS.map((item, idx) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsMenuOpen(false)}
                                className="group relative inline-block text-3xl font-black text-midnight-blue hover:text-crimson-red transition-colors"
                                style={{ animationDelay: `${idx * 0.05}s`, animationFillMode: 'both' }}
                            >
                                <span className="relative z-10 block">{item.name}</span>
                                <span className="absolute bottom-0 left-0 w-0 h-1 bg-crimson-red transition-all duration-300 group-hover:w-full" />
                            </Link>
                        ))}
                    </div>

                    <div className="mt-12 space-y-4 pt-8 border-t border-silver-accent">
                        <button
                            onClick={() => { setIsMenuOpen(false); onLoginClick(); }}
                            className="w-full bg-midnight-blue text-white font-bold py-4 rounded-xl hover:bg-crimson-red transition-all shadow-lg active:scale-95 text-sm uppercase tracking-widest"
                        >
                            Acceder al Portal
                        </button>
                        <p className="text-center text-[10px] text-steel-gray font-bold tracking-widest uppercase">
                            © FECOKA Costa Rica
                        </p>
                    </div>
                </nav>
            </div>
        </>
    );
};

export default Header;
