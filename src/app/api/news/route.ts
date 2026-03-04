import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import News from '@/models/News';
import { auth } from '@/auth';
import { canEdit } from '@/lib/auth-utils';
import { NewsSchema } from '@/lib/validations/news';
import { z } from 'zod';

export async function GET(req: Request) {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const isAdminView = searchParams.get('admin') === 'true';

    try {
        let query = {};
        if (!isAdminView) {
            const now = new Date();
            query = {
                $and: [
                    { startDate: { $lte: now } },
                    {
                        $or: [
                            { endDate: { $exists: false } },
                            { endDate: { $eq: null } },
                            { endDate: { $gte: now } }
                        ]
                    }
                ]
            };
        }
        const news = await News.find(query).sort({ publishedAt: -1 });
        return NextResponse.json(news);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching news' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await auth();

    if (!canEdit(session)) {
        return NextResponse.json({ error: 'Unauthorized: Insufficient permissions' }, { status: 403 });
    }

    await dbConnect();
    try {
        const body = await req.json();
        const validatedData = NewsSchema.parse(body);

        const newsItem = await News.create(validatedData);
        return NextResponse.json(newsItem, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error("Zod Validation Error (POST):", JSON.stringify(error.issues, null, 2));
            return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: 'Error creating news' }, { status: 400 });
    }
}

// PATCH update news (Admin/Editor only)
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

        const validatedData = NewsSchema.partial().parse(data);

        const updatedNews = await News.findByIdAndUpdate(id, { $set: validatedData }, { new: true });
        if (!updatedNews) return NextResponse.json({ error: 'News not found' }, { status: 404 });

        return NextResponse.json(updatedNews);
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error("Zod Validation Error (PATCH):", JSON.stringify(error.issues, null, 2));
            return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: 'Error updating news' }, { status: 400 });
    }
}

// DELETE news (Admin/Editor only)
export async function DELETE(req: Request) {
    const session = await auth();

    if (!canEdit(session)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();
    try {
        const { id } = await req.json();
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        const deletedNews = await News.findByIdAndDelete(id);
        if (!deletedNews) return NextResponse.json({ error: 'News not found' }, { status: 404 });

        return NextResponse.json({ message: 'News deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting news' }, { status: 500 });
    }
}
