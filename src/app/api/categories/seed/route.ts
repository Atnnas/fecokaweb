import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Category from '@/models/Category';
import { auth } from '@/auth';

const defaultCategories = [
    // --- KATA ---
    { name: 'Senior Male Kata', type: 'Kata', gender: 'Male', ageGroup: 'Senior', minAge: 16, maxAge: null, weightLimit: null },
    { name: 'Senior Female Kata', type: 'Kata', gender: 'Female', ageGroup: 'Senior', minAge: 16, maxAge: null, weightLimit: null },
    { name: 'U21 Male Kata', type: 'Kata', gender: 'Male', ageGroup: 'U21', minAge: 18, maxAge: 20, weightLimit: null },
    { name: 'U21 Female Kata', type: 'Kata', gender: 'Female', ageGroup: 'U21', minAge: 18, maxAge: 20, weightLimit: null },
    { name: 'Junior Male Kata', type: 'Kata', gender: 'Male', ageGroup: 'Junior', minAge: 16, maxAge: 17, weightLimit: null },
    { name: 'Junior Female Kata', type: 'Kata', gender: 'Female', ageGroup: 'Junior', minAge: 16, maxAge: 17, weightLimit: null },
    { name: 'Cadet Male Kata', type: 'Kata', gender: 'Male', ageGroup: 'Cadet', minAge: 14, maxAge: 15, weightLimit: null },
    { name: 'Cadet Female Kata', type: 'Kata', gender: 'Female', ageGroup: 'Cadet', minAge: 14, maxAge: 15, weightLimit: null },

    // --- SENIOR KUMITE ---
    { name: 'Senior Male Kumite -60kg', type: 'Kumite', gender: 'Male', ageGroup: 'Senior', minAge: 18, maxAge: null, weightLimit: '-60kg' },
    { name: 'Senior Male Kumite -67kg', type: 'Kumite', gender: 'Male', ageGroup: 'Senior', minAge: 18, maxAge: null, weightLimit: '-67kg' },
    { name: 'Senior Male Kumite -75kg', type: 'Kumite', gender: 'Male', ageGroup: 'Senior', minAge: 18, maxAge: null, weightLimit: '-75kg' },
    { name: 'Senior Male Kumite -84kg', type: 'Kumite', gender: 'Male', ageGroup: 'Senior', minAge: 18, maxAge: null, weightLimit: '-84kg' },
    { name: 'Senior Male Kumite +84kg', type: 'Kumite', gender: 'Male', ageGroup: 'Senior', minAge: 18, maxAge: null, weightLimit: '+84kg' },
    { name: 'Senior Female Kumite -50kg', type: 'Kumite', gender: 'Female', ageGroup: 'Senior', minAge: 18, maxAge: null, weightLimit: '-50kg' },
    { name: 'Senior Female Kumite -55kg', type: 'Kumite', gender: 'Female', ageGroup: 'Senior', minAge: 18, maxAge: null, weightLimit: '-55kg' },
    { name: 'Senior Female Kumite -61kg', type: 'Kumite', gender: 'Female', ageGroup: 'Senior', minAge: 18, maxAge: null, weightLimit: '-61kg' },
    { name: 'Senior Female Kumite -68kg', type: 'Kumite', gender: 'Female', ageGroup: 'Senior', minAge: 18, maxAge: null, weightLimit: '-68kg' },
    { name: 'Senior Female Kumite +68kg', type: 'Kumite', gender: 'Female', ageGroup: 'Senior', minAge: 18, maxAge: null, weightLimit: '+68kg' },

    // --- U21 KUMITE ---
    { name: 'U21 Male Kumite -60kg', type: 'Kumite', gender: 'Male', ageGroup: 'U21', minAge: 18, maxAge: 20, weightLimit: '-60kg' },
    { name: 'U21 Male Kumite -67kg', type: 'Kumite', gender: 'Male', ageGroup: 'U21', minAge: 18, maxAge: 20, weightLimit: '-67kg' },
    { name: 'U21 Male Kumite -75kg', type: 'Kumite', gender: 'Male', ageGroup: 'U21', minAge: 18, maxAge: 20, weightLimit: '-75kg' },
    { name: 'U21 Male Kumite -84kg', type: 'Kumite', gender: 'Male', ageGroup: 'U21', minAge: 18, maxAge: 20, weightLimit: '-84kg' },
    { name: 'U21 Male Kumite +84kg', type: 'Kumite', gender: 'Male', ageGroup: 'U21', minAge: 18, maxAge: 20, weightLimit: '+84kg' },
    { name: 'U21 Female Kumite -50kg', type: 'Kumite', gender: 'Female', ageGroup: 'U21', minAge: 18, maxAge: 20, weightLimit: '-50kg' },
    { name: 'U21 Female Kumite -55kg', type: 'Kumite', gender: 'Female', ageGroup: 'U21', minAge: 18, maxAge: 20, weightLimit: '-55kg' },
    { name: 'U21 Female Kumite -61kg', type: 'Kumite', gender: 'Female', ageGroup: 'U21', minAge: 18, maxAge: 20, weightLimit: '-61kg' },
    { name: 'U21 Female Kumite -68kg', type: 'Kumite', gender: 'Female', ageGroup: 'U21', minAge: 18, maxAge: 20, weightLimit: '-68kg' },
    { name: 'U21 Female Kumite +68kg', type: 'Kumite', gender: 'Female', ageGroup: 'U21', minAge: 18, maxAge: 20, weightLimit: '+68kg' },

    // --- JUNIOR KUMITE ---
    { name: 'Junior Male Kumite -55kg', type: 'Kumite', gender: 'Male', ageGroup: 'Junior', minAge: 16, maxAge: 17, weightLimit: '-55kg' },
    { name: 'Junior Male Kumite -61kg', type: 'Kumite', gender: 'Male', ageGroup: 'Junior', minAge: 16, maxAge: 17, weightLimit: '-61kg' },
    { name: 'Junior Male Kumite -68kg', type: 'Kumite', gender: 'Male', ageGroup: 'Junior', minAge: 16, maxAge: 17, weightLimit: '-68kg' },
    { name: 'Junior Male Kumite -76kg', type: 'Kumite', gender: 'Male', ageGroup: 'Junior', minAge: 16, maxAge: 17, weightLimit: '-76kg' },
    { name: 'Junior Male Kumite +76kg', type: 'Kumite', gender: 'Male', ageGroup: 'Junior', minAge: 16, maxAge: 17, weightLimit: '+76kg' },
    { name: 'Junior Female Kumite -48kg', type: 'Kumite', gender: 'Female', ageGroup: 'Junior', minAge: 16, maxAge: 17, weightLimit: '-48kg' },
    { name: 'Junior Female Kumite -53kg', type: 'Kumite', gender: 'Female', ageGroup: 'Junior', minAge: 16, maxAge: 17, weightLimit: '-53kg' },
    { name: 'Junior Female Kumite -59kg', type: 'Kumite', gender: 'Female', ageGroup: 'Junior', minAge: 16, maxAge: 17, weightLimit: '-59kg' },
    { name: 'Junior Female Kumite -66kg', type: 'Kumite', gender: 'Female', ageGroup: 'Junior', minAge: 16, maxAge: 17, weightLimit: '-66kg' },
    { name: 'Junior Female Kumite +66kg', type: 'Kumite', gender: 'Female', ageGroup: 'Junior', minAge: 16, maxAge: 17, weightLimit: '+66kg' },

    // --- CADET KUMITE ---
    { name: 'Cadet Male Kumite -52kg', type: 'Kumite', gender: 'Male', ageGroup: 'Cadet', minAge: 14, maxAge: 15, weightLimit: '-52kg' },
    { name: 'Cadet Male Kumite -57kg', type: 'Kumite', gender: 'Male', ageGroup: 'Cadet', minAge: 14, maxAge: 15, weightLimit: '-57kg' },
    { name: 'Cadet Male Kumite -63kg', type: 'Kumite', gender: 'Male', ageGroup: 'Cadet', minAge: 14, maxAge: 15, weightLimit: '-63kg' },
    { name: 'Cadet Male Kumite -70kg', type: 'Kumite', gender: 'Male', ageGroup: 'Cadet', minAge: 14, maxAge: 15, weightLimit: '-70kg' },
    { name: 'Cadet Male Kumite +70kg', type: 'Kumite', gender: 'Male', ageGroup: 'Cadet', minAge: 14, maxAge: 15, weightLimit: '+70kg' },
    { name: 'Cadet Female Kumite -47kg', type: 'Kumite', gender: 'Female', ageGroup: 'Cadet', minAge: 14, maxAge: 15, weightLimit: '-47kg' },
    { name: 'Cadet Female Kumite -54kg', type: 'Kumite', gender: 'Female', ageGroup: 'Cadet', minAge: 14, maxAge: 15, weightLimit: '-54kg' },
    { name: 'Cadet Female Kumite -61kg', type: 'Kumite', gender: 'Female', ageGroup: 'Cadet', minAge: 14, maxAge: 15, weightLimit: '-61kg' },
    { name: 'Cadet Female Kumite +61kg', type: 'Kumite', gender: 'Female', ageGroup: 'Cadet', minAge: 14, maxAge: 15, weightLimit: '+61kg' },
];

export async function POST(req: Request) {
    const session = await auth();
    // Verify admin privileges strictly
    if (!session || session.user?.role !== 'admin') {
        return NextResponse.json({ error: 'Solo administradores pueden inicializar la base de datos' }, { status: 403 });
    }

    try {
        await connectDB();

        // Count existing to prevent duplicate spam
        const count = await Category.countDocuments();
        if (count > 0) {
            return NextResponse.json({ message: 'Las categorías ya fueron inicializadas previamente.', count }, { status: 200 });
        }

        // Insert default WKF categories
        const result = await Category.insertMany(defaultCategories);

        return NextResponse.json({
            message: 'Semilla WKF ejecutada con éxito',
            inserted: result.length
        }, { status: 201 });
    } catch (error: any) {
        console.error("POST /api/categories/seed error:", error);
        return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 });
    }
}
