import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { canEdit } from '@/lib/auth-utils';
import { writeFile, mkdir } from 'fs/promises';
import { join, extname } from 'path';
import { put } from '@vercel/blob';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB max per file
const ALLOWED_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.svg', '.pdf']);

export async function POST(req: Request) {
    const session = await auth();

    if (!canEdit(session)) {
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
            if (file.size > MAX_FILE_SIZE) {
                return NextResponse.json({ error: `El archivo ${file.name} excede el límite permitido de 5 MB` }, { status: 400 });
            }

            const ext = extname(file.name).toLowerCase();
            if (!ALLOWED_EXTENSIONS.has(ext)) {
                return NextResponse.json({ error: `Extensión de archivo no permitida: ${ext}` }, { status: 400 });
            }

            if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
                continue; // Skip non-image/non-pdf files
            }

            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Stored XSS prevention: Validate SVG content to block embedded script execution
            if (ext === '.svg') {
                const text = buffer.toString('utf-8');
                if (/<script[\s>]/i.test(text) || /javascript:/i.test(text) || /on\w+\s*=/i.test(text)) {
                    return NextResponse.json({ error: 'Archivos SVG con scripts embebidos no están permitidos por motivos de ciberseguridad.' }, { status: 400 });
                }
            }

            // Generate unique filename using timestamp and original name
            const timestamp = Date.now();
            const sanitizedName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
            const filename = `${timestamp}-${sanitizedName}`;
            const filepath = join(uploadDir, filename);

            // Cloud Storage (Vercel Blob) in production, local disk fallback in development
            if (process.env.BLOB_READ_WRITE_TOKEN) {
                const blob = await put(`uploads/${filename}`, buffer, {
                    access: 'public',
                    contentType: file.type || 'application/octet-stream',
                });
                uploadedUrls.push(blob.url);
            } else {
                await writeFile(filepath, buffer);
                uploadedUrls.push(`/uploads/${filename}`);
            }
        }

        return NextResponse.json({ urls: uploadedUrls }, { status: 201 });
    } catch (error) {
        console.error("POST /api/upload error:", error);
        return NextResponse.json({ error: 'Error processing upload' }, { status: 500 });
    }
}
