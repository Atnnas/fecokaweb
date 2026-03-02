import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Ranking from '@/models/Ranking';
import { auth } from '@/auth';

import { z } from 'zod';

const RankingSchema = z.object({
    position: z.number().int().positive(),
    athleteName: z.string().min(1, "El nombre es muy corto"),
    category: z.string(),
    points: z.number().nonnegative(),
    academy: z.string().optional(),
    avatar: z.string().optional().or(z.literal('')),
});

export async function GET() {
    try {
        await dbConnect();
        const rankings = await Ranking.find({}).sort({ position: 1 });
        return NextResponse.json(rankings);
    } catch (error: any) {
        console.error("GET /api/rankings error:", error);
        return NextResponse.json({ error: 'Error fetching rankings', details: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await auth();

    if (!session || session.user?.role === 'user') {
        return NextResponse.json({ error: 'Unauthorized: Insufficient permissions' }, { status: 403 });
    }

    try {
        await dbConnect();
        const body = await req.json();

        // Support either single object or array for bulk upload
        if (Array.isArray(body)) {
            const validatedData = z.array(RankingSchema).parse(body);
            await Ranking.deleteMany({}); // Clear current rankings for full refresh if needed
            const rankings = await Ranking.insertMany(validatedData);
            return NextResponse.json(rankings, { status: 201 });
        }

        const validatedData = RankingSchema.parse(body);
        const ranking = await Ranking.create(validatedData);
        return NextResponse.json(ranking, { status: 201 });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            console.error("Zod Validation Error (POST Ranking):", JSON.stringify(error.issues, null, 2));
            return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 });
        }
        console.error("POST /api/rankings error:", error);
        return NextResponse.json({ error: 'Error updating rankings', details: error.message }, { status: 400 });
    }
}

// PATCH update ranking (Admin/Edit only)
export async function PATCH(req: Request) {
    const session = await auth();
    if (!session || session.user?.role === 'user') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();
    try {
        const body = await req.json();
        const { id, ...data } = body;
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        const validatedData = RankingSchema.partial().parse(data);
        const updatedRanking = await Ranking.findByIdAndUpdate(id, { $set: validatedData }, { new: true });
        if (!updatedRanking) return NextResponse.json({ error: 'Ranking not found' }, { status: 404 });

        return NextResponse.json(updatedRanking);
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error("Zod Validation Error (PATCH Ranking):", JSON.stringify(error.issues, null, 2));
            return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: 'Error updating ranking' }, { status: 400 });
    }
}

// DELETE ranking (Admin/Edit only)
export async function DELETE(req: Request) {
    const session = await auth();
    if (!session || session.user?.role === 'user') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();
    try {
        const { id } = await req.json();
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        const deletedRanking = await Ranking.findByIdAndDelete(id);
        if (!deletedRanking) return NextResponse.json({ error: 'Ranking not found' }, { status: 404 });

        return NextResponse.json({ message: 'Ranking deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting ranking' }, { status: 500 });
    }
}
