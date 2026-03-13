'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar as CalendarIcon, ExternalLink, X, Trophy, Users, GraduationCap, Globe, Map, FileText } from 'lucide-react';

const PublicEventsPage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch('/api/events');
                if (!res.ok) {
                    setError("Error al cargar los eventos. Verifica la conexión a la base de datos.");
                    setLoading(false);
                    return;
                }
                const data = await res.json();
                setEvents(data);
                setLoading(false);
            } catch (err: any) {
                setError("Error al cargar los eventos. Verifica la conexión a la base de datos.");
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (selectedEvent) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [selectedEvent]);

    // Sort events chronologically and split by scope
    const nationalEvents = [...events].filter((e: any) => e.scope === 'Nacional' || !e.scope).sort((a: any, b: any) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    const internationalEvents = [...events].filter((e: any) => e.scope === 'Internacional').sort((a: any, b: any) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    const getEventIcon = (type: string) => {
        switch (type) {
            case 'Tournament': return <Trophy className="w-5 h-5" />;
            case 'Seminar': return <GraduationCap className="w-5 h-5" />;
            case 'Meeting': return <Users className="w-5 h-5" />;
            default: return <CalendarIcon className="w-5 h-5" />;
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'Tournament': return 'Torneo';
            case 'Seminar': return 'Seminario';
            case 'Meeting': return 'Reunión / Gala';
            default: return type;
        }
    };

    const EventRow = ({ event }: { event: any }) => {
        const startObj = new Date(event.startDate);
        const endObj = new Date(event.endDate);
        const sameMonth = startObj.getUTCMonth() === endObj.getUTCMonth();

        return (
            <motion.div
                whileHover={{ x: 4 }}
                className="flex flex-col lg:flex-row items-start lg:items-center justify-between bg-white border border-gray-100 py-4 px-5 md:px-6 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group gap-4"
                onClick={() => setSelectedEvent(event)}
            >
                <div className="flex gap-4 items-center w-full lg:w-auto flex-1 min-w-0 pr-0 lg:pr-8">
                    {/* Minimalist Date Card */}
                    <div className="flex flex-col border border-gray-100 rounded-md overflow-hidden shrink-0 shadow-sm w-[72px] bg-white group-hover:border-gray-200 transition-colors">
                        <div className="bg-gray-50 text-gray-500 text-[9px] font-bold uppercase text-center py-1.5 border-b border-gray-100">
                            {startObj.toLocaleDateString('es-CR', { timeZone: 'UTC', month: 'short' }).replace('.', '')}
                            {!sameMonth && ` - ${endObj.toLocaleDateString('es-CR', { timeZone: 'UTC', month: 'short' }).replace('.', '')}`}
                        </div>
                        <div className="bg-white text-center py-2 font-bold text-gray-900 group-hover:text-[#800000] transition-colors leading-none text-xl">
                            {startObj.getUTCDate()}
                            {startObj.getUTCDate() !== endObj.getUTCDate() && (
                                <span className="text-sm">-{endObj.getUTCDate()}</span>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-1.5">
                            <div className={`px-2 py-0.5 text-[10px] font-semibold tracking-wider rounded-sm ${event.scope === 'Internacional' ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-600'}`}>
                                {event.scope || 'Nacional'}
                            </div>
                            <div className="px-2 py-0.5 flex items-center gap-1.5 text-[10px] font-medium tracking-wide text-gray-500 border border-gray-200 rounded-sm">
                                <span>{getTypeLabel(event.type)}</span>
                            </div>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#800000] transition-colors mb-1.5 leading-snug">
                            {event.name}
                        </h3>

                        <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                            <MapPin className="w-3.5 h-3.5 text-gray-400" />
                            <span className="truncate">{event.location}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-5 lg:mt-0 shrink-0 flex items-center gap-4">
                    {event.invitationPdf && (
                        <a
                            href={event.invitationPdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-800 transition-colors bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md"
                            title="Descargar Invitación PDF"
                        >
                            <FileText className="w-3.5 h-3.5" />
                            PDF
                        </a>
                    )}
                    <span className="text-[#800000] font-semibold text-[11px] uppercase tracking-widest flex items-center gap-2 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        Ver Detalles <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="bg-[#f8f9fa] min-h-screen relative overflow-x-hidden w-full font-sans">
            {/* Minimalist Background Layout */}
            <div className="absolute top-0 left-0 w-full h-[35vh] bg-white border-b border-gray-100" />

            <div className="w-full max-w-[1920px] mx-auto pt-16 lg:pt-24 pb-20 px-6 sm:px-12 lg:px-24 xl:px-40 relative z-10 block">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-16 text-center max-w-4xl mx-auto"
                >
                    <span className="text-gray-500 font-semibold text-[10px] uppercase tracking-[0.25em] block mb-3">
                        Agenda Oficial FECOKA
                    </span>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 tracking-tight leading-tight">
                        Calendario de <span className="font-semibold text-[#800000]">Eventos</span>
                    </h1>
                </motion.div>

                {loading && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 border-4 border-silver-accent/30 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-crimson-red rounded-full border-t-transparent animate-spin"></div>
                        </div>
                        <p className="text-midnight-blue font-black uppercase tracking-[0.2em] text-xs animate-pulse">Cargando calendarios...</p>
                    </div>
                )}

                {error && !loading && (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center border-2 border-dashed border-red-300 bg-red-50 rounded-3xl p-8 max-w-xl mx-auto">
                            <p className="text-crimson-red font-black text-lg uppercase tracking-widest mb-2">Error de Conexión</p>
                            <p className="text-red-900/70 font-medium">{error}</p>
                        </div>
                    </div>
                )}

                {!loading && !error && events.length === 0 && (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center border-2 border-dashed border-silver-accent bg-white/50 rounded-3xl p-12 max-w-xl">
                            <CalendarIcon className="w-12 h-12 text-silver-accent mx-auto mb-4 opacity-50" />
                            <p className="text-steel-gray font-black text-xl uppercase tracking-widest opacity-40">Sin eventos próximos</p>
                        </div>
                    </div>
                )}

                {/* Clean Corporate Two Column Layout */}
                {!loading && !error && events.length > 0 && (
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">

                        {/* National Column */}
                        <div className="flex flex-col">
                            <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-800 tracking-wide flex items-center gap-2">
                                    <Map className="w-4 h-4 text-gray-400" />
                                    Nacionales
                                </h2>
                                <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-sm">{nationalEvents.length} Eventos</span>
                            </div>

                            <div className="flex flex-col gap-3">
                                {nationalEvents.length > 0 ? (
                                    nationalEvents.map((event: any, idx: number) => (
                                        <motion.div
                                            key={event._id}
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.08, ease: "easeOut" }}
                                            className="rounded-xl overflow-hidden shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-100/50"
                                        >
                                            <EventRow event={event} />
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-gray-400 font-medium text-sm bg-gray-50 rounded-xl border border-gray-100">
                                        No hay eventos programados
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* International Column */}
                        <div className="flex flex-col">
                            <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-800 tracking-wide flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-gray-400" />
                                    Internacionales
                                </h2>
                                <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-sm">{internationalEvents.length} Eventos</span>
                            </div>

                            <div className="flex flex-col gap-3">
                                {internationalEvents.length > 0 ? (
                                    internationalEvents.map((event: any, idx: number) => (
                                        <motion.div
                                            key={event._id}
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.08, ease: "easeOut" }}
                                            className="rounded-xl overflow-hidden shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-100/50"
                                        >
                                            <EventRow event={event} />
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-gray-400 font-medium text-sm bg-gray-50 rounded-xl border border-gray-100">
                                        No hay eventos programados
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                )}
            </div>

            {/* Elegant Corporate Modal */}
            <AnimatePresence>
                {selectedEvent && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[100] flex justify-center p-4 md:p-6 lg:p-12 overflow-y-auto"
                    >
                        {/* Smooth Dimmed Backdrop */}
                        <div
                            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm"
                            onClick={() => setSelectedEvent(null)}
                        />

                        {/* Modal Content container */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 15 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 15 }}
                            transition={{ type: "spring", damping: 30, stiffness: 400 }}
                            className="relative w-full max-w-lg my-auto bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden flex flex-col"
                        >
                            {/* Top: Poster or Minimalist Background */}
                            <div className="w-full h-auto max-h-[60vh] shrink-0 relative bg-gray-900 border-b border-gray-100 flex items-center justify-center overflow-hidden">
                                {selectedEvent.poster ? (
                                    <img
                                        src={selectedEvent.poster}
                                        alt={selectedEvent.name}
                                        className="w-full h-auto max-h-[60vh] object-contain"
                                    />
                                ) : (
                                    <div className="w-full py-12 flex flex-col items-center justify-center p-6 text-center bg-gray-50/80 backdrop-blur-sm">
                                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm border border-gray-100">
                                            {selectedEvent.scope === 'Internacional' ? <Globe className="w-6 h-6 text-gray-400" /> : <Map className="w-6 h-6 text-gray-400" />}
                                        </div>
                                        <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-widest">{selectedEvent.scope || 'Nacional'}</h3>
                                    </div>
                                )}
                            </div>

                            {/* Bottom: Event Details */}
                            <div className="w-full p-6 flex flex-col bg-white overflow-y-auto custom-scrollbar max-h-[40vh]">
                                <button
                                    onClick={() => setSelectedEvent(null)}
                                    className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-black/10 text-white hover:bg-black/20 backdrop-blur-md transition-colors z-10"
                                >
                                    <X className="w-4 h-4" strokeWidth={3} />
                                </button>

                                <div className="flex-1 mt-1">
                                    <div className="mb-6">
                                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight leading-snug mb-6">
                                            {selectedEvent.name}
                                        </h2>

                                        <div className="flex flex-col gap-5">
                                            <div className="flex items-start gap-4">
                                                <div className="mt-0.5 w-8 flex justify-center">
                                                    <CalendarIcon className="w-5 h-5 text-gray-400" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Fecha Programada</p>
                                                    <p className="font-medium text-gray-800 text-sm">
                                                        Del {new Date(selectedEvent.startDate).toLocaleDateString('es-CR', { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' })}<br />
                                                        Al {new Date(selectedEvent.endDate).toLocaleDateString('es-CR', { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-4">
                                                <div className="mt-0.5 w-8 flex justify-center">
                                                    <MapPin className="w-5 h-5 text-gray-400" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Ubicación</p>
                                                    <p className="font-medium text-gray-800 text-sm leading-relaxed">{selectedEvent.location}</p>
                                                </div>
                                            </div>

                                            {selectedEvent.invitationPdf && (
                                                <div className="flex items-start gap-4">
                                                    <div className="mt-0.5 w-8 flex justify-center">
                                                        <FileText className="w-5 h-5 text-red-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Documentación Oficial</p>
                                                        <a
                                                            href={selectedEvent.invitationPdf}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1.5 font-semibold text-red-600 hover:text-red-800 transition-colors group/pdf text-sm"
                                                        >
                                                            <span>Descargar PDF</span>
                                                            <ExternalLink className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover/pdf:opacity-100 group-hover/web:translate-x-0 transition-all" />
                                                        </a>
                                                    </div>
                                                </div>
                                            )}

                                            {selectedEvent.externalUrl && (
                                                <div className="flex items-start gap-4">
                                                    <div className="mt-0.5 w-8 flex justify-center">
                                                        <Globe className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Sitio Web</p>
                                                        <a
                                                            href={selectedEvent.externalUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1.5 font-semibold text-blue-600 hover:text-blue-800 transition-colors group/web text-sm"
                                                        >
                                                            <span>Ver Página Externa</span>
                                                            <ExternalLink className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover/web:opacity-100 group-hover/web:translate-x-0 transition-all" />
                                                        </a>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {selectedEvent.description && (
                                            <div className="mt-8 pt-6 border-t border-gray-100">
                                                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-sm font-normal">
                                                    {selectedEvent.description}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PublicEventsPage;
