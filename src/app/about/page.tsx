import React from 'react';
import Image from 'next/image';

const AboutPage = () => {
    return (
        <div className="max-w-7xl mx-auto section-padding px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:items-center mb-32 animate-fade-up">
                <div className="relative order-2 lg:order-1">
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-crimson-red/10 rounded-full blur-3xl" />
                    <div className="relative h-[500px] md:h-[600px] rounded-[64px] bg-white border border-silver-accent p-12 md:p-20 shadow-premium overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-tr from-midnight-blue/5 to-transparent z-10" />
                        <Image
                            src="/assets/fecoka-logo.jpg"
                            alt="FECOKA Federation"
                            fill
                            className="object-contain p-20 transition-transform duration-1000 group-hover:scale-110"
                        />
                    </div>
                </div>

                <div className="order-1 lg:order-2">
                    <span className="text-crimson-red font-black text-sm uppercase tracking-widest block mb-4">Nuestra Identidad</span>
                    <h1 className="text-6xl md:text-8xl font-black text-midnight-blue tracking-tighter leading-[0.85] mb-10">
                        federación_ <br />
                        <span className="text-crimson-red">costa rica</span>
                    </h1>
                    <p className="text-xl text-midnight-blue font-medium leading-relaxed mb-10 tracking-tight">
                        La Federación Costarricense de Karate (FECOKA) es el ente rector oficial del karate en el país, dedicada a la formación integral de atletas bajo los más altos estándares olímpicos y tradicionales.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="p-10 glass-panel rounded-[40px] bg-white/40 group hover:bg-midnight-blue hover:text-white transition-all duration-500">
                            <h3 className="font-black text-2xl mb-4 tracking-tight">Misión</h3>
                            <p className="text-sm font-medium opacity-60 leading-relaxed">Promover y regular el desarrollo del karate-do nacional fomentando valores de disciplina y respeto.</p>
                        </div>
                        <div className="p-10 glass-panel rounded-[40px] bg-white/40 group hover:bg-crimson-red hover:text-white transition-all duration-500">
                            <h3 className="font-black text-2xl mb-4 tracking-tight">Visión</h3>
                            <p className="text-sm font-medium opacity-60 leading-relaxed">Ser la federación líder en Centroamérica formando atletas de éxito internacional y carácter ejemplar.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Board of Directors: Premium Grid */}
            <div className="bg-white rounded-[64px] p-12 md:p-24 border border-silver-accent shadow-premium animate-fade-up">
                <div className="text-center mb-20">
                    <h2 className="text-5xl font-black text-midnight-blue tracking-tighter mb-4 lowercase">junta_directiva</h2>
                    <p className="text-steel-gray font-bold text-sm tracking-widest uppercase">Gestión 2024 - 2026</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                    {[
                        { role: 'Presidente', name: 'Nombre Apellido' },
                        { role: 'Vicepresidente', name: 'Nombre Apellido' },
                        { role: 'Secretaría', name: 'Nombre Apellido' },
                        { role: 'Tesorería', name: 'Nombre Apellido' }
                    ].map((persona, idx) => (
                        <div
                            key={persona.role}
                            className="text-center group"
                            style={{ animationDelay: `${idx * 0.1}s` }}
                        >
                            <div className="w-40 h-40 bg-silver-accent rounded-[48px] mx-auto mb-8 overflow-hidden relative border-2 border-transparent group-hover:border-crimson-red transition-all duration-500">
                                <div className="absolute inset-0 flex items-center justify-center text-midnight-blue/5">
                                    <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                                </div>
                            </div>
                            <p className="text-crimson-red text-[10px] font-black uppercase tracking-[0.3em] mb-2">{persona.role}</p>
                            <p className="text-2xl font-black text-midnight-blue tracking-tighter group-hover:text-crimson-red transition-all">{persona.name}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Dojo Kun Section */}
            <div className="mt-32 text-center animate-fade-up">
                <h2 className="text-7xl md:text-9xl font-black text-midnight-blue opacity-[0.03] absolute left-0 right-0 -translate-y-1/2 pointer-events-none tracking-tighter">DOJO KUN</h2>
                <div className="max-w-3xl mx-auto relative z-10 px-6">
                    <p className="text-2xl md:text-3xl font-black text-midnight-blue/40 tracking-tight leading-relaxed">
                        "En el Karate no hay un primer ataque. <br /> Solo la búsqueda constante de la <span className="text-midnight-blue">perfección del carácter</span>."
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
