"use client";

import React, { useState, useEffect } from 'react';
import { School, User, MapPin, Phone, ExternalLink } from 'lucide-react';

export default function AcademiesPublicPage() {
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
        <div className="page-container section-padding">
            {/* Standard Header */}
            <header className="mb-12 sm:mb-16 animate-fade-up">
                <span className="text-crimson-red font-black text-xs sm:text-sm uppercase tracking-[0.25em] block mb-3">
                    Institucional
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-midnight-blue tracking-tighter uppercase leading-tight mb-4">
                    Academias <span className="text-crimson-red">Afiliadas</span>
                </h1>
                <p className="max-w-2xl text-steel-gray text-base sm:text-lg font-medium leading-relaxed">
                    Conoce las organizaciones oficiales avaladas por FECOKA para la práctica y enseñanza del Karate-Do en Costa Rica.
                </p>
                <div className="h-1.5 w-20 bg-midnight-blue mt-6 rounded-full" />
            </header>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-white rounded-2xl sm:rounded-3xl h-64 border border-silver-accent animate-pulse shadow-sm p-6" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 animate-fade-up">
                    {academies.map((academy: any) => (
                        <div
                            key={academy._id}
                            className="group bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-silver-accent relative overflow-hidden flex flex-col h-full"
                        >
                            {/* Subtle Decorative Circle */}
                            <div className="absolute top-0 right-0 w-28 h-28 bg-midnight-blue/[0.03] rounded-full -mr-10 -mt-10 pointer-events-none group-hover:scale-125 transition-transform duration-500 z-0" />

                            <div className="relative z-10 flex flex-col h-full">
                                {/* Top Badge & Icon */}
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-midnight-blue rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-black text-xl sm:text-2xl shadow-md shrink-0">
                                        {academy.name.charAt(0)}
                                    </div>
                                    <span className="px-3.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[11px] font-black uppercase tracking-wider rounded-full shadow-xs">
                                        Federada
                                    </span>
                                </div>

                                <h3 className="text-xl sm:text-2xl font-black text-midnight-blue mb-4 group-hover:text-crimson-red transition-colors capitalize leading-tight">
                                    {academy.name}
                                </h3>

                                <div className="space-y-3 mb-6 flex-1 text-steel-gray text-sm font-medium">
                                    <div className="flex items-center gap-3">
                                        <User className="w-4 h-4 text-crimson-red shrink-0" />
                                        <span className="font-bold text-deep-black truncate">Sensei {academy.instructor}</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-4 h-4 text-crimson-red shrink-0 mt-0.5" />
                                        <span className="line-clamp-2">{academy.location}</span>
                                    </div>
                                    {academy.contact && (
                                        <div className="flex items-center gap-3">
                                            <Phone className="w-4 h-4 text-crimson-red shrink-0" />
                                            <span>{academy.contact}</span>
                                        </div>
                                    )}
                                </div>

                                {academy.website && (
                                    <a
                                        href={academy.website.startsWith('http') ? academy.website : `https://${academy.website}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full inline-flex items-center justify-center gap-2 bg-mist-white hover:bg-midnight-blue text-midnight-blue hover:text-white border border-silver-accent hover:border-midnight-blue py-3 rounded-xl text-center font-black text-xs uppercase tracking-wider transition-all mt-auto shadow-xs active:scale-98"
                                    >
                                        <span>Visitar Sitio</span>
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
