import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Event from '@/models/Event';
import { auth } from '@/auth';

import { z } from 'zod';

const EventSchema = z.object({
    name: z.string().min(1, "El nombre es muy corto"),
    date: z.string(),
    location: z.string().min(1, "La ubicación es muy corta"),
    description: z.string().optional(),
    type: z.enum(['Tournament', 'Seminar', 'Meeting']).default('Tournament'),
    registrationUrl: z.string().optional().or(z.literal('')),
});

export async function GET() {
    try {
        await dbConnect();
        const events = await Event.find({}).sort({ date: 1 });
        return NextResponse.json(events);
    } catch (error: any) {
        console.error("GET /api/events error:", error);
        return NextResponse.json({ error: 'Error fetching events', details: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await auth();

    if (!session || session.user?.role === 'user') {
        return NextResponse.json({ error: 'Unauthorized: Insufficient permissions' }, { status: 403 });
    }

    await dbConnect();
    try {
        const body = await req.json();
        const validatedData = EventSchema.parse(body);
        const event = await Event.create(validatedData);
        return NextResponse.json(event, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error("Zod Validation Error (POST Event):", JSON.stringify(error.issues, null, 2));
            return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: 'Error creating event' }, { status: 400 });
    }
}

// PATCH update event (Admin/Edit only)
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

        const validatedData = EventSchema.partial().parse(data);
        const updatedEvent = await Event.findByIdAndUpdate(id, { $set: validatedData }, { new: true });
        if (!updatedEvent) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

        return NextResponse.json(updatedEvent);
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error("Zod Validation Error (PATCH Event):", JSON.stringify(error.issues, null, 2));
            return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: 'Error updating event' }, { status: 400 });
    }
}

// DELETE event (Admin/Edit only)
export async function DELETE(req: Request) {
    const session = await auth();
    if (!session || session.user?.role === 'user') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();
    try {
        const { id } = await req.json();
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        const deletedEvent = await Event.findByIdAndDelete(id);
        if (!deletedEvent) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

        return NextResponse.json({ message: 'Event deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting event' }, { status: 500 });
    }
}
