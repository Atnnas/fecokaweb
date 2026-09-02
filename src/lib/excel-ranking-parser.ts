import * as XLSX from 'xlsx';

export interface ParsedRankingItem {
    athleteName: string;
    division: string;
    gender: 'Masculino' | 'Femenino';
    modality: 'Kata' | 'Kumite';
    category: string;
    weightClass?: string;
    position: number;
    points: number;
    academy?: string;
    cellRef?: string;
}

export interface ParseRankingResult {
    tournamentName: string;
    items: ParsedRankingItem[];
    warnings: string[];
    summary: {
        totalItems: number;
        totalCategories: number;
        totalAthletes: number;
        divisionsCount: Record<string, number>;
        vacantSlots: number;
    };
}

/**
 * Normaliza los nombres de los atletas eliminando espacios extra y corrigiendo mayúsculas excesivas
 */
export function cleanAthleteName(name: string): string {
    if (!name) return '';
    let cleaned = name.trim().replace(/\s+/g, ' ');

    // Si está todo en mayúsculas sostenidas, convertir a formato Nombre Propio
    if (cleaned === cleaned.toUpperCase() && cleaned.length > 4) {
        cleaned = cleaned
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    // Corregir erratas específicas conocidas
    if (cleaned === 'RandY Guido Mena') cleaned = 'Randy Guido Mena';
    if (/^felipe alaro ferreto$/i.test(cleaned)) cleaned = 'Felipe Alfaro Ferreto';
    if (/^sol leuyer valverde$/i.test(cleaned)) cleaned = 'Sol Leuyer Valverde';

    return cleaned;
}

/**
 * Parsea el buffer de un archivo Excel de rankings
 */
export function parseRankingExcel(buffer: Buffer | ArrayBuffer, options?: { defaultPoints?: number; tournamentOverride?: string }): ParseRankingResult {
    const wb = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = wb.SheetNames[0];
    const sheet = wb.Sheets[sheetName];

    if (!sheet) {
        throw new Error('El archivo Excel no contiene hojas de cálculo válidas.');
    }

    const defaultPoints = options?.defaultPoints ?? 0;
    const warnings: string[] = [];
    const items: ParsedRankingItem[] = [];

    // 1. Verificar si corresponde a la matriz oficial FECOKA / Panamericano
    const a1Val = sheet['A1'] ? String(sheet['A1'].v || '').trim() : '';
    const a2Val = sheet['A2'] ? String(sheet['A2'].v || '').trim() : '';

    const tournamentName = options?.tournamentOverride?.trim() || a1Val || 'Campeonato Nacional FECOKA 2026';

    const isFecokaMatrix = a2Val === 'U12' || (sheet['B2'] && String(sheet['B2'].v).trim() === 'U14');

    if (isFecokaMatrix) {
        // Matriz por columnas:
        // Col A: U12, Col B: U14, Col C: CADETE, Col D: JUNIOR
        const cols: Array<{ key: string; division: string }> = [
            { key: 'A', division: 'U12' },
            { key: 'B', division: 'U14' },
            { key: 'C', division: 'Cadete' },
            { key: 'D', division: 'Junior' },
        ];

        const getVal = (col: string, row: number) => {
            const cell = sheet[`${col}${row}`];
            return cell && cell.v !== undefined && cell.v !== null ? String(cell.v).trim() : '';
        };

        let vacantSlots = 0;

        for (const { key, division } of cols) {
            // MASCULINO KATA: Filas 5 y 6
            const kataMasc1 = getVal(key, 5);
            const kataMasc2 = getVal(key, 6);
            const kataMascCat = `${division} Masculino Kata`;

            if (kataMasc1 && !kataMasc1.toLowerCase().includes('no hay')) {
                items.push({
                    athleteName: cleanAthleteName(kataMasc1),
                    division,
                    gender: 'Masculino',
                    modality: 'Kata',
                    category: kataMascCat,
                    position: 1,
                    points: defaultPoints,
                    cellRef: `${key}5`,
                });
            }
            if (kataMasc2 && !kataMasc2.toLowerCase().includes('no hay')) {
                items.push({
                    athleteName: cleanAthleteName(kataMasc2),
                    division,
                    gender: 'Masculino',
                    modality: 'Kata',
                    category: kataMascCat,
                    position: 2,
                    points: defaultPoints,
                    cellRef: `${key}6`,
                });
            }

            // MASCULINO KUMITE:
            // Categorías de peso inician en filas 8, 11, 14, 17, 20
            const maleRows = [
                { catR: 8, r1: 9, r2: 10 },
                { catR: 11, r1: 12, r2: 13 },
                { catR: 14, r1: 15, r2: 16 },
                { catR: 17, r1: 18, r2: 19 },
                { catR: 20, r1: 21, r2: 22 },
            ];

            for (const { catR, r1, r2 } of maleRows) {
                const weight = getVal(key, catR);
                if (!weight) continue;

                const catName = `${division} Masculino Kumite ${weight}`;
                const a1 = getVal(key, r1);
                const a2 = getVal(key, r2);

                if (a1 && !a1.toLowerCase().includes('no hay')) {
                    items.push({
                        athleteName: cleanAthleteName(a1),
                        division,
                        gender: 'Masculino',
                        modality: 'Kumite',
                        category: catName,
                        weightClass: weight,
                        position: 1,
                        points: defaultPoints,
                        cellRef: `${key}${r1}`,
                    });
                } else {
                    vacantSlots++;
                    warnings.push(`Cupo 1 vacante en ${catName} (${key}${r1})`);
                }

                if (a2 && !a2.toLowerCase().includes('no hay')) {
                    items.push({
                        athleteName: cleanAthleteName(a2),
                        division,
                        gender: 'Masculino',
                        modality: 'Kumite',
                        category: catName,
                        weightClass: weight,
                        position: 2,
                        points: defaultPoints,
                        cellRef: `${key}${r2}`,
                    });
                } else {
                    vacantSlots++;
                    warnings.push(`Cupo 2 vacante en ${catName} (${key}${r2})`);
                }
            }

            // FEMENINO KATA: Filas 25 y 26
            const kataFem1 = getVal(key, 25);
            const kataFem2 = getVal(key, 26);
            const kataFemCat = `${division} Femenino Kata`;

            if (kataFem1 && !kataFem1.toLowerCase().includes('no hay')) {
                items.push({
                    athleteName: cleanAthleteName(kataFem1),
                    division,
                    gender: 'Femenino',
                    modality: 'Kata',
                    category: kataFemCat,
                    position: 1,
                    points: defaultPoints,
                    cellRef: `${key}25`,
                });
            }
            if (kataFem2 && !kataFem2.toLowerCase().includes('no hay')) {
                items.push({
                    athleteName: cleanAthleteName(kataFem2),
                    division,
                    gender: 'Femenino',
                    modality: 'Kata',
                    category: kataFemCat,
                    position: 2,
                    points: defaultPoints,
                    cellRef: `${key}26`,
                });
            }

            // FEMENINO KUMITE:
            // Categorías de peso inician en filas 28, 31, 34, 37, 40
            const femaleRows = [
                { catR: 28, r1: 29, r2: 30 },
                { catR: 31, r1: 32, r2: 33 },
                { catR: 34, r1: 35, r2: 36 },
                { catR: 37, r1: 38, r2: 39 },
                { catR: 40, r1: 41, r2: 42 },
            ];

            for (const { catR, r1, r2 } of femaleRows) {
                const weight = getVal(key, catR);
                if (!weight) continue;

                const catName = `${division} Femenino Kumite ${weight}`;
                const a1 = getVal(key, r1);
                const a2 = getVal(key, r2);

                if (a1 && !a1.toLowerCase().includes('no hay')) {
                    items.push({
                        athleteName: cleanAthleteName(a1),
                        division,
                        gender: 'Femenino',
                        modality: 'Kumite',
                        category: catName,
                        weightClass: weight,
                        position: 1,
                        points: defaultPoints,
                        cellRef: `${key}${r1}`,
                    });
                } else {
                    vacantSlots++;
                    warnings.push(`Cupo 1 vacante en ${catName} (${key}${r1})`);
                }

                if (a2 && !a2.toLowerCase().includes('no hay')) {
                    items.push({
                        athleteName: cleanAthleteName(a2),
                        division,
                        gender: 'Femenino',
                        modality: 'Kumite',
                        category: catName,
                        weightClass: weight,
                        position: 2,
                        points: defaultPoints,
                        cellRef: `${key}${r2}`,
                    });
                } else {
                    vacantSlots++;
                    warnings.push(`Cupo 2 vacante en ${catName} (${key}${r2})`);
                }
            }
        }

        const uniqueAthletes = new Set(items.map(i => i.athleteName.toLowerCase())).size;
        const uniqueCategories = new Set(items.map(i => i.category)).size;

        const divisionsCount: Record<string, number> = {};
        items.forEach(i => {
            divisionsCount[i.division] = (divisionsCount[i.division] || 0) + 1;
        });

        return {
            tournamentName,
            items,
            warnings,
            summary: {
                totalItems: items.length,
                totalCategories: uniqueCategories,
                totalAthletes: uniqueAthletes,
                divisionsCount,
                vacantSlots,
            },
        };
    } else {
        // Formato tabular estándar de respaldo (ej. encabezados en fila 1: Atleta, Categoria, Posicion, etc.)
        const rows: any[] = XLSX.utils.sheet_to_json(sheet);
        let rowIdx = 1;

        for (const row of rows) {
            rowIdx++;
            const athleteName = row['Atleta'] || row['Nombre'] || row['Athlete'] || row['athleteName'];
            if (!athleteName) continue;

            const category = row['Categoria'] || row['Categoría'] || row['Category'] || 'General';
            const modalityStr = String(row['Modalidad'] || row['Modality'] || (category.toLowerCase().includes('kata') ? 'Kata' : 'Kumite')).trim();
            const modality: 'Kata' | 'Kumite' = modalityStr.toLowerCase().includes('kata') ? 'Kata' : 'Kumite';
            const position = parseInt(row['Posicion'] || row['Posición'] || row['Position'] || row['Lugar'] || '1', 10);
            const points = parseFloat(row['Puntos'] || row['Puntaje'] || row['Points'] || defaultPoints.toString());
            const academy = row['Academia'] || row['Dojo'] || row['Club'] || '';

            items.push({
                athleteName: cleanAthleteName(String(athleteName)),
                division: 'General',
                gender: category.toLowerCase().includes('fem') ? 'Femenino' : 'Masculino',
                modality,
                category: String(category),
                position: isNaN(position) ? 1 : position,
                points: isNaN(points) ? defaultPoints : points,
                academy: String(academy || ''),
                cellRef: `Row ${rowIdx}`,
            });
        }

        const uniqueAthletes = new Set(items.map(i => i.athleteName.toLowerCase())).size;
        const uniqueCategories = new Set(items.map(i => i.category)).size;

        return {
            tournamentName,
            items,
            warnings,
            summary: {
                totalItems: items.length,
                totalCategories: uniqueCategories,
                totalAthletes: uniqueAthletes,
                divisionsCount: { General: items.length },
                vacantSlots: 0,
            },
        };
    }
}
