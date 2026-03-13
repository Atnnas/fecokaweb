'use client';

import React, { useState, useEffect } from 'react';
import { DataTable } from '@/components/ui/basic-data-table';
import { motion } from 'framer-motion';

const AdminCategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const initialFormState = {
        name: '',
        type: 'Kata',
        gender: 'Male',
        ageGroup: '',
        minAge: '',
        maxAge: '',
        weightLimit: '',
        description: ''
    };
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setFetchLoading(true);
        try {
            const res = await fetch('/api/categories');
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch (error) {
            console.error("Failed to load categories:", error);
        } finally {
            setFetchLoading(false);
        }
    };

    const handleEdit = (item: any) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            type: item.type,
            gender: item.gender,
            ageGroup: item.ageGroup,
            minAge: item.minAge || '',
            maxAge: item.maxAge || '',
            weightLimit: item.weightLimit || '',
            description: item.description || ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de que deseas eliminar esta categoría?')) return;

        try {
            const res = await fetch('/api/categories', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            if (res.ok) {
                fetchCategories();
            } else {
                alert('Error al eliminar');
            }
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    const handleSeed = async () => {
        if (!confirm('Esto cargará todas las categorías oficiales de la WKF. ¿Deseas continuar?')) return;
        setFetchLoading(true);
        try {
            const res = await fetch('/api/categories/seed', { method: 'POST' });
            const data = await res.json();
            if (res.ok) {
                alert(data.message);
                fetchCategories();
            } else {
                alert(data.error || 'Error al inicializar');
            }
        } catch (error) {
            console.error("Seed error:", error);
            alert("Error al conectar con el servidor.");
        } finally {
            setFetchLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Process numeric fields safely
            const payload = {
                ...formData,
                minAge: formData.minAge ? parseInt(formData.minAge) : null,
                maxAge: formData.maxAge ? parseInt(formData.maxAge) : null,
            };

            const res = await fetch('/api/categories', {
                method: editingItem ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingItem ? { id: editingItem._id, ...payload } : payload),
            });

            if (res.ok) {
                handleCloseModal();
                fetchCategories();
            } else {
                const errorData = await res.json();
                console.error('API Error:', errorData);
                alert(`Error al guardar: ${errorData.error || 'Revisa los datos ingresados.'}`);
            }
        } catch (error) {
            console.error("Submit error:", error);
            alert("Ocurrió un error inesperado al guardar.");
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
        setFormData(initialFormState);
    };

    return (
        <div className="animate-fade-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div>
                    <h1 className="text-4xl font-black text-midnight-blue uppercase mb-2">
                        Gestión de <span className="text-crimson-red">Categorías WKF</span>
                    </h1>
                    <p className="text-steel-gray font-medium">Administra las categorías oficiales para torneos Nacionales e Internacionales.</p>
                </div>
                <div className="flex gap-4">
                    {categories.length === 0 && (
                        <button
                            onClick={handleSeed}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-4 font-bold transition-all flex items-center gap-2 border border-gray-200"
                        >
                            Cargar Reglas WKF
                        </button>
                    )}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-midnight-blue hover:bg-crimson-red text-white px-8 py-4 font-bold transition-all duration-300 flex items-center gap-3 shadow-xl shadow-midnight-blue/10 hover:shadow-crimson-red/20 group"
                    >
                        <div className="w-8 h-8 bg-white/10 flex items-center justify-center group-hover:rotate-90 transition-transform">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                        </div>
                        Nueva Categoría
                    </button>
                </div>
            </div>

            <div className="bg-white shadow-premium border border-white/80 p-8 lg:p-12">
                <DataTable
                    data={categories}
                    loading={fetchLoading}
                    emptyMessage="No hay categorías registradas. Presiona 'Nueva Categoría' para agregar una."
                    searchPlaceholder="Buscar por nombre, modalidad o género..."
                    className="border-none shadow-none"
                    columns={[
                        {
                            key: 'name',
                            header: 'Categoría',
                            sortable: true,
                            filterable: true,
                            render: (_: any, item: any) => (
                                <div className="flex flex-col gap-1">
                                    <span className="font-bold text-midnight-blue">{item.name}</span>
                                    {item.description && <span className="text-[11px] text-gray-500 max-w-sm truncate">{item.description}</span>}
                                </div>
                            )
                        },
                        {
                            key: 'type',
                            header: 'Modalidad',
                            sortable: true,
                            filterable: true,
                            render: (type: string) => (
                                <span className={`px-3 py-1 text-xs font-black uppercase tracking-wider rounded-full border ${type === 'Kata' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                    {type}
                                </span>
                            )
                        },
                        {
                            key: 'gender',
                            header: 'Género',
                            sortable: true,
                            render: (gender: string) => (
                                <span>{gender === 'Male' ? 'Masculino' : gender === 'Female' ? 'Femenino' : 'Mixto'}</span>
                            )
                        },
                        {
                            key: 'ageGroup',
                            header: 'Grupo Edad / Peso',
                            sortable: true,
                            render: (_: any, item: any) => (
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-700">{item.ageGroup}</span>
                                    <div className="flex gap-2 text-xs text-gray-500">
                                        {(item.minAge !== null && item.maxAge !== null) && <span>({item.minAge} - {item.maxAge} años)</span>}
                                        {item.weightLimit && <span className="font-bold text-crimson-red">{item.weightLimit}</span>}
                                    </div>
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

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] overflow-y-auto">
                    <div className="fixed inset-0 bg-midnight-blue/80 backdrop-blur-xl transition-opacity" onClick={handleCloseModal} />
                    <div className="flex min-h-full items-center justify-center p-8 sm:p-12">
                        <div className="relative bg-white w-full max-w-[800px] shadow-2xl border-2 border-midnight-blue/20 overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
                            <div className="flex justify-between items-center px-12 py-10 border-b border-gray-100 bg-gray-50/50">
                                <div>
                                    <h2 className="text-2xl font-black text-midnight-blue uppercase">
                                        {editingItem ? 'Editar' : 'Nueva'} <span className="text-crimson-red">Categoría</span>
                                    </h2>
                                </div>
                                <button type="button" onClick={handleCloseModal} className="w-10 h-10 bg-white hover:bg-crimson-red hover:text-white rounded-full flex items-center justify-center transition-colors shadow-sm">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="flex flex-col overflow-y-auto">
                                <div className="p-12 space-y-8">

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Nombre Oficial *</label>
                                        <input
                                            type="text" required value={formData.name}
                                            placeholder="Ej: Senior Female Kumite -50kg"
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-midnight-blue focus:bg-white outline-none transition-all font-bold text-gray-900"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Modalidad</label>
                                            <select
                                                required value={formData.type}
                                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-midnight-blue focus:bg-white outline-none font-bold text-gray-900 cursor-pointer appearance-none"
                                            >
                                                <option value="Kata">Kata</option>
                                                <option value="Kumite">Kumite</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Género</label>
                                            <select
                                                required value={formData.gender}
                                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-midnight-blue focus:bg-white outline-none font-bold text-gray-900 cursor-pointer appearance-none"
                                            >
                                                <option value="Male">Masculino</option>
                                                <option value="Female">Femenino</option>
                                                <option value="Mixed">Mixto</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
                                        <div className="md:col-span-1">
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Grupo de Edad *</label>
                                            <input
                                                type="text" required value={formData.ageGroup}
                                                placeholder="Ej: U14, Junior, Senior"
                                                onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
                                                className="w-full px-5 py-3 bg-gray-50 focus:border-midnight-blue border-transparent border-2 outline-none font-semibold"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Edad Mínima</label>
                                            <input
                                                type="number" min="0" value={formData.minAge}
                                                placeholder="Ej: 14"
                                                onChange={(e) => setFormData({ ...formData, minAge: e.target.value })}
                                                className="w-full px-5 py-3 bg-gray-50 focus:border-midnight-blue border-transparent border-2 outline-none font-semibold"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Edad Máxima</label>
                                            <input
                                                type="number" min="0" value={formData.maxAge}
                                                placeholder="Ej: 15"
                                                onChange={(e) => setFormData({ ...formData, maxAge: e.target.value })}
                                                className="w-full px-5 py-3 bg-gray-50 focus:border-midnight-blue border-transparent border-2 outline-none font-semibold"
                                            />
                                        </div>
                                    </div>

                                    <motion.div
                                        initial={{ opacity: formData.type === 'Kumite' ? 1 : 0.5 }}
                                        animate={{ opacity: formData.type === 'Kumite' ? 1 : 0.3 }}
                                    >
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                            Límite de Peso (Solo Kumite)
                                        </label>
                                        <input
                                            type="text" value={formData.weightLimit} disabled={formData.type !== 'Kumite'}
                                            placeholder={formData.type === 'Kumite' ? "Ej: -60kg, +84kg" : "No aplica para Kata"}
                                            onChange={(e) => setFormData({ ...formData, weightLimit: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-midnight-blue focus:bg-white outline-none font-bold placeholder:text-gray-400"
                                        />
                                    </motion.div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Descripción / Reglas</label>
                                        <textarea
                                            rows={3} value={formData.description}
                                            placeholder="Detalles adicionales opcionales..."
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50 focus:border-midnight-blue border-transparent border-2 outline-none resize-none font-medium"
                                        />
                                    </div>

                                </div>

                                <div className="p-8 border-t border-gray-100 bg-gray-50 flex justify-end gap-4 shrink-0">
                                    <button
                                        type="button" onClick={handleCloseModal} disabled={loading}
                                        className="px-8 py-4 font-bold text-gray-500 hover:text-gray-800 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit" disabled={loading}
                                        className="px-10 py-4 bg-midnight-blue hover:bg-crimson-red text-white font-black uppercase tracking-widest transition-colors flex items-center gap-2"
                                    >
                                        {loading ? 'Guardando...' : (editingItem ? 'Actualizar' : 'Guardar')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCategoriesPage;
