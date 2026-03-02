'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { DataTable } from '@/components/ui/basic-data-table';

const AdminUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [formData, setFormData] = useState({ name: '', email: '', birthDate: '', role: 'user', status: 'pending' });
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/users');
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (user: any) => {
        setEditingUser(user);
        const birthDateFormatted = user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '';
        setFormData({
            name: user.name,
            email: user.email,
            birthDate: birthDateFormatted,
            role: user.role,
            status: user.status
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (userId: string) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este usuario? Esta acción es irreversible.')) return;

        try {
            const res = await fetch('/api/admin/users', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });
            if (res.ok) {
                fetchUsers();
            } else {
                alert('Error al eliminar el usuario');
            }
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            const res = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: editingUser._id, ...formData }),
            });
            if (res.ok) {
                setIsModalOpen(false);
                setEditingUser(null);
                fetchUsers();
            } else {
                const errorData = await res.json();
                console.error('API Error:', errorData);
                const detailsStr = errorData.details ? JSON.stringify(errorData.details) : '';
                alert(`Error al actualizar el usuario: ${errorData.error || 'Desconocido'} ${detailsStr}`);
            }
        } catch (error) {
            console.error("Update error:", error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    return (
        <>
            <div className="animate-fade-up">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-midnight-blue uppercase mb-2">
                            Control de <span className="text-crimson-red">Usuarios</span>
                        </h1>
                        <p className="text-steel-gray font-medium">Gestiona roles, perfiles y estados de activación de la plataforma.</p>
                    </div>
                    <div className="flex items-center gap-4 bg-white px-6 py-4 shadow-sm border border-silver-accent/50">
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase text-steel-gray/50 tracking-widest">Total Usuarios</p>
                            <p className="text-2xl font-black text-midnight-blue">{users.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow-premium border border-white/80 p-8 lg:p-12">
                    <DataTable
                        data={users}
                        loading={loading}
                        emptyMessage="No hay usuarios registrados"
                        searchPlaceholder="Buscar por nombre, email o rol..."
                        className="border-none shadow-none"
                        columns={[
                            {
                                key: 'name',
                                header: 'Usuario',
                                sortable: true,
                                filterable: true,
                                render: (_: any, user: any) => (
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-12 h-12 overflow-hidden bg-mist-white border border-silver-accent/50">
                                            {user.image ? (
                                                <Image src={user.image} alt={user.name} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-midnight-blue/5 text-midnight-blue font-black text-xl">
                                                    {user.name.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-midnight-blue group-hover:text-crimson-red transition-colors">{user.name}</p>
                                            <p className="text-xs text-steel-gray font-medium">{user.email}</p>
                                        </div>
                                    </div>
                                )
                            },
                            {
                                key: 'role',
                                header: 'Rol',
                                sortable: true,
                                filterable: true,
                                render: (role: string) => (
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${role === 'admin' ? 'bg-red-50 text-crimson-red' :
                                        role === 'edit' ? 'bg-indigo-50 text-indigo-600' : 'bg-silver-accent/20 text-steel-gray'
                                        }`}>
                                        {role}
                                    </span>
                                )
                            },
                            {
                                key: 'status',
                                header: 'Estado',
                                sortable: true,
                                filterable: true,
                                render: (status: string) => (
                                    <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-fit ${status === 'active' ? 'bg-green-50 text-green-600' :
                                        status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                                        }`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${status === 'active' ? 'bg-green-600 animate-pulse' :
                                            status === 'pending' ? 'bg-amber-600' : 'bg-red-600'
                                            }`} />
                                        {status}
                                    </div>
                                )
                            },
                            {
                                key: 'lastLoginAt',
                                header: 'Último Acceso',
                                sortable: true,
                                render: (_: any, user: any) => (
                                    <div className="flex flex-col">
                                        <span className="font-bold text-midnight-blue text-xs">
                                            {new Date(user.lastLoginAt || user.updatedAt).toLocaleDateString('es-CR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        <span className="text-[10px] text-steel-gray font-bold uppercase tracking-tighter italic">Google Auth</span>
                                    </div>
                                )
                            },
                            {
                                key: '_id',
                                header: 'Acciones',
                                render: (id: string, user: any) => (
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => handleEdit(user)}
                                            className="p-2 bg-mist-white hover:bg-midnight-blue hover:text-white transition-all"
                                            title="Editar Perfil"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(id)}
                                            className="p-2 bg-mist-white hover:bg-red-500 hover:text-white transition-all"
                                            title="Eliminar Usuario"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                )
                            }
                        ]}
                    />
                </div>
            </div>
            {/* Modal Editar Usuario */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] overflow-y-auto">
                    <div className="fixed inset-0 bg-midnight-blue/80 backdrop-blur-xl transition-opacity" onClick={handleCloseModal} />
                    <div className="flex min-h-full items-center justify-center p-8 sm:p-12 md:p-16">
                        <div className="relative bg-white w-full max-w-[850px] shadow-[0_32px_128px_-32px_rgba(0,0,0,0.5)] border-2 border-midnight-blue/20 overflow-hidden animate-in fade-in zoom-in duration-500 ease-out flex flex-col max-h-[90vh]">
                            <div className="flex justify-between items-center p-12 sm:p-16 lg:p-24 pb-10 sm:pb-12 lg:pb-14 border-b border-silver-accent/20 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                                <div>
                                    <h2 className="text-2xl font-black text-midnight-blue uppercase leading-tight tracking-tighter">
                                        Gestionar <span className="text-crimson-red">Perfil</span>
                                    </h2>
                                    <p className="text-sm text-steel-gray mt-2 font-bold opacity-60">Control maestro de accesos y configuración de usuario.</p>
                                </div>
                                <button type="button" onClick={handleCloseModal} className="w-12 h-12 bg-mist-white hover:bg-crimson-red hover:text-white flex items-center justify-center transition-all duration-500 group shadow-md hover:rotate-90">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                                <div className="p-12 sm:p-16 lg:p-24 pt-12 lg:pt-16 overflow-y-auto custom-scrollbar flex-1">
                                    <div className="space-y-12">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="md:col-span-2">
                                                <label className="block text-[11px] font-black text-midnight-blue uppercase tracking-[0.25em] mb-4 ml-3">Nombre del Usuario <span className="text-crimson-red">*</span></label>
                                                <input type="text" required value={formData.name} placeholder="Nombre Completo" onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-8 py-5 bg-mist-white border-2 border-transparent focus:border-midnight-blue focus:bg-white outline-none transition-all font-bold text-midnight-blue shadow-inner text-lg" />
                                            </div>
                                            <div className="md:col-span-1">
                                                <label className="block text-[11px] font-black text-midnight-blue uppercase tracking-[0.25em] mb-4 ml-3">Correo Electrónico</label>
                                                <input type="email" required value={formData.email} placeholder="correo@ejemplo.com" onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-8 py-5 bg-mist-white border-2 border-transparent focus:border-midnight-blue focus:bg-white outline-none transition-all font-bold text-midnight-blue shadow-inner" />
                                            </div>
                                            <div className="md:col-span-1">
                                                <label className="block text-[11px] font-black text-midnight-blue uppercase tracking-[0.25em] mb-4 ml-3">Fecha de Nacimiento</label>
                                                <input type="date" value={formData.birthDate} onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })} className="w-full px-8 py-5 bg-mist-white border-2 border-transparent focus:border-midnight-blue focus:bg-white outline-none transition-all font-black text-[13px] text-midnight-blue" />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-black text-midnight-blue uppercase tracking-[0.25em] mb-4 ml-3">Rol en la Plataforma</label>
                                                <div className="relative">
                                                    <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full px-8 py-5 bg-mist-white border-2 border-transparent focus:border-midnight-blue focus:bg-white outline-none transition-all font-black text-midnight-blue appearance-none cursor-pointer text-[13px] uppercase tracking-wider">
                                                        <option value="user">👤 Usuario Regular</option>
                                                        <option value="edit">✍️ Editor de Contenido</option>
                                                        <option value="admin">⚖️ Administrador</option>
                                                    </select>
                                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-black text-midnight-blue uppercase tracking-[0.25em] mb-4 ml-3">Estado de la Cuenta</label>
                                                <div className="relative">
                                                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-8 py-5 bg-mist-white border-2 border-transparent focus:border-midnight-blue focus:bg-white outline-none transition-all font-black text-midnight-blue appearance-none cursor-pointer text-[13px] uppercase tracking-wider">
                                                        <option value="pending">⏳ Pendiente</option>
                                                        <option value="active">✅ Activo</option>
                                                        <option value="inactive">🚫 Inactivo</option>
                                                    </select>
                                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className="p-12 sm:p-16 lg:p-20 border-t-2 border-mist-white bg-white shrink-0 flex flex-col sm:flex-row items-center justify-end gap-6">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        disabled={actionLoading}
                                        className="w-full sm:w-auto px-10 py-5 bg-transparent border-2 border-steel-gray/30 text-steel-gray hover:border-midnight-blue hover:text-midnight-blue hover:bg-mist-white font-black uppercase tracking-[0.2em] text-xs transition-all duration-300 shadow-none"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={actionLoading}
                                        className="w-full sm:w-auto px-10 py-5 bg-midnight-blue hover:bg-crimson-red text-white font-black uppercase tracking-[0.2em] text-xs transition-all duration-500 shadow-xl hover:shadow-crimson-red/30 flex items-center justify-center gap-3 active:scale-[0.98] group"
                                    >
                                        {actionLoading ? (
                                            <div className="w-5 h-5 border-4 border-white/30 border-t-white animate-spin" />
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                                Guardar Cambios
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

export default AdminUsersPage;
