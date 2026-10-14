import React from 'react';
import Image from 'next/image';

export default function AboutPage() {
    return (
        <div className="page-container section-padding">
            {/* Identity Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-16 sm:mb-24 animate-fade-up">
                <div className="relative order-2 lg:order-1">
                    <div className="absolute -top-8 -left-8 w-36 h-36 bg-crimson-red/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="relative h-[380px] sm:h-[480px] md:h-[540px] rounded-2xl sm:rounded-3xl bg-white border border-silver-accent p-8 sm:p-12 shadow-sm overflow-hidden group flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-tr from-midnight-blue/5 to-transparent z-10 pointer-events-none" />
                        <div className="relative w-full h-full">
                            <Image
                                src="/assets/fecoka-logo.jpg"
                                alt="FECOKA Federation"
                                fill
                                className="object-contain p-4 sm:p-8 transition-transform duration-700 group-hover:scale-105"
                                priority
                            />
                        </div>
                    </div>
                </div>

                <div className="order-1 lg:order-2">
                    <span className="text-crimson-red font-black text-xs sm:text-sm uppercase tracking-[0.25em] block mb-3">
                        Nuestra Identidad
                    </span>
                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-midnight-blue tracking-tighter uppercase leading-tight mb-6">
                        Federación <br />
                        <span className="text-crimson-red">Costa Rica</span>
                    </h1>
                    <p className="text-base sm:text-lg text-steel-gray font-medium leading-relaxed mb-8">
                        La Federación Costarricense de Karate (FECOKA) es el ente rector oficial del karate en el país, dedicada a la formación integral de atletas bajo los más altos estándares olímpicos y tradicionales.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="p-6 rounded-2xl bg-white border border-silver-accent shadow-xs group hover:border-midnight-blue transition-all duration-300">
                            <h3 className="font-black text-lg sm:text-xl text-midnight-blue mb-2 tracking-tight">Misión</h3>
                            <p className="text-xs sm:text-sm font-medium text-steel-gray leading-relaxed">
                                Promover y regular el desarrollo del karate-do nacional fomentando valores de disciplina, superación y respeto.
                            </p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white border border-silver-accent shadow-xs group hover:border-crimson-red transition-all duration-300">
                            <h3 className="font-black text-lg sm:text-xl text-midnight-blue mb-2 tracking-tight">Visión</h3>
                            <p className="text-xs sm:text-sm font-medium text-steel-gray leading-relaxed">
                                Ser la federación líder en Centroamérica formando atletas de éxito internacional y carácter ejemplar.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Board of Directors: Standard Grid */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-14 border border-silver-accent shadow-sm mb-16 sm:mb-24 animate-fade-up">
                <div className="text-center mb-10 sm:mb-14">
                    <span className="text-crimson-red font-black text-xs uppercase tracking-[0.25em] block mb-2">Órgano Rector</span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-midnight-blue tracking-tight uppercase mb-2">
                        Junta Directiva
                    </h2>
                    <p className="text-steel-gray font-bold text-xs uppercase tracking-widest">Gestión 2024 - 2026</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {[
                        { role: 'Presidente', name: 'Presidencia Federada' },
                        { role: 'Vicepresidente', name: 'Comisión Técnica Nacional' },
                        { role: 'Secretaría General', name: 'Gestión Administrativa' },
                        { role: 'Tesorería', name: 'Dirección Financiera' }
                    ].map((persona) => (
                        <div
                            key={persona.role}
                            className="text-center group bg-mist-white/60 p-6 rounded-2xl border border-silver-accent/70 hover:border-crimson-red/40 hover:bg-white transition-all duration-300 shadow-xs"
                        >
                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-midnight-blue/5 rounded-2xl mx-auto mb-4 overflow-hidden relative flex items-center justify-center group-hover:bg-midnight-blue/10 transition-colors">
                                <svg className="w-10 h-10 text-midnight-blue/40" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <p className="text-crimson-red text-xs font-black uppercase tracking-[0.2em] mb-1">{persona.role}</p>
                            <p className="text-base font-bold text-midnight-blue group-hover:text-crimson-red transition-colors">{persona.name}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Dojo Kun Section - 5 Authentic Martial Precepts */}
            <div className="relative mt-10 sm:mt-14 bg-white rounded-2xl sm:rounded-3xl border border-silver-accent p-8 sm:p-14 overflow-hidden shadow-sm animate-fade-up">
                {/* Contained Watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none text-midnight-blue/[0.02] font-black text-6xl sm:text-8xl lg:text-9xl tracking-tighter">
                    DOJO KUN
                </div>

                <div className="max-w-3xl mx-auto relative z-10 text-center">
                    <span className="text-crimson-red font-black text-xs uppercase tracking-[0.25em] block mb-3">Filosofía & Tradición Marcial</span>
                    <h2 className="text-2xl sm:text-4xl font-black text-midnight-blue uppercase tracking-tight mb-8">
                        Los 5 Preceptos del <span className="text-crimson-red">Dojo Kun</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-left">
                        {[
                            { num: '一', precept: 'Perfeccionar el carácter', sub: 'Jinkaku kansei' },
                            { num: '一', precept: 'Ser leal y sincero', sub: 'Makoto no michi' },
                            { num: '一', precept: 'Esforzarse con dedicación', sub: 'Doryoku no seishin' },
                            { num: '一', precept: 'Respetar a los demás', sub: 'Reigi o omonzuru' },
                            { num: '一', precept: 'Controlar el temperamento', sub: 'Kekki no yū' },
                        ].map((item, idx) => (
                            <div key={idx} className="bg-mist-white p-4 rounded-xl border border-silver-accent/70 hover:border-midnight-blue transition-colors">
                                <span className="text-crimson-red font-black text-lg block mb-1">{item.num}</span>
                                <p className="font-black text-midnight-blue text-xs uppercase tracking-wide leading-snug mb-1">{item.precept}</p>
                                <p className="text-steel-gray text-[10px] italic">{item.sub}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
