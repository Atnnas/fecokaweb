"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
    const [statsData, setStatsData] = useState({
        news: 0,
        events: 0,
        users: 0,
        academies: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/admin/stats', { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    setStatsData(data);
                } else {
                    console.error("Failed to fetch dashboard stats from DB");
                }
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const stats = [
        {
            name: 'NOTICIAS PÚBLICAS',
            value: loading ? '...' : statsData.news.toString(),
            icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z',
            accent: 'border-blue-500 text-blue-500'
        },
        {
            name: 'ACADEMIAS AFILIADAS',
            value: loading ? '...' : statsData.academies.toString(),
            icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
            accent: 'border-green-500 text-green-500'
        },
        {
            name: 'USUARIOS REGISTRADOS',
            value: loading ? '...' : statsData.users.toString(),
            icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
            accent: 'border-indigo-500 text-indigo-500'
        },
        {
            name: 'EVENTOS ACTIVOS',
            value: loading ? '...' : statsData.events.toString(),
            icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
            accent: 'border-crimson-red text-crimson-red'
        }
    ];

    return (
        <div className="w-full h-full flex flex-col gap-12 animate-fade-in font-sans">

            {/* Header Section - Sharp, Dark, Professional */}
            <header className="w-full bg-midnight-blue text-white p-12 lg:p-16 border-l-8 border-crimson-red flex flex-col md:flex-row justify-between items-start md:items-end gap-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-black/20 to-transparent pointer-events-none"></div>

                <div className="z-10 relative">
                    <h1 className="text-5xl lg:text-7xl font-black mb-2 tracking-tighter uppercase leading-none mt-4">
                        CENTRO DE <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">OPERACIONES</span>
                    </h1>
                </div>

                <div className="z-10 relative">
                    <div className="bg-black/40 border border-white/10 px-6 py-4 backdrop-blur-sm flex items-center gap-4">
                        <div className="w-3 h-3 bg-green-500 animate-pulse"></div>
                        <span className="text-sm font-bold tracking-widest text-gray-300">SISTEMA EN LÍNEA</span>
                    </div>
                </div>
            </header>

            {/* Global Stats - Sharp Grid */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 bg-white border-y border-gray-200">
                {stats.map((stat, idx) => (
                    <div key={stat.name} className={`group p-12 lg:p-16 flex flex-col justify-between hover:bg-gray-50 transition-colors duration-300 ${idx !== stats.length - 1 ? 'border-b md:border-b-0 md:border-r border-gray-200' : ''}`}>
                        <div className="flex justify-between items-start mb-8">
                            <div className={`w-14 h-14 border-2 ${stat.accent} flex items-center justify-center bg-transparent group-hover:scale-110 transition-transform duration-500`}>
                                <svg className={`w-6 h-6 ${stat.accent.split(' ')[1]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} />
                                </svg>
                            </div>
                            <span className="text-5xl lg:text-6xl font-black text-deep-black tracking-tighter">{stat.value}</span>
                        </div>
                        <p className="text-steel-gray text-xs font-black tracking-[0.2em] uppercase">{stat.name}</p>
                    </div>
                ))}
            </div>

            {/* Action Modules - Brutalist Layout */}
            <section className="w-full flex flex-col">
                <div className="mb-6 flex items-center gap-4">
                    <div className="w-4 h-4 bg-midnight-blue"></div>
                    <h2 className="text-2xl font-black text-midnight-blue tracking-widest uppercase">MÓDULOS DE CONTROL</h2>
                    <div className="flex-1 h-px bg-gray-300"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-6">
                    {/* News Module */}
                    <Link href="/admin/news" className="group bg-midnight-blue text-white p-12 lg:p-16 xl:p-20 relative overflow-hidden transition-all duration-500 hover:shadow-2xl">
                        <div className="absolute inset-0 bg-crimson-red translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></div>
                        <div className="relative z-10 h-full flex flex-col gap-20 justify-between items-start">
                            <svg className="w-16 h-16 text-white/50 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M19 20H5V6h14v14z M5 8h14 M9 12h6 M9 16h3" />
                            </svg>
                            <div>
                                <p className="text-sm font-black tracking-[0.25em] text-white/60 mb-4">GESTIÓN DE</p>
                                <h3 className="text-3xl lg:text-4xl font-black tracking-tight uppercase">Prensa Oficial</h3>
                            </div>
                        </div>
                    </Link>

                    {/* Events Module */}
                    <Link href="/admin/events" className="group bg-white border-2 border-midnight-blue text-midnight-blue p-12 lg:p-16 xl:p-20 relative overflow-hidden transition-all duration-500 hover:shadow-2xl">
                        <div className="absolute inset-0 bg-midnight-blue translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></div>
                        <div className="relative z-10 h-full flex flex-col gap-20 justify-between items-start">
                            <svg className="w-16 h-16 text-midnight-blue/50 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14V7H5v14z" />
                            </svg>
                            <div>
                                <p className="text-sm font-black tracking-[0.25em] text-steel-gray group-hover:text-white/60 transition-colors mb-4">GESTIÓN DE</p>
                                <h3 className="text-3xl lg:text-4xl font-black tracking-tight uppercase group-hover:text-white transition-colors">Calendario</h3>
                            </div>
                        </div>
                    </Link>

                    {/* Academies Module */}
                    <Link href="/admin/academies" className="group bg-gray-100 border-2 border-transparent hover:border-crimson-red p-12 lg:p-16 xl:p-20 relative overflow-hidden transition-all duration-500 hover:bg-white hover:shadow-2xl">
                        <div className="absolute right-0 bottom-0 w-32 h-32 bg-crimson-red/5 rounded-none scale-0 group-hover:scale-150 transition-transform duration-700 ease-out origin-bottom-right"></div>
                        <div className="relative z-10 h-full flex flex-col gap-20 justify-between items-start">
                            <svg className="w-16 h-16 text-crimson-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M19 21V5H7v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5h2v5m-4 0h4" />
                            </svg>
                            <div>
                                <p className="text-sm font-black tracking-[0.25em] text-steel-gray mb-4">GESTIÓN DE</p>
                                <h3 className="text-3xl lg:text-4xl font-black tracking-tight uppercase text-deep-black">Afiliados</h3>
                            </div>
                        </div>
                    </Link>

                    {/* Rankings Module */}
                    <Link href="/admin/rankings" className="group bg-deep-black text-white p-12 lg:p-16 xl:p-20 relative overflow-hidden transition-all duration-500 hover:shadow-2xl">
                        <div className="absolute inset-0 border-4 border-transparent group-hover:border-crimson-red transition-colors duration-300"></div>
                        <div className="relative z-10 h-full flex flex-col gap-20 justify-between items-start">
                            <svg className="w-16 h-16 text-white/50 group-hover:text-crimson-red transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                            </svg>
                            <div>
                                <p className="text-sm font-black tracking-[0.25em] text-gray-500 group-hover:text-white/80 transition-colors mb-4">MÓDULO DE</p>
                                <h3 className="text-3xl lg:text-4xl font-black tracking-tight uppercase">Ranking Nal.</h3>
                            </div>
                        </div>
                    </Link>
                </div>
            </section>
        </div>
    );
}
