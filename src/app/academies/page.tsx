"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const AcademiesPublicPage = () => {
    const [academies, setAcademies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAcademies = async () => {
            try {
                const res = await fetch('/api/academies');
                if (res.ok) {
                    const data = await res.json();
                    setAcademies(data.filter((a: any) => a.isActive));
                }
            } catch (error) {
                console.error("Error fetching academies:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAcademies();
    }, []);

    return (
        <main className="min-h-screen pt-32 pb-20 bg-mist-white/30">
            <div className="max-w-[1440px] mx-auto px-8 md:px-6 lg:px-12">
                <header className="mb-16 animate-fade-up">
                    <span className="text-crimson-red font-black text-sm uppercase tracking-[0.3em] block mb-4">
                        Institucional
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black text-midnight-blue tracking-tighter uppercase leading-none mb-6">
                        Academias <span className="text-crimson-red">Afiliadas</span>
                    </h1>
                    <p className="max-w-2xl text-steel-gray text-lg font-medium leading-relaxed">
                        Conoce las organizaciones oficiales avaladas por FECOKA para la práctica y enseñanza del Karate-Do en Costa Rica.
                    </p>
                </header>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white rounded-[2rem] h-64 border border-white animate-pulse shadow-sm"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-up">
                        {academies.map((academy: any) => (
                            <div key={academy._id} className="group bg-white rounded-[2.5rem] p-6 md:p-10 shadow-premium hover:shadow-[0_40px_80px_rgba(0,27,72,0.12)] transition-all duration-500 border border-white/50 relative overflow-hidden flex flex-col h-full">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-mist-white rounded-full -mr-16 -mt-16 opacity-40 group-hover:scale-110 transition-transform duration-700"></div>

                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="w-16 h-16 bg-midnight-blue rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg">
                                            {academy.name.charAt(0)}
                                        </div>
                                        <span className="px-4 py-1.5 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                                            Federada
                                        </span>
                                    </div>

                                    <h3 className="text-2xl font-black text-midnight-blue mb-4 group-hover:text-crimson-red transition-colors capitalize leading-tight">
                                        {academy.name}
                                    </h3>

                                    <div className="space-y-4 mb-8 flex-1">
                                        <div className="flex items-center gap-3 text-steel-gray">
                                            <svg className="w-5 h-5 text-crimson-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                            <span className="text-sm font-bold">Sensei {academy.instructor}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-steel-gray">
                                            <svg className="w-5 h-5 text-crimson-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            <span className="text-sm font-bold">{academy.location}</span>
                                        </div>
                                        {academy.contact && (
                                            <div className="flex items-center gap-3 text-steel-gray">
                                                <svg className="w-5 h-5 text-crimson-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                                <span className="text-sm font-bold">{academy.contact}</span>
                                            </div>
                                        )}
                                    </div>

                                    {academy.website && (
                                        <a
                                            href={academy.website.startsWith('http') ? academy.website : `https://${academy.website}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full bg-mist-white hover:bg-midnight-blue hover:text-white py-4 rounded-2xl text-center font-black text-xs uppercase tracking-widest transition-all mt-auto group-hover/btn:bg-midnight-blue"
                                        >
                                            Visitar Sitio
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

export default AcademiesPublicPage;
