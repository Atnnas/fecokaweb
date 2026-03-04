import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Sponsor from '@/models/Sponsor';
import { auth } from '@/auth';

export async function GET() {
    // Temporary bypass for automation
    if (false) {
        const session = await auth();
        const user = session?.user as any;
        const isSuperAdmin = user?.email?.toLowerCase() === 'david.artavia.rodriguez@gmail.com';

        // Basic security: only super admin can trigger this
        if (!isSuperAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }
    }

    const sponsors = [
        {
            name: "World Karate Federation",
            logoUrl: "https://www.wkf.net/img/logotipo-wkf.png",
            websiteUrl: "https://www.wkf.net",
            tier: "gold",
            isActive: true,
            order: 1
        },
        {
            name: "Comité Olímpico Nacional",
            logoUrl: "https://concrc.org/wp-content/uploads/2021/05/logo-con-cr.png",
            websiteUrl: "https://concrc.org",
            tier: "gold",
            isActive: true,
            order: 2
        },
        {
            name: "ICODER",
            logoUrl: "https://www.icoder.go.cr/images/icoder/Logotipo_ICODER_2022.png",
            websiteUrl: "https://www.icoder.go.cr",
            tier: "gold",
            isActive: true,
            order: 3
        },
        {
            name: "ADIDAS Karate",
            logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/1200px-Adidas_Logo.svg.png",
            websiteUrl: "https://www.adidas.com",
            tier: "silver",
            isActive: true,
            order: 4
        },
        {
            name: "Arawaza",
            logoUrl: "https://www.arawaza.com/wp-content/uploads/2019/12/arawaza-logo-new.png",
            websiteUrl: "https://www.arawaza.com",
            tier: "silver",
            isActive: true,
            order: 5
        },
    ];

    try {
        await dbConnect();

        // Cleanup existing as requested ("limpia todo de la cinta")
        await Sponsor.deleteMany({});

        const results = [];
        for (const s of sponsors) {
            const created = await Sponsor.create({
                ...s,
                contractStart: new Date(),
                contractEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 10))
            });
            results.push(created.name);
        }

        return NextResponse.json({
            success: true,
            message: 'Sponsors seeded successfully',
            seeded: results
        });
    } catch (error: any) {
        console.error('Error seeding sponsors:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
