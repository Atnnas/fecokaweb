'use client';

import React, { useState, useEffect } from 'react';

const PublicEventsPage = () => {
    const [events, setEvents] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch('/api/events');
                if (!res.ok) {
                    console.error("Error fetching events:", await res.text());
                    setError("Error al cargar los eventos. Verifica la conexión a la base de datos.");
                    setLoading(false);
                    return;
                }
                const data = await res.json();
                setEvents(data);
                setLoading(false);
            } catch (err: any) {
                console.error("Failed to load events:", err.message || err);
                setError("Error al cargar los eventos. Verifica la conexión a la base de datos.");
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    return (
        <div className="max-w-7xl mx-auto section-padding px-6">
            <div className="mb-20 animate-fade-up">
                <span className="text-crimson-red font-black text-sm uppercase tracking-widest block mb-4">Agenda Nacional</span>
                <h1 className="text-6xl md:text-8xl font-black text-midnight-blue tracking-tighter leading-[0.85]">
                    calendario_ <br />
                    <span className="text-crimson-red">eventos</span>
                </h1>
                <div className="h-2 w-32 bg-midnight-blue mt-8" />
            </div>

            <div className="space-y-12 animate-fade-up">
                {loading && (
                    <div className="py-40 flex flex-col items-center justify-center space-y-4">
                        <div className="w-12 h-12 border-4 border-silver-accent border-t-crimson-red rounded-full animate-spin"></div>
                        <p className="text-midnight-blue font-bold uppercase tracking-widest text-sm animate-pulse">Cargando eventos...</p>
                    </div>
                )}

                {error && !loading && (
                    <div className="py-40 text-center border-4 border-dashed border-crimson-red/30 bg-crimson-red/5 rounded-[56px] mx-auto max-w-3xl">
                        <p className="text-crimson-red font-black text-xl uppercase tracking-widest mb-4">Error de Conexión</p>
                        <p className="text-midnight-blue/80 font-medium">{error}</p>
                    </div>
                )}

                {!loading && !error && events.length > 0 ? events.map((event: any, idx) => (
                    <div
                        key={event._id}
                        className="group relative bg-white p-10 rounded-[48px] border border-silver-accent flex flex-col lg:flex-row lg:items-center justify-between gap-10 hover:shadow-premium hover:-translate-y-2 transition-all duration-500"
                        style={{ animationDelay: `${idx * 0.1}s` }}
                    >
                        <div className="flex gap-10 items-center">
                            <div className="h-24 w-24 bg-midnight-blue rounded-[32px] flex flex-col items-center justify-center border border-white/20 shadow-xl group-hover:bg-crimson-red transition-all duration-500">
                                <span className="text-xs font-black text-white/50 uppercase tracking-widest">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                                <span className="text-4xl font-black text-white tracking-tighter">{new Date(event.date).getDate()}</span>
                            </div>
                            <div>
                                <span className="flex items-center gap-2 mb-2">
                                    <div className="w-2 h-2 rounded-full bg-crimson-red" />
                                    <span className="text-[10px] font-black text-midnight-blue uppercase tracking-[0.2em]">{event.type}</span>
                                </span>
                                <h3 className="text-3xl font-black text-midnight-blue group-hover:text-crimson-red transition-colors tracking-tight">{event.name}</h3>
                                <div className="flex items-center gap-2 mt-2 text-steel-gray font-bold text-sm">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    {event.location}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="px-10 py-4 bg-midnight-blue text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-crimson-red transition-all shadow-lg active:scale-95">
                                Detalles del Evento
                            </button>
                            {event.registrationUrl && (
                                <a
                                    href={event.registrationUrl}
                                    target="_blank"
                                    className="px-10 py-4 border-2 border-silver-accent text-midnight-blue rounded-2xl font-black text-xs uppercase tracking-widest hover:border-midnight-blue transition-all text-center"
                                >
                                    Inscribirse
                                </a>
                            )}
                        </div>
                    </div>
                )) : null}

                {!loading && !error && events.length === 0 && (
                    <div className="py-40 text-center border-4 border-dashed border-silver-accent rounded-[56px]">
                        <p className="text-steel-gray font-black text-2xl uppercase tracking-widest opacity-20">No hay eventos programados</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublicEventsPage;
