import { z } from 'zod';

export const NewsSchema = z.object({
    title: z.string().min(1, "El título es muy corto").max(200),
    content: z.string().min(1, "El contenido es muy corto"),
    category: z.string().optional(),
    images: z.array(z.string()).optional(),
    publishedAt: z.string().datetime().optional().default(() => new Date().toISOString()),
    startDate: z.string().datetime().optional().default(() => new Date().toISOString()),
    endDate: z.string().datetime().nullable().optional(),
});

export type NewsFormData = z.infer<typeof NewsSchema>;
