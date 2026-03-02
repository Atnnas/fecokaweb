import { MetadataRoute } from 'next'
import dbConnect from '@/lib/db'
import News from '@/models/News'
import Academy from '@/models/Academy'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://fecoka.org'

    const staticRoutes = [
        '',
        '/news',
        '/events',
        '/rankings',
        '/academies',
        '/about',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    // Vercel build phase doesn't have MONGODB_URI, return static only
    if (!process.env.MONGODB_URI) {
        return staticRoutes;
    }

    await dbConnect()

    // Fetch dynamic routes
    const [news, academies] = await Promise.all([
        News.find({}).select('_id updatedAt'),
        Academy.find({ isActive: true }).select('_id updatedAt')
    ])

    const newsRoutes = news.map((item) => ({
        url: `${baseUrl}/news/${item._id}`,
        lastModified: item.updatedAt || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }))

    const academyRoutes = academies.map((item) => ({
        url: `${baseUrl}/academies`, // Currently a single list page, but prepared for future detail pages
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }))

    return [...staticRoutes, ...newsRoutes, ...academyRoutes]
}
