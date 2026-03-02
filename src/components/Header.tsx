'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

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
        document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    }, [isMenuOpen]);

    return (
        <>
            <header
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-xl shadow-premium border-b border-gray-100 py-2' : 'bg-transparent py-4 md:py-6'
                    }`}
            >
                <div className="max-w-[1440px] mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-12 h-16 md:h-20">

                    {/* LEFT: Logo - Refined sizing for Galaxy S25 scale */}
                    <div className="flex items-center">
                        <Link href="/" className="relative z-50">
                            <div className="relative h-9 w-24 md:h-12 md:w-40 transition-transform hover:scale-105">
                                <Image
                                    src="/assets/fecoka-logo.jpg"
                                    alt="FECOKA Logo"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </Link>
                    </div>

                    {/* CENTER: Desktop Navigation (Untouched for lg+) */}
                    <nav className="hidden lg:flex items-center gap-x-2 xl:gap-x-4">
                        {NAV_ITEMS.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`relative px-4 py-2 text-[14px] font-bold tracking-wide transition-colors ${isActive ? 'text-crimson-red' : 'text-midnight-blue hover:text-crimson-red'
                                        }`}
                                >
                                    <span className="whitespace-pre-line leading-tight block text-center uppercase tracking-tighter">
                                        {item.name}
                                    </span>
                                    {isActive && (
                                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[2.5px] bg-crimson-red rounded-full" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* RIGHT: Actions & Hamburger - Perfect balance for mobile */}
                    <div className="flex items-center gap-3 relative z-50">
                        <button
                            onClick={onLoginClick}
                            className="hidden md:block text-[13px] font-black uppercase tracking-widest text-midnight-blue hover:text-crimson-red transition-colors px-4"
                        >
                            Acceso
                        </button>

                        <button
                            onClick={onLoginClick}
                            className="bg-midnight-blue text-white text-[10px] md:text-xs font-black tracking-widest uppercase px-4 md:px-6 py-2.5 rounded-full hover:bg-crimson-red transition-all duration-300 shadow-md active:scale-95"
                        >
                            Log In
                        </button>

                        {/* Custom Bold Hamburger Icon (Exact User Style) */}
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="flex lg:hidden flex-col items-center justify-center gap-[4.5px] w-10 h-10 ml-1.5 focus:outline-none group"
                            aria-label="Menú Principal"
                        >
                            <span className="block h-[4px] w-6.5 rounded-full bg-midnight-blue transition-all duration-300 group-hover:bg-crimson-red shadow-sm" />
                            <span className="block h-[4px] w-6.5 rounded-full bg-midnight-blue transition-all duration-300 group-hover:bg-crimson-red shadow-sm" />
                            <span className="block h-[4px] w-6.5 rounded-full bg-midnight-blue transition-all duration-300 group-hover:bg-crimson-red shadow-sm" />
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
                            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-midnight-blue"
                            aria-label="Cerrar Menú"
                        >
                            <X className="w-6 h-6" strokeWidth={2.5} />
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
