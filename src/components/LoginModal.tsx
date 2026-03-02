'use client';

import React from 'react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
            {/* Dark immersive backdrop */}
            <div
                className="absolute inset-0 bg-deep-black/80 backdrop-blur-md transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content - Premium Centered Design */}
            <div className="relative w-full max-w-md bg-gradient-to-b from-[#0a1128] to-[#040814] rounded-2xl p-8 sm:p-10 shadow-[0_0_50px_rgba(0,0,0,0.6)] border border-white/10 overflow-hidden transform transition-all">

                {/* Glowing Top Accent (Replacement for the harsh red line) */}
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-crimson-red to-transparent opacity-80" />
                <div className="absolute top-0 inset-x-0 h-[30px] bg-crimson-red blur-[40px] opacity-20" />

                {/* Close Button - Clean & Visible */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/50 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all duration-200 z-10 ring-offset-[#0a1128] focus:ring-2 focus:ring-white/20 outline-none"
                    aria-label="Cerrar"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                <div className="flex flex-col items-center mt-2 relative z-10">

                    {/* Centered Lock Icon Container */}
                    <div className="relative mb-6 group">
                        <div className="absolute inset-0 bg-crimson-red rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                        <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-[#111827] border border-white/10 shadow-inner">
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white opacity-90" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                        </div>
                    </div>

                    {/* Texts */}
                    <h2 className="text-3xl font-black text-white mb-2 tracking-tight uppercase font-sans text-center">
                        Acceso <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-silver-accent font-bold">Élite</span>
                    </h2>
                    <p className="text-crimson-red font-bold text-xs tracking-[0.25em] uppercase mb-8 text-center opacity-90">
                        Portal Federativo Seguro
                    </p>

                    {/* Clean Google Authenticate Button */}
                    <button
                        onClick={() => signIn('google')}
                        className="group relative w-full flex items-center justify-center gap-3 bg-white text-[#0f172a] py-3.5 px-6 rounded-xl font-bold text-[15px] transition-all duration-300 hover:shadow-[0_8px_25px_-5px_rgba(255,255,255,0.2)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] outline-none"
                    >
                        {/* Shimmer effect on hover */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] overflow-hidden" />

                        <svg width="22" height="22" viewBox="0 0 24 24" className="relative z-10 transition-transform group-hover:scale-110 duration-300">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        <span className="relative z-10 font-sans tracking-wide">Autenticar con Google</span>
                    </button>

                    {/* Footer Warning */}
                    <div className="mt-8 border-t border-white/10 pt-6 w-full">
                        <p className="text-[10px] text-center text-silver-accent/50 leading-relaxed font-mono tracking-wider uppercase">
                            Acceso restringido. Uso exclusivo para personal autorizado de la federación. Todas las actividades son auditadas.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
