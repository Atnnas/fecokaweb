'use client';

import React, { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';

export default function PublicRankingsPage() {
    const [rankings, setRankings] = useState([]);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        const fetchRankings = async () => {
            try {
                const res = await fetch('/api/rankings');
                if (!res.ok) {
                    console.error("Error fetching rankings:", await res.text());
                    return;
                }
                const data = await res.json();
                setRankings(data);
            } catch (error) {
                console.error("Failed to load rankings:", error);
            }
        };
        fetchRankings();
    }, []);

    const filteredRankings = filter === 'All' ? rankings : rankings.filter((r: any) => r.modality === filter);

    return (
        <div className="page-container section-padding">
            {/* Header + Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-6 animate-fade-up">
                <div>
                    <span className="text-crimson-red font-black text-xs sm:text-sm uppercase tracking-[0.25em] block mb-3">
                        Elite Nacional
                    </span>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-midnight-blue tracking-tighter uppercase leading-tight mb-2">
                        Rankings <span className="text-crimson-red">Oficiales</span>
                    </h1>
                    <p className="text-steel-gray text-base font-medium">
                        Tabla clasificatoria nacional de atletas federados por puntos acumulados.
                    </p>
                </div>

                {/* Filter Capsule */}
                <div className="inline-flex p-1.5 bg-midnight-blue rounded-full shadow-md gap-1.5 self-start md:self-auto shrink-0 flex-wrap">
                    {[
                        { id: 'All', label: 'Global' },
                        { id: 'Kata', label: 'Kata' },
                        { id: 'Kumite', label: 'Kumite' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setFilter(tab.id)}
                            className={`px-5 sm:px-6 py-2 rounded-full font-black text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                                filter === tab.id
                                    ? 'bg-white text-midnight-blue shadow-xs'
                                    : 'text-white/60 hover:text-white hover:bg-white/10'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table Card Container */}
            <div className="mt-6 sm:mt-8 bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-silver-accent overflow-hidden animate-fade-up">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left min-w-[700px]">
                        <thead>
                            <tr className="bg-midnight-blue text-white">
                                <th className="px-5 py-4 font-black text-xs uppercase tracking-wider w-20">Pos</th>
                                <th className="px-5 py-4 font-black text-xs uppercase tracking-wider">Atleta</th>
                                <th className="px-5 py-4 font-black text-xs uppercase tracking-wider">Categoría</th>
                                <th className="px-5 py-4 font-black text-xs uppercase tracking-wider">Dojo / Club</th>
                                <th className="px-5 py-4 font-black text-xs uppercase tracking-wider text-right">Puntaje</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-silver-accent">
                            {filteredRankings.length > 0 ? (
                                filteredRankings.map((athlete: any) => (
                                    <tr key={athlete._id} className="hover:bg-mist-white/70 transition-colors group">
                                        <td className="px-5 py-4 sm:py-5">
                                            <span className={`text-2xl sm:text-3xl font-black italic tracking-tighter ${
                                                athlete.position <= 3 ? 'text-crimson-red' : 'text-midnight-blue/40'
                                            }`}>
                                                {athlete.position.toString().padStart(2, '0')}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 sm:py-5">
                                            <div className="font-black text-midnight-blue text-base sm:text-lg group-hover:text-crimson-red transition-colors">
                                                {athlete.athleteName}
                                            </div>
                                            <div className="flex items-center gap-1.5 mt-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-crimson-red" />
                                                <span className="text-[10px] font-bold text-steel-gray uppercase tracking-wider">{athlete.modality}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 sm:py-5">
                                            <span className="inline-block px-3 py-1 bg-mist-white border border-silver-accent rounded-full text-[10px] font-black text-midnight-blue uppercase">
                                                {athlete.category}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 sm:py-5 text-steel-gray font-bold text-sm">
                                            {athlete.dojo}
                                        </td>
                                        <td className="px-5 py-4 sm:py-5 text-right">
                                            <div className="text-xl sm:text-2xl font-black text-midnight-blue tracking-tight">
                                                {athlete.points?.toLocaleString() || 0}
                                                <span className="text-[10px] uppercase ml-1.5 text-steel-gray/60 font-bold">pts</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <Trophy className="w-10 h-10 text-silver-accent mx-auto mb-3" />
                                        <p className="text-steel-gray font-bold text-base">Sin datos de ranking para esta modalidad</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Table Footer Info */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 px-2 text-xs text-steel-gray">
                <p className="font-medium">
                    * Actualización oficial: {new Date().toLocaleDateString('es-CR', { month: 'long', year: 'numeric' })}
                </p>
                <div className="flex items-center gap-5">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-crimson-red" />
                        <span className="font-bold text-midnight-blue uppercase text-[11px] tracking-wider">Top Nacional</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-midnight-blue/20" />
                        <span className="font-bold text-steel-gray uppercase text-[11px] tracking-wider">Aspirantes</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
