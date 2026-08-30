'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Activity, Users, FileText } from 'lucide-react';

export default function PublicCategoriesPage() {
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

    const kataCategories = filteredCategories.filter((c: any) => c.type === 'Kata');
    const kumiteCategories = filteredCategories.filter((c: any) => c.type === 'Kumite');

    const CategoryCard = ({ category }: { category: any }) => {
        const isKata = category.type === 'Kata';
        return (
            <motion.div
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className={`bg-white border rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
                    isKata
                        ? 'border-midnight-blue/20 hover:border-midnight-blue/40'
                        : 'border-crimson-red/20 hover:border-crimson-red/40'
                }`}
            >
                <div>
                    {/* Header Badges */}
                    <div className="flex justify-between items-center gap-2 mb-4">
                        <span
                            className={`px-3 py-1 text-[11px] font-black uppercase tracking-wider rounded-full flex items-center gap-1.5 ${
                                isKata
                                    ? 'bg-midnight-blue/10 text-midnight-blue'
                                    : 'bg-crimson-red/10 text-crimson-red'
                            }`}
                        >
                            {isKata ? <Layers className="w-3.5 h-3.5" /> : <Activity className="w-3.5 h-3.5" />}
                            {category.type}
                        </span>
                        <span className="px-2.5 py-1 bg-mist-white text-steel-gray text-[10px] font-bold uppercase tracking-wider rounded-md border border-silver-accent flex items-center gap-1">
                            <Users className="w-3 h-3 text-steel-gray/60" />
                            {category.gender === 'Male' ? 'Masculino' : category.gender === 'Female' ? 'Femenino' : 'Mixto'}
                        </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-midnight-blue mb-3 leading-snug">
                        {category.name}
                    </h3>

                    {/* Metadata Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        <div className="bg-mist-white px-3 py-1.5 rounded-lg border border-silver-accent">
                            <p className="text-[9px] uppercase font-black text-steel-gray tracking-wider mb-0.5">Grupo Edad</p>
                            <p className="font-bold text-midnight-blue text-xs sm:text-sm">
                                {category.ageGroup}
                                {(category.minAge || category.maxAge) && (
                                    <span className="font-medium text-steel-gray ml-1">
                                        ({category.minAge || '0'} - {category.maxAge || '+'} años)
                                    </span>
                                )}
                            </p>
                        </div>

                        {category.type === 'Kumite' && category.weightLimit && (
                            <div className="bg-crimson-red/5 px-3 py-1.5 rounded-lg border border-crimson-red/20">
                                <p className="text-[9px] uppercase font-black text-crimson-red tracking-wider mb-0.5">Peso Oficial</p>
                                <p className="font-black text-crimson-red text-xs sm:text-sm">{category.weightLimit}</p>
                            </div>
                        )}
                    </div>
                </div>

                {category.description && (
                    <div className="pt-3 border-t border-silver-accent/50 mt-2">
                        <div className="flex items-start gap-2 text-xs text-steel-gray font-medium">
                            <FileText className="w-3.5 h-3.5 text-steel-gray/60 shrink-0 mt-0.5" />
                            <p className="leading-relaxed line-clamp-3">{category.description}</p>
                        </div>
                    </div>
                )}
            </motion.div>
        );
    };

    return (
        <div className="page-container section-padding">
            {/* Standard Header */}
            <header className="mb-10 sm:mb-14 text-center max-w-3xl mx-auto animate-fade-up">
                <span className="text-crimson-red font-black text-xs sm:text-sm uppercase tracking-[0.25em] block mb-3">
                    Reglamento Internacional WKF
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-midnight-blue tracking-tighter uppercase leading-tight mb-4">
                    Categorías <span className="text-crimson-red">Oficiales</span>
                </h1>
                <p className="text-steel-gray text-base sm:text-lg font-medium leading-relaxed mb-8">
                    Clasificación técnica de divisiones oficiales avaladas para competencias federadas.
                </p>

                {/* Filter Capsule Control (Fixed overlap, responsive wrap) */}
                <div className="inline-flex items-center justify-center p-1.5 bg-white border border-silver-accent rounded-full shadow-xs gap-1.5 flex-wrap mx-auto">
                    {[
                        { id: 'All', label: 'Todas' },
                        { id: 'Kata', label: 'Kata' },
                        { id: 'Kumite', label: 'Kumite' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setFilter(tab.id)}
                            className={`px-5 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                                filter === tab.id
                                    ? 'bg-midnight-blue text-white shadow-sm'
                                    : 'text-steel-gray hover:text-midnight-blue hover:bg-mist-white'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </header>

            {loading ? (
                <div className="flex justify-center p-16 sm:p-24">
                    <div className="w-12 h-12 border-4 border-silver-accent border-t-crimson-red rounded-full animate-spin" />
                </div>
            ) : (
                <div className="space-y-12 sm:space-y-16 animate-fade-up">
                    {kataCategories.length > 0 && (filter === 'All' || filter === 'Kata') && (
                        <section>
                            <div className="mb-6 flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-midnight-blue" />
                                <h2 className="text-xl sm:text-2xl font-black text-midnight-blue uppercase tracking-tight">KATA</h2>
                                <span className="text-xs font-bold text-steel-gray bg-mist-white border border-silver-accent px-2.5 py-0.5 rounded-full">
                                    {kataCategories.length} divisiones
                                </span>
                                <div className="h-px flex-1 bg-silver-accent" />
                            </div>
                            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                                <AnimatePresence>
                                    {kataCategories.map((cat: any) => (
                                        <CategoryCard key={cat._id} category={cat} />
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        </section>
                    )}

                    {kumiteCategories.length > 0 && (filter === 'All' || filter === 'Kumite') && (
                        <section>
                            <div className="mb-6 flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-crimson-red" />
                                <h2 className="text-xl sm:text-2xl font-black text-midnight-blue uppercase tracking-tight">KUMITE</h2>
                                <span className="text-xs font-bold text-steel-gray bg-mist-white border border-silver-accent px-2.5 py-0.5 rounded-full">
                                    {kumiteCategories.length} divisiones
                                </span>
                                <div className="h-px flex-1 bg-silver-accent" />
                            </div>
                            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                                <AnimatePresence>
                                    {kumiteCategories.map((cat: any) => (
                                        <CategoryCard key={cat._id} category={cat} />
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        </section>
                    )}

                    {filteredCategories.length === 0 && (
                        <div className="text-center py-16 bg-white rounded-3xl border border-silver-accent shadow-xs p-8 max-w-lg mx-auto">
                            <Layers className="w-12 h-12 text-silver-accent mx-auto mb-3" />
                            <h3 className="text-lg font-bold text-steel-gray">No hay categorías registradas</h3>
                            <p className="text-steel-gray/70 text-xs mt-1">Las categorías oficiales se publicarán aquí pronto.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
