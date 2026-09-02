import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Ranking from '@/models/Ranking';
import RankingBackup from '@/models/RankingBackup';
import { auth } from '@/auth';

// GET: Consultar si existe un respaldo para rollback
export async function GET() {
    const session = await auth();
    if (!session || session.user?.role === 'user') {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    try {
        await dbConnect();
        const latestBackup = await RankingBackup.findOne({}).sort({ createdAt: -1 });

        if (!latestBackup) {
            return NextResponse.json({ hasBackup: false });
        }

        return NextResponse.json({
            hasBackup: true,
            backup: {
                id: latestBackup._id,
                createdAt: latestBackup.createdAt,
                itemsCount: latestBackup.itemsCount,
                description: latestBackup.description,
                importedTournament: latestBackup.importedTournament,
            },
        });
    } catch (error: any) {
        console.error('Error al consultar respaldo de ranking:', error);
        return NextResponse.json({ error: 'Error al consultar estado de respaldo' }, { status: 500 });
    }
}

// POST: Ejecutar rollback al último respaldo
export async function POST() {
    const session = await auth();
    if (!session || session.user?.role === 'user') {
        return NextResponse.json({ error: 'No autorizado: permisos insuficientes' }, { status: 403 });
    }

    try {
        await dbConnect();

        // Obtener el respaldo más reciente
        const latestBackup = await RankingBackup.findOne({}).sort({ createdAt: -1 });

        if (!latestBackup) {
            return NextResponse.json({
                error: 'No se encontró ningún respaldo previo para restaurar.',
            }, { status: 404 });
        }

        // Limpiar la colección actual y restaurar los documentos del respaldo
        await Ranking.deleteMany({});

        if (latestBackup.rankings && latestBackup.rankings.length > 0) {
            // Eliminar _id o dejar que se reinserten
            const restoredDocs = latestBackup.rankings.map((r: any) => {
                const doc = { ...r };
                delete doc.__v;
                return doc;
            });
            await Ranking.insertMany(restoredDocs);
        }

        // Eliminar el respaldo consumido
        await RankingBackup.findByIdAndDelete(latestBackup._id);

        // Verificar si queda algún respaldo anterior
        const remainingBackup = await RankingBackup.findOne({}).sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            message: `Ranking restaurado exitosamente al estado del ${new Date(latestBackup.createdAt).toLocaleString('es-CR')}.`,
            restoredCount: latestBackup.itemsCount,
            hasMoreBackups: !!remainingBackup,
        });

    } catch (error: any) {
        console.error('Error durante rollback de ranking:', error);
        return NextResponse.json({
            error: 'Error al ejecutar la restauración del ranking anterior.',
            details: error.message,
        }, { status: 500 });
    }
}
