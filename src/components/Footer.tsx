"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
    return (
        <footer className="relative z-10 bg-midnight-blue text-white pt-24 pb-12 overflow-hidden">
            {/* Decorative Background Accent */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-crimson-red/5 -skew-x-12 translate-x-1/2 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                    {/* Brand Column */}
                    <div className="col-span-1 lg:col-span-1">
                        <Link href="/" className="inline-block mb-8">
                            <div className="flex items-center gap-4">
                                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                                    <Image
                                        src="/assets/fecoka-logo.jpg"
                                        alt="FECOKA Logo"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black tracking-tighter leading-none">FECOKA</h2>
                                    <p className="text-[10px] font-bold text-crimson-red uppercase tracking-[0.2em] mt-1">Costa Rica</p>
                                </div>
                            </div>
                        </Link>
                        <p className="text-white/60 text-sm leading-relaxed font-medium mb-8 max-w-xs">
                            Federación Costarricense de Karate. Entidad oficial dedicada al desarrollo, promoción y regulación del Karate-Do en Costa Rica.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-crimson-red hover:border-crimson-red transition-all group">
                                <svg className="w-5 h-5 opacity-60 group-hover:opacity-100" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-crimson-red hover:border-crimson-red transition-all group">
                                <svg className="w-5 h-5 opacity-60 group-hover:opacity-100" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="col-span-1">
                        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-crimson-red mb-8">Navegación</h3>
                        <ul className="space-y-4">
                            {['Inicio', 'Noticias', 'Eventos', 'Rankings', 'Academias', 'Nosotros'].map((item) => (
                                <li key={item}>
                                    <Link
                                        href={
                                            item === 'Inicio' ? '/' :
                                                item === 'Academias' ? '/academies' :
                                                    item === 'Noticias' ? '/news' :
                                                        item === 'Eventos' ? '/events' :
                                                            item === 'Nosotros' ? '/about' :
                                                                `/${item.toLowerCase()}`
                                        }
                                        className="text-white/60 hover:text-white transition-colors text-sm font-bold flex items-center gap-2 group"
                                    >
                                        <div className="w-0 h-[1.5px] bg-crimson-red group-hover:w-4 transition-all" />
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Institutional */}
                    <div className="col-span-1">
                        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-crimson-red mb-8">Institucional</h3>
                        <ul className="space-y-4">
                            {['Estatutos', 'Reglamentos', 'Afiliaciones', 'Transparencia'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-white/60 hover:text-white transition-colors text-sm font-bold flex items-center gap-2 group">
                                        <div className="w-0 h-[1.5px] bg-white group-hover:w-4 transition-all" />
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="col-span-1">
                        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-crimson-red mb-8">Contacto</h3>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-crimson-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </div>
                                <p className="text-white/60 text-sm font-medium leading-relaxed">
                                    Gimnasio Nacional, Sabana Este<br />
                                    San José, Costa Rica
                                </p>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-crimson-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                </div>
                                <p className="text-white/60 text-sm font-medium">info@fecoka.org</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 text-center md:text-left">
                        © {new Date().getFullYear()} Federación Costarricense de Karate. Todos los derechos reservados.
                    </p>
                    <div className="flex gap-8">
                        <Link href="#" className="text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors">Privacidad</Link>
                        <Link href="#" className="text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors">Términos</Link>
                    </div>
                </div>
            </div>
        </footer >
    );
};

export default Footer;
