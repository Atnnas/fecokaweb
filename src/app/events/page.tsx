'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar as CalendarIcon, ExternalLink, X, Trophy, Users, GraduationCap, Globe, Map, FileText } from 'lucide-react';

export default function PublicEventsPage() {
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
                whileHover={{ x: 3 }}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white border border-silver-accent rounded-xl sm:rounded-2xl p-4 sm:p-5 hover:shadow-md transition-all duration-200 cursor-pointer group gap-4"
                onClick={() => setSelectedEvent(event)}
            >
                <div className="flex gap-4 items-center w-full sm:w-auto flex-1 min-w-0">
                    {/* Minimalist Date Card */}
                    <div className="flex flex-col border border-silver-accent rounded-xl overflow-hidden shrink-0 shadow-xs w-16 sm:w-18 bg-white group-hover:border-midnight-blue/40 transition-colors">
                        <div className="bg-mist-white text-steel-gray text-[9px] font-black uppercase text-center py-1 border-b border-silver-accent">
                            {startObj.toLocaleDateString('es-CR', { timeZone: 'UTC', month: 'short' }).replace('.', '')}
                            {!sameMonth && ` - ${endObj.toLocaleDateString('es-CR', { timeZone: 'UTC', month: 'short' }).replace('.', '')}`}
                        </div>
                        <div className="bg-white text-center py-1.5 font-black text-midnight-blue group-hover:text-crimson-red transition-colors leading-none text-lg sm:text-xl">
                            {startObj.getUTCDate()}
                            {startObj.getUTCDate() !== endObj.getUTCDate() && (
                                <span className="text-xs sm:text-sm font-bold text-steel-gray">-{endObj.getUTCDate()}</span>
                            )}
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-2">
                            <span className={`inline-block whitespace-nowrap px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md ${
                                event.scope === 'Internacional'
                                    ? 'bg-midnight-blue text-white'
                                    : 'bg-mist-white text-midnight-blue border border-silver-accent'
                            }`}>
                                {event.scope || 'Nacional'}
                            </span>
                            <span className="inline-block whitespace-nowrap px-2.5 py-0.5 text-[9px] font-bold text-steel-gray bg-mist-white border border-silver-accent rounded-md">
                                {getTypeLabel(event.type)}
                            </span>
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-midnight-blue group-hover:text-crimson-red transition-colors leading-snug truncate">
                            {event.name}
                        </h3>

                        <div className="flex items-center gap-1.5 text-xs text-steel-gray mt-1 truncate">
                            <MapPin className="w-3.5 h-3.5 text-crimson-red shrink-0" />
                            <span className="truncate">{event.location}</span>
                        </div>
                    </div>
                </div>

                <div className="shrink-0 flex items-center gap-3 self-end sm:self-center">
                    {event.invitationPdf && (
                        <a
                            href={event.invitationPdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 text-xs font-bold text-crimson-red bg-crimson-red/10 hover:bg-crimson-red hover:text-white px-3 py-1.5 rounded-lg transition-colors"
                            title="Descargar Invitación PDF"
                        >
                            <FileText className="w-3.5 h-3.5" />
                            <span>PDF</span>
                        </a>
                    )}
                    <span className="text-crimson-red font-black text-[11px] uppercase tracking-wider hidden sm:inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Ver <ExternalLink className="w-3 h-3" />
                    </span>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="page-container section-padding">
            {/* Header */}
            <header className="mb-12 sm:mb-16 animate-fade-up">
                <span className="text-crimson-red font-black text-xs sm:text-sm uppercase tracking-[0.25em] block mb-3">
                    Agenda Oficial FECOKA
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-midnight-blue tracking-tighter uppercase leading-tight mb-4">
                    Calendario de <span className="text-crimson-red">Eventos</span>
                </h1>
                <p className="max-w-2xl text-steel-gray text-base sm:text-lg font-medium leading-relaxed">
                    Torneos, seminarios y actividades programadas para la temporada deportiva oficial.
                </p>
                <div className="h-1.5 w-20 bg-midnight-blue mt-6 rounded-full" />
            </header>

            {loading && (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="w-12 h-12 border-4 border-silver-accent border-t-crimson-red rounded-full animate-spin" />
                    <p className="text-midnight-blue font-black uppercase tracking-wider text-xs">Cargando eventos...</p>
                </div>
            )}

            {error && !loading && (
                <div className="text-center border border-crimson-red/30 bg-crimson-red/5 rounded-2xl p-8 max-w-lg mx-auto">
                    <p className="text-crimson-red font-black text-base uppercase tracking-wider mb-2">Error de Conexión</p>
                    <p className="text-steel-gray text-sm">{error}</p>
                </div>
            )}

            {!loading && !error && events.length === 0 && (
                <div className="text-center border border-silver-accent bg-white rounded-2xl p-12 max-w-lg mx-auto shadow-xs">
                    <CalendarIcon className="w-12 h-12 text-silver-accent mx-auto mb-3 opacity-60" />
                    <p className="text-steel-gray font-bold text-base">Sin eventos próximos</p>
                </div>
            )}

            {!loading && !error && events.length > 0 && (
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 animate-fade-up">
                    {/* National Column */}
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between pb-3 mb-5 border-b border-silver-accent">
                            <h2 className="text-lg font-black text-midnight-blue uppercase tracking-tight flex items-center gap-2">
                                <Map className="w-4 h-4 text-crimson-red" />
                                Nacionales
                            </h2>
                            <span className="text-xs font-bold text-steel-gray bg-mist-white border border-silver-accent px-2.5 py-0.5 rounded-full">
                                {nationalEvents.length} eventos
                            </span>
                        </div>

                        <div className="flex flex-col gap-3">
                            {nationalEvents.length > 0 ? (
                                nationalEvents.map((event: any) => (
                                    <EventRow key={event._id} event={event} />
                                ))
                            ) : (
                                <div className="p-8 text-center text-steel-gray/60 font-medium text-sm bg-white rounded-xl border border-silver-accent">
                                    No hay eventos nacionales programados
                                </div>
                            )}
                        </div>
                    </div>

                    {/* International Column */}
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between pb-3 mb-5 border-b border-silver-accent">
                            <h2 className="text-lg font-black text-midnight-blue uppercase tracking-tight flex items-center gap-2">
                                <Globe className="w-4 h-4 text-midnight-blue" />
                                Internacionales
                            </h2>
                            <span className="text-xs font-bold text-steel-gray bg-mist-white border border-silver-accent px-2.5 py-0.5 rounded-full">
                                {internationalEvents.length} eventos
                            </span>
                        </div>

                        <div className="flex flex-col gap-3">
                            {internationalEvents.length > 0 ? (
                                internationalEvents.map((event: any) => (
                                    <EventRow key={event._id} event={event} />
                                ))
                            ) : (
                                <div className="p-8 text-center text-steel-gray/60 font-medium text-sm bg-white rounded-xl border border-silver-accent">
                                    No hay eventos internacionales programados
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Event Detail Modal */}
            <AnimatePresence>
                {selectedEvent && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
                    >
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 bg-midnight-blue/70 backdrop-blur-sm"
                            onClick={() => setSelectedEvent(null)}
                        />

                        {/* Modal Dialog */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 15 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 15 }}
                            transition={{ type: "spring", damping: 30, stiffness: 400 }}
                            className="relative w-full max-w-lg my-auto bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-silver-accent overflow-hidden flex flex-col max-h-[90vh] z-10"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedEvent(null)}
                                className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full flex items-center justify-center bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors z-20"
                                aria-label="Cerrar modal"
                            >
                                <X className="w-4 h-4" strokeWidth={2.5} />
                            </button>

                            {/* Poster Header */}
                            {selectedEvent.poster && (
                                <div className="w-full max-h-[42vh] shrink-0 relative bg-midnight-blue flex items-center justify-center overflow-hidden">
                                    <img
                                        src={selectedEvent.poster}
                                        alt={selectedEvent.name}
                                        className="w-full h-auto max-h-[42vh] object-contain"
                                    />
                                </div>
                            )}

                            {/* Content */}
                            <div className="w-full p-5 sm:p-6 flex flex-col bg-white overflow-y-auto custom-scrollbar">
                                <span className="text-[10px] font-black uppercase tracking-wider text-crimson-red mb-1">
                                    {selectedEvent.scope || 'Nacional'} · {getTypeLabel(selectedEvent.type)}
                                </span>
                                <h2 className="text-xl sm:text-2xl font-black text-midnight-blue mb-5 leading-snug">
                                    {selectedEvent.name}
                                </h2>

                                <div className="space-y-4 text-sm text-steel-gray">
                                    <div className="flex items-start gap-3">
                                        <CalendarIcon className="w-4 h-4 text-crimson-red shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-wider text-steel-gray/70">Fecha</p>
                                            <p className="font-bold text-deep-black">
                                                Del {new Date(selectedEvent.startDate).toLocaleDateString('es-CR', { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' })}
                                                <br />Al {new Date(selectedEvent.endDate).toLocaleDateString('es-CR', { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-4 h-4 text-crimson-red shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-wider text-steel-gray/70">Ubicación</p>
                                            <p className="font-bold text-deep-black">{selectedEvent.location}</p>
                                        </div>
                                    </div>

                                    {selectedEvent.description && (
                                        <div className="pt-3 border-t border-silver-accent text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                                            {selectedEvent.description}
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="mt-6 pt-4 border-t border-silver-accent flex flex-wrap gap-3">
                                    {selectedEvent.invitationPdf && (
                                        <a
                                            href={selectedEvent.invitationPdf}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 inline-flex items-center justify-center gap-2 bg-crimson-red text-white py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-crimson-red/90 transition-colors shadow-xs"
                                        >
                                            <FileText className="w-4 h-4" />
                                            <span>Descargar PDF</span>
                                        </a>
                                    )}
                                    {selectedEvent.externalUrl && (
                                        <a
                                            href={selectedEvent.externalUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 inline-flex items-center justify-center gap-2 bg-midnight-blue text-white py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-midnight-blue/90 transition-colors shadow-xs"
                                        >
                                            <Globe className="w-4 h-4" />
                                            <span>Sitio Oficial</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
