import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Sponsor from '@/models/Sponsor';
import { auth } from '@/auth';
import { canEdit } from '@/lib/auth-utils';
import { SponsorSchema } from '@/lib/validations/sponsor';
import { z } from 'zod';

// GET — Public/Admin: list sponsors
export async function GET(req: Request) {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const isAdminView = searchParams.get('admin') === 'true';

    try {
        let query: any = {};
        if (!isAdminView) {
            const now = new Date();
            query = {
                isActive: true,
                $and: [
                    {
                        $or: [
                            { contractStart: { $exists: false } },
                            { contractStart: null },
                            { contractStart: { $lte: now } }
                        ]
                    },
                    {
                        $or: [
                            { contractEnd: { $exists: false } },
                            { contractEnd: null },
                            { contractEnd: { $gte: now } }
                        ]
                    }
                ]
            };
        }
        const sponsors = await Sponsor.find(query).sort({ order: 1 });
        return NextResponse.json(sponsors);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching sponsors' }, { status: 500 });
    }
}

// POST — Admin: create sponsor
export async function POST(req: Request) {
    const session = await auth();

    if (!canEdit(session)) {
        return NextResponse.json({ error: 'Unauthorized: Insufficient permissions' }, { status: 403 });
    }

    await dbConnect();
    try {
        const body = await req.json();
        console.log("Sponsors POST Payload:", JSON.stringify(body, null, 2));
        const validatedData = SponsorSchema.parse(body);

        const sponsor = await Sponsor.create(validatedData);
        return NextResponse.json(sponsor, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error("Zod Validation Error (Sponsors POST):", JSON.stringify(error.issues, null, 2));
            return NextResponse.json({
                error: 'Validation failed',
                details: error.issues.map(i => `${i.path.join('.')}: ${i.message}`)
            }, { status: 400 });
        }
        console.error("Error creating sponsor:", error);
        return NextResponse.json({ error: 'Error creating sponsor' }, { status: 500 });
    }
}

// PATCH — Admin: update sponsor
export async function PATCH(req: Request) {
    const session = await auth();

    if (!canEdit(session)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();
    try {
        const body = await req.json();
        const { id, ...data } = body;
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        const validatedData = SponsorSchema.partial().parse(data);

        const updatedSponsor = await Sponsor.findByIdAndUpdate(id, { $set: validatedData }, { new: true });
        if (!updatedSponsor) return NextResponse.json({ error: 'Sponsor not found' }, { status: 404 });

        return NextResponse.json(updatedSponsor);
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error("Zod Validation Error (Sponsors PATCH):", JSON.stringify(error.issues, null, 2));
            return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 });
        }
        console.error("Error updating sponsor:", error);
        return NextResponse.json({ error: 'Error updating sponsor' }, { status: 500 });
    }
}

// DELETE — Admin: delete sponsor
export async function DELETE(req: Request) {
    const session = await auth();

    if (!canEdit(session)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();
    try {
        const { id } = await req.json();
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        const deletedSponsor = await Sponsor.findByIdAndDelete(id);
        if (!deletedSponsor) return NextResponse.json({ error: 'Sponsor not found' }, { status: 404 });

        return NextResponse.json({ message: 'Sponsor deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting sponsor' }, { status: 500 });
    }
}
