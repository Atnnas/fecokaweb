'use client';

import React, { useState, useEffect } from 'react';
import { DataTable } from '@/components/ui/basic-data-table';
import { motion, AnimatePresence } from 'framer-motion';

interface Sponsor {
    _id: string;
    name: string;
    logoUrl: string;
    websiteUrl?: string;
    tier: 'gold' | 'silver' | 'bronze';
    isActive: boolean;
    order: number;
    contractStart?: string;
    contractEnd?: string;
}

const AdminSponsorsPage = () => {
    const [sponsors, setSponsors] = useState<Sponsor[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Sponsor | null>(null);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [logoFile, setLogoFile] = useState<{ file: File, preview: string } | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        logoUrl: '',
        websiteUrl: '',
        tier: 'silver' as 'gold' | 'silver' | 'bronze',
        isActive: true,
        order: 0,
        contractStart: new Date().toISOString().split('T')[0],
        contractEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchSponsors();
    }, []);

    const fetchSponsors = async () => {
        setFetchLoading(true);
        try {
            const res = await fetch('/api/sponsors?admin=true');
            if (res.ok) {
                const data = await res.json();
                setSponsors(data);
            }
        } catch (error) {
            console.error("Failed to load sponsors:", error);
        } finally {
            setFetchLoading(false);
        }
    };

    const handleEdit = (item: Sponsor) => {
        setEditingItem(item);
        setLogoFile(null);
        setFormData({
            name: item.name,
            logoUrl: item.logoUrl,
            websiteUrl: item.websiteUrl || '',
            tier: item.tier || 'silver',
            isActive: item.isActive ?? true,
            order: item.order || 0,
            contractStart: item.contractStart ? new Date(item.contractStart).toISOString().split('T')[0] : '',
            contractEnd: item.contractEnd ? new Date(item.contractEnd).toISOString().split('T')[0] : ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este patrocinador? Esta acción no se puede deshacer.')) return;

        try {
            const res = await fetch('/api/sponsors', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            if (res.ok) {
                fetchSponsors();
            } else {
                alert('Error al eliminar el patrocinador');
            }
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let finalLogoUrl = formData.logoUrl;

            // Upload logo if changed
            if (logoFile) {
                console.log("Starting upload to /api/upload...");
                const uploadData = new FormData();
                uploadData.append('files', logoFile.file);

                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: uploadData
                });
                if (!uploadRes.ok) throw new Error('Fallo al subir logo');
                const { urls } = await uploadRes.json();
                finalLogoUrl = urls[0];
            }

            const payload = {
                ...formData,
                logoUrl: finalLogoUrl,
                contractStart: formData.contractStart ? new Date(formData.contractStart).toISOString() : null,
                contractEnd: formData.contractEnd ? new Date(formData.contractEnd).toISOString() : null
            };

            const method = editingItem ? 'PATCH' : 'POST';
            if (editingItem) {
                Object.assign(payload, { id: editingItem._id });
            }

            const res = await fetch('/api/sponsors', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                fetchSponsors();
                handleCloseModal();
            } else {
                const errorData = await res.json();
                const details = errorData.details ? JSON.stringify(errorData.details) : '';
                alert(`Error al guardar: ${errorData.error || 'Desconocido'}. ${details}`);
            }
        } catch (error) {
            console.error('Submit error:', error);
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                alert('Error de conexión con el servidor de subida. Por favor, verifica que el servidor esté funcionando.');
            } else {
                alert(`Error: ${error instanceof Error ? error.message : 'Desconocido'}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleNewSponsor = () => {
        setIsModalOpen(true);
        setEditingItem(null);
        setLogoFile(null);
        setFormData({
            name: '',
            logoUrl: '',
            websiteUrl: '',
            tier: 'silver',
            isActive: true,
            order: 0,
            contractStart: new Date().toISOString().split('T')[0],
            contractEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
        });
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
        if (logoFile) URL.revokeObjectURL(logoFile.preview);
        setLogoFile(null);
    };

    return (
        <>
            <div className="animate-fade-up">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-midnight-blue uppercase mb-2">
                            Gestión de <span className="text-crimson-red">Patrocinadores</span>
                        </h1>
                        <p className="text-steel-gray font-medium">Administra las marcas y convenios oficiales que apoyan a FECOKA.</p>
                    </div>
                    <button
                        onClick={handleNewSponsor}
                        className="bg-midnight-blue hover:bg-crimson-red text-white px-8 py-4 font-bold transition-all duration-300 flex items-center gap-3 shadow-xl shadow-midnight-blue/10 hover:shadow-crimson-red/20 group"
                    >
                        <div className="w-8 h-8 bg-white/10 flex items-center justify-center group-hover:rotate-90 transition-transform">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                        </div>
                        Nuevo Patrocinador
                    </button>
                </div>

                <div className="bg-mist-white shadow-premium border border-white/80 p-8 lg:p-12">
                    <DataTable
                        data={sponsors}
                        loading={fetchLoading}
                        emptyMessage="No hay patrocinadores registrados"
                        searchPlaceholder="Buscar por nombre..."
                        className="border-none shadow-none"
                        columns={[
                            {
                                key: 'name',
                                header: 'Patrocinador',
                                sortable: true,
                                render: (_: any, item: Sponsor) => (
                                    <div className="flex items-center gap-4 group/item">
                                        <div className="w-1.5 h-12 bg-crimson-red opacity-0 group-hover/item:opacity-100 transition-opacity"></div>
                                        <div className="w-12 h-12 bg-white p-2 border border-silver-accent/20 flex items-center justify-center shrink-0">
                                            <img src={item.logoUrl} alt={item.name} className="max-h-full max-w-full object-contain" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-midnight-blue group-hover:text-crimson-red transition-colors line-clamp-1 uppercase tracking-tight">{item.name}</p>
                                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${item.tier === 'gold' ? 'bg-amber-100 text-amber-600' :
                                                item.tier === 'silver' ? 'bg-slate-100 text-slate-600' : 'bg-orange-100 text-orange-600'
                                                }`}>{item.tier === 'gold' ? 'Oro' : item.tier === 'silver' ? 'Plata' : 'Bronce'}</span>
                                        </div>
                                    </div>
                                )
                            },
                            {
                                key: 'contractEnd',
                                header: 'Vigencia',
                                sortable: true,
                                render: (_: any, item: Sponsor) => {
                                    const end = item.contractEnd ? new Date(item.contractEnd) : null;
                                    const isExpired = end ? end < new Date() : false;
                                    return (
                                        <div className="flex flex-col">
                                            <span className={`font-bold ${isExpired ? 'text-red-500' : 'text-midnight-blue'}`}>
                                                {end ? end.toLocaleDateString('es-CR', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Indefinido'}
                                            </span>
                                            <span className="text-[10px] text-steel-gray/50 font-black uppercase tracking-widest">Fin de Contrato</span>
                                        </div>
                                    );
                                }
                            },
                            {
                                key: 'isActive',
                                header: 'Estado',
                                filterable: true,
                                render: (isActive: boolean) => (
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-green-600' : 'text-red-600'}`}>
                                            {isActive ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </div>
                                )
                            },
                            {
                                key: '_id',
                                header: 'Acciones',
                                render: (id: string, item: Sponsor) => (
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
                                            className="p-2 bg-mist-white hover:bg-red-500 hover:text-white transition-all shadow-sm"
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

            {/* Modal Nueva/Editar Patrocinador */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-midnight-blue/80 backdrop-blur-xl transition-opacity"
                            onClick={handleCloseModal}
                        />
                        <div className="flex min-h-full items-center justify-center p-8 sm:p-12 md:p-16">
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                className="relative bg-white w-full max-w-[950px] shadow-[0_32px_128px_-32px_rgba(0,0,0,0.5)] border-2 border-midnight-blue/20 overflow-hidden flex flex-col max-h-[90vh]"
                            >
                                {/* Modal Header */}
                                <div className="flex justify-between items-center p-10 sm:p-12 lg:p-16 pb-8 border-b border-silver-accent/20 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                                    <div>
                                        <h2 className="text-3xl font-black text-midnight-blue uppercase leading-tight tracking-tighter">
                                            {editingItem ? 'Editar' : 'Nuevo'} <span className="text-crimson-red">Patrocinador</span>
                                        </h2>
                                        <p className="text-sm text-steel-gray mt-2 font-bold opacity-60 italic">Administra la presencia de marca y duración de convenios.</p>
                                    </div>
                                    <button onClick={handleCloseModal} className="w-12 h-12 bg-mist-white hover:bg-crimson-red hover:text-white flex items-center justify-center transition-all duration-500 group shadow-md hover:rotate-90">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                                    <div className="p-10 sm:p-12 lg:p-16 pt-10 overflow-y-auto flex-1 custom-scrollbar">
                                        <div className="space-y-10">
                                            {/* Name and Website */}
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                <div className="lg:col-span-1">
                                                    <label className="block text-[11px] font-black text-midnight-blue uppercase tracking-[0.25em] mb-4 ml-3">Nombre de la Empresa <span className="text-crimson-red">*</span></label>
                                                    <input
                                                        type="text" required value={formData.name}
                                                        placeholder="Ej: Adidas, Nike, Academias Unidas..."
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        className="w-full px-8 py-5 bg-mist-white border-2 border-transparent focus:border-midnight-blue focus:bg-white outline-none transition-all font-bold text-lg text-midnight-blue placeholder:text-silver-accent shadow-inner"
                                                    />
                                                </div>
                                                <div className="lg:col-span-1">
                                                    <label className="block text-[11px] font-black text-midnight-blue uppercase tracking-[0.25em] mb-4 ml-3">Sitio Web Oficial</label>
                                                    <input
                                                        type="url" value={formData.websiteUrl}
                                                        placeholder="https://www.ejemplo.com"
                                                        onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                                                        className="w-full px-8 py-5 bg-mist-white border-2 border-transparent focus:border-midnight-blue focus:bg-white outline-none transition-all font-bold text-lg text-midnight-blue placeholder:text-silver-accent shadow-inner"
                                                    />
                                                </div>
                                            </div>

                                            {/* Logo Upload Section */}
                                            <div className="space-y-4">
                                                <label className="block text-[11px] font-black text-midnight-blue uppercase tracking-[0.25em] mb-4 ml-3">Identidad Visual (Logo)</label>
                                                <div className="flex flex-col md:flex-row items-center gap-8 bg-mist-white/50 p-8 border-2 border-dashed border-midnight-blue/10">
                                                    <div className="w-32 h-32 bg-white shadow-premium flex items-center justify-center p-4 shrink-0 transition-transform hover:scale-105 duration-300">
                                                        {(logoFile || formData.logoUrl) ? (
                                                            <img src={logoFile?.preview || formData.logoUrl} className="max-h-full max-w-full object-contain" alt="Logo preview" />
                                                        ) : (
                                                            <div className="text-center">
                                                                <svg className="w-10 h-10 text-silver-accent mx-auto mb-2 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                                <span className="text-[10px] font-bold text-silver-accent">SIN LOGO</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 text-center md:text-left">
                                                        <h4 className="font-black text-midnight-blue uppercase text-sm mb-2 tracking-tight">Cambiar Imagen de Marca</h4>
                                                        <p className="text-xs text-steel-gray font-medium mb-6 leading-relaxed">Sube un archivo PNG con fondo transparente o SVG para una visualización premium en la cinta de patrocinadores.</p>
                                                        <input
                                                            type="file" accept="image/*"
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) setLogoFile({ file, preview: URL.createObjectURL(file) });
                                                            }}
                                                            className="hidden" id="logo-upload"
                                                        />
                                                        <label htmlFor="logo-upload" className="inline-flex items-center gap-3 px-8 py-3 bg-midnight-blue hover:bg-crimson-red text-white font-black text-[10px] uppercase tracking-widest cursor-pointer transition-all shadow-lg active:scale-95">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                                            Seleccionar Archivo
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Tier, Order and Status */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                                <div>
                                                    <label className="block text-[11px] font-black text-midnight-blue uppercase tracking-[0.25em] mb-4 ml-3">Nivel de Patrocinio</label>
                                                    <div className="relative">
                                                        <select
                                                            value={formData.tier}
                                                            onChange={(e) => setFormData({ ...formData, tier: e.target.value as any })}
                                                            className="w-full px-8 py-5 bg-mist-white border-2 border-transparent focus:border-midnight-blue focus:bg-white outline-none transition-all font-black text-midnight-blue cursor-pointer appearance-none text-[13px] uppercase tracking-wider"
                                                        >
                                                            <option value="gold">🥇 Oro (Principal)</option>
                                                            <option value="silver">🥈 Plata (Aliado)</option>
                                                            <option value="bronze">🥉 Bronce (Colaborador)</option>
                                                        </select>
                                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-black text-midnight-blue uppercase tracking-[0.25em] mb-4 ml-3">Orden de Aparición</label>
                                                    <input
                                                        type="number" value={formData.order}
                                                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                                        className="w-full px-8 py-5 bg-mist-white border-2 border-transparent focus:border-midnight-blue focus:bg-white outline-none transition-all font-black text-[13px] text-midnight-blue"
                                                    />
                                                </div>
                                                <div className="flex flex-col justify-end pb-1">
                                                    <label className="flex items-center gap-3 cursor-pointer group bg-mist-white px-8 py-5 border-2 border-transparent hover:border-midnight-blue transition-all">
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.isActive}
                                                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                                            className="sr-only"
                                                        />
                                                        <div className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 ${formData.isActive ? 'bg-green-500' : 'bg-steel-gray/30'}`}>
                                                            <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-md ${formData.isActive ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                                        </div>
                                                        <span className="text-[11px] font-black uppercase text-midnight-blue tracking-wider">Patrocinador Activo</span>
                                                    </label>
                                                </div>
                                            </div>

                                            {/* Contract Dates */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div>
                                                    <label className="block text-[11px] font-black text-midnight-blue uppercase tracking-[0.25em] mb-4 ml-3">Inicio de Convenio</label>
                                                    <input
                                                        type="date"
                                                        required
                                                        value={formData.contractStart}
                                                        onChange={(e) => setFormData({ ...formData, contractStart: e.target.value })}
                                                        className="w-full px-8 py-5 bg-mist-white border-2 border-transparent focus:border-midnight-blue focus:bg-white outline-none transition-all font-black text-[13px] text-midnight-blue"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-black text-midnight-blue uppercase tracking-[0.25em] mb-4 ml-3">Fin de Convenio</label>
                                                    <input
                                                        type="date"
                                                        required
                                                        value={formData.contractEnd}
                                                        onChange={(e) => setFormData({ ...formData, contractEnd: e.target.value })}
                                                        className="w-full px-8 py-5 bg-mist-white border-2 border-transparent focus:border-midnight-blue focus:bg-white outline-none transition-all font-black text-[13px] text-midnight-blue"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Modal Footer */}
                                    <div className="p-10 sm:p-12 lg:p-14 border-t-2 border-mist-white bg-white shrink-0 flex flex-col sm:flex-row items-center justify-end gap-6">
                                        <button
                                            type="button"
                                            onClick={handleCloseModal}
                                            disabled={loading}
                                            className="w-full sm:w-auto px-10 py-5 bg-transparent border-2 border-steel-gray/30 text-steel-gray hover:border-midnight-blue hover:text-midnight-blue hover:bg-mist-white font-black uppercase tracking-[0.2em] text-xs transition-all duration-300"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full sm:w-auto px-10 py-4 bg-midnight-blue hover:bg-crimson-red text-white font-black uppercase tracking-[0.2em] text-xs transition-all duration-500 shadow-xl hover:shadow-crimson-red/30 flex items-center justify-center gap-3 active:scale-[0.98] group"
                                        >
                                            {loading ? (
                                                <div className="w-5 h-5 border-4 border-white/30 border-t-white animate-spin" />
                                            ) : (
                                                <>
                                                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                    {editingItem ? 'Actualizar' : 'Registrar'}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AdminSponsorsPage;
