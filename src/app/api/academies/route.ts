import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Academy from '@/models/Academy';
import { auth } from '@/auth';

import { z } from 'zod';

const AcademySchema = z.object({
    name: z.string().min(1, "El nombre es muy corto"),
    instructor: z.string().min(1, "El instructor es muy corto"),
    location: z.string().min(1, "La ubicación es muy corta"),
    contact: z.string().optional(),
    logo: z.string().optional().or(z.literal('')),
    instructorPhoto: z.string().optional().or(z.literal('')),
    website: z.string().optional().or(z.literal('')),
    status: z.enum(['active', 'inactive']).default('active'),
});

export async function GET() {
    await dbConnect();
    try {
        const academies = await Academy.find({}).sort({ name: 1 });
        return NextResponse.json(academies);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching academies' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session || session.user?.role === 'user') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();
    try {
        const body = await req.json();
        const validatedData = AcademySchema.parse(body);
        const academy = await Academy.create(validatedData);
        return NextResponse.json(academy, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error("Zod Validation Error (POST Academy):", JSON.stringify(error.issues, null, 2));
            return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: 'Error creating academy' }, { status: 400 });
    }
}

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

        const validatedData = AcademySchema.partial().parse(data);
        const updatedAcademy = await Academy.findByIdAndUpdate(id, { $set: validatedData }, { new: true });
        if (!updatedAcademy) return NextResponse.json({ error: 'Academy not found' }, { status: 404 });

        return NextResponse.json(updatedAcademy);
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error("Zod Validation Error (PATCH Academy):", JSON.stringify(error.issues, null, 2));
            return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: 'Error updating academy' }, { status: 400 });
    }
}

export async function DELETE(req: Request) {
    const session = await auth();
    if (!session || session.user?.role === 'user') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();
    try {
        const { id } = await req.json();
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        const deletedAcademy = await Academy.findByIdAndDelete(id);
        if (!deletedAcademy) return NextResponse.json({ error: 'Academy not found' }, { status: 404 });

        return NextResponse.json({ message: 'Academy deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting academy' }, { status: 500 });
    }
}
