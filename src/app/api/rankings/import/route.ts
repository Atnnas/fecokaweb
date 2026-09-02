import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Ranking from '@/models/Ranking';
import RankingBackup from '@/models/RankingBackup';
import { auth } from '@/auth';
import { parseRankingExcel, ParsedRankingItem } from '@/lib/excel-ranking-parser';

export async function POST(req: Request) {
    const session = await auth();

    if (!session || session.user?.role === 'user') {
        return NextResponse.json({ error: 'No autorizado: permisos insuficientes' }, { status: 403 });
    }

    try {
        await dbConnect();
        const contentType = req.headers.get('content-type') || '';

        let items: ParsedRankingItem[] = [];
        let tournamentName = 'Campeonato Panamericano Juvenil Costa Rica 2026';
        let mode = 'replace'; // 'replace' | 'append'
        let defaultPoints = 0;
        let isPreviewOnly = false;
        let warnings: string[] = [];
        let summary: any = null;

        if (contentType.includes('multipart/form-data')) {
            const formData = await req.formData();
            const file = formData.get('file') as File | null;
            const modeParam = formData.get('mode') as string | null;
            const tournamentOverride = formData.get('tournamentName') as string | null;
            const pointsParam = formData.get('defaultPoints') as string | null;
            const actionParam = formData.get('action') as string | null;

            if (!file) {
                return NextResponse.json({ error: 'No se ha adjuntado ningún archivo Excel' }, { status: 400 });
            }

            if (modeParam) mode = modeParam;
            if (pointsParam) defaultPoints = parseInt(pointsParam, 10) || 0;
            if (actionParam === 'preview') isPreviewOnly = true;

            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const parseResult = parseRankingExcel(buffer, {
                defaultPoints,
                tournamentOverride: tournamentOverride || undefined,
            });

            tournamentName = parseResult.tournamentName;
            items = parseResult.items;
            warnings = parseResult.warnings;
            summary = parseResult.summary;

            // Si solo se solicitó previsualización, retornamos sin escribir a BD
            if (isPreviewOnly) {
                return NextResponse.json({
                    success: true,
                    preview: true,
                    tournamentName,
                    items,
                    warnings,
                    summary,
                });
            }
        } else {
            // Payload JSON directo
            const body = await req.json();
            items = body.items || [];
            if (body.tournamentName) tournamentName = body.tournamentName;
            if (body.mode) mode = body.mode;
            if (body.defaultPoints !== undefined) defaultPoints = body.defaultPoints;
        }

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'No se encontraron registros válidos de atletas para importar.' }, { status: 400 });
        }

        // Recuperar historial previo de los atletas existentes para no perder su histórico
        const existingRankings = await Ranking.find({});
        const athleteHistoryMap = new Map<string, any[]>();

        existingRankings.forEach(r => {
            const key = r.athleteName.toLowerCase().trim();
            if (r.history && r.history.length > 0) {
                athleteHistoryMap.set(key, r.history);
            }
        });

        // Preparar los documentos a insertar con su historial acumulado
        const documentsToInsert = items.map(item => {
            const key = item.athleteName.toLowerCase().trim();
            const prevHistory = athleteHistoryMap.get(key) || [];

            const newHistoryEntry = {
                tournament: tournamentName,
                category: item.category,
                modality: item.modality,
                position: item.position,
                points: item.points,
                date: new Date(),
            };

            // Evitar duplicar la misma entrada histórica si ya existe para este torneo
            const filteredPrev = prevHistory.filter(
                h => !(h.tournament === tournamentName && h.category === item.category)
            );

            return {
                athleteName: item.athleteName,
                category: item.category,
                modality: item.modality,
                points: item.points,
                position: item.position,
                academy: item.academy || '',
                tournament: tournamentName,
                division: item.division,
                gender: item.gender,
                history: [...filteredPrev, newHistoryEntry],
                updatedAt: new Date(),
            };
        });

        // Guardar respaldo de los datos actuales antes de aplicar cambios para permitir Rollback
        const currentRankings = await Ranking.find({}).lean();
        await RankingBackup.create({
            description: `Previo a importar: ${tournamentName}`,
            rankings: currentRankings,
            itemsCount: currentRankings.length,
            importedTournament: tournamentName,
            createdAt: new Date(),
        });

        if (mode === 'replace') {
            // Reemplaza los rankings activos actuales
            await Ranking.deleteMany({});
            await Ranking.insertMany(documentsToInsert);
        } else {
            // Modo anexar/actualizar atleta por atleta
            for (const doc of documentsToInsert) {
                await Ranking.findOneAndUpdate(
                    {
                        athleteName: doc.athleteName,
                        category: doc.category,
                    },
                    {
                        $set: {
                            modality: doc.modality,
                            points: doc.points,
                            position: doc.position,
                            academy: doc.academy,
                            tournament: doc.tournament,
                            division: doc.division,
                            gender: doc.gender,
                            updatedAt: doc.updatedAt,
                        },
                        $push: {
                            history: {
                                tournament: doc.tournament,
                                category: doc.category,
                                modality: doc.modality,
                                position: doc.position,
                                points: doc.points,
                                date: new Date(),
                            },
                        },
                    },
                    { upsert: true, new: true }
                );
            }
        }

        return NextResponse.json({
            success: true,
            message: `Se importaron exitosamente ${documentsToInsert.length} registros de atletas en ${summary?.totalCategories || 'múltiples'} categorías.`,
            count: documentsToInsert.length,
            tournament: tournamentName,
            mode,
            warnings,
            summary,
        }, { status: 200 });

    } catch (error: any) {
        console.error('Error en POST /api/rankings/import:', error);
        return NextResponse.json({
            error: 'Error al procesar e importar el archivo de rankings',
            details: error.message,
        }, { status: 500 });
    }
}
