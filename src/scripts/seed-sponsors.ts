import dbConnect from '../lib/db';
import Sponsor from '../models/Sponsor';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

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

async function seed() {
    try {
        console.log('Connecting to database...');
        await dbConnect();

        console.log('Cleaning existing sponsors...');
        // We only clean if the user wants to "limpia todo de la cinta"
        await Sponsor.deleteMany({});

        console.log('Seeding sponsors...');
        for (const s of sponsors) {
            await Sponsor.create({
                ...s,
                contractStart: new Date(),
                contractEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 10)) // 10 years for fallback equivalents
            });
            console.log(`Inserted: ${s.name}`);
        }

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seed();
