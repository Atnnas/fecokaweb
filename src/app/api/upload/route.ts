import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(req: Request) {
    const session = await auth();

    if (!session || session.user?.role === 'user') {
        return NextResponse.json({ error: 'Unauthorized: Insufficient permissions' }, { status: 403 });
    }

    try {
        const formData = await req.formData();
        const files = formData.getAll('files') as File[];

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
        }

        const uploadedUrls: string[] = [];
        const uploadDir = join(process.cwd(), 'public', 'uploads');

        // Ensure the upload directory exists
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (error) {
            console.error('Error creating upload directory:', error);
        }

        for (const file of files) {
            if (!file.type.startsWith('image/')) {
                continue; // Skip non-image files
            }

            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Generate unique filename using timestamp and original name
            const timestamp = Date.now();
            const sanitizedName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
            const filename = `${timestamp}-${sanitizedName}`;
            const filepath = join(uploadDir, filename);

            await writeFile(filepath, buffer);

            // The URL path visible to the client
            uploadedUrls.push(`/uploads/${filename}`);
        }

        return NextResponse.json({ urls: uploadedUrls }, { status: 201 });
    } catch (error) {
        console.error("POST /api/upload error:", error);
        return NextResponse.json({ error: 'Error processing upload' }, { status: 500 });
    }
}
