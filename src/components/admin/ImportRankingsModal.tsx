'use client';

import React, { useState, useRef } from 'react';
import {
    UploadCloud,
    FileSpreadsheet,
    AlertTriangle,
    CheckCircle2,
    X,
    Search,
    Trophy,
    RefreshCw,
    Layers,
    Users,
    Trash2,
    Plus,
    Edit2,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { ParsedRankingItem } from '@/lib/excel-ranking-parser';

interface ImportRankingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const ImportRankingsModal: React.FC<ImportRankingsModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
}) => {
    const [file, setFile] = useState<File | null>(null);
    const [loadingPreview, setLoadingPreview] = useState(false);
    const [loadingImport, setLoadingImport] = useState(false);

    // Items editables en memoria
    const [editableItems, setEditableItems] = useState<ParsedRankingItem[]>([]);
    const [tournamentName, setTournamentName] = useState('');
    const [warnings, setWarnings] = useState<string[]>([]);
    const [showWarnings, setShowWarnings] = useState(false);

    const [activeDivision, setActiveDivision] = useState<string>('Todas');
    const [mode, setMode] = useState<'replace' | 'append'>('replace');
    const [pointsOption, setPointsOption] = useState<'zero' | 'custom'>('zero');
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Modal para agregar un atleta faltante manualmente
    const [isAddFormOpen, setIsAddFormOpen] = useState(false);
    const [newAthlete, setNewAthlete] = useState({
        athleteName: '',
        division: 'Junior',
        gender: 'Femenino' as 'Masculino' | 'Femenino',
        modality: 'Kumite' as 'Kata' | 'Kumite',
        category: 'Junior Femenino Kumite -53kg',
        position: 2,
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleFileChange = async (selectedFile: File) => {
        if (!selectedFile) return;
        setFile(selectedFile);
        setErrorMsg(null);
        setLoadingPreview(true);

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('action', 'preview');

            const res = await fetch('/api/rankings/import', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Error al procesar el archivo Excel.');
            }

            const data = await res.json();
            setEditableItems(data.items || []);
            setWarnings(data.warnings || []);
            setTournamentName(data.tournamentName || 'Campeonato Panamericano Juvenil Costa Rica 2026');
        } catch (err: any) {
            console.error('Error previsualizando Excel:', err);
            setErrorMsg(err.message || 'Error al leer el archivo Excel.');
            setFile(null);
            setEditableItems([]);
        } finally {
            setLoadingPreview(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileChange(e.dataTransfer.files[0]);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    // Actualizar nombre de atleta en línea
    const handleUpdateAthleteName = (index: number, newName: string) => {
        setEditableItems(prev => {
            const next = [...prev];
            next[index] = { ...next[index], athleteName: newName };
            return next;
        });
    };

    // Alternar posición 1° y 2°
    const handleTogglePosition = (index: number) => {
        setEditableItems(prev => {
            const next = [...prev];
            const currentPos = next[index].position;
            next[index] = { ...next[index], position: currentPos === 1 ? 2 : 1 };
            return next;
        });
    };

    // Eliminar fila de atleta
    const handleDeleteItem = (index: number) => {
        setEditableItems(prev => prev.filter((_, i) => i !== index));
    };

    // Agregar atleta manualmente
    const handleAddAthlete = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAthlete.athleteName.trim()) return;

        setEditableItems(prev => [
            ...prev,
            {
                athleteName: newAthlete.athleteName.trim(),
                division: newAthlete.division,
                gender: newAthlete.gender,
                modality: newAthlete.modality,
                category: newAthlete.category.trim() || `${newAthlete.division} ${newAthlete.gender} ${newAthlete.modality}`,
                position: newAthlete.position,
                points: pointsOption === 'custom' ? (newAthlete.position === 1 ? 100 : 70) : 0,
                cellRef: 'Manual',
            },
        ]);

        setNewAthlete({
            athleteName: '',
            division: 'Junior',
            gender: 'Femenino',
            modality: 'Kumite',
            category: 'Junior Femenino Kumite -53kg',
            position: 2,
        });
        setIsAddFormOpen(false);
    };

    const handleConfirmImport = async () => {
        if (!editableItems || editableItems.length === 0) return;

        setLoadingImport(true);
        setErrorMsg(null);

        try {
            // Asignar puntajes según la política seleccionada
            const finalItems = editableItems.map(item => ({
                ...item,
                points: pointsOption === 'custom' ? (item.position === 1 ? 100 : 70) : 0,
            }));

            const res = await fetch('/api/rankings/import', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: finalItems,
                    tournamentName: tournamentName.trim() || 'Campeonato Panamericano Juvenil Costa Rica 2026',
                    mode,
                    defaultPoints: pointsOption === 'custom' ? 100 : 0,
                }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Error durante la importación.');
            }

            onSuccess();
            handleClose();
        } catch (err: any) {
            console.error('Error al importar:', err);
            setErrorMsg(err.message || 'Error al guardar los rankings.');
        } finally {
            setLoadingImport(false);
        }
    };

    const handleClose = () => {
        setFile(null);
        setEditableItems([]);
        setErrorMsg(null);
        setSearchTerm('');
        setActiveDivision('Todas');
        setIsAddFormOpen(false);
        onClose();
    };

    // Estadísticas dinámicas basadas en los elementos editados
    const uniqueAthletesCount = new Set(editableItems.map(i => i.athleteName.toLowerCase().trim())).size;
    const uniqueCategoriesCount = new Set(editableItems.map(i => i.category)).size;

    // Divisiones disponibles para las pestañas
    const divisions = ['Todas', 'U12', 'U14', 'Cadete', 'Junior'];

    // Filtro por división y búsqueda
    const filteredItemsWithIndex = editableItems
        .map((item, originalIndex) => ({ item, originalIndex }))
        .filter(({ item }) => {
            const matchesDivision =
                activeDivision === 'Todas' ||
                item.division.toLowerCase() === activeDivision.toLowerCase();

            const term = searchTerm.toLowerCase().trim();
            const matchesSearch =
                !term ||
                item.athleteName.toLowerCase().includes(term) ||
                item.category.toLowerCase().includes(term) ||
                item.modality.toLowerCase().includes(term);

            return matchesDivision && matchesSearch;
        });

    return (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
            {/* Backdrop minimalista con desenfoque suave */}
            <div
                className="fixed inset-0 bg-midnight-blue/70 backdrop-blur-md transition-opacity"
                onClick={handleClose}
            />

            <div className="flex min-h-full items-center justify-center p-3 sm:p-6 lg:p-8">
                <div className="relative bg-white w-full max-w-5xl shadow-2xl rounded-2xl border border-silver-accent/40 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in duration-300">
                    
                    {/* Header Ejecutivo Minimalista */}
                    <div className="flex justify-between items-center px-6 sm:px-8 py-5 border-b border-silver-accent/20 bg-white sticky top-0 z-20">
                        <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-xl bg-midnight-blue text-white flex items-center justify-center shadow-xs">
                                <FileSpreadsheet className="w-5 h-5 text-crimson-red" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-midnight-blue uppercase tracking-tight">
                                    Importar <span className="text-crimson-red">Ranking</span>
                                </h2>
                                <p className="text-[11px] text-steel-gray font-bold">
                                    Revisa, edita los nombres o posiciones en vivo y confirma la publicación oficial.
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleClose}
                            className="w-9 h-9 bg-mist-white hover:bg-crimson-red hover:text-white rounded-lg flex items-center justify-center transition-all group cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Contenedor principal con scroll */}
                    <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar flex-1 space-y-6">

                        {errorMsg && (
                            <div className="p-4 bg-red-50 border-l-4 border-crimson-red text-crimson-red rounded-r-xl flex items-center gap-3">
                                <AlertTriangle className="w-5 h-5 shrink-0" />
                                <span className="text-xs font-bold">{errorMsg}</span>
                            </div>
                        )}

                        {/* PASO 1: Subida de archivo (si aún no hay datos) */}
                        {editableItems.length === 0 ? (
                            <div
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-silver-accent/60 hover:border-crimson-red bg-mist-white/40 hover:bg-mist-white/80 transition-all rounded-2xl p-12 text-center cursor-pointer group flex flex-col items-center justify-center"
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    accept=".xlsx, .xls"
                                    className="hidden"
                                    onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                                />
                                <div className="w-16 h-16 bg-white rounded-2xl shadow-xs flex items-center justify-center mb-4 group-hover:scale-105 transition-transform border border-silver-accent/30">
                                    {loadingPreview ? (
                                        <RefreshCw className="w-8 h-8 text-crimson-red animate-spin" />
                                    ) : (
                                        <UploadCloud className="w-8 h-8 text-midnight-blue group-hover:text-crimson-red transition-colors" />
                                    )}
                                </div>
                                <h3 className="text-base font-black text-midnight-blue uppercase tracking-wider mb-1">
                                    {loadingPreview ? 'Analizando archivo Excel...' : 'Arrastra el archivo Excel o haz clic para seleccionarlo'}
                                </h3>
                                <p className="text-xs text-steel-gray font-medium max-w-sm">
                                    Compatible con el formato oficial de clasificación Panamericano y listados tabulares.
                                </p>
                                <span className="inline-block mt-4 px-3 py-1 bg-midnight-blue text-white rounded-full text-[10px] font-black uppercase tracking-wider">
                                    .XLSX / .XLS
                                </span>
                            </div>
                        ) : (
                            /* PASO 2: Previsualización interactiva y editable */
                            <div className="space-y-5">
                                {/* Barra superior con datos del archivo y métricas clave */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    <div className="bg-mist-white/60 border border-silver-accent/30 p-3.5 rounded-xl">
                                        <div className="flex items-center justify-between text-steel-gray mb-0.5">
                                            <span className="text-[10px] font-black uppercase tracking-wider">Total Atletas</span>
                                            <Users className="w-3.5 h-3.5 text-midnight-blue" />
                                        </div>
                                        <p className="text-xl font-black text-midnight-blue">{editableItems.length}</p>
                                        <p className="text-[10px] font-bold text-steel-gray">{uniqueAthletesCount} únicos</p>
                                    </div>
                                    <div className="bg-mist-white/60 border border-silver-accent/30 p-3.5 rounded-xl">
                                        <div className="flex items-center justify-between text-steel-gray mb-0.5">
                                            <span className="text-[10px] font-black uppercase tracking-wider">Categorías</span>
                                            <Layers className="w-3.5 h-3.5 text-indigo-600" />
                                        </div>
                                        <p className="text-xl font-black text-indigo-600">{uniqueCategoriesCount}</p>
                                        <p className="text-[10px] font-bold text-steel-gray">Kata y Kumite</p>
                                    </div>
                                    <div className="bg-mist-white/60 border border-silver-accent/30 p-3.5 rounded-xl">
                                        <div className="flex items-center justify-between text-steel-gray mb-0.5">
                                            <span className="text-[10px] font-black uppercase tracking-wider">Podio</span>
                                            <Trophy className="w-3.5 h-3.5 text-amber-500" />
                                        </div>
                                        <p className="text-xl font-black text-amber-600">1° y 2°</p>
                                        <p className="text-[10px] font-bold text-steel-gray">Asignados</p>
                                    </div>
                                    <div className="bg-mist-white/60 border border-silver-accent/30 p-3.5 rounded-xl flex flex-col justify-between">
                                        <div className="flex items-center justify-between text-steel-gray mb-0.5">
                                            <span className="text-[10px] font-black uppercase tracking-wider">Archivo</span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFile(null);
                                                    setEditableItems([]);
                                                }}
                                                className="text-[10px] font-black text-crimson-red hover:underline"
                                            >
                                                Cambiar
                                            </button>
                                        </div>
                                        <p className="text-xs font-bold text-midnight-blue truncate" title={file?.name}>{file?.name}</p>
                                        <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                                            <CheckCircle2 className="w-3 h-3" /> Listo para revisar
                                        </p>
                                    </div>
                                </div>

                                {/* Advertencias detectadas (Colapsable) */}
                                {warnings.length > 0 && (
                                    <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl overflow-hidden text-xs">
                                        <button
                                            type="button"
                                            onClick={() => setShowWarnings(!showWarnings)}
                                            className="w-full px-4 py-2.5 flex items-center justify-between font-bold text-amber-800 hover:bg-amber-100/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                <AlertTriangle className="w-4 h-4 text-amber-600" />
                                                <span>Se detectaron {warnings.length} cupos vacantes o desiertos en el archivo</span>
                                            </div>
                                            {showWarnings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                        </button>
                                        {showWarnings && (
                                            <div className="px-4 pb-3 pt-1 space-y-1 border-t border-amber-200/50 text-[11px] text-amber-900 font-medium">
                                                {warnings.map((w, idx) => (
                                                    <p key={idx}>• {w}</p>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Parámetros del Torneo y Opciones */}
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-mist-white/40 p-4 rounded-xl border border-silver-accent/30">
                                    <div className="md:col-span-6">
                                        <label className="block text-[10px] font-black text-midnight-blue uppercase tracking-wider mb-1">
                                            Nombre del Torneo / Edición
                                        </label>
                                        <input
                                            type="text"
                                            value={tournamentName}
                                            onChange={(e) => setTournamentName(e.target.value)}
                                            className="w-full px-3.5 py-2 bg-white border border-silver-accent/50 rounded-lg text-xs font-bold text-midnight-blue focus:border-midnight-blue outline-none"
                                        />
                                    </div>
                                    <div className="md:col-span-3">
                                        <label className="block text-[10px] font-black text-midnight-blue uppercase tracking-wider mb-1">
                                            Puntos
                                        </label>
                                        <select
                                            value={pointsOption}
                                            onChange={(e) => setPointsOption(e.target.value as any)}
                                            className="w-full px-3 py-2 bg-white border border-silver-accent/50 rounded-lg text-xs font-bold text-midnight-blue focus:border-midnight-blue outline-none cursor-pointer"
                                        >
                                            <option value="zero">0 puntos (Sin puntaje)</option>
                                            <option value="custom">Puntos por podio (1°: 100, 2°: 70)</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-3">
                                        <label className="block text-[10px] font-black text-midnight-blue uppercase tracking-wider mb-1">
                                            Acción en BD
                                        </label>
                                        <select
                                            value={mode}
                                            onChange={(e) => setMode(e.target.value as any)}
                                            className="w-full px-3 py-2 bg-white border border-silver-accent/50 rounded-lg text-xs font-bold text-midnight-blue focus:border-midnight-blue outline-none cursor-pointer"
                                        >
                                            <option value="replace">Reemplazar ranking actual</option>
                                            <option value="append">Anexar a los existentes</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Barra de Filtros por División + Búsqueda + Agregar Atleta */}
                                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-2">
                                    {/* Pestañas de División */}
                                    <div className="inline-flex p-1 bg-mist-white rounded-xl gap-1 overflow-x-auto custom-scrollbar">
                                        {divisions.map((div) => {
                                            const count = div === 'Todas'
                                                ? editableItems.length
                                                : editableItems.filter(i => i.division.toLowerCase() === div.toLowerCase()).length;
                                            return (
                                                <button
                                                    key={div}
                                                    type="button"
                                                    onClick={() => setActiveDivision(div)}
                                                    className={`px-3 py-1.5 rounded-lg text-[11px] font-black tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                                                        activeDivision === div
                                                            ? 'bg-midnight-blue text-white shadow-xs'
                                                            : 'text-steel-gray hover:text-midnight-blue hover:bg-white/60'
                                                    }`}
                                                >
                                                    {div} <span className="opacity-70 text-[9px]">({count})</span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Buscador + Botón Agregar Atleta */}
                                    <div className="flex items-center gap-2">
                                        <div className="relative flex-1 sm:w-56">
                                            <Search className="w-3.5 h-3.5 text-silver-accent absolute left-3 top-1/2 -translate-y-1/2" />
                                            <input
                                                type="text"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                placeholder="Filtrar atleta..."
                                                className="w-full pl-8 pr-3 py-1.5 bg-white border border-silver-accent/50 rounded-lg text-xs font-bold text-midnight-blue focus:border-midnight-blue outline-none"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setIsAddFormOpen(!isAddFormOpen)}
                                            className="px-3 py-1.5 bg-mist-white hover:bg-midnight-blue hover:text-white border border-silver-accent/40 rounded-lg text-xs font-black text-midnight-blue transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                                            title="Agregar cupo o atleta adicional"
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                            <span className="hidden sm:inline">Agregar</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Formulario para agregar atleta manualmente (desplegable) */}
                                {isAddFormOpen && (
                                    <form onSubmit={handleAddAthlete} className="bg-mist-white/70 p-4 rounded-xl border border-midnight-blue/20 grid grid-cols-1 sm:grid-cols-6 gap-3 animate-in fade-in duration-200">
                                        <div className="sm:col-span-2">
                                            <label className="block text-[10px] font-bold text-midnight-blue uppercase mb-1">Nombre Atleta</label>
                                            <input
                                                type="text"
                                                required
                                                value={newAthlete.athleteName}
                                                onChange={(e) => setNewAthlete({ ...newAthlete, athleteName: e.target.value })}
                                                placeholder="Ej: Sofía Vargas..."
                                                className="w-full px-3 py-1.5 bg-white border border-silver-accent rounded-lg text-xs font-bold text-midnight-blue"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-midnight-blue uppercase mb-1">División</label>
                                            <select
                                                value={newAthlete.division}
                                                onChange={(e) => setNewAthlete({ ...newAthlete, division: e.target.value })}
                                                className="w-full px-2 py-1.5 bg-white border border-silver-accent rounded-lg text-xs font-bold"
                                            >
                                                <option value="U12">U12</option>
                                                <option value="U14">U14</option>
                                                <option value="Cadete">Cadete</option>
                                                <option value="Junior">Junior</option>
                                            </select>
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-[10px] font-bold text-midnight-blue uppercase mb-1">Categoría</label>
                                            <input
                                                type="text"
                                                required
                                                value={newAthlete.category}
                                                onChange={(e) => setNewAthlete({ ...newAthlete, category: e.target.value })}
                                                placeholder="Ej: Junior Femenino Kumite -53kg"
                                                className="w-full px-3 py-1.5 bg-white border border-silver-accent rounded-lg text-xs font-bold text-midnight-blue"
                                            />
                                        </div>
                                        <div className="flex items-end gap-2">
                                            <button
                                                type="submit"
                                                className="w-full py-1.5 bg-midnight-blue hover:bg-crimson-red text-white text-xs font-black uppercase rounded-lg transition-colors cursor-pointer"
                                            >
                                                Añadir
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {/* Tabla de Atletas con Edición en Línea */}
                                <div className="border border-silver-accent/40 rounded-xl overflow-hidden max-h-72 overflow-y-auto custom-scrollbar shadow-xs">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-midnight-blue text-white sticky top-0 z-10">
                                            <tr>
                                                <th className="px-4 py-2.5 font-black uppercase text-[10px] tracking-wider w-20">Lugar</th>
                                                <th className="px-4 py-2.5 font-black uppercase text-[10px] tracking-wider">Nombre del Atleta (Editable)</th>
                                                <th className="px-4 py-2.5 font-black uppercase text-[10px] tracking-wider">Categoría / Modalidad</th>
                                                <th className="px-4 py-2.5 font-black uppercase text-[10px] tracking-wider w-20">División</th>
                                                <th className="px-4 py-2.5 font-black uppercase text-[10px] tracking-wider text-right w-16">Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-silver-accent/20 bg-white">
                                            {filteredItemsWithIndex.length > 0 ? (
                                                filteredItemsWithIndex.map(({ item, originalIndex }) => (
                                                    <tr key={originalIndex} className="hover:bg-mist-white/60 transition-colors group">
                                                        {/* Toggle de Posición 1° / 2° */}
                                                        <td className="px-4 py-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleTogglePosition(originalIndex)}
                                                                title="Clic para alternar entre 1° y 2° lugar"
                                                                className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-[11px] font-black cursor-pointer transition-transform hover:scale-110 ${
                                                                    item.position === 1
                                                                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                                                        : 'bg-slate-100 text-slate-700 border border-slate-300'
                                                                }`}
                                                            >
                                                                {item.position}°
                                                            </button>
                                                        </td>

                                                        {/* Campo de Nombre Editable en Línea */}
                                                        <td className="px-4 py-2">
                                                            <div className="relative flex items-center">
                                                                <input
                                                                    type="text"
                                                                    value={item.athleteName}
                                                                    onChange={(e) => handleUpdateAthleteName(originalIndex, e.target.value)}
                                                                    className="w-full px-2.5 py-1 bg-transparent hover:bg-mist-white focus:bg-white border border-transparent focus:border-midnight-blue/40 rounded text-xs font-bold text-midnight-blue transition-colors outline-none"
                                                                />
                                                                <Edit2 className="w-3 h-3 text-steel-gray/30 opacity-0 group-hover:opacity-100 pointer-events-none absolute right-2" />
                                                            </div>
                                                        </td>

                                                        {/* Categoría y Modalidad */}
                                                        <td className="px-4 py-2">
                                                            <div className="flex items-center gap-2">
                                                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                                                                    item.modality === 'Kata' ? 'bg-indigo-50 text-indigo-700' : 'bg-red-50 text-crimson-red'
                                                                }`}>
                                                                    {item.modality}
                                                                </span>
                                                                <span className="text-steel-gray font-semibold truncate max-w-xs">{item.category}</span>
                                                            </div>
                                                        </td>

                                                        {/* División */}
                                                        <td className="px-4 py-2 font-bold text-steel-gray text-[11px]">
                                                            {item.division}
                                                        </td>

                                                        {/* Acción: Eliminar fila */}
                                                        <td className="px-4 py-2 text-right">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteItem(originalIndex)}
                                                                className="p-1.5 text-steel-gray hover:text-crimson-red hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                                                title="Quitar atleta de la importación"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={5} className="py-8 text-center text-steel-gray font-bold">
                                                        No se encontraron atletas para los filtros aplicados.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer con Acciones */}
                    <div className="px-6 sm:px-8 py-4 border-t border-silver-accent/20 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="text-xs text-steel-gray font-medium">
                            {editableItems.length > 0 && (
                                <span className="flex items-center gap-1.5">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    <span>Se creará un respaldo automático para permitir <b>Rollback</b> si lo requieres.</span>
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2.5 w-full sm:w-auto">
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={loadingImport}
                                className="w-full sm:w-auto px-5 py-2.5 border border-silver-accent text-steel-gray hover:text-midnight-blue hover:bg-mist-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                            >
                                Cancelar
                            </button>
                            {editableItems.length > 0 && (
                                <button
                                    type="button"
                                    onClick={handleConfirmImport}
                                    disabled={loadingImport}
                                    className="w-full sm:w-auto px-7 py-2.5 bg-midnight-blue hover:bg-crimson-red text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md hover:shadow-crimson-red/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    {loadingImport ? (
                                        <>
                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                            Guardando...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                                            Confirmar e Importar ({editableItems.length})
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
