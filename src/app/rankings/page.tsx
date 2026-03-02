'use client';

import React, { useState, useEffect } from 'react';

const PublicRankingsPage = () => {
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
        <div className="max-w-7xl mx-auto section-padding px-8 md:px-6">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-8 animate-fade-up">
                <div>
                    <span className="text-crimson-red font-black text-sm uppercase tracking-widest block mb-4">Elite Nacional</span>
                    <h1 className="text-6xl md:text-8xl font-black text-midnight-blue tracking-tighter leading-[0.85]">
                        rankings_ <br />
                        <span className="text-crimson-red">oficiales</span>
                    </h1>
                </div>

                <div className="flex bg-midnight-blue p-2 rounded-[24px] shadow-2xl">
                    {['All', 'Kata', 'Kumite'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-8 py-3 rounded-[18px] font-black text-xs uppercase tracking-widest transition-all ${filter === f ? 'bg-white text-midnight-blue' : 'text-white/40 hover:text-white'}`}
                        >
                            {f === 'All' ? 'Global' : f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-[56px] shadow-premium border border-silver-accent overflow-hidden animate-fade-up overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                    <thead>
                        <tr className="bg-midnight-blue text-white">
                            <th className="px-6 py-6 md:px-10 md:py-8 font-black text-xs uppercase tracking-[0.3em]">Pos</th>
                            <th className="px-6 py-6 md:px-10 md:py-8 font-black text-xs uppercase tracking-[0.3em]">Atleta</th>
                            <th className="px-6 py-6 md:px-10 md:py-8 font-black text-xs uppercase tracking-[0.3em]">Categoría</th>
                            <th className="px-6 py-6 md:px-10 md:py-8 font-black text-xs uppercase tracking-[0.3em]">Dojo / Club</th>
                            <th className="px-6 py-6 md:px-10 md:py-8 font-black text-xs uppercase tracking-[0.3em] text-right">Puntaje</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-silver-accent">
                        {filteredRankings.length > 0 ? filteredRankings.map((athlete: any) => (
                            <tr key={athlete._id} className="hover:bg-midnight-blue/[0.02] transition-colors group">
                                <td className="px-6 py-6 md:px-10 md:py-10">
                                    <span className={`text-4xl font-black italic tracking-tighter ${athlete.position <= 3 ? 'text-crimson-red' : 'text-midnight-blue/20'}`}>
                                        {athlete.position.toString().padStart(2, '0')}
                                    </span>
                                </td>
                                <td className="px-6 py-6 md:px-10 md:py-10">
                                    <div className="font-black text- midnight-blue text-2xl group-hover:text-crimson-red transition-colors">{athlete.athleteName}</div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-crimson-red" />
                                        <span className="text-[10px] font-black text-midnight-blue/40 uppercase tracking-widest">{athlete.modality}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-6 md:px-10 md:py-10">
                                    <span className="inline-block px-4 py-1.5 bg-silver-accent rounded-full text-[10px] font-black text-midnight-blue uppercase">
                                        {athlete.category}
                                    </span>
                                </td>
                                <td className="px-6 py-6 md:px-10 md:py-10 text-steel-gray font-bold text-sm">
                                    {athlete.dojo}
                                </td>
                                <td className="px-6 py-6 md:px-10 md:py-10 text-right">
                                    <div className="text-3xl font-black text-midnight-blue tracking-tighter">
                                        {athlete.points.toLocaleString()}
                                        <span className="text-[10px] uppercase ml-2 text-steel-gray/40">pts</span>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="py-40 text-center">
                                    <p className="text-steel-gray font-black text-2xl uppercase tracking-widest opacity-20">Sin datos de ranking</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-6 px-10">
                <p className="text-[10px] font-bold text-steel-gray uppercase tracking-[0.2em]">
                    * Actualización oficial: {new Date().toLocaleDateString('es-CR', { month: 'long', year: 'numeric' })}
                </p>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-crimson-red" />
                        <span className="text-[10px] font-bold text-midnight-blue uppercase tracking-widest">Top Nacional</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-midnight-blue/20" />
                        <span className="text-[10px] font-bold text-midnight-blue uppercase tracking-widest">Aspirantes</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicRankingsPage;
