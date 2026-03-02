'use client';

import React, { useState, useEffect } from 'react';
import { DataTable } from '@/components/ui/basic-data-table';

const AdminRankingsPage = () => {
    const [rankings, setRankings] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [formData, setFormData] = useState({ athleteName: '', category: '', modality: 'Kata', points: 0, position: 1, academy: '' });
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);

    useEffect(() => {
        fetchRankings();
    }, []);

    const fetchRankings = async () => {
        setFetchLoading(true);
        try {
            const res = await fetch('/api/rankings');
            if (res.ok) {
                const data = await res.json();
                setRankings(data);
            }
        } catch (error) {
            console.error("Failed to load rankings:", error);
        } finally {
            setFetchLoading(false);
        }
    };

    const handleEdit = (item: any) => {
        setEditingItem(item);
        setFormData({
            athleteName: item.athleteName,
            category: item.category,
            modality: item.modality || 'Kata',
            points: item.points,
            position: item.position,
            academy: item.academy || ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este registro de ranking?')) return;

        try {
            const res = await fetch('/api/rankings', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            if (res.ok) {
                fetchRankings();
            } else {
                alert('Error al eliminar el registro');
            }
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/rankings', {
                method: editingItem ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingItem ? { id: editingItem._id, ...formData } : formData),
            });
            if (res.ok) {
                setIsModalOpen(false);
                setEditingItem(null);
                fetchRankings();
                setFormData({ athleteName: '', category: '', modality: 'Kata', points: 0, position: 1, academy: '' });
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
        setFormData({ athleteName: '', category: '', modality: 'Kata', points: 0, position: 1, academy: '' });
    };

    return (
        <>
            <div className="animate-fade-up">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-midnight-blue uppercase mb-2">
                            Listas de <span className="text-crimson-red">Ranking</span>
                        </h1>
                        <p className="text-steel-gray font-medium">Actualiza las posiciones oficiales y puntajes del Karate-Do costarricense.</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-midnight-blue hover:bg-crimson-red text-white px-8 py-4 font-bold transition-all duration-300 flex items-center gap-3 shadow-xl shadow-midnight-blue/10 hover:shadow-crimson-red/20 group"
                    >
                        <div className="w-8 h-8 bg-white/10 flex items-center justify-center group-hover:rotate-90 transition-transform">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                        </div>
                        Agregar Atleta
                    </button>
                </div>

                <div className="bg-white shadow-premium border border-white/80 p-8 lg:p-12">
                    <DataTable
                        data={rankings}
                        loading={fetchLoading}
                        emptyMessage="No hay rankings registrados"
                        searchPlaceholder="Buscar por atleta, categoría o academia..."
                        className="border-none shadow-none"
                        columns={[
                            {
                                key: 'position',
                                header: 'Rank',
                                sortable: true,
                                render: (pos: number) => (
                                    <span className="font-black text-2xl text-midnight-blue tracking-tighter opacity-70">
                                        {pos < 10 ? `0${pos}` : pos}°
                                    </span>
                                )
                            },
                            {
                                key: 'athleteName',
                                header: 'Atleta',
                                sortable: true,
                                render: (_: any, item: any) => (
                                    <div className="flex items-center gap-4 group/item">
                                        <div className="w-1.5 h-10 bg-midnight-blue opacity-0 group-hover/item:opacity-100 transition-opacity"></div>
                                        <div>
                                            <p className="font-bold text-midnight-blue group-hover:text-crimson-red transition-colors capitalize">{item.athleteName}</p>
                                            <p className="text-[10px] font-black uppercase text-steel-gray/50 tracking-widest">{item.academy || 'Sin Academia'}</p>
                                        </div>
                                    </div>
                                )
                            },
                            {
                                key: 'category',
                                header: 'Categoría / Modalidad',
                                sortable: true,
                                filterable: true,
                                render: (_: any, item: any) => (
                                    <div className="flex items-center gap-3">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${item.modality === 'Kata' ? 'bg-indigo-50 text-indigo-600' : 'bg-red-50 text-crimson-red'
                                            }`}>
                                            {item.modality}
                                        </span>
                                        <span className="text-xs font-bold text-steel-gray">{item.category}</span>
                                    </div>
                                )
                            },
                            {
                                key: 'points',
                                header: 'Puntos',
                                sortable: true,
                                render: (pts: number) => (
                                    <div className="flex flex-col">
                                        <span className="font-bold text-midnight-blue text-lg">{pts}</span>
                                        <span className="text-[10px] text-steel-gray font-bold uppercase tracking-tighter">pts oficiales</span>
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
            {/* Modal Agregar/Editar Atleta */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] overflow-y-auto">
                    <div className="fixed inset-0 bg-midnight-blue/80 backdrop-blur-xl transition-opacity" onClick={handleCloseModal} />
                    <div className="flex min-h-full items-center justify-center p-8 sm:p-12 md:p-16">
                        <div className="relative bg-white w-full max-w-[850px] shadow-[0_32px_128px_-32px_rgba(0,0,0,0.5)] border-2 border-midnight-blue/20 overflow-hidden animate-in fade-in zoom-in duration-500 ease-out flex flex-col max-h-[90vh]">
                            <div className="flex justify-between items-center p-12 sm:p-16 lg:p-24 pb-10 sm:pb-12 lg:pb-14 border-b border-silver-accent/20 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                                <div>
                                    <h2 className="text-2xl font-black text-midnight-blue uppercase leading-tight tracking-tighter">
                                        {editingItem ? 'Editar' : 'Datos del'} <span className="text-crimson-red">Atleta</span>
                                    </h2>
                                    <p className="text-sm text-steel-gray mt-2 font-bold opacity-60">Registra el puntaje oficial de competencia.</p>
                                </div>
                                <button type="button" onClick={handleCloseModal} className="w-12 h-12 bg-mist-white hover:bg-crimson-red hover:text-white flex items-center justify-center transition-all duration-500 group shadow-md hover:rotate-90">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                                <div className="p-12 sm:p-16 lg:p-24 pt-12 lg:pt-16 overflow-y-auto custom-scrollbar flex-1">
                                    <div className="space-y-12">
                                        <div>
                                            <label className="block text-[11px] font-black text-midnight-blue uppercase tracking-[0.25em] mb-4 ml-3">Nombre Completo del Atleta <span className="text-crimson-red">*</span></label>
                                            <input
                                                type="text" required value={formData.athleteName}
                                                placeholder="Nombre del Atleta"
                                                onChange={(e) => setFormData({ ...formData, athleteName: e.target.value })}
                                                className="w-full px-8 py-5 bg-mist-white border-2 border-transparent focus:border-midnight-blue focus:bg-white outline-none transition-all font-bold text-midnight-blue placeholder:text-silver-accent shadow-inner text-lg"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                            <div>
                                                <label className="block text-[11px] font-black text-midnight-blue uppercase tracking-[0.25em] mb-4 ml-3">Categoría Técnica</label>
                                                <input
                                                    type="text" required value={formData.category}
                                                    placeholder="Ej: Senior Male -75kg"
                                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                    className="w-full px-8 py-5 bg-mist-white border-2 border-transparent focus:border-midnight-blue focus:bg-white outline-none transition-all font-bold text-midnight-blue placeholder:text-silver-accent shadow-inner"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-black text-midnight-blue uppercase tracking-[0.25em] mb-4 ml-3">Modalidad</label>
                                                <div className="relative">
                                                    <select
                                                        value={formData.modality}
                                                        onChange={(e) => setFormData({ ...formData, modality: e.target.value })}
                                                        className="w-full px-8 py-5 bg-mist-white border-2 border-transparent focus:border-midnight-blue focus:bg-white outline-none transition-all font-black text-midnight-blue appearance-none cursor-pointer text-[13px] uppercase tracking-wider"
                                                    >
                                                        <option value="Kata">🥋 Kata</option>
                                                        <option value="Kumite">🥊 Kumite</option>
                                                    </select>
                                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                                            <div>
                                                <label className="block text-[11px] font-black text-midnight-blue uppercase tracking-[0.25em] mb-4 ml-3">Puntaje</label>
                                                <input
                                                    type="number" required value={formData.points}
                                                    onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                                                    className="w-full px-8 py-5 bg-mist-white border-2 border-transparent focus:border-midnight-blue focus:bg-white outline-none transition-all font-black text-[13px] text-midnight-blue shadow-inner"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-black text-midnight-blue uppercase tracking-[0.25em] mb-4 ml-3">Posición</label>
                                                <input
                                                    type="number" required value={formData.position}
                                                    onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) })}
                                                    className="w-full px-8 py-5 bg-mist-white border-2 border-transparent focus:border-midnight-blue focus:bg-white outline-none transition-all font-black text-[13px] text-midnight-blue shadow-inner"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-black text-midnight-blue uppercase tracking-[0.25em] mb-4 ml-3">Academia</label>
                                                <input
                                                    type="text" value={formData.academy}
                                                    placeholder="Club Asociado"
                                                    onChange={(e) => setFormData({ ...formData, academy: e.target.value })}
                                                    className="w-full px-8 py-5 bg-mist-white border-2 border-transparent focus:border-midnight-blue focus:bg-white outline-none transition-all font-bold text-midnight-blue placeholder:text-silver-accent shadow-inner text-[13px]"
                                                />
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

export default AdminRankingsPage;