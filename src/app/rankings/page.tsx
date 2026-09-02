'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Trophy,
    Crown,
    Medal,
    Search,
    ChevronDown,
    Flame,
    Sparkles,
    Shield,
    Users,
    ArrowUpRight
} from 'lucide-react';

interface AthleteRanking {
    _id: string;
    athleteName: string;
    category: string;
    modality: 'Kata' | 'Kumite';
    points: number;
    position: number;
    academy?: string;
    dojo?: string;
    tournament?: string;
    division?: string;
    gender?: string;
    history?: any[];
}

export default function PublicRankingsPage() {
    const [rankings, setRankings] = useState<AthleteRanking[]>([]);
    const [loading, setLoading] = useState(true);

    // Filtros principales
    const [selectedDivision, setSelectedDivision] = useState<string>('Todas');
    const [selectedModality, setSelectedModality] = useState<'All' | 'Kata' | 'Kumite'>('All');
    const [selectedGender, setSelectedGender] = useState<'All' | 'Masculino' | 'Femenino'>('All');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchRankings = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/rankings');
                if (res.ok) {
                    const data = await res.json();
                    setRankings(data || []);
                }
            } catch (error) {
                console.error("Error al cargar rankings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRankings();
    }, []);

    // Filtrar estrictamente solo atletas individuales (excluir cualquier registro de equipos)
    const individualRankings = useMemo(() => {
        return rankings.filter(r => {
            const cat = (r.category || '').toLowerCase();
            const div = (r.division || '').toLowerCase();
            return !cat.includes('equipo') && div !== 'equipos';
        });
    }, [rankings]);

    // Función auxiliar para deducir división si no está explícita
    const getDivision = (item: AthleteRanking): string => {
        if (item.division && item.division.toLowerCase() !== 'equipos') return item.division;
        const cat = item.category.toLowerCase();
        if (cat.includes('u12') || cat.includes('sub-12')) return 'U12';
        if (cat.includes('u14') || cat.includes('sub-14')) return 'U14';
        if (cat.includes('cadete') || cat.includes('cadet')) return 'Cadete';
        if (cat.includes('junior')) return 'Junior';
        if (cat.includes('senior')) return 'Senior';
        return 'General';
    };

    // Función auxiliar para deducir género
    const getGender = (item: AthleteRanking): 'Masculino' | 'Femenino' => {
        if (item.gender) return item.gender as any;
        const cat = item.category.toLowerCase();
        if (cat.includes('fem') || cat.includes('muj')) return 'Femenino';
        return 'Masculino';
    };

    // 1. Divisiones únicas existentes (excluyendo Equipos)
    const divisions = useMemo(() => {
        const set = new Set<string>();
        individualRankings.forEach(r => set.add(getDivision(r)));
        const order = ['Todas', 'U12', 'U14', 'Cadete', 'Junior', 'Senior', 'General'];
        const existing = Array.from(set);
        return order.filter(d => d === 'Todas' || existing.includes(d));
    }, [individualRankings]);

    // 2. Lista de categorías disponibles según los filtros de División, Modalidad y Género
    const availableCategories = useMemo(() => {
        const set = new Set<string>();
        individualRankings.forEach(r => {
            const div = getDivision(r);
            const gen = getGender(r);

            const matchDiv = selectedDivision === 'Todas' || div.toLowerCase() === selectedDivision.toLowerCase();
            const matchMod = selectedModality === 'All' || r.modality === selectedModality;
            const matchGen = selectedGender === 'All' || gen === selectedGender;

            if (matchDiv && matchMod && matchGen) {
                set.add(r.category);
            }
        });
        return Array.from(set).sort();
    }, [rankings, selectedDivision, selectedModality, selectedGender]);

    // Cuando cambian las categorías disponibles, asegurar que selectedCategory sea válida
    useEffect(() => {
        if (selectedCategory !== 'All' && !availableCategories.includes(selectedCategory)) {
            setSelectedCategory('All');
        }
    }, [availableCategories, selectedCategory]);

    // 3. Atletas filtrados por la categoría o criterios actuales (solo individuales)
    const filteredAthletes = useMemo(() => {
        return individualRankings.filter(r => {
            const div = getDivision(r);
            const gen = getGender(r);

            const matchDiv = selectedDivision === 'Todas' || div.toLowerCase() === selectedDivision.toLowerCase();
            const matchMod = selectedModality === 'All' || r.modality === selectedModality;
            const matchGen = selectedGender === 'All' || gen === selectedGender;
            const matchCat = selectedCategory === 'All' || r.category === selectedCategory;

            const term = searchTerm.toLowerCase().trim();
            const matchSearch =
                !term ||
                r.athleteName.toLowerCase().includes(term) ||
                r.category.toLowerCase().includes(term) ||
                (r.academy && r.academy.toLowerCase().includes(term)) ||
                (r.dojo && r.dojo.toLowerCase().includes(term));

            return matchDiv && matchMod && matchGen && matchCat && matchSearch;
        }).sort((a, b) => (a.position || 99) - (b.position || 99));
    }, [individualRankings, selectedDivision, selectedModality, selectedGender, selectedCategory, searchTerm]);

    // 4. Separación: Top 4 para el Podio y Resto (5° en adelante)
    const podiumAthletes = useMemo(() => {
        const rank1 = filteredAthletes.find(a => a.position === 1) || null;
        const rank2 = filteredAthletes.find(a => a.position === 2) || null;
        const rank3 = filteredAthletes.find(a => a.position === 3) || null;
        const rank4 = filteredAthletes.find(a => a.position === 4) || null;

        // Si no vienen marcados con 1..4 exacto, tomamos los primeros 4 por orden
        if (!rank1 && !rank2 && filteredAthletes.length > 0) {
            return {
                rank1: filteredAthletes[0] || null,
                rank2: filteredAthletes[1] || null,
                rank3: filteredAthletes[2] || null,
                rank4: filteredAthletes[3] || null,
            };
        }

        return { rank1, rank2, rank3, rank4 };
    }, [filteredAthletes]);

    const remainingAthletes = useMemo(() => {
        const podiumIds = new Set([
            podiumAthletes.rank1?._id,
            podiumAthletes.rank2?._id,
            podiumAthletes.rank3?._id,
            podiumAthletes.rank4?._id,
        ].filter(Boolean));

        return filteredAthletes.filter(a => !podiumIds.has(a._id));
    }, [filteredAthletes, podiumAthletes]);

    // Iniciales para avatar
    const getInitials = (name: string) => {
        if (!name) return 'CR';
        const parts = name.trim().split(' ');
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    return (
        <div className="page-container section-padding min-h-screen">
            
            {/* Header Oficial FECOKA */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-6 animate-fade-up">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-crimson-red/10 border border-crimson-red/20 rounded-full mb-3">
                        <Flame className="w-3.5 h-3.5 text-crimson-red" />
                        <span className="text-crimson-red font-black text-xs uppercase tracking-[0.25em]">
                            Nómina Oficial & Ranking Nacional
                        </span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-midnight-blue tracking-tighter uppercase leading-tight mb-2">
                        Podio de <span className="text-crimson-red">Campeones</span>
                    </h1>
                    <p className="text-steel-gray text-base font-medium max-w-2xl">
                        Consulta la élite del karate costarricense, clasificados oficiales por categoría, peso y división deportiva.
                    </p>
                </div>

                {/* Filtro Rápido de Modalidad */}
                <div className="inline-flex p-1 bg-midnight-blue rounded-2xl shadow-sm gap-1 self-start md:self-auto shrink-0">
                    {[
                        { id: 'All', label: 'Todas las Modalidades' },
                        { id: 'Kata', label: '🥋 Kata' },
                        { id: 'Kumite', label: '🥊 Kumite' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setSelectedModality(tab.id as any);
                                setSelectedCategory('All');
                            }}
                            className={`px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                                selectedModality === tab.id
                                    ? 'bg-white text-midnight-blue shadow-xs'
                                    : 'text-white/70 hover:text-white hover:bg-white/10'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* BARRA DE NAVEGACIÓN DUAL: Tabs de División + Combobox de Categoría */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-silver-accent/50 mb-10 space-y-6">
                
                {/* 1. Tabs de División (U12, U14, Cadete, Junior, etc.) */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-silver-accent/30 pb-6">
                    <span className="text-[11px] font-black uppercase text-steel-gray/60 tracking-widest shrink-0">
                        División de Edad:
                    </span>
                    <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar w-full sm:w-auto pb-1 sm:pb-0">
                        {divisions.map((div) => (
                            <button
                                key={div}
                                onClick={() => {
                                    setSelectedDivision(div);
                                    setSelectedCategory('All');
                                }}
                                className={`px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all duration-300 whitespace-nowrap cursor-pointer ${
                                    selectedDivision === div
                                        ? 'bg-midnight-blue text-white shadow-md shadow-midnight-blue/20 scale-[1.02]'
                                        : 'bg-mist-white hover:bg-silver-accent/50 text-steel-gray hover:text-midnight-blue'
                                }`}
                            >
                                {div}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 2. Filtros de Género + Combobox Selector de Peso/Categoría + Buscador */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    
                    {/* Selector de Género */}
                    <div className="md:col-span-3 flex items-center gap-1.5 p-1 bg-mist-white rounded-2xl border border-silver-accent/40">
                        {[
                            { id: 'All', label: 'Todos' },
                            { id: 'Masculino', label: 'Masculino' },
                            { id: 'Femenino', label: 'Femenino' },
                        ].map(g => (
                            <button
                                key={g.id}
                                onClick={() => {
                                    setSelectedGender(g.id as any);
                                    setSelectedCategory('All');
                                }}
                                className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer text-center ${
                                    selectedGender === g.id
                                        ? 'bg-white text-midnight-blue shadow-xs font-black'
                                        : 'text-steel-gray/70 hover:text-midnight-blue'
                                }`}
                            >
                                {g.label}
                            </button>
                        ))}
                    </div>

                    {/* COMBOBOX: Selector Dinámico de Categoría / Peso */}
                    <div className="md:col-span-5 relative">
                        <label className="block text-[9px] font-black text-midnight-blue uppercase tracking-widest mb-1 ml-1">
                            Categoría y División de Peso ({availableCategories.length})
                        </label>
                        <div className="relative">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full pl-4 pr-10 py-3 bg-mist-white hover:bg-white border-2 border-silver-accent/60 focus:border-midnight-blue rounded-2xl font-black text-xs sm:text-sm text-midnight-blue appearance-none outline-none transition-all cursor-pointer shadow-inner"
                            >
                                <option value="All">🏆 Ver todas las categorías ({availableCategories.length})</option>
                                {availableCategories.map(cat => (
                                    <option key={cat} value={cat}>
                                        🥋 {cat}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="w-4 h-4 text-midnight-blue absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>

                    {/* Buscador de Atleta */}
                    <div className="md:col-span-4 relative self-end">
                        <label className="block text-[9px] font-black text-midnight-blue uppercase tracking-widest mb-1 ml-1">
                            Búsqueda Directa
                        </label>
                        <div className="relative">
                            <Search className="w-4 h-4 text-steel-gray/50 absolute left-4 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar karateka o club..."
                                className="w-full pl-10 pr-4 py-3 bg-mist-white hover:bg-white border-2 border-silver-accent/60 focus:border-midnight-blue rounded-2xl font-bold text-xs sm:text-sm text-midnight-blue outline-none transition-all shadow-inner"
                            />
                        </div>
                    </div>

                </div>

            </div>

            {/* MITAD SUPERIOR: EL PODIO OLÍMPICO (SOLO VISIBLE AL SELECCIONAR CATEGORÍA/PESO ESPECÍFICO) */}
            <AnimatePresence mode="wait">
                {selectedCategory !== 'All' ? (
                    <motion.div
                        key={selectedCategory}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="mb-14"
                    >
                        <div className="flex items-center justify-between mb-8 px-2">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-8 bg-crimson-red rounded-full" />
                                <h2 className="text-2xl sm:text-3xl font-black text-midnight-blue uppercase tracking-tight">
                                    Podio de Honor <span className="text-crimson-red">Top 4</span>
                                </h2>
                            </div>
                            <span className="px-4 py-1.5 bg-midnight-blue/5 border border-midnight-blue/10 rounded-full text-xs font-black text-midnight-blue uppercase">
                                {selectedCategory}
                            </span>
                        </div>

                        {/* CONTENEDOR DEL PODIO ESCALONADO */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-end pt-8">
                    
                    {/* 2° LUGAR - PLATA (Izquierda, Nivel 2) */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="order-2 lg:order-1 flex flex-col items-center"
                    >
                        {podiumAthletes.rank2 ? (
                            <div className="w-full bg-white rounded-3xl border-2 border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center text-center relative group">
                                <span className="absolute -top-3.5 px-3.5 py-1 bg-slate-200 border border-slate-300 rounded-full text-[10px] font-black uppercase text-slate-800 tracking-wider shadow-xs">
                                    🥈 Subcampeón Nacional
                                </span>

                                {/* Burbuja de Plata */}
                                <div className="relative mt-2 mb-4">
                                    <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-slate-200 via-slate-100 to-white border-4 border-slate-300 shadow-[0_0_20px_rgba(148,163,184,0.35)] flex items-center justify-center group-hover:scale-105 transition-transform">
                                        <span className="text-2xl font-black text-slate-600 tracking-wider">
                                            {getInitials(podiumAthletes.rank2.athleteName)}
                                        </span>
                                    </div>
                                    <div className="absolute -bottom-2 -right-1 w-9 h-9 rounded-full bg-slate-600 text-white font-black text-xs flex items-center justify-center shadow-md border-2 border-white">
                                        02°
                                    </div>
                                </div>

                                <h3 className="font-black text-lg text-midnight-blue uppercase tracking-tight group-hover:text-crimson-red transition-colors line-clamp-1">
                                    {podiumAthletes.rank2.athleteName}
                                </h3>
                                <p className="text-xs font-bold text-steel-gray mt-1">
                                    {podiumAthletes.rank2.academy || podiumAthletes.rank2.dojo || 'Selección FECOKA'}
                                </p>
                                <div className="mt-3 px-3 py-1 bg-mist-white rounded-full text-[11px] font-black text-slate-600 uppercase tracking-wider">
                                    {podiumAthletes.rank2.points || 0} pts oficiales
                                </div>
                            </div>
                        ) : (
                            <div className="w-full h-64 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-6 text-center text-steel-gray/40">
                                <Medal className="w-10 h-10 mb-2 stroke-1" />
                                <span className="text-xs font-bold uppercase tracking-wider">2° Puesto Disponible</span>
                            </div>
                        )}
                        {/* Pedestal visual */}
                        <div className="hidden lg:flex w-full h-16 bg-gradient-to-t from-slate-200 to-slate-100 rounded-b-2xl items-center justify-center border-x border-b border-slate-300/60 shadow-inner">
                            <span className="text-2xl font-black text-slate-400">02</span>
                        </div>
                    </motion.div>

                    {/* 1° LUGAR - ORO (Centro, Nivel 1 - Más Alto y Prominente) */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0 }}
                        className="order-1 lg:order-2 flex flex-col items-center -mt-6 lg:-mt-10"
                    >
                        {podiumAthletes.rank1 ? (
                            <div className="w-full bg-gradient-to-b from-amber-500/10 via-white to-white rounded-3xl border-2 border-amber-400 shadow-xl hover:shadow-2xl transition-all duration-300 p-8 flex flex-col items-center text-center relative group">
                                <div className="absolute -top-5 flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full text-[11px] font-black uppercase tracking-widest shadow-md">
                                    <Crown className="w-3.5 h-3.5 text-yellow-200 fill-yellow-200" />
                                    <span>#1 Campeón Nacional</span>
                                </div>

                                {/* Burbuja de Oro Radiante */}
                                <div className="relative mt-2 mb-4">
                                    <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-500 border-4 border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.45)] flex items-center justify-center group-hover:scale-105 transition-transform">
                                        <span className="text-3xl font-black text-amber-900 tracking-wider">
                                            {getInitials(podiumAthletes.rank1.athleteName)}
                                        </span>
                                    </div>
                                    <div className="absolute -bottom-2 -right-1 w-11 h-11 rounded-full bg-amber-500 text-white font-black text-sm flex items-center justify-center shadow-lg border-2 border-white">
                                        01°
                                    </div>
                                </div>

                                <h3 className="font-black text-2xl text-midnight-blue uppercase tracking-tight group-hover:text-crimson-red transition-colors line-clamp-1">
                                    {podiumAthletes.rank1.athleteName}
                                </h3>
                                <p className="text-xs font-black text-crimson-red mt-1 uppercase tracking-wider">
                                    {podiumAthletes.rank1.academy || podiumAthletes.rank1.dojo || 'Selección FECOKA'}
                                </p>
                                <div className="mt-4 px-4 py-1.5 bg-amber-500/10 border border-amber-400/30 rounded-full text-xs font-black text-amber-700 uppercase tracking-widest">
                                    {podiumAthletes.rank1.points || 0} pts • Máximo Líder
                                </div>
                            </div>
                        ) : (
                            <div className="w-full h-80 border-2 border-dashed border-amber-300 rounded-3xl flex flex-col items-center justify-center p-6 text-center text-amber-600/40">
                                <Crown className="w-12 h-12 mb-2 stroke-1" />
                                <span className="text-xs font-bold uppercase tracking-wider">1° Puesto Vacante</span>
                            </div>
                        )}
                        {/* Pedestal visual */}
                        <div className="hidden lg:flex w-full h-24 bg-gradient-to-t from-amber-400/40 via-amber-200/50 to-amber-100 rounded-b-2xl items-center justify-center border-x border-b border-amber-300 shadow-inner">
                            <span className="text-3xl font-black text-amber-600/70">01</span>
                        </div>
                    </motion.div>

                    {/* 3° LUGAR - BRONCE 1 (Derecha, Nivel 3) */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="order-3 flex flex-col items-center"
                    >
                        {podiumAthletes.rank3 ? (
                            <div className="w-full bg-white rounded-3xl border-2 border-amber-800/30 shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center text-center relative group">
                                <span className="absolute -top-3.5 px-3.5 py-1 bg-amber-100 border border-amber-200 rounded-full text-[10px] font-black uppercase text-amber-900 tracking-wider shadow-xs">
                                    🥉 Medalla de Bronce
                                </span>

                                {/* Burbuja de Bronce */}
                                <div className="relative mt-2 mb-4">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-200 via-amber-100 to-amber-50 border-4 border-amber-700/50 shadow-[0_0_15px_rgba(180,83,9,0.25)] flex items-center justify-center group-hover:scale-105 transition-transform">
                                        <span className="text-xl font-black text-amber-900 tracking-wider">
                                            {getInitials(podiumAthletes.rank3.athleteName)}
                                        </span>
                                    </div>
                                    <div className="absolute -bottom-2 -right-1 w-8 h-8 rounded-full bg-amber-800 text-white font-black text-xs flex items-center justify-center shadow-md border-2 border-white">
                                        03°
                                    </div>
                                </div>

                                <h3 className="font-black text-base text-midnight-blue uppercase tracking-tight group-hover:text-crimson-red transition-colors line-clamp-1">
                                    {podiumAthletes.rank3.athleteName}
                                </h3>
                                <p className="text-xs font-bold text-steel-gray mt-1">
                                    {podiumAthletes.rank3.academy || podiumAthletes.rank3.dojo || 'Federado'}
                                </p>
                                <div className="mt-3 px-3 py-1 bg-mist-white rounded-full text-[10px] font-black text-amber-800 uppercase tracking-wider">
                                    {podiumAthletes.rank3.points || 0} pts
                                </div>
                            </div>
                        ) : (
                            <div className="w-full h-56 border-2 border-dashed border-silver-accent rounded-3xl flex flex-col items-center justify-center p-6 text-center text-steel-gray/40">
                                <Medal className="w-8 h-8 mb-2 stroke-1" />
                                <span className="text-[11px] font-bold uppercase tracking-wider">3° Puesto Por Definir</span>
                            </div>
                        )}
                        {/* Pedestal visual */}
                        <div className="hidden lg:flex w-full h-12 bg-gradient-to-t from-amber-100 to-mist-white rounded-b-2xl items-center justify-center border-x border-b border-silver-accent/80 shadow-inner">
                            <span className="text-xl font-black text-amber-800/40">03</span>
                        </div>
                    </motion.div>

                    {/* 4° LUGAR - BRONCE 2 / SEMIFINALISTA (Extremo Derecho, Nivel 4) */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="order-4 flex flex-col items-center"
                    >
                        {podiumAthletes.rank4 ? (
                            <div className="w-full bg-white rounded-3xl border-2 border-silver-accent shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center text-center relative group">
                                <span className="absolute -top-3.5 px-3.5 py-1 bg-mist-white border border-silver-accent rounded-full text-[10px] font-black uppercase text-steel-gray tracking-wider shadow-xs">
                                    🥉 Semifinalista WKF
                                </span>

                                {/* Burbuja de 4to Lugar */}
                                <div className="relative mt-2 mb-4">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-slate-100 via-white to-slate-50 border-4 border-silver-accent shadow-[0_0_15px_rgba(0,0,0,0.05)] flex items-center justify-center group-hover:scale-105 transition-transform">
                                        <span className="text-xl font-black text-midnight-blue tracking-wider">
                                            {getInitials(podiumAthletes.rank4.athleteName)}
                                        </span>
                                    </div>
                                    <div className="absolute -bottom-2 -right-1 w-8 h-8 rounded-full bg-steel-gray text-white font-black text-xs flex items-center justify-center shadow-md border-2 border-white">
                                        04°
                                    </div>
                                </div>

                                <h3 className="font-black text-base text-midnight-blue uppercase tracking-tight group-hover:text-crimson-red transition-colors line-clamp-1">
                                    {podiumAthletes.rank4.athleteName}
                                </h3>
                                <p className="text-xs font-bold text-steel-gray mt-1">
                                    {podiumAthletes.rank4.academy || podiumAthletes.rank4.dojo || 'Federado'}
                                </p>
                                <div className="mt-3 px-3 py-1 bg-mist-white rounded-full text-[10px] font-black text-steel-gray uppercase tracking-wider">
                                    {podiumAthletes.rank4.points || 0} pts
                                </div>
                            </div>
                        ) : (
                            <div className="w-full h-56 border-2 border-dashed border-silver-accent rounded-3xl flex flex-col items-center justify-center p-6 text-center text-steel-gray/40">
                                <Medal className="w-8 h-8 mb-2 stroke-1" />
                                <span className="text-[11px] font-bold uppercase tracking-wider">4° Puesto Por Definir</span>
                            </div>
                        )}
                        {/* Pedestal visual */}
                        <div className="hidden lg:flex w-full h-8 bg-mist-white rounded-b-2xl items-center justify-center border-x border-b border-silver-accent/80 shadow-inner">
                            <span className="text-lg font-black text-steel-gray/30">04</span>
                        </div>
                    </motion.div>

                </div>
            </motion.div>
        ) : null}
    </AnimatePresence>

            {/* MITAD INFERIOR: TABLA COMPLETA Y PUESTOS RESTANTES (5° EN ADELANTE) */}
            <div className="bg-white rounded-3xl shadow-sm border border-silver-accent/60 overflow-hidden animate-fade-up">
                
                {/* Header de la Tabla */}
                <div className="p-6 sm:p-8 border-b border-silver-accent/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-mist-white/30">
                    <div>
                        <h3 className="text-xl font-black text-midnight-blue uppercase tracking-tight">
                            {selectedCategory === 'All'
                                ? `Listado Oficial de Atletas - ${selectedDivision}`
                                : `Puestos Complementarios (5° en adelante) - ${selectedCategory}`}
                        </h3>
                        <p className="text-xs text-steel-gray font-medium mt-0.5">
                            {selectedCategory === 'All'
                                ? `Mostrando todos los atletas registrados en esta división (${filteredAthletes.length} clasificados)`
                                : `Atletas fuera del podio superior (${remainingAthletes.length} atletas)`}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-steel-gray bg-mist-white px-3 py-1.5 rounded-xl border border-silver-accent/60">
                            {selectedCategory === 'All'
                                ? `${filteredAthletes.length} atletas en lista`
                                : remainingAthletes.length > 0
                                ? `${remainingAthletes.length} atletas siguientes`
                                : 'Todos los atletas están en el Podio Superior'}
                        </span>
                    </div>
                </div>

                {/* Tabla Interactiva */}
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left min-w-[700px]">
                        <thead>
                            <tr className="bg-midnight-blue text-white text-xs">
                                <th className="px-6 py-4 font-black uppercase tracking-wider w-20">Rank</th>
                                <th className="px-6 py-4 font-black uppercase tracking-wider">Atleta</th>
                                <th className="px-6 py-4 font-black uppercase tracking-wider">Categoría / Modalidad</th>
                                <th className="px-6 py-4 font-black uppercase tracking-wider">Club / Academia</th>
                                <th className="px-6 py-4 font-black uppercase tracking-wider text-right">Puntaje</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-silver-accent/30 text-sm">
                            {(selectedCategory === 'All' ? filteredAthletes : remainingAthletes).map((athlete) => (
                                <tr key={athlete._id} className="hover:bg-mist-white/80 transition-colors group">
                                    <td className="px-6 py-4 font-black">
                                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-xl text-xs font-black ${
                                            athlete.position === 1
                                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                                : athlete.position === 2
                                                ? 'bg-slate-200 text-slate-800 border border-slate-300'
                                                : athlete.position <= 4
                                                ? 'bg-amber-50 text-amber-900 border border-amber-200'
                                                : 'bg-mist-white text-steel-gray'
                                        }`}>
                                            {athlete.position < 10 ? `0${athlete.position}` : athlete.position}°
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-midnight-blue group-hover:text-crimson-red transition-colors capitalize text-base">
                                            {athlete.athleteName}
                                        </div>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <span className="text-[10px] font-black uppercase tracking-wider text-steel-gray/60">
                                                {getDivision(athlete)} • {getGender(athlete)}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                athlete.modality === 'Kata' ? 'bg-indigo-50 text-indigo-700' : 'bg-red-50 text-crimson-red'
                                            }`}>
                                                {athlete.modality}
                                            </span>
                                            <span className="font-semibold text-steel-gray text-xs">
                                                {athlete.category}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-steel-gray text-xs">
                                        <div>
                                            <span>{athlete.academy || athlete.dojo || 'Selección FECOKA'}</span>
                                            {athlete.tournament && (
                                                <span className="block text-[10px] text-midnight-blue/70 font-semibold truncate max-w-xs mt-0.5">
                                                    🏆 {athlete.tournament}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="text-xl font-black text-midnight-blue">
                                            {athlete.points?.toLocaleString() || 0}
                                            <span className="text-[10px] uppercase ml-1 text-steel-gray/60 font-bold">pts</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {filteredAthletes.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <Trophy className="w-12 h-12 text-silver-accent mx-auto mb-3" />
                                        <p className="text-steel-gray font-bold text-base">No hay atletas registrados para este filtro</p>
                                        <p className="text-xs text-steel-gray/60 mt-1">Prueba seleccionando otra división o categoría</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Informativo */}
                <div className="p-6 bg-mist-white/50 border-t border-silver-accent/30 flex flex-col sm:flex-row items-center justify-between text-xs text-steel-gray gap-4">
                    <p className="font-medium">
                        * Listado oficial regulado por la Federación Costarricense de Karate (FECOKA) y la PKF.
                    </p>
                    <div className="flex items-center gap-4 text-[11px] font-bold">
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" /> Oro (1°)</span>
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-300" /> Plata (2°)</span>
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-700" /> Bronces (3° y 4°)</span>
                    </div>
                </div>

            </div>

        </div>
    );
}
