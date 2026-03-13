'use client';

import React, { useState, useEffect } from 'react';
import { DataTable } from '@/components/ui/basic-data-table';

const AdminAcademiesPage = () => {
    const [academies, setAcademies] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: '',
        instructor: '',
        location: '',
        contact: '',
        logo: '',
        instructorPhoto: '',
        website: '',
        isActive: true
    });
    const [logoFile, setLogoFile] = useState<{ file: File, preview: string } | null>(null);
    const [instructorFile, setInstructorFile] = useState<{ file: File, preview: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);

    useEffect(() => {
        fetchAcademies();
    }, []);

    const fetchAcademies = async () => {
        setFetchLoading(true);
        try {
            const res = await fetch('/api/academies');
            if (res.ok) {
                const data = await res.json();
                setAcademies(data);
            }
        } catch (error) {
            console.error("Failed to load academies:", error);
        } finally {
            setFetchLoading(false);
        }
    };

    const handleEdit = (item: any) => {
        setEditingItem(item);
        setLogoFile(null);
        setInstructorFile(null);
        setFormData({
            name: item.name,
            instructor: item.instructor,
            location: item.location,
            contact: item.contact || '',
            logo: item.logo || '',
            instructorPhoto: item.instructorPhoto || '',
            website: item.website || '',
            isActive: item.isActive ?? true
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de que deseas eliminar esta academia?')) return;

        try {
            const res = await fetch('/api/academies', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            if (res.ok) {
                fetchAcademies();
            } else {
                alert('Error al eliminar la academia');
            }
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            let logoUrl = formData.logo;
            let instructorPhotoUrl = formData.instructorPhoto;

            // Upload Logo
            if (logoFile) {
                const uploadData = new FormData();
                uploadData.append('files', logoFile.file);
                const uploadRes = await fetch('/api/upload', { method: 'POST', body: uploadData });
                if (!uploadRes.ok) throw new Error('Error al subir el logo');
                const { urls } = await uploadRes.json();
                logoUrl = urls[0];
            }

            // Upload Instructor Photo
            if (instructorFile) {
                const uploadData = new FormData();
                uploadData.append('files', instructorFile.file);
                const uploadRes = await fetch('/api/upload', { method: 'POST', body: uploadData });
                if (!uploadRes.ok) throw new Error('Error al subir la foto del instructor');
                const { urls } = await uploadRes.json();
                instructorPhotoUrl = urls[0];
            }

            const payload = {
                ...formData,
                logo: logoUrl,
                instructorPhoto: instructorPhotoUrl
            };

            const res = await fetch('/api/academies', {
                method: editingItem ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingItem ? { id: editingItem._id, ...payload } : payload),
            });
            if (res.ok) {
                handleCloseModal();
                fetchAcademies();
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
        if (logoFile) URL.revokeObjectURL(logoFile.preview);
        if (instructorFile) URL.revokeObjectURL(instructorFile.preview);
        setLogoFile(null);
        setInstructorFile(null);
        setFormData({ name: '', instructor: '', location: '', contact: '', logo: '', instructorPhoto: '', website: '', isActive: true });
    };

    return (
        <>
            <div className="animate-fade-up">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-midnight-blue uppercase mb-2">
                            Academias <span className="text-crimson-red">Afiliadas</span>
                        </h1>
                        <p className="text-steel-gray font-medium">Gestiona las organizaciones oficiales federadas en el país.</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-midnight-blue hover:bg-crimson-red text-white px-8 py-4 font-bold transition-all duration-300 flex items-center gap-3 shadow-xl shadow-midnight-blue/10 hover:shadow-crimson-red/20 group"
                    >
                        <div className="w-8 h-8 bg-white/10 flex items-center justify-center group-hover:rotate-90 transition-transform">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                        </div>
                        Registrar Academia
                    </button>
                </div>

                <div className="bg-white shadow-premium border border-white/80 p-8 lg:p-12">
                    <DataTable
                        data={academies}
                        loading={fetchLoading}
                        emptyMessage="No hay academias registradas"
                        searchPlaceholder="Buscar por nombre, instructor o ubicación..."
                        className="border-none shadow-none"
                        columns={[
                            {
                                key: 'name',
                                header: 'Academia',
                                sortable: true,
                                render: (name: string, item: any) => (
                                    <div className="flex items-center gap-4 group/item">
                                        <div className="w-1.5 h-10 bg-crimson-red opacity-0 group-hover/item:opacity-100 transition-opacity"></div>
                                        <div>
                                            <p className="font-bold text-midnight-blue group-hover:text-crimson-red transition-colors capitalize">{name}</p>
                                            <p className="text-[10px] font-black uppercase text-steel-gray/50 tracking-widest">{item.location}</p>
                                        </div>
                                    </div>
                                )
                            },
                            {
                                key: 'instructor',
                                header: 'Instructor Principal',
                                sortable: true,
                                render: (instructor: string) => (
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-mist-white flex items-center justify-center text-midnight-blue font-bold text-xs uppercase">
                                            {instructor.charAt(0)}
                                        </div>
                                        <span className="font-bold text-midnight-blue text-sm">{instructor}</span>
                                    </div>
                                )
                            },
                            {
                                key: 'contact',
                                header: 'Contacto',
                                render: (contact: string) => (
                                    <span className="text-xs font-bold text-steel-gray">{contact || 'No especificado'}</span>
                                )
                            },
                            {
                                key: 'isActive',
                                header: 'Estado',
                                render: (active: boolean) => (
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${active ? 'bg-green-50 text-green-600' : 'bg-red-50 text-crimson-red'}`}>
                                        {active ? 'Activa' : 'Inactiva'}
                                    </span>
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

            {/* Modal Agregar/Editar Academia */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] overflow-y-auto">
                    <div className="fixed inset-0 bg-midnight-blue/80 backdrop-blur-xl transition-opacity" onClick={handleCloseModal} />
                    <div className="flex min-h-full items-center justify-center p-8 sm:p-12 md:p-16">
                        <div className="relative bg-white w-full max-w-[850px] shadow-[0_32px_128px_-32px_rgba(0,0,0,0.5)] border-2 border-midnight-blue/20 overflow-hidden animate-in fade-in zoom-in duration-500 ease-out flex flex-col max-h-[90vh]">
                            <div className="flex justify-between items-center p-12 sm:p-16 lg:p-24 pb-10 sm:pb-12 lg:pb-14 border-b border-silver-accent/20 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                                <div>
                                    <h2 className="text-2xl font-black text-midnight-blue uppercase leading-tight tracking-tighter">
                                        {editingItem ? 'Editar' : 'Registro de'} <span className="text-crimson-red">Academia</span>
                                    </h2>
                                    <p className="text-sm text-steel-gray mt-2 font-bold opacity-60">Información oficial de la entidad federada.</p>
                                </div>
                                <button type="button" onClick={handleCloseModal} className="w-12 h-12 bg-mist-white hover:bg-crimson-red hover:text-white flex items-center justify-center transition-all duration-500 group shadow-md hover:rotate-90">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                                <div className="p-12 sm:p-16 lg:p-24 pt-12 lg:pt-16 overflow-y-auto custom-scrollbar flex-1">
                                    <div className="space-y-12">
                                        <div>
                                            <label className="block text-[11px] font-black text-midnight-blue uppercase tracking-[0.25em] mb-4 ml-3">Nombre de la Organización <span className="text-crimson-red">*</span></label>
                                            <input
                                                type="text" required value={formData.name}
                                                placeholder="Ej: Dojo Central FECOKA"
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-8 py-5 bg-mist-white border-2 border-transparent focus:border-midnight-blue focus:bg-white outline-none transition-all font-bold text-midnight-blue placeholder:text-silver-accent shadow-inner text-lg"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                            <div>
                                                <label className="block text-[11px] font-black text-midnight-blue uppercase tracking-[0.25em] mb-4 ml-3">Instructor Principal</label>
                                                <input
                                                    type="text" required value={formData.instructor}
                                                    placeholder="Nombre del Sensei"
                                                    onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                                                    className="w-full px-8 py-5 bg-mist-white border-2 border-transparent focus:border-midnight-blue focus:bg-white outline-none transition-all font-bold text-midnight-blue placeholder:text-silver-accent shadow-inner"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-black text-midnight-blue uppercase tracking-[0.25em] mb-4 ml-3">Ubicación (Ciudad)</label>
                                                <input
                                                    type="text" required value={formData.location}
                                                    placeholder="Ej: Sabana, San José"
                                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                    className="w-full px-8 py-5 bg-mist-white border-2 border-transparent focus:border-midnight-blue focus:bg-white outline-none transition-all font-bold text-midnight-blue placeholder:text-silver-accent shadow-inner"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center ml-3">
                                                    <label className="block text-[11px] font-black text-midnight-blue uppercase tracking-[0.25em]">Logo del Dojo</label>
                                                </div>
                                                <div className="relative aspect-square w-full sm:w-48 bg-mist-white border border-silver-accent/20 overflow-hidden shadow-sm group/img mx-auto sm:mx-0">
                                                    {(logoFile?.preview || formData.logo) ? (
                                                        <>
                                                            <img src={logoFile?.preview || formData.logo} className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105" alt="Logo" />
                                                            <button
                                                                type="button"
                                                                onClick={() => { setLogoFile(null); setFormData({ ...formData, logo: '' }); }}
                                                                className="absolute top-2 right-2 w-7 h-7 bg-white/90 text-crimson-red hover:bg-crimson-red hover:text-white transition-all flex items-center justify-center shadow-md backdrop-blur-sm"
                                                            >
                                                                <svg className="w-4 h-4 shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <input
                                                                type="file" accept="image/*"
                                                                onChange={(e) => {
                                                                    if (e.target.files && e.target.files[0]) {
                                                                        const file = e.target.files[0];
                                                                        setLogoFile({ file, preview: URL.createObjectURL(file) });
                                                                    }
                                                                }}
                                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                            />
                                                            <div className="w-full h-full border-2 border-dashed border-midnight-blue/20 bg-mist-white/50 flex flex-col items-center justify-center gap-2 group-hover:bg-crimson-red/5 group-hover:border-crimson-red/30 transition-all">
                                                                <div className="w-8 h-8 bg-midnight-blue/5 flex items-center justify-center text-midnight-blue group-hover:text-crimson-red transition-colors">
                                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                                                                </div>
                                                                <span className="text-[9px] font-black uppercase text-midnight-blue tracking-widest text-center px-2">Subir<br />Logo</span>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center ml-3">
                                                    <label className="block text-[11px] font-black text-midnight-blue uppercase tracking-[0.25em]">Foto del Instructor</label>
                                                </div>
                                                <div className="relative aspect-square w-full sm:w-48 bg-mist-white border border-silver-accent/20 overflow-hidden shadow-sm group/img mx-auto sm:mx-0">
                                                    {(instructorFile?.preview || formData.instructorPhoto) ? (
                                                        <>
                                                            <img src={instructorFile?.preview || formData.instructorPhoto} className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105" alt="Instructor" />
                                                            <button
                                                                type="button"
                                                                onClick={() => { setInstructorFile(null); setFormData({ ...formData, instructorPhoto: '' }); }}
                                                                className="absolute top-2 right-2 w-7 h-7 bg-white/90 text-crimson-red hover:bg-crimson-red hover:text-white transition-all flex items-center justify-center shadow-md backdrop-blur-sm"
                                                            >
                                                                <svg className="w-4 h-4 shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <input
                                                                type="file" accept="image/*"
                                                                onChange={(e) => {
                                                                    if (e.target.files && e.target.files[0]) {
                                                                        const file = e.target.files[0];
                                                                        setInstructorFile({ file, preview: URL.createObjectURL(file) });
                                                                    }
                                                                }}
                                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                            />
                                                            <div className="w-full h-full border-2 border-dashed border-midnight-blue/20 bg-mist-white/50 flex flex-col items-center justify-center gap-2 group-hover:bg-crimson-red/5 group-hover:border-crimson-red/30 transition-all">
                                                                <div className="w-8 h-8 bg-midnight-blue/5 flex items-center justify-center text-midnight-blue group-hover:text-crimson-red transition-colors">
                                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                                                </div>
                                                                <span className="text-[9px] font-black uppercase text-midnight-blue tracking-widest text-center px-2">Subir<br />Foto</span>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                            <div>
                                                <label className="block text-[11px] font-black text-midnight-blue uppercase tracking-[0.25em] mb-4 ml-3">Contacto Directo</label>
                                                <input
                                                    type="text" value={formData.contact}
                                                    placeholder="+506 8000-0000"
                                                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                                    className="w-full px-8 py-5 bg-mist-white border-2 border-transparent focus:border-midnight-blue focus:bg-white outline-none transition-all font-bold text-midnight-blue placeholder:text-silver-accent shadow-inner"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-black text-midnight-blue uppercase tracking-[0.25em] mb-4 ml-3">Plataforma Web / Social</label>
                                                <input
                                                    type="text" value={formData.website}
                                                    placeholder="www.academia.com"
                                                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                                    className="w-full px-8 py-5 bg-mist-white border-2 border-transparent focus:border-midnight-blue focus:bg-white outline-none transition-all font-bold text-midnight-blue placeholder:text-silver-accent shadow-inner"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 py-4 px-6 bg-mist-white border border-silver-accent/20">
                                            <div className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox" id="isActive"
                                                    checked={formData.isActive}
                                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-silver-accent/30 peer-focus:outline-none peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                            </div>
                                            <label htmlFor="isActive" className="text-[13px] font-black text-midnight-blue cursor-pointer uppercase tracking-wider">Academia Activa y Federada</label>
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

export default AdminAcademiesPage;
