'use client';

import React, { useState, useEffect } from 'react';
import { DataTable } from '@/components/ui/basic-data-table';

// Define NewsItem interface for better type safety
interface NewsItem {
    _id: string;
    title: string;
    content: string;
    category: string;
    images: string[];
    startDate: string;
    endDate?: string;
    publishedAt?: string;
    createdAt?: string;
}

const AdminNewsPage = () => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
    const [loading, setLoading] = useState(false);
    const [localImages, setLocalImages] = useState<{ file: File, preview: string }[]>([]);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'National',
        images: [''],
        startDate: new Date().toISOString().split('T')[0],
        endDate: ''
    });
    const [fetchLoading, setFetchLoading] = useState(true);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        setFetchLoading(true);
        try {
            const res = await fetch('/api/news?admin=true');
            if (res.ok) {
                const data = await res.json();
                setNews(data);
            }
        } catch (error) {
            console.error("Failed to load news:", error);
        } finally {
            setFetchLoading(false);
        }
    };

    const handleEdit = (item: NewsItem) => {
        setEditingItem(item);
        setLocalImages([]); // Clear local images when editing an existing item
        setFormData({
            title: item.title,
            content: item.content,
            category: item.category || 'National',
            images: item.images && item.images.length > 0 ? item.images : [], // Ensure it's an array, potentially empty
            startDate: item.startDate ? new Date(item.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            endDate: item.endDate ? new Date(item.endDate).toISOString().split('T')[0] : ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de que deseas eliminar esta noticia? Esta acción no se puede deshacer.')) return;

        try {
            const res = await fetch('/api/news', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            if (res.ok) {
                fetchNews();
            } else {
                alert('Error al eliminar la noticia');
            }
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let finalImages = [...formData.images];

            // Upload local images first if any
            if (localImages.length > 0) {
                const uploadData = new FormData();
                localImages.forEach(img => uploadData.append('files', img.file));
                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: uploadData
                });
                if (!uploadRes.ok) throw new Error('Fallo al subir imágenes');
                const { urls } = await uploadRes.json();
                finalImages = [...finalImages, ...urls];
            }

            const payload = {
                ...formData,
                images: finalImages.filter(url => url.trim() !== ''), // Filter out empty strings
                startDate: new Date(formData.startDate).toISOString(),
                endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null
            };

            const url = '/api/news'; // API endpoint is the same for POST and PATCH
            const method = editingItem ? 'PATCH' : 'POST';

            if (editingItem) {
                Object.assign(payload, { id: editingItem._id });
            }

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                fetchNews();
                handleCloseModal();
            } else {
                const errorData = await res.json();
                console.error('API Error:', errorData);
                const detailsStr = errorData.details ? JSON.stringify(errorData.details) : '';
                alert(`Error al guardar: ${errorData.error || 'Desconocido'} ${detailsStr}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert(`Error en la operación: ${error instanceof Error ? error.message : 'Desconocido'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleNewNews = () => {
        setIsModalOpen(true);
        setEditingItem(null);
        setLocalImages([]); // Clear local images for new news
        setFormData({
            title: '',
            content: '',
            category: 'National',
            images: [], // Start with an empty array for new news
            startDate: new Date().toISOString().split('T')[0],
            endDate: ''
        });
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
        localImages.forEach(img => URL.revokeObjectURL(img.preview)); // Clean up object URLs
        setLocalImages([]);
        setFormData({
            title: '',
            content: '',
            category: 'National',
            images: [], // Reset to empty array
            startDate: new Date().toISOString().split('T')[0],
            endDate: ''
        });
    };

    return (
        <>
            <div className="animate-fade-up">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-midnight-blue uppercase mb-2">
                            Portal de <span className="text-crimson-red">Noticias</span>
                        </h1>
                        <p className="text-steel-gray font-medium">Administra el pulso informativo y comunicados oficiales de FECOKA.</p>
                    </div>
                    <button
                        onClick={handleNewNews}
                        className="bg-midnight-blue hover:bg-crimson-red text-white px-8 py-4 font-bold transition-all duration-300 flex items-center gap-3 shadow-xl shadow-midnight-blue/10 hover:shadow-crimson-red/20 group"
                    >
                        <div className="w-8 h-8 bg-white/10 flex items-center justify-center group-hover:rotate-90 transition-transform">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                        </div>
                        Nueva Noticia
                    </button>
                </div>

                <div className="bg-mist-white shadow-premium border border-white/80 p-8 lg:p-12">
                    <DataTable
                        data={news}
                        loading={fetchLoading}
                        emptyMessage="No hay noticias registradas"
                        searchPlaceholder="Buscar por título o categoría..."
                        className="border-none shadow-none"
                        columns={[
                            {
                                key: 'title',
                                header: 'Título',
                                sortable: true,
                                render: (_: any, item: any) => (
                                    <div className="flex items-center gap-4 group/item">
                                        <div className="w-1.5 h-10 bg-crimson-red opacity-0 group-hover/item:opacity-100 transition-opacity"></div>
                                        <div>
                                            <p className="font-bold text-midnight-blue group-hover:text-crimson-red transition-colors line-clamp-1">{item.title}</p>
                                            <p className="text-[10px] font-black uppercase text-steel-gray/50 tracking-widest">Publicado</p>
                                        </div>
                                    </div>
                                )
                            },
                            {
                                key: 'category',
                                header: 'Categoría',
                                sortable: true,
                                filterable: true,
                                render: (category: string) => (
                                    <span className={`px-4 py-1.5 font-black uppercase tracking-widest text-[10px] ${category === 'National' ? 'bg-blue-50 text-blue-600' :
                                        category === 'International' ? 'bg-purple-50 text-purple-600' : 'bg-amber-50 text-amber-600'
                                        }`}>
                                        {category === 'National' ? 'Nacional' : category === 'International' ? 'Internacional' : 'Administrativo'}
                                    </span>
                                )
                            },
                            {
                                key: 'publishedAt',
                                header: 'Fecha',
                                sortable: true,
                                render: (_: any, item: any) => (
                                    <div className="flex flex-col">
                                        <span className="font-bold text-midnight-blue">{new Date(item.publishedAt || item.createdAt).toLocaleDateString('es-CR', { day: '2-digit', month: 'short' })}</span>
                                        <span className="text-[10px] text-steel-gray font-bold uppercase">{new Date(item.publishedAt || item.createdAt).getFullYear()}</span>
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
            {/* Modal Nueva/Editar Noticia */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] overflow-y-auto">
                    <div className="fixed inset-0 bg-midnight-blue/80 backdrop-blur-xl transition-opacity" onClick={handleCloseModal} />
                    <div className="flex min-h-full items-center justify-center p-8 sm:p-12 md:p-16">
                        <div className="relative bg-white w-full max-w-[1050px] shadow-[0_32px_128px_-32px_rgba(0,0,0,0.5)] border-2 border-midnight-blue/20 overflow-hidden animate-in fade-in zoom-in duration-500 ease-out flex flex-col max-h-[90vh]">
                            <div className="flex justify-between items-center p-12 sm:p-16 lg:p-24 pb-10 sm:pb-12 lg:pb-14 border-b border-silver-accent/20 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                                <div>
                                    <h2 className="text-3xl font-black text-midnight-blue uppercase leading-tight tracking-tighter">
                                        {editingItem ? 'Editar' : 'Redactar'} <span className="text-crimson-red">Noticia</span>
                                    </h2>
                                    <p className="text-sm text-steel-gray mt-2 font-bold opacity-60 italic">Crea impacto con información precisa y contenido visual.</p>
                                </div>
                                <button onClick={handleCloseModal} className="w-12 h-12 bg-mist-white hover:bg-crimson-red hover:text-white flex items-center justify-center transition-all duration-500 group shadow-md hover:rotate-90">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                                <div className="p-12 sm:p-16 lg:p-24 pt-12 lg:pt-16 overflow-y-auto custom-scrollbar flex-1">
                                    <div className="space-y-12">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                            <div className="lg:col-span-2">
                                                <label className="block text-[11px] font-black text-midnight-blue uppercase tracking-[0.25em] mb-4 ml-3">Título de la Noticia <span className="text-crimson-red">*</span></label>
                                                <input
                                                    type="text" required value={formData.title}
                                                    placeholder="Título impactante para la academia..."
                                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                    className="w-full px-8 py-5 bg-mist-white border-2 border-transparent focus:border-midnight-blue focus:bg-white outline-none transition-all font-bold text-lg text-midnight-blue placeholder:text-silver-accent shadow-inner"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-black text-midnight-blue uppercase tracking-[0.25em] mb-4 ml-3">Categoría</label>
                                                <div className="relative">
                                                    <select
                                                        value={formData.category}
                                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                        className="w-full px-8 py-5 bg-mist-white border-2 border-transparent focus:border-midnight-blue focus:bg-white outline-none transition-all font-black text-midnight-blue cursor-pointer appearance-none text-[13px] uppercase tracking-wider"
                                                    >
                                                        <option value="National">🥋 Nacional</option>
                                                        <option value="International">🌎 Internacional</option>
                                                        <option value="Administrative">📁 Administrativo</option>
                                                    </select>
                                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-[11px] font-black text-midnight-blue uppercase tracking-[0.25em] mb-4 ml-3">Inicio</label>
                                                    <input
                                                        type="date"
                                                        required
                                                        value={formData.startDate}
                                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                                        className="w-full px-6 py-5 bg-mist-white border-2 border-transparent focus:border-midnight-blue focus:bg-white outline-none transition-all font-black text-[13px] text-midnight-blue"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-black text-midnight-blue uppercase tracking-[0.25em] mb-4 ml-3">Fin</label>
                                                    <input
                                                        type="date"
                                                        value={formData.endDate}
                                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                                        className="w-full px-6 py-5 bg-mist-white border-2 border-transparent focus:border-midnight-blue focus:bg-white outline-none transition-all font-black text-[13px] text-midnight-blue"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center mb-4 ml-3">
                                                <label className="block text-[11px] font-black text-midnight-blue uppercase tracking-[0.25em]">Galería de Imágenes Visuales</label>
                                                <span className="text-[10px] uppercase font-bold text-steel-gray opacity-50 mr-2">JPG, PNG, WEBP</span>
                                            </div>
                                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                                {/* Existing URLs (if editing) */}
                                                {formData.images.map((url, index) => (
                                                    <div key={`url-${index}`} className="relative aspect-video group/img bg-mist-white border border-silver-accent/20 overflow-hidden animate-fade-in shadow-sm">
                                                        <img src={url} className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105" alt="News Image" />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newImages = formData.images.filter((_, i) => i !== index);
                                                                setFormData({ ...formData, images: newImages });
                                                            }}
                                                            className="absolute top-2 right-2 w-7 h-7 bg-white/90 text-crimson-red hover:bg-crimson-red hover:text-white transition-all flex items-center justify-center shadow-md backdrop-blur-sm"
                                                            title="Eliminar imagen"
                                                        >
                                                            <svg className="w-4 h-4 shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                                                        </button>
                                                    </div>
                                                ))}

                                                {/* Local Uploaded Previews */}
                                                {localImages.map((img, index) => (
                                                    <div key={`local-${index}`} className="relative aspect-video group/img bg-mist-white border border-silver-accent/20 overflow-hidden animate-fade-in shadow-sm">
                                                        <img src={img.preview} className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105" alt="Preview" />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setLocalImages(prev => {
                                                                    const newImages = [...prev];
                                                                    URL.revokeObjectURL(newImages[index].preview);
                                                                    newImages.splice(index, 1);
                                                                    return newImages;
                                                                });
                                                            }}
                                                            className="absolute top-2 right-2 w-7 h-7 bg-white/90 text-crimson-red hover:bg-crimson-red hover:text-white transition-all flex items-center justify-center shadow-md backdrop-blur-sm"
                                                            title="Remover archivo"
                                                        >
                                                            <svg className="w-4 h-4 shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                                                        </button>
                                                    </div>
                                                ))}

                                                {/* Add Local File Button using an invisible file input */}
                                                <div className="relative aspect-video">
                                                    <input
                                                        type="file"
                                                        multiple
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            if (e.target.files) {
                                                                const files = Array.from(e.target.files);
                                                                const newImages = files.map(file => ({
                                                                    file,
                                                                    preview: URL.createObjectURL(file)
                                                                }));
                                                                setLocalImages(prev => [...prev, ...newImages]);
                                                            }
                                                            // Reset value so identical files can be selected again
                                                            e.target.value = '';
                                                        }}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                        title="Seleccionar imágenes de tu PC"
                                                    />
                                                    <div className="w-full h-full border-2 border-dashed border-midnight-blue/20 bg-mist-white/50 flex flex-col items-center justify-center gap-2 group-hover:bg-crimson-red/5 group-hover:border-crimson-red/30 transition-all">
                                                        <div className="w-8 h-8 bg-midnight-blue/5 flex items-center justify-center text-midnight-blue group-hover:text-crimson-red transition-colors">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                                                        </div>
                                                        <span className="text-[9px] font-black uppercase text-midnight-blue tracking-widest text-center px-2">Subir<br />Imágenes</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="block text-[11px] font-black text-midnight-blue uppercase tracking-[0.25em] mb-4 ml-3">Cuerpo del Comunicado <span className="text-crimson-red">*</span></label>
                                            <textarea
                                                required rows={14} value={formData.content}
                                                placeholder="Redacta los detalles oficiales de esta comunicación..."
                                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                                className="w-full px-10 py-8 bg-mist-white border-2 border-transparent focus:border-midnight-blue focus:bg-white outline-none transition-all font-medium text-midnight-blue placeholder:text-silver-accent resize-none custom-scrollbar text-base shadow-inner leading-relaxed"
                                            ></textarea>
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
                                        className="w-full sm:w-auto px-10 py-4 bg-midnight-blue hover:bg-crimson-red text-white font-black uppercase tracking-[0.2em] text-xs transition-all duration-500 shadow-xl hover:shadow-crimson-red/30 flex items-center justify-center gap-3 active:scale-[0.98] group"
                                    >
                                        {loading ? (
                                            <div className="w-5 h-5 border-4 border-white/30 border-t-white animate-spin" />
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                {editingItem ? 'Confirmar' : 'Publicar'}
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

export default AdminNewsPage;
