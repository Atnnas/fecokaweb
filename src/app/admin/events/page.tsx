'use client';

import React, { useState, useEffect } from 'react';
import { DataTable } from '@/components/ui/basic-data-table';

const AdminEventsPage = () => {
    const [events, setEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [formData, setFormData] = useState({ name: '', date: '', location: '', description: '', type: 'Tournament' });
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        setFetchLoading(true);
        try {
            const res = await fetch('/api/events');
            if (res.ok) {
                const data = await res.json();
                setEvents(data);
            }
        } catch (error) {
            console.error("Failed to load events:", error);
        } finally {
            setFetchLoading(false);
        }
    };

    const handleEdit = (item: any) => {
        setEditingItem(item);
        // Format date for input[type="date"]
        const dateObj = new Date(item.date);
        const formattedDate = dateObj.toISOString().split('T')[0];
        setFormData({
            name: item.name,
            date: formattedDate,
            location: item.location,
            description: item.description || '',
            type: item.type || 'Tournament'
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este evento?')) return;

        try {
            const res = await fetch('/api/events', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            if (res.ok) {
                fetchEvents();
            } else {
                alert('Error al eliminar el evento');
            }
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/events', {
                method: editingItem ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingItem ? { id: editingItem._id, ...formData } : formData),
            });
            if (res.ok) {
                setIsModalOpen(false);
                setEditingItem(null);
                fetchEvents();
                setFormData({ name: '', date: '', location: '', description: '', type: 'Tournament' });
            } else {
                const errorData = await res.json();
                console.error('API Error:', errorData);
                const detailsStr = errorData.details ? JSON.stringify(errorData.details) : '';
                alert(`Error al guardar: ${errorData.error || 'Desconocido'} ${detailsStr}`);
            }
        } catch (error) {
            console.error("Submit error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
        setFormData({ name: '', date: '', location: '', description: '', type: 'Tournament' });
    };

    return (
        <>
            <div className="animate-fade-up">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-midnight-blue uppercase mb-2">
                            Calendario <span className="text-crimson-red">Oficial</span>
                        </h1>
                        <p className="text-steel-gray font-medium">Gestión administrativa de torneos, seminarios y reuniones FECOKA.</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-midnight-blue hover:bg-crimson-red text-white px-8 py-4 font-bold transition-all duration-300 flex items-center gap-3 shadow-xl shadow-midnight-blue/10 hover:shadow-crimson-red/20 group"
                    >
                        <div className="w-8 h-8 bg-white/10 flex items-center justify-center group-hover:rotate-90 transition-transform">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                        </div>
                        Programar Evento
                    </button>
                </div>

                <div className="bg-white shadow-premium border border-white/80 p-8 lg:p-12">
                    <DataTable
                        data={events}
                        loading={fetchLoading}
                        emptyMessage="No hay eventos registrados"
                        searchPlaceholder="Buscar por nombre, tipo o ubicación..."
                        className="border-none shadow-none"
                        columns={[
                            {
                                key: 'name',
                                header: 'Evento',
                                sortable: true,
                                render: (_: any, item: any) => (
                                    <div className="flex items-center gap-4 group/item">
                                        <div className={`w-10 h-10 flex items-center justify-center transition-colors ${item.type === 'Tournament' ? 'bg-red-50 text-crimson-red' :
                                            item.type === 'Seminar' ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'
                                            }`}>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-bold text-midnight-blue group-hover:text-crimson-red transition-colors">{item.name}</p>
                                            <p className="text-[10px] font-black uppercase text-steel-gray/50 tracking-widest">{item.type}</p>
                                        </div>
                                    </div>
                                )
                            },
                            {
                                key: 'date',
                                header: 'Fecha',
                                sortable: true,
                                render: (date: string) => (
                                    <div className="flex flex-col">
                                        <span className="font-bold text-midnight-blue">{new Date(date).toLocaleDateString('es-CR', { day: '2-digit', month: 'long' })}</span>
                                        <span className="text-xs text-steel-gray">{new Date(date).getFullYear()}</span>
                                    </div>
                                )
                            },
                            {
                                key: 'location',
                                header: 'Ubicación',
                                sortable: true,
                                filterable: true,
                                render: (location: string) => (
                                    <div className="flex items-center gap-2 text-steel-gray font-medium">
                                        <svg className="w-4 h-4 text-silver-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.828a2 2 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        {location}
                                    </div>
                                )
                            },
                            {
                                key: '_id',
                                header: 'Acciones',
                                render: (id: string, item: any) => (
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="p-2 bg-mist-white hover:bg-midnight-blue hover:text-white transition-all"
                                            title="Editar"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(id)}
                                            className="p-2 bg-mist-white hover:bg-red-500 hover:text-white transition-all"
                                            title="Eliminar"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                )
                            }
                        ]}
                    />
                </div>

            </div>
            {/* Modal Nueva/Editar Evento */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] overflow-y-auto">
                    <div className="fixed inset-0 bg-midnight-blue/80 backdrop-blur-xl transition-opacity" onClick={handleCloseModal} />
                    <div className="flex min-h-full items-center justify-center p-8 sm:p-12 md:p-16">
                        <div className="relative bg-white w-full max-w-[850px] shadow-[0_32px_128px_-32px_rgba(0,0,0,0.5)] border-2 border-midnight-blue/20 overflow-hidden animate-in fade-in zoom-in duration-500 ease-out flex flex-col max-h-[90vh]">
                            <div className="flex justify-between items-center p-12 sm:p-16 lg:p-24 pb-10 sm:pb-12 lg:pb-14 border-b border-silver-accent/20 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                                <div>
                                    <h2 className="text-2xl font-black text-midnight-blue uppercase leading-tight tracking-tighter">
                                        {editingItem ? 'Editar' : 'Programar'} <span className="text-crimson-red">Evento</span>
                                    </h2>
                                    <p className="text-sm text-steel-gray mt-2 font-bold opacity-60">Completa los detalles para la agenda oficial.</p>
                                </div>
                                <button type="button" onClick={handleCloseModal} className="w-12 h-12 bg-mist-white hover:bg-crimson-red hover:text-white flex items-center justify-center transition-all duration-500 group shadow-md hover:rotate-90">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                                <div className="p-12 sm:p-16 lg:p-24 pt-12 lg:pt-16 overflow-y-auto custom-scrollbar flex-1">
                                    <div className="space-y-12">
                                        <div>
                                            <label className="block text-[11px] font-black text-midnight-blue uppercase tracking-[0.25em] mb-4 ml-3">Nombre del Evento <span className="text-crimson-red">*</span></label>
                                            <input
                                                type="text" required value={formData.name}
                                                placeholder="Ej: Open Nacional de Karate 2024"
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-8 py-5 bg-mist-white border-2 border-transparent focus:border-midnight-blue focus:bg-white outline-none transition-all font-bold text-midnight-blue placeholder:text-silver-accent shadow-inner sm:text-lg"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                            <div>
                                                <label className="block text-[11px] font-black text-midnight-blue uppercase tracking-[0.25em] mb-4 ml-3">Fecha del Encuentro</label>
                                                <input
                                                    type="date" required value={formData.date}
                                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                                    className="w-full px-8 py-5 bg-mist-white border-2 border-transparent focus:border-midnight-blue focus:bg-white outline-none transition-all font-black text-[13px] text-midnight-blue"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-black text-midnight-blue uppercase tracking-[0.25em] mb-4 ml-3">Categoría del Evento</label>
                                                <div className="relative">
                                                    <select
                                                        value={formData.type}
                                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                                        className="w-full px-8 py-5 bg-mist-white border-2 border-transparent focus:border-midnight-blue focus:bg-white outline-none transition-all font-black text-midnight-blue appearance-none cursor-pointer text-[13px] uppercase tracking-wider"
                                                    >
                                                        <option value="Tournament">🏆 Torneo</option>
                                                        <option value="Seminar">🎓 Seminario</option>
                                                        <option value="Meeting">🤝 Reunión / Gala</option>
                                                    </select>
                                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-black text-midnight-blue uppercase tracking-[0.25em] mb-4 ml-3">Sede / Ubicación Física</label>
                                            <div className="relative">
                                                <input
                                                    type="text" required value={formData.location}
                                                    placeholder="Ej: BN Arena, Hatillo"
                                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                    className="w-full px-8 py-5 bg-mist-white border-2 border-transparent focus:border-midnight-blue focus:bg-white outline-none transition-all font-bold text-midnight-blue placeholder:text-silver-accent pl-16 shadow-inner"
                                                />
                                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-crimson-red">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.828a2 2 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className="p-12 sm:p-16 lg:p-20 border-t-2 border-mist-white bg-white shrink-0 flex flex-col sm:flex-row items-center justify-end gap-6">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        disabled={loading}
                                        className="w-full sm:w-auto px-10 py-5 bg-transparent border-2 border-steel-gray/30 text-steel-gray hover:border-midnight-blue hover:text-midnight-blue hover:bg-mist-white font-black uppercase tracking-[0.2em] text-xs transition-all duration-300 shadow-none"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full sm:w-auto px-10 py-5 bg-midnight-blue hover:bg-crimson-red text-white font-black uppercase tracking-[0.2em] text-xs transition-all duration-500 shadow-xl hover:shadow-crimson-red/30 flex items-center justify-center gap-3 active:scale-[0.98] group"
                                    >
                                        {loading ? (
                                            <div className="w-5 h-5 border-4 border-white/30 border-t-white animate-spin" />
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                                {editingItem ? 'Actualizar' : 'Confirmar'}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminEventsPage;
