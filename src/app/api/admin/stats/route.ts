import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import News from '@/models/News';
import Event from '@/models/Event';
import Academy from '@/models/Academy';
import User from '@/models/User';
import { auth } from '@/auth';

import Sponsor from '@/models/Sponsor';

export const dynamic = 'force-dynamic';

export async function GET() {
    const session = await auth();
    const user = session?.user as any;
    const isSuperAdmin = user?.email?.toLowerCase() === 'david.artavia.rodriguez@gmail.com';

    // Verify admin access
    if (!session || (!isSuperAdmin && user?.role !== 'admin')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        await dbConnect();

        const [newsCount, eventsCount, academiesCount, usersCount, sponsorsCount] = await Promise.all([
            News.countDocuments({}),
            Event.countDocuments({}),
            Academy.countDocuments({}),
            User.countDocuments({}),
            Sponsor.countDocuments({})
        ]);

        return NextResponse.json({
            news: newsCount,
            events: eventsCount,
            academies: academiesCount,
            users: usersCount,
            sponsors: sponsorsCount
        });
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 });
    }
}
