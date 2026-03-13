import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import Category from '@/models/Category';
import { auth } from '@/auth';
import { z } from 'zod';

const CategorySchema = z.object({
    name: z.string().min(1, 'El nombre es requerido'),
    type: z.enum(['Kata', 'Kumite']),
    gender: z.enum(['Male', 'Female', 'Mixed']),
    ageGroup: z.string().min(1, 'El grupo de edad es requerido'),
    minAge: z.number().min(0).optional().nullable(),
    maxAge: z.number().min(0).optional().nullable(),
    weightLimit: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
});

export async function GET(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type');

        const query: any = {};
        if (type) query.type = type;

        const categories = await Category.find(query).sort({ type: 1, ageGroup: 1, gender: 1, name: 1 });
        return NextResponse.json(categories);
    } catch (error) {
        console.error("GET /api/categories error:", error);
        return NextResponse.json({ error: 'Error al obtener las categorías' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session || (session.user?.role !== 'admin' && session.user?.role !== 'edit')) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    try {
        await connectDB();
        const body = await req.json();

        const validation = CategorySchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({
                error: 'Datos inválidos',
                details: validation.error.flatten().fieldErrors
            }, { status: 400 });
        }

        const newCategory = new Category(validation.data);
        await newCategory.save();

        return NextResponse.json(newCategory, { status: 201 });
    } catch (error: any) {
        console.error("POST /api/categories error:", error);
        return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    const session = await auth();
    if (!session || (session.user?.role !== 'admin' && session.user?.role !== 'edit')) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    try {
        await connectDB();
        const body = await req.json();
        const { id, ...updateData } = body;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
        }

        const validation = CategorySchema.safeParse(updateData);
        if (!validation.success) {
            return NextResponse.json({
                error: 'Datos inválidos',
                details: validation.error.flatten().fieldErrors
            }, { status: 400 });
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { $set: validation.data },
            { new: true, runValidators: true }
        );

        if (!updatedCategory) {
            return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 });
        }

        return NextResponse.json(updatedCategory);
    } catch (error: any) {
        console.error("PATCH /api/categories error:", error);
        return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') { // Only admin can delete typically, or keeping it edit too
        return NextResponse.json({ error: 'Solo administradores pueden eliminar' }, { status: 403 });
    }

    try {
        await connectDB();
        const body = await req.json();
        const { id } = body;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
        }

        const deletedCategory = await Category.findByIdAndDelete(id);

        if (!deletedCategory) {
            return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Categoría eliminada correctamente' }, { status: 200 });
    } catch (error) {
        console.error("DELETE /api/categories error:", error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
