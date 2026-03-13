'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Activity, Users, FileText } from 'lucide-react';

const PublicCategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All'); // 'All', 'Kata', 'Kumite'

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/categories');
                if (res.ok) {
                    const data = await res.json();
                    setCategories(data);
                }
            } catch (error) {
                console.error("Failed to load categories:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const filteredCategories = categories.filter((c: any) => filter === 'All' || c.type === filter);

    // Group by type for display
    const kataCategories = filteredCategories.filter((c: any) => c.type === 'Kata');
    const kumiteCategories = filteredCategories.filter((c: any) => c.type === 'Kumite');

    const CategoryCard = ({ category }: { category: any }) => (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`bg-white border-2 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all ${category.type === 'Kata' ? 'border-indigo-100/50 hover:border-indigo-300' : 'border-red-100/50 hover:border-red-300'}`}
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5 ${category.type === 'Kata' ? 'bg-indigo-50 text-indigo-700' : 'bg-red-50 text-red-700'}`}>
                    {category.type === 'Kata' ? <Layers className="w-3 h-3" /> : <Activity className="w-3 h-3" />}
                    {category.type}
                </div>
                <div className="px-3 py-1 bg-gray-50 text-gray-500 text-[10px] font-bold uppercase rounded-md border border-gray-100 flex items-center gap-1.5">
                    <Users className="w-3 h-3" />
                    {category.gender === 'Male' ? 'Masculino' : category.gender === 'Female' ? 'Femenino' : 'Mixto'}
                </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>

            <div className="flex flex-wrap gap-2 mb-4 mt-4">
                <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                    <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-0.5">Grupo Edad</p>
                    <p className="font-bold text-gray-800 text-sm">
                        {category.ageGroup}
                        {(category.minAge || category.maxAge) && (
                            <span className="font-medium text-gray-500 ml-1">
                                ({category.minAge || '0'} - {category.maxAge || '+'} años)
                            </span>
                        )}
                    </p>
                </div>

                {category.type === 'Kumite' && category.weightLimit && (
                    <div className="bg-red-50/50 px-4 py-2 rounded-lg border border-red-100">
                        <p className="text-[10px] uppercase font-black text-red-400 tracking-widest mb-0.5">Peso Oficial</p>
                        <p className="font-black text-red-700 text-sm">{category.weightLimit}</p>
                    </div>
                )}
            </div>

            {category.description && (
                <div className="pt-4 border-t border-gray-50">
                    <div className="flex items-start gap-2 text-sm text-gray-500 font-medium">
                        <FileText className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                        <p className="leading-relaxed">{category.description}</p>
                    </div>
                </div>
            )}
        </motion.div>
    );

    return (
        <div className="bg-[#f8f9fa] min-h-screen relative overflow-x-hidden w-full font-sans">
            {/* Minimalist Background Layout */}
            <div className="absolute top-0 left-0 w-full h-[35vh] bg-white border-b border-gray-100" />

            <div className="w-full max-w-[1920px] mx-auto pt-16 lg:pt-24 pb-20 px-6 sm:px-12 lg:px-24 xl:px-40 relative z-10 block">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-12 text-center max-w-4xl mx-auto"
                >
                    <span className="text-gray-500 font-semibold text-[10px] uppercase tracking-[0.25em] block mb-3">
                        Reglamento Internacional
                    </span>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 tracking-tight leading-tight mb-8">
                        Categorías <span className="font-semibold text-[#800000]">WKF Oficiales</span>
                    </h1>

                    <div className="inline-flex bg-white shadow-sm border border-gray-200 rounded-full p-1.5 mx-auto">
                        {['All', 'Kata', 'Kumite'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${filter === f
                                        ? 'bg-midnight-blue text-white shadow-md'
                                        : 'text-gray-500 hover:text-midnight-blue hover:bg-gray-50'
                                    }`}
                            >
                                {f === 'All' ? 'Todas' : f}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center p-20">
                        <div className="w-12 h-12 border-4 border-crimson-red/20 border-t-crimson-red rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="space-y-16">
                        {kataCategories.length > 0 && (
                            <section>
                                {(filter === 'All' || filter === 'Kata') && (
                                    <div className="mb-8 flex items-center gap-4">
                                        <h2 className="text-2xl font-black text-indigo-900 uppercase tracking-tight">KATA</h2>
                                        <div className="h-[1px] flex-1 bg-indigo-100"></div>
                                    </div>
                                )}
                                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    <AnimatePresence>
                                        {kataCategories.map((cat: any) => (
                                            <CategoryCard key={cat._id} category={cat} />
                                        ))}
                                    </AnimatePresence>
                                </motion.div>
                            </section>
                        )}

                        {kumiteCategories.length > 0 && (
                            <section>
                                {(filter === 'All' || filter === 'Kumite') && (
                                    <div className="mb-8 flex items-center gap-4">
                                        <h2 className="text-2xl font-black text-red-900 uppercase tracking-tight">KUMITE</h2>
                                        <div className="h-[1px] flex-1 bg-red-100"></div>
                                    </div>
                                )}
                                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    <AnimatePresence>
                                        {kumiteCategories.map((cat: any) => (
                                            <CategoryCard key={cat._id} category={cat} />
                                        ))}
                                    </AnimatePresence>
                                </motion.div>
                            </section>
                        )}

                        {categories.length === 0 && (
                            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                                <Layers className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-400">No hay categorías registradas</h3>
                                <p className="text-gray-400 text-sm mt-2">Las categorías oficiales se publicarán aquí pronto.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublicCategoriesPage;
